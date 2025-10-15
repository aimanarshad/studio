'use client';

import React from 'react';
import { Map as GoogleMap, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

interface MapProps {
  userLocation: { lat: number; lng: number } | null;
}

const KARACHI_COORDS = { lat: 24.8607, lng: 67.0011 };
const MAP_ID = "1a2b3c4d5e6f7g8h"; // Replace with your dark theme map ID

export function Map({ userLocation }: MapProps) {
  const center = userLocation || KARACHI_COORDS;
  
  return (
    <div className="absolute inset-0">
      <GoogleMap
        mapId={MAP_ID}
        defaultCenter={KARACHI_COORDS}
        defaultZoom={12}
        center={center}
        zoom={userLocation ? 15 : 12}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        className="transition-all duration-500"
        styles={[
            {
                "featureType": "all",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#242f3e"
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#242f3e"
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#746855"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9ca5b3"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#38414e"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#212a37"
                    }
                ]
            },
             {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9ca5b3"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#746855"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#1f2835"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#f3d19c"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#2f3948"
                    }
                ]
            },
             {
                "featureType": "transit.station",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#d59563"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#17263c"
                    }
                ]
            },
             {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#515c6d"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#17263c"
                    }
                ]
            }
        ]}
      >
        {userLocation && (
          <AdvancedMarker position={userLocation}>
            <Pin background={'hsl(var(--primary))'} borderColor={'hsl(var(--primary-foreground))'} glyphColor={'hsl(var(--primary-foreground))'} />
          </AdvancedMarker>
        )}
      </GoogleMap>
    </div>
  );
}
