import { useEffect, useState } from "react";
import { CircleHelp, SlidersHorizontal } from "lucide-react";
import { getHealth } from "../services/dashboardService";

const API_ENABLED = import.meta.env.VITE_USE_API !== "false";
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

export default function Settings() {
  const [health, setHealth] = useState(API_ENABLED ? "Checking..." : "Demo mode");

  useEffect(() => {
    if (!API_ENABLED) return undefined;
    let active = true;
    getHealth()
      .then((data) => {
        if (active) setHealth(data?.status === "ok" ? "Connected" : "Unexpected response");
      })
      .catch(() => {
        if (active) setHealth("Unavailable");
      });
    return () => { active = false; };
  }, []);

  return (
    <main className="generic-page">
      <div className="page-intro"><div><span className="district-label">WORKSPACE</span><h2>Settings</h2><p>Review data source and demonstration mode for this preview.</p></div></div>
      <section className="generic-card settings-card"><div className="settings-heading"><span className="chart-icon"><SlidersHorizontal size={17} /></span><div><h3>Data source</h3><p>Dashboard preview configuration</p></div></div>
        <div className="settings-row"><span><strong>Sample data</strong><small>Parcel geometry and assessment values are illustrative.</small></span><span className="settings-status"><i className="sample-dot" />{API_ENABLED ? "Fallback enabled" : "Active"}</span></div>
        <div className="settings-row"><span><strong>Backend API</strong><small>{API_BASE}</small></span><span className="settings-status">{API_ENABLED ? "Enabled" : "Demo mode"}</span></div>
        <div className="settings-row"><span><strong>API health</strong><small>Live check against the Flask backend.</small></span><span className="settings-status">{health}</span></div>
        <p className="settings-note"><CircleHelp size={14} /> Start the Flask API on port 5000, then run the Vite frontend. The development server proxies `/api` to the backend.</p>
      </section>
    </main>
  );
}
