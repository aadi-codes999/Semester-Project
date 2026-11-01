import { AlertTriangle, CheckCircle2, Database, Info } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { parcels as demoParcels, villages as demoVillages } from "../data/demoData";
import { getVillages } from "../services/villageService";
import { getLandParcels } from "../services/landService";

const API_ENABLED = import.meta.env.VITE_USE_API !== "false";

export default function DashboardLayout() {
  const [selectedVillage, setSelectedVillage] = useState(demoVillages[0].id);
  const [villages, setVillages] = useState(demoVillages);
  const [parcels, setParcels] = useState(demoParcels);
  const [apiError, setApiError] = useState("");
  const [apiLoading, setApiLoading] = useState(API_ENABLED);
  const [search, setSearch] = useState("");
  const location = useLocation();
  const villageParcels = useMemo(() => parcels.filter((parcel) => parcel.villageId === selectedVillage), [parcels, selectedVillage]);
  const notifications = useMemo(() => {
    const items = [];
    if (apiLoading) items.push({ id: "data-sync", tone: "info", icon: <Database size={15} />, title: "Synchronizing land data", message: "Village parcels and GIS layers are being refreshed.", time: "Now" });
    else if (apiError) items.push({ id: "api-warning", tone: "warning", icon: <AlertTriangle size={15} />, title: "Backend connection issue", message: "Showing the last available dataset until the API responds.", time: "Now" });
    const constrained = villageParcels.find((parcel) => parcel.status === "constraints" || parcel.status === "assessment");
    if (constrained) items.push({ id: `review-${constrained.id}`, tone: "warning", icon: <AlertTriangle size={15} />, title: `${constrained.id} needs review`, message: constrained.statusLabel || "Assessment or legal review is required.", time: "Action needed", href: `/parcels/${encodeURIComponent(constrained.id)}` });
    const suitable = villageParcels.find((parcel) => parcel.status === "suitable");
    if (suitable) items.push({ id: `suitable-${suitable.id}`, tone: "success", icon: <CheckCircle2 size={15} />, title: `${suitable.id} is ready for planning`, message: `${suitable.suggestedUse || "A suitable use"} has been identified for this parcel.`, time: "New insight", href: `/parcels/${encodeURIComponent(suitable.id)}` });
    if (!items.length) items.push({ id: "workspace-ready", tone: "info", icon: <Info size={15} />, title: "Workspace ready", message: "Select a parcel or village to explore land intelligence.", time: "Welcome" });
    return items;
  }, [apiError, apiLoading, villageParcels]);

  useEffect(() => {
    if (!API_ENABLED) return undefined;
    let active = true;

    Promise.all([getVillages(), getLandParcels()])
      .then(([apiVillages, apiParcels]) => {
        if (!Array.isArray(apiVillages) || !Array.isArray(apiParcels)) {
          throw new Error("The API returned an invalid village or parcel list.");
        }
        if (!active) return;
        setVillages(apiVillages);
        setParcels(apiParcels);
        setSelectedVillage((current) => (
          apiVillages.some((village) => village.id === current)
            ? current
            : apiVillages[0]?.id ?? current
        ));
        setApiError("");
      })
      .catch((error) => {
        if (active) setApiError(`${error.message}. Showing demonstration data instead.`);
      })
      .finally(() => {
        if (active) setApiLoading(false);
      });

    return () => { active = false; };
  }, []);

  useEffect(() => {
    const shortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.querySelector(".search-box input")?.focus();
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);

  useEffect(() => setSearch(""), [location.pathname, selectedVillage]);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-shell">
        <Navbar villages={villages} selectedVillage={selectedVillage} onVillageChange={setSelectedVillage} search={search} onSearchChange={setSearch} notifications={notifications} />
        {apiError && <div className="global-api-notice" role="status">Backend unavailable — {apiError}</div>}
        <Outlet context={{
          selectedVillage,
          search,
          onSearchChange: setSearch,
          parcels: villageParcels,
          allParcels: parcels,
          villages,
          apiEnabled: API_ENABLED,
          apiError,
          apiLoading,
        }} />
      </div>
    </div>
  );
}
