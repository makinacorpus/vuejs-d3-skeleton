<template>
  <div class="dataviz-shell">
    <form class="form">
      <div>
        <label for="some-input">Some input&nbsp;: </label>
        <select
          id="some-input"
          name="some-input"
          v-model="someInput"
          @change="refresh"
        >
          <option v-for="option in someInputOptionList" :value="option.id" :key="option.id">
            {{ option.label }}
          </option>
        </select>
      </div>
      <div>
        <label for="another-input">Another input&nbsp;: </label>
        <input
          id="another-input"
          name="another-input"
          type="range" min="1" max="100"
          v-model="anotherInput"
          @change="refresh"
        />
      </div>
    </form>

    <p v-if="loading">Loading data.</p>
    <p v-else-if="error">An error appeared while loading data.</p>
    <p v-else-if="data.length == 0">There is no data available for your selection.</p>
    <svg
      v-show="data.length != 0"
      :id="svgElementId"
      :viewBox="viewBox"
    >
      <!-- If you already know some part of your SVG and
      if it don't need some complexe calculations, just write it directly ! -->
      <g class="axe-x"></g>
      <g class="axe-y"></g>
      <g class="data"></g>
    </svg>
  </div>
</template>

<style>
  .dataviz-shell {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>

<script src="./DatavizSkeleton.js"/>
