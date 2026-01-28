import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation2, Phone, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color: string, isFeatured: boolean) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${isFeatured ? '#f59e0b' : color};
        border: 2px solid white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        color: white;
        font-size: 10px;
        font-weight: bold;
      ">
        ${isFeatured ? '⭐' : '🍽️'}
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
};

// Get restaurant coordinates (same logic as in MapSearch)
const getRestaurantCoordinates = (restaurant: any) => {
  const coordinates: Record<string, { lat: number; lng: number }> = {
    "Stuart": { lat: 27.1973, lng: -80.2528 },
    "Jensen Beach": { lat: 27.2295, lng: -80.2245 },
    "Palm City": { lat: 27.1662, lng: -80.2697 },
    "Jupiter": { lat: 26.9342, lng: -80.0942 },
    "Hobe Sound": { lat: 27.0581, lng: -80.1334 },
    "Vero Beach": { lat: 27.6386, lng: -80.3973 },
    "Fort Pierce": { lat: 27.4467, lng: -80.3256 },
    "Port St. Lucie": { lat: 27.2730, lng: -80.3582 },
    "Sebastian": { lat: 27.8164, lng: -80.4706 },
    "Hutchinson Island": { lat: 27.3364, lng: -80.2122 },
    "Tequesta": { lat: 26.9581, lng: -80.1028 }
  };
  
  return coordinates[restaurant.city] || { lat: 27.1973, lng: -80.2528 };
};

interface InteractiveMapProps {
  restaurants: any[];
  userLocation?: { lat: number; lng: number } | null;
  onRestaurantSelect?: (restaurant: any) => void;
  className?: string;
}

// Component to update map bounds when restaurants change
function MapUpdater({ restaurants }: { restaurants: any[] }) {
  const map = useMap();

  useEffect(() => {
    if (restaurants.length > 0) {
      const bounds = L.latLngBounds(
        restaurants.map(restaurant => {
          const coords = getRestaurantCoordinates(restaurant);
          return [coords.lat, coords.lng] as [number, number];
        })
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [restaurants, map]);

  return null;
}

export function InteractiveMap({ 
  restaurants, 
  userLocation, 
  onRestaurantSelect,
  className = "" 
}: InteractiveMapProps) {
  const defaultCenter: [number, number] = [27.2500, -80.2500]; // Treasure Coast center

  const openInMaps = (restaurant: any) => {
    const coords = getRestaurantCoordinates(restaurant);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
    window.open(mapsUrl, '_blank');
  };

  const callRestaurant = (restaurant: any) => {
    if (restaurant.phone) {
      window.open(`tel:${restaurant.phone}`, '_self');
    }
  };

  return (
    <div className={`w-full h-full ${className}`}>
      <MapContainer
        center={userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter}
        zoom={userLocation ? 12 : 10}
        className="w-full h-full rounded-lg"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater restaurants={restaurants} />

        {/* User location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={L.divIcon({
              html: `
                <div style="
                  background-color: #3b82f6;
                  border: 3px solid white;
                  border-radius: 50%;
                  width: 16px;
                  height: 16px;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                "></div>
              `,
              className: 'user-location-icon',
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            })}
          >
            <Popup>
              <div className="text-center">
                <strong>Your Location</strong>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Restaurant markers */}
        {restaurants.map((restaurant) => {
          const coords = getRestaurantCoordinates(restaurant);
          const primaryColor = '#1e40af'; // Primary blue color
          
          return (
            <Marker
              key={restaurant.id}
              position={[coords.lat, coords.lng]}
              icon={createCustomIcon(primaryColor, restaurant.isFeatured)}
            >
              <Popup maxWidth={300} className="custom-popup">
                <div className="min-w-[250px]">
                  {/* Restaurant Image */}
                  {restaurant.heroImageUrl && (
                    <img
                      src={restaurant.heroImageUrl}
                      alt={restaurant.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  
                  {/* Header */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-primary leading-tight flex-1">
                      {restaurant.name}
                    </h3>
                    {restaurant.isFeatured && (
                      <Badge className="ml-2 bg-secondary text-primary text-xs">
                        Featured
                      </Badge>
                    )}
                  </div>

                  {/* Cuisine & Price */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">{restaurant.cuisine}</span>
                    <Badge variant="outline" className="text-xs">
                      {'$'.repeat(
                        restaurant.subscriptionTier === 'free' ? 1 :
                        restaurant.subscriptionTier === 'silver' ? 2 :
                        restaurant.subscriptionTier === 'gold' ? 3 : 4
                      )}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {restaurant.description}
                  </p>

                  {/* Address */}
                  <p className="text-xs text-gray-500 mb-4">
                    📍 {restaurant.address}, {restaurant.city} {restaurant.zip}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 text-xs"
                      onClick={() => onRestaurantSelect?.(restaurant)}
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openInMaps(restaurant)}
                      className="px-2"
                      title="Open in Google Maps"
                    >
                      <Navigation2 className="h-3 w-3" />
                    </Button>
                    {restaurant.phone && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => callRestaurant(restaurant)}
                        className="px-2"
                        title={`Call ${restaurant.phone}`}
                      >
                        <Phone className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}