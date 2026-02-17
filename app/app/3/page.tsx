
"use client";

import React, { useState, useEffect, useRef } from 'react';

export default function Page() {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Tamagotchi logic
  const [happiness, setHappiness] = useState(50);
  const [hunger, setHunger] = useState(50);

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
      setHappiness(h => Math.min(100, h + 10));
    } catch (error) {
      setMessages(prev => [...prev, {role: 'bot', content: "..."}]);
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
    <div className="min-h-screen bg-[#ffb7b2] flex items-center justify-center font-mono">
      
      {/* Egg Shape */}
      <div className="relative w-[350px] h-[420px] bg-white rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] shadow-[0_20px_50px_rgba(0,0,0,0.1),inset_-10px_-10px_20px_rgba(0,0,0,0.05)] flex flex-col items-center pt-16 border-4 border-white ring-8 ring-[#ff9e99]">
         
         {/* Branding */}
         <div className="absolute top-8 font-bold text-[#ff9e99] tracking-widest text-lg">CLAW•PET</div>

         {/* Screen */}
         <div className="w-[200px] h-[200px] bg-[#9ea792] border-4 border-[#888] rounded-2xl shadow-[inset_4px_4px_10px_rgba(0,0,0,0.2)] p-4 relative overflow-hidden flex flex-col">
            
            {/* Pixels Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{backgroundImage: 'linear-gradient(90deg, transparent 2px, rgba(0,0,0,0.1) 2px), linear-gradient(transparent 2px, rgba(0,0,0,0.1) 2px)', backgroundSize: '4px 4px'}}></div>

            {/* Status Bar */}
            <div className="flex justify-between text-[10px] text-[#2c3327] mb-2 font-bold opacity-70">
                <span>♥ {happiness}%</span>
                <span>🍗 {hunger}%</span>
            </div>

            {/* Character Area */}
            <div className="flex-1 flex items-center justify-center">
                <div className={`text-6xl text-[#2c3327] filter drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)] ${loading ? 'animate-bounce' : 'animate-pulse'}`}>
                    👾
                </div>
            </div>

            {/* Message Marquee */}
            <div className="h-16 mt-2 border-t-2 border-[#2c3327]/20 pt-1 overflow-y-auto text-[10px] leading-tight text-[#2c3327] font-bold" ref={scrollRef}>
                {loading ? "RECEIVING DATA..." : messages.length === 0 ? "HELLO! I AM CLAW." : messages[messages.length-1].role === 'bot' ? messages[messages.length-1].content : "..."}
            </div>

         </div>

         {/* Buttons */}
         <div className="flex justify-center gap-8 mt-8 w-full px-12">
            <div className="flex flex-col items-center gap-1">
                <button 
                    onClick={() => {}} 
                    className="w-10 h-10 bg-[#ff9e99] rounded-full shadow-[0_4px_0_#e0807b] active:shadow-none active:translate-y-[4px] transition-all"
                ></button>
                <span className="text-xs font-bold text-[#ff9e99]">A</span>
            </div>
            <div className="flex flex-col items-center gap-1 mt-6">
                <button 
                    onClick={sendMessage} 
                    className="w-10 h-10 bg-[#ff9e99] rounded-full shadow-[0_4px_0_#e0807b] active:shadow-none active:translate-y-[4px] transition-all"
                ></button>
                <span className="text-xs font-bold text-[#ff9e99]">B</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <button 
                    onClick={() => {}} 
                    className="w-10 h-10 bg-[#ff9e99] rounded-full shadow-[0_4px_0_#e0807b] active:shadow-none active:translate-y-[4px] transition-all"
                ></button>
                <span className="text-xs font-bold text-[#ff9e99]">C</span>
            </div>
         </div>

         {/* Hidden Input for Keyboard */}
         <input 
            className="opacity-0 absolute inset-0 cursor-default"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            autoFocus
         />
      </div>

        {/* Instructions */}
        <div className="absolute bottom-4 text-[#ff9e99] text-xs font-bold uppercase tracking-widest animate-pulse">
            Type on keyboard to chat • Press Enter
        </div>
    </div>
  );
}
