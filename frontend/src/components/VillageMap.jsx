import { useEffect, useState } from "react";
import { Circle, MapContainer, Polygon, Popup, TileLayer, Tooltip, ZoomControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Layers3, LocateFixed, Search } from "lucide-react";
import MapLegend from "./MapLegend";
import ParcelPopup from "./ParcelPopup";

const parcelColors = { suitable: "#4d9465", assessment: "#e5ac43", water: "#5595c2", insufficient: "#929b9d", constraints: "#d66b5e" };

function MapViewport({ village }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(village.center, 15, { duration: 0.7 });
    const reset = () => map.flyTo(village.center, 15, { duration: 0.7 });
    window.addEventListener("map-reset-view", reset);
    return () => window.removeEventListener("map-reset-view", reset);
  }, [map, village]);
  return null;
}

export default function VillageMap({ parcels, selectedParcel, onSelectParcel, village, onSearch, search }) {
  const [showLayers, setShowLayers] = useState(false);
  const [showParcels, setShowParcels] = useState(true);
  const [showBoundary, setShowBoundary] = useState(true);
  const center = village?.center ?? parcels[0]?.center;
  return (
    <section className="map-card">
      <div className="map-controls"><label><Search size={15} /><input value={search} placeholder="Find a parcel..." aria-label="Search map parcels" onChange={(event) => onSearch(event.target.value)} /></label>
        <button className="map-control-button" title="Map layers" aria-label="Toggle map layers" aria-expanded={showLayers} onClick={() => setShowLayers(!showLayers)}><Layers3 size={16} /></button>
        <button className="map-control-button" title="Center on village" onClick={() => window.dispatchEvent(new CustomEvent("map-reset-view"))}><LocateFixed size={16} /></button>
      </div>
      {showLayers && <div className="layer-menu"><label><input type="checkbox" checked={showParcels} onChange={(event) => setShowParcels(event.target.checked)} />Parcel boundaries</label><label><input type="checkbox" checked={showBoundary} onChange={(event) => setShowBoundary(event.target.checked)} />Illustrative boundary</label></div>}
      {parcels.length ? <MapContainer center={center} zoom={15} zoomControl={false} scrollWheelZoom className="leaflet-map">
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ZoomControl position="bottomright" />
        <MapViewport village={village} />
        {showParcels && parcels.map((parcel, index) => {
          const [lat, lng] = parcel.center;
          const size = 0.00085 + (index % 3) * 0.00012;
          const positions = [[lat - size, lng - size], [lat - size * 0.72, lng + size], [lat + size * 0.92, lng + size * 0.76], [lat + size, lng - size * 0.72]];
          const color = parcelColors[parcel.status];
          return <Polygon key={parcel.id} positions={positions} pathOptions={{ color, fillColor: color, fillOpacity: selectedParcel?.id === parcel.id ? 0.72 : 0.4, weight: selectedParcel?.id === parcel.id ? 3 : 1.5 }} eventHandlers={{ click: () => onSelectParcel(parcel) }}>
            <Tooltip direction="top" sticky><strong>{parcel.id}</strong><br />{parcel.area} acres · {parcel.statusLabel}</Tooltip>
            <Popup><ParcelPopup parcel={parcel} /></Popup>
          </Polygon>;
        })}
        {showBoundary && <Circle center={center} radius={1700} pathOptions={{ color: "#558568", weight: 1.4, dashArray: "6 7", fill: false, interactive: false }} />}
      </MapContainer> : <div className="map-empty"><Search size={20} /><strong>No matching parcels</strong><span>Adjust your search or assessment filter.</span></div>}
      {showBoundary && <div className="village-boundary-label"><i /> Illustrative village boundary</div>}
      {showParcels && <MapLegend />}
      <div className="map-scale"><span>500 m</span><i /></div>
    </section>
  );
}
