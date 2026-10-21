"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { ExternalLink, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";

interface PlaceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  lat: number;
  lng: number;
  googleMapsUrl: string;
}

interface JerusalemMapProps {
  places: PlaceItem[];
}

// تصميم أيقونة الدبوس المتوهج (Custom Pin Icon)
const createCustomIcon = () => {
  return L.divIcon({
    className: "custom-map-pin",
    html: `
      <div class="relative flex items-center justify-center w-8 h-8">
        <span class="absolute w-full h-full rounded-full bg-pink-500/40 animate-ping"></span>
        <div class="relative w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 border-2 border-white flex items-center justify-center shadow-lg shadow-pink-500/50 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export default function JerusalemMap({ places }: JerusalemMapProps) {
  // مركز مدينة القدس الافتراضي
  const defaultCenter: [number, number] = [31.773583, 35.198222];

  return (
    <div className="relative w-full h-[450px] sm:h-[500px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl z-10 backdrop-blur-md">
      <MapContainer
        center={defaultCenter}
        zoom={14}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        {/* بلاطات الخريطة الداكنة الفخمة (CartoDB Dark Matter) */}

        <TileLayer
        attribution='&copy; OpenStreetMap contributors &copy; CARTO'
        url="https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png?key=cb1_4r7q_1_8650266a5a5fe932ebd1dba3"
        maxZoom={20}
        />


        {/* عرض دبابيس الأماكن بالقدس */}
        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            icon={createCustomIcon()}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-1 space-y-2 dir-rtl text-right min-w-[200px]">
                <span className="inline-block px-2 py-0.5 text-[10px] rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                  {place.category}
                </span>
                <h4 className="text-sm font-bold text-white m-0">{place.name}</h4>
                <p className="text-xs text-gray-300 font-light leading-relaxed m-0">
                  {place.description}
                </p>
                <a
                  href={place.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-pink-400 hover:text-pink-300 transition"
                >
                  <span>فتح في Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* تنسيقات سينمائية خاصة للنافذة المنبثقة (Popup) في الخريطة */}
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          background: rgba(15, 23, 42, 0.9) !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          backdrop-filter: blur(16px) !important;
          border-radius: 16px !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5) !important;
          color: white !important;
        }
        .leaflet-popup-tip {
          background: rgba(15, 23, 42, 0.9) !important;
        }
        .custom-map-pin {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}