import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  TrendingUp, 
  Calendar, 
  Utensils, 
  MessageSquare, 
  CreditCard, 
  X, 
  Scale, 
  Ruler, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { UserProfile } from '../../types';

interface CoachAthletesViewProps {
  onNavigateTab: (tab: string) => void;
}

export const CoachAthletesView: React.FC<CoachAthletesViewProps> = ({ onNavigateTab }) => {
  const { allClients } = useAuth();
  const { 
    workoutPlans, 
    nutritionPlans, 
    progressLogs, 
    selectedAthleteId, 
    setSelectedAthleteId 
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [selectedClientModal, setSelectedClientModal] = useState<UserProfile | null>(null);

  const filteredClients = allClients.filter(c => {
    const matchesSearch = c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'active' && c.subscriptionStatus === 'active') ||
                          (statusFilter === 'expired' && c.subscriptionStatus !== 'active');
    return matchesSearch && matchesStatus;
  });

  const openAthleteModal = (client: UserProfile) => {
    setSelectedAthleteId(client.uid);
    setSelectedClientModal(client);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
            Gestão & Controlo de Alunos
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Diretório de Atletas
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Visualiza todos os clientes, histórico de evolução, cargas e estado das subscrições.
          </p>
        </div>

        <span className="text-xs font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl shrink-0">
          Total: <strong className="text-white">{allClients.length} atletas</strong>
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-900 border border-neutral-800 rounded-2xl p-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por nome ou email..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-neutral-400 hidden sm:inline">Filtrar:</span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              statusFilter === 'all' ? 'bg-amber-500 text-black font-bold' : 'bg-neutral-950 text-neutral-400 hover:text-white'
            }`}
          >
            Todos ({allClients.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              statusFilter === 'active' ? 'bg-emerald-500 text-black font-bold' : 'bg-neutral-950 text-neutral-400 hover:text-white'
            }`}
          >
            Ativos ({allClients.filter(c => c.subscriptionStatus === 'active').length})
          </button>
          <button
            onClick={() => setStatusFilter('expired')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              statusFilter === 'expired' ? 'bg-red-500 text-white font-bold' : 'bg-neutral-950 text-neutral-400 hover:text-white'
            }`}
          >
            Pendentes ({allClients.filter(c => c.subscriptionStatus !== 'active').length})
          </button>
        </div>
      </div>

      {/* Athletes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => {
          const isActive = client.subscriptionStatus === 'active';
          const clientWorkout = workoutPlans.find(p => p.clientId === client.uid && p.status === 'active');
          const clientNutrition = nutritionPlans.find(p => p.clientId === client.uid);

          return (
            <div
              key={client.uid}
              onClick={() => openAthleteModal(client)}
              className="bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-3xl p-5 cursor-pointer transition-all shadow-lg hover:shadow-amber-500/5 group flex flex-col justify-between"
            >
              <div>
                {/* Client Card Top */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={client.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                      alt={client.displayName}
                      className="w-13 h-13 rounded-2xl object-cover ring-2 ring-neutral-700 group-hover:ring-amber-500 transition"
                    />
                    <div>
                      <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition">
                        {client.displayName}
                      </h3>
                      <p className="text-xs text-neutral-400">{client.email}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                    isActive 
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-red-500/15 text-red-400 border border-red-500/30'
                  }`}>
                    {isActive ? 'Ativo' : 'Expirado'}
                  </span>
                </div>

                {/* Goals */}
                <div className="bg-neutral-950/70 rounded-xl p-3 border border-neutral-800/80 mb-4">
                  <span className="text-[10px] font-bold uppercase text-neutral-500 block mb-0.5">
                    Objetivo Principal
                  </span>
                  <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                    {client.goals || 'Hipertrofia muscular e melhoria de performance.'}
                  </p>
                </div>

                {/* Measurements Quick Preview */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800">
                    <span className="text-[10px] text-neutral-500 block">Peso Atual</span>
                    <span className="font-mono font-bold text-white">
                      {client.currentWeightKg || client.initialWeightKg} kg
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800">
                    <span className="text-[10px] text-neutral-500 block">Altura</span>
                    <span className="font-mono font-bold text-white">{client.heightCm || 178} cm</span>
                  </div>
                </div>
              </div>

              {/* Action hints */}
              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                <span className="text-amber-400 font-semibold text-[11px]">Ver Ficha & Avaliações</span>
                <span className="text-[10px] text-neutral-500">{client.subscriptionPlan}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Athlete Modal */}
      {selectedClientModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-4">
                <img
                  src={selectedClientModal.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                  alt={selectedClientModal.displayName}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-500"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      {selectedClientModal.displayName}
                    </h2>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      selectedClientModal.subscriptionStatus === 'active'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/15 text-red-400 border border-red-500/30'
                    }`}>
                      {selectedClientModal.subscriptionStatus === 'active' ? 'Mensalidade Ativa' : 'Expirada'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {selectedClientModal.email} • {selectedClientModal.phone}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedClientModal(null)}
                className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-6 space-y-6">
              
              {/* Objective Banner */}
              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500 block mb-1">
                  Metas Estabelecidas com o Coach Sérgio Cunha
                </span>
                <p className="text-sm text-neutral-200 leading-relaxed">
                  {selectedClientModal.goals}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => {
                    setSelectedClientModal(null);
                    onNavigateTab('builder-workout');
                  }}
                  className="p-3.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left transition"
                >
                  <Calendar className="w-4 h-4 text-amber-500 mb-1.5" />
                  <div className="text-xs font-bold text-white">Editar Treino Semanal</div>
                  <div className="text-[10px] text-neutral-400">Atribuir séries e exercícios</div>
                </button>

                <button
                  onClick={() => {
                    setSelectedClientModal(null);
                    onNavigateTab('builder-nutrition');
                  }}
                  className="p-3.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left transition"
                >
                  <Utensils className="w-4 h-4 text-emerald-500 mb-1.5" />
                  <div className="text-xs font-bold text-white">Prescrever Nutrição</div>
                  <div className="text-[10px] text-neutral-400">Ementa e cálculo de macros</div>
                </button>

                <button
                  onClick={() => {
                    setSelectedClientModal(null);
                    onNavigateTab('chat');
                  }}
                  className="p-3.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left transition"
                >
                  <MessageSquare className="w-4 h-4 text-sky-500 mb-1.5" />
                  <div className="text-xs font-bold text-white">Conversar no Chat</div>
                  <div className="text-[10px] text-neutral-400">Tirar dúvidas em tempo real</div>
                </button>
              </div>

              {/* Progress and Measurements History */}
              <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                    Histórico de Avaliações Físicas
                  </h4>
                  <span className="text-xs text-neutral-400 font-mono">
                    Peso Inicial: {selectedClientModal.initialWeightKg} kg
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px]">
                        <th className="py-2">Data</th>
                        <th className="py-2">Peso</th>
                        <th className="py-2">% Gordura</th>
                        <th className="py-2">Cintura</th>
                        <th className="py-2">Braço</th>
                        <th className="py-2">Notas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-900">
                      {progressLogs.slice().reverse().map((log) => (
                        <tr key={log.id}>
                          <td className="py-2.5 font-mono text-white">{log.date}</td>
                          <td className="py-2.5 font-mono font-bold text-amber-400">{log.weightKg} kg</td>
                          <td className="py-2.5 font-mono text-neutral-300">{log.bodyFatPercent || '-'} %</td>
                          <td className="py-2.5 font-mono text-neutral-300">{log.waistCm || '-'} cm</td>
                          <td className="py-2.5 font-mono text-neutral-300">{log.armCm || '-'} cm</td>
                          <td className="py-2.5 text-neutral-400 italic text-[11px] max-w-[150px] truncate">{log.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-neutral-800 flex justify-end gap-3">
              <button
                onClick={() => setSelectedClientModal(null)}
                className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold"
              >
                Fechar Ficha
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
