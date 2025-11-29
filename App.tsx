import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Featured from './components/Featured';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import { Submission } from './types';
import { Loader2, AlertTriangle } from 'lucide-react';

// Lazy load heavy components
const SubmissionForm = lazy(() => import('./components/SubmissionForm'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));

// Define interfaces for ErrorBoundary
interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Error Boundary to prevent White Screen on mobile/Instagram browsers
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("App Crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-brand-accent mb-4" />
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-slate-400 mb-6 max-w-xs mx-auto">We encountered an issue loading the experience.</p>
          <button 
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            className="px-6 py-2 bg-brand-accent rounded-full font-medium hover:bg-indigo-500 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper for home page content
const Home: React.FC = () => (
  <>
    <section id="home"><Hero /></section>
    <section id="about"><About /></section>
    <section id="featured"><Featured /></section>
    <section id="testimonials"><Testimonials /></section>
  </>
);

// Scroll to top on route change
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

// MAIN APP LOGIC COMPONENT
// Moved inside a child component so the ErrorBoundary in 'App' can actually catch errors here.
const AppContent: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const handleSubmission = (submission: Submission) => {
    setSubmissions((prev) => [submission, ...prev]);
  };

  // AI Welcome Message Logic
  useEffect(() => {
    // Flag to prevent double execution
    let hasPlayed = false;

    // Safety check function for Speech API
    const isSpeechAvailable = () => {
      try {
        return 'speechSynthesis' in window && !!window.speechSynthesis;
      } catch (e) {
        return false;
      }
    };

    // Safe session storage access
    const hasPlayedSession = () => {
      try {
        return sessionStorage.getItem('welcome_played');
      } catch (e) {
        return false;
      }
    };

    const setPlayedSession = () => {
      try {
        sessionStorage.setItem('welcome_played', 'true');
      } catch (e) {}
    };

    const handleWelcomeSpeech = () => {
      if (hasPlayed || hasPlayedSession()) {
        cleanupListeners();
        return;
      }

      if (!isSpeechAvailable()) {
        cleanupListeners();
        return;
      }

      try {
        // CRITICAL MOBILE FIX: Reset speech engine
        window.speechSynthesis.cancel();

        const text = "Welcome to The Creator's Hub";
        const utterance = new SpeechSynthesisUtterance(text);
        
        utterance.volume = 1;
        utterance.rate = 1.0; 
        utterance.pitch = 1;
        
        // Improve voice selection for Android/iOS
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => 
          v.name.includes('Google US English') || 
          v.name.includes('Samantha') || 
          (v.lang === 'en-US' && !v.name.includes('Microsoft David'))
        );

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onerror = (e) => {
            console.warn("Speech utterance error", e);
        };

        // Delay slightly to allow browser to register user interaction
        setTimeout(() => {
           try {
             window.speechSynthesis.speak(utterance);
           } catch (err) {
             console.warn("Speak failed", err);
           }
        }, 150);
        
        hasPlayed = true;
        setPlayedSession();
      } catch (e) {
        console.warn("Speech synthesis failed initialization:", e);
      }
      
      cleanupListeners();
    };

    const cleanupListeners = () => {
      ['click', 'touchstart', 'scroll', 'keydown'].forEach(event => 
        document.removeEventListener(event, handleWelcomeSpeech)
      );
    };

    // Pre-load voices safely
    try {
      if (isSpeechAvailable()) {
        window.speechSynthesis.getVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
          };
        }
      }
    } catch (e) {
      console.warn("Speech API access restricted");
    }

    // Attach listeners to DOCUMENT for better mobile capture
    // Use { passive: true } to improve scrolling performance
    ['click', 'touchstart', 'scroll', 'keydown'].forEach(event => 
      document.addEventListener(event, handleWelcomeSpeech, { once: true, passive: true })
    );

    return () => cleanupListeners();
  }, []);

  return (
    <div className="min-h-screen bg-brand-dark text-slate-200 font-sans selection:bg-brand-accent selection:text-white">
      <ScrollToTop />
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
  );
};

// ROOT APP COMPONENT
// Wraps everything in ErrorBoundary and Router
const App: React.FC = () => {
  useEffect(() => {
    console.log("The Creator's Hub - Version 2.6 (Safe Mode)");
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
};

export default App;