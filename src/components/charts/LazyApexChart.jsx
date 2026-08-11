import { lazy, Suspense } from "react";

const ApexChart = lazy(() => import("react-apexcharts"));

export default function LazyApexChart(props) {
  return (
    <Suspense
      fallback={
        <div
          className="flex items-center justify-center rounded-xl bg-gray-50 text-sm font-semibold text-gray-400"
          style={{ height: props.height || 220 }}
        >
          Loading chart...
        </div>
      }
    >
      <ApexChart {...props} />
    </Suspense>
  );
}
