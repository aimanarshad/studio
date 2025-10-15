'use client';

import React from 'react';
import { Map as GoogleMap, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

interface MapProps {
  userLocation: { lat: number; lng: number } | null;
}

const KARACHI_COORDS = { lat: 24.8607, lng: 67.0011 };

export function Map({ userLocation }: MapProps) {
  const center = userLocation || KARACHI_COORDS;
  
  return (
    <div className="absolute inset-0">
      <GoogleMap
        mapId="karachi-bus-map"
        defaultCenter={KARACHI_COORDS}
        defaultZoom={12}
        center={center}
        zoom={userLocation ? 15 : 12}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        className="transition-all duration-500"
      >
        {userLocation && (
          <AdvancedMarker position={userLocation}>
            <Pin backgroundColor={'hsl(var(--primary))'} borderColor={'white'} />
          </AdvancedMarker>
        )}
      </GoogleMap>
    </div>
  );
}
