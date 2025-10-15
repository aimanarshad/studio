import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { AnimatedBus } from '@/components/icons/animated-bus';

interface LandingViewProps {
  isVisible: boolean;
  onGetStarted: () => void;
}

const LandingView: FC<LandingViewProps> = ({ isVisible, onGetStarted }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/50 backdrop-blur-md transition-opacity duration-1000 animate-in fade-in">
      <div className="text-center">
        <div className="mb-8">
          <AnimatedBus />
        </div>
        <h1 className="font-headline text-5xl font-bold tracking-tight text-primary drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] md:text-7xl">
          KarachiBus Navigator
        </h1>
        <p className="mt-4 text-lg text-foreground/70 md:text-xl">
          Find your route. Catch your ride.
        </p>
        <Button
          size="lg"
          className="mt-12 animate-pulse bg-primary/90 hover:bg-primary shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105"
          onClick={onGetStarted}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default LandingView;
