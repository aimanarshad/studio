'use client';

import React from 'react';
import type { Route } from './main-view';
import { Button } from './ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { ArrowRight, Bus, Clock, MapPin, Route as RouteIcon, Volume2, AlertTriangle, Users, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

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

  const renderAiDetails = () => {
    if (!route.aiDetails) return null;
    const steps = route.aiDetails.split(/(Step \d+:)/).filter(Boolean);
    const stepItems = [];

    for (let i = 0; i < steps.length; i += 2) {
      const stepTitle = steps[i];
      const stepDescription = steps[i+1];
      
      let icon = <ArrowRight className="h-5 w-5 text-secondary flex-shrink-0" />;
      if (stepDescription.includes('Take')) icon = <Bus className="h-5 w-5 text-primary flex-shrink-0" />;
      if (stepDescription.includes('Transfer')) icon = <Users className="h-5 w-5 text-secondary flex-shrink-0" />;
      if (stepDescription.includes('Arrive')) icon = <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />;

      stepItems.push(
          <div key={i} className="flex items-start gap-3">
              {icon}
              <p className="text-base text-white/90">
                <span className="font-semibold">{stepTitle}</span>
                {stepDescription}
              </p>
          </div>
      )
    }

    return (
        <div className="space-y-3 pt-3 border-t border-white/10 mt-3">
            {stepItems}
        </div>
    );
  }

  return (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-headline text-primary">{route.name}</h2>
            <Button variant="ghost" size="icon" onClick={handleTextToSpeech} className="h-9 w-9 text-muted-foreground hover:text-primary">
                <Volume2 className="h-5 w-5" />
                <span className="sr-only">Read route details</span>
            </Button>
        </div>
        
        <div className="relative rounded-xl border border-white/10 bg-card/70 backdrop-blur-lg text-white shadow-lg overflow-hidden">
            {route.image && (
                <div className="relative h-40 w-full">
                    <Image
                        src={route.image}
                        alt="Bus image"
                        fill
                        className="object-cover"
                        data-ai-hint="modern bus"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <span className="font-bold text-5xl text-white drop-shadow-lg">{route.number}</span>
                    </div>
                </div>
            )}
            <div className="p-4 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="text-base">
                        <p className="font-medium text-white/80">From</p>
                        <p className="font-semibold">{route.start}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                     <div className="text-base">
                        <p className="font-medium text-white/80">To</p>
                        <p className="font-semibold">{route.end}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-base">Estimated time: <strong>{route.time}</strong></span>
                </div>

                {route.isAiSuggestion ? renderAiDetails() : null}
            </div>
        </div>

      {route.isAiSuggestion && (
        <div className="flex items-center gap-3 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-3 text-sm text-yellow-300">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-semibold">No direct route found.</p>
            <p>Here's a suggested connection to get you there.</p>
          </div>
        </div>
      )}
      
      {route.stops.length > 0 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="stops" className="border-b-0">
            <AccordionTrigger className="hover:no-underline rounded-md px-4 bg-background/50 hover:bg-accent">
                <div className="flex items-center gap-2 font-medium">
                    <RouteIcon className="h-5 w-5 text-primary" />
                    <span>Show all stops</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2">
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
