import React from 'react';
import { Creator } from '../types';

const creators: Creator[] = [
  {
    id: '1',
    name: 'Anusha',
    category: 'Art',
    workImage: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=400', 
    description: 'Renowned for her mesmerizing "Evil Eye" artwork series that blends traditional motifs with modern abstraction.'
  },
  {
    id: '2',
    name: 'Nishikant',
    category: 'Dance',
    workImage: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=400',
    description: 'A contemporary dancer whose viral reel captured the raw emotion of street dance.'
  },
  {
    id: '3',
    name: 'Aditi',
    category: 'Writing',
    workImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=400',
    description: 'Poet and storyteller, featured for her soul-stirring piece titled "Bekhof Soch".'
  },
  {
    id: '4',
    name: 'Kanishka',
    category: 'Art',
    workImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=400',
    description: 'Showcasing her breathtaking artwork that effortlessly blends vivid imagination with intricate techniques to create visual magic.'
  }
];

const Featured: React.FC = () => {
  return (
    <div className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 text-center">
          Featured <span className="text-brand-accent">Creators</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {creators.map((creator) => (
            <div key={creator.id} className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 transition-transform duration-300 hover:-translate-y-2">
              <div className="aspect-w-4 aspect-h-3 w-full overflow-hidden">
                <img 
                  src={creator.workImage} 
                  alt={creator.name} 
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-6">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-brand-accent/20 text-brand-accent mb-3">
                  {creator.category}
                </span>
                <h3 className="text-xl font-bold text-white mb-2">{creator.name}</h3>
                <p className="text-slate-400 text-sm line-clamp-3">
                  {creator.description}
                </p>
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Featured;