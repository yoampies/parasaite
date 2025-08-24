import { useRef, useEffect } from 'react';
// Importa las utilidades de D3 necesarias.
import { select, scaleLinear, sum } from 'd3';
// Importa el hook para hacer el componente responsive.
import { useResizeDetector } from 'react-resize-detector';
import PropTypes from 'prop-types';

/**
 * @description Componente de gráfico de barras horizontales interactivo y responsive.
 * Utiliza D3.js para el renderizado de datos y `useResizeDetector` para
 * ajustarse automáticamente al tamaño de su contenedor.
 * @param {object[]} data - Los datos para el gráfico, un array de objetos
 * con `label` y `value`.
 */
const HorizontalBarChart = ({ data }) => {
  // `useRef` para referenciar el elemento SVG del DOM.
  const svgRef = useRef();
  // `useResizeDetector` para obtener las dimensiones del contenedor.
  const { width, height, ref } = useResizeDetector();

  useEffect(() => {
    // Si no hay datos o el tamaño del contenedor no está disponible, no hacemos nada.
    if (!data || data.length === 0 || !width || !height) return;

    // 1. Configuración del gráfico
    const svg = select(svgRef.current);
    const margin = { top: 20, right: 20, bottom: 20, left: 100 };
    const chartHeight = height - margin.top - margin.bottom;

    // Ajusta dinámicamente el margen izquierdo para etiquetas largas.
    const longestLabelLength = Math.max(...data.map(d => d.label.length));
    const dynamicMarginLeft = Math.max(100, longestLabelLength * 7.5);
    const finalChartWidth = width - dynamicMarginLeft - margin.right;

    // 2. Definición de escalas
    const xScale = scaleLinear()
      .domain([0, 100])
      .range([0, finalChartWidth]);

    const yScale = scaleLinear()
      .domain([0, data.length])
      .range([0, chartHeight]);

    // 3. Selección y posicionamiento del grupo principal del gráfico.
    const g = svg.select('.chart-group');
    g.attr('transform', `translate(${dynamicMarginLeft}, ${margin.top})`);

    // 4. Renderizado y actualización de elementos del gráfico
    const renderChartElements = (selection) => {
      // Las barras principales
      selection.selectAll('.horizontal-bar')
        .data(data, d => d.label)
        .join(
          enter => enter.append('rect')
            .attr('class', 'horizontal-bar')
            .attr('x', 0)
            .attr('y', (d, i) => yScale(i))
            .attr('height', yScale(1) * 0.6)
            .attr('fill', '#f0f5f4')
            .attr('width', 0)
            .call(enter => enter.transition().duration(750)
              .attr('width', d => xScale(d.value))),
          update => update.transition().duration(750)
            .attr('y', (d, i) => yScale(i))
            .attr('width', d => xScale(d.value)),
          exit => exit.remove()
        )
        .on('mouseover', function (event, d) {
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

      // Los bordes finales de las barras
      selection.selectAll('.bar-border')
        .data(data, d => d.label)
        .join(
          enter => enter.append('line')
            .attr('class', 'bar-border')
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', (d, i) => yScale(i))
            .attr('y2', (d, i) => yScale(i) + yScale(1) * 0.6)
            .attr('stroke', '#5e8d81')
            .attr('stroke-width', 2)
            .call(enter => enter.transition().duration(750)
              .attr('x1', d => xScale(d.value))
              .attr('x2', d => xScale(d.value))),
          update => update.transition().duration(750)
            .attr('x1', d => xScale(d.value))
            .attr('x2', d => xScale(d.value))
            .attr('y1', (d, i) => yScale(i))
            .attr('y2', (d, i) => yScale(i) + yScale(1) * 0.6),
          exit => exit.remove()
        );

      // Las etiquetas de las barras
      selection.selectAll('.bar-label')
        .data(data, d => d.label)
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
    };
    
    // Ejecuta la función de renderizado en el grupo principal.
    renderChartElements(g);

  }, [data, width, height]);

  // El componente JSX que renderiza el contenedor y el SVG.
  return (
    <div ref={ref} style={{ width: '100%', height: '100%', minHeight: '180px' }}>
      <svg ref={svgRef} style={{ width: '100%', height: '100%' }}>
        <g className="chart-group"></g>
      </svg>
    </div>
  );
};

// **Adición de PropTypes** para la validación de las props.
HorizontalBarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default HorizontalBarChart;