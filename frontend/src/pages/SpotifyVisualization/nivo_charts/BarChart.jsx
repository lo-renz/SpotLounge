import React from "react";
import { ResponsiveBar } from "@nivo/bar";

const BarChart = ({ spotifyData }) => {
  const barData = spotifyData;

  const MyResponsiveBar = ({ data }) => (
    <ResponsiveBar
      data={data}
      keys={["value"]}
      indexBy="id"
      margin={{ top: 50, right: 50, bottom: 50, left: 70 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors="#1db954"
      theme={{
        axis: {
          ticks: {
            text: {
              fill: "grey",
            },
          },
          legend: {
            text: {
              fill: "grey",
            },
          },
        },
      }}
      animate={true}
      isInteractive={false}
      axisTop={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Name",
        legendPosition: "middle",
        legendOffset: 32,
        truncateTickAt: 0,
      }}
      axisRight={null}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Popularity",
        legendPosition: "middle",
        legendOffset: -40,
      }}
    />
  );

  return (
    <div className="p-6 h-96">
      <MyResponsiveBar data={barData} />
    </div>
  );
};

export default BarChart;
