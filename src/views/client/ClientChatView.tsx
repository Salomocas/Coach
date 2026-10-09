import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  MessageSquare, 
  CheckCheck, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Dumbbell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const ClientChatView: React.FC = () => {
  const { currentUser } = useAuth();
  const { messages, sendMessage, markMessagesAsRead } = useData();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter messages for current client
  const myMessages = messages.filter(
    m => m.clientId === currentUser?.uid || m.clientId === 'client-ricardo-silva'
  );

  useEffect(() => {
    if (currentUser?.uid) {
      markMessagesAsRead(currentUser.uid);
    }
  }, [currentUser?.uid, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [myMessages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText('');
  };

  const quickPrompts = [
    'Qual a carga recomendada para o supino hoje?',
    'Posso trocar a carne vermelha por peixe no jantar?',
    'Sentindo ligeira dor no ombro na elevação lateral.',
    'Registei todas as cargas do treino de pernas!'
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[500px] bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm transition-colors">
      
      {/* Chat Header */}
      <div className="p-4 sm:p-5 bg-slate-50 dark:bg-neutral-950/80 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="Coach Sérgio Cunha"
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-500 shadow-sm"
            />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-neutral-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-slate-900 dark:text-white">Coach Sérgio Cunha</h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                Treinador Direto
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-neutral-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Disponível para suporte & esclarecimento de dúvidas</span>
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 dark:text-neutral-400 bg-white dark:bg-neutral-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
          <span>Canal Exclusivo Aluno-Treinador</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50 dark:bg-neutral-950/30">
        
        {/* Welcome Coach Card */}
        <div className="bg-white dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 rounded-2xl p-4 text-center max-w-md mx-auto my-2 shadow-sm">
          <Dumbbell className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Apoio em Tempo Real</h4>
          <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-1 leading-relaxed">
            Utiliza este chat para relatar feedback sobre as cargas, desconfortos articulares ou dúvidas pontuais no plano alimentar. O Coach Sérgio Cunha responderá com a maior brevidade.
          </p>
        </div>

        {myMessages.map((msg) => {
          const isMe = msg.senderRole === 'client';
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Coach"
                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-300 dark:ring-neutral-700 shrink-0 mb-1"
                />
              )}

              <div
                className={`max-w-[85%] sm:max-w-md rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  isMe
                    ? 'bg-amber-500 text-black font-medium rounded-br-none'
                    : 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-neutral-100 rounded-bl-none border border-slate-200 dark:border-neutral-700'
                }`}
              >
                <div className={`text-[10px] font-bold mb-1 flex items-center justify-between gap-4 ${
                  isMe ? 'text-black/70' : 'text-amber-500 dark:text-amber-400'
                }`}>
                  <span>{isMe ? 'Tu' : 'Coach Sérgio Cunha'}</span>
                  <span className="font-mono text-[9px] font-normal opacity-80">{msg.createdAt}</span>
                </div>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                
                {isMe && (
                  <div className="flex justify-end mt-1 text-black/60">
                    <CheckCheck className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Fast Question Chips */}
      <div className="px-4 py-2 bg-slate-50 dark:bg-neutral-950/80 border-t border-slate-200 dark:border-neutral-800 overflow-x-auto scrollbar-none flex gap-2">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setInputText(prompt)}
            className="text-[11px] whitespace-nowrap px-3 py-1 rounded-full bg-white dark:bg-neutral-900 hover:bg-slate-100 dark:hover:bg-neutral-800 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 transition cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Input Footer */}
      <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white dark:bg-neutral-950 border-t border-slate-200 dark:border-neutral-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Escreve uma dúvida para o Coach Sérgio Cunha..."
          className="flex-1 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-bold transition flex items-center justify-center shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
