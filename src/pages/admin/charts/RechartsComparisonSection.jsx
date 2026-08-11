import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { areaData, barData, lineData, pieData } from "./chartComparisonData";

export default function RechartsComparisonSection() {
  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 text-2xl font-bold text-blue-600">
        Recharts
        <span className="text-sm font-normal text-gray-500">React-first charts</span>
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
          <h3 className="mb-4 font-bold text-gray-900">Monthly revenue</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v / 1000000}M`} />
              <Tooltip formatter={(v) => `${v.toLocaleString()} KRW`} />
              <Line type="monotone" dataKey="value" stroke="#635bff" strokeWidth={3} dot={{ fill: "#635bff", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
          <h3 className="mb-4 font-bold text-gray-900">Revenue by product</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => `${v.toLocaleString()} KRW`} />
              <Bar dataKey="value" fill="#635bff" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
          <h3 className="mb-4 font-bold text-gray-900">Party status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} label>
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
          <h3 className="mb-4 font-bold text-gray-900">Weekly trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={areaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="users" stackId="1" stroke="#635bff" fill="#635bff" fillOpacity={0.3} />
              <Area type="monotone" dataKey="payments" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
