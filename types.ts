export interface Submission {
  id: string;
  name: string;
  email: string;
  category: string;
  description: string;
  workUrl: string | null; // For demo purposes, we might just store a fake URL or base64
  fileName?: string;
  timestamp: Date;
}

export interface Creator {
  id: string;
  name: string;
  category: string;
  workImage: string;
  description?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string; // e.g., "Featured for Evil Eye Artwork"
  quote: string;
  image?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}
