import * as d3 from 'd3';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DatavizSkeleton',
  props: {
    width: {
      default: 300,
      type: Number,
    },
    height: {
      default: 200,
      type: Number,
    }
  },
  data() {
    return {
      // inputs
      someInput: undefined,
      someInputOptionList: [],
      anotherInput: 10,

      // loading and error handling
      loading: true,
      error: undefined,

      // actual data for the dataviz
      data: [],

      // d3 dataviz
      svgElementId: 'dataviz-' + Math.random().toString(36).substring(2),
      padding: 40,
    }
  },
  computed: {
    viewBox() { return `0 0 ${this.width} ${this.height}`},
    dataMinValue() { return this.data.length ? d3.min(this.data) : undefined; },
    dataMaxValue() { return this.data.length ? d3.max(this.data) : undefined; },
    rangeValue() {
      return d3.scaleSequential()
        .domain(this.dataMinValue, this.dataMaxValue)
        .nice()
        .range([this.height - this.padding, this.padding])
      ;
    },
  },
  mounted() {
    this.initInputOptions();
    this.initDataviz()
    this.refresh();
  },
  methods: {
    /**
     * Refresh data and dataviz.
     *
     * This method will be launch each time an input is updated.
     * It will fetch new data according to input values and then
     * refresh the right part of the dataviz.
     */
    refresh() {
      this.fetchData()
      .then(() => this.refreshDataviz())
    },
    /**
     * Use this one if you need to fetch data from elsewhere to
     * initialize your inputs.
     */
    initInputOptions() {
      // A dumb example :
      (new Promise((resolve, reject) => {
        this.someInputOptionList = [
          {id: 1, label: 'option1'},
          {id: 2, label: 'option2'},
          {id: 3, label: 'option3'},
        ];

        resolve();
      }))
      .catch(e => {
        this.error = true
        console.log(e)
      })
    },
    /**
     * Fetch data needed to build your dataviz.
     *
     * Here call your external API to get your data.
     *
     * @returns
     */
    fetchData() {
      // A dumb example :
      return (new Promise((resolve, reject) => {
        const values = Array.from(
          {length: 4000},
          d3.randomNormal(0.5, 0.08)
        );
        const frequencies = d3.rollups(values, v => v.length, value => value.toFixed(2))

        this.data = d3.sort(frequencies, ([i,v]) => i);

        resolve();
      }))
      .catch(e => {
        this.error = true;
        console.log(e);
      })
      .finally(() => {
        this.loading = false;
      })
    },
    /**
     * Initialize the dataviz.
     *
     * Initialize here your dataviz with all
     * the parts that won't move with data.
     */
    initDataviz() {
      // For example, build your axes here
    },
    /**
     * Refresh the data dependent part of the dataviz.
     */
    refreshDataviz() {
      d3.select(`#${this.svgElementId} .data`)

      // ...
    },
  },
});
