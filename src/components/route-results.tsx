'use client';

import React from 'react';
import type { Route } from './main-view';
import { Button } from './ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { ArrowRight, Bus, Clock, MapPin, Route as RouteIcon, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RouteResultsProps {
  route: Route;
}

export default function RouteResults({ route }: RouteResultsProps) {
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
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-headline text-primary">Your Route</h2>
            <Button variant="ghost" size="icon" onClick={handleTextToSpeech} className="h-8 w-8 text-muted-foreground hover:text-primary">
                <Volume2 className="h-5 w-5" />
                <span className="sr-only">Read route details</span>
            </Button>
        </div>

        <div className="relative rounded-xl border border-border bg-background/50 backdrop-blur-sm text-foreground shadow-lg overflow-hidden">
            <div 
                className="absolute inset-0 z-0 opacity-5" 
                style={{
                    backgroundImage: 'url("/bus-road-pattern.svg")', 
                    backgroundSize: '300px', 
                    backgroundRepeat: 'repeat',
                    transform: 'rotate(10deg) scale(1.5)',
                }}
            ></div>
            <div className="relative z-10 p-4 space-y-4 text-sm">
                 <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Bus className="h-6 w-6" />
                    </div>
                    <span className="font-semibold text-xl">{route.name}</span>
                </div>
                <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex flex-col gap-1 text-base">
                      <span className="truncate font-medium">{route.start}</span>
                      <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground my-1"/>
                      <span className="truncate font-medium">{route.end}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-base">Estimated time: <strong>{route.time}</strong></span>
                </div>
                {route.aiDetails && (
                    <p className="text-base text-primary-foreground/90 pt-3 border-t border-border/50 mt-3">{route.aiDetails}</p>
                )}
            </div>
        </div>

      {route.isAiSuggestion && (
        <div className="rounded-lg border border-secondary/50 bg-secondary/10 p-3 text-sm text-secondary-foreground/90">
          <p className="font-semibold">No direct route found.</p>
          <p>Here's a suggested connection to get you there.</p>
        </div>
      )}
      
      {route.stops.length > 0 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="stops" className="border-b-0">
            <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                    <RouteIcon className="h-5 w-5 text-primary" />
                    <span>Show all stops</span>
                </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3 pl-4 border-l-2 border-primary ml-2 mt-2">
                {route.stops.map((stop, index) => (
                  <li key={index} className="text-muted-foreground text-sm relative before:content-[''] before:absolute before:-left-[1.15rem] before:top-1/2 before:-translate-y-1/2 before:w-2.5 before:h-2.5 before:rounded-full before:bg-background before:border-2 before:border-primary">
                    {stop}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
