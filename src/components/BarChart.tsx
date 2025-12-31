import { useRef, useEffect } from 'react';
import { select, scaleBand, scaleLinear, max, sum, Selection } from 'd3';
import { useResizeDetector } from 'react-resize-detector';
import { IChartData } from '../types/index';

interface BarChartProps {
  data: IChartData[];
}

const BarChart = ({ data }: BarChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { width, height, ref } = useResizeDetector<HTMLDivElement>();

  useEffect(() => {
    if (!data || data.length === 0 || !width || !height || !svgRef.current) return;

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const xScale = scaleBand<string>()
      .domain(data.map(d => d.label))
      .range([0, chartWidth])
      .padding(0.1);

    const yScale = scaleLinear()
      .domain([0, max(data, d => d.value) || 0])
      .range([chartHeight, 0]);

    const svg = select(svgRef.current);
    const g = svg.select<SVGGElement>('.chart-group');
    g.attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    const renderChartElements = (selection: Selection<SVGGElement, unknown, null, undefined>) => {
      selection.selectAll<SVGRectElement, IChartData>('.bar')
        .data(data, d => d.label)
        .join(
          enter => enter.append('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale(d.label) ?? 0)
            .attr('width', xScale.bandwidth())
            .attr('fill', '#f0f5f4')
            .attr('y', chartHeight)
            .attr('height', 0)
            .call(enter => enter.transition().duration(750)
              .attr('y', d => yScale(d.value))
              .attr('height', d => chartHeight - yScale(d.value))),
          
          update => update
            .transition().duration(750)
            .attr('x', d => xScale(d.label) ?? 0)
            .attr('y', d => yScale(d.value))
            .attr('width', xScale.bandwidth())
            .attr('height', d => chartHeight - yScale(d.value)),
          
          exit => exit.remove()
        );

      selection.selectAll<SVGLineElement, IChartData>('.bar-border')
        .data(data, d => d.label)
        .join(
          enter => enter.append('line')
            .attr('class', 'bar-border')
            .attr('x1', d => xScale(d.label) ?? 0)
            .attr('x2', d => (xScale(d.label) ?? 0) + xScale.bandwidth())
            .attr('stroke', '#5e8d81')
            .attr('stroke-width', 2)
            .attr('y1', chartHeight)
            .attr('y2', chartHeight)
            .call(enter => enter.transition().duration(750)
              .attr('y1', d => yScale(d.value))
              .attr('y2', d => yScale(d.value))),
          
          update => update
            .transition().duration(750)
            .attr('x1', d => xScale(d.label) ?? 0)
            .attr('x2', d => (xScale(d.label) ?? 0) + xScale.bandwidth())
            .attr('y1', d => yScale(d.value))
            .attr('y2', d => yScale(d.value)),

          exit => exit.remove()
        );

      selection.selectAll<SVGTextElement, IChartData>('.bar-label')
        .data(data, d => d.label)
        .join('text')
        .attr('class', 'bar-label')
        .attr('x', d => (xScale(d.label) ?? 0) + xScale.bandwidth() / 2)
        .attr('y', chartHeight + 15)
        .attr('text-anchor', 'middle')
        .text(d => d.label)
        .attr('font-size', '13px')
        .attr('font-weight', 'bold')
        .attr('fill', '#5e8d81');

      const tooltip = selection.selectAll<SVGTextElement, null>('.tooltip')
        .data([null])
        .join('text')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .attr('fill', '#5e8d81')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle');

      const totalValue = sum(data, d => d.value);

      selection.selectAll<SVGRectElement, IChartData>('.bar')
        .on('mouseover', (event, d) => {
          const percentage = ((d.value / totalValue) * 100).toFixed(1);
          tooltip
            .text(`${percentage}%`)
            .attr('x', (xScale(d.label) ?? 0) + xScale.bandwidth() / 2)
            .attr('y', yScale(d.value) - 5)
            .style('opacity', 1);
        })
        .on('mouseout', () => {
          tooltip.style('opacity', 0);
        });
    };

    renderChartElements(g);

  }, [data, width, height]);

  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      <svg ref={svgRef} style={{ width: '100%', height: '100%' }}>
        <g className="chart-group"></g>
      </svg>
    </div>
  );
};

export default BarChart;