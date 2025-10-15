import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Bus } from 'lucide-react';

interface LandingViewProps {
  isVisible: boolean;
  onGetStarted: () => void;
}

const LandingView: FC<LandingViewProps> = ({ isVisible, onGetStarted }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center transition-opacity duration-1000 animate-in fade-in">
      <div className="text-center p-4">
        <div className="mb-8 inline-block rounded-full bg-primary/10 p-6 shadow-lg">
           <Bus className="h-16 w-16 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold tracking-tight text-primary-foreground drop-shadow-lg md:text-7xl" style={{color: 'hsl(var(--primary))'}}>
          KarachiBus Navigator
        </h1>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl max-w-md mx-auto">
          Your smart companion for navigating the Karachi bus network with ease.
        </p>
        <Button
          size="lg"
          className="mt-12 text-lg font-semibold bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-primary/50 focus:ring-4 focus:ring-primary/50 transform hover:-translate-y-1"
          onClick={onGetStarted}
        >
          Find My Route
        </Button>
      </div>
    </div>
  );
};

export default LandingView;
