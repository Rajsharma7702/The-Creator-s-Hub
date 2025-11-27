import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Featured from './components/Featured';
import Testimonials from './components/Testimonials';
import SubmissionForm from './components/SubmissionForm';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import { Submission } from './types';

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

const App: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const handleSubmission = (submission: Submission) => {
    setSubmissions((prev) => [submission, ...prev]);
  };

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
              <div className="py-24 px-4">
                <SubmissionForm onSubmit={handleSubmission} />
              </div>
            } />
            <Route path="/admin" element={<AdminPanel submissions={submissions} />} />
          </Routes>
        </div>

        <Footer />
        <Chatbot />
      </div>
    </Router>
  );
};

export default App;
