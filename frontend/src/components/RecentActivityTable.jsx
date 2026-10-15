import { BadgeCheck, CircleHelp } from "lucide-react";

export default function RecentActivityTable({ parcels }) {
  const recent = [...parcels].sort((a, b) => b.updated.localeCompare(a.updated)).slice(0, 5);
  return (
    <section className="activity-card">
      <div className="card-heading"><div><span className="eyebrow">FIELD UPDATES</span><h2>Recent parcel activity</h2></div><span className="table-count">{recent.length} records</span></div>
      <div className="table-scroll"><table><thead><tr><th>Parcel ID</th><th>Area</th><th>Assessment status</th><th>Verification</th><th>Last updated</th></tr></thead>
        <tbody>{recent.map((parcel) => <tr key={parcel.id}><td className="parcel-id-cell">{parcel.id}</td><td>{parcel.area} ac</td><td><span className={`status-pill status-pill--${parcel.status}`}>{parcel.statusLabel}</span></td><td><span className="table-verification">{parcel.verification === "Verified" ? <BadgeCheck size={14} /> : <CircleHelp size={14} />}{parcel.verification}</span></td><td>{new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${parcel.updated}T00:00:00`))}</td></tr>)}
          {!recent.length && <tr><td colSpan="5" className="table-empty">No parcels match the current search and filters.</td></tr>}
        </tbody></table></div>
    </section>
  );
}
