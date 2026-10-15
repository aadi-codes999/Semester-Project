import { assessmentLabels } from "../data/demoData";

const colors = { suitable: "#4d9465", assessment: "#e5ac43", water: "#5595c2", insufficient: "#929b9d", constraints: "#d66b5e" };

export default function MapLegend() {
  return <div className="map-legend" aria-label="Parcel assessment legend">{Object.entries(assessmentLabels).map(([key, label]) => <span key={key}><i style={{ backgroundColor: colors[key] }} />{label}</span>)}</div>;
}
