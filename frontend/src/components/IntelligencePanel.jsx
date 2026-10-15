import { ArrowUpRight, Check, CircleHelp, Compass, Droplets, Route, ShieldAlert, Sprout } from "lucide-react";
import { recommendations } from "../data/demoData";

export default function IntelligencePanel({ parcel }) {
  if (!parcel) return <aside className="intelligence-panel empty-panel"><div className="empty-icon"><Compass size={20} /></div><strong>No parcel selected</strong><p>Choose a parcel on the map to explore its available information.</p></aside>;
  const factors = [{ label: "Road access", value: parcel.roadAccess, icon: Route }, { label: "Water proximity", value: parcel.waterProximity, icon: Droplets }];
  return (
    <aside className="intelligence-panel">
      <div className="panel-heading"><div><span className="eyebrow">PARCEL INTELLIGENCE</span><h2>{parcel.id}</h2></div><button className="subtle-icon" title="Parcel information"><ArrowUpRight size={16} /></button></div>
      <div className="parcel-summary"><span>{parcel.area} <small>acres</small></span><span className={`status-pill status-pill--${parcel.status}`}>{parcel.statusLabel}</span></div>
      <section className="panel-section"><h3>Land observations</h3>
        <div className="observation-row"><span>Land-cover observation</span><strong>{parcel.cover}</strong></div>
        {factors.map(({ label, value, icon: Icon }) => <div className="observation-row" key={label}><span><Icon size={13} />{label}</span><strong>{value}</strong></div>)}
        <div className="observation-row"><span>Verification status</span><strong className="verification-value">{parcel.verification === "Verified" ? <Check size={13} /> : <CircleHelp size={13} />}{parcel.verification}</strong></div>
      </section>
      <section className="panel-section assessment-section"><div className="section-title-row"><h3>Preliminary assessment</h3><span className="provisional-tag">PROVISIONAL</span></div>
        {parcel.score !== null ? <div className="score-row"><div className="score-ring" style={{ background: `conic-gradient(#68a477 0 ${parcel.score}%, #edf2ed ${parcel.score}% 100%)` }}><span>{parcel.score}</span></div><div><strong>Indicative score</strong><p>Based on limited demonstration attributes</p></div></div> : <p className="missing-score"><CircleHelp size={15} /> Insufficient data to calculate a score.</p>}
        <div className="assessment-caveat"><ShieldAlert size={15} /><span>Not a legal availability determination. Confirm ownership, soil, access, and local constraints.</span></div>
        <p className="missing-information"><strong>Missing information</strong> Ownership record, soil test, and seasonal water validation.</p>
      </section>
      <section className="panel-section suggested-section"><h3>Suggested utilization</h3>
        {parcel.suggestedUse ? <div className="recommendation-card"><span className="recommendation-icon"><Sprout size={15} /></span><div><strong>{parcel.suggestedUse}</strong><p>{recommendations[parcel.suggestedUse]}</p></div></div> : <p className="missing-score"><CircleHelp size={15} /> No recommendation until more parcel data is available.</p>}
      </section>
    </aside>
  );
}
