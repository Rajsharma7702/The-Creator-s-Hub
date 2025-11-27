import React from 'react';
import { Mail, Instagram, Twitter, Linkedin, Heart, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const logoUrl = "https://image2url.com/images/1764231520143-c235690c-eba8-433e-aa38-c5617d1fb7e9.png";

  const footerLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Featured Creators', path: '/featured' },
    { name: 'Join the Movement', path: '/submit' },
    { name: 'Admin Portal', path: '/admin' },
  ];

  return (
    <footer className="bg-black py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src={logoUrl} 
                alt="The Creator's Hub Logo" 
                className="h-10 w-auto object-contain" 
              />
              <h3 className="text-2xl font-bold text-white">
                The Creator's Hub
              </h3>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Empowering artists, writers, dancers, and creators to shine globally. Together, we rise.
            </p>
          </div>
          
          {/* Quick Links Column - Dynamic & Interactive */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 border-b border-brand-accent/30 inline-block pb-1">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="group flex items-center text-slate-400 hover:text-white transition-colors duration-300"
                  >
                    <ChevronRight className="h-4 w-4 mr-2 text-brand-accent opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 border-b border-brand-accent/30 inline-block pb-1">Contact Us</h4>
            <div className="space-y-4">
              <a 
                href="mailto:the.creators.hubbb@gmail.com" 
                className="flex items-center text-slate-400 hover:text-brand-accent transition-colors group p-2 rounded-lg hover:bg-white/5 -ml-2"
              >
                <div className="bg-slate-800 p-2 rounded-full mr-3 group-hover:bg-brand-accent/20 transition-colors">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm">the.creators.hubbb@gmail.com</span>
              </a>
              
              <div className="flex space-x-4 mt-6">
                <a 
                  href="https://www.instagram.com/tch.inn/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-slate-800 p-3 rounded-full text-slate-400 hover:text-white hover:bg-pink-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-600/20"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="bg-slate-800 p-3 rounded-full text-slate-400 hover:text-white hover:bg-blue-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-400/20"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="bg-slate-800 p-3 rounded-full text-slate-400 hover:text-white hover:bg-blue-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-600/20"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
          <p className="text-slate-500 text-sm">© 2024 The Creator's Hub. All rights reserved.</p>
          <p className="text-slate-500 text-sm flex items-center justify-center">
            Made with <Heart className="h-4 w-4 text-brand-red mx-1 animate-pulse" /> for creators everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;