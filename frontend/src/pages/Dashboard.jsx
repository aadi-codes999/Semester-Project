import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Activity, AlertTriangle, ArrowDownRight, CircleHelp, ClipboardCheck, MapPinned, Sprout } from "lucide-react";
import { getDashboardStats } from "../services/dashboardService";
import StatCard from "../components/StatCard";
import IntelligencePanel from "../components/IntelligencePanel";
import RecentActivityTable from "../components/RecentActivityTable";

const API_ENABLED = import.meta.env.VITE_USE_API !== "false";

const VillageMap = lazy(() => import("../components/VillageMap"));
const LandDistributionChart = lazy(() => import("../components/LandDistributionChart"));
const UtilizationChart = lazy(() => import("../components/UtilizationChart"));

export default function Dashboard() {
  const { selectedVillage, search, onSearchChange, parcels, villages, apiError: dataApiError } = useOutletContext();
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [apiError, setApiError] = useState("");
  const [apiLoading, setApiLoading] = useState(false);
  const [apiStats, setApiStats] = useState(null);
  const village = villages.find((item) => item.id === selectedVillage) ?? villages[0];
  const filteredParcels = useMemo(() => parcels.filter((parcel) => (
    parcel.id.toLowerCase().includes(search.trim().toLowerCase()) &&
    (statusFilter === "all" || parcel.status === statusFilter)
  )), [parcels, search, statusFilter]);
  const selectedParcel = filteredParcels.find((parcel) => parcel.id === selectedId) ?? filteredParcels[0] ?? null;

  useEffect(() => {
    if (selectedParcel && selectedParcel.id !== selectedId) setSelectedId(selectedParcel.id);
    if (!selectedParcel && selectedId) setSelectedId(null);
  }, [selectedParcel, selectedId]);

  useEffect(() => {
    if (!API_ENABLED) return;
    let active = true;
    setApiLoading(true);
    getDashboardStats(selectedVillage)
      .then((data) => { if (active) { setApiStats(data); setApiError(""); } })
      .catch((error) => {
        if (active) setApiError(`${error.message}. Showing clearly labelled demonstration data.`);
      })
      .finally(() => { if (active) setApiLoading(false); });
    return () => { active = false; };
  }, [selectedVillage]);

  const suitable = filteredParcels.filter((parcel) => parcel.status === "suitable").length;
  const needsAssessment = filteredParcels.filter((parcel) => parcel.status === "assessment" || parcel.status === "constraints").length;
  const verified = filteredParcels.filter((parcel) => parcel.verification === "Verified").length;
  const stats = {
    totalParcels: apiStats?.totalParcels ?? apiStats?.total_parcels ?? filteredParcels.length,
    potentiallyUnused: apiStats?.potentiallyUnused ?? apiStats?.potentially_unused ?? suitable,
    flaggedForAssessment: apiStats?.flaggedForAssessment ?? apiStats?.flagged_for_assessment ?? needsAssessment,
    assessedParcels: apiStats?.assessedParcels ?? apiStats?.assessed_parcels ?? verified,
  };

  return (
    <main className="dashboard-page">
      <div className="page-intro">
        <div><span className="district-label">{village?.district} district <i /> {village?.name} village</span><h2>Land overview</h2><p>Explore parcel observations, review preliminary assessment, and find useful next steps.</p></div>
        <div className="sample-badge"><span className="sample-dot" /> {API_ENABLED && !dataApiError ? "API DATA" : "DEMONSTRATION DATA"}</div>
      </div>

      {apiError && !dataApiError && <div className="api-notice" role="status"><AlertTriangle size={15} /><span>Dashboard statistics unavailable — {apiError}. Parcel values are still shown.</span></div>}
      {apiLoading && <div className="api-notice" role="status"><Activity size={15} /><span>Connecting to the API. Clearly labelled sample data remains visible.</span></div>}

      <section className="stats-grid" aria-label="Village parcel statistics">
        <StatCard title="Total land parcels" value={stats.totalParcels} note="In selected village" icon={MapPinned} tone="green" trend="Current" />
        <StatCard title="Potentially unused" value={stats.potentiallyUnused} note="Requires field verification" icon={Sprout} tone="amber" trend="Preliminary" />
        <StatCard title="Flagged for assessment" value={stats.flaggedForAssessment} note="Assessment incomplete" icon={AlertTriangle} tone="red" trend="Review" />
        <StatCard title="Parcels assessed" value={stats.assessedParcels} note="Demo verification status" icon={ClipboardCheck} tone="blue" trend="Updated" />
      </section>

      <section className="map-section">
        <div className="section-heading"><div><span className="eyebrow"><Activity size={13} /> SPATIAL OVERVIEW</span><h2>Village parcel map</h2></div>
          <label className="filter-select"><span>Assessment</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter parcels by assessment"><option value="all">All statuses</option><option value="suitable">Potentially suitable</option><option value="assessment">Needs assessment</option><option value="water">Water-related</option><option value="insufficient">Insufficient data</option><option value="constraints">Review constraints</option></select></label>
        </div>
        <div className="map-and-panel">
          <div className="map-column">
            <div className="map-toolbar"><span><i className="live-dot" /> {filteredParcels.length} parcels on map</span><span>Click a parcel to inspect</span></div>
            <Suspense fallback={<div className="component-loading" role="status">Loading interactive map...</div>}>
              {village && <VillageMap parcels={filteredParcels} selectedParcel={selectedParcel} onSelectParcel={(parcel) => setSelectedId(parcel.id)} village={village} search={search} onSearch={onSearchChange} />}
            </Suspense>
          </div>
          <IntelligencePanel parcel={selectedParcel} />
        </div>
      </section>

      <section className="analytics-grid">
        <article className="analytics-card"><div className="card-heading"><div><span className="eyebrow">ASSESSMENT SNAPSHOT</span><h2>Parcel distribution</h2></div><span className="chart-icon"><CircleHelp size={16} /></span></div><Suspense fallback={<div className="component-loading" role="status">Loading chart...</div>}><LandDistributionChart parcels={filteredParcels} /></Suspense></article>
        <article className="analytics-card"><div className="card-heading"><div><span className="eyebrow">EARLY-USE OPTIONS</span><h2>Potential utilization</h2></div><span className="chart-icon"><ArrowDownRight size={16} /></span></div><Suspense fallback={<div className="component-loading" role="status">Loading chart...</div>}><UtilizationChart parcels={filteredParcels} /></Suspense></article>
      </section>
      <RecentActivityTable parcels={filteredParcels} />
      <footer className="dashboard-footer"><span><CircleHelp size={13} /> Sample values are illustrative only; confirm all parcel information in the field.</span><span><i className="online-dot" />{API_ENABLED && !dataApiError && !apiError ? "API mode" : "Demo mode"}</span></footer>
    </main>
  );
}
