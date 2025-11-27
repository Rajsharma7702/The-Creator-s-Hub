import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Initialize Gemini lazily
// NOTE: In a real production app, API calls should go through a backend to protect the key.
// For this client-side demo, we rely on the environment variable injection via Vite.

const SYSTEM_INSTRUCTION = `
You are the official AI assistant for "The Creator's Hub".
Your tone should be friendly, encouraging, artistic, and professional.

About The Creator's Hub:
- It is a platform dedicated to helping underrated creators and artists grow and showcase their talent globally.
- Motto: "Together, we rise. Together, we create."
- We support all domains: Art, Music, Dance, Writing, Entertainment, Photography, and more.

Key Sections/Features you can guide users to:
- Featured Creators: We showcase talent like Anusha (Evil Eye artwork), Nishikant (Dance), and Aditi (Poetry).
- Submission: Artists can submit their work via the "Join Us" or "Submit" page.
- Mission: To uplift creators.
- Vision: A global community of recognized talent.

Functionality:
- If asked about submission, guide them to the submission form page.
- If the user wants to speak to a human, contact the team directly, or leave a message, instruct them to click the "Envelope/Mail" icon at the top of this chat window to fill out the contact form.

Keep responses concise (under 100 words unless asked for more) and helpful.
`;

let ai: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

const getAI = (): GoogleGenAI => {
  if (!ai) {
    // Fallback to empty string to avoid crash, but warn in console
    // Vite replaces process.env.API_KEY with the actual string during build
    const apiKey = process.env.API_KEY || ""; 
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const getChatSession = (): Chat => {
  if (!chatSession) {
    const googleAI = getAI();
    chatSession = googleAI.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  // CRITICAL: Check if API Key exists before attempting request
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey.length < 5) {
    return "⚠️ Configuration Error: API Key is missing.\n\nPlease go to your Netlify Dashboard > Site Settings > Environment Variables and add a variable named 'API_KEY' with your Google Gemini API key, then redeploy the site.";
  }

  try {
    const chat = getChatSession();
    const result: GenerateContentResponse = await chat.sendMessage({ message });
    return result.text || "I'm feeling a bit quiet right now. Let's create something later!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I encountered a creative block (network error or invalid API key). Please check your internet connection or verify the API key in Netlify settings.";
  }
};