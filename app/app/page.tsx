
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { ConnectKitButton } from 'connectkit';
import { parseEther, formatEther } from 'viem';
import { bscTestnet } from 'wagmi/chains';

const PAYMENT_RECIPIENT = "0x46BE9Cd0417fd639E5baEb3A3E8788C47eA3281f"; 
const COST_PER_MESSAGE = "0.0001"; // 0.0001 BNB

export default function Page() {
  const account = useAccount();
  const address = account?.address;
  const isConnected = account?.isConnected;
  const chainId = account?.chainId;
  
  const switchChainResult = useSwitchChain();
  const switchChain = switchChainResult?.switchChain;

  const [messages, setMessages] = useState<{role: 'user' | 'bot', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const historyScrollRef = useRef<HTMLDivElement>(null);
  
  // Game State
  const [playerHp, setPlayerHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [turn, setTurn] = useState(1);
  const [playerAttacking, setPlayerAttacking] = useState(false);
  const [enemyAttacking, setEnemyAttacking] = useState(false);
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true) }, []);

  // Wagmi Hooks
  const { data: balanceData } = useBalance({
    address: address,
  });

  const { data: hash, sendTransaction, isPending, error: writeError } = useSendTransaction();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // After successful transaction, proceed with message sending
  useEffect(() => {
    if (isConfirmed) {
        handlePostTransaction();
    }
  }, [isConfirmed]);
  
  useEffect(() => {
      if (writeError) {
          console.error("Write Error:", writeError);
          alert(`Transaction failed: ${writeError.message.split('\n')[0]}`);
          setLoading(false); 
      }
  }, [writeError]);

  const handlePostTransaction = async () => {
    const userMsg = input; 
    if (!userMsg) return;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      
      setEnemyAttacking(true);
      setTimeout(() => setEnemyAttacking(false), 500);

      setMessages(prev => [...prev, {role: 'bot', content: data.response}]);
      setTurn(t => t + 1);
      setEnemyHp(h => Math.max(0, h - Math.floor(Math.random() * 10)));
      
    } catch (error) {
      setMessages(prev => [...prev, {role: 'bot', content: "Connection blocked!"}]);
    } finally {
      setLoading(false);
      setInput(''); 
       setTimeout(() => {
        if (historyScrollRef.current) {
            historyScrollRef.current.scrollTop = historyScrollRef.current.scrollHeight;
        }
    }, 100);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    if (!isConnected) {
        alert("Please connect your wallet first!");
        return;
    }
    
    if (chainId !== bscTestnet.id && switchChain) {
        switchChain({ chainId: bscTestnet.id });
        return;
    }

    const userMsg = input;
    
    const newMessages = [...messages, {role: 'user' as const, content: userMsg}];
    setMessages(newMessages);
    setLoading(true);
    
    setPlayerAttacking(true);
    setTimeout(() => setPlayerAttacking(false), 500);

    setTimeout(() => {
        if (historyScrollRef.current) {
            historyScrollRef.current.scrollTop = historyScrollRef.current.scrollHeight;
        }
    }, 100);

    // Trigger Native BNB Payment
    try {
        const amount = parseEther(COST_PER_MESSAGE);
        console.log("Sending Transaction:", {
            to: PAYMENT_RECIPIENT,
            value: amount.toString(),
            chainId: bscTestnet.id
        });

        sendTransaction({
            to: PAYMENT_RECIPIENT,
            value: amount, 
            chainId: bscTestnet.id,
        });
    } catch (error) {
        console.error("Transaction initiation failed", error);
        setLoading(false);
    }
  };
  
  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-[#1a0505] text-[#ffcc00] font-mono overflow-hidden selection:bg-[#ffcc00] selection:text-black">
      
      {/* RETRO SCANLINE OVERLAY */}
      <div className="absolute inset-0 pointer-events-none z-[60] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
      
      {/* HEADER BAR */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-[#2a0a0a] border-b-4 border-[#ffcc00] flex justify-between items-center px-6 z-50 shadow-[0_5px_0px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#ffcc00] rotate-45 border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,0.5)] flex items-center justify-center">
                  <span className="text-black -rotate-45 font-black text-xl">C</span>
              </div>
              <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-widest text-[#ffcc00] drop-shadow-[2px_2px_0_#000]">CLAW<span className="text-white">TECTIVE</span></span>
                  <span className="text-[10px] bg-[#ffcc00] text-black px-1 font-bold inline-block w-max">X402 PROTOCOL: ONLINE</span>
              </div>
          </div>
          
          <div className="flex items-center gap-6">
              <ConnectKitButton.Custom>
                  {({ isConnected, show, truncatedAddress, ensName }) => {
                    return (
                      <div className="flex items-center gap-4">
                        {isConnected && balanceData && (
                            <>
                                <div className="flex flex-col items-end border-r-2 border-[#ffcc00]/30 pr-4">
                                    <span className="text-[10px] text-[#ffcc00]/70">BALANCE</span>
                                    <span className="font-bold text-white">{parseFloat(balanceData.formatted).toFixed(4)} {balanceData.symbol}</span>
                                </div>
                                <div className="text-xs font-bold text-[#ffcc00]">COST: {COST_PER_MESSAGE} BNB / MSG</div>
                            </>
                        )}
                        <button 
                            onClick={show} 
                            className="bg-[#0000aa] hover:bg-[#0000cc] text-white border-4 border-white px-4 py-2 font-bold shadow-[4px_4px_0_#000] active:shadow-none active:translate-y-[4px] transition-all"
                        >
                          {isConnected ? ensName ?? truncatedAddress : "INSERT COIN (Connect)"}
                        </button>
                      </div>
                    );
                  }}
              </ConnectKitButton.Custom>
          </div>
      </div>

      {/* LEFT: MAIN BATTLE ARENA */}
      <div className="flex-1 flex flex-col relative pt-20 bg-[#1a0505]">
        
        {/* Retro Grid Floor */}
        <div className="absolute inset-0 opacity-30 pointer-events-none" 
             style={{
                 backgroundImage: 'linear-gradient(#ffcc00 2px, transparent 2px), linear-gradient(90deg, #ffcc00 2px, transparent 2px)',
                 backgroundSize: '40px 40px',
                 transform: 'perspective(300px) rotateX(40deg) translateY(-50px) scale(1.5)',
                 transformOrigin: 'top center',
                 filter: 'drop-shadow(0 0 5px #ffcc00)'
             }}>
        </div>

        {/* BATTLE FIELD */}
        <div className="flex-1 relative p-12 flex flex-col justify-between max-w-6xl mx-auto w-full z-10">
            
            {/* ENEMY HUD */}
            <div className={`self-end flex flex-col items-end transition-all duration-100 ${enemyAttacking ? 'translate-x-[-10px] translate-y-[10px]' : ''}`}>
                <div className="relative">
                    <div className="text-[180px] filter drop-shadow-[5px_5px_0px_rgba(0,0,0,1)] transform scale-x-[-1] animate-[bounce_2s_infinite]">🦞</div>
                    {/* Retro Health Bar */}
                    <div className="absolute -top-14 right-0 bg-black border-4 border-white p-2 shadow-[8px_8px_0_rgba(0,0,0,0.5)]">
                         <div className="flex justify-between text-xs font-bold text-white mb-1 gap-4">
                             <span>WILD CLAW</span>
                             <span>LVL 99</span>
                         </div>
                         <div className="flex gap-1">
                             {[...Array(10)].map((_, i) => (
                                <div key={i} className={`w-3 h-4 ${i < Math.ceil(enemyHp/10) ? 'bg-red-500' : 'bg-[#330000]'} border border-black`}></div>
                             ))}
                         </div>
                    </div>
                </div>
            </div>

            {/* PLAYER HUD */}
            <div className={`self-start flex flex-col items-start -mt-32 transition-all duration-100 ${playerAttacking ? 'translate-x-[10px] translate-y-[-10px]' : ''}`}>
                 <div className="relative">
                    <div className="text-[160px] filter drop-shadow-[5px_5px_0px_rgba(0,0,0,1)]">🕵️‍♂️</div>
                     {/* Retro Health Bar */}
                    <div className="absolute -top-14 left-0 bg-black border-4 border-white p-2 shadow-[8px_8px_0_rgba(0,0,0,0.5)]">
                         <div className="flex justify-between text-xs font-bold text-white mb-1 gap-4">
                             <span>PLAYER 1</span>
                             <span>LVL {turn}</span>
                         </div>
                         <div className="flex gap-1">
                             {[...Array(10)].map((_, i) => (
                                <div key={i} className={`w-3 h-4 ${i < Math.ceil(playerHp/10) ? 'bg-yellow-400' : 'bg-[#333300]'} border border-black`}></div>
                             ))}
                         </div>
                    </div>
                </div>
            </div>
            
            {/* VS Badge */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl font-black text-white italic drop-shadow-[8px_8px_0_#ff0000] opacity-20 rotate-[-10deg]">
                VS
            </div>

        </div>

        {/* BOTTOM: COMMAND CENTER */}
        <div className="h-32 bg-[#0000aa] border-t-8 border-white flex items-center justify-center gap-4 px-8 relative z-20 shadow-[inset_0_10px_20px_rgba(0,0,0,0.5)]">
             <div className="flex-1 max-w-4xl relative flex gap-4">
                 <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    disabled={!isConnected || isPending || isConfirming || loading}
                    className="flex-1 bg-black border-4 border-white p-4 text-white placeholder-gray-500 focus:outline-none focus:bg-[#111] font-mono text-xl shadow-[inset_4px_4px_0_rgba(0,0,0,0.5)] disabled:opacity-50"
                    placeholder={!isConnected ? "INSERT COIN TO START" : isPending || isConfirming ? "PROCESSING PAYMENT..." : `ENTER COMMAND (COST: ${COST_PER_MESSAGE} BNB)...`}
                 />
                 <button 
                    onClick={sendMessage}
                    disabled={!isConnected || isPending || isConfirming || loading}
                    className="px-8 bg-[#ff0000] border-4 border-white text-white font-black text-xl uppercase shadow-[4px_4px_0_#000] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    {isPending || isConfirming ? "PAYING..." : loading ? "..." : "SEND"}
                 </button>
             </div>
        </div>
      </div>

      {/* RIGHT: BATTLE LOG */}
      <div className="w-[400px] bg-[#000] border-l-8 border-white flex flex-col pt-20 shadow-2xl relative z-40">
        <div className="p-4 bg-[#0000aa] border-b-8 border-white text-center">
            <span className="font-black text-white text-xl tracking-widest uppercase italic drop-shadow-[2px_2px_0_#000]">Battle Log</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6 font-mono text-sm" ref={historyScrollRef}>
            {messages.length === 0 && (
                <div className="text-[#00ff00] text-center font-bold mt-10 animate-pulse">
                    &gt; WAITING FOR CHALLENGER...<br/>
                    &gt; INSERT COIN TO BEGIN
                </div>
            )}
            {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                     <span className={`text-[10px] font-bold mb-1 uppercase bg-white text-black px-1 border-2 border-black shadow-[2px_2px_0_#666] ${m.role === 'user' ? 'rotate-2' : '-rotate-2'}`}>
                        {m.role === 'user' ? 'P1 Action' : 'CPU Response'}
                    </span>
                    <div className={`p-4 border-4 text-sm font-bold shadow-[4px_4px_0_rgba(0,0,0,0.5)] ${
                        m.role === 'user' 
                        ? 'bg-[#0000aa] border-white text-white rounded-xl rounded-tr-none' 
                        : 'bg-[#aa0000] border-white text-white rounded-xl rounded-tl-none'
                    }`}>
                        {m.content}
                    </div>
                </div>
            ))}
             {loading && (
                <div className="flex flex-col items-start animate-pulse">
                     <span className="text-[10px] font-bold mb-1 uppercase bg-white text-black px-1 border-2 border-black -rotate-2">CPU Thinking</span>
                     <div className="bg-[#aa0000] border-4 border-white p-4 text-white font-bold w-24 text-center">
                        ...
                     </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
