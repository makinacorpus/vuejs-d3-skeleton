<template>
  <div id="ma-dataviz">
  </div>
</template>

<script>
import * as d3 from 'd3';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MaDativiz',
  data() {
    return {
      dataX: [
        'catégorie A',
        'catégorie B',
        'catégorie C',
        'catégorie D',
      ],
      /** les données pour notre dataviz, variables dans le temps */
      dataY: [5, 8, 9, 2],
      width: 300,
      height: 150,
      margin: 50,
      rectColor: '#4545FF',
      axeColor: "#888888",
      gridColor: "#AAAAAA",
    }
  },
  mounted() {
    this.buildDataviz();
  },
  methods: {
    buildDataviz() {
      const xRange = [this.margin, this.width - this.margin];
      const yType = d3.scaleLinear;
      const yDomain = [d3.min(this.dataY), d3.max(this.dataY)];
      const yRange = [this.height - this.margin, this.margin];
      const datavizElement = d3.select('#ma-dataviz');

      // Construct scales and axes.
      const xScale = d3.scaleBand(this.dataX, xRange);
      const yScale = yType(yDomain, yRange);
      const xAxis = d3.axisBottom(xScale).ticks(this.width / 80).tickSizeOuter(0);
      const yAxis = d3.axisLeft(yScale).ticks(this.height / 40);

      const svg = datavizElement.append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("viewBox", [0, 0, this.width, this.height]);

      yAxisElement = svg.append("g")
          .attr("transform", `translate(${this.margin},0)`)
          .call(yAxis)
          .call(g => g.select(".domain").remove())
          .call(g => g.selectAll(".tick line").clone()
              .attr("x2", this.width - this.margin - this.margin)
              .attr("stroke", this.gridColor));

      yAxisElement.select(".domain")
        .style('stroke', this.axeColor);

      yAxisElement.selectAll(".tick text")
        .style('fill', this.axeColor);

      svg.append("g")
          .attr("fill", this.color)
        .selectAll("rect")
        .data(this.dataX)
        .join("rect")
          .attr("x", d => xScale(d))
          .attr("width", xScale.bandwidth())
          .attr("y", (d, i) => yScale(this.dataY[i]))
          .attr("height", (d, i) => yScale(0) - yScale(this.dataY[i]))
        .append("title")
          .text((d, i) => [d, this.dataY[i]].join("\n"));

      xAxisElement = svg.append("g")
          .attr("transform", `translate(0,${this.height - this.margin})`)
          .call(xAxis);

      xAxisElement.select(".domain")
        .style('stroke', this.axeColor);

      xAxisElement.selectAll(".tick text")
        .style('fill', this.axeColor);

      xAxisElement.selectAll(".tick line")
        .attr('stroke-width', '0.5px')
        .attr('stroke', this.gridColor);
    },
  },
});
</script>
