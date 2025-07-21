import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';

function BarChart({ data }) {
  const ref = useRef();
  const [WindowSize, setWindowSize] = useState(window.innerWidth);
  const [PassDataCount, setPassDataCount] = useState({
    inital: 0,
    final: 80
  });
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, value: null });

  const more = () => {
    setPassDataCount((p) => ({
      inital: p.inital < 640 ? p.inital + 81 : 645,
      final: p.final < 745 ? p.final + 81 : 745
    }));
  };

  // 🧠 Responsive resize listener
  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const width = WindowSize < 600 ? 350 : 900;
    const height = WindowSize < 600 ? 220 : 500;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const margin = { top: 40, right: 30, bottom: 90, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Gradient background
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "bar-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#00BFFF").attr("stop-opacity", 1);
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#1E90FF").attr("stop-opacity", 0.8);
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#bar-gradient)')
      .attr('rx', 18);

    const chart = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const key_valueOfSector = {};
    for (let item of data) {
      if (!key_valueOfSector[item.sector] || item.intensity > key_valueOfSector[item.sector]) {
        key_valueOfSector[item.sector] = item.intensity;
      }
    }

    const dataObj = Object.entries(key_valueOfSector).map(([k, v]) => ({ k, v }));

    const x = d3.scaleBand()
      .domain(dataObj.map(d => d.k))
      .range([0, chartWidth])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(dataObj, d => d.v) + 10])
      .nice()
      .range([chartHeight, 0]);

    // Draw bars with tooltip
    chart.selectAll("rect.bar")
      .data(dataObj)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.k))
      .attr("y", d => y(d.v))
      .attr("height", d => chartHeight - y(d.v))
      .attr("width", x.bandwidth())
      .attr("fill", "#00BFFF")
      .attr("rx", 6)
      .on("mouseover", function (event, d) {
        d3.select(this)
          .attr("fill", "orange")
          .style("stroke", "black")
          .style("stroke-width", "2px");
        setTooltip({
          visible: true,
          x: event.offsetX,
          y: event.offsetY,
          value: d
        });
      })
      .on("mousemove", function (event, d) {
        setTooltip({
          visible: true,
          x: event.offsetX,
          y: event.offsetY,
          value: d
        });
      })
      .on("mouseout", function () {
        d3.select(this)
          .attr("fill", "#00BFFF")
          .style("stroke", "none");
        setTooltip({ visible: false, x: 0, y: 0, value: null });
      });

    // Axis Y
    chart.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .attr("font-size", WindowSize < 600 ? "10px" : "14px")
      .selectAll("path, line")
      .attr("stroke", "#888");

    // Axis X
    chart.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", WindowSize < 600 ? "9px" : "13px");

    // Axis labels
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#e0e6ed')
      .attr('font-size', WindowSize < 600 ? '12px' : '16px')
      .text('Sector');
    svg.append('text')
      .attr('x', -(height / 2))
      .attr('y', 18)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .attr('fill', '#e0e6ed')
      .attr('font-size', WindowSize < 600 ? '12px' : '16px')
      .text('Intensity');
  }, [data, PassDataCount, WindowSize]);

  return (
    <div className="linechart-card bg-gradient-to-br from-[#232a34] to-[#3a4250] rounded-2xl shadow-xl p-6 flex flex-col items-center relative">
      <div className="w-full flex flex-col items-center mb-4">
        <h3 className="text-xl font-bold text-white mb-1">Max Intensity by Sector</h3>
        <p className="text-sm text-blue-200 mb-2">Each bar shows the max intensity for a sector</p>
      </div>
      <div className="relative w-full flex justify-center">
        <svg ref={ref} className="linechart-svg" style={{ width: '100%', maxWidth: 900, height: WindowSize < 600 ? 220 : 500 }}></svg>
        {tooltip.visible && tooltip.value && (
          <div
            className="chart-tooltip"
            style={{
              position: 'absolute',
              left: tooltip.x + 10,
              top: tooltip.y - 30,
              background: 'rgba(30, 41, 59, 0.95)',
              color: '#fff',
              padding: '8px 14px',
              borderRadius: '8px',
              pointerEvents: 'none',
              fontSize: '0.95rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
              zIndex: 10
            }}
          >
            <div><b>Sector:</b> {tooltip.value.k}</div>
            <div><b>Intensity:</b> {tooltip.value.v}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BarChart;
