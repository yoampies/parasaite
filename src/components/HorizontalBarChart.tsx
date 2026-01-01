import { useRef, useEffect } from 'react';
import { select, scaleLinear, Selection } from 'd3';
import { useResizeDetector } from 'react-resize-detector';
import { IChartData } from '../types';
import { HorizontalBarChartProps } from '../types';

/**
 * @description Componente de gráfico de barras horizontales interactivo y responsive.
 * Optimizado para mostrar distribuciones de datos epidemiológicos.
 */
const HorizontalBarChart = ({ data }: HorizontalBarChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { width, height, ref } = useResizeDetector<HTMLDivElement>();

  useEffect(() => {
    if (!data || data.length === 0 || !width || !height || !svgRef.current) return;

    // 1. Configuración dinámica de márgenes
    const svg = select(svgRef.current);
    const margin = { top: 20, right: 20, bottom: 20, left: 100 };
    const chartHeight = height - margin.top - margin.bottom;

    const longestLabelLength = Math.max(...data.map((d) => d.label.length));
    const dynamicMarginLeft = Math.max(100, longestLabelLength * 7.5);
    const finalChartWidth = width - dynamicMarginLeft - margin.right;

    // 2. Definición de escalas
    const xScale = scaleLinear().domain([0, 100]).range([0, finalChartWidth]);

    const yScale = scaleLinear().domain([0, data.length]).range([0, chartHeight]);

    // 3. Grupo principal
    const g = svg.select<SVGGElement>('.chart-group');
    g.attr('transform', `translate(${dynamicMarginLeft}, ${margin.top})`);

    // 4. Renderizado con tipos de D3
    const renderChartElements = (selection: Selection<SVGGElement, unknown, null, undefined>) => {
      // Barras horizontales
      selection
        .selectAll<SVGRectElement, IChartData>('.horizontal-bar')
        .data(data, (d) => d.label)
        .join(
          (enter) =>
            enter
              .append('rect')
              .attr('class', 'horizontal-bar')
              .attr('x', 0)
              .attr('y', (_, i) => yScale(i))
              .attr('height', yScale(1) * 0.6)
              .attr('fill', '#f0f5f4')
              .attr('width', 0)
              .call((enter) =>
                enter
                  .transition()
                  .duration(750)
                  .attr('width', (d) => xScale(d.value))
              ),
          (update) =>
            update
              .transition()
              .duration(750)
              .attr('y', (_, i) => yScale(i))
              .attr('width', (d) => xScale(d.value)),
          (exit) => exit.remove()
        )
        .on('mouseover', function (_event, d) {
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
        .on('mouseout', () => {
          g.select('.tooltip').remove();
        });

      // Bordes (indicadores visuales de final de barra)
      selection
        .selectAll<SVGLineElement, IChartData>('.bar-border')
        .data(data, (d) => d.label)
        .join(
          (enter) =>
            enter
              .append('line')
              .attr('class', 'bar-border')
              .attr('x1', 0)
              .attr('x2', 0)
              .attr('y1', (_, i) => yScale(i))
              .attr('y2', (_, i) => yScale(i) + yScale(1) * 0.6)
              .attr('stroke', '#5e8d81')
              .attr('stroke-width', 2)
              .call((enter) =>
                enter
                  .transition()
                  .duration(750)
                  // FIX: Restamos 1px (la mitad del strokeWidth) para que la línea quede "dentro" del límite visual
                  .attr('x1', (d) => xScale(d.value) - 1)
                  .attr('x2', (d) => xScale(d.value) - 1)
              ),
          (update) =>
            update
              .transition()
              .duration(750)
              // FIX: Aplicamos el ajuste también en la actualización
              .attr('x1', (d) => xScale(d.value) - 1)
              .attr('x2', (d) => xScale(d.value) - 1)
              .attr('y1', (_, i) => yScale(i))
              .attr('y2', (_, i) => yScale(i) + yScale(1) * 0.6),
          (exit) => exit.remove()
        );

      // Etiquetas laterales (Labels)
      selection
        .selectAll<SVGTextElement, IChartData>('.bar-label')
        .data(data, (d) => d.label)
        .join('text')
        .attr('class', 'bar-label')
        .attr('x', -5)
        .attr('y', (_, i) => yScale(i) + yScale(1) * 0.3)
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'end')
        .text((d) => d.label)
        .attr('font-size', '13px')
        .attr('font-weight', 'bold')
        .attr('fill', '#5e8d81');
    };

    renderChartElements(g);
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
