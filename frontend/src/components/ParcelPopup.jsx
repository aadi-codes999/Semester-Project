import { Link } from "react-router-dom";
import { ArrowUpRight, BadgeCheck, CheckCircle2, CircleAlert, CircleHelp, Compass, MapPin, ShieldCheck, Sun, Trees, Wheat } from "lucide-react";

export default function ParcelPopup({ parcel }) {
  if (!parcel) return null;

  const isVerified = parcel.isLegallyVerified || parcel.verification === "Verified";
  const ndviVal = parcel.ndvi !== undefined ? Number(parcel.ndvi).toFixed(2) : null;
  const slopeVal = parcel.slopeDeg !== undefined ? `${parcel.slopeDeg}°` : null;

  return (
    <div className="parcel-popup" style={{ minWidth: 260 }}>
      <div className="popup-heading">
        <div>
          <span style={{ fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase" }}>
            {parcel.khasraNo ? `${parcel.khasraNo} · ` : ""}BALODA BAZAR
          </span>
          <strong style={{ display: "block", fontSize: "1.05rem" }}>{parcel.id}</strong>
        </div>
        <span className={`status-pill status-pill--${parcel.status}`}>
          {parcel.statusLabel || parcel.status}
        </span>
      </div>

      <div className="popup-facts" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", margin: "0.4rem 0" }}>
        <span><MapPin size={13} /> {parcel.area} acres</span>
        <span>{parcel.cover}</span>
        {ndviVal && <span title="Sentinel-2 NDVI">NDVI {ndviVal}</span>}
        {slopeVal && <span title="Copernicus DEM slope">{slopeVal} slope</span>}
      </div>

      {parcel.soilType && (
        <div style={{ fontSize: "0.78rem", color: "#475569", marginBottom: "0.3rem" }}>
          <strong>Soil:</strong> {parcel.soilType} {parcel.soilPH ? `(pH ${parcel.soilPH})` : ""}
        </div>
      )}

      <div className="popup-suitability" style={{ background: "#f8fafc", padding: "0.4rem 0.6rem", borderRadius: 6, margin: "0.35rem 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#64748b" }}>
          <span>AI Suitability: <strong>{parcel.suggestedUse || "Evaluation"}</strong></span>
          {parcel.confidenceScore && <span>{parcel.confidenceScore}% conf</span>}
        </div>
        <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1e293b", marginTop: "0.15rem" }}>
          {parcel.score !== null ? `${parcel.score} / 100` : "Assessing"}
        </div>
        {parcel.explanation && (
          <p style={{ fontSize: "0.72rem", color: "#64748b", margin: "0.25rem 0 0", lineHeight: 1.3 }}>
            {parcel.explanation}
          </p>
        )}
      </div>

      {parcel.legalStatus && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.72rem", color: isVerified ? "#15803d" : "#b45309", marginBottom: "0.35rem" }}>
          {isVerified ? <ShieldCheck size={14} /> : <CircleAlert size={14} />}
          <span>{parcel.legalStatus}</span>
        </div>
      )}

      <div className="popup-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e2e8f0", paddingTop: "0.4rem" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem" }}>
          {isVerified ? <BadgeCheck size={14} color="#16a34a" /> : <CircleHelp size={14} color="#f59e0b" />}
          {isVerified ? "Govt Verified Available" : "Unverified / Private"}
        </span>
        <Link to={`/parcels/${parcel.id}`} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: "0.75rem", fontWeight: 600 }}>
          Details <ArrowUpRight size={13} />
        </Link>
      </div>
    </div>
  );
}
