import { useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { ArrowUpRight, MapPinned } from "lucide-react";

export default function LandParcels() {
  const { parcels, search, villages, selectedVillage } = useOutletContext();
  const [statusFilter, setStatusFilter] = useState("all");
  const village = villages.find((item) => item.id === selectedVillage);
  const visibleParcels = useMemo(() => parcels.filter((parcel) => (
    parcel.id.toLowerCase().includes(search.trim().toLowerCase()) &&
    (statusFilter === "all" || parcel.status === statusFilter)
  )), [parcels, search, statusFilter]);

  return (
    <main className="generic-page">
      <div className="page-intro">
        <div>
          <span className="district-label">{village?.district} district <i /> {village?.name} village</span>
          <h2>Land parcels</h2>
          <p>Review parcel observations and preliminary assessment status.</p>
        </div>
        <span className="sample-badge"><span className="sample-dot" /> DEMONSTRATION DATA</span>
      </div>
      <section className="generic-card">
        <div className="data-toolbar">
          <span className="data-count"><MapPinned size={14} /> {visibleParcels.length} of {parcels.length} parcels</span>
          <label className="data-filter">Assessment
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">All statuses</option>
              <option value="suitable">Potentially suitable</option>
              <option value="assessment">Needs assessment</option>
              <option value="water">Water-related</option>
              <option value="insufficient">Insufficient data</option>
              <option value="constraints">Review constraints</option>
            </select>
          </label>
        </div>
        <div className="table-scroll"><table><thead><tr><th>Parcel ID</th><th>Area</th><th>Land cover</th><th>Assessment</th><th>Verification</th><th>Suggested use</th><th /></tr></thead>
          <tbody>
            {visibleParcels.map((parcel) => (
              <tr key={parcel.id}>
                <td className="parcel-id-cell">{parcel.id}</td><td>{parcel.area} ac</td><td>{parcel.cover}</td>
                <td><span className={`status-pill status-pill--${parcel.status}`}>{parcel.statusLabel}</span></td>
                <td>{parcel.verification}</td><td>{parcel.suggestedUse ?? "Not available"}</td>
                <td><Link className="table-link" to={`/parcels/${encodeURIComponent(parcel.id)}`} aria-label={`View ${parcel.id}`}><ArrowUpRight size={14} /></Link></td>
              </tr>
            ))}
            {!visibleParcels.length && <tr><td colSpan="7" className="table-empty">No parcels match the current search and filters.</td></tr>}
          </tbody>
        </table></div>
      </section>
    </main>
  );
}
