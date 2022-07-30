import * as React from "react";
import * as d3 from "d3";

import type {
  BoundedDimensions,
  NumericWeatherDataMetric,
  WeatherData,
} from "./types";

function LineChart({
  dataset,
  dimensions,
  metric,
}: {
  dataset: WeatherData[];
  dimensions: BoundedDimensions;
  metric: NumericWeatherDataMetric;
}) {
  //* Step 1b. Access Data
  const dateParser = d3.timeParse("%Y-%m-%d");
  const xAccessor = (d: WeatherData) => dateParser(d.date) as Date;
  const yAccessor = (d: WeatherData) => d[metric];

  //* Step 4. Create scales
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, xAccessor) as [Date, Date])
    .range([0, dimensions.boundedWidth]);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor) as [number, number])
    .range([dimensions.boundedHeight, 0]);

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
      <svg width={dimensions.width} height={dimensions.height}>
        <g
          transform={`translate(${dimensions.margin.left}, ${dimensions.margin.top})`}
        >
          <rect
            x="0"
            width={dimensions.boundedWidth}
            y={freezingTemperaturePlacement}
            height={dimensions.boundedHeight - freezingTemperaturePlacement}
            fill="hsl(180deg 44% 92%)"
          />
          {/* Step 5. Draw data */}
          <path
            d={lineGenerator(dataset) ?? ""}
            fill="none"
            stroke="hsl(41deg 35% 52%)"
            strokeWidth={2}
          />
          {/* Step 6. Draw peripherals */}
          <g
            fontSize={10}
            fontFamily="sans-serif"
            textAnchor="middle"
            transform={`translate(0, ${dimensions.boundedHeight})`}
          >
            <line stroke="black" x2={dimensions.boundedWidth} />
            {xTicks.map((tick, i) => (
              <g key={i} transform={`translate(${xScale(tick)}, 0)`}>
                <line stroke="black" y2={6} />
                <text y={9} dy="0.71em">
                  {d3.timeFormat("%B")(tick)}
                </text>
              </g>
            ))}
          </g>
          <g fontSize={10} fontFamily="sans-serif" textAnchor="end">
            <line stroke="black" y2={dimensions.boundedHeight} />
            {yTicks.map((tick, i) => (
              <g key={i} transform={`translate(0, ${yScale(tick)})`}>
                <line stroke="black" x2={-6} />
                <text x={-9} dy="0.32em">
                  {tick}
                </text>
              </g>
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}

export default LineChart;
