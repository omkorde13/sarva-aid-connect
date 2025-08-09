import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

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

const InteractiveMap: React.FC<InteractiveMapProps> = ({ shelters, onShelterSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.5, 40], // Default center (can be updated to user's location)
      zoom: 12,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add shelter markers
    shelters.forEach((shelter) => {
      const el = document.createElement('div');
      el.className = 'shelter-marker';
      el.style.backgroundColor = getMarkerColor(shelter.status);
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

      const marker = new mapboxgl.Marker(el)
        .setLngLat(shelter.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <h3 class="font-semibold">${shelter.name}</h3>
                <p class="text-sm text-gray-600">${shelter.address}</p>
                <p class="text-sm">Status: <span class="font-medium">${shelter.status}</span></p>
                <p class="text-sm">Capacity: ${shelter.capacity}</p>
                <button 
                  onclick="window.handleDirectionsFromMap('${shelter.address}')"
                  class="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Get Directions
                </button>
              </div>
            `)
        )
        .addTo(map.current);

      markersRef.current.push(marker);

      // Add click event
      el.addEventListener('click', () => {
        onShelterSelect?.(shelter);
      });
    });

    // Fit map to show all shelters
    if (shelters.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      shelters.forEach(shelter => bounds.extend(shelter.coordinates));
      map.current.fitBounds(bounds, { padding: 50 });
    }

    setShowTokenInput(false);
  };

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'available': return '#10b981'; // green
      case 'limited': return '#f59e0b'; // yellow
      case 'full': return '#ef4444'; // red
      default: return '#6b7280'; // gray
    }
  };

  useEffect(() => {
    // Global function for popup directions
    (window as any).handleDirectionsFromMap = (address: string) => {
      const encodedAddress = encodeURIComponent(address);
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      if (isIOS) {
        window.open(`maps://maps.google.com/maps?daddr=${encodedAddress}`, '_blank');
      } else {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
      }
    };

    return () => {
      if (map.current) {
        map.current.remove();
      }
      // Clean up markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (mapboxToken && !map.current) {
      initializeMap();
    }
  }, [mapboxToken]);

  if (showTokenInput) {
    return (
      <Card className="h-64">
        <CardContent className="h-full flex items-center justify-center p-6">
          <div className="text-center space-y-4 w-full max-w-md">
            <div>
              <h3 className="font-semibold mb-2">Interactive Map</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Enter your Mapbox public token to enable the interactive map with shelter locations.
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Get your token from{' '}
                <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  mapbox.com
                </a>
              </p>
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwi..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
              />
              <Button 
                onClick={initializeMap}
                disabled={!mapboxToken.trim()}
                className="w-full"
              >
                Load Map
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative">
      <div ref={mapContainer} className="h-64 rounded-lg shadow-lg" />
      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded p-2 text-xs">
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