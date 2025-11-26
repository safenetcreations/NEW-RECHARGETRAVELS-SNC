import React, { useEffect, useRef, useState } from 'react';
import { GoogleMapsLoader } from '@/components/map/GoogleMapsLoader';
import { useGoogleMapsApi } from '@/hooks/useGoogleMapsApi';
import { Destination } from './InteractiveTripBuilder';

interface TripMapProps {
    destinations: Destination[];
}

const TripMap: React.FC<TripMapProps> = ({ destinations }) => {
    const { apiKey, isLoading } = useGoogleMapsApi();
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
    const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

    // Leaflet State
    const [L, setL] = useState<any>(null);
    const [LeafletMap, setLeafletMap] = useState<any>(null);

    // Load Leaflet dynamically if needed
    useEffect(() => {
        if (!isLoading && !apiKey) {
            import('leaflet').then(leaflet => {
                import('react-leaflet').then(reactLeaflet => {
                    setL(leaflet.default);
                    setLeafletMap(reactLeaflet);
                    // Fix Leaflet marker icons
                    delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl;
                    leaflet.default.Icon.Default.mergeOptions({
                        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                    });
                });
            });
        }
    }, [isLoading, apiKey]);

    // Google Maps Effect
    useEffect(() => {
        if (mapRef.current && !map && window.google && apiKey) {
            // ... existing Google Maps initialization ...
            const newMap = new window.google.maps.Map(mapRef.current, {
                center: { lat: 7.8731, lng: 80.7718 },
                zoom: 7,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                styles: [
                    {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [{ visibility: "off" }]
                    }
                ]
            });
            setMap(newMap);

            const renderer = new window.google.maps.DirectionsRenderer({
                map: newMap,
                suppressMarkers: true,
                polylineOptions: {
                    strokeColor: "#2563EB",
                    strokeWeight: 5,
                    strokeOpacity: 0.8
                }
            });
            setDirectionsRenderer(renderer);
        }
    }, [mapRef.current, window.google, apiKey]);

    // Update Google Maps Markers/Route
    useEffect(() => {
        if (!map || !window.google || !apiKey) return;

        // ... existing marker update logic ...
        markers.forEach(marker => marker.setMap(null));
        const newMarkers: google.maps.Marker[] = [];

        destinations.forEach((dest, index) => {
            const marker = new window.google.maps.Marker({
                position: { lat: dest.lat, lng: dest.lng },
                map: map,
                label: {
                    text: (index + 1).toString(),
                    color: "white",
                    fontWeight: "bold"
                },
                title: dest.name,
                animation: window.google.maps.Animation.DROP
            });
            newMarkers.push(marker);
        });
        setMarkers(newMarkers);

        if (destinations.length > 1 && directionsRenderer) {
            const directionsService = new window.google.maps.DirectionsService();
            const waypoints = destinations.slice(1, -1).map(dest => ({
                location: { lat: dest.lat, lng: dest.lng },
                stopover: true
            }));

            directionsService.route({
                origin: { lat: destinations[0].lat, lng: destinations[0].lng },
                destination: { lat: destinations[destinations.length - 1].lat, lng: destinations[destinations.length - 1].lng },
                waypoints: waypoints,
                travelMode: window.google.maps.TravelMode.DRIVING,
            }, (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK && result) {
                    directionsRenderer.setDirections(result);
                } else {
                    console.error(`Directions request failed due to ${status}`);
                }
            });
        } else if (directionsRenderer) {
            directionsRenderer.setDirections(null);
        }

        if (destinations.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            destinations.forEach(dest => {
                bounds.extend({ lat: dest.lat, lng: dest.lng });
            });
            map.fitBounds(bounds);
            if (destinations.length === 1) map.setZoom(10);
        }
    }, [map, destinations, directionsRenderer, apiKey]);

    // Loading State
    if (isLoading) {
        return (
            <div className="w-full h-full min-h-[400px] bg-gray-100 flex items-center justify-center">
                <div className="text-gray-500">Loading Map...</div>
            </div>
        );
    }

    // Render Leaflet if no API key
    if (!apiKey && L && LeafletMap) {
        const { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } = LeafletMap;

        // Component to update map view bounds
        const MapUpdater = () => {
            const map = useMap();
            useEffect(() => {
                if (destinations.length > 0) {
                    const bounds = L.latLngBounds(destinations.map(d => [d.lat, d.lng]));
                    map.fitBounds(bounds, { padding: [50, 50] });
                }
            }, [destinations, map]);
            return null;
        };

        return (
            <div className="w-full h-full min-h-[400px]">
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
                <MapContainer
                    center={[7.8731, 80.7718]}
                    zoom={7}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {destinations.map((dest, index) => (
                        <Marker key={dest.id} position={[dest.lat, dest.lng]}>
                            <Popup>{dest.name}</Popup>
                        </Marker>
                    ))}
                    {destinations.length > 1 && (
                        <Polyline
                            positions={destinations.map(d => [d.lat, d.lng])}
                            color="#2563EB"
                            weight={5}
                            opacity={0.8}
                        />
                    )}
                    <MapUpdater />
                </MapContainer>
            </div>
        );
    }

    // Render Google Maps if API key exists
    return (
        <GoogleMapsLoader apiKey={apiKey}>
            <div ref={mapRef} className="w-full h-full min-h-[400px] bg-gray-100" />
        </GoogleMapsLoader>
    );
};

export default TripMap;
