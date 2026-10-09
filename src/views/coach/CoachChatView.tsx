import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  MessageSquare, 
  Users, 
  CheckCheck, 
  ShieldCheck, 
  Sparkles, 
  Search,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const CoachChatView: React.FC = () => {
  const { allClients } = useAuth();
  const { messages, sendMessage, markMessagesAsRead, selectedAthleteId, setSelectedAthleteId } = useData();

  const [activeClientId, setActiveClientId] = useState<string>(selectedAthleteId || allClients[0]?.uid || 'client-ricardo-silva');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeClient = allClients.find(c => c.uid === activeClientId) || allClients[0];

  // Filter messages for active conversation
  const clientMessages = messages.filter(m => m.clientId === activeClientId);

  useEffect(() => {
    if (activeClientId) {
      markMessagesAsRead(activeClientId);
      setSelectedAthleteId(activeClientId);
    }
  }, [activeClientId, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [clientMessages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText.trim(), activeClientId);
    setInputText('');
  };

  const fastReplies = [
    'Excelente treino! Mantém a consistência e a carga.',
    'Podes aumentar 2.5kg de cada lado na próxima semana.',
    'Não te esqueças de beber os 3.5L de água recomendados.',
    'Ajustei a tua ementa alimentar para a semana!'
  ];

  const filteredClients = allClients.filter(c => 
    c.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-140px)] min-h-[550px] bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm transition-colors">
      
      {/* Left Athlete Conversation List */}
      <div className="w-72 sm:w-80 border-r border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 flex flex-col shrink-0">
        
        <div className="p-4 border-b border-slate-200 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-500" />
              <span>Mensagens dos Alunos</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-600 dark:text-neutral-400 bg-white dark:bg-neutral-900 px-2 py-0.5 rounded-full border border-slate-200 dark:border-neutral-800">
              {allClients.length}
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar conversa..."
              className="w-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Client List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-200 dark:divide-neutral-900">
          {filteredClients.map((client) => {
            const isSelected = client.uid === activeClientId;
            const clientMsgHistory = messages.filter(m => m.clientId === client.uid);
            const lastMsg = clientMsgHistory[clientMsgHistory.length - 1];
            const unreadCount = clientMsgHistory.filter(m => m.senderRole === 'client' && !m.read).length;

            return (
              <div
                key={client.uid}
                onClick={() => setActiveClientId(client.uid)}
                className={`p-3.5 flex items-center gap-3 cursor-pointer transition select-none ${
                  isSelected 
                    ? 'bg-amber-500/10 dark:bg-neutral-900 border-l-4 border-amber-500' 
                    : 'hover:bg-slate-100 dark:hover:bg-neutral-900/50'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={client.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                    alt={client.displayName}
                    className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-300 dark:ring-neutral-700"
                  />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] font-extrabold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{client.displayName}</h4>
                    <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">
                      {lastMsg?.createdAt || ''}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400 truncate mt-0.5">
                    {lastMsg ? lastMsg.text : 'Nenhuma mensagem recente'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Right Active Conversation Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/40 dark:bg-neutral-950/40">
        
        {/* Active Client Header */}
        <div className="p-4 bg-white dark:bg-neutral-950 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={activeClient?.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
              alt={activeClient?.displayName}
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-amber-500"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{activeClient?.displayName}</h3>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  activeClient?.subscriptionStatus === 'active'
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
                }`}>
                  {activeClient?.subscriptionStatus === 'active' ? 'Mensalidade Ativa' : 'Pendente'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                Peso Atual: {activeClient?.currentWeightKg || activeClient?.initialWeightKg} kg • {activeClient?.goals}
              </p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[11px] font-mono text-slate-400 dark:text-neutral-400">
              Notificação push enviada em cada resposta
            </span>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {clientMessages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center p-6 text-slate-400 dark:text-neutral-500 text-xs">
              <div>
                <MessageSquare className="w-8 h-8 text-slate-300 dark:text-neutral-700 mx-auto mb-2" />
                <p>Nenhuma mensagem trocada com este atleta ainda.</p>
                <p className="text-[11px] text-slate-400 dark:text-neutral-600 mt-1">Envia uma mensagem de boas-vindas ou feedback sobre o plano.</p>
              </div>
            </div>
          ) : (
            clientMessages.map((msg) => {
              const isCoachMsg = msg.senderRole === 'coach';

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${isCoachMsg ? 'justify-end' : 'justify-start'}`}
                >
                  {!isCoachMsg && (
                    <img
                      src={activeClient?.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                      alt={activeClient?.displayName}
                      className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-300 dark:ring-neutral-700 shrink-0 mb-1"
                    />
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-md rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                      isCoachMsg
                        ? 'bg-amber-500 text-black font-medium rounded-br-none'
                        : 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-neutral-100 rounded-bl-none border border-slate-200 dark:border-neutral-700'
                    }`}
                  >
                    <div className={`text-[10px] font-bold mb-1 flex items-center justify-between gap-4 ${
                      isCoachMsg ? 'text-black/70' : 'text-amber-500 dark:text-amber-400'
                    }`}>
                      <span>{isCoachMsg ? 'Tu (Coach Sérgio)' : activeClient?.displayName}</span>
                      <span className="font-mono text-[9px] font-normal opacity-80">{msg.createdAt}</span>
                    </div>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    {isCoachMsg && (
                      <div className="flex justify-end mt-1 text-black/60">
                        <CheckCheck className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Pre-made replies for coach */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-neutral-950/80 border-t border-slate-200 dark:border-neutral-800 overflow-x-auto scrollbar-none flex gap-2">
          {fastReplies.map((reply, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setInputText(reply)}
              className="text-[11px] whitespace-nowrap px-3 py-1 rounded-full bg-white dark:bg-neutral-900 hover:bg-slate-100 dark:hover:bg-neutral-800 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 transition cursor-pointer"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white dark:bg-neutral-950 border-t border-slate-200 dark:border-neutral-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Responder a ${activeClient?.displayName}...`}
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

    </div>
  );
};
