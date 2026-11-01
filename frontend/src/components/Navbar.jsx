import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, ChevronDown, MapPin, Search, UserRound, X } from "lucide-react";
import { getAuthUser, logout } from "../services/authService";

export default function Navbar({ villages, selectedVillage, onVillageChange, search, onSearchChange, notifications = [] }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readIds, setReadIds] = useState(() => new Set());
  const navigate = useNavigate();
  const user = getAuthUser();
  const unreadCount = useMemo(() => notifications.filter((notification) => !readIds.has(notification.id)).length, [notifications, readIds]);
  useEffect(() => {
    setReadIds((current) => new Set([...current].filter((id) => notifications.some((item) => item.id === id))));
  }, [notifications]);

  function handleSignOut() {
    logout();
    navigate("/login", { replace: true });
  }
  function markAllRead() { setReadIds(new Set(notifications.map((notification) => notification.id))); }
  function openNotification(notification) {
    setReadIds((current) => new Set(current).add(notification.id));
    setNotificationsOpen(false);
    if (notification.href) navigate(notification.href);
  }
  return (
    <header className="topbar">
      <div className="topbar-title"><div className="breadcrumb"><span>Workspace</span><span className="crumb-separator">/</span><strong>Overview</strong></div><h1>Village land intelligence</h1></div>
      <div className="topbar-tools">
        <label className="search-box"><Search size={16} /><input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search parcel ID..." aria-label="Search parcels by ID" /><kbd>Ctrl K</kbd></label>
        <label className="village-select"><MapPin size={15} /><select value={selectedVillage} onChange={(event) => onVillageChange(event.target.value)} aria-label="Select village">{villages.map((village) => <option key={village.id} value={village.id}>{village.name}</option>)}</select><ChevronDown size={14} /></label>
        <div className="notification-wrap">
          <button className="icon-button notification-button" onClick={() => setNotificationsOpen((open) => !open)} aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`} aria-expanded={notificationsOpen}><Bell size={18} />{unreadCount > 0 && <span className="notification-count">{unreadCount > 9 ? "9+" : unreadCount}</span>}</button>
          {notificationsOpen && <section className="notification-menu" aria-label="Notifications">
            <div className="notification-heading"><div><strong>Notifications</strong><span>{unreadCount ? `${unreadCount} unread` : "All caught up"}</span></div><button className="notification-action" onClick={markAllRead} disabled={!unreadCount} aria-label="Mark all notifications as read"><Check size={14} /></button><button className="notification-action" onClick={() => setNotificationsOpen(false)} aria-label="Close notifications"><X size={14} /></button></div>
            <div className="notification-list">{notifications.length ? notifications.map((notification) => <button className={`notification-item${readIds.has(notification.id) ? " notification-item--read" : ""}`} key={notification.id} onClick={() => openNotification(notification)}><span className={`notification-icon notification-icon--${notification.tone}`}>{notification.icon}</span><span><strong>{notification.title}</strong><small>{notification.message}</small><time>{notification.time}</time></span></button>) : <p className="notification-empty">No notifications right now.</p>}</div>
          </section>}
        </div>
        <div className="profile-wrap"><button className="profile-button" onClick={() => setProfileOpen(!profileOpen)} aria-expanded={profileOpen}><span className="avatar"><UserRound size={16} /></span><span className="profile-name">{user?.email ?? "Admin"}</span><ChevronDown size={14} /></button>
          {profileOpen && <div className="profile-menu"><strong>{user?.role ?? "Village Administrator"}</strong><span>{user?.email ?? "Demo workspace"}</span><button onClick={handleSignOut}>Sign out</button></div>}
        </div>
      </div>
    </header>
  );
}
