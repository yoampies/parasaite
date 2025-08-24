import { useRef, useEffect } from 'react';
import { select, scaleBand, scaleLinear, max, sum } from 'd3';
import { useResizeDetector } from 'react-resize-detector';
import PropTypes from 'prop-types';

/**
 * @description Componente de gráfico de barras interactivo y responsive.
 * Utiliza D3.js para el renderizado de datos y `useResizeDetector` para
 * ajustarse automáticamente al tamaño de su contenedor.
 *
 * @param {object[]} data - Array de objetos con las propiedades `label` y `value`.
 * Ej: [{ label: 'A', value: 20 }, { label: 'B', value: 50 }]
 */
const BarChart = ({ data }) => {
  // `useRef` para referenciar el elemento SVG del DOM.
  const svgRef = useRef();
  // `useResizeDetector` para obtener las dimensiones del contenedor.
  const { width, height, ref } = useResizeDetector();

  useEffect(() => {
    // No renderiza si no hay datos o las dimensiones no están disponibles.
    if (!data || data.length === 0 || !width || !height) return;

    // 1. Configuración de dimensiones y márgenes
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // 2. Definición de escalas de D3
    const xScale = scaleBand()
      .domain(data.map(d => d.label))
      .range([0, chartWidth])
      .padding(0.1);

    const yScale = scaleLinear()
      .domain([0, max(data, d => d.value) || 0])
      .range([chartHeight, 0]);

    // 3. Selección y posicionamiento del grupo principal del gráfico.
    const svg = select(svgRef.current);
    const g = svg.select('.chart-group');
    g.attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // 4. Lógica de renderizado encapsulada en una función
    const renderChartElements = (selection) => {
      // Unir datos con las barras principales, manejando entrada, actualización y salida.
      selection.selectAll('.bar')
        .data(data, d => d.label)
        .join(
          // Entrada: Inicia las barras desde la base con altura 0 y las anima hacia arriba.
          enter => enter.append('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale(d.label))
            .attr('width', xScale.bandwidth())
            .attr('fill', '#f0f5f4')
            .attr('y', chartHeight)
            .attr('height', 0)
            .call(enter => enter.transition().duration(750)
              .attr('y', d => yScale(d.value))
              .attr('height', d => chartHeight - yScale(d.value))),
          
          // Actualización: Anima las barras existentes a sus nuevas posiciones y alturas.
          update => update
            .transition().duration(750)
            .attr('x', d => xScale(d.label))
            .attr('y', d => yScale(d.value))
            .attr('width', xScale.bandwidth())
            .attr('height', d => chartHeight - yScale(d.value)),
          
          // Salida: Elimina las barras que ya no están en los datos.
          exit => exit.remove()
        );

      // Líneas de borde superior
      selection.selectAll('.bar-border')
        .data(data, d => d.label)
        .join(
          // Entrada: Anima la línea de borde para que aparezca en la parte superior de la barra.
          enter => enter.append('line')
            .attr('class', 'bar-border')
            .attr('x1', d => xScale(d.label))
            .attr('x2', d => xScale(d.label) + xScale.bandwidth())
            .attr('stroke', '#5e8d81')
            .attr('stroke-width', 2)
            .attr('y1', chartHeight)
            .attr('y2', chartHeight)
            .call(enter => enter.transition().duration(750)
              .attr('y1', d => yScale(d.value))
              .attr('y2', d => yScale(d.value))),
          
          // Actualización: Mueve el borde a la nueva altura.
          update => update
            .transition().duration(750)
            .attr('x1', d => xScale(d.label))
            .attr('x2', d => xScale(d.label) + xScale.bandwidth())
            .attr('y1', d => yScale(d.value))
            .attr('y2', d => yScale(d.value)),

          // Salida: Elimina el borde.
          exit => exit.remove()
        );

      // Etiquetas de las barras
      selection.selectAll('.bar-label')
        .data(data, d => d.label)
        .join('text')
        .attr('class', 'bar-label')
        .attr('x', d => xScale(d.label) + xScale.bandwidth() / 2)
        .attr('y', chartHeight + 15)
        .attr('text-anchor', 'middle')
        .text(d => d.label)
        .attr('font-size', '13px')
        .attr('font-weight', 'bold')
        .attr('fill', '#5e8d81');

      // 5. Tooltip y eventos de interacción
      const tooltip = selection.selectAll('.tooltip')
        .data([null])
        .join('text')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .attr('fill', '#5e8d81')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle');

      // Calcular el valor total aquí, justo antes de usarlo.
      const totalValue = sum(data, d => d.value);

      selection.selectAll('.bar')
        .on('mouseover', (event, d) => {
          const percentage = ((d.value / totalValue) * 100).toFixed(1);
          tooltip
            .text(`${percentage}%`)
            .attr('x', xScale(d.label) + xScale.bandwidth() / 2)
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

// **Adición de PropTypes** para la validación de las props.
BarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default BarChart;