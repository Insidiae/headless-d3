import { For } from "solid-js";
import * as d3 from "d3";

import type {
  WeatherData,
  BoundedDimensions,
  NumericWeatherDataMetric,
} from "./types";

function LineChart(props: {
  dataset: WeatherData[];
  dimensions: BoundedDimensions;
  metric: NumericWeatherDataMetric;
}) {
  //* Step 1b. Access Data
  const dateParser = d3.timeParse("%Y-%m-%d");
  const xAccessor = (d: WeatherData) => dateParser(d.date) as Date;
  const yAccessor = (d: WeatherData) => d[props.metric];

  //* Step 4. Create scales
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(props.dataset, xAccessor) as [Date, Date])
    .range([0, props.dimensions.boundedWidth]);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(props.dataset, yAccessor) as [number, number])
    .range([props.dimensions.boundedHeight, 0]);

  const freezingTemperaturePlacement = yScale(32);

  const lineGenerator = d3
    .line<WeatherData>()
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)));

  const xTicks = xScale.ticks();
  const yTicks = yScale.ticks();

  return (
    <div>
      {/* Step 3. Draw canvas */}
      <svg width={props.dimensions.width} height={props.dimensions.height}>
        <g
          transform={`translate(${props.dimensions.margin.left}, ${props.dimensions.margin.top})`}
        >
          <rect
            x="0"
            width={props.dimensions.boundedWidth}
            y={freezingTemperaturePlacement}
            height={
              props.dimensions.boundedHeight - freezingTemperaturePlacement
            }
            fill="hsl(180deg 44% 92%)"
          />
          {/* Step 5. Draw data */}
          <path
            d={lineGenerator(props.dataset) ?? ""}
            fill="none"
            stroke="hsl(41deg 35% 52%)"
            stroke-width={2}
          />
          {/* Step 6. Draw peripherals */}
          <g
            font-size={10}
            font-family="sans-serif"
            text-anchor="middle"
            transform={`translate(0, ${props.dimensions.boundedHeight})`}
          >
            <line stroke="black" x2={props.dimensions.boundedWidth} />
            <For each={xTicks}>
              {(tick, i) => (
                <g transform={`translate(${xScale(tick)}, 0)`}>
                  <line stroke="black" y2={6} />
                  <text y={9} dy="0.71em">
                    {d3.timeFormat("%B")(tick)}
                  </text>
                </g>
              )}
            </For>
          </g>
          <g font-size={10} font-family="sans-serif" text-anchor="end">
            <line stroke="black" y2={props.dimensions.boundedHeight} />
            <For each={yTicks}>
              {(tick, i) => (
                <g transform={`translate(0, ${yScale(tick)})`}>
                  <line stroke="black" x2={-6} />
                  <text x={-9} dy="0.32em">
                    {tick}
                  </text>
                </g>
              )}
            </For>
          </g>
        </g>
      </svg>
    </div>
  );
}

export default LineChart;
