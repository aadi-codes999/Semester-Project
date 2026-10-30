import { useEffect, useState } from "react";
import { Circle, MapContainer, Polygon, Popup, TileLayer, Tooltip, ZoomControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Globe, Layers3, LocateFixed, Satellite, Search } from "lucide-react";
import MapLegend from "./MapLegend";
import ParcelPopup from "./ParcelPopup";

const parcelColors = {
  suitable: "#22c55e",
  assessment: "#f59e0b",
  water: "#3b82f6",
  insufficient: "#94a3b8",
  constraints: "#ef4444",
};

function getNdviColor(ndvi) {
  if (ndvi === undefined || ndvi === null) return "#94a3b8";
  if (ndvi < 0.1) return "#38bdf8"; // Water / bare
  if (ndvi < 0.22) return "#fbbf24"; // Barren / Degraded wasteland
  if (ndvi < 0.35) return "#a3e635"; // Scrub / fallow
  if (ndvi < 0.5) return "#4ade80"; // Light vegetation
  return "#15803d"; // Dense crop/canopy
}

function MapViewport({ village }) {
  const map = useMap();
  useEffect(() => {
    if (village?.center) {
      map.flyTo(village.center, 14, { duration: 0.8 });
    }
    const reset = () => {
      if (village?.center) map.flyTo(village.center, 14, { duration: 0.8 });
    };
    window.addEventListener("map-reset-view", reset);
    return () => window.removeEventListener("map-reset-view", reset);
  }, [map, village]);
  return null;
}

export default function VillageMap({ parcels, selectedParcel, onSelectParcel, village, onSearch, search }) {
  const [showLayers, setShowLayers] = useState(false);
  const [baseMap, setBaseMap] = useState("satellite"); // 'satellite' or 'osm'
  const [showParcels, setShowParcels] = useState(true);
  const [showBoundary, setShowBoundary] = useState(true);
  const [colorByNdvi, setColorByNdvi] = useState(false);

  const center = village?.center ?? parcels[0]?.center ?? [21.6582, 82.1608];

  const tileUrls = {
    osm: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "Tiles &copy; Esri &mdash; Sentinel-2 Copernicus & USGS GeoEye",
    },
  };

  return (
    <section className="map-card" style={{ position: "relative" }}>
      <div className="map-controls">
        <label>
          <Search size={15} />
          <input
            value={search}
            placeholder="Search parcel or Khasra..."
            aria-label="Search map parcels"
            onChange={(event) => onSearch(event.target.value)}
          />
        </label>

        {/* Basemap Switcher */}
        <button
          className="map-control-button"
          title={`Switch to ${baseMap === "satellite" ? "Street map" : "Satellite imagery"}`}
          onClick={() => setBaseMap(baseMap === "satellite" ? "osm" : "satellite")}
          style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "0 8px", width: "auto" }}
        >
          {baseMap === "satellite" ? <Globe size={15} /> : <Satellite size={15} />}
          <span style={{ fontSize: "0.75rem" }}>{baseMap === "satellite" ? "Satellite" : "Streets"}</span>
        </button>

        <button
          className="map-control-button"
          title="Map layers"
          aria-label="Toggle map layers"
          aria-expanded={showLayers}
          onClick={() => setShowLayers(!showLayers)}
        >
          <Layers3 size={16} />
        </button>

        <button
          className="map-control-button"
          title="Center on village"
          onClick={() => window.dispatchEvent(new CustomEvent("map-reset-view"))}
        >
          <LocateFixed size={16} />
        </button>
      </div>

      {showLayers && (
        <div className="layer-menu" style={{ zIndex: 1000, background: "white", padding: "10px 14px", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", minWidth: 220 }}>
          <strong style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
            Geospatial Layers
          </strong>
          <label style={{ display: "flex", alignItems: "center", gap: 6, margin: "4px 0", cursor: "pointer" }}>
            <input type="checkbox" checked={showParcels} onChange={(e) => setShowParcels(e.target.checked)} />
            Cadastral parcels (BhuNaksha)
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 6, margin: "4px 0", cursor: "pointer" }}>
            <input type="checkbox" checked={showBoundary} onChange={(e) => setShowBoundary(e.target.checked)} />
            SoI Village boundary (LGD 674)
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 6, margin: "4px 0", cursor: "pointer" }}>
            <input type="checkbox" checked={colorByNdvi} onChange={(e) => setColorByNdvi(e.target.checked)} />
            NDVI Vegetation color mode
          </label>
          <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "6px 0" }} />
          <span style={{ fontSize: "0.7rem", color: "#64748b" }}>
            Sources: Survey of India, Sentinel-2, SoilGrids, BhuNaksha
          </span>
        </div>
      )}

      {parcels.length ? (
        <MapContainer center={center} zoom={14} zoomControl={false} scrollWheelZoom className="leaflet-map">
          <TileLayer attribution={tileUrls[baseMap].attribution} url={tileUrls[baseMap].url} maxZoom={19} />
          <ZoomControl position="bottomright" />
          <MapViewport village={village} />

          {/* Cadastral Parcels */}
          {showParcels &&
            parcels.map((parcel, index) => {
              const [lat, lng] = parcel.center;
              const size = 0.0012 + (index % 4) * 0.00018;
              const positions = [
                [lat - size * 0.9, lng - size],
                [lat - size * 0.7, lng + size],
                [lat + size * 0.85, lng + size * 0.8],
                [lat + size, lng - size * 0.75],
              ];

              const color = colorByNdvi ? getNdviColor(parcel.ndvi) : (parcelColors[parcel.status] || "#22c55e");
              const isSelected = selectedParcel?.id === parcel.id;

              return (
                <Polygon
                  key={parcel.id}
                  positions={positions}
                  pathOptions={{
                    color: isSelected ? "#ffffff" : color,
                    fillColor: color,
                    fillOpacity: isSelected ? 0.85 : 0.55,
                    weight: isSelected ? 3.5 : 2,
                  }}
                  eventHandlers={{ click: () => onSelectParcel(parcel) }}
                >
                  <Tooltip direction="top" sticky>
                    <strong>{parcel.id}</strong> ({parcel.khasraNo || "Cadastral"})
                    <br />
                    {parcel.area} acres · {parcel.statusLabel || parcel.status}
                    {parcel.ndvi !== undefined && <><br />NDVI: {Number(parcel.ndvi).toFixed(2)}</>}
                  </Tooltip>
                  <Popup>
                    <ParcelPopup parcel={parcel} />
                  </Popup>
                </Polygon>
              );
            })}

          {/* Survey of India Village Boundary */}
          {showBoundary && (
            <Circle
              center={center}
              radius={2400}
              pathOptions={{
                color: "#38bdf8",
                weight: 2,
                dashArray: "7 7",
                fillColor: "#0284c7",
                fillOpacity: 0.04,
                interactive: false,
              }}
            />
          )}
        </MapContainer>
      ) : (
        <div className="map-empty">
          <Search size={20} />
          <strong>No matching parcels</strong>
          <span>Adjust your search or assessment filter.</span>
        </div>
      )}

      {showBoundary && (
        <div className="village-boundary-label">
          <i style={{ background: "#38bdf8" }} /> Survey of India {village?.name || "Village"} Boundary
        </div>
      )}

      {showParcels && !colorByNdvi && <MapLegend />}
      {showParcels && colorByNdvi && (
        <div className="map-legend" style={{ background: "rgba(15, 23, 42, 0.85)", color: "white", padding: "6px 12px", borderRadius: 6, fontSize: "0.75rem" }}>
          <strong style={{ display: "block", marginBottom: 3 }}>Sentinel-2 NDVI Index</strong>
          <div style={{ display: "flex", gap: 10 }}>
            <span><i style={{ display: "inline-block", width: 10, height: 10, background: "#fbbf24", marginRight: 3 }} /> Wasteland (&lt;0.22)</span>
            <span><i style={{ display: "inline-block", width: 10, height: 10, background: "#a3e635", marginRight: 3 }} /> Scrub / Fallow (0.22-0.35)</span>
            <span><i style={{ display: "inline-block", width: 10, height: 10, background: "#15803d", marginRight: 3 }} /> Crop / Canopy (&gt;0.35)</span>
          </div>
        </div>
      )}

      <div className="map-scale">
        <span>500 m</span>
        <i />
      </div>
    </section>
  );
}
