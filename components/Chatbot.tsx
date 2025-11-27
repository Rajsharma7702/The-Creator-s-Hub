import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles, Mail, User, CheckCircle, AlertCircle } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState("");
  const [view, setView] = useState<'chat' | 'contact'>('chat'); // 'chat' or 'contact'
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: "Hi! I'm the Creative Assistant. How can I help you showcase your talent today?" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSendingContact, setIsSendingContact] = useState(false);
  const [contactStatus, setContactStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (view === 'chat') {
      scrollToBottom();
    }
  }, [messages, isOpen, view]);

  // Initialize audio and notification timers
  useEffect(() => {
    // New crisp bell/ding sound
    audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3");
    
    if (audioRef.current) {
      audioRef.current.volume = 0.6; 
    }
    
    // Timer 1: First greeting after 3 seconds
    const timer1 = setTimeout(() => {
      if (!isOpen) {
        setNotificationText("Thank you! for visiting The Creator's Hub");
        setShowNotification(true);
        // Attempt to play sound
        audioRef.current?.play().catch(error => {
          console.log("Audio autoplay prevented:", error);
        });
      }
    }, 3000); 

    // Timer 2: Second greeting after 8 seconds (5 seconds after the first)
    const timer2 = setTimeout(() => {
      if (!isOpen) {
        setNotificationText("Hello! May I assist you?");
        // Play sound again for the new message
        audioRef.current?.play().catch(error => {
          console.log("Audio autoplay prevented:", error);
        });
      }
    }, 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!isOpen) {
      setIsOpen(true);
      setShowNotification(false);
    } else {
      setIsOpen(false);
    }
  };

  // --- Chat Logic ---
  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(userMsg.text);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  // --- Contact Form Logic ---
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingContact(true);
    setContactStatus('idle');

    try {
      const response = await fetch("https://formspree.io/f/mnnkpdbo", {
        method: "POST",
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          message: contactForm.message,
          _replyto: contactForm.email,
          _subject: `New Chatbot Lead: ${contactForm.name}`,
        }),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setContactStatus('success');
        setContactForm({ name: '', email: '', message: '' });
        // Optional: switch back to chat after delay
        setTimeout(() => {
          setContactStatus('idle');
          setView('chat');
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'model',
            text: "I've sent your message to the team! They'll reach out to you soon via email."
          }]);
        }, 3000);
      } else {
        setContactStatus('error');
      }
    } catch (error) {
      setContactStatus('error');
    } finally {
      setIsSendingContact(false);
    }
  };

  return (
    <div className={`fixed z-50 flex flex-col items-end ${isOpen ? 'inset-0 sm:inset-auto sm:bottom-6 sm:right-6' : 'bottom-4 right-4 sm:bottom-6 sm:right-6'}`}>
      {/* Notification Bubble */}
      {!isOpen && showNotification && (
        <div className="mb-4 mr-2 bg-white text-brand-dark px-4 py-3 rounded-xl rounded-br-none shadow-xl border border-brand-accent/20 animate-in fade-in slide-in-from-bottom-2 duration-500 relative max-w-[220px]">
          <button 
            onClick={() => setShowNotification(false)}
            className="absolute -top-2 -left-2 bg-slate-200 rounded-full p-0.5 hover:bg-slate-300 transition-colors"
          >
            <X className="h-3 w-3 text-slate-600" />
          </button>
          <p className="text-sm font-medium leading-snug">{notificationText}</p>
          {/* Triangle pointer */}
          <div className="absolute -bottom-2 right-0 w-0 h-0 border-l-[10px] border-l-transparent border-t-[10px] border-t-white border-r-[0px] border-r-transparent"></div>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={handleToggle}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-accent text-white shadow-lg shadow-brand-accent/30 transition-all hover:scale-110 hover:shadow-brand-accent/50"
        >
          <MessageCircle className="h-7 w-7" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-400"></span>
          </span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 sm:static sm:inset-auto w-full h-[100dvh] sm:w-[400px] sm:h-[550px] bg-brand-dark sm:border sm:border-white/10 sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300 flex flex-col z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-brand-accent to-indigo-700 shadow-md z-10 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-white" />
              <h3 className="font-semibold text-white">
                {view === 'chat' ? 'Assistant' : 'Contact Team'}
              </h3>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setView(view === 'chat' ? 'contact' : 'chat')}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                title={view === 'chat' ? "Contact Team" : "Back to Chat"}
              >
                {view === 'chat' ? <Mail className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden relative bg-slate-900/50 flex flex-col">
            
            {/* VIEW: CHAT */}
            {view === 'chat' && (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-brand-accent text-white rounded-br-none shadow-md shadow-brand-accent/10'
                            : 'bg-slate-700 text-slate-100 rounded-bl-none border border-slate-600'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-700 px-4 py-2 rounded-2xl rounded-bl-none flex items-center gap-2 border border-slate-600">
                        <Loader2 className="h-3 w-3 animate-spin text-brand-accent" />
                        <span className="text-xs text-slate-300">Thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-3 bg-slate-800 border-t border-white/5 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Ask me anything..."
                      className="flex-1 bg-slate-900 text-slate-200 text-sm rounded-full px-4 py-3 border border-white/10 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent placeholder-slate-500"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!inputText.trim() || isLoading}
                      className="p-3 bg-brand-accent rounded-full text-white disabled:opacity-50 hover:bg-indigo-500 transition-colors shadow-lg shadow-brand-accent/20"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: CONTACT FORM */}
            {view === 'contact' && (
              <div className="h-full overflow-y-auto p-6 animate-in slide-in-from-right-10 duration-300">
                 <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Mail className="h-6 w-6 text-brand-accent" />
                    </div>
                    <h4 className="text-white font-semibold">Get in Touch</h4>
                    <p className="text-slate-400 text-xs mt-1">Leave a message and we'll connect via email.</p>
                 </div>

                 {contactStatus === 'success' ? (
                   <div className="flex flex-col items-center justify-center h-48 text-center space-y-3 animate-in fade-in zoom-in">
                      <CheckCircle className="h-12 w-12 text-green-400" />
                      <p className="text-white font-medium">Message Sent!</p>
                      <p className="text-sm text-slate-400">Check your inbox soon.</p>
                   </div>
                 ) : (
                   <form onSubmit={handleContactSubmit} className="space-y-4">
                      {contactStatus === 'error' && (
                        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-xs text-red-200">
                          <AlertCircle className="h-4 w-4" />
                          <span>Failed to send. Please try again.</span>
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-medium ml-1">Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                          <input 
                            type="text" 
                            name="name"
                            value={contactForm.name}
                            onChange={handleContactChange}
                            required
                            className="w-full bg-slate-800 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                            placeholder="Your Name"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-medium ml-1">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                          <input 
                            type="email" 
                            name="email"
                            value={contactForm.email}
                            onChange={handleContactChange}
                            required
                            className="w-full bg-slate-800 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-medium ml-1">Message</label>
                        <textarea 
                          name="message"
                          value={contactForm.message}
                          onChange={handleContactChange}
                          required
                          rows={4}
                          className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent resize-none"
                          placeholder="How can we help you?"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSendingContact}
                        className="w-full bg-brand-accent hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                      >
                        {isSendingContact ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        {isSendingContact ? 'Sending...' : 'Send Message'}
                      </button>
                   </form>
                 )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;