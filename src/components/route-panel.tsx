'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, BusFront, Loader2 } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { useToast } from '@/hooks/use-toast';
import { suggestNearbyRouteConnections } from '@/ai/flows/suggest-nearby-route-connections';
import RouteResults from '@/components/route-results';
import type { Route } from './main-view';
import busRoutesData from '@/lib/bus-routes.json';
import { AutocompleteInput } from './autocomplete-input';

interface RoutePanelProps {
  onRouteFound: (route: Route | null) => void;
  onLocationFound: (location: { lat: number; lng: number } | null) => void;
  route: Route | null;
}

export default function RoutePanel({ onRouteFound, onLocationFound, route }: RoutePanelProps) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [activeInput, setActiveInput] = useState<'from' | 'to' | null>(null);

  const { isListening, startListening } = useSpeechRecognition({
    onResult: (result) => {
      if (activeInput === 'from') setFrom(result);
      if (activeInput === 'to') setTo(result);
      setActiveInput(null);
    },
    lang: 'en-US',
  });
  
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocationFound({ lat: latitude, lng: longitude });
          setFrom('Your Current Location'); 
        },
        () => {
          toast({ variant: 'destructive', title: 'Location Error', description: 'Could not get your location. Please enable permissions.' });
        }
      );
    }
  }, [onLocationFound, toast]);

  const handleVoiceInput = (field: 'from' | 'to') => {
    setActiveInput(field);
    startListening();
  };

  const handleFindRoute = () => {
    if (!from || !to) {
      toast({ variant: 'destructive', title: 'Missing fields', description: 'Please fill in both "From" and "To" locations.' });
      return;
    }
    
    startTransition(async () => {
      try {
        const availableRoutes = busRoutesData.routes.map(r => `${r.name}: ${r.stops.join(', ')}`);
        
        const result = await suggestNearbyRouteConnections({
          origin: from,
          destination: to,
          availableRoutes: availableRoutes,
        });

        if (result.nearbyConnections && result.nearbyConnections.length > 0) {
          const connection = result.nearbyConnections[0];
          const foundRoute = busRoutesData.routes.find(r => connection.route.includes(r.name));

          const aiRoute: Route = {
            name: foundRoute ? foundRoute.name : connection.route,
            number: foundRoute ? foundRoute.name : 'N/A',
            stops: foundRoute ? foundRoute.stops : [],
            start: from,
            end: to,
            time: connection.details.match(/\\d+\\s*mins?/)?.[0] || 'N/A',
            isAiSuggestion: true,
            aiDetails: connection.details,
          };
          onRouteFound(aiRoute);
        } else {
          toast({ title: 'No Route Found', description: "We couldn't find a direct route or a nearby connection for you." });
          onRouteFound(null);
        }
      } catch (error) {
        console.error('Error finding route:', error);
        toast({ variant: 'destructive', title: 'AI Error', description: 'Could not get route suggestions.' });
        onRouteFound(null);
      }
    });
  };

  const handleNewSearch = () => {
    onRouteFound(null);
    setTo('');
  };
  
  const handlePlaceSelect = (place: google.maps.places.PlaceResult | null, field: 'from' | 'to') => {
    if (place?.formatted_address) {
        if (field === 'from') {
            setFrom(place.formatted_address);
        } else {
            setTo(place.formatted_address);
        }
    }
  }


  return (
    <div className="absolute top-0 left-0 right-0 p-4 md:top-8 md:left-8 md:right-auto md:w-96">
      <Card className="bg-background/80 backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
        <CardContent className="p-4">
          {!route ? (
            <div className="space-y-4">
              <div className="relative">
                <AutocompleteInput
                  placeholder="From"
                  value={from}
                  onPlaceSelect={(place) => handlePlaceSelect(place, 'from')}
                  onChange={(e) => setFrom(e.currentTarget.value)}
                  className="pr-10"
                />
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => handleVoiceInput('from')}>
                  <Mic className={`h-4 w-4 ${isListening && activeInput === 'from' ? 'text-destructive animate-pulse' : ''}`} />
                </Button>
              </div>
              <div className="relative">
                <AutocompleteInput
                  placeholder="To"
                  value={to}
                  onPlaceSelect={(place) => handlePlaceSelect(place, 'to')}
                  onChange={(e) => setTo(e.currentTarget.value)}
                  className="pr-10"
                />
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => handleVoiceInput('to')}>
                   <Mic className={`h-4 w-4 ${isListening && activeInput === 'to' ? 'text-destructive animate-pulse' : ''}`} />
                </Button>
              </div>
              <Button onClick={handleFindRoute} disabled={isPending} className="w-full">
                {isPending ? <Loader2 className="animate-spin" /> : <BusFront className="mr-2 h-4 w-4" />}
                Find Route
              </Button>
            </div>
          ) : (
            <RouteResults route={route} onNewSearch={handleNewSearch} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
