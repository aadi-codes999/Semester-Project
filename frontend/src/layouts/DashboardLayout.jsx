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
        <Navbar villages={villages} selectedVillage={selectedVillage} onVillageChange={setSelectedVillage} search={search} onSearchChange={setSearch} />
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
