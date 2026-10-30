import { useEffect, useState } from "react";
import { AlertTriangle, FileText } from "lucide-react";
import { getReports } from "../services/reportService";

const API_ENABLED = import.meta.env.VITE_USE_API !== "false";
const fallbackReports = [
  { id: "report-001", title: "Baloda Bazar District Land Suitability Snapshot", type: "District Assessment", generatedAt: "2026-10-24", status: "Ready", summary: "Satellite NDVI and terrain analysis across Baloda Bazar district (DILRMP Code 674), identifying candidate uncultivated wastelands." },
  { id: "report-002", title: "Mahanadi & Sheonath River Catchment Drainage Review", type: "Environmental & Hydrology", generatedAt: "2026-10-20", status: "Ready", summary: "Drainage buffers and seasonal flood risk assessment for candidate solar and agroforestry parcels near Simga and Kasdol blocks." },
  { id: "report-003", title: "Chhattisgarh BhuNaksha Cadastral Availability Reconciliation", type: "Legal & Revenue Audit", generatedAt: "2026-10-18", status: "Ready", summary: "Distinguishing biophysically potentially unused scrub from legally verified Government Nazul/Gothan commons vs private fallow land." },
];

export default function Reports() {
  const [reports, setReports] = useState(fallbackReports);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(API_ENABLED);

  useEffect(() => {
    if (!API_ENABLED) return undefined;
    let active = true;
    getReports()
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("The API returned an invalid report list.");
        if (active) { setReports(data); setError(""); }
      })
      .catch((requestError) => {
        if (active) setError(`${requestError.message}. Showing demonstration reports.`);
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <main className="generic-page">
      <div className="page-intro"><div><span className="district-label">WORKSPACE</span><h2>Reports</h2><p>Browse generated summaries and preliminary review documents.</p></div></div>
      {error && <div className="data-notice" role="status"><AlertTriangle size={14} />{error}</div>}
      {loading ? <section className="generic-card"><p className="data-message" role="status">Loading reports...</p></section> :
        <section className="report-list">
          {reports.map((report) => (
            <article className="generic-card report-card" key={report.id}>
              <span className="report-icon"><FileText size={17} /></span>
              <div className="report-copy"><span className="eyebrow">{report.type}</span><h3>{report.title}</h3><p>{report.summary}</p></div>
              <div className="report-meta"><span className={`report-status report-status--${report.status.toLowerCase()}`}>{report.status}</span><small>{report.generatedAt}</small></div>
            </article>
          ))}
          {!reports.length && <div className="generic-card"><p className="data-message">No reports are available yet.</p></div>}
        </section>
      }
    </main>
  );
}
