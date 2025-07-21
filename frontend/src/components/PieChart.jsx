import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';

function PieChart({ data }) {
  const ref = useRef();
  const [WindowSize, setWindowSize] = useState(window.innerWidth);
  const [PassDataCount, setPassDataCount] = useState({
    inital: 0,
    final: 1000
  });
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, value: null });

  const more = () => {
    setPassDataCount((p) => ({
      inital: p.inital < 640 ? p.inital + 81 : 645,
      final: p.final < 745 ? p.final + 81 : 745
    }));
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const width = WindowSize < 600 ? 350 : 500;
    const height = WindowSize < 600 ? 220 : 400;
    const radius = Math.min(width, height) / 2 - 40;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    // Gradient background
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'pie-gradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#232a34');
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#3a4250');
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#pie-gradient)');

    const chart = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Fix: Use topic as key, likelihood as value
    const key_valueOfSector = {};
    for (let item of data) {
      if (item.topic && (!key_valueOfSector[item.topic] || item.likelihood > key_valueOfSector[item.topic])) {
        key_valueOfSector[item.topic] = item.likelihood;
      }
    }
    const dataObj = Object.entries(key_valueOfSector)
      .map(([k, v]) => ({ k, v }));

    const pie = d3.pie()
      .value(d => d.v)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    const color = d3.scaleOrdinal()
      .domain(dataObj.map(d => d.k))
      .range(d3.schemeCategory10);

    chart.selectAll("path")
      .data(pie(dataObj))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.k))
      .attr("stroke", "#fff")
      .attr("stroke-width", "2px")
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("d", d3.arc().innerRadius(0).outerRadius(radius + 10));
        setTooltip({
          visible: true,
          x: event.offsetX,
          y: event.offsetY,
          value: d.data
        });
      })
      .on("mousemove", function (event, d) {
        setTooltip({
          visible: true,
          x: event.offsetX,
          y: event.offsetY,
          value: d.data
        });
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .transition()
          .duration(300)
          .attr("d", arc);
        setTooltip({ visible: false, x: 0, y: 0, value: null });
      });

    chart.selectAll("text")
      .data(pie(dataObj))
      .enter()
      .append("text")
      .text(d => d.data.k)
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .style("text-anchor", "middle")
      .style("font-size", WindowSize < 600 ? "9px" : "12px")
      .style("fill", "#fff");
  }, [data, PassDataCount, WindowSize]);

  return (
    <div className="linechart-card bg-gradient-to-br from-[#232a34] to-[#3a4250] rounded-2xl shadow-xl p-6 flex flex-col items-center relative">
      <div className="w-full flex flex-col items-center mb-4">
        <h3 className="text-xl font-bold text-white mb-1">Likelihood by Topic (Pie)</h3>
        <p className="text-sm text-blue-200 mb-2">Each slice shows the max likelihood for a topic</p>
      </div>
      <div className="relative w-full flex justify-center">
        <svg ref={ref} className="linechart-svg" style={{ width: '100%', maxWidth: 500, height: WindowSize < 600 ? 220 : 400 }}></svg>
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
            <div><b>Topic:</b> {tooltip.value.k}</div>
            <div><b>Likelihood:</b> {tooltip.value.v}</div>
          </div>
        )}
      </div>
      <div className='mt-4 flex gap-4 justify-center'>
        <button
          type='button'
          onClick={more}
          className='bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-xl shadow-md hover:scale-105 transition-transform'
        >
          More
        </button>
        <button
          type='button'
          onClick={() => setPassDataCount({ inital: 0, final: 80 })}
          className='bg-black text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:scale-105 transition-transform'
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default PieChart;
