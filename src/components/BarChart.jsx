import React, { useRef, useEffect } from 'react';
import { select, scaleBand, scaleLinear, max, sum } from 'd3';
import { useResizeDetector } from 'react-resize-detector';

const BarChart = ({ data }) => {
  const svgRef = useRef();
  const { width, height, ref } = useResizeDetector();

  useEffect(() => {
    if (!data || data.length === 0 || !width || !height) return;

    const svg = select(svgRef.current);
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Calculate the total value of all bars
    const total = sum(data, d => d.value);

    const xScale = scaleBand()
      .domain(data.map(d => d.label))
      .range([0, chartWidth])
      .padding(0.1);

    const yScale = scaleLinear()
      .domain([0, max(data, d => d.value)])
      .range([chartHeight, 0]);

    const g = svg.select('.chart-group');

    // Create or update the light grey bars
    g.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.label))
      .attr('y', d => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', d => chartHeight - yScale(d.value))
      .attr('fill', '#f0f5f4')
      .attr('stroke', 'none')
      .on('mouseover', function(event, d) {
        // Show percentage on mouseover
        const percentage = ((d.value / total) * 100).toFixed(1);
        g.append('text')
          .attr('class', 'tooltip')
          .attr('x', xScale(d.label) + xScale.bandwidth() / 2)
          .attr('y', yScale(d.value) - 5) // Position above the bar
          .attr('text-anchor', 'middle')
          .text(`${percentage}%`)
          .attr('fill', '#5e8d81')
          .attr('font-size', '12px')
          .attr('font-weight', 'bold');
      })
      .on('mouseout', function() {
        // Hide tooltip on mouseout
        g.select('.tooltip').remove();
      });

    // Create or update the top border lines
    g.selectAll('.bar-border')
      .data(data)
      .join('line')
      .attr('class', 'bar-border')
      .attr('x1', d => xScale(d.label))
      .attr('x2', d => xScale(d.label) + xScale.bandwidth())
      .attr('y1', d => yScale(d.value))
      .attr('y2', d => yScale(d.value))
      .attr('stroke', '#5e8d81')
      .attr('stroke-width', 2);

    // Create or update labels below the bars
    g.selectAll('.bar-label')
      .data(data)
      .join('text')
      .attr('class', 'bar-label')
      .attr('x', d => xScale(d.label) + xScale.bandwidth() / 2)
      .attr('y', chartHeight + 15)
      .attr('text-anchor', 'middle')
      .text(d => d.label)
      .attr('font-size', '13px')
      .attr('font-weight', 'bold')
      .attr('fill', '#5e8d81');

  }, [data, width, height]);

  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      <svg ref={svgRef} style={{ width: '100%', height: '100%' }}>
        <g className="chart-group" transform={`translate(40, 20)`}></g>
      </svg>
    </div>
  );
};

export default BarChart;