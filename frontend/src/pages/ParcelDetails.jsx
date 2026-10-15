import { useEffect, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, BadgeCheck, CircleHelp, ShieldAlert } from "lucide-react";
import { parcels as demoParcels } from "../data/demoData";
import { getParcelDetails } from "../services/landService";

const API_ENABLED = import.meta.env.VITE_USE_API !== "false";

export default function ParcelDetails() {
  const { id } = useParams();
  const { allParcels = [] } = useOutletContext();
  const fallbackParcel = allParcels.find((item) => item.id === id) ?? demoParcels.find((item) => item.id === id);
  const [parcel, setParcel] = useState(fallbackParcel ?? null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(API_ENABLED);

  useEffect(() => {
    setParcel(fallbackParcel ?? null);
    if (!API_ENABLED) {
      setLoading(false);
      setError("");
      return undefined;
    }
    let active = true;
    setLoading(true);
    getParcelDetails(id)
      .then((data) => {
        if (active) { setParcel(data); setError(""); }
      })
      .catch((requestError) => {
        if (active) {
          setParcel(fallbackParcel ?? null);
          setError(`${requestError.message}${fallbackParcel ? ". Showing cached parcel data instead." : ""}`);
        }
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, allParcels]);

  return (
    <main className="generic-page">
      <Link className="back-link" to="/dashboard"><ArrowLeft size={14} /> Back to dashboard</Link>
      {error && <div className="data-notice" role="status"><AlertTriangle size={14} />{error}</div>}
      {loading ? <div className="generic-card"><p className="data-message" role="status">Loading parcel details...</p></div> :
      !parcel ? <div className="generic-card"><h2>Parcel not found</h2><p>No parcel with ID {id} was found.</p></div> : <>
        <div className="page-intro"><div><span className="district-label">PARCEL DETAILS</span><h2>{parcel.id}</h2><p>{parcel.area} acres · {parcel.cover}</p></div><span className={`status-pill status-pill--${parcel.status}`}>{parcel.statusLabel}</span></div>
        <div className="detail-grid">
          <section className="generic-card"><h3>Observed characteristics</h3><dl className="detail-list"><div><dt>Land-cover observation</dt><dd>{parcel.cover}</dd></div><div><dt>Road accessibility</dt><dd>{parcel.roadAccess}</dd></div><div><dt>Water proximity</dt><dd>{parcel.waterProximity}</dd></div><div><dt>Verification status</dt><dd>{parcel.verification === "Verified" ? <BadgeCheck size={14} /> : <CircleHelp size={14} />}{parcel.verification}</dd></div></dl></section>
          <section className="generic-card"><h3>Preliminary assessment <span className="provisional-tag">PROVISIONAL</span></h3><p>{parcel.score === null ? "There is not enough demonstration data to calculate an indicative score." : `Indicative score: ${parcel.score} / 100. This is not a verified suitability determination.`}</p><div className="assessment-caveat"><ShieldAlert size={15} /><span>Demonstration data only. Confirm title, boundaries, land-use restrictions, soil, and access with appropriate local authorities before taking action.</span></div></section>
          <section className="generic-card"><h3>Suggested utilization</h3><p>{parcel.suggestedUse ?? "No recommendation until more information is available."}</p><p>Any suggested use requires ownership, environmental, engineering, and community review.</p></section>
        </div>
      </>}
    </main>
  );
}
