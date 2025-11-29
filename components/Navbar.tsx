import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const logoUrl = "https://image2url.com/images/1764231520143-c235690c-eba8-433e-aa38-c5617d1fb7e9.png";

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Featured', path: '/featured' },
    { name: 'Join Us', path: '/submit', isButton: true },
  ];

  const isActive = (path: string) => location.pathname === path;

  const playClickSound = () => {
    try {
      // Using the same bell/ding sound as the chatbot for consistency
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3");
      audio.volume = 0.6; // Matched to chatbot volume
      audio.play().catch(err => {
        // Silently fail if autoplay is blocked or format unsupported
      });
    } catch (e) {
      // Ignore audio construction errors (e.g. in some restricted webviews)
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-brand-dark/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-3" onClick={playClickSound}>
              <img 
                src={logoUrl} 
                alt="The Creator's Hub Logo" 
                className="h-16 w-auto object-contain" 
              />
              <span className="text-2xl font-bold tracking-tight text-white">
                The Creator's Hub
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navLinks.map((link) => (
                link.isButton ? (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={playClickSound}
                    className="px-6 py-2.5 rounded-full bg-brand-accent text-white font-medium text-sm transition-all duration-300 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:text-brand-accent hover:-translate-y-1 active:scale-95 shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={playClickSound}
                    className={`relative px-1 py-2 text-sm font-medium transition-all duration-300 group hover:text-brand-accent hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] ${
                      isActive(link.path) 
                        ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' 
                        : 'text-slate-300'
                    }`}
                  >
                    {link.name}
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-brand-accent rounded-full transform transition-all duration-300 origin-left ${
                      isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`} />
                  </Link>
                )
              ))}
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => {
                setIsOpen(!isOpen);
                playClickSound();
              }}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-dark border-b border-white/10 animate-in slide-in-from-top-5 duration-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => {
                  setIsOpen(false);
                  playClickSound();
                }}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  link.isButton
                    ? 'bg-brand-accent text-white text-center mt-4 hover:bg-indigo-500 shadow-lg shadow-brand-accent/20' 
                    : isActive(link.path)
                      ? 'text-brand-accent bg-white/5'
                      : 'text-gray-300 hover:text-white hover:bg-brand-accent/10 hover:translate-x-2'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;