import * as d3 from 'd3';
import maplibregl from 'maplibre-gl';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DatavizExample',
  data() {
    return {
      // input
      borne: 682,
      borneOptionList: [],

      // loading and error handling
      loading: true,
      error: undefined,

      // data
      data: [],

      // d3 dataviz
      svgElementId: 'dataviz-' + Math.random().toString(36).substring(2),
      padding: 40,
      daySize: 18,
      dayShortLabel: ["Lun.","Mar.","Mer.","Jeu.","Ven.","Sam.", "Dim."],
      hoursLabel: Array.from({ length: 25}, (v, i) => ('00' + i).slice(-2) + 'h'),
      legendText: '&nbsp;',
    }
  },
  computed: {
    width() { return this.padding*2 + 24 * (this.daySize);},
    height() { return this.padding + 7 * (this.daySize);},
    viewBox() { return `0 0 ${this.width} ${this.height}`},
    minDate() {
      if (this.data.length == 0) {
        return null;
      }

      return d3.min(this.data, record => record.fields.jour);
    },
    maxDate() {
      if (this.data.length == 0) {
        return null;
      }

      return d3.max(this.data, record => record.fields.jour);
    },
    heatmapData() {
      if (this.data.length == 0) {
        return [];
      }

      const groupByJourSemaine = d3.sort(
        d3.groups(this.data, record => record.fields.jour_de_la_semaine),
        ([i,]) => i
      );

      return d3.map(groupByJourSemaine, ([, data]) => {
        const ret = [];
        for (let i = 0; i < 24; i++) {
          ret.push(d3.mean(data, record => record.fields[('00' + i).slice(-2)]))
        }

        return ret;
      });
    },
    rangeColorHeatMap() {
      // C'est finalement presque le seul endroit où l'on
      // a besoin de d3 !
      return d3.scaleSequential()
        .domain([0, 100])
        .interpolator(d3.interpolatePuRd)
      ;
    },
    rectFillValues() {
      const ret = [];

      for (const day in this.dayShortLabel) {
        ret[day] = [];

        for(const hour in this.hoursLabel) {
          const value = this.heatmapValue(day, hour);
          if (!value) {
            ret[day][hour] = '#eaebec';
          } else {
            ret[day][hour] = this.rangeColorHeatMap(value);
          }
        }
      }

      return ret;
    },
  },
  mounted() {
    this.initInputOptions();
    this.initDataviz()
    this.refresh();
  },
  methods: {
    refresh() {
      this.fetchData()
      .then(() => this.refreshDataviz())
    },
    initInputOptions() {
      fetch('https://data.nantesmetropole.fr/api/v2/catalog/datasets/244400404_comptages-velo-nantes-metropole-boucles-comptage/records?limit=-1')
      .then(response => response.json())
      .then(response => {
        this.borneOptionList = [{boucle_num: undefined, libelle: "Toutes les bornes"}].concat(
          d3.sort(
            response.records.map(record => {return record.record.fields}),
            d => d.libelle
          )
        );
        this.initMap();
      })
      .catch(e => {
        this.error = true;
        console.log(e);
      })
    },
    fetchData() {
      let bornePart = this.borne ? ('&refine=boucle_num%3A' + ('0000' + this.borne).slice(-4)) : '';

      return fetch('https://data.nantesmetropole.fr/api/v2/catalog/datasets/244400404_comptages-velo-nantes-metropole/records?limit=-1&offset=0' + bornePart)
      .then(response => response.json())
      .then(response => {
        this.data = response.records.map(record => record.record)
      })
      .catch(e => {
        this.error = true;
        console.log(e);
      })
      .finally(() => {
        this.loading = false;
      })
    },
    initMap() {
      const map = new maplibregl.Map({
        container: this.svgElementId + '-map',
        style: 'https://makinamaps.makina-corpus.net/styles/bright/style.json',
        center: [-1.5638, 47.2151],
        zoom: 9,
      })

      const features = [];
      for (const borne of this.borneOptionList) {
        if (borne.geolocalisation == undefined) {
          continue;
        }

        features.push({
          type: 'Feature',
          properties: borne,
          geometry: {
            type: 'Point',
            coordinates: [borne.geolocalisation.lon, borne.geolocalisation.lat]
          }
        })
      }
      map.on('load', () => {
        map.addSource('bornes', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: features
          },
        });
        map.addLayer({
          id: 'bornes',
          type: 'symbol',
          source: 'bornes',
          type: 'circle',
          paint: {
            'circle-radius': 8,
            'circle-color': '#A90748',
            'circle-opacity': 0.4,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff',
            'circle-stroke-opacity': 0.4,
          }
        });
      });
      const popup = new maplibregl.Popup({closeButton: false, closeOnClick: false});

      map.on('mouseenter', 'bornes', (e) => {
        map.getCanvas().style.cursor = 'pointer';

        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.libelle;
        popup.setLngLat(coordinates).setHTML(description).addTo(map);
      });
      map.on('mousedown', 'bornes', (e) => {
        this.borne = e.features[0].properties.boucle_num;
        this.refresh();
      });
      map.on('mouseleave', 'bornes', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });
    },
    initDataviz() {
      // Rien à faire ici, tout est initialisé dans le template
    },
    refreshDataviz() {
      // Rien à faire ici, tout est géré avec les propriétés
      // computed et la réactivité de Vue.js
    },
    heatmapValue(day, hour) {
      if (this.heatmapData.length == 0) {
        null;
      }

      return (this.heatmapData[day] ?? [])[hour] ?? undefined;
    },
    updateLegend(day, hour) {
      const dayFormatted = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"][day];

      this.legendText = `Le ${dayFormatted}, entre ${this.hoursLabel[hour]} et ${this.hoursLabel[hour + 1]}, il passe en moyenne ${this.heatmapValue(day, hour).toFixed(2)} cyclistes`
    },
    resetLegend() {
      this.legendText = '&nbsp;';
    },
  },

});
