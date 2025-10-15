'use client';

import React, { useState } from 'react';
import { Map } from '@/components/map';
import RoutePanel from '@/components/route-panel';

export type Route = {
  name: string;
  number: string;
  stops: string[];
  start: string;
  end:string;
  time: string;
  isAiSuggestion: boolean;
  aiDetails?: string;
};

export default function MainView() {
  const [route, setRoute] = useState<Route | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  return (
    <div className="h-full w-full animate-in fade-in-0 slide-in-from-bottom-8 duration-1000">
      <Map userLocation={userLocation} />
      <RoutePanel
        onRouteFound={setRoute}
        onLocationFound={setUserLocation}
        route={route}
      />
    </div>
  );
}
