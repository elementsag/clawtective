
"use client";

import React, { useState, useEffect, useRef } from 'react';

export default function Page() {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  // Current text being typed out
  const [displayedText, setDisplayedText] = useState('');
  const [fullText, setFullText] = useState("Welcome to the agency. I'm Claw. What do you want?");
  const [isTyping, setIsTyping] = useState(false);

  // Typewriter effect
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText(prev => prev + fullText.charAt(i));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [fullText]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    
    // Add to history
    setMessages(prev => [...prev, {role: 'user', content: userMsg}]);
    setInput('');
    setLoading(true);
    
    // Show user message briefly or just skip to bot thinking?
    // In VN style, usually user choice is selected, then bot speaks.
    setFullText("..."); // Thinking...

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setMessages(prev => [...prev, {role: 'bot', content: data.response}]);
      setFullText(data.response);
    } catch (error) {
      setFullText("Error connecting to the mainframe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black font-sans relative overflow-hidden select-none">
      {/* Background - Anime Style Street */}
      <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1515462277126-2dd0c162007a?q=80&w=2560&auto=format&fit=crop")'}}></div>
      
      {/* Character Sprite */}
      <div className={`absolute bottom-0 right-[10%] w-[500px] h-[800px] transition-all duration-500 ${loading ? 'opacity-80 scale-105' : 'opacity-100 scale-100'}`}>
         {/* Simple CSS Character if no image */}
         <div className="w-full h-full relative">
            <div className="absolute bottom-[-50px] left-1/2 transform -translate-x-1/2 w-[400px] h-[700px] bg-gradient-to-b from-[#ff9a9e] to-[#fad0c4] rounded-t-[200px] opacity-90 shadow-[0_0_50px_rgba(255,154,158,0.5)] blur-sm"></div>
            {/* "Claw" Representation */}
            <div className="absolute top-[20%] left-1/2 transform -translate-x-1/2 text-[300px] filter drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] animate-pulse">
                🦞
            </div>
         </div>
      </div>

      {/* UI Layer */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 pb-12">
        
        {/* Text Box */}
        <div className="bg-[#1a1a1a]/90 border-4 border-white/20 rounded-xl p-8 min-h-[200px] relative shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-sm">
            
            {/* Name Tag */}
            <div className="absolute top-[-30px] left-8 bg-[#ff6b6b] text-white px-8 py-2 text-xl font-bold rounded-t-lg border-t-4 border-l-4 border-r-4 border-white/20 shadow-lg">
                Claw Detective
            </div>

            {/* Dialogue Text */}
            <p className="text-2xl text-white leading-relaxed font-medium drop-shadow-md">
                {loading ? <span className="animate-pulse text-gray-400">Loading narrative...</span> : displayedText}
                {!isTyping && !loading && <span className="inline-block w-3 h-6 bg-white ml-2 animate-pulse"></span>}
            </p>

            {/* Controls */}
            <div className="absolute bottom-4 right-4 flex gap-4 text-sm text-gray-400 font-bold uppercase tracking-widest cursor-pointer">
                <span className="hover:text-white transition-colors">Auto</span>
                <span className="hover:text-white transition-colors">Skip</span>
                <span className="hover:text-white transition-colors" onClick={() => setShowHistory(!showHistory)}>History</span>
                <span className="hover:text-white transition-colors">Save</span>
                <span className="hover:text-white transition-colors">Load</span>
            </div>
        </div>

        {/* Input Area (Visual Novel Choice Style) */}
        <div className="mt-4 flex gap-2">
             <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 bg-black/50 border-2 border-white/30 rounded-lg px-6 py-4 text-white placeholder-white/50 text-xl focus:outline-none focus:bg-black/70 focus:border-[#ff6b6b] transition-all backdrop-blur-md"
                placeholder="What do you say?"
                disabled={loading}
             />
             <button 
                onClick={sendMessage}
                disabled={loading}
                className="bg-[#ff6b6b] text-white px-8 rounded-lg font-bold text-lg hover:bg-[#ff5252] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
             >
                {loading ? '...' : '▶'}
             </button>
        </div>

      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="absolute inset-0 z-50 bg-black/90 p-12 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl text-[#ff6b6b] font-bold mb-8 border-b border-gray-700 pb-4">Log</h2>
                <div className="space-y-6">
                    {messages.map((m, i) => (
                        <div key={i} className="flex gap-4">
                            <div className={`font-bold w-24 text-right ${m.role === 'user' ? 'text-gray-400' : 'text-[#ff6b6b]'}`}>
                                {m.role === 'user' ? 'You' : 'Claw'}
                            </div>
                            <div className="text-gray-200 flex-1">{m.content}</div>
                        </div>
                    ))}
                </div>
                <button 
                    onClick={() => setShowHistory(false)}
                    className="fixed bottom-8 right-8 bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-gray-200"
                >
                    Close
                </button>
            </div>
        </div>
      )}

    </div>
  );
}
