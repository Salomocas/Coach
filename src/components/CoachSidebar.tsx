import React from 'react';
import { 
  Users, 
  TrendingUp,
  Dumbbell, 
  UtensilsCrossed, 
  MessageSquare,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface CoachSidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const CoachSidebar: React.FC<CoachSidebarProps> = ({ currentTab, onSelectTab }) => {
  const { allClients } = useAuth();
  const { messages } = useData();

  // Total unread messages across all clients
  const unreadCount = messages.filter(m => m.senderRole === 'client' && !m.read).length;

  // Ultra-compact Coach menu: only Icons and Short Titles, zero clutter, zero profile card
  const navItems = [
    {
      id: 'athletes',
      label: 'Atletas',
      icon: Users,
      badge: allClients.length,
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: TrendingUp,
    },
    {
      id: 'workouts',
      label: 'Treinos',
      icon: Dumbbell,
    },
    {
      id: 'diet',
      label: 'Dieta',
      icon: UtensilsCrossed,
    },
    {
      id: 'library',
      label: 'Biblioteca',
      icon: Layers,
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: MessageSquare,
      badge: unreadCount > 0 ? unreadCount : undefined,
    }
  ];

  return (
    <>
      {/* Desktop Vertical Menu - Compact & Slim, occupying minimal screen space */}
      <aside className="hidden md:flex flex-col w-48 lg:w-52 border-r border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-2.5 sm:p-3 shrink-0 min-h-[calc(100vh-65px)] transition-colors">
        
        {/* Navigation buttons: only icon and title */}
        <div className="space-y-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left ${
                  isActive
                    ? 'bg-amber-500 text-black font-bold shadow-sm shadow-amber-500/20'
                    : 'text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-white font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : 'text-slate-500 dark:text-neutral-400'}`} />
                  <span className="text-xs truncate font-bold">
                    {item.label}
                  </span>
                </div>

                {item.badge !== undefined && (
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0 ml-1.5 ${
                    isActive ? 'bg-black text-amber-400' : 'bg-slate-200 dark:bg-neutral-800 text-slate-700 dark:text-amber-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar for Coach */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-lg border-t border-slate-200 dark:border-neutral-800 px-2 py-2 flex items-center justify-around transition-colors">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all relative ${
                isActive ? 'text-amber-500 font-bold' : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] font-extrabold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
