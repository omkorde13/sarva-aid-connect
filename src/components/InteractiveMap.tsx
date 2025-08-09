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

const MapComponent: React.FC<InteractiveMapProps> = ({ shelters, onShelterSelect }) => {
  // Calculate center point from all shelters
  const centerLat = shelters.length > 0 ? shelters.reduce((sum, shelter) => sum + shelter.coordinates[1], 0) / shelters.length : 40.7128;
  const centerLng = shelters.length > 0 ? shelters.reduce((sum, shelter) => sum + shelter.coordinates[0], 0) / shelters.length : -74.0060;
  
  return (
    <MapContainer
      center={[centerLat, centerLng]}
      zoom={12}
      style={{ height: '256px', width: '100%' }}
      className="rounded-lg shadow-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {shelters.map((shelter) => (
        <Marker
          key={shelter.id}
          position={[shelter.coordinates[1], shelter.coordinates[0]]}
          eventHandlers={{
            click: () => {
              onShelterSelect?.(shelter);
            },
          }}
        >
          <Popup>
            <div style={{ padding: '8px', minWidth: '200px' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>{shelter.name}</h3>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>{shelter.address}</p>
              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '14px', marginBottom: '4px' }}>
                  Status: <span style={{ 
                    fontWeight: 'bold',
                    color: shelter.status === 'available' ? '#10b981' :
                           shelter.status === 'limited' ? '#f59e0b' : '#ef4444'
                  }}>
                    {shelter.status}
                  </span>
                </p>
                <p style={{ fontSize: '14px', marginBottom: '4px' }}>Capacity: {shelter.capacity}</p>
                <p style={{ fontSize: '14px' }}>Distance: {shelter.distance}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => handleGetDirections(shelter.address)}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: 'none',
                    fontSize: '14px',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                >
                  🧭 Get Directions
                </button>
                <button
                  onClick={() => window.open(`tel:${shelter.phone}`, '_self')}
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: 'none',
                    fontSize: '14px',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                >
                  📞 Call Shelter
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({ shelters, onShelterSelect }) => {
  return (
    <div className="relative">
      <MapComponent shelters={shelters} onShelterSelect={onShelterSelect} />
      
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