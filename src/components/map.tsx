'use client';

import React from 'react';
import { Map as GoogleMap, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { useTheme } from 'next-themes';

interface MapProps {
  userLocation: { lat: number; lng: number } | null;
}

const KARACHI_COORDS = { lat: 24.8607, lng: 67.0011 };

const MAP_STYLES = {
  light: "5f3e7a3e1f2c4b5d", // A modern, light map style
  dark: "1b1c3c3a5b0c0d1e" // A sleek, dark map style
};

export function Map({ userLocation }: MapProps) {
  const { resolvedTheme } = useTheme();
  const center = userLocation || KARACHI_COORDS;
  const mapId = resolvedTheme === 'dark' ? MAP_STYLES.dark : MAP_STYLES.light;
  
  return (
    <div className="absolute inset-0">
      <GoogleMap
        mapId={mapId}
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
            <Pin background={'hsl(var(--primary))'} borderColor={'white'} glyphColor={'white'} />
          </AdvancedMarker>
        )}
      </GoogleMap>
    </div>
  );
}
