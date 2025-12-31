import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { ParGeoMapProps } from "../types/geo" 
import { data } from "./constants";
import { IMapData } from "../types";

/**
 * @description Componente de mapa coroplético que visualiza detecciones por estado.
 * Implementa optimizaciones de búsqueda O(1) y manejo de eventos D3 tipados.
 */
function ParGeoMap({ geometry }: ParGeoMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!geometry || !mapContainerRef.current) return;

    // --- CONFIGURACIÓN DE TOOLTIP ---
    // Senior Note: Guardamos la referencia para poder eliminarlo en el cleanup
    const tooltip = d3.select("body").append("div")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "#FAFAFA")
      .style("padding", "10px")
      .style("border-radius", "10px")
      .style("font-family", "sans-serif")
      .style("pointer-events", "none") // Evita que el tooltip bloquee eventos del mouse
      .style("box-shadow", "0px 4px 12px rgba(0,0,0,0.1)")
      .style("z-index", "100");

    const svgContainer = d3.select(mapContainerRef.current);
    svgContainer.html(""); // Limpiar contenido previo

    const width = 800;
    const height = 500;

    // --- CREACIÓN DEL SVG ---
    const svg = svgContainer.append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`) // Hace que el mapa sea responsive
      .attr("width", "100%")
      .attr("height", "100%")
      .style("display", "block");

    const projection = d3.geoAlbers()
      .rotate([67.5, 0])
      .fitSize([width, height], geometry);

    const path = d3.geoPath(projection);

    // --- PROCESAMIENTO DE DATOS (FIX DE LÓGICA) ---
    // Senior Note: Se añade {} como valor inicial y tipado de Record para búsqueda rápida.
    const dataById = data.reduce((acc, d) => {
      acc[d.id] = d;
      return acc;
    }, {} as Record<string, IMapData>);

    const dom_min = d3.min(data, (d) => d.detections) || 0;
    const dom_max = d3.max(data, (d) => d.detections) || 1;

    const colorSequence = d3.scaleSequential([dom_min, dom_max], d3.interpolateGreens);

    // --- RENDERIZADO DE ESTADOS ---
    svg.selectAll('path')
      .data(geometry.features)
      .enter()
      .append('path')
      .attr('d', path as any)
      .attr('fill', (d) => {
        const stateId = d.properties.COD_ESTADO;
        const stateData = dataById[stateId];
        const detectionsValue = stateData ? stateData.detections : 0;
        return colorSequence(detectionsValue);
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)
      .style("cursor", "pointer")
      .on("mouseover", (event: MouseEvent, d) => {
        const stateName = d.properties.ESTADO;
        const stateData = dataById[d.properties.COD_ESTADO];
        const detectionsValue = stateData ? stateData.detections : 'N/D';

        // Efecto visual de hover
        d3.select(event.currentTarget as SVGPathElement)
          .transition()
          .duration(200)
          .attr('stroke', '#101816')
          .attr('stroke-width', 1.5);

        tooltip.style("opacity", 1)
          .html(`
            <div style="font-size: 14px;">
              <div>Estado: <strong>${stateName}</strong></div>
              <div>Detecciones: <span style="color: #2D6A4F;"><strong>${detectionsValue}</strong></span></div>
            </div>
          `);
      })
      .on("mousemove", (event: MouseEvent) => {
        tooltip
          .style("left", (event.pageX + 15) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", (event: MouseEvent) => {
        d3.select(event.currentTarget as SVGPathElement)
          .transition()
          .duration(200)
          .attr('stroke', '#fff')
          .attr('stroke-width', 0.5);

        tooltip.style("opacity", 0);
      });

    // --- CLEANUP ---
    // Senior Note: Crucial para evitar que el tooltip se quede "huérfano" al navegar a otra página.
    return () => {
      tooltip.remove();
    };

  }, [geometry]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-[500px] text-[#101816] flex items-center justify-center overflow-hidden"
    >
      {!geometry && <p className="animate-pulse">Cargando mapa...</p>}
    </div>
  );
}

export default ParGeoMap;