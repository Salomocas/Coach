import React from 'react';
import { 
  Calendar, 
  Utensils, 
  TrendingUp, 
  MessageSquare 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { CoachCunhaLogo } from './CoachCunhaLogo';

interface ClientSidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const ClientSidebar: React.FC<ClientSidebarProps> = ({ currentTab, onSelectTab }) => {
  const { currentUser } = useAuth();
  const { messages } = useData();

  // Count unread messages from coach specifically for this student
  const unreadCoachMessages = messages.filter(
    m => m.senderRole === 'coach' && !m.read && m.clientId === currentUser?.uid
  ).length;

  // Reduced client menu items: Calendário, Nutrição, Evolução, Chat
  const navItems = [
    {
      id: 'calendar',
      label: 'Calendário',
      icon: Calendar,
    },
    {
      id: 'nutrition',
      label: 'Nutrição',
      icon: Utensils,
    },
    {
      id: 'progress',
      label: 'Evolução',
      icon: TrendingUp,
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: MessageSquare,
      badge: unreadCoachMessages > 0 ? unreadCoachMessages : undefined,
    },
  ];

  return (
    <>
      {/* Desktop Vertical Menu (Compact left side) */}
      <aside className="hidden md:flex flex-col w-48 lg:w-52 border-r border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-2.5 sm:p-3 shrink-0 min-h-[calc(100vh-65px)] transition-colors">
        
        {/* Short title and logo header */}
        <div className="flex items-center gap-2.5 px-2 py-2.5 mb-2.5 border-b border-slate-100 dark:border-neutral-900">
          <CoachCunhaLogo size="xs" className="shrink-0" />
          <div className="min-w-0">
            <span className="font-black text-xs uppercase tracking-tight text-slate-900 dark:text-white leading-none block truncate">
              Coach Cunha
            </span>
            <span className="text-[10px] font-bold uppercase text-amber-500 tracking-wider block mt-0.5">
              Project
            </span>
          </div>
        </div>

        {/* Compact Navigation Menu */}
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-black font-bold shadow-sm shadow-amber-500/20'
                    : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : 'text-slate-500 dark:text-neutral-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge ? (
                  <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-black text-amber-400' : 'bg-amber-500 text-black'
                  }`}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-lg border-t border-slate-200 dark:border-neutral-800 px-3 py-2 flex items-center justify-around transition-colors">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all relative cursor-pointer ${
                isActive ? 'text-amber-500 font-bold' : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge ? (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] font-extrabold flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
