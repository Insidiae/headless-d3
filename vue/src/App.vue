<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { ref } from "vue";
import * as d3 from "d3";
import type { WeatherData, BoundedDimensions } from "./types";

// import LineChart from "./components/LineChart.vue";
import ReusableLineChart from "./components/ReusableLineChart.vue";

const dataset = ref<WeatherData[] | null>(null);
d3.json<WeatherData[]>("/data/my_weather_data.json").then((res) => {
  dataset.value = res ?? null;
});

//* Step 2. Create chart dimensions
const dimensions = ref<BoundedDimensions>({
  width: window.innerWidth * 0.9,
  height: 400,
  margin: {
    top: 15,
    right: 15,
    bottom: 40,
    left: 60,
  },
  boundedWidth: 0,
  boundedHeight: 0,
});

dimensions.value.boundedWidth =
  dimensions.value.width -
  dimensions.value.margin.left -
  dimensions.value.margin.right;
dimensions.value.boundedHeight =
  dimensions.value.height -
  dimensions.value.margin.top -
  dimensions.value.margin.bottom;
</script>

<template>
  <div v-if="dataset" class="wrapper">
    <!-- <LineChart :dataset="dataset" /> -->
    <ReusableLineChart
      :dataset="dataset"
      :dimensions="dimensions"
      metric="temperatureMax"
    />
  </div>
  <div v-else>Loading data...</div>
</template>

