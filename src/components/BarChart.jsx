import React, { useRef, useEffect } from 'react';
import { select, scaleBand, scaleLinear, max, sum } from 'd3';
import { useResizeDetector } from 'react-resize-detector';

const BarChart = ({ data }) => {
  const svgRef = useRef();
  const { width, height, ref } = useResizeDetector();

  useEffect(() => {
    // 1. Configuración y validación inicial
    if (!data || data.length === 0 || !width || !height) return;

    // 2. Definir constantes para el gráfico
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const barPadding = 0.1;
    const labelSpacing = 15;
    const barFillColor = '#f0f5f4';
    const borderColor = '#5e8d81';
    const textColor = '#5e8d81';
    const tooltipColor = '#5e8d81';

    // 3. Calcular el valor total de los datos
    const total = sum(data, d => d.value);

    // 4. Configurar las escalas
    const xScale = scaleBand()
      .domain(data.map(d => d.label))
      .range([0, chartWidth])
      .padding(barPadding);

    const yScale = scaleLinear()
      .domain([0, max(data, d => d.value)])
      .range([chartHeight, 0]);

    // 5. Seleccionar el contenedor del gráfico y aplicar transformación
    const svg = select(svgRef.current);
    const g = svg.select('.chart-group');
    g.attr('transform', `translate(${margin.left}, ${margin.top})`);

    // 6. Dibujar las barras principales (color de fondo)
    g.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.label))
      .attr('y', d => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', d => chartHeight - yScale(d.value))
      .attr('fill', barFillColor)
      .attr('stroke', 'none');

    // 7. Dibujar la línea de borde superior
    g.selectAll('.bar-border')
      .data(data)
      .join('line')
      .attr('class', 'bar-border')
      .attr('x1', d => xScale(d.label))
      .attr('x2', d => xScale(d.label) + xScale.bandwidth())
      .attr('y1', d => yScale(d.value))
      .attr('y2', d => yScale(d.value))
      .attr('stroke', borderColor)
      .attr('stroke-width', 2);

    // 8. Dibujar las etiquetas de las barras
    g.selectAll('.bar-label')
      .data(data)
      .join('text')
      .attr('class', 'bar-label')
      .attr('x', d => xScale(d.label) + xScale.bandwidth() / 2)
      .attr('y', chartHeight + labelSpacing)
      .attr('text-anchor', 'middle')
      .text(d => d.label)
      .attr('font-size', '13px')
      .attr('font-weight', 'bold')
      .attr('fill', textColor);
    
    // 9. Crear un solo elemento para el tooltip
    const tooltip = g.selectAll('.tooltip')
        .data([null])
        .join('text')
        .attr('class', 'tooltip')
        .style('opacity', 0) // Ocultarlo por defecto
        .attr('fill', tooltipColor)
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle');

    // 10. Añadir interactividad (mouseover) a las barras
    g.selectAll('.bar')
      .on('mouseover', function(event, d) {
        const percentage = ((d.value / total) * 100).toFixed(1);
        tooltip
          .text(`${percentage}%`)
          .attr('x', xScale(d.label) + xScale.bandwidth() / 2)
          .attr('y', yScale(d.value) - 5)
          .style('opacity', 1); // Hacer visible el tooltip
      })
      .on('mouseout', function() {
        tooltip.style('opacity', 0); // Ocultar el tooltip
      });

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