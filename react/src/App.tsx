import * as React from "react";
import * as d3 from "d3";

import ReusableLineChart from "./ReusableLineChart";

import type { WeatherData, BoundedDimensions } from "./types";

function App() {
  const [dataset, setDataset] = React.useState<WeatherData[] | null>(null);

  React.useEffect(() => {
    //* Step 1a. Fetch Data
    const abortController = new AbortController();
    d3.json<WeatherData[]>("/data/my_weather_data.json", {
      signal: abortController.signal,
    }).then((data) => setDataset(data ?? null));

    return () => {
      abortController.abort();
    };
  }, []);

  if (!dataset) {
    return <div>Loading data...</div>;
  }

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
    <div className="wrapper">
      {/* <LineChart dataset={dataset} /> */}
      <ReusableLineChart
        dataset={dataset}
        dimensions={dimensions}
        metric="temperatureMax"
      />
    </div>
  );
}

export default App;

