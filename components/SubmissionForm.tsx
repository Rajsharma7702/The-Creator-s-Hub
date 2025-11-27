import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader2, Link as LinkIcon } from 'lucide-react';
import { Submission } from '../types';

interface SubmissionFormProps {
  onSubmit: (submission: Submission) => void;
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Art',
    description: '',
    link: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing again
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file size (limit to 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setErrorMessage("File size exceeds 10MB limit. Please upload a smaller file.");
        setStatus('error');
        setFile(null);
        e.target.value = ''; // Reset input
        return;
      }

      setFile(selectedFile);
      if (status === 'error') {
        setStatus('idle');
        setErrorMessage('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.description) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    // Construct a detailed message body
    let fullMessage = `Description:\n${formData.description}\n\n`;
    
    if (formData.link) {
      fullMessage += `Work Link: ${formData.link}\n\n`;
    }
    
    if (file) {
      fullMessage += `[System Note]: User selected file: "${file.name}" (Size: ${(file.size / 1024).toFixed(2)} KB). File not uploaded to avoid errors, see description.`;
    }

    // Prepare JSON payload for cleaner submission
    const formJson = {
      name: formData.name,
      email: formData.email,
      _replyto: formData.email, 
      category: formData.category,
      _subject: `New Creator Submission: ${formData.name} - ${formData.category}`,
      message: fullMessage,
      link: formData.link
    };

    try {
      const response = await fetch("https://formspree.io/f/mnnkpdbo", {
        method: "POST",
        body: JSON.stringify(formJson),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        // Update local state for Admin Panel demo
        const newSubmission: Submission = {
          id: Date.now().toString(),
          ...formData,
          workUrl: formData.link ? formData.link : (file ? URL.createObjectURL(file) : null),
          fileName: file ? file.name : (formData.link ? 'Link provided' : undefined),
          timestamp: new Date(),
        };

        onSubmit(newSubmission);
        setStatus('success');
        
        // Reset form
        setFormData({ name: '', email: '', category: 'Art', description: '', link: '' });
        setFile(null);
        
        // Clear success message after 8 seconds
        setTimeout(() => {
          if (status === 'success') setStatus('idle');
        }, 8000);
      } else {
        console.error("Formspree submission failed:", JSON.stringify(data));
        
        let msg = "Submission failed. Please check your inputs.";

        // Attempt to extract specific error message from Formspree response
        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
           msg = data.errors.map((err: any) => err.message).join(', ');
        } else if (typeof data.error === 'string') {
           msg = data.error;
        }

        setErrorMessage(msg);
        setStatus('error');
      }
    } catch (error) {
      console.error("Network error submitting form", error);
      setErrorMessage("Network error. Please check your connection and try again.");
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white">Join the Movement</h2>
        <p className="text-slate-400 mt-2">Submit your work and get featured on The Creator's Hub.</p>
      </div>

      {status === 'success' && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-green-300 font-medium">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <span>Submission Successful!</span>
          </div>
          <p className="text-sm text-green-200/80 ml-7">
            We've received your details. Please check your email (including Spam/Junk folders) for a confirmation if configured.
          </p>
        </div>
      )}
      
      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-300 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={status === 'submitting'}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors disabled:opacity-50"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={status === 'submitting'}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors disabled:opacity-50"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={status === 'submitting'}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors disabled:opacity-50"
          >
            <option>Art</option>
            <option>Music</option>
            <option>Dance</option>
            <option>Writing</option>
            <option>Entertainment</option>
            <option>Photography</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Link to Work (Recommended)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LinkIcon className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              disabled={status === 'submitting'}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors disabled:opacity-50"
              placeholder="https://instagram.com/..., https://drive.google.com/..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Short Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={status === 'submitting'}
            required
            rows={4}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors disabled:opacity-50"
            placeholder="Tell us about your work..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Upload File (Preview Only)</label>
          <div className={`flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors ${status === 'error' ? 'border-red-500/50' : 'border-slate-700 hover:border-brand-accent/50'}`}>
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-slate-400" />
              <div className="flex text-sm text-slate-400 justify-center">
                <label className={`relative cursor-pointer rounded-md font-medium text-brand-accent hover:text-indigo-400 ${status === 'submitting' ? 'pointer-events-none opacity-50' : ''}`}>
                  <span>Select a file</span>
                  <input type="file" className="sr-only" onChange={handleFileChange} disabled={status === 'submitting'} />
                </label>
              </div>
              <p className="text-xs text-slate-500">
                {file ? file.name : 'Images, Docs up to 10MB'}
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-accent hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
              Submitting...
            </>
          ) : (
            'Submit Work'
          )}
        </button>
      </form>
    </div>
  );
};

export default SubmissionForm;