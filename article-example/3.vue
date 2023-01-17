<template>
  <div id="ma-dataviz">
    <svg
      :viewBox="viewBox"
      :width="width"
      :height="height"
    >
      <g class="axis-y"></g>
      <g class="axis-x"></g>
      <g class="data" :fill="color">
        <rect
          v-for="(category, i) in dataX" :key="i"
          :x="xScale(category)"
          :width="xScale.bandwidth()"
          :y="yScale(dataY[i])"
          :height="yScale(0) - yScale(dataY[i])"
          :title="[category, this.dataY[i]].join('\n')"
        >
        </rect>
      </g>
    </svg>
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
  computed: {
    viewBox() { return `[0, 0, ${this.width}, ${this.height}]`; },
    xRange() { return [this.margin, this.width - this.margin]; },
    yDomain() { return [d3.min(this.dataY), d3.max(this.dataY)]; },
    yRange() { return [this.height - this.margin, this.margin]; },
    xScale() { return d3.scaleBand(this.dataX, this.xRange); },
    yScale() { return d3.scaleLinear(yDomain, this.yRange); },
    xAxis() { return d3.axisBottom(this.xScale).ticks(this.width / 80).tickSizeOuter(0); },
    yAxis() { return d3.axisLeft(this.yScale).ticks(this.height / 40); },
  },
  mounted() {
    this.initDataviz()
    this.refreshDataviz();
  },
  methods: {
    initDataviz() {
      yAxisElement = d3.select('#ma-dataviz .axis-y')
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
    },
    refreshDataviz() {
      d3.select('#ma-dataviz .axis-x')
        .attr("transform", `translate(0,${this.height - this.margin})`)
        .call(xAxis);
    },
  },
});
</script>
