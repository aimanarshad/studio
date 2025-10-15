import React from 'react';

export function AnimatedBus() {
  return (
    <div className="relative h-24 w-48">
      <style jsx>{`
        .bus {
          animation: drive 4s linear infinite;
        }
        .road {
          animation: move-road 0.5s linear infinite;
        }
        @keyframes drive {
          0% { transform: translateX(-150px) scale(0.8); opacity: 0; }
          20% { transform: translateX(0) scale(1); opacity: 1; }
          80% { transform: translateX(0) scale(1); opacity: 1; }
          100% { transform: translateX(150px) scale(0.8); opacity: 0; }
        }
        @keyframes move-road {
          0% { transform: translateX(0); }
          100% { transform: translateX(-20px); }
        }
      `}</style>
      <div className="bus absolute bottom-4 left-1/2 -translate-x-1/2">
        <svg
          width="100"
          height="60"
          viewBox="0 0 100 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="fill-primary"
        >
          <path d="M85 10H15C12.2386 10 10 12.2386 10 15V40C10 42.7614 12.2386 45 15 45H20V50C20 52.7614 22.2386 55 25 55C27.7614 55 30 52.7614 30 50V45H70V50C70 52.7614 72.2386 55 75 55C77.7614 55 80 52.7614 80 50V45H85C87.7614 45 90 42.7614 90 40V15C90 12.2386 87.7614 10 85 10Z" />
          <path d="M10 25H90V35H10V25Z" fill="hsl(var(--accent))" />
          <rect x="15" y="15" width="70" height="10" className="fill-background/50" />
        </svg>
      </div>
      <div className="road absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
        <div className="absolute top-0 left-0 flex h-full">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="h-full w-2.5 bg-foreground/50 mr-2.5"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
