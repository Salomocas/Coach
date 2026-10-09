import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp,
  Dumbbell, 
  CalendarPlus, 
  UtensilsCrossed, 
  MessageSquare,
  ChevronRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface CoachSidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const CoachSidebar: React.FC<CoachSidebarProps> = ({ currentTab, onSelectTab }) => {
  const { currentUser, allClients } = useAuth();
  const { messages } = useData();

  // Total unread messages across all clients
  const unreadCount = messages.filter(m => m.senderRole === 'client' && !m.read).length;

  const navItems = [
    {
      id: 'athletes',
      label: 'Gestão de Atletas',
      shortLabel: 'Atletas',
      icon: Users,
      badge: allClients.length,
      description: 'Estado de acesso, peso & objetivos'
    },
    {
      id: 'reports',
      label: 'Relatórios',
      shortLabel: 'Relatórios',
      icon: TrendingUp,
      description: 'Evolução gráfica & avaliações físicas'
    },
    {
      id: 'workouts',
      label: 'Treinos',
      shortLabel: 'Treinos',
      icon: Dumbbell,
      description: 'Calendário semanal & atribuição por aluno'
    },
    {
      id: 'diet',
      label: 'Dieta',
      shortLabel: 'Dieta',
      icon: UtensilsCrossed,
      description: 'Planeamento alimentar & calorias por aluno'
    },
    {
      id: 'library',
      label: 'Biblioteca',
      shortLabel: 'Biblioteca',
      icon: Layers,
      description: 'Exercícios & Ementas (Singular, Diário, Semanal)'
    },
    {
      id: 'chat',
      label: 'Conversas com Atletas',
      shortLabel: 'Mensagens',
      icon: MessageSquare,
      badge: unreadCount > 0 ? unreadCount : undefined,
      description: 'Chat individual com cada cliente'
    }
  ];

  return (
    <>
      {/* Desktop Vertical Menu */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 border-r border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 shrink-0 min-h-[calc(100vh-65px)] transition-colors">
        
        {/* Coach Profile Card */}
        <div className="bg-gradient-to-b from-slate-100 to-slate-50 dark:from-neutral-900 dark:to-neutral-900/60 border border-slate-200 dark:border-neutral-800 rounded-2xl p-4 mb-4 shadow-sm">
          <div className="flex items-center gap-3">
            <img 
              src={currentUser?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
              alt={currentUser?.displayName || 'Coach Sérgio Cunha'}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-500 shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">{currentUser?.displayName || 'Sérgio Cunha'}</h3>
              <p className="text-xs text-amber-500 font-semibold">Personal Trainer & Coach</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] text-slate-500 dark:text-neutral-300 font-medium">Painel de Gestor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Navigation */}
        <div className="space-y-1.5 flex-1">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-neutral-500 px-3 mb-2">
            Gestão & Criação
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left ${
                  isActive
                    ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/10'
                    : 'text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-black/15 text-black' : 'bg-slate-100 dark:bg-neutral-900 text-slate-500 dark:text-neutral-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold truncate leading-tight">
                      {item.label}
                    </div>
                    <div className={`text-[10px] truncate ${isActive ? 'text-black/80 font-normal' : 'text-slate-400 dark:text-neutral-500'}`}>
                      {item.description}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 ml-2">
                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-black text-amber-400' : 'bg-slate-200 dark:bg-neutral-800 text-slate-800 dark:text-amber-400 border border-slate-300 dark:border-neutral-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-black/60' : 'text-slate-400 dark:text-neutral-600'}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-auto pt-4 border-t border-slate-200 dark:border-neutral-800 text-center">
          <p className="text-[10px] text-slate-400 dark:text-neutral-500">
            Coach Sérgio Cunha • Treino & Performance
          </p>
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
              <span className="text-[10px] tracking-tight">{item.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
