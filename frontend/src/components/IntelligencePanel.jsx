import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BadgeCheck,
  Check,
  CircleAlert,
  CircleHelp,
  Compass,
  Cpu,
  Droplets,
  Layers,
  Mountain,
  Route,
  ShieldAlert,
  ShieldCheck,
  Sprout,
  Sun,
  Trees,
  Wheat,
} from "lucide-react";

export default function IntelligencePanel({ parcel }) {
  if (!parcel) {
    return (
      <aside className="intelligence-panel empty-panel">
        <div className="empty-icon"><Compass size={20} /></div>
        <strong>No parcel selected</strong>
        <p>Choose a parcel on the map to explore its real satellite, soil, and cadastral data across Baloda Bazar.</p>
      </aside>
    );
  }

  const isVerified = parcel.isLegallyVerified || parcel.verification === "Verified";
  const ndvi = parcel.ndvi !== undefined ? Number(parcel.ndvi).toFixed(2) : null;
  const slope = parcel.slopeDeg !== undefined ? `${parcel.slopeDeg}°` : null;
  const elevation = parcel.elevationM !== undefined ? `${parcel.elevationM} m` : null;

  return (
    <aside className="intelligence-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">BALODA BAZAR GIS INTELLIGENCE</span>
          <h2>{parcel.id}</h2>
          {parcel.khasraNo && (
            <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>
              {parcel.khasraNo} ({parcel.villageName || "Baloda Bazar"})
            </span>
          )}
        </div>
        <Link to={`/parcels/${parcel.id}`} className="subtle-icon" title="Full parcel details">
          <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="parcel-summary">
        <span>{parcel.area} <small>acres</small></span>
        <span className={`status-pill status-pill--${parcel.status}`}>
          {parcel.statusLabel || parcel.status}
        </span>
      </div>

      {/* Real Multi-Sensor Observations */}
      <section className="panel-section">
        <h3>Real Geospatial Observations</h3>

        {/* Sentinel-2 NDVI */}
        <div className="observation-row">
          <span><Layers size={13} /> Sentinel-2 NDVI</span>
          <strong>{ndvi !== null ? `${ndvi} (${parcel.cover})` : parcel.cover}</strong>
        </div>

        {/* Copernicus DEM Terrain */}
        {slope && (
          <div className="observation-row">
            <span><Mountain size={13} /> Terrain Slope & Elevation</span>
            <strong>{slope} slope · {elevation}</strong>
          </div>
        )}

        {/* SoilGrids ISRIC Properties */}
        {parcel.soilType && (
          <div className="observation-row">
            <span><Sprout size={13} /> SoilGrids Soil Profile</span>
            <strong>{parcel.soilType} {parcel.soilPH ? `· pH ${parcel.soilPH}` : ""}</strong>
          </div>
        )}

        {/* Access & Hydrology */}
        <div className="observation-row">
          <span><Route size={13} /> Road Accessibility</span>
          <strong>{parcel.roadAccess || "Accessible"}</strong>
        </div>
        <div className="observation-row">
          <span><Droplets size={13} /> River/Canal Proximity</span>
          <strong>{parcel.waterProximity || "Moderate"}</strong>
        </div>
      </section>

      {/* AI/ML Multi-Criteria Suitability Assessment */}
      <section className="panel-section assessment-section">
        <div className="section-title-row">
          <h3>AI Land Suitability</h3>
          <span className="provisional-tag" style={{ background: "#e0f2fe", color: "#0369a1" }}>
            ML RANKED
          </span>
        </div>

        {parcel.score !== null ? (
          <div className="score-row">
            <div
              className="score-ring"
              style={{
                background: `conic-gradient(#16a34a 0 ${parcel.score}%, #e2e8f0 ${parcel.score}% 100%)`,
              }}
            >
              <span>{parcel.score}</span>
            </div>
            <div>
              <strong>{parcel.suggestedUse || "Evaluated"} Suitability</strong>
              <p style={{ margin: 0 }}>
                {parcel.confidenceScore ? `${parcel.confidenceScore}% confidence score` : "Random Forest multi-criteria ranking"}
              </p>
            </div>
          </div>
        ) : (
          <p className="missing-score">
            <CircleHelp size={15} /> Processing suitability score.
          </p>
        )}

        {parcel.explanation && (
          <div style={{ background: "#f8fafc", padding: "8px 10px", borderRadius: 6, margin: "8px 0", fontSize: "0.76rem", color: "#334155", lineHeight: 1.4 }}>
            <strong style={{ display: "block", color: "#0f172a", marginBottom: 2 }}>AI Model Explanation:</strong>
            {parcel.explanation}
          </div>
        )}

        {/* Legal vs Biophysical Verification Caveat */}
        <div
          className="assessment-caveat"
          style={{
            background: isVerified ? "#f0fdf4" : "#fffbeb",
            borderColor: isVerified ? "#bbf7d0" : "#fef3c7",
            color: isVerified ? "#15803d" : "#92400e",
            padding: "8px 10px",
            borderRadius: 6,
          }}
        >
          {isVerified ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
          <div>
            <strong style={{ display: "block", fontSize: "0.78rem" }}>
              {isVerified ? "Legally Verified Government Land" : "Biophysical Fallow / Private Status"}
            </strong>
            <span style={{ fontSize: "0.72rem" }}>
              {parcel.legalStatus || (isVerified ? "Chhattisgarh BhuNaksha revenue records confirm availability." : "Observed fallow/scrub; requires landowner consent or DILRMP verification.")}
            </span>
          </div>
        </div>
      </section>

      {/* Suggested Utilization */}
      <section className="panel-section suggested-section">
        <h3>Primary Development Utilization</h3>
        {parcel.suggestedUse ? (
          <div className="recommendation-card">
            <span className="recommendation-icon" style={{ background: "#f0fdf4", color: "#16a34a" }}>
              {parcel.suggestedUse === "Solar Energy" ? <Sun size={16} /> : parcel.suggestedUse === "Agroforestry" ? <Trees size={16} /> : <Wheat size={16} />}
            </span>
            <div>
              <strong>{parcel.suggestedUse}</strong>
              <p style={{ margin: 0, fontSize: "0.78rem" }}>
                {parcel.suggestedUse === "Solar Energy"
                  ? "Flat terrain & high GHI on non-agricultural wasteland make this parcel optimal for ground-mounted solar PV."
                  : parcel.suggestedUse === "Agroforestry"
                  ? "Undulating topography & scrub cover support drought-tolerant silviculture and fruit tree orchards."
                  : "Fertile Kanhar/Dorsa black soil with gentle slope supports high crop yield under planned irrigation."}
              </p>
            </div>
          </div>
        ) : (
          <p className="missing-score">
            <CircleHelp size={15} /> Field verification pending.
          </p>
        )}
      </section>
    </aside>
  );
}
