import React, { useRef, useEffect } from 'react';
import { select, scaleLinear, sum } from 'd3';
import { useResizeDetector } from 'react-resize-detector';

const HorizontalBarChart = ({ data }) => {
  const svgRef = useRef();
  const { width, height, ref } = useResizeDetector();

  useEffect(() => {
    if (!data || data.length === 0 || !width || !height) return;

    const svg = select(svgRef.current);
    const margin = { top: 20, right: 20, bottom: 20, left: 100 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Calculate total value for percentage
    const total = sum(data, d => d.value);

    // Dynamic margin adjustment: Find the longest label to set a sufficient left margin
    const longestLabelLength = Math.max(...data.map(d => d.label.length));
    const dynamicMarginLeft = Math.max(100, longestLabelLength * 7.5); // 7.5 is a rough estimate for font size
    const finalChartWidth = width - dynamicMarginLeft - margin.right;

    // Create scales
    const xScale = scaleLinear()
      .domain([0, 100])
      .range([0, finalChartWidth]);

    const yScale = scaleLinear()
      .domain([0, data.length])
      .range([0, chartHeight]);

    const g = svg.select('.chart-group');
    g.attr('transform', `translate(${dynamicMarginLeft}, ${margin.top})`);

    // Create or update bars
    g.selectAll('.horizontal-bar')
      .data(data)
      .join('rect')
      .attr('class', 'horizontal-bar')
      .attr('x', 0)
      .attr('y', (d, i) => yScale(i))
      .attr('width', d => xScale(d.value))
      .attr('height', yScale(1) * 0.6)
      .attr('fill', '#f0f5f4')
      .attr('stroke', 'none')
      .on('mouseover', function(event, d) {
        const percentage = d.value.toFixed(1);
        g.append('text')
          .attr('class', 'tooltip')
          .attr('x', xScale(d.value) + 5)
          .attr('y', yScale(data.indexOf(d)) + yScale(1) * 0.3)
          .attr('dominant-baseline', 'middle')
          .text(`${percentage}%`)
          .attr('fill', '#5e8d81')
          .attr('font-size', '12px')
          .attr('font-weight', 'bold');
      })
      .on('mouseout', function() {
        g.select('.tooltip').remove();
      });

    // Create or update the right border lines
    g.selectAll('.bar-border')
      .data(data)
      .join('line')
      .attr('class', 'bar-border')
      .attr('x1', d => xScale(d.value))
      .attr('x2', d => xScale(d.value))
      .attr('y1', (d, i) => yScale(i))
      .attr('y2', (d, i) => yScale(i) + yScale(1) * 0.6)
      .attr('stroke', '#5e8d81')
      .attr('stroke-width', 2);

    // Create or update labels on the left
    g.selectAll('.bar-label')
      .data(data)
      .join('text')
      .attr('class', 'bar-label')
      .attr('x', -5)
      .attr('y', (d, i) => yScale(i) + yScale(1) * 0.3)
      .attr('dominant-baseline', 'middle')
      .attr('text-anchor', 'end')
      .text(d => d.label)
      .attr('font-size', '13px')
      .attr('font-weight', 'bold')
      .attr('fill', '#5e8d81');

  }, [data, width, height]);

  return (
    <div ref={ref} style={{ width: '100%', height: '100%', minHeight: '180px' }}>
      <svg ref={svgRef} style={{ width: '100%', height: '100%' }}>
        <g className="chart-group"></g>
      </svg>
    </div>
  );
};

export default HorizontalBarChart;