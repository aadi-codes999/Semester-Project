import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { AlertTriangle, Sprout } from "lucide-react";
import { getRecommendations } from "../services/recommendationService";

const API_ENABLED = import.meta.env.VITE_USE_API !== "false";

const fallbackSummaries = {
  "Solar Energy": "Flat topography (<2.5° slope) and high solar irradiance (5.42 kWh/m²/day) on uncultivated wasteland indicate excellent ground-mounted solar PV potential.",
  Agriculture: "Fertile Kanhar/Dorsa black soil and gentle slope support high agricultural productivity with planned irrigation.",
  Agroforestry: "Undulating terrain and scrub cover are optimal for drought-hardy silviculture, fruit tree planting, and community commons.",
  "Rainwater harvesting": "Review local drainage buffers and seasonal water flow before planning.",
  "Community facilities": "Consider only after access, ownership, and Gram Panchayat consultation.",
};

export default function Recommendations() {
  const { parcels, selectedVillage } = useOutletContext();
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(API_ENABLED);

  useEffect(() => {
    if (!API_ENABLED) {
      setRecommendations([]);
      return undefined;
    }
    let active = true;
    setLoading(true);
    getRecommendations(selectedVillage)
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("The API returned an invalid recommendation list.");
        if (active) { setRecommendations(data); setError(""); }
      })
      .catch((requestError) => {
        if (active) {
          setRecommendations([]);
          setError(`${requestError.message}. Showing recommendations derived from parcel data.`);
        }
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [selectedVillage]);

  const visibleParcels = useMemo(() => parcels.filter((parcel) => parcel.villageId === selectedVillage), [parcels, selectedVillage]);
  const parcelIds = new Set(visibleParcels.map((parcel) => parcel.id));
  const visibleRecommendations = recommendations.length
    ? recommendations.filter((recommendation) => parcelIds.has(recommendation.parcelId) && recommendation.title)
    : visibleParcels.filter((parcel) => parcel.suggestedUse).map((parcel) => ({
      id: `fallback-${parcel.id}`,
      parcelId: parcel.id,
      title: parcel.suggestedUse,
      category: parcel.suggestedUse,
      summary: fallbackSummaries[parcel.suggestedUse] ?? "Assess the parcel using local field checks.",
      priority: parcel.status === "suitable" ? "High" : "Medium",
    }));

  return (
    <main className="generic-page">
      <div className="page-intro"><div><span className="district-label">EARLY-USE OPTIONS</span><h2>Recommendations</h2><p>Review preliminary utilization options for parcels in the selected village.</p></div><span className="sample-badge"><span className="sample-dot" /> FIELD VALIDATION REQUIRED</span></div>
      {error && <div className="data-notice" role="status"><AlertTriangle size={14} />{error}</div>}
      {loading ? <section className="generic-card"><p className="data-message" role="status">Loading recommendations...</p></section> :
        <section className="recommendation-grid">
          {visibleRecommendations.map((recommendation) => (
            <article className="generic-card recommendation-card" key={recommendation.id}>
              <div className="recommendation-heading"><span className="chart-icon"><Sprout size={16} /></span><span className={`priority-tag priority-tag--${recommendation.priority.toLowerCase()}`}>{recommendation.priority} priority</span></div>
              <span className="eyebrow">{recommendation.category}</span>
              <h3>{recommendation.title}</h3>
              <p>{recommendation.summary}</p>
              <span className="recommendation-parcel">Parcel <strong>{recommendation.parcelId}</strong></span>
            </article>
          ))}
          {!visibleRecommendations.length && <div className="generic-card"><p className="data-message">No recommendations are available for this village.</p></div>}
        </section>
      }
      <p className="data-disclaimer">Recommendations are exploratory only and are not land-use approvals. Obtain ownership, environmental, engineering, and community review before acting.</p>
    </main>
  );
}
