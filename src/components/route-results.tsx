'use client';

import React from 'react';
import type { Route } from './main-view';
import { Button } from './ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { ArrowRight, Bus, Clock, MapPin, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AnimatedBus } from './icons/animated-bus';

interface RouteResultsProps {
  route: Route;
  onNewSearch: () => void;
}

export default function RouteResults({ route, onNewSearch }: RouteResultsProps) {
  const { toast } = useToast();

  const handleTextToSpeech = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
        toast({ variant: 'destructive', title: 'Not Supported', description: 'Text-to-speech is not supported in this browser.' });
        return;
    }
    const textToSpeak = route.isAiSuggestion 
        ? route.aiDetails ?? 'AI suggested route details are not available.'
        : `Take bus ${route.name}. The journey from ${route.start} to ${route.end} will take approximately ${route.time}.`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="animate-in fade-in space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-headline text-primary">Your Route</h2>
            <Button variant="ghost" size="icon" onClick={handleTextToSpeech} className="h-8 w-8">
                <Volume2 className="h-5 w-5" />
                <span className="sr-only">Read route details</span>
            </Button>
        </div>

        <div className="relative rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="p-4 space-y-3 text-sm">
                 <div className="flex items-center gap-3">
                    <Bus className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{route.name}</span>
                </div>
                <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="truncate">{route.start}</span>
                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground"/>
                    <span className="truncate">{route.end}</span>
                </div>
                <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Estimated time: {route.time}</span>
                </div>
                {route.aiDetails && (
                    <p className="text-sm text-muted-foreground pt-2">{route.aiDetails}</p>
                )}
            </div>
            <div className="absolute -right-12 -bottom-8 opacity-10">
                <AnimatedBus />
            </div>
        </div>

      {route.isAiSuggestion && (
        <div className="rounded-md border border-accent/50 bg-accent/10 p-3 text-sm text-accent-foreground">
          <p className="font-semibold">No direct route found.</p>
          <p>Here's a suggested connection:</p>
        </div>
      )}
      
      {route.stops.length > 0 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="stops">
            <AccordionTrigger>Show all stops</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 pl-4 border-l-2 border-primary ml-2">
                {route.stops.map((stop, index) => (
                  <li key={index} className="text-muted-foreground text-xs relative before:content-[''] before:absolute before:-left-[1.1rem] before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full before:bg-border before:border-2 before:border-primary">
                    {stop}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      <Button onClick={onNewSearch} variant="outline" className="w-full">
        New Search
      </Button>
    </div>
  );
}
