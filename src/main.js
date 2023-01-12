import { createApp } from 'vue'
import './style.css'
import DatavizExample from './components/DatavizExample.vue'

for (const node of document.querySelectorAll("[dataviz-example]")) {
  createApp(DatavizExample).mount(node)
}
