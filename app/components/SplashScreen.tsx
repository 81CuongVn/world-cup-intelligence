import { useEffect, useState } from 'react';

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    // Rotate the animation
    const rotationInterval = setInterval(() => {
      setRotation((prev) => (prev + 6) % 360);
    }, 30);

    // Auto-complete splash screen after 3.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for fade out
    }, 3500);

    return () => {
      clearInterval(rotationInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
    >
      {/* Animated background image with zoom/pan effect */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/world-cup-2026-team.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          animation: `zoomPan 6s ease-in-out infinite`,
        }}
      />
      
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Animated background with rotating gradient accent */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-conic from-cyan via-magenta to-green transition-all duration-300"
          style={{
            transform: `rotate(${rotation}deg)`,
            opacity: 0.1,
          }}
        />
      </div>

      {/* Main splash content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-8 animate-fade-in">
        {/* Rotating trophy with glow */}
        <div className="relative">
          {/* Outer glow rings */}
          <div
            className="absolute inset-0 rounded-full border-2 border-cyan/40"
            style={{
              transform: `scale(${1 + Math.sin(rotation * Math.PI / 180) * 0.1})`,
            }}
          />
          <div
            className="absolute inset-0 rounded-full border border-magenta/30"
            style={{
              transform: `scale(${1 + Math.sin((rotation + 120) * Math.PI / 180) * 0.1}) rotate(${rotation * 2}deg)`,
            }}
          />

          {/* Main trophy container */}
          <div
            className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-b from-yellow/20 to-yellow/5 shadow-2xl shadow-yellow/30"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: 'transform 0.03s linear',
            }}
          >
            <div className="text-7xl">🏆</div>
          </div>

          {/* Center pulse */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-20 w-20 rounded-full bg-yellow/20 blur-2xl animate-pulse" />
          </div>
        </div>

        {/* Rotating world cup text */}
        <div className="relative">
          <h1 className="text-center font-heading text-4xl font-bold text-white">
            WORLD CUP
          </h1>
          <div className="mt-2 text-center font-heading text-lg font-semibold text-cyan">
            INTELLIGENCE
          </div>

          {/* Loading indicator */}
          <div className="mt-8 flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full bg-cyan"
                style={{
                  animation: `pulse 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Rotating soccer balls decoration */}
        <div className="mt-8 flex gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                animation: `bounce 1.5s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
              className="text-3xl"
            >
              ⚽
            </div>
          ))}
        </div>
      </div>

      {/* Fade out overlay */}
      <div
        className="absolute inset-0 bg-black transition-opacity duration-500"
        style={{
          opacity: isVisible ? 0 : 1,
          pointerEvents: 'none',
        }}
      />

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-15px);
            opacity: 0.7;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes zoomPan {
          0% {
            transform: scale(1) translateX(0) translateY(0);
          }
          25% {
            transform: scale(1.05) translateX(10px) translateY(-10px);
          }
          50% {
            transform: scale(1.1) translateX(0) translateY(0);
          }
          75% {
            transform: scale(1.05) translateX(-10px) translateY(10px);
          }
          100% {
            transform: scale(1) translateX(0) translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }

        .bg-gradient-conic {
          background: conic-gradient(
            from var(--angle),
            #00e5ff,
            #ff2d8e,
            #22d46b,
            #00e5ff
          );
        }
      `}</style>
    </div>
  );
}
