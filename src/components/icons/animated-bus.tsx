import React from 'react';

export function AnimatedBus({className}: {className?: string}) {
  return (
    <div className={`relative h-20 w-40 ${className}`}>
      <style jsx>{`
        @keyframes drive-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .bus-body {
          animation: drive-bounce 0.5s ease-in-out infinite;
        }
      `}</style>
      <div className="bus-body absolute bottom-4 left-1/2 -translate-x-1/2">
        <svg
          width="90"
          height="50"
          viewBox="0 0 100 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M85 10H15C12.2386 10 10 12.2386 10 15V40C10 42.7614 12.2386 45 15 45H20V50C20 52.7614 22.2386 55 25 55C27.7614 55 30 52.7614 30 50V45H70V50C70 52.7614 72.2386 55 75 55C77.7614 55 80 52.7614 80 50V45H85C87.7614 45 90 42.7614 90 40V15C90 12.2386 87.7614 10 85 10Z" className="fill-primary" />
          <path d="M10 25H90V35H10V25Z" className="fill-secondary" />
          <rect x="15" y="15" width="70" height="10" fill="white" fillOpacity="0.5"/>
        </svg>
      </div>
    </div>
  );
}
