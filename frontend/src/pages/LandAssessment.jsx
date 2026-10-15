import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { AlertTriangle, ClipboardCheck } from "lucide-react";
import { getAssessments } from "../services/assessmentService";

const API_ENABLED = import.meta.env.VITE_USE_API !== "false";

function fromParcels(parcels) {
  return parcels.map((parcel) => ({
    parcelId: parcel.id,
    villageId: parcel.villageId,
    status: parcel.status,
    statusLabel: parcel.statusLabel,
    verification: parcel.verification,
    score: parcel.score,
    updated: parcel.updated,
  }));
}

export default function LandAssessment() {
  const { parcels, selectedVillage } = useOutletContext();
  const [assessments, setAssessments] = useState(() => fromParcels(parcels));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(API_ENABLED);
  const visibleAssessments = useMemo(() => assessments.filter((assessment) => assessment.villageId === selectedVillage), [assessments, selectedVillage]);

  useEffect(() => {
    if (!API_ENABLED) {
      setAssessments(fromParcels(parcels));
      return undefined;
    }
    let active = true;
    setLoading(true);
    getAssessments(selectedVillage)
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("The API returned an invalid assessment list.");
        if (active) { setAssessments(data); setError(""); }
      })
      .catch((requestError) => {
        if (active) {
          setAssessments(fromParcels(parcels));
          setError(`${requestError.message}. Showing parcel assessment data instead.`);
        }
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [parcels, selectedVillage]);

  return (
    <main className="generic-page">
      <div className="page-intro"><div><span className="district-label">FIELD REVIEW</span><h2>Land assessment</h2><p>Preliminary parcel scores and verification status for the selected village.</p></div><span className="sample-badge"><span className="sample-dot" /> PROVISIONAL</span></div>
      {error && <div className="data-notice" role="status"><AlertTriangle size={14} />{error}</div>}
      <section className="generic-card">
        <div className="data-toolbar"><span className="data-count"><ClipboardCheck size={14} /> {visibleAssessments.length} assessments</span><span className="provisional-tag">NOT A VERIFIED DETERMINATION</span></div>
        {loading ? <p className="data-message" role="status">Loading assessments...</p> :
          <div className="table-scroll"><table><thead><tr><th>Parcel ID</th><th>Status</th><th>Indicative score</th><th>Verification</th><th>Last updated</th></tr></thead>
            <tbody>
              {visibleAssessments.map((assessment) => <tr key={assessment.parcelId}>
                <td className="parcel-id-cell">{assessment.parcelId}</td>
                <td><span className={`status-pill status-pill--${assessment.status}`}>{assessment.statusLabel}</span></td>
                <td>{assessment.score === null ? "Insufficient data" : `${assessment.score} / 100`}</td>
                <td>{assessment.verification}</td><td>{assessment.updated}</td>
              </tr>)}
              {!visibleAssessments.length && <tr><td colSpan="5" className="table-empty">No assessment records are available for this village.</td></tr>}
            </tbody>
          </table></div>
        }
      </section>
      <p className="data-disclaimer">All scores are illustrative and preliminary. Confirm land title, boundaries, restrictions, soil, water, and access through appropriate local review.</p>
    </main>
  );
}
