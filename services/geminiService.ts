import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are the official AI assistant for "The Creator's Hub".
Your tone should be friendly, encouraging, artistic, and professional.

**Knowledge Base (Featured Creators):**
We are proud to feature these incredible artists. Always mention them when asked about "featured", "previous work", "talent", or "examples":
1. **Anusha** (Art): Renowned for her "Evil Eye" artwork series, blending traditional motifs with modern abstraction.
2. **Nishikant** (Dance): Hip-Hop Freestyle dancer.
3. **Aditi** (Writing): A poet featured for her soul-stirring piece titled "Bekhof Soch".
4. **Kanishka** (Art): Creates breathtaking abstract artwork with vivid imagination.

**Platform Navigation (Use these exact paths):**
- To view artists: #/featured
- To submit work: #/submit
- To read about us: #/about
- To contact/connect: #/contact
- Home: #/

**Instructions:**
- If the user asks to "connect", "contact", or "talk" to an artist or the team, say: "To protect our artists' privacy, we facilitate initial connections. Please send a message via our form here: #/contact"
- If the user asks for "previous featured work" or "examples", list the artists above and provide the link: #/featured
- If asked to submit/join, provide the link: #/submit
- Keep responses concise (under 100 words).
- Always be helpful and guide them to a link if possible.
`;

let ai: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

const getAI = (): GoogleGenAI | null => {
  if (!ai) {
    const apiKey = process.env.API_KEY;
    
    // If no key found, return null (triggers fallback mode)
    if (!apiKey || apiKey.length < 5) return null;
    
    try {
      ai = new GoogleGenAI({ apiKey });
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

// --- ENHANCED OFFLINE FALLBACK LOGIC ---
// Returns randomized responses to feel more natural even without AI
const getFallbackResponse = (message: string): string => {
  const msg = message.toLowerCase();
  
  const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  // Greetings
  if (msg.match(/\b(hi|hello|hey|greetings|start)\b/)) {
    return getRandom([
      "Hello! Welcome to The Creator's Hub. I can help you with Submissions or show you our Featured Creators.",
      "Hi there! Ready to explore some amazing talent? Ask me about our artists or how to join.",
      "Greetings! I'm here to guide you. Would you like to see our Featured works?"
    ]);
  }

  // How are you
  if (msg.includes('how are you')) {
    return "I'm doing great and feeling creative! How can I assist you with your artistic journey today?";
  }
  
  // Submission / Join
  if (msg.match(/\b(submit|join|upload|form|signup|register)\b/)) {
    return getRandom([
      "We'd love to see your work! You can submit your art, music, or writing here: #/submit",
      "Join the movement! Head over to our submission page to get started: #/submit",
      "It's easy to join. Just fill out the form at #/submit and show us what you've got!"
    ]);
  }
  
  // Featured / Artists / Previous Work
  if (msg.match(/\b(feature|artist|creator|talent|who|previous|work|example)\b/)) {
    return "We feature amazing talent! Check out **Anusha** (Art), **Nishikant** (Dance), **Aditi** (Poetry), and **Kanishka** (Art) on our featured page: #/featured";
  }
  
  // Contact / Connect
  if (msg.match(/\b(contact|email|human|support|team|talk|connect)\b/)) {
    return "You can connect with us or our artists by sending a message through our form here: #/contact";
  }

  // Mission / About
  if (msg.match(/\b(mission|vision|about|purpose|what is)\b/)) {
    return "The Creator's Hub is a global platform dedicated to uplifting underrated creators. Read our full story here: #/about";
  }

  // Costs
  if (msg.match(/\b(cost|price|free|pay)\b/)) {
    return "Joining The Creator's Hub is completely free! We believe in accessibility for all artists.";
  }

  // Default Fallback
  return getRandom([
    "That's an interesting question! I recommend checking out our Featured page to see what we do: #/featured",
    "I'm focusing on connecting creators right now. Would you like to visit the Submission page? #/submit",
    "I can help you explore. Try asking about 'Featured Artists' or 'How to Submit'."
  ]);
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  // 1. Try to get AI instance. If it fails (no key), use fallback.
  const aiInstance = getAI();
  
  if (!aiInstance) {
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