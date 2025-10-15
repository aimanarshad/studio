"use client";

import { useState } from 'react';
import LandingView from '@/components/landing-view';
import MainView from '@/components/main-view';
import { APIProvider } from '@vis.gl/react-google-maps';

export default function Home() {
  const [isStarted, setIsStarted] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Configuration Error</h1>
          <p className="mt-2 text-muted-foreground">
            Google Maps API key is missing. Please add it to your environment variables.
          </p>
          <code className="mt-4 inline-block rounded bg-muted p-2 text-sm">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_API_KEY"
          </code>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey} libraries={['places']}>
      <main className="relative h-screen w-screen overflow-hidden bg-background">
        <div 
            className="absolute inset-0 z-0 opacity-20" 
            style={{
                backgroundImage: 'url("/bus-road-pattern.svg")', 
                backgroundSize: '400px', 
                backgroundRepeat: 'repeat'
            }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background z-0"></div>

        <LandingView isVisible={!isStarted} onGetStarted={() => setIsStarted(true)} />
        
        <div className={`transition-all duration-1000 ease-in-out ${isStarted ? 'opacity-100' : 'opacity-0'}`}>
            {isStarted && <MainView />}
        </div>
      </main>
    </APIProvider>
  );
}
