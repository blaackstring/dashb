import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

const HeatMap = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    const width = 800;
    const height = 500;
    const margin = { top: 60, right: 30, bottom: 90, left: 90 };

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const chart = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Group data: create a matrix of Topic vs Country with relevance value
    const filtered = data.filter(d => d.topic && d.country && d.relevance > 0);
    const topics = Array.from(new Set(filtered.map(d => d.topic)))
    const countries = Array.from(new Set(filtered.map(d => d.country)))

    const matrix = [];
    topics.forEach(topic => {
      countries.forEach(country => {
        const item = filtered.find(d => d.topic === topic && d.country === country);
        matrix.push({
          topic,
          country,
          value: item?.relevance || 0
        });
      });
    });

    const x = d3.scaleBand().domain(topics).range([0, chartWidth]).padding(0.05);
    const y = d3.scaleBand().domain(countries).range([0, chartHeight]).padding(0.05);

    const color = d3.scaleSequential()
      .interpolator(d3.interpolateOrRd)
      .domain([0, d3.max(matrix, d => d.value)]);

    chart.append("g").call(d3.axisTop(x)).selectAll("text").attr("transform", "rotate(-45)").style("text-anchor", "start");
    chart.append("g").call(d3.axisLeft(y));

    chart.selectAll()
      .data(matrix)
      .enter()
      .append("rect")
      .attr("x", d => x(d.topic))
      .attr("y", d => y(d.country))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", d => color(d.value))
      .style("stroke", "#ccc")
      .on("mouseover", function (event, d) {
        d3.select(this).style("stroke", "#000").style("stroke-width", 2);
      })
      .on("mouseout", function () {
        d3.select(this).style("stroke", "#ccc").style("stroke-width", 1);
      });

  }, [data]);

  return (
    <div className="flex justify-center mt-6 items-center flex-col">
        <div className='w-screen flex justify-center items-center text-3xl text-red-600 font-bold flex-col'>
            <span className='border-1 p-2 mt-1'>HeatMap</span>
           <span className='bg-black border-1 p-2 text-white mt-2'>
             <span  className='mr-2'>Country</span><span>/</span><span className='ml-2'>Topic</span>
         
           </span>
               <p className='bg-black border-1 p-2 text-white mt-2'>
                Values with Intensity
             </p>
        </div>
      <svg ref={ref}></svg>
    </div>
  );
};

export default HeatMap;
