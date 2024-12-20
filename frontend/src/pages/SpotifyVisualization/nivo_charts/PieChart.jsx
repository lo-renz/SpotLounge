import React from "react";
import { ResponsivePie } from "@nivo/pie";

const PieChart = ({ spotifyData }) => {
  const pieData = spotifyData;

  const MyResponsivePie = ({ data }) => [
    <ResponsivePie
      data={data}
      key=""
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#FFF"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      theme={{
        tooltip: {
          container: {
            background: "#333",
          },
        },
        labels: {
          text: {
            fill: "#aaa",
            hover: {
              fill: "#fff",
            },
          },
        },
      }}
    />,
  ];

  return (
    <div className="h-600">
      <MyResponsivePie data={pieData} />
    </div>
  );
};

export default PieChart;
