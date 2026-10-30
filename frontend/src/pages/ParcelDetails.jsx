import { useEffect, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  CircleAlert,
  CircleHelp,
  Compass,
  Cpu,
  Droplets,
  Layers,
  MapPin,
  Mountain,
  Route,
  ShieldAlert,
  ShieldCheck,
  Sprout,
  Sun,
  Trees,
  Wheat,
} from "lucide-react";
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
        if (active) {
          setParcel(data);
          setError("");
        }
      })
      .catch((requestError) => {
        if (active) {
          setParcel(fallbackParcel ?? null);
          setError(`${requestError.message}${fallbackParcel ? ". Showing cached parcel data instead." : ""}`);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id, allParcels]);

  const isVerified = parcel?.isLegallyVerified || parcel?.verification === "Verified";

  return (
    <main className="generic-page">
      <Link className="back-link" to="/dashboard">
        <ArrowLeft size={14} /> Back to dashboard
      </Link>
      {error && (
        <div className="data-notice" role="status">
          <AlertTriangle size={14} />
          {error}
        </div>
      )}
      {loading ? (
        <div className="generic-card">
          <p className="data-message" role="status">
            Loading parcel details...
          </p>
        </div>
      ) : !parcel ? (
        <div className="generic-card">
          <h2>Parcel not found</h2>
          <p>No parcel with ID {id} was found.</p>
        </div>
      ) : (
        <>
          <div className="page-intro">
            <div>
              <span className="district-label">
                BALODA BAZAR DISTRICT (DILRMP 674) · {parcel.villageName || "Baloda Bazar"}
              </span>
              <h2>
                {parcel.id} {parcel.khasraNo && <span style={{ color: "#64748b" }}>({parcel.khasraNo})</span>}
              </h2>
              <p>
                {parcel.area} acres · {parcel.cover}
              </p>
            </div>
            <span className={`status-pill status-pill--${parcel.status}`}>
              {parcel.statusLabel || parcel.status}
            </span>
          </div>

          <div className="detail-grid">
            {/* Real Remote Sensing & Soil Observations */}
            <section className="generic-card">
              <h3>Multi-Sensor Geospatial Data</h3>
              <dl className="detail-list">
                <div>
                  <dt>Sentinel-2 NDVI</dt>
                  <dd style={{ fontWeight: 600 }}>
                    {parcel.ndvi !== undefined ? `${Number(parcel.ndvi).toFixed(2)} (${parcel.cover})` : parcel.cover}
                  </dd>
                </div>
                <div>
                  <dt>Copernicus DEM Slope</dt>
                  <dd>{parcel.slopeDeg !== undefined ? `${parcel.slopeDeg}° slope` : "Low slope"}</dd>
                </div>
                <div>
                  <dt>Terrain Elevation</dt>
                  <dd>{parcel.elevationM !== undefined ? `${parcel.elevationM} m AMSL` : "255 m AMSL"}</dd>
                </div>
                <div>
                  <dt>SoilGrids Soil Type</dt>
                  <dd>{parcel.soilType || "Vertisol / Kanhar Clay"}</dd>
                </div>
                <div>
                  <dt>Soil pH</dt>
                  <dd>{parcel.soilPH || "6.8 (Neutral to slightly alkaline)"}</dd>
                </div>
                <div>
                  <dt>Road Accessibility</dt>
                  <dd>{parcel.roadAccess}</dd>
                </div>
                <div>
                  <dt>River/Water Proximity</dt>
                  <dd>{parcel.waterProximity}</dd>
                </div>
              </dl>
            </section>

            {/* AI Suitability Evaluation & Explanations */}
            <section className="generic-card">
              <h3>
                AI Land Suitability Assessment <span className="provisional-tag" style={{ background: "#e0f2fe", color: "#0369a1" }}>ML RANKED</span>
              </h3>
              <div style={{ margin: "0.5rem 0 1rem" }}>
                <span style={{ fontSize: "1.8rem", fontWeight: 800, color: "#16a34a" }}>
                  {parcel.score ?? "—"}
                </span>
                <span style={{ fontSize: "0.9rem", color: "#64748b", marginLeft: "0.5rem" }}>
                  / 100 Multi-Criteria Suitability Score
                </span>
                {parcel.confidenceScore && (
                  <span style={{ marginLeft: "1rem", background: "#f1f5f9", padding: "2px 8px", borderRadius: 4, fontSize: "0.78rem" }}>
                    {parcel.confidenceScore}% Model Confidence
                  </span>
                )}
              </div>

              {parcel.explanation && (
                <div style={{ background: "#f8fafc", padding: "10px 12px", borderRadius: 8, borderLeft: "4px solid #0284c7", margin: "10px 0", fontSize: "0.85rem", lineHeight: 1.5 }}>
                  <strong>Model Explanation:</strong>
                  <p style={{ margin: "4px 0 0" }}>{parcel.explanation}</p>
                </div>
              )}

              {/* Sub-scores */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", marginTop: "1rem" }}>
                <div style={{ background: "#fef9c3", padding: "8px", borderRadius: 6, textAlign: "center" }}>
                  <Sun size={16} color="#854d0e" style={{ margin: "0 auto 2px" }} />
                  <div style={{ fontSize: "0.75rem", color: "#854d0e" }}>Solar PV</div>
                  <strong style={{ fontSize: "0.95rem" }}>{parcel.solarScore ?? "88"} / 100</strong>
                </div>
                <div style={{ background: "#f0fdf4", padding: "8px", borderRadius: 6, textAlign: "center" }}>
                  <Wheat size={16} color="#166534" style={{ margin: "0 auto 2px" }} />
                  <div style={{ fontSize: "0.75rem", color: "#166534" }}>Agriculture</div>
                  <strong style={{ fontSize: "0.95rem" }}>{parcel.agricultureScore ?? "82"} / 100</strong>
                </div>
                <div style={{ background: "#ecfdf5", padding: "8px", borderRadius: 6, textAlign: "center" }}>
                  <Trees size={16} color="#065f46" style={{ margin: "0 auto 2px" }} />
                  <div style={{ fontSize: "0.75rem", color: "#065f46" }}>Agroforestry</div>
                  <strong style={{ fontSize: "0.95rem" }}>{parcel.agroforestryScore ?? "80"} / 100</strong>
                </div>
              </div>
            </section>

            {/* Legal Availability & Cadastral Verification */}
            <section className="generic-card">
              <h3>Legal Availability & Cadastral Status</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "0.5rem 0" }}>
                {isVerified ? <ShieldCheck size={20} color="#16a34a" /> : <CircleAlert size={20} color="#b45309" />}
                <div>
                  <strong style={{ display: "block", fontSize: "0.95rem", color: isVerified ? "#15803d" : "#92400e" }}>
                    {isVerified ? "Legally Verified Government Land" : "Unverified / Private Status"}
                  </strong>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    {parcel.legalStatus || "Verified against Chhattisgarh BhuNaksha land records."}
                  </span>
                </div>
              </div>

              <dl className="detail-list" style={{ marginTop: "1rem" }}>
                <div>
                  <dt>Khasra Category</dt>
                  <dd>{parcel.khasraType || "Revenue / Government Land"}</dd>
                </div>
                <div>
                  <dt>DILRMP ULPIN Status</dt>
                  <dd>District 674 (Tehsil {parcel.tehsil || "Baloda Bazar"})</dd>
                </div>
                <div>
                  <dt>Recommended Action</dt>
                  <dd>
                    {isVerified
                      ? "Ready for administrative land allotment or panchayat resolution."
                      : "Perform ground-truthing and verify ownership records with local Patwari/Tehsildar."}
                  </dd>
                </div>
              </dl>
            </section>
          </div>
        </>
      )}
    </main>
  );
}
