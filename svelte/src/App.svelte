<script lang="ts">
  import * as d3 from "d3";

  // import LineChart from "./lib/LineChart.svelte";
  import ReusableLineChart from "./lib/ReusableLineChart.svelte";

  import type { WeatherData, BoundedDimensions } from "./types";

  //* Step 1a. Fetch Data
  async function promise() {
    const res = await d3.json<WeatherData[]>("/data/my_weather_data.json")
    return res;
  }

  const fetchData = promise();

  //* Step 2. Create chart dimensions
  const dimensions: BoundedDimensions = {
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
  };

  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;
</script>

{#await fetchData}
  <div>Loading data...</div>
{:then dataset} 
  <!-- <LineChart {dataset} /> -->
  <ReusableLineChart {dataset} {dimensions} metric="temperatureMax" />
{/await}