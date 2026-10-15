import { ArrowUpRight } from "lucide-react";

export default function StatCard({ title, value, note, icon: Icon, tone, trend }) {
  return (
    <article className="stat-card">
      <div className="stat-topline"><span>{title}</span><span className={`stat-icon stat-icon--${tone}`}><Icon size={17} /></span></div>
      <div className="stat-value">{value}</div>
      <div className="stat-note"><span className={`stat-trend stat-trend--${tone}`}>{trend && <ArrowUpRight size={13} />}{trend}</span><span>{note}</span></div>
    </article>
  );
}
