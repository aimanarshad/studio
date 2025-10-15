'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, BusFront, Loader2, LocateFixed, ArrowLeft, X, CheckCircle2 } from 'lucide-react';
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
  
  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocationFound({ lat: latitude, lng: longitude });
          setFrom('Your Current Location');
          toast({ 
              title: <div className="flex items-center gap-2"><CheckCircle2 className="text-green-500" /> Location Found</div>,
              description: 'Your current location has been set as the origin.'
            });
        },
        () => {
          toast({ variant: 'destructive', title: 'Location Error', description: 'Could not get your location. Please enable permissions and try again.' });
        }
      );
    }
  }

  useEffect(() => {
    getCurrentLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const clearInput = (field: 'from' | 'to') => {
    if (field === 'from') setFrom('');
    if (field === 'to') setTo('');
  }

  return (
    <div className="absolute top-0 left-0 right-0 p-4 md:top-8 md:left-8 md:right-auto md:w-[30rem] max-h-screen">
      <Card className="bg-[#121212]/80 backdrop-blur-xl border-secondary/20 shadow-2xl shadow-black/30 rounded-2xl animate-in fade-in-0 slide-in-from-top-4 duration-500 overflow-hidden">
        <CardContent className="p-4 md:p-6 max-h-[calc(100vh-4rem)] md:max-h-[calc(100vh-5rem)] overflow-y-auto">
          {!route ? (
            <div className="space-y-4">
               <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-white">Where to?</h2>
                <Button variant="ghost" size="icon" onClick={getCurrentLocation} className="h-9 w-9 text-muted-foreground hover:text-primary">
                    <LocateFixed className="h-5 w-5" />
                </Button>
               </div>
              <div className="relative">
                <AutocompleteInput
                  placeholder="Where are you now?"
                  value={from}
                  onPlaceSelect={(place) => handlePlaceSelect(place, 'from')}
                  onChange={(e) => setFrom(e.currentTarget.value)}
                  className="pl-4 pr-16"
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
                    {from && <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => clearInput('from')}><X className="h-4 w-4" /></Button>}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleVoiceInput('from')}>
                        <Mic className={`h-4 w-4 ${isListening && activeInput === 'from' ? 'text-destructive animate-pulse' : ''}`} />
                    </Button>
                </div>
              </div>
              <div className="relative">
                <AutocompleteInput
                  placeholder="Where do you want to go?"
                  value={to}
                  onPlaceSelect={(place) => handlePlaceSelect(place, 'to')}
                  onChange={(e) => setTo(e.currentTarget.value)}
                  className="pl-4 pr-16"
                />
                 <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
                    {to && <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => clearInput('to')}><X className="h-4 w-4" /></Button>}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleVoiceInput('to')}>
                        <Mic className={`h-4 w-4 ${isListening && activeInput === 'to' ? 'text-destructive animate-pulse' : ''}`} />
                    </Button>
                </div>
              </div>
              <Button onClick={handleFindRoute} disabled={isPending} size="lg" className="w-full font-semibold text-base bg-gradient-to-r from-primary to-orange-600 text-white shadow-lg shadow-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-primary/60 active:scale-100">
                {isPending ? <Loader2 className="animate-spin" /> : <><BusFront className="mr-2 h-5 w-5" /> Find Route</>}
              </Button>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
                <Button onClick={handleNewSearch} variant="ghost" className="mb-2 -ml-3 text-sm font-medium text-white hover:text-primary">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    New Search
                </Button>
                <RouteResults route={route} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
