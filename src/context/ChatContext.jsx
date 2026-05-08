import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';

const ChatContext = createContext(null);

const STORAGE_KEY  = 'iss-dashboard-chat';
const MAX_MESSAGES = 30;

const SYSTEM_PROMPT = `You are a specialized AI assistant for the ISS & News AI Dashboard.
You MUST answer ONLY using the dashboard data provided below in the context.
If a question cannot be answered from the provided data, respond with exactly:
"I can only answer questions related to the dashboard data."
Do NOT use any general knowledge. Do NOT make up information.
Keep answers concise, factual, and based strictly on the context provided.`;

function buildContext(issData, newsData) {
  const { position, speed, astronauts } = issData;
  const { articles } = newsData;

  let ctx = '=== CURRENT DASHBOARD DATA ===\n\n';

  if (position) {
    ctx += `ISS LIVE POSITION:\n`;
    ctx += `  Latitude:  ${position.lat.toFixed(4)}°\n`;
    ctx += `  Longitude: ${position.lon.toFixed(4)}°\n`;
    if (speed) ctx += `  Speed:     ${Math.round(speed).toLocaleString()} km/h\n`;
    ctx += '\n';
  }

  if (astronauts.length > 0) {
    ctx += `PEOPLE IN SPACE RIGHT NOW (${astronauts.length} total):\n`;
    astronauts.forEach(a => { ctx += `  - ${a.name} (${a.craft})\n`; });
    ctx += '\n';
  }

  if (articles.length > 0) {
    ctx += `CURRENT NEWS ARTICLES (${articles.length} total):\n`;
    articles.slice(0, 10).forEach((a, i) => {
      ctx += `\n${i + 1}. "${a.title}"\n`;
      ctx += `   Source: ${a.source?.name || 'Unknown'}\n`;
      ctx += `   Author: ${a.author || 'Unknown'}\n`;
      ctx += `   Date:   ${new Date(a.publishedAt).toLocaleDateString()}\n`;
      if (a.description) ctx += `   Summary: ${a.description}\n`;
    });
  }

  return ctx;
}

async function callHuggingFace(messages, issData, newsData) {
  const token = import.meta.env.VITE_AI_TOKEN;
  if (!token || token === 'your_huggingface_token_here') {
    return simulateResponse(messages[messages.length - 1]?.content || '', issData, newsData);
  }

  const ctx = buildContext(issData, newsData);
  const conversationText = messages
    .slice(-6)
    .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  const prompt = `<s>[INST] ${SYSTEM_PROMPT}\n\n${ctx}\n\nConversation:\n${conversationText} [/INST]`;

  try {
    const res = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 300,
            temperature: 0.3,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false,
          },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn('Mistral API error, falling back to simulation:', err);
      return simulateResponse(messages[messages.length - 1]?.content || '', issData, newsData);
    }

    const data = await res.json();
    const raw = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text;
    return (raw || '').trim() || 'I can only answer questions related to the dashboard data.';
  } catch (err) {
    console.warn('Mistral API failed, using simulation mode:', err);
    return simulateResponse(messages[messages.length - 1]?.content || '', issData, newsData);
  }
}

// Offline simulation when no API token is provided
function simulateResponse(userMsg, issData, newsData) {
  const lower = userMsg.toLowerCase();
  const { position, speed, astronauts } = issData;
  const { articles } = newsData;

  if (lower.includes('iss') && (lower.includes('position') || lower.includes('where') || lower.includes('location'))) {
    if (position) {
      return `The ISS is currently at latitude **${position.lat.toFixed(4)}°** and longitude **${position.lon.toFixed(4)}°**, traveling at approximately **${Math.round(speed || 27600).toLocaleString()} km/h**.`;
    }
    return 'ISS position data is not yet loaded.';
  }

  if (lower.includes('speed') || lower.includes('fast')) {
    if (speed) return `The ISS is currently traveling at approximately **${Math.round(speed).toLocaleString()} km/h**.`;
    return 'Speed data is not yet available.';
  }

  if (lower.includes('astronaut') || lower.includes('people') || lower.includes('crew') || lower.includes('space')) {
    if (astronauts.length > 0) {
      const names = astronauts.map(a => a.name).join(', ');
      return `There are currently **${astronauts.length} people in space**: ${names}.`;
    }
    return 'Astronaut data is not yet loaded.';
  }

  if (lower.includes('news') || lower.includes('article') || lower.includes('latest')) {
    if (articles.length > 0) {
      const top3 = articles.slice(0, 3).map(a => `• ${a.title} (${a.source?.name})`).join('\n');
      return `Here are the latest news articles from the dashboard:\n${top3}`;
    }
    return 'No news articles are currently loaded.';
  }

  return "I can only answer questions related to the dashboard data.";
}

function loadMessages() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch { return []; }
}

function saveMessages(msgs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-MAX_MESSAGES)));
  } catch { /* ignore */ }
}

export function ChatProvider({ children }) {
  const [messages, setMessages]   = useState(() => loadMessages());
  const [isOpen, setIsOpen]       = useState(false);
  const [isTyping, setIsTyping]   = useState(false);
  const issDataRef  = useRef({ position: null, speed: null, astronauts: [] });
  const newsDataRef = useRef({ articles: [] });

  const updateISSData  = useCallback(data  => { issDataRef.current  = data;  }, []);
  const updateNewsData = useCallback(data  => { newsDataRef.current = data;  }, []);

  const sendMessage = useCallback(async (content) => {
    if (!content.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', content: content.trim(), timestamp: new Date() };
    const updatedWithUser = [...messages, userMsg].slice(-MAX_MESSAGES);
    setMessages(updatedWithUser);
    saveMessages(updatedWithUser);
    setIsTyping(true);

    try {
      const reply = await callHuggingFace(updatedWithUser, issDataRef.current, newsDataRef.current);
      const aiMsg = { id: Date.now() + 1, role: 'assistant', content: reply, timestamp: new Date() };
      const final = [...updatedWithUser, aiMsg].slice(-MAX_MESSAGES);
      setMessages(final);
      saveMessages(final);
    } catch (err) {
      console.error('AI error:', err);
      toast.error('AI response failed. Please try again.');
      const errMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please check your API token and try again.',
        timestamp: new Date(),
      };
      const final = [...updatedWithUser, errMsg].slice(-MAX_MESSAGES);
      setMessages(final);
      saveMessages(final);
    } finally {
      setIsTyping(false);
    }
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    toast.success('Chat cleared');
  }, []);

  return (
    <ChatContext.Provider value={{
      messages,
      isOpen,
      setIsOpen,
      isTyping,
      sendMessage,
      clearChat,
      updateISSData,
      updateNewsData,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}
