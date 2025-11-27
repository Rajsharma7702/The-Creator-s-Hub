import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
// Keep Home components eager for instant visible content, or lazy load if bundle is too big.
// For smooth scrolling on home, we keep them imported standardly, 
// but we lazy load the separate routes (Submit/Admin) to save bandwidth.
import About from './components/About';
import Featured from './components/Featured';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import { Submission } from './types';
import { Loader2 } from 'lucide-react';

// Lazy load heavy components
const SubmissionForm = lazy(() => import('./components/SubmissionForm'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));

// Wrapper for home page content to keep route config clean
const Home: React.FC = () => (
  <>
    <section id="home"><Hero /></section>
    <section id="about"><About /></section>
    <section id="featured"><Featured /></section>
    <section id="testimonials"><Testimonials /></section>
  </>
);

// Wrapper to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Loading fallback for lazy routes
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Loader2 className="h-10 w-10 animate-spin text-brand-accent" />
  </div>
);

const App: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const handleSubmission = (submission: Submission) => {
    setSubmissions((prev) => [submission, ...prev]);
  };

  // AI Welcome Message Logic
  useEffect(() => {
    const handleWelcomeSpeech = () => {
      // Check if we've already welcomed the user in this session
      if (sessionStorage.getItem('welcome_played')) return;

      // Create the utterance
      const text = "Welcome to The Creator's Hub";
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configuration for a pleasant AI voice
      utterance.volume = 1;
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1;
      
      // Attempt to set a high-quality voice if available (async)
      const voices = window.speechSynthesis.getVoices();
      // Try to find a standard English voice
      const preferredVoice = voices.find(v => v.lang === 'en-US' && !v.name.includes('Microsoft David'));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      // Speak
      window.speechSynthesis.speak(utterance);
      
      // Mark as played
      sessionStorage.setItem('welcome_played', 'true');
      
      // Clean up listeners
      cleanupListeners();
    };

    const cleanupListeners = () => {
      ['click', 'touchstart', 'keydown'].forEach(event => 
        window.removeEventListener(event, handleWelcomeSpeech)
      );
    };

    // Browsers often block autoplaying audio. We attach the welcome sound 
    // to the first user interaction to ensure it plays successfully.
    ['click', 'touchstart', 'keydown'].forEach(event => 
      window.addEventListener(event, handleWelcomeSpeech, { once: true })
    );

    return () => cleanupListeners();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-brand-dark text-slate-200 font-sans selection:bg-brand-accent selection:text-white">
        <Navbar />
        
        <div className="pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/featured" element={<Featured />} />
            <Route path="/submit" element={
              <Suspense fallback={<PageLoader />}>
                <div className="py-24 px-4">
                  <SubmissionForm onSubmit={handleSubmission} />
                </div>
              </Suspense>
            } />
            <Route path="/admin" element={
              <Suspense fallback={<PageLoader />}>
                <AdminPanel submissions={submissions} />
              </Suspense>
            } />
          </Routes>
        </div>

        <Footer />
        <Chatbot />
      </div>
    </Router>
  );
};

export default App;