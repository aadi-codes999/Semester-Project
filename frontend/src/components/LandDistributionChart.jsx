import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const colors = { suitable: "#4d9465", assessment: "#e5ac43", water: "#5595c2", insufficient: "#929b9d", constraints: "#d66b5e" };
const names = { suitable: "Potentially suitable", assessment: "Needs assessment", water: "Water-related", insufficient: "Insufficient data", constraints: "Review constraints" };

export default function LandDistributionChart({ parcels }) {
  const data = Object.keys(colors).map((key) => ({ key, name: names[key], value: parcels.filter((parcel) => parcel.status === key).length })).filter((item) => item.value);
  return (
    <div className="distribution-content">
      <div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={42} outerRadius={61} paddingAngle={3} stroke="none">{data.map((item) => <Cell key={item.key} fill={colors[item.key]} />)}</Pie><Tooltip formatter={(value, name) => [`${value} parcels`, name]} /></PieChart></ResponsiveContainer><div className="donut-center"><strong>{parcels.length}</strong><span>parcels</span></div></div>
      <div className="distribution-legend">{data.map((item) => <div key={item.key}><i style={{ background: colors[item.key] }} /><span>{item.name}</span><strong>{item.value}</strong></div>)}</div>
    </div>
  );
}
