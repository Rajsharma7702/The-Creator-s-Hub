import React from 'react';
import { Target, Lightbulb, Heart } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="py-24 bg-slate-900/50 relative overflow-hidden">
       {/* Background accent */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-base text-brand-accent font-semibold tracking-wide uppercase">Who We Are</h2>
          <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-white sm:text-4xl">
            Empowering the Talent
          </p>
          <p className="mt-4 max-w-2xl text-xl text-slate-400 mx-auto">
            The Creator’s Hub exists to bridge the gap between hidden talent and global recognition. We believe every artist deserves a stage.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="group bg-slate-800/40 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-brand-accent/50 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-accent/10">
            <div className="w-14 h-14 bg-brand-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-accent group-hover:rotate-6 transition-all duration-300">
              <Heart className="h-7 w-7 text-brand-accent group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Our Purpose</h3>
            <p className="text-slate-400 leading-relaxed">
              To build a supportive ecosystem where creativity thrives without boundaries. We value authenticity, passion, and the raw power of expression.
            </p>
          </div>

          <div className="group bg-slate-800/40 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10">
            <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500 group-hover:rotate-6 transition-all duration-300">
              <Target className="h-7 w-7 text-purple-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Our Mission</h3>
            <p className="text-slate-400 leading-relaxed">
              To uplift creators across all domains—art, music, dance, writing, and more—providing them with the tools and exposure needed to succeed.
            </p>
          </div>

          <div className="group bg-slate-800/40 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-pink-500/50 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-500/10">
            <div className="w-14 h-14 bg-pink-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pink-500 group-hover:rotate-6 transition-all duration-300">
              <Lightbulb className="h-7 w-7 text-pink-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Our Vision</h3>
            <p className="text-slate-400 leading-relaxed">
              A world where talent is the only currency that matters, and where every creator has the opportunity to inspire a global audience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;