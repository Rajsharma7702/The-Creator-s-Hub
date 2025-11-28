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

export const hasValidKey = (): boolean => {
    const envKey = process.env.API_KEY;
    const localKey = localStorage.getItem('gemini_api_key');
    const finalKey = dynamicApiKey || localKey || envKey;
    return !!(finalKey && finalKey.length > 5);
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

// --- OFFLINE FALLBACK LOGIC (Rule-Based Chatbot) ---
const getFallbackResponse = (message: string): string => {
  const msg = message.toLowerCase();
  
  // Greetings
  if (msg.match(/\b(hi|hello|hey|greetings|start)\b/)) {
    return "Hello! Welcome to The Creator's Hub. I'm here to help you navigate our platform. You can ask me about submitting your work, our featured artists, or our mission!";
  }

  // How are you
  if (msg.includes('how are you')) {
    return "I'm doing great and feeling creative! How can I assist you with your artistic journey today?";
  }
  
  // Submission / Join
  if (msg.match(/\b(submit|join|upload|form|signup|register)\b/)) {
    return "We'd love to see your work! You can submit your art, music, or writing by clicking the 'Join Us' button in the menu, or just navigate to the Submission page.";
  }
  
  // Featured / Artists
  if (msg.match(/\b(feature|artist|creator|talent|who)\b/)) {
    return "We feature amazing talent from all over! Check out our Featured section to see artists like Anusha (Art), Nishikant (Dance), and Aditi (Writing).";
  }
  
  // Contact / Human / Email
  if (msg.match(/\b(contact|email|human|support|team|talk)\b/)) {
    return "You can contact our team directly by clicking the Mail (Envelope) icon at the top of this chat window. We'd love to hear from you!";
  }

  // Mission / About
  if (msg.match(/\b(mission|vision|about|purpose|what is)\b/)) {
    return "The Creator's Hub is a global platform dedicated to uplifting underrated creators. Our motto is 'Together, we rise. Together, we create.' We exist to give talent the stage it deserves.";
  }

  // Costs
  if (msg.match(/\b(cost|price|free|pay)\b/)) {
    return "Joining The Creator's Hub is completely free! We believe in accessibility for all artists.";
  }

  // Default Fallback
  return "That's an interesting question! While I can't browse the web right now, I can help you with Submissions, Featured Creators, or Contacting the team. What would you like to explore?";
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  // 1. Try to get AI instance. If it fails (no key), use fallback.
  const aiInstance = getAI();
  
  if (!aiInstance) {
    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 800)); 
    return getFallbackResponse(message);
  }

  // 2. Try Real AI Request
  try {
    const chat = getChatSession();
    if (!chat) return getFallbackResponse(message);

    const result: GenerateContentResponse = await chat.sendMessage({ message });
    return result.text || "I'm feeling a bit quiet right now. Let's create something later!";
  } catch (error) {
    console.warn("Gemini Connection Failed (using fallback):", error);
    // If real API fails (quota, network, invalid key), revert to fallback
    return getFallbackResponse(message);
  }
};