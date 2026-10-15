import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronDown, MapPin, Search, UserRound } from "lucide-react";
import { getAuthUser, logout } from "../services/authService";

export default function Navbar({ villages, selectedVillage, onVillageChange, search, onSearchChange }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const user = getAuthUser();

  function handleSignOut() {
    logout();
    navigate("/login", { replace: true });
  }
  return (
    <header className="topbar">
      <div className="topbar-title"><div className="breadcrumb"><span>Workspace</span><span className="crumb-separator">/</span><strong>Overview</strong></div><h1>Village land intelligence</h1></div>
      <div className="topbar-tools">
        <label className="search-box"><Search size={16} /><input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search parcel ID..." aria-label="Search parcels by ID" /><kbd>Ctrl K</kbd></label>
        <label className="village-select"><MapPin size={15} /><select value={selectedVillage} onChange={(event) => onVillageChange(event.target.value)} aria-label="Select village">{villages.map((village) => <option key={village.id} value={village.id}>{village.name}</option>)}</select><ChevronDown size={14} /></label>
        <button className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /><i /></button>
        <div className="profile-wrap"><button className="profile-button" onClick={() => setProfileOpen(!profileOpen)} aria-expanded={profileOpen}><span className="avatar"><UserRound size={16} /></span><span className="profile-name">{user?.email ?? "Admin"}</span><ChevronDown size={14} /></button>
          {profileOpen && <div className="profile-menu"><strong>{user?.role ?? "Village Administrator"}</strong><span>{user?.email ?? "Demo workspace"}</span><button onClick={handleSignOut}>Sign out</button></div>}
        </div>
      </div>
    </header>
  );
}
