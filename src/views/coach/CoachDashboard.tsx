import React, { useState } from 'react';
import { 
  Users, 
  Dumbbell, 
  CreditCard, 
  TrendingUp, 
  MessageSquare, 
  CalendarPlus, 
  UtensilsCrossed, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Flame,
  Sparkles,
  RotateCcw,
  CalendarCheck,
  Send,
  AlertCircle,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface CoachDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const CoachDashboard: React.FC<CoachDashboardProps> = ({ onNavigateTab }) => {
  const { allClients } = useAuth();
  const { 
    exercises, 
    workoutPlans, 
    messages, 
    setSelectedAthleteId,
    currentWeekNumber,
    startNewWeekReset
  } = useData();

  const [showResetModal, setShowResetModal] = useState(false);
  const [newStartDate, setNewStartDate] = useState('2026-10-12');
  const [newEndDate, setNewEndDate] = useState('2026-10-18');
  const [newWeekNotes, setNewWeekNotes] = useState('Novo ciclo de progressão de cargas. Manter foco na técnica e hidratação.');
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  const activeClients = allClients.filter(c => c.subscriptionStatus === 'active');
  const unreadMessagesCount = messages.filter(m => m.senderRole === 'client' && !m.read).length;

  const handleConfirmNewWeek = async () => {
    const nextWeekNum = currentWeekNumber + 1;
    await startNewWeekReset({
      newWeekNumber: nextWeekNum,
      startDate: newStartDate,
      endDate: newEndDate,
      notes: newWeekNotes,
    });

    setShowResetModal(false);
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    setResetSuccessMessage(`Semana ${nextWeekNum} iniciada com sucesso! Todos os treinos e dietas foram reiniciados para os atletas.`);
    setTimeout(() => setResetSuccessMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                Painel do Treinador Sérgio Cunha
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Semana {currentWeekNumber} em Curso
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Olá, Coach Sérgio!
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-xl leading-relaxed">
              Todos os teus atletas têm planos ativos e monitorizados. Tens <strong className="text-amber-400">{unreadMessagesCount} mensagens pendentes</strong> e <strong className="text-white">{activeClients.length} atletas</strong> com acompanhamento VIP ativo.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('builder-workout')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Criar Novo Treino</span>
            </button>
            <button
              onClick={() => onNavigateTab('builder-nutrition')}
              className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center gap-2 border border-neutral-700 transition"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Prescrever Ementa</span>
            </button>
          </div>
        </div>
      </div>

      {resetSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{resetSuccessMessage}</span>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div 
          onClick={() => onNavigateTab('athletes')}
          className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 cursor-pointer transition shadow-md group"
        >
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Atletas Sob Acompanhamento</span>
            <Users className="w-4 h-4 text-amber-500 group-hover:scale-110 transition" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{allClients.length}</span>
            <span className="text-xs text-emerald-400 font-semibold">{activeClients.length} ativos</span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-400 flex items-center justify-between">
            <span>100% aderência às rotinas</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('exercises')}
          className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 cursor-pointer transition shadow-md group"
        >
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Biblioteca de Exercícios</span>
            <Dumbbell className="w-4 h-4 text-amber-500 group-hover:scale-110 transition" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{exercises.length}</span>
            <span className="text-xs text-neutral-400">variáveis com vídeo</span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-400 flex items-center justify-between">
            <span>Reutilizáveis nos planos</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('chat')}
          className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 cursor-pointer transition shadow-md group"
        >
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Mensagens & Dúvidas</span>
            <MessageSquare className="w-4 h-4 text-amber-500 group-hover:scale-110 transition" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{messages.length}</span>
            {unreadMessagesCount > 0 && (
              <span className="text-xs text-amber-400 font-bold px-2 py-0.5 rounded-full bg-amber-500/10">
                {unreadMessagesCount} não lidas
              </span>
            )}
          </div>
          <div className="mt-2 text-[11px] text-neutral-400 flex items-center justify-between">
            <span>Canal direto com alunos</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('athletes')}
          className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 cursor-pointer transition shadow-md group"
        >
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Faturação Mensal (MRR)</span>
            <CreditCard className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">
              {activeClients.length * 100} €
            </span>
            <span className="text-xs text-neutral-400">/mês (100€ fixo)</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 flex items-center justify-between">
            <span>Gestão de subscrições</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
          </div>
        </div>

      </div>

      {/* Athletes Sunday Management & SUNDAY NEW WEEK MANAGEMENT CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Athletes List with Direct Sunday Workout & Diet Management */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Gestão Dominical de Treinos & Dietas dos Atletas</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Semana {currentWeekNumber}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Revê ou ajusta o plano de treino e a ementa individual de cada atleta antes de efetuar o reset semanal.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('athletes')}
              className="text-xs text-amber-500 hover:text-amber-400 font-semibold flex items-center gap-1 self-start sm:self-auto shrink-0"
            >
              <span>Ver Fichas Detalhadas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {allClients.map((client) => {
              const isActive = client.subscriptionStatus === 'active';
              const clientWorkout = workoutPlans.find(p => p.clientId === client.uid && p.status === 'active') || workoutPlans[0];
              const clientNutrition = (client as any).nutritionPlanTitle || (client.uid === 'client-marta-pereira' ? '1900 kcal (Tonificação)' : '2350 kcal (Recomposição)');

              return (
                <div
                  key={client.uid}
                  className="p-4 rounded-2xl bg-neutral-950/80 hover:bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={client.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                      alt={client.displayName}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-neutral-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-white truncate">{client.displayName}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {isActive ? 'Ativo VIP' : 'Pendente'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1 flex-wrap font-mono">
                        <span className="text-neutral-300">
                          ⚖️ {client.currentWeightKg || client.initialWeightKg} kg
                        </span>
                        <span className="text-neutral-500">•</span>
                        <span className="text-amber-400/90 text-[11px]">
                          🥗 {clientNutrition}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Sunday Quick Action Buttons for this Athlete */}
                  <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-800/80">
                    <button
                      onClick={() => {
                        setSelectedAthleteId(client.uid);
                        onNavigateTab('builder-workout');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
                      title="Editar o plano de treino deste atleta"
                    >
                      <Dumbbell className="w-3.5 h-3.5 text-amber-500" />
                      <span>Tratar Treino</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedAthleteId(client.uid);
                        onNavigateTab('builder-nutrition');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
                      title="Prescrever ementa deste atleta"
                    >
                      <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Tratar Dieta</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedAthleteId(client.uid);
                        onNavigateTab('athletes');
                      }}
                      className="p-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-white transition"
                      title="Ver histórico e cargas"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SUNDAY NEW WEEK MANAGEMENT CARD */}
        <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1.5">
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Gestão Dominical</span>
              </span>
              <span className="text-xs font-mono text-neutral-400 font-bold">
                Semana Atual: {currentWeekNumber}
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-lg text-white">
                Transição Semanal (Domingo)
              </h3>
              <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">
                Ao domingo, trata dos treinos e dietas de todos os teus atletas com total calma.
              </p>
            </div>

            {/* Sunday athletes flow note */}
            <div className="bg-neutral-950/90 border border-neutral-800 rounded-2xl p-4 text-xs text-neutral-300 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed text-neutral-300">
                  <strong className="text-white">Garantia para os Alunos:</strong> Se algum atleta ainda estiver no domingo a concluir o seu último treino ou séries de carga, a rotina atual <strong>permanece 100% visível</strong>. A Semana {currentWeekNumber + 1} só aparecerá quando clicares no botão de reset abaixo.
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px]">
                <span className="text-neutral-400">Total de atletas vigentes:</span>
                <span className="text-amber-400 font-bold font-mono">{allClients.length} atletas</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/70 text-[11px] text-neutral-400 space-y-1">
              <div className="flex items-center gap-1.5 text-neutral-300 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Passos de Domingo:</span>
              </div>
              <p>1. Ajusta os treinos e dietas dos atletas na lista ao lado.</p>
              <p>2. Quando estiver tudo pronto, clica em <strong>"Nova Semana"</strong>.</p>
              <p>3. As séries são limpas e os alunos recebem notificação.</p>
            </div>
          </div>

          {/* MAIN BUTTON: NOVA SEMANA (RESET) */}
          <div className="mt-6 pt-4 border-t border-neutral-800 space-y-2">
            <button
              onClick={() => setShowResetModal(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Nova Semana (Fazer Reset)</span>
            </button>
            <p className="text-[10px] text-center text-neutral-500">
              Disponibiliza a Semana {currentWeekNumber + 1} para todos os alunos em simultâneo
            </p>
          </div>

        </div>

      </div>

      {/* MODAL: CONFIRM NEW WEEK RESET */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">
                    Viragem para a Semana {currentWeekNumber + 1}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Reset semanal e lançamento das novas rotinas
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowResetModal(false)}
                className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Data de Início (Segunda)
                  </label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Data de Fim (Domingo)
                  </label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Mensagem de Motivação para a Nova Semana
                </label>
                <textarea
                  rows={2}
                  value={newWeekNotes}
                  onChange={(e) => setNewWeekNotes(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* What happens on Reset */}
              <div className="bg-neutral-950/80 rounded-2xl p-4 border border-neutral-800 space-y-2 text-xs">
                <span className="font-bold text-white text-[11px] uppercase tracking-wider block mb-1">
                  Ações automáticas ao fazer o reset:
                </span>
                <div className="flex items-center gap-2 text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Reinicia os vistos das séries para que os alunos comecem limpos</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Preserva todas as cargas registadas no histórico dos atletas</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Envia notificação push automática a todos os clientes</span>
                </div>
              </div>

            </div>

            <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmNewWeek}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Confirmar & Ativar Semana {currentWeekNumber + 1}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
