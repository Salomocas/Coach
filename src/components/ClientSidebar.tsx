import React from 'react';
import { 
  Calendar, 
  Utensils, 
  MessageSquare, 
  TrendingUp, 
  CreditCard,
  User,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface ClientSidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const ClientSidebar: React.FC<ClientSidebarProps> = ({ currentTab, onSelectTab }) => {
  const { currentUser, isSubscriptionActive } = useAuth();
  const { messages } = useData();

  // Count unread messages from coach
  const unreadCoachMessages = messages.filter(
    m => m.senderRole === 'coach' && !m.read && m.clientId === currentUser?.uid
  ).length;

  const navItems = [
    {
      id: 'calendar',
      label: 'Calendário de Treino',
      shortLabel: 'Treino',
      icon: Calendar,
      description: 'Rotinas semanais & registo de cargas'
    },
    {
      id: 'nutrition',
      label: 'Nutrição & Ementas',
      shortLabel: 'Nutrição',
      icon: Utensils,
      description: 'Plano alimentar e macronutrientes'
    },
    {
      id: 'chat',
      label: 'Chat com o Coach',
      shortLabel: 'Chat',
      icon: MessageSquare,
      badge: unreadCoachMessages > 0 ? unreadCoachMessages : undefined,
      description: 'Dúvidas em tempo real com Sérgio Cunha'
    },
    {
      id: 'progress',
      label: 'Evolução & Medidas',
      shortLabel: 'Progresso',
      icon: TrendingUp,
      description: 'Gráficos de peso, perímetros e fotos'
    },
    {
      id: 'subscription',
      label: 'Subscrição & Pagamentos',
      shortLabel: 'Assinatura',
      icon: CreditCard,
      status: currentUser?.subscriptionStatus,
      description: 'Gestão da mensalidade de treino'
    }
  ];

  return (
    <>
      {/* Desktop Vertical Menu (Left side) */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 border-r border-neutral-800 bg-neutral-950 p-4 shrink-0 min-h-[calc(100vh-65px)]">
        
        {/* User Card */}
        <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <img 
              src={currentUser?.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'} 
              alt={currentUser?.displayName}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-500/30"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-white truncate">{currentUser?.displayName}</h3>
              <p className="text-xs text-neutral-400">Atleta Acompanhado</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`w-2 h-2 rounded-full ${isSubscriptionActive ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-red-500'}`} />
                <span className="text-[11px] font-medium text-neutral-300">
                  {isSubscriptionActive ? 'Mensalidade Ativa' : 'Pagamento Pendente'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
            <span>Treinador:</span>
            <span className="text-amber-400 font-semibold">Sérgio Cunha</span>
          </div>
        </div>

        {/* Menu Navigation */}
        <div className="space-y-1.5 flex-1">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 px-3 mb-2">
            Menu do Aluno
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
                    ? 'bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/10'
                    : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-black/15 text-black' : 'bg-neutral-900 text-neutral-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold truncate leading-tight">
                      {item.label}
                    </div>
                    <div className={`text-[10px] truncate ${isActive ? 'text-black/80 font-normal' : 'text-neutral-500'}`}>
                      {item.description}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 ml-2">
                  {item.badge && (
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-black text-amber-400' : 'bg-amber-500 text-black'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.status && item.status !== 'active' && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                      Pendente
                    </span>
                  )}
                  <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-black/60' : 'text-neutral-600'}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Coach Direct Contact Reminder */}
        <div className="mt-auto pt-4 border-t border-neutral-800">
          <div className="bg-neutral-900/50 rounded-xl p-3 border border-neutral-800 text-xs">
            <div className="text-neutral-300 font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Apoio Personalizado</span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">
              Feedback contínuo e ajuste constante às tuas respostas fisiológicas.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-lg border-t border-neutral-800 px-2 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all relative ${
                isActive ? 'text-amber-500 font-bold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge && (
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
