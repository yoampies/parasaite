import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { data } from "./constants.js"

function ParGeoMap({geometry}) {
    const mapContainerRef = useRef(null);

    useEffect(() => {
        if(!geometry)return;

        const tooltip = d3.select("body").append("div")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background-color", "#FAFAFA")
            .style("padding", "10px")
            .style("border-radius", "10px")
            .style("font-family", "sans-serif");

        const svgContainer = d3.select(mapContainerRef.current);
        svgContainer.html("");

        const svg = svgContainer.append("svg")
             .attr("width", 800)
             .attr("height", 500)
             .style("margin-left", "60px")
             .style("margin-top", "40px");

        
        const projection = d3.geoAlbers()
             .rotate([67.5, 0])
             .fitSize([800, 500], geometry);

        const path = d3.geoPath(projection);
        
        const dataById = data.reduce((acc, d) => {
            acc[d.id] = d
            return acc;
        })

        const dom_min = d3.min(data, (d) => {
            return d.detections;
        });

        const dom_max = d3.max(data, (d) => {
            return d.detections;
        });

        const colorSequence = d3.scaleSequential([dom_min, dom_max], d3.interpolateGreens);

        svg.selectAll('path')
            .data(geometry.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('fill', (d) => {
                const stateId = d.properties.COD_ESTADO;
                const stateData = dataById[stateId];
                const detectionsValue = stateData ? stateData.detections : 0; 
                return colorSequence(detectionsValue);
            })
            .attr('stroke', '#fff')
            .on("mouseover", (event, d) => {
                const stateName = d.properties.ESTADO;
                const stateData = dataById[d.properties.COD_ESTADO];
                const detectionsValue = stateData ? stateData.detections : 'N/D';
                tooltip.style("opacity", 1)
                       .style("left", (event.pageX + 10) + "px")
                       .style("top", (event.pageY + 10) + "px")
                       .html(`
                            <div>Estado: <strong>${stateName}</strong></div>
                            <div>Detecciones: <strong>${detectionsValue}</strong></div>
                        `);
            })
            .on("mouseout", (event, d) => {
                tooltip.style("opacity", 0);
            })

    }, [geometry, data])

    return (
    <div ref={mapContainerRef} className="w-full h-[500px] text-[#101816]">

    </div>
)
}

export default ParGeoMap