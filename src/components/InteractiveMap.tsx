import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Shelter {
  id: number;
  name: string;
  address: string;
  distance: string;
  status: string;
  capacity: string;
  resources: string[];
  phone: string;
  coordinates: [number, number]; // [lng, lat]
}

interface InteractiveMapProps {
  shelters: Shelter[];
  onShelterSelect?: (shelter: Shelter) => void;
}

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom icons for different shelter statuses
const createCustomIcon = (status: string) => {
  const color = getMarkerColor(status);
  
  return L.divIcon({
    className: 'custom-shelter-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const getMarkerColor = (status: string) => {
  switch (status) {
    case 'available': return '#10b981'; // green
    case 'limited': return '#f59e0b'; // yellow
    case 'full': return '#ef4444'; // red
    default: return '#6b7280'; // gray
  }
};

const handleGetDirections = (address: string) => {
  const encodedAddress = encodeURIComponent(address);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  if (isIOS) {
    window.open(`maps://maps.google.com/maps?daddr=${encodedAddress}`, '_blank');
  } else {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
  }
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({ shelters, onShelterSelect }) => {
  // Calculate center point from all shelters
  const centerLat = shelters.reduce((sum, shelter) => sum + shelter.coordinates[1], 0) / shelters.length;
  const centerLng = shelters.reduce((sum, shelter) => sum + shelter.coordinates[0], 0) / shelters.length;
  
  return (
    <div className="relative">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={12}
        className="h-64 rounded-lg shadow-lg"
        style={{ height: '256px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {shelters.map((shelter) => (
          <Marker
            key={shelter.id}
            position={[shelter.coordinates[1], shelter.coordinates[0]]} // Leaflet uses [lat, lng]
            icon={createCustomIcon(shelter.status)}
            eventHandlers={{
              click: () => {
                onShelterSelect?.(shelter);
              },
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-base mb-1">{shelter.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{shelter.address}</p>
                <div className="space-y-1 mb-3">
                  <p className="text-sm">
                    Status: <span className={`font-medium ${
                      shelter.status === 'available' ? 'text-green-600' :
                      shelter.status === 'limited' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {shelter.status}
                    </span>
                  </p>
                  <p className="text-sm">Capacity: {shelter.capacity}</p>
                  <p className="text-sm">Distance: {shelter.distance}</p>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => handleGetDirections(shelter.address)}
                    className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    🧭 Get Directions
                  </button>
                  <button
                    onClick={() => window.open(`tel:${shelter.phone}`, '_self')}
                    className="w-full bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600 transition-colors"
                  >
                    📞 Call Shelter
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded p-2 text-xs z-[1000]">
        <div className="font-semibold mb-2">Shelter Status</div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span>Limited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Full</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;