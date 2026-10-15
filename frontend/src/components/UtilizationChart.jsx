import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function UtilizationChart({ parcels }) {
  const types = ["Agriculture", "Plantation", "Rainwater harvesting", "Community facilities"];
  const data = types.map((name) => ({ name, count: parcels.filter((parcel) => parcel.suggestedUse === name).length })).filter((item) => item.count > 0);
  return <div className="utilization-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} layout="vertical" margin={{ top: 2, right: 15, left: 2, bottom: 0 }}><CartesianGrid horizontal={false} stroke="#edf0ed" /><XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: "#87918a" }} axisLine={false} tickLine={false} /><YAxis dataKey="name" type="category" width={126} tick={{ fontSize: 10, fill: "#59655d" }} axisLine={false} tickLine={false} /><Tooltip formatter={(value) => [`${value} parcels`, "Considered"]} /><Bar dataKey="count" fill="#39764c" radius={[0, 4, 4, 0]} barSize={12} /></BarChart></ResponsiveContainer></div>;
}
