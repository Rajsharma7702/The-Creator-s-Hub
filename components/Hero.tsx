import React, { useEffect, useRef } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  // PERFORMANCE OPTIMIZATION: 
  // Instead of using useState which triggers a full component re-render on every mouse pixel movement,
  // we use useRef to directly manipulate the DOM elements. This is significantly faster/smoother.
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Use requestAnimationFrame to sync with the browser's refresh rate
      requestAnimationFrame(() => {
        const { innerWidth, innerHeight } = window;
        const xOffset = (e.clientX / innerWidth - 0.5) * 40;
        const yOffset = (e.clientY / innerHeight - 0.5) * 40;

        if (blob1Ref.current) {
          blob1Ref.current.style.transform = `translate(${-xOffset * 2}px, ${-yOffset * 2}px)`;
        }
        if (blob2Ref.current) {
          blob2Ref.current.style.transform = `translate(${xOffset * 1.5}px, ${yOffset * 1.5}px)`;
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic Background gradients with Parallax - Optimized with Refs */}
      <div 
        ref={blob1Ref}
        className="absolute top-0 left-1/4 w-96 h-96 bg-brand-accent/20 rounded-full blur-[128px] pointer-events-none transition-transform duration-100 ease-out will-change-transform"
      />
      <div 
        ref={blob2Ref}
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none transition-transform duration-100 ease-out will-change-transform"
      />

      {/* Floating accent elements */}
      <div className="absolute top-20 right-20 w-4 h-4 bg-brand-accent/50 rounded-full blur-sm animate-pulse" />
      <div className="absolute bottom-40 left-10 w-6 h-6 bg-purple-500/30 rounded-full blur-sm animate-bounce duration-[3000ms]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-in fade-in zoom-in duration-1000">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
            <span className="block text-white drop-shadow-sm">Together, we rise.</span>
            <span className="bg-gradient-to-r from-brand-accent via-indigo-400 to-purple-500 text-transparent bg-clip-text animate-gradient-x bg-[length:200%_auto]">
              Together, we create.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed px-2">
            The Creator’s Hub is a global stage for the underrated. We amplify the voices of artists, dancers, writers, and innovators who deserve to be seen.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link
              to="/submit"
              className="group inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-full text-white bg-brand-accent hover:bg-indigo-500 transition-all shadow-lg hover:shadow-brand-accent/25 hover:-translate-y-1"
            >
              Start Creating
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/featured"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-full text-white border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all"
            >
              Explore Talent
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-8 w-8 text-slate-500/50 hover:text-slate-300 transition-colors cursor-pointer" />
      </div>
    </div>
  );
};

export default Hero;