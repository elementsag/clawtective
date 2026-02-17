
"use client";

import React, { useState, useEffect, useRef } from 'react';

export default function Page() {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      setMessages(prev => [...prev, {role: 'bot', content: "Enemy blocked the connection!"}]);
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
    <div className="min-h-screen bg-[#202028] flex items-center justify-center p-4 font-mono text-white select-none">
        <div className="w-full max-w-4xl aspect-[4/3] bg-gradient-to-b from-[#404050] to-[#202028] border-8 border-double border-white rounded-lg shadow-2xl relative overflow-hidden flex flex-col">
            
            {/* Battle Scene */}
            <div className="flex-1 relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle, white 2px, transparent 2.5px)', backgroundSize: '20px 20px'}}></div>

                {/* Enemy (Claw) - Top Right */}
                <div className="absolute top-10 right-20 flex flex-col items-center">
                    <div className="text-lg font-bold mb-2 bg-[#f8f8f8] text-black px-4 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.5)] rounded">
                        <div className="flex justify-between w-48 mb-1">
                            <span>WILD CLAW</span>
                            <span>Lv.99</span>
                        </div>
                        <div className="h-3 w-full bg-gray-300 rounded-full border border-gray-500 overflow-hidden">
                            <div className="h-full bg-green-500 w-[80%]"></div>
                        </div>
                    </div>
                    <div className="w-48 h-48 flex items-center justify-center animate-[bounce_3s_infinite]">
                        <span className="text-9xl filter drop-shadow-[10px_10px_0px_rgba(0,0,0,0.5)]">🦞</span>
                    </div>
                    <div className="w-64 h-8 bg-black/20 rounded-[50%] blur-md mt-[-20px]"></div>
                </div>

                {/* Player - Bottom Left */}
                <div className="absolute bottom-10 left-20 flex flex-col items-center">
                     <div className="w-48 h-48 flex items-end justify-center">
                        <span className="text-9xl filter drop-shadow-[-10px_0px_0px_rgba(0,0,0,0.5)] grayscale">🕵️</span>
                    </div>
                    <div className="text-lg font-bold mt-4 bg-[#f8f8f8] text-black px-4 py-2 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.5)] rounded relative z-10">
                        <div className="flex justify-between w-48 mb-1">
                            <span>DETECTIVE</span>
                            <span>Lv.5</span>
                        </div>
                         <div className="h-3 w-full bg-gray-300 rounded-full border border-gray-500 overflow-hidden">
                            <div className="h-full bg-yellow-500 w-[40%]"></div>
                        </div>
                        <div className="text-right text-xs mt-1">HP: 40/100</div>
                    </div>
                </div>
            </div>

            {/* Battle Text Box */}
            <div className="h-32 bg-[#2a2a2a] border-t-4 border-white flex">
                <div className="flex-1 p-6 text-2xl border-r-4 border-white leading-relaxed whitespace-pre-wrap overflow-y-auto" ref={scrollRef}>
                    {loading ? <span className="animate-pulse">Wild CLAW is thinking...</span> : messages.length === 0 ? "A wild CLAW appeared!" : messages[messages.length-1].role === 'bot' ? `Claw says: "${messages[messages.length-1].content}"` : `You used CHAT: "${messages[messages.length-1].content}"`}
                </div>
                
                {/* Command Menu */}
                <div className="w-64 bg-white text-black p-4 grid grid-cols-2 gap-2 font-bold text-lg border-l-4 border-gray-400">
                    <div className="cursor-pointer hover:bg-gray-200 flex items-center pl-2 border-l-4 border-transparent hover:border-black">FIGHT</div>
                    <div className="cursor-pointer hover:bg-gray-200 flex items-center pl-2 border-l-4 border-transparent hover:border-black">BAG</div>
                    <div className="cursor-pointer hover:bg-gray-200 flex items-center pl-2 border-l-4 border-transparent hover:border-black bg-yellow-200">TALK</div>
                    <div className="cursor-pointer hover:bg-gray-200 flex items-center pl-2 border-l-4 border-transparent hover:border-black">RUN</div>
                </div>
            </div>
            
            {/* Overlay Input for "Talking" */}
            <div className="absolute bottom-4 right-[270px] left-4 bg-black/80 p-2 rounded border border-white flex gap-2">
                <span className="text-white font-bold p-2">{'>'}</span>
                <input 
                    className="flex-1 bg-transparent text-white font-mono text-xl outline-none"
                    placeholder="Choose your words carefully..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    autoFocus
                />
            </div>

        </div>
    </div>
  );
}
