import React, { Suspense, lazy, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

const RechartsSection = lazy(() => import("./charts/RechartsComparisonSection"));
const ApexChartsSection = lazy(() => import("./charts/ApexChartsComparisonSection"));

const chartOptions = [
  {
    id: "recharts",
    title: "Recharts",
    description: "Lightweight React-first chart rendering",
    tone: "blue",
  },
  {
    id: "apexcharts",
    title: "ApexCharts",
    description: "Richer animations and interactive chart controls",
    tone: "orange",
  },
];

function ChartFallback() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-sm font-semibold text-gray-500 shadow-sm">
      Loading chart library...
    </div>
  );
}

export default function ChartComparisonPage() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-transparent px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-4">
          <Link
            to="/admin/dashboard"
            className="rounded-xl border border-gray-100 bg-white p-2 shadow-sm transition-colors hover:bg-gray-50"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Chart Library Comparison</h1>
            <p className="text-gray-500">Select one library to load and inspect it on demand.</p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {chartOptions.map((option) => {
            const isSelected = selected === option.id;
            const selectedClass =
              option.tone === "blue"
                ? "border-blue-500 bg-blue-50 shadow-lg"
                : "border-orange-500 bg-orange-50 shadow-lg";
            const idleClass =
              option.tone === "blue"
                ? "border-gray-200 bg-white hover:border-blue-300"
                : "border-gray-200 bg-white hover:border-orange-300";
            const iconClass = option.tone === "blue" ? "text-blue-500" : "text-orange-500";

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelected(option.id)}
                className={`rounded-2xl border-2 p-4 text-left transition-all duration-300 ${
                  isSelected ? selectedClass : idleClass
                }`}
              >
                <div className="flex items-center gap-2">
                  {isSelected && <CheckCircle2 className={`h-5 w-5 ${iconClass}`} />}
                  <span className="text-lg font-bold">{option.title}</span>
                </div>
                <p className="mt-1 text-sm text-gray-500">{option.description}</p>
              </button>
            );
          })}
        </div>

        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-center text-white"
          >
            <p className="text-lg font-bold">
              {selected === "recharts" ? "Recharts" : "ApexCharts"} selected
            </p>
            <p className="text-sm opacity-90">Only the selected chart library is loaded for this screen.</p>
          </motion.div>
        )}

        <Suspense fallback={<ChartFallback />}>
          {selected === "recharts" && <RechartsSection />}
          {selected === "apexcharts" && <ApexChartsSection />}
          {!selected && (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500">
              Choose a chart library to load its demo bundle.
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}
