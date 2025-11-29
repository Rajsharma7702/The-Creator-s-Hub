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

  // Log version for debugging deployment
  useEffect(() => {
    console.log("The Creator's Hub - Version 2.2 (Mobile Voice Fix)");
  }, []);

  // AI Welcome Message Logic
  useEffect(() => {
    // Flag to prevent double execution
    let hasPlayed = false;

    const handleWelcomeSpeech = () => {
      if (hasPlayed || sessionStorage.getItem('welcome_played')) {
        cleanupListeners();
        return;
      }

      // CRITICAL MOBILE FIX:
      // Mobile browsers often get 'stuck' if speech was interrupted or not reset.
      // Calling cancel() ensures a fresh state for the synthesizer.
      window.speechSynthesis.cancel();

      const text = "Welcome to The Creator's Hub";
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configuration for a pleasant AI voice
      // Note: Mobile browsers might ignore rate/pitch, but we set them anyway.
      utterance.volume = 1;
      utterance.rate = 1.0; // Standard speed is safer for mobile compatibility
      utterance.pitch = 1;
      
      // Attempt to set a high-quality voice
      const voices = window.speechSynthesis.getVoices();
      
      // Priority: 
      // 1. Google US English (Android high quality)
      // 2. Samantha (iOS high quality)
      // 3. Any English US voice
      // 4. Default
      const preferredVoice = voices.find(v => 
        v.name.includes('Google US English') || 
        v.name.includes('Samantha') || 
        (v.lang === 'en-US' && !v.name.includes('Microsoft David'))
      );

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      // Speak
      window.speechSynthesis.speak(utterance);
      
      // Mark as played locally and in session
      hasPlayed = true;
      sessionStorage.setItem('welcome_played', 'true');
      
      // Clean up listeners immediately to prevent double triggers
      cleanupListeners();
    };

    const cleanupListeners = () => {
      ['click', 'touchstart', 'scroll', 'keydown'].forEach(event => 
        document.removeEventListener(event, handleWelcomeSpeech)
      );
    };

    // Pre-load voices (Android Chrome sometimes needs this kickstart)
    window.speechSynthesis.getVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        // Just trigger a get to ensure they populate
        window.speechSynthesis.getVoices();
      };
    }

    // Attach listeners to DOCUMENT for better capture on mobile
    // 'scroll' is added because sometimes users scroll before tapping
    ['click', 'touchstart', 'scroll', 'keydown'].forEach(event => 
      document.addEventListener(event, handleWelcomeSpeech, { once: true, passive: true })
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