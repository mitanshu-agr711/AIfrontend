"use client";
import dynamic from "next/dynamic";
import "chart.js/auto";

const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
});

const data = {
  labels: ["January", "February", "March", "April", "May"],
  datasets: [
    {
      label: "GeeksforGeeks Line Chart",
      data: [65, 59, 80, 81, 56],
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
  ],
};

const LineChart = () => {
  return (
    <div className="flex  min-h-screen bg-gray-50 w-full  ">
      <div className="w-200 h-80 p-2 bg-white rounded-2xl shadow-md flex flex-col r">
        <h1 className="text-lg font-semibold mb-2 text-gray-800">
          Example 1: Line Chart
        </h1>
        <Line data={data} />
      </div>
    </div>
  );
};

export default LineChart;
