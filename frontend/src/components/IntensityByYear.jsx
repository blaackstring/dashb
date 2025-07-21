import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';

const IntensityByYearChart = ({ data }) => {
  const ref = useRef();
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, value: null });

  useEffect(() => {
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const width = windowSize < 600 ? 350 : 800;
    const height = windowSize < 600 ? 220 : 400;
    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    svg.attr('width', width).attr('height', height);

    // Gradient background
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'year-gradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#232a34');
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#3a4250');
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#year-gradient)');

    const chart = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Prepare Data: Sum intensity by year
    const filtered = data.filter(d => d.end_year && d.intensity );
    const yearMap = d3.rollup(
      filtered,
      v => d3.sum(v, d => d.intensity),
      d => d.end_year
    );
    const yearData = Array.from(yearMap, ([end_year, intensity]) => ({ end_year, intensity }))
      .sort((a, b) => a.end_year - b.end_year);

    // Scales
    const x = d3.scaleLinear()
      .domain(d3.extent(yearData, d => d.end_year))
      .range([0, chartWidth]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(yearData, d => d.intensity)])
      .nice()
      .range([chartHeight, 0]);

    // Axis
    chart.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x).tickFormat(d3.format('d')))
      .selectAll('text')
      .style('font-size', windowSize < 600 ? '10px' : '13px');

    chart.append('g')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('font-size', windowSize < 600 ? '10px' : '13px');

    // Line
    const line = d3.line()
      .x(d => x(d.end_year))
      .y(d => y(d.intensity))
      .curve(d3.curveMonotoneX);

    chart.append('path')
      .datum(yearData)
      .attr('fill', 'none')
      .attr('stroke', '#00BFFF')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Circles at points with tooltip
    chart.selectAll('circle')
      .data(yearData)
      .enter()
      .append('circle')
      .attr('cx', d => x(d.end_year))
      .attr('cy', d => y(d.intensity))
      .attr('r', 6)
      .attr('fill', '#1E90FF')
      .on('mouseover', function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 10)
          .attr('fill', 'orange');
        setTooltip({
          visible: true,
          x: event.offsetX,
          y: event.offsetY,
          value: d
        });
      })
      .on('mousemove', function (event, d) {
        setTooltip({
          visible: true,
          x: event.offsetX,
          y: event.offsetY,
          value: d
        });
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(300)
          .attr('r', 6)
          .attr('fill', '#1E90FF');
        setTooltip({ visible: false, x: 0, y: 0, value: null });
      });

    // Axis labels
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#e0e6ed')
      .attr('font-size', windowSize < 600 ? '12px' : '16px')
      .text('End Year');
    svg.append('text')
      .attr('x', -(height / 2))
      .attr('y', 18)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .attr('fill', '#e0e6ed')
      .attr('font-size', windowSize < 600 ? '12px' : '16px')
      .text('Intensity');
  }, [data, windowSize]);

  return (
    <div className="linechart-card bg-gradient-to-br from-[#232a34] to-[#3a4250] rounded-2xl shadow-xl p-6 flex flex-col items-center relative">
      <div className="w-full flex flex-col items-center mb-4">
        <h3 className="text-xl font-bold text-white mb-1">Intensity Sum by End Year</h3>
        <p className="text-sm text-blue-200 mb-2">Each point shows the sum of intensity for a year</p>
      </div>
      <div className="relative w-full flex justify-center">
        <svg ref={ref} className="linechart-svg" style={{ width: '100%', maxWidth: 800, height: windowSize < 600 ? 220 : 400 }}></svg>
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
            <div><b>Year:</b> {tooltip.value.end_year}</div>
            <div><b>Intensity:</b> {tooltip.value.intensity}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntensityByYearChart;
