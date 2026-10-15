import { useEffect, useState } from "react";
import { AlertTriangle, FileText } from "lucide-react";
import { getReports } from "../services/reportService";

const API_ENABLED = import.meta.env.VITE_USE_API !== "false";
const fallbackReports = [
  { id: "report-001", title: "Village land suitability snapshot", type: "Summary report", generatedAt: "2026-10-14", status: "Ready", summary: "Preliminary land suitability review for the current village portfolio." },
  { id: "report-002", title: "Water access and drainage review", type: "Environmental review", generatedAt: "2026-10-12", status: "Draft", summary: "Seasonal water patterns and drainage suitability for candidate parcels." },
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
