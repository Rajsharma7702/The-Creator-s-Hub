import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

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
let dynamicApiKey: string | null = null;

// Allow setting key from UI
export const setDynamicApiKey = (key: string) => {
  dynamicApiKey = key;
  // Reset instance to force recreation with new key
  ai = null;
  chatSession = null;
  localStorage.setItem('gemini_api_key', key);
};

const getAI = (): GoogleGenAI | null => {
  if (!ai) {
    // Priority: 1. Dynamic/Session Key 2. LocalStorage 3. Env Var
    const envKey = process.env.API_KEY;
    const localKey = localStorage.getItem('gemini_api_key');
    const finalKey = dynamicApiKey || localKey || envKey;

    // If no key found in any source, return null (triggers fallback mode)
    if (!finalKey || finalKey.length < 5) return null;
    
    try {
      ai = new GoogleGenAI({ apiKey: finalKey });
    } catch (e) {
      console.error("Failed to init GoogleGenAI", e);
      return null;
    }
  }
  return ai;
};

export const getChatSession = (): Chat | null => {
  if (!chatSession) {
    const googleAI = getAI();
    if (!googleAI) return null;

    try {
      chatSession = googleAI.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });
    } catch (e) {
      console.error("Failed to create chat session", e);
      return null;
    }
  }
  return chatSession;
};

// --- OFFLINE FALLBACK LOGIC ---
const getFallbackResponse = (message: string): string => {
  const msg = message.toLowerCase();
  
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return "Hello! Welcome to The Creator's Hub. (Demo Mode: Add API Key in Settings to enable full AI)";
  }
  
  if (msg.includes('submit') || msg.includes('join') || msg.includes('upload')) {
    return "We'd love to see your work! Click 'Join Us' in the menu or visit the Submission page.";
  }
  
  if (msg.includes('feature') || msg.includes('artist')) {
    return "We feature amazing talent like Anusha (Art), Nishikant (Dance), and Aditi (Writing). Check out the Featured section!";
  }
  
  if (msg.includes('contact') || msg.includes('email')) {
    return "You can contact our team by clicking the Mail icon above.";
  }

  return "I'm in Demo Mode (API Key missing). I can guide you to Submissions, Features, or Contact. To enable full AI, click the Gear icon above and enter your Google Gemini API Key.";
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  // 1. Try to get AI instance. If it fails (no key), use fallback.
  const aiInstance = getAI();
  
  if (!aiInstance) {
    console.warn("Gemini API Key missing. Using offline fallback.");
    await new Promise(resolve => setTimeout(resolve, 600)); 
    return getFallbackResponse(message);
  }

  // 2. Try Real AI Request
  try {
    const chat = getChatSession();
    if (!chat) return getFallbackResponse(message);

    const result: GenerateContentResponse = await chat.sendMessage({ message });
    return result.text || "I'm feeling a bit quiet right now. Let's create something later!";
  } catch (error) {
    console.error("Gemini Error:", error);
    // If real API fails (quota, network, invalid key), revert to fallback
    return getFallbackResponse(message);
  }
};