import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';

function LineChart({ data }) {
  const ref = useRef();
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const [passDataCount, setPassDataCount] = useState({
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

  // Responsive resize listener
  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const width = windowSize < 600 ? 450 : 900;
    const height = 500;

    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    // Add gradient background
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'chartGradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#232a34');
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#3a4250');
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#chartGradient)');

    const margin = { top: 40, right: 30, bottom: 90, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const chart = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Extract max intensity per sector
    const key_valueOfSector = {};
    for (let item of data) {
        key_valueOfSector[item.country] = item.intensity;
    }
    const dataObj = Object.entries(key_valueOfSector).map(([k, v]) => ({
      k,
      v
    }));

    const x = d3
      .scaleBand()
      .domain(dataObj.map((d) => d.k))
      .range([0, chartWidth])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(dataObj, (d) => d.v) + 10])
      .nice()
      .range([chartHeight, 0]);

    // Create line generator
    const line = d3
      .line()
      .x((d) => x(d.k) + x.bandwidth() / 2)
      .y((d) => y(d.v))
      .curve(d3.curveMonotoneX); // optional: smooth curve

    // Draw the line path with drop shadow
    defs.append('filter')
      .attr('id', 'lineShadow')
      .html('<feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#00BFFF" flood-opacity="0.4"/>' );
    chart
      .append('path')
      .datum(dataObj)
      .attr('fill', 'none')
      .attr('stroke', '#00BFFF')
      .attr('stroke-width', 3)
      .attr('filter', 'url(#lineShadow)')
      .attr('d', line);

    // Add data point circles with tooltip events
    chart
      .selectAll('circle')
      .data(dataObj)
      .enter()
      .append('circle')
      .attr('cx', (d) => x(d.k) + x.bandwidth() / 2)
      .attr('cy', (d) => y(d.v))
      .attr('r', 6)
      .attr('fill', '#1E90FF')
      .attr('class', 'chart-point')
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

    // Y Axis
    chart
      .append('g')
      .call(d3.axisLeft(y).ticks(5))
      .attr('font-size', '14px')
      .selectAll('path, line')
      .attr('stroke', '#888');

    // X Axis
    chart
      .append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '13px');

    // Axis labels
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#e0e6ed')
      .attr('font-size', '16px')
      .text('Country');
    svg.append('text')
      .attr('x', -(height / 2))
      .attr('y', 18)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .attr('fill', '#e0e6ed')
      .attr('font-size', '16px')
      .text('Intensity');
  }, [data, passDataCount, windowSize]);

  return (
    <div className="linechart-card bg-gradient-to-br from-[#232a34] to-[#3a4250] rounded-2xl shadow-xl p-6 flex flex-col items-center relative">
      <div className="w-full flex flex-col items-center mb-4">
        <h3 className="text-xl font-bold text-white mb-1">Max Intensity by Country</h3>
        <p className="text-sm text-blue-200 mb-2">Each point shows the max intensity for a country</p>
      </div>
      <div className="relative w-full flex justify-center">
        <svg ref={ref} className="linechart-svg" style={{ width: '100%', maxWidth: 900, height: 500 }}></svg>
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
            <div><b>Country:</b> {tooltip.value.k}</div>
            <div><b>Intensity:</b> {tooltip.value.v}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LineChart;
