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
        <div 
            className="absolute inset-0 z-0 opacity-10 dark:opacity-20"
            style={{
                backgroundImage: 'url("/karachi-skyline.svg")',
                backgroundSize: 'cover',
                backgroundPosition: 'bottom center',
                backgroundRepeat: 'no-repeat'
            }}
        ></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>

      <div className="relative text-center p-4 animate-in fade-in-0 slide-in-from-bottom-12 duration-1000">
        <div className="mb-8 inline-block rounded-full p-4 bg-primary/10 shadow-[0_0_40px_10px_hsl(var(--primary)/0.3)]">
           <Bus className="h-20 w-20 text-primary drop-shadow-[0_0_10px_hsl(var(--primary)/0.8)]" />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-lg">
          KarachiBus Navigator
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 md:text-xl max-w-lg mx-auto">
          Your smart companion for navigating the Karachi bus network with ease.
        </p>
        <Button
          size="lg"
          className="mt-12 text-lg font-semibold bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-primary/50 focus:ring-4 focus:ring-primary/50 transform hover:-translate-y-1 active:translate-y-0"
          onClick={onGetStarted}
        >
          Find My Route
        </Button>
      </div>
    </div>
  );
};

export default LandingView;
