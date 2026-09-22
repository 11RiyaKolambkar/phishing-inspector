import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  X, 
  Minimize2, 
  Maximize2, 
  ShieldAlert, 
  Sparkles,
  Loader2,
  HelpCircle,
  AlertOctagon,
  FileCheck
} from 'lucide-react';
import { AnalysisResult } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface SecurityChatBotProps {
  currentScan?: AnalysisResult | null;
}

export const SecurityChatBot: React.FC<SecurityChatBotProps> = ({ currentScan }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Hello! I'm your Gemini Security Advisor. I can help evaluate suspicious recruitment messages, explain how fake check scams work, guide you on protecting compromised identity documents, or review contract terms. What would you like to verify?`,
      timestamp: new Date().toISOString(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // When a new scan completes, suggest asking about it
  useEffect(() => {
    if (currentScan && currentScan.scamThreatIndex >= 40) {
      const scanNotice: Message = {
        id: `scan-notice-${Date.now()}`,
        role: 'assistant',
        content: `I noticed your recent inspection scored a **${currentScan.scamThreatIndex}% Threat Index (${currentScan.riskLevel})** for ${currentScan.detectedCompany || 'this job opportunity'}. Would you like advice on how to respond, or how to verify their hiring manager directly?`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, scanNotice]);
    }
  }, [currentScan?.analysisTimestamp]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/security-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          context: currentScan
            ? {
                company: currentScan.detectedCompany,
                threatScore: currentScan.scamThreatIndex,
                riskLevel: currentScan.riskLevel,
                summary: currentScan.summary,
                redFlagsCount: currentScan.redFlags.length,
              }
            : null,
          history: messages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get security advice');
      }

      const data = await response.json();
      const botMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "I couldn't process that query. Please make sure not to send any money or sensitive SSN/banking information.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I had trouble reaching the security knowledge base. Rule of thumb: If an employer asks you to pay for equipment, deposit a check, or interview strictly on Telegram, it is 100% a scam.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'How do fake equipment check scams work?',
    'What should I do if I shared my SSN/ID?',
    'How to verify an authentic recruiter?',
  ];

  return (
    <div id="security-chatbot-container" className="fixed bottom-5 right-5 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          id="open-security-chat-btn"
          type="button"
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => inputRef.current?.focus(), 150);
          }}
          className="flex items-center gap-2.5 px-4 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full shadow-2xl hover:shadow-black/80 transition-all group scale-100 hover:scale-105 border border-neutral-700"
        >
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
              <span>Security Advisor</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[10px] text-slate-400">Ask Gemini Cyberbot</div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 w-[92vw] sm:w-[410px] h-[540px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-3.5 bg-neutral-950 text-white flex items-center justify-between border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold flex items-center gap-1.5 text-white">
                  <span>Gemini Security Advisor</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                    Live
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400">Employment Fraud & Cyber Threat Guidance</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Context Banner if inspection result exists */}
          {currentScan && (
            <div className="bg-blue-950/60 border-b border-blue-900/60 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-blue-200">
              <span className="truncate">
                Active Scan: <strong>{currentScan.scamThreatIndex}% Threat</strong> ({currentScan.analyzedInput.mode})
              </span>
              <span className="font-semibold text-blue-400 uppercase text-[10px]">
                {currentScan.riskLevel}
              </span>
            </div>
          )}

          {/* Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-neutral-950/80 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-neutral-800 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs border border-neutral-700">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs shadow-2xs'
                      : 'bg-neutral-900 text-slate-200 border border-neutral-800 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.content}</p>
                </div>
                {m.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs bg-neutral-900 p-2.5 rounded-xl border border-neutral-800 w-fit">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                <span>Evaluating fraud indicators with Gemini...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2 border-t border-neutral-800 bg-neutral-900 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(qp)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700 text-slate-300 transition-colors shrink-0 border border-neutral-700"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about scam patterns, report links..."
              className="flex-1 px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 text-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-neutral-900 placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition-colors shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
