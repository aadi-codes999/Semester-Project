import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChartNoAxesCombined, ChevronLeft, ChevronRight, ClipboardCheck, FileText, LayoutDashboard, Map, MapPinned, Settings, Sprout } from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/map", label: "Village map", icon: Map },
  { to: "/parcels", label: "Land parcels", icon: MapPinned },
  { to: "/assessment", label: "Land assessment", icon: ClipboardCheck },
  { to: "/recommendations", label: "Recommendations", icon: Sprout },
  { to: "/reports", label: "Reports", icon: FileText },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <aside className={`sidebar${collapsed ? " sidebar--collapsed" : ""}`}>
      <div className="brand">
        <div className="brand-mark"><Sprout size={21} strokeWidth={2.2} /></div>
        {!collapsed && <div className="brand-copy"><strong>VillageLand <span>AI</span></strong><small>LAND INTELLIGENCE</small></div>}
      </div>
      <div className="nav-caption">{!collapsed && "WORKSPACE"}</div>
      <nav className="side-nav" aria-label="Main navigation">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} title={label} aria-label={label} className={({ isActive }) => `nav-link${isActive ? " nav-link--active" : ""}`}>
            <Icon size={18} strokeWidth={1.8} />
            {!collapsed && <span>{label}</span>}
            {label === "Recommendations" && !collapsed && <span className="nav-count">4</span>}
          </NavLink>
        ))}
      </nav>
      {!collapsed && <div className="sidebar-insight"><div className="insight-icon"><ChartNoAxesCombined size={16} /></div><strong>Field intelligence</strong><p>Organize land data into clearer next steps for your village.</p><span><i className="online-dot" /> Demo workspace</span></div>}
      <div className="sidebar-bottom">
        <NavLink to="/settings" title="Settings" aria-label="Settings" className="nav-link"><Settings size={18} strokeWidth={1.8} />{!collapsed && <span>Settings</span>}</NavLink>
        <button className="collapse-button" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {collapsed ? <ChevronRight size={17} /> : <><ChevronLeft size={17} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
