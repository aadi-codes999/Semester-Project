import { Link } from "react-router-dom";
import { ArrowUpRight, BadgeCheck, CircleHelp, MapPin } from "lucide-react";

export default function ParcelPopup({ parcel }) {
  if (!parcel) return null;
  return (
    <div className="parcel-popup">
      <div className="popup-heading"><div><span>SELECTED PARCEL</span><strong>{parcel.id}</strong></div><span className={`status-pill status-pill--${parcel.status}`}>{parcel.statusLabel}</span></div>
      <div className="popup-facts"><span><MapPin size={14} />{parcel.area} acres</span><span>{parcel.cover}</span></div>
      <div className="popup-suitability"><span>Preliminary suitability</span><strong>{parcel.score !== null ? `${parcel.score} / 100 · provisional` : "Not enough data"}</strong></div>
      <div className="popup-footer"><span>{parcel.verification === "Verified" ? <BadgeCheck size={14} /> : <CircleHelp size={14} />}{parcel.verification}</span><Link to={`/parcels/${parcel.id}`}>View details <ArrowUpRight size={13} /></Link></div>
    </div>
  );
}
