'use client';

import React, { useState } from 'react';
import { Map } from '@/components/map';
import RoutePanel from '@/components/route-panel';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Directions } from './directions';

export type Route = {
  name: string;
  number: string;
  stops: string[];
  start: string;
  end:string;
  time: string;
  isAiSuggestion: boolean;
  aiDetails?: string;
  image?: string;
};

export default function MainView() {
  const [route, setRoute] = useState<Route | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleRouteFound = (newRoute: Route | null) => {
    if (newRoute) {
      const randomImage = PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)];
      setRoute({ ...newRoute, image: randomImage?.imageUrl });
    } else {
      setRoute(null);
    }
  };

  return (
    <div className="h-full w-full animate-in fade-in-0 slide-in-from-top-4 duration-1000">
      <Map userLocation={userLocation}>
        {route && (
            <Directions
                origin={route.start}
                destination={route.end}
                travelMode={google.maps.TravelMode.TRANSIT}
            />
        )}
      </Map>
      <RoutePanel
        onRouteFound={handleRouteFound}
        onLocationFound={setUserLocation}
        route={route}
      />
    </div>
  );
}
