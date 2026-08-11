import Chart from "react-apexcharts";

import { areaData, barData, lineData, pieData } from "./chartComparisonData";

export default function ApexChartsComparisonSection() {
  const lineOptions = {
    chart: { type: "line", toolbar: { show: false }, animations: { enabled: true, speed: 800 } },
    stroke: { curve: "smooth", width: 3 },
    colors: ["#635bff"],
    xaxis: { categories: lineData.map((item) => item.name) },
    yaxis: { labels: { formatter: (value) => `${value / 1000000}M` } },
    tooltip: { y: { formatter: (value) => `${value.toLocaleString()} KRW` } },
    grid: { borderColor: "#f0f0f0" },
  };

  const barOptions = {
    chart: { type: "bar", toolbar: { show: false }, animations: { enabled: true, speed: 800 } },
    colors: ["#635bff"],
    plotOptions: { bar: { borderRadius: 8, columnWidth: "60%" } },
    xaxis: { categories: barData.map((item) => item.name) },
    tooltip: { y: { formatter: (value) => `${value.toLocaleString()} KRW` } },
    grid: { borderColor: "#f0f0f0" },
  };

  const pieOptions = {
    chart: { type: "donut", animations: { enabled: true, speed: 800 } },
    colors: pieData.map((item) => item.color),
    labels: pieData.map((item) => item.name),
    legend: { position: "bottom" },
    plotOptions: { pie: { donut: { size: "60%" } } },
  };

  const areaOptions = {
    chart: { type: "area", toolbar: { show: false }, animations: { enabled: true, speed: 800 } },
    stroke: { curve: "smooth", width: 2 },
    colors: ["#635bff", "#10b981"],
    xaxis: { categories: areaData.map((item) => item.name) },
    fill: { type: "gradient", gradient: { opacityFrom: 0.4, opacityTo: 0.1 } },
    legend: { position: "top" },
    grid: { borderColor: "#f0f0f0" },
  };

  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 text-2xl font-bold text-orange-600">
        ApexCharts
        <span className="text-sm font-normal text-gray-500">Interactive chart controls</span>
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
          <h3 className="mb-4 font-bold text-gray-900">Monthly revenue</h3>
          <Chart options={lineOptions} series={[{ name: "Revenue", data: lineData.map((item) => item.value) }]} type="line" height={200} />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
          <h3 className="mb-4 font-bold text-gray-900">Revenue by product</h3>
          <Chart options={barOptions} series={[{ name: "Revenue", data: barData.map((item) => item.value) }]} type="bar" height={200} />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
          <h3 className="mb-4 font-bold text-gray-900">Party status</h3>
          <Chart options={pieOptions} series={pieData.map((item) => item.value)} type="donut" height={200} />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
          <h3 className="mb-4 font-bold text-gray-900">Weekly trend</h3>
          <Chart
            options={areaOptions}
            series={[
              { name: "Users", data: areaData.map((item) => item.users) },
              { name: "Payments", data: areaData.map((item) => item.payments) },
            ]}
            type="area"
            height={200}
          />
        </div>
      </div>
    </div>
  );
}
