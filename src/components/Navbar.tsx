import React, { useState } from 'react';
import { 
  Dumbbell, 
  Bell, 
  User, 
  ChevronDown, 
  LogOut, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Utensils,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface NavbarProps {
  onNavigateClient?: (view: string) => void;
  onNavigateCoach?: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateClient, onNavigateCoach }) => {
  const { currentUser, isCoach, switchPersona, logout, allClients } = useAuth();
  const { notifications, unreadCount, markNotificationAsRead } = useData();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 text-neutral-100 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black font-extrabold shadow-lg shadow-amber-500/20">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">
                Coach Sérgio Cunha
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                isCoach 
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' 
                  : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
              }`}>
                {isCoach ? 'Treinador' : 'Área do Aluno'}
              </span>
            </div>
            <p className="text-xs text-neutral-400 hidden sm:block">
              Acompanhamento de Treino, Nutrição & Alta Performance
            </p>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-3">
          
          {/* Quick Demo Switcher */}
          <div className="hidden md:flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => switchPersona('coach')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                isCoach 
                  ? 'bg-amber-500 text-black shadow-sm font-semibold' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Modo Coach
            </button>
            <button
              onClick={() => switchPersona('client', 0)}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                !isCoach && currentUser?.displayName === 'Ricardo Silva'
                  ? 'bg-amber-500 text-black shadow-sm font-semibold' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Aluno Ricardo
            </button>
            <button
              onClick={() => switchPersona('client', 2)}
              title="Testar atleta com mensalidade por regularizar"
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
                !isCoach && currentUser?.displayName === 'Diogo Costa'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Aluno Expirado
            </button>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition"
              aria-label="Notificações"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-black font-bold text-[10px] flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl z-50 p-3">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800">
                  <div className="font-semibold text-sm text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-500" />
                    Notificações
                  </div>
                  <span className="text-[11px] text-neutral-400">
                    {unreadCount} novas
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-center text-xs text-neutral-500 py-4">Sem notificações de momento.</p>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          if (notif.type === 'workout' && onNavigateClient) onNavigateClient('calendar');
                          if (notif.type === 'nutrition' && onNavigateClient) onNavigateClient('nutrition');
                          if (notif.type === 'chat' && onNavigateClient) onNavigateClient('chat');
                          setShowNotifs(false);
                        }}
                        className={`p-2.5 rounded-lg text-xs cursor-pointer transition ${
                          notif.read ? 'bg-neutral-950/60 text-neutral-400' : 'bg-neutral-800/80 text-neutral-200 border border-amber-500/20'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5">
                            {notif.type === 'workout' && <Calendar className="w-3.5 h-3.5 text-amber-400" />}
                            {notif.type === 'nutrition' && <Utensils className="w-3.5 h-3.5 text-emerald-400" />}
                            {notif.type === 'chat' && <MessageSquare className="w-3.5 h-3.5 text-sky-400" />}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-white flex items-center justify-between">
                              <span>{notif.title}</span>
                              <span className="text-[10px] text-neutral-500">{notif.createdAt}</span>
                            </div>
                            <p className="text-[11px] text-neutral-300 mt-0.5 line-clamp-2">{notif.message}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition"
            >
              <img
                src={currentUser?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={currentUser?.displayName}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-neutral-700"
              />
              <div className="text-left hidden lg:block">
                <div className="text-xs font-semibold text-white leading-tight">
                  {currentUser?.displayName}
                </div>
                <div className="text-[10px] text-neutral-400">
                  {currentUser?.role === 'coach' ? 'Treinador Principal' : currentUser?.subscriptionPlan}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl z-50 p-2 text-xs">
                <div className="p-2 border-b border-neutral-800 mb-1">
                  <p className="font-bold text-white text-sm">{currentUser?.displayName}</p>
                  <p className="text-neutral-400 text-[11px] truncate">{currentUser?.email}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${currentUser?.subscriptionStatus === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span className="text-[10px] text-neutral-300 capitalize">
                      Subscrição: {currentUser?.subscriptionStatus === 'active' ? 'Ativa' : 'Expirada / Pendente'}
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  <p className="px-2 py-1 text-[10px] font-semibold uppercase text-neutral-500">Alternar Modo (Demo)</p>
                  <button
                    onClick={() => { switchPersona('coach'); setShowUserMenu(false); }}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-neutral-800 text-neutral-200 flex items-center justify-between"
                  >
                    <span>Coach Sérgio Cunha</span>
                    {isCoach && <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />}
                  </button>
                  {allClients.map((client, idx) => (
                    <button
                      key={client.uid}
                      onClick={() => { switchPersona('client', idx); setShowUserMenu(false); }}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-neutral-800 text-neutral-200 flex items-center justify-between"
                    >
                      <span className="truncate">{client.displayName} ({client.subscriptionStatus})</span>
                      {!isCoach && currentUser?.uid === client.uid && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-1 border-t border-neutral-800 mt-1">
                  <button
                    onClick={() => { logout(); setShowUserMenu(false); }}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-red-500/10 text-red-400 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Terminar Sessão</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
