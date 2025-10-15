import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Bus } from 'lucide-react';
import Image from 'next/image';

interface LandingViewProps {
  isVisible: boolean;
  onGetStarted: () => void;
}

const LandingView: FC<LandingViewProps> = ({ isVisible, onGetStarted }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center transition-opacity duration-1000 animate-in fade-in bg-background">
      <Image
        src="https://picsum.photos/seed/karachi-bus/1200/800"
        alt="Modern Karachi bus on an urban road"
        fill
        className="object-cover"
        data-ai-hint="modern bus urban"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-0"></div>
       <div className="absolute inset-0 bg-[#121212]/50 z-0"></div>


      <div className="relative text-center p-4 animate-in fade-in-0 slide-in-from-bottom-12 duration-1000 z-10">
        <div className="mb-8 inline-block rounded-full p-4 bg-primary/10 shadow-[0_0_60px_20px_hsl(var(--primary)/0.4)]">
           <Bus className="h-20 w-20 text-primary drop-shadow-[0_0_15px_hsl(var(--primary)/0.9)]" />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight drop-shadow-lg">
          <span className="text-primary">KarachiBus</span>
          <span className="text-white"> Navigator</span>
        </h1>
        <p className="mt-4 text-lg text-slate-300 md:text-xl max-w-lg mx-auto">
          Your smart companion for navigating the Karachi bus network with ease.
        </p>
        <Button
          size="lg"
          className="mt-12 text-lg font-semibold bg-gradient-to-r from-primary to-orange-600 text-white shadow-lg shadow-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-primary/60 focus:ring-4 focus:ring-primary/50 transform hover:-translate-y-1 active:translate-y-0"
          onClick={onGetStarted}
        >
          Find My Route
        </Button>
      </div>
    </div>
  );
};

export default LandingView;
