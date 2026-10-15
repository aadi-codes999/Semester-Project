import { lazy, Suspense, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Loading from "../components/Loading";

const InteractiveVillageMap = lazy(() => import("../components/VillageMap"));

export default function VillageMapPage() {
  const { parcels, search, onSearchChange, villages, selectedVillage } = useOutletContext();
  const [selectedId, setSelectedId] = useState(null);
  const village = villages.find((item) => item.id === selectedVillage) ?? villages[0];
  const filteredParcels = useMemo(
    () => parcels.filter((parcel) => parcel.id.toLowerCase().includes(search.trim().toLowerCase())),
    [parcels, search],
  );
  const selectedParcel = filteredParcels.find((parcel) => parcel.id === selectedId) ?? filteredParcels[0] ?? null;

  return (
    <main className="generic-page">
      <div className="page-intro"><div><span className="district-label">{village?.district} district <i /> {village?.name} village</span><h2>Village parcel map</h2><p>Explore parcel observations in their geographic context.</p></div><span className="sample-badge"><span className="sample-dot" /> ILLUSTRATIVE BOUNDARIES</span></div>
      <div className="map-toolbar"><span><i className="live-dot" /> {filteredParcels.length} parcels on map</span><span>Select a parcel to inspect</span></div>
      <Suspense fallback={<div className="component-loading" role="status">Loading interactive map...</div>}>
        {village && <InteractiveVillageMap
          parcels={filteredParcels}
          selectedParcel={selectedParcel}
          onSelectParcel={(parcel) => setSelectedId(parcel.id)}
          village={village}
          search={search}
          onSearch={onSearchChange}
        />}
      </Suspense>
    </main>
  );
}
