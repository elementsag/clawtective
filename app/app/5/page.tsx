
"use client";

import React, { useState, useEffect, useRef } from 'react';

export default function Page() {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [affection, setAffection] = useState(0);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setMessages(prev => [...prev, {role: 'user', content: userMsg}]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setMessages(prev => [...prev, {role: 'bot', content: data.response}]);
      setAffection(prev => Math.min(100, prev + 15));
    } catch (error) {
      setMessages(prev => [...prev, {role: 'bot', content: "I... I can't hear you."}]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="min-h-screen bg-[#fff0f5] flex items-center justify-center p-4 font-sans overflow-hidden relative">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-40 right-10 text-6xl opacity-20 rotate-12">💖</div>
        <div className="absolute bottom-20 left-10 text-8xl opacity-10 -rotate-12">🌸</div>
      </div>

      <div className="relative z-10 w-full max-w-4xl h-[600px] bg-white/60 backdrop-blur-xl rounded-[40px] shadow-[0_20px_60px_rgba(255,105,180,0.2)] border-4 border-white flex overflow-hidden">
        
        {/* Left: Character Portrait */}
        <div className="w-1/2 relative bg-gradient-to-b from-pink-100 to-white flex items-end justify-center overflow-hidden">
             {/* Love Meter */}
             <div className="absolute top-6 left-6 z-20 bg-white/80 backdrop-blur rounded-full px-4 py-2 shadow-sm border border-pink-200 flex items-center gap-2">
                <span className="text-pink-500 font-bold">Love:</span>
                <div className="w-24 h-3 bg-pink-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-pink-400 to-red-400 transition-all duration-1000 ease-out" 
                        style={{width: `${affection}%`}}
                    ></div>
                </div>
             </div>

             {/* Character */}
             <div className="relative z-10 transform translate-y-10 hover:translate-y-8 transition-transform duration-700">
                <div className="text-[250px] filter drop-shadow-xl animate-[pulse_4s_infinite]">
                    🦞
                </div>
                {/* Blush */}
                <div className={`absolute top-[40%] left-[20%] w-12 h-8 bg-red-400 rounded-full blur-xl opacity-${affection > 30 ? '60' : '0'} transition-opacity`}></div>
                <div className={`absolute top-[40%] right-[20%] w-12 h-8 bg-red-400 rounded-full blur-xl opacity-${affection > 30 ? '60' : '0'} transition-opacity`}></div>
             </div>
        </div>

        {/* Right: Interaction */}
        <div className="w-1/2 flex flex-col p-8 bg-white/50">
            <h1 className="text-3xl font-black text-pink-500 tracking-tight mb-2">
                Claw-senpai
            </h1>
            <p className="text-sm text-pink-300 font-bold uppercase tracking-widest mb-6">
                The Mysterious Transfer Student
            </p>

            <div className="flex-1 bg-white rounded-3xl p-6 shadow-inner overflow-y-auto mb-6 scrollbar-thin scrollbar-thumb-pink-200" ref={scrollRef}>
                {messages.length === 0 ? (
                    <p className="text-gray-400 italic text-center mt-10">Start the conversation...</p>
                ) : (
                    messages.map((m, i) => (
                        <div key={i} className={`mb-4 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                            <div className={`inline-block px-4 py-3 rounded-2xl text-sm max-w-[85%] shadow-sm ${
                                m.role === 'user' 
                                ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-tr-none' 
                                : 'bg-white text-gray-700 border border-pink-100 rounded-tl-none'
                            }`}>
                                {m.content}
                            </div>
                        </div>
                    ))
                )}
                {loading && (
                    <div className="text-left">
                         <div className="inline-block px-4 py-3 bg-white border border-pink-100 rounded-2xl rounded-tl-none shadow-sm">
                            <span className="flex gap-1 items-center">
                                <span className="text-xs text-pink-300 mr-2">typing</span>
                                <span className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce delay-75"></span>
                                <span className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce delay-150"></span>
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <div className="relative">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    className="w-full bg-white border-2 border-pink-200 rounded-full py-4 pl-6 pr-14 text-gray-600 placeholder-pink-200 focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all shadow-lg"
                    placeholder="Say something nice..."
                />
                <button 
                    onClick={sendMessage}
                    className="absolute right-2 top-2 bottom-2 w-10 h-10 bg-gradient-to-tr from-pink-400 to-red-400 rounded-full text-white shadow-md hover:scale-110 active:scale-95 transition-transform flex items-center justify-center"
                >
                    ♥
                </button>
            </div>

        </div>

      </div>
    </div>
  );
}
