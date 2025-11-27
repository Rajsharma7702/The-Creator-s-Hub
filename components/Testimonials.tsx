import React from 'react';
import { Quote } from 'lucide-react';
import { Testimonial } from '../types';

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Anusha',
    role: 'Featured for Evil Eye Artwork',
    quote: "The Creator's Hub gave my 'Evil Eye' collection the spotlight it needed. The community here is incredibly supportive.",
  },
  {
    id: '2',
    name: 'Nishikant',
    role: 'Featured for Dance Reel',
    quote: "Sharing my dance reels here connected me with collaborators across the globe. It's more than a platform; it's a family.",
  },
  {
    id: '3',
    name: 'Aditi',
    role: 'Featured for poem “Bekhof Soch”',
    quote: "When I published 'Bekhof Soch', I was nervous. The feedback I received here gave me the confidence to keep writing.",
  },
  {
    id: '4',
    name: 'Kanishka',
    role: 'Featured for Artwork',
    quote: "Being able to share my art with such a supportive community has been incredible. This platform truly understands creators.",
  }
];

const Testimonials: React.FC = () => {
  return (
    <div className="py-24 bg-brand-dark relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Voices of the Hub</h2>
          <p className="mt-4 text-slate-400 text-lg">Hear from the artists rising with us.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-slate-800/40 backdrop-blur-sm border border-white/5 rounded-2xl p-8 hover:border-brand-accent/30 transition-colors relative group flex flex-col h-full">
              <Quote className="h-8 w-8 text-brand-accent mb-6 opacity-50 group-hover:opacity-100 transition-opacity" />
              <p className="text-slate-300 italic mb-6 leading-relaxed flex-grow">
                "{testimonial.quote}"
              </p>
              <div className="border-t border-white/5 pt-4">
                <h4 className="font-bold text-white">{testimonial.name}</h4>
                <p className="text-xs text-slate-500 uppercase tracking-wider">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;