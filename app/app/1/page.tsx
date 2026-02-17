
"use client";

import React, { useState, useEffect, useRef } from 'react';

export default function Page() {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', content: string}[]>([
    {role: 'bot', content: "CLAW-OS v1.0\nInsert cartridge..."}
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    } catch (error) {
      setMessages(prev => [...prev, {role: 'bot', content: "COMMUNICATION ERROR."}]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#222] flex items-center justify-center p-4 font-mono">
      {/* Handheld Console Body */}
      <div className="bg-[#c0c0c0] w-[340px] h-[600px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[40px] rounded-br-[10px] p-8 relative shadow-[inset_-5px_-5px_10px_rgba(0,0,0,0.2),10px_10px_20px_rgba(0,0,0,0.5)] flex flex-col items-center border-l-4 border-t-4 border-white/40 border-r-4 border-b-4 border-black/20">
        
        {/* Screen Bezel */}
        <div className="bg-[#555] w-full h-[250px] rounded-t-[10px] rounded-b-[30px] p-6 relative flex flex-col shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between text-[10px] text-[#888] mb-1 px-2 font-bold italic">
                <span>BATTERY</span>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_5px_red]"></div>
            </div>
            
            {/* LCD Screen */}
            <div className="bg-[#8bac0f] flex-1 border-4 border-[#4f5c26] shadow-[inset_2px_2px_2px_rgba(0,0,0,0.3)] p-2 relative overflow-hidden flex flex-col font-mono text-[#0f380f]">
                <div className="absolute inset-0 pointer-events-none opacity-10" style={{backgroundImage: 'linear-gradient(transparent 2px, #000 2px)', backgroundSize: '100% 3px'}}></div>
                
                <div className="flex-1 overflow-y-auto scrollbar-hide text-xs leading-tight space-y-2">
                    {messages.map((m, i) => (
                        <div key={i} className={`${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                            <span className={`inline-block px-1 ${m.role === 'user' ? 'bg-[#0f380f] text-[#8bac0f]' : ''}`}>
                                {m.role === 'user' ? '> ' : ''}{m.content}
                            </span>
                        </div>
                    ))}
                    {loading && <div className="animate-pulse">Creating...</div>}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="text-center mt-1 text-[#999] text-xs font-bold italic tracking-widest">
                NINTENDO GAME BOY™
            </div>
        </div>

        {/* Controls */}
        <div className="mt-12 w-full relative">
            <div className="absolute left-2 top-8 text-[#999] text-xs font-bold tracking-widest">NINTENDO</div>

            {/* D-Pad */}
            <div className="absolute left-4 top-16 w-24 h-24">
                <div className="absolute top-0 left-8 w-8 h-8 bg-[#333] shadow-[2px_2px_0px_#111] rounded-t-sm"></div>
                <div className="absolute bottom-0 left-8 w-8 h-8 bg-[#333] shadow-[2px_2px_0px_#111] rounded-b-sm"></div>
                <div className="absolute top-8 left-0 w-8 h-8 bg-[#333] shadow-[2px_2px_0px_#111] rounded-l-sm"></div>
                <div className="absolute top-8 right-0 w-8 h-8 bg-[#333] shadow-[2px_2px_0px_#111] rounded-r-sm"></div>
                <div className="absolute top-8 left-8 w-8 h-8 bg-[#333]"></div> {/* Center */}
                <div className="absolute top-8 left-8 w-8 h-8 rounded-full bg-gradient-to-br from-transparent to-white/10"></div>
            </div>

            {/* A/B Buttons */}
            <div className="absolute right-4 top-20 flex gap-4 -rotate-12">
                 <div className="flex flex-col items-center gap-1">
                    <button 
                        onClick={sendMessage}
                        className="w-10 h-10 bg-[#8b1d3d] rounded-full shadow-[2px_2px_0px_#4a0e1e] active:shadow-none active:translate-y-[2px] transition-all"
                    ></button>
                    <span className="text-[#999] text-xs font-bold">B</span>
                 </div>
                 <div className="flex flex-col items-center gap-1 mt-[-10px]">
                    <button 
                        onClick={sendMessage}
                        className="w-10 h-10 bg-[#8b1d3d] rounded-full shadow-[2px_2px_0px_#4a0e1e] active:shadow-none active:translate-y-[2px] transition-all"
                    ></button>
                    <span className="text-[#999] text-xs font-bold">A</span>
                 </div>
            </div>

            {/* Start/Select */}
            <div className="absolute bottom-[-100px] left-1/2 transform -translate-x-1/2 flex gap-4">
                 <div className="w-12 h-3 bg-[#999] rounded-full rotate-[-25deg] shadow-[1px_1px_0px_#555]"></div>
                 <div className="w-12 h-3 bg-[#999] rounded-full rotate-[-25deg] shadow-[1px_1px_0px_#555]"></div>
            </div>
             <div className="absolute bottom-[-80px] left-1/2 transform -translate-x-1/2 flex gap-8 text-[10px] text-[#999] font-bold tracking-tighter pl-1">
                 <span>SELECT</span>
                 <span>START</span>
            </div>
        </div>
        
        {/* Actual Input (Hidden visually but functional) */}
        <div className="absolute bottom-8 w-[80%] z-20">
             <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="w-full bg-[#8bac0f] border-2 border-[#0f380f] p-2 font-mono text-xs text-[#0f380f] placeholder-[#0f380f]/50 focus:outline-none shadow-[2px_2px_0px_#0f380f] rounded"
                placeholder="TYPE & PRESS ENTER..."
             />
        </div>

        {/* Speaker Grille */}
        <div className="absolute bottom-8 right-6 space-y-2 rotate-[-15deg]">
            <div className="w-12 h-1 bg-[#888] rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]"></div>
            <div className="w-12 h-1 bg-[#888] rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]"></div>
            <div className="w-12 h-1 bg-[#888] rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]"></div>
            <div className="w-12 h-1 bg-[#888] rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]"></div>
            <div className="w-12 h-1 bg-[#888] rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]"></div>
            <div className="w-12 h-1 bg-[#888] rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]"></div>
        </div>

      </div>
      <style jsx global>{`
        @font-face {
            font-family: 'Pixel';
            src: url('https://fonts.cdnfonts.com/s/11500/Pixel-LCD-7.woff') format('woff');
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}</style>
    </div>
  );
}
