import { createResource, Show } from "solid-js";
import * as d3 from "d3";

// import LineChart from "./LineChart";
import ReusableLineChart from "./ReusableLineChart";

import type { Component } from "solid-js";
import type { WeatherData, BoundedDimensions } from "./types";

const App: Component = () => {
  //* Step 1a. Fetch Data
  async function fetchData() {
    return (await d3.json<WeatherData[]>(
      "/data/my_weather_data.json"
    )) as WeatherData[];
  }
  const [dataset] = createResource(fetchData);

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

  return (
    <Show when={dataset()} fallback={<div>Loading data...</div>}>
      <div class="wrapper">
        {/* <LineChart dataset={dataset() ?? []} /> */}
        <ReusableLineChart
          dataset={dataset() ?? []}
          dimensions={dimensions}
          metric="temperatureMax"
        />
      </div>
    </Show>
  );
};

export default App;

