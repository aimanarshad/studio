'use client';

import { useEffect, useState } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';

interface DirectionsProps {
  origin: string;
  destination: string;
  travelMode: google.maps.TravelMode;
}

export function Directions({ origin, destination, travelMode }: DirectionsProps) {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const { toast } = useToast();
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex] = useState(0);
  const selected = routes[routeIndex];
  const leg = selected?.legs[0];

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer || !origin || !destination) return;

    directionsService
      .route({
        origin,
        destination,
        travelMode,
        provideRouteAlternatives: false,
      })
      .then(response => {
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);
      })
      .catch((e: google.maps.MapsRequestError) => {
        console.error('Directions request failed:', e.message);
        if (e.code === 'NOT_FOUND') {
            toast({
                variant: 'destructive',
                title: (
                    <div className="flex items-center gap-2">
                        <AlertTriangle /> No Map Route Found
                    </div>
                ),
                description: 'Google Maps could not find a transit route for the specified locations.',
            });
        }
      });

    return () => {
        if (directionsRenderer) {
            directionsRenderer.setMap(null);
        }
    };
  }, [directionsService, directionsRenderer, origin, destination, travelMode, toast]);

  useEffect(() => {
    if (!directionsRenderer) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer]);

  if (!leg) return null;

  return null;
}
