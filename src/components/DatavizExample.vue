<template>
  <div class="dataviz-shell">
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
      <g class="hours-label"></g>
      <g class="days-label"></g>
      <g class="no-data"></g>
      <g class="data"></g>
    </svg>
    <div :id="svgElementId + '-tootlip'"></div>

    <ul v-show="data.length != 0">
      <li>Basées sur <a href="https://data.nantesmetropole.fr/explore/dataset/244400404_comptages-velo-nantes-metropole/information">des données issue de l'open data de Nantes Métropole</a></li>
      <li>Données disponibles du {{ minDate }} au {{ maxDate }}</li>
    </ul>
  </div>
</template>

<style>
  @import "maplibre-gl";

  .dataviz-shell {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
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
  text.label, #dataviz-tootlip {
    fill: #555555;
    font-family: 'sans-serif';
    font-size: 10px;
  }
  .no-data > rect {
    fill: #eaebec;
  }
  #div-tooltip {
    opacity: 0;
    background-color: white;
    border: "solid";
    border-width: 2px;
    padding: 5px;
  }
  .option-map {
    width: 450px;
    height: 250px;
  }
  /* .marker {
    width: 10px;
    height: 10px;
    background: #A9074866;
    border: solid 2px #ffffffaa;
    border-radius: 100%;
  } */
  .marker:hover {
    cursor: pointer;
  }
</style>

<script src="./DatavizExample.js"/>
