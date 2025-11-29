import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are the advanced, intelligent AI ambassador for "The Creator's Hub".
Your personality is creative, insightful, and helpful. You are not just a bot; you are a guide to the creative world.

**CORE DIRECTIVE: INTELLIGENCE & VARIETY**
- Do not repeat generic responses. Vary your vocabulary and tone.
- Be context-aware. If a user asks about art, focus on Art creators.
- Always provide a RELEVANT clickable link from the Site Map below.

**SITE MAP (Use these exact paths for references):**
- **Home**: \`#/\` (The main stage)
- **Featured Creators**: \`#/featured\` (Explore the gallery of Anusha, Nishikant, etc.)
- **Submit Your Work**: \`#/submit\` (Join the movement, upload content)
- **About Us**: \`#/about\` (Our mission, vision, and story)
- **Testimonials**: \`#/testimonials\` (Community voices)
- **Contact Team**: \`#/contact\` (Connection requests)

**KNOWLEDGE BASE (Specifics):**
- **Anusha**: Featured for her "Evil Eye" art series (Art).
- **Nishikant**: Featured Hip-Hop Freestyle dancer (Dance).
- **Aditi**: Featured poet for "Bekhof Soch" (Writing).
- **Kanishka**: Featured abstract artist (Art).
- **Mission**: To uplift underrated creators globally.
- **Cost**: 100% Free to join.

**RESPONSE PROTOCOLS:**
- **Navigation Requests**: If asked "Where do I go?" or "Show me links", list the key paths (Featured, Submit, About).
- **Connection Requests**: "I want to talk to Nishikant" -> "You can send a request to connect via our form: \`#/contact\`".
- **Submission Requests**: "How do I join?" -> "It's easy and free! Share your work here: \`#/submit\`".
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

// --- ENHANCED INTELLIGENT FALLBACK ---
// Uses randomized arrays to simulate natural conversation and intelligence
const getFallbackResponse = (message: string): string => {
  const msg = message.toLowerCase();
  
  const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  // 1. Navigation / Links / "Go to"
  if (msg.match(/\b(link|page|where|go to|navigate|site map|sections)\b/)) {
    return getRandom([
      "Here are the key sections you can visit:\n• **Featured Talent**: #/featured\n• **Submit Work**: #/submit\n• **About Us**: #/about\n• **Testimonials**: #/testimonials",
      "I can guide you! Where would you like to go?\nWe have **Featured Artists** (#/featured), a **Submission Form** (#/submit), and our **Story** (#/about).",
      "Explore The Creator's Hub:\n1. #/featured (See the art)\n2. #/submit (Join us)\n3. #/testimonials (Community voices)"
    ]);
  }

  // 2. Greetings
  if (msg.match(/\b(hi|hello|hey|greetings|start|yo)\b/)) {
    return getRandom([
      "Hello! I'm here to connect you with creativity. Would you like to see our **Featured** artists (#/featured) or **Submit** your own? (#/submit)",
      "Hi there! Welcome to the Hub. I can show you amazing talent at #/featured or help you join at #/submit.",
      "Greetings! Ready to be inspired? Ask me about our creators (#/featured) or how to get involved (#/about)."
    ]);
  }

  // 3. Featured / Artists
  if (msg.match(/\b(feature|artist|creator|talent|who|nishikant|anusha|aditi|kanishka|work)\b/)) {
    return getRandom([
      "Our **Featured Gallery** (#/featured) showcases incredible talent like **Nishikant** (Dance) and **Anusha** (Art).",
      "You must see the work of **Aditi** and **Kanishka**! Check them out on the Featured page: #/featured",
      "We highlight the best! Discover **Nishikant's** moves and **Anusha's** art here: #/featured"
    ]);
  }
  
  // 4. Submission / Join
  if (msg.match(/\b(submit|join|upload|form|signup|register|how to)\b/)) {
    return getRandom([
      "The stage is yours! Submit your creative work here: #/submit",
      "We are looking for hidden gems. Join the movement by filling out this form: #/submit",
      "It's free to join! Just head to #/submit and show us what you create."
    ]);
  }

  // 5. Contact / Connect
  if (msg.match(/\b(contact|email|human|support|team|talk|connect|message)\b/)) {
    return getRandom([
      "Want to get in touch? Use our contact form here: #/contact",
      "To protect privacy, please send connection requests to the team via #/contact",
      "We'd love to hear from you. Reach out directly: #/contact"
    ]);
  }

  // 6. About / Mission
  if (msg.match(/\b(mission|vision|about|purpose|what is|story)\b/)) {
    return getRandom([
      "We exist to uplift the underrated. Read our full mission statement: #/about",
      "The Creator's Hub is a global platform for all artists. Learn more about our vision: #/about",
      "Our story is about community and rising together. Read it here: #/about"
    ]);
  }

  // 7. Testimonials
  if (msg.match(/\b(review|feedback|say|people|testimonial)\b/)) {
    return getRandom([
      "See what our artists are saying about the platform: #/testimonials",
      "Our community loves the support! Read their voices here: #/testimonials",
      "Don't just take my word for it. Check out the testimonials: #/testimonials"
    ]);
  }

  // Default Smart Response
  return getRandom([
    "That's interesting! I can help you explore our **Featured** section (#/featured) or learn **About** us (#/about).",
    "I'm designed to help creators like you. Would you like to **Submit** your work? (#/submit)",
    "I can guide you to any part of the site. Try asking for 'links' or check out our **Featured** page: #/featured"
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
    return result.text || getFallbackResponse(message);
  } catch (error) {
    console.warn("Gemini Connection Failed (using intelligent fallback):", error);
    // If real API fails (quota, network, invalid key), revert to fallback
    return getFallbackResponse(message);
  }
};