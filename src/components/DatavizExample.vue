<template>
  <div class="my-dataviz-shell">
    <form class="form">
      <div>
        <label for="borne">Borne&nbsp;: </label>
        <select
          id="borne"
          name="borne"
          v-model="borne"
          @change="refresh"
        >
          <option v-for="option in borneOptionList" :value="option.boucle_num" :key="option.boucle_num">
            {{ option.libelle }}
          </option>
        </select>
      </div>
      <div :id="svgElementId + '-map'" class="option-map"></div>
    </form>
    <p v-if="loading">Chargement des données.</p>
    <p v-else-if="error">Une erreur est survenue pendant le chargement des données.</p>
    <p v-else-if="data.length == 0">Aucune donnée n'est disponible pour la sélection choisie.</p>
    <svg
      v-show="data.length != 0"
      :id="svgElementId"
      :viewBox="viewBox"
    >
      <g class="days-label">
        <text
          v-for="(dayLabel, day) of dayShortLabel"
          :key="day"
          class="label"
          text-anchor="end"
          :transform="'translate(' + (padding + 4) + ',' + ((day * daySize) + padding) + ')'"
        >{{ dayLabel }}</text>
      </g>
      <g class="hours-label">
        <template v-for="(hourLabel, hour) in hoursLabel" :key="hour">
          <text
            v-if="hour % 3 == 0 && hour < 24"
            class="label"
            text-anchor="end"
            :transform="'rotate(-90)translate(-6,' + (hour * daySize + padding + 20) + ')'"
          >{{ hourLabel }}</text>
        </template>
      </g>
      <g class="data">
        <template v-for="(dayLabel, day) in dayShortLabel" :key="day">
          <template v-for="(hourLabel, hour) in hoursLabel" :key="hour">
            <rect
              v-if="hour < 24"
              :x="hour * daySize + 0.5 * daySize + padding"
              :y="(day - 1) * daySize + 0.5 * daySize + padding"
              :rx="daySize"
              :width="daySize * 0.9"
              :height="daySize * 0.9"
              :fill="rectFillValues[day][hour]"
              @mouseover="updateLegend(day, hour)"
              @mouseleave="resetLegend"
            >
            </rect>
          </template>
        </template>
      </g>
    </svg>
    <p v-html="legendText"></p>

    <p v-show="data.length != 0">
      Basé sur des données du {{ minDate }} au {{ maxDate }}
      issues <a href="https://data.nantesmetropole.fr/explore/dataset/244400404_comptages-velo-nantes-metropole/information">
      de l'open data de Nantes Métropole</a>
    </p>
  </div>
</template>

<style lang="scss">
  @import "maplibre-gl";

  .my-dataviz-shell {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    form {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      margin-bottom: 1rem
    }
    form > * {
      padding: 10px;
    }
    text.label, p {
      fill: #555555;
      font-family: 'sans-serif';
      font-size: 10px;
    }
    .option-map {
      width: 450px;
      height: 250px;
    }
  }
</style>

<script src="./DatavizExample.js"/>
