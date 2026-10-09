import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Scale, 
  Percent, 
  Activity, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  X, 
  Sparkles, 
  ChevronDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Ruler, 
  FileText, 
  Clock, 
  Target,
  BarChart2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ProgressLog } from '../../types';

export const CoachReportsView: React.FC = () => {
  const { allClients } = useAuth();
  const { 
    progressLogs, 
    selectedAthleteId, 
    setSelectedAthleteId, 
    addProgressLog, 
    deleteProgressLog 
  } = useData();

  // Selected parameter for graph:
  // 'weight' | 'bodyFat' | 'muscleMass' | 'waist' | 'comparison'
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'bodyFat' | 'muscleMass' | 'waist' | 'comparison'>('weight');
  const [timeRange, setTimeRange] = useState<'all' | '6m' | '3m' | '1m'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // New assessment form state
  const [newDate, setNewDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newWeight, setNewWeight] = useState<string>('');
  const [newBodyFat, setNewBodyFat] = useState<string>('');
  const [newMuscleMass, setNewMuscleMass] = useState<string>('');
  const [newWaist, setNewWaist] = useState<string>('');
  const [newChest, setNewChest] = useState<string>('');
  const [newArm, setNewArm] = useState<string>('');
  const [newHips, setNewHips] = useState<string>('');
  const [newThigh, setNewThigh] = useState<string>('');
  const [newNotes, setNewNotes] = useState<string>('');

  // Current client
  const currentClient = useMemo(() => {
    return allClients.find(c => c.uid === selectedAthleteId) || allClients[0] || null;
  }, [allClients, selectedAthleteId]);

  // Client logs chronologically sorted
  const sortedLogs = useMemo(() => {
    if (!currentClient) return [];
    // DataContext progressLogs is already filtered by selectedAthleteId if coach
    const logs = [...progressLogs].filter(p => p.clientId === currentClient.uid);
    return logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [progressLogs, currentClient]);

  // Filter logs by selected timeRange
  const filteredLogs = useMemo(() => {
    if (timeRange === 'all' || sortedLogs.length === 0) return sortedLogs;
    const now = new Date().getTime();
    const rangeDays = timeRange === '1m' ? 30 : timeRange === '3m' ? 90 : 180;
    const cutoff = now - rangeDays * 24 * 60 * 60 * 1000;
    const filtered = sortedLogs.filter(log => new Date(log.date).getTime() >= cutoff);
    return filtered.length > 0 ? filtered : sortedLogs;
  }, [sortedLogs, timeRange]);

  // Stats calculations
  const stats = useMemo(() => {
    if (!sortedLogs || sortedLogs.length === 0) {
      const defaultWeight = currentClient?.currentWeightKg || currentClient?.initialWeightKg || 75;
      const height = currentClient?.heightCm || 175;
      const bmi = (defaultWeight / Math.pow(height / 100, 2)).toFixed(1);
      return {
        initialWeight: defaultWeight,
        latestWeight: defaultWeight,
        weightDiff: 0,
        initialBodyFat: 20,
        latestBodyFat: 20,
        bodyFatDiff: 0,
        latestMuscleMass: 35,
        bmi,
        totalAssessments: 0
      };
    }

    const first = sortedLogs[0];
    const latest = sortedLogs[sortedLogs.length - 1];

    const initialWeight = first.weightKg;
    const latestWeight = latest.weightKg;
    const weightDiff = Number((latestWeight - initialWeight).toFixed(1));

    const initialBodyFat = first.bodyFatPercent || 0;
    const latestBodyFat = latest.bodyFatPercent || 0;
    const bodyFatDiff = initialBodyFat && latestBodyFat ? Number((latestBodyFat - initialBodyFat).toFixed(1)) : 0;

    const latestMuscleMass = latest.muscleMassKg || (latest.weightKg * (1 - (latest.bodyFatPercent || 20) / 100) * 0.55);

    const height = currentClient?.heightCm || 175;
    const bmi = (latestWeight / Math.pow(height / 100, 2)).toFixed(1);

    return {
      initialWeight,
      latestWeight,
      weightDiff,
      initialBodyFat,
      latestBodyFat,
      bodyFatDiff,
      latestMuscleMass: Number(latestMuscleMass.toFixed(1)),
      bmi,
      totalAssessments: sortedLogs.length
    };
  }, [sortedLogs, currentClient]);

  // Handle Save New Assessment
  const handleSaveAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClient) return;

    const weightVal = parseFloat(newWeight);
    if (isNaN(weightVal) || weightVal <= 0) {
      alert('Por favor introduza um peso corporal válido.');
      return;
    }

    const logData: Omit<ProgressLog, 'id' | 'createdAt'> = {
      clientId: currentClient.uid,
      date: newDate,
      weightKg: weightVal,
      bodyFatPercent: newBodyFat ? parseFloat(newBodyFat) : undefined,
      muscleMassKg: newMuscleMass ? parseFloat(newMuscleMass) : undefined,
      waistCm: newWaist ? parseFloat(newWaist) : undefined,
      chestCm: newChest ? parseFloat(newChest) : undefined,
      armCm: newArm ? parseFloat(newArm) : undefined,
      hipsCm: newHips ? parseFloat(newHips) : undefined,
      thighCm: newThigh ? parseFloat(newThigh) : undefined,
      notes: newNotes.trim() || undefined
    };

    await addProgressLog(logData);
    setFeedback(`Nova avaliação física registada com sucesso para ${currentClient.displayName}!`);
    setTimeout(() => setFeedback(null), 4000);

    // Reset fields
    setNewWeight('');
    setNewBodyFat('');
    setNewMuscleMass('');
    setNewWaist('');
    setNewChest('');
    setNewArm('');
    setNewHips('');
    setNewThigh('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  // Handle Delete Assessment
  const handleDeleteLog = async (id: string, date: string) => {
    if (window.confirm(`Tem a certeza que deseja eliminar o registo de avaliação de ${date}?`)) {
      await deleteProgressLog(id);
      setFeedback('Registo de avaliação eliminado com sucesso.');
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  // Helper for BMI classification
  const getBmiBadge = (bmiValue: number) => {
    if (bmiValue < 18.5) return { label: 'Abaixo do Peso', color: 'text-blue-500 bg-blue-500/10' };
    if (bmiValue < 25) return { label: 'Peso Saudável', color: 'text-emerald-500 bg-emerald-500/10' };
    if (bmiValue < 30) return { label: 'Sobrepeso / Muscular', color: 'text-amber-500 bg-amber-500/10' };
    return { label: 'Obesidade', color: 'text-red-500 bg-red-500/10' };
  };

  return (
    <div className="space-y-6">

      {/* Feedback Toast */}
      {feedback && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-medium flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header & Athlete Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-neutral-800">
        <div>
          <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
            Painel do Treinador • Avaliações & Desempenho
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-amber-500" />
            Relatórios de Evolução
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-1">
            Visualização gráfica de peso, gordura corporal e histórico numérico de avaliações físicas.
          </p>
        </div>

        {/* Athlete Selection Dropdown & New Assessment CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Athlete Selector */}
          <div className="relative">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 mb-1">
              Selecionar Atleta:
            </label>
            <div className="relative">
              <select
                value={selectedAthleteId}
                onChange={(e) => setSelectedAthleteId(e.target.value)}
                className="appearance-none bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl pl-3.5 pr-10 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 shadow-sm cursor-pointer min-w-[220px]"
              >
                {allClients.map((client) => {
                  const isActive = client.subscriptionStatus === 'active' || client.isManuallyUnlocked;
                  return (
                    <option key={client.uid} value={client.uid}>
                      {client.displayName} ({isActive ? 'Ativo' : 'Bloqueado'}) - {client.currentWeightKg || 75}kg
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 dark:text-neutral-500 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Add Assessment Button */}
          <div className="self-end sm:self-auto sm:mt-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs hover:bg-amber-400 transition flex items-center gap-2 shadow-md shadow-amber-500/10 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Registar Avaliação Física</span>
            </button>
          </div>
        </div>
      </div>

      {/* Selected Athlete Banner */}
      {currentClient && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={currentClient.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={currentClient.displayName}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-500 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {currentClient.displayName}
                </h3>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  currentClient.subscriptionStatus === 'active' || currentClient.isManuallyUnlocked
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                }`}>
                  {currentClient.subscriptionStatus === 'active' || currentClient.isManuallyUnlocked ? 'Ativo' : 'Bloqueado'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Objetivo: <strong className="text-slate-700 dark:text-neutral-300 font-semibold">{currentClient.goals || 'Recomposição corporal'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono self-start sm:self-auto">
            <div className="bg-white dark:bg-neutral-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-neutral-800">
              <span className="text-[10px] text-slate-400 block font-sans">Altura</span>
              <strong className="text-slate-900 dark:text-white">{currentClient.heightCm || 175} cm</strong>
            </div>
            <div className="bg-white dark:bg-neutral-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-neutral-800">
              <span className="text-[10px] text-slate-400 block font-sans">Peso Inicial</span>
              <strong className="text-slate-900 dark:text-white">{currentClient.initialWeightKg || stats.initialWeight} kg</strong>
            </div>
            <div className="bg-white dark:bg-neutral-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-neutral-800">
              <span className="text-[10px] text-slate-400 block font-sans">Peso Atual</span>
              <strong className="text-amber-500 font-bold">{stats.latestWeight} kg</strong>
            </div>
          </div>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Peso Atual & Variação */}
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 dark:text-neutral-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Peso Atual</span>
            <Scale className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {stats.latestWeight}
            </span>
            <span className="text-xs font-bold text-slate-400">kg</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs font-bold">
            {stats.weightDiff < 0 ? (
              <span className="text-emerald-500 flex items-center">
                <ArrowDownRight className="w-3.5 h-3.5" />
                {Math.abs(stats.weightDiff)} kg
              </span>
            ) : stats.weightDiff > 0 ? (
              <span className="text-amber-500 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{stats.weightDiff} kg
              </span>
            ) : (
              <span className="text-slate-400">0 kg (Estável)</span>
            )}
            <span className="text-[11px] text-slate-400 dark:text-neutral-500 font-normal">desde o início</span>
          </div>
        </div>

        {/* Card 2: % Gordura Corporal */}
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 dark:text-neutral-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">% Gordura Corporal</span>
            <Percent className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {stats.latestBodyFat || '--'}
            </span>
            <span className="text-xs font-bold text-slate-400">%</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs font-bold">
            {stats.bodyFatDiff < 0 ? (
              <span className="text-emerald-500 flex items-center">
                <ArrowDownRight className="w-3.5 h-3.5" />
                {Math.abs(stats.bodyFatDiff)}%
              </span>
            ) : stats.bodyFatDiff > 0 ? (
              <span className="text-red-500 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{stats.bodyFatDiff}%
              </span>
            ) : (
              <span className="text-slate-400">Estável</span>
            )}
            <span className="text-[11px] text-slate-400 dark:text-neutral-500 font-normal">evolução</span>
          </div>
        </div>

        {/* Card 3: Massa Muscular */}
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 dark:text-neutral-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Massa Muscular</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {stats.latestMuscleMass}
            </span>
            <span className="text-xs font-bold text-slate-400">kg</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 dark:text-neutral-500">
            Tónus & massa magra ativa
          </p>
        </div>

        {/* Card 4: IMC & Classificação */}
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 dark:text-neutral-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">IMC Atual</span>
            <Ruler className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {stats.bmi}
            </span>
          </div>
          <div className="mt-2">
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${getBmiBadge(parseFloat(stats.bmi)).color}`}>
              {getBmiBadge(parseFloat(stats.bmi)).label}
            </span>
          </div>
        </div>
      </div>

      {/* Graphical Evolution Section */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        
        {/* Graph Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-neutral-800/80 pb-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-amber-500" />
              Evolução Gráfica no Tempo
            </h3>
            <p className="text-xs text-slate-400 dark:text-neutral-500">
              Tendência temporal dos parâmetros biométricos selecionados
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Metric buttons */}
            <div className="flex items-center bg-slate-100 dark:bg-neutral-800 p-1 rounded-xl">
              <button
                onClick={() => setSelectedMetric('weight')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedMetric === 'weight'
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Peso (kg)
              </button>
              <button
                onClick={() => setSelectedMetric('bodyFat')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedMetric === 'bodyFat'
                    ? 'bg-cyan-500 text-black shadow-sm'
                    : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                % Gordura
              </button>
              <button
                onClick={() => setSelectedMetric('muscleMass')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedMetric === 'muscleMass'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Massa Muscular
              </button>
              <button
                onClick={() => setSelectedMetric('comparison')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedMetric === 'comparison'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Cruzado (Peso vs %BF)
              </button>
            </div>

            {/* Time range selector */}
            <div className="flex items-center bg-slate-100 dark:bg-neutral-800 p-1 rounded-xl">
              <button
                onClick={() => setTimeRange('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                  timeRange === 'all'
                    ? 'bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-neutral-400'
                }`}
              >
                Tudo
              </button>
              <button
                onClick={() => setTimeRange('6m')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                  timeRange === '6m'
                    ? 'bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-neutral-400'
                }`}
              >
                6M
              </button>
              <button
                onClick={() => setTimeRange('3m')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                  timeRange === '3m'
                    ? 'bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-neutral-400'
                }`}
              >
                3M
              </button>
            </div>
          </div>
        </div>

        {/* SVG Interactive Chart Canvas */}
        <div className="w-full h-64 sm:h-72 relative pt-2">
          {filteredLogs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <TrendingUp className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-xs font-bold">Sem dados suficientes para gerar o gráfico.</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-2 text-xs text-amber-500 underline font-bold"
              >
                Adicionar primeiro registo
              </button>
            </div>
          ) : (
            <EvolutionChart 
              logs={filteredLogs} 
              metric={selectedMetric}
            />
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-slate-500 dark:text-neutral-400 border-t border-slate-100 dark:border-neutral-800/80">
          <div className="flex items-center gap-4">
            {selectedMetric === 'comparison' ? (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="font-semibold text-slate-700 dark:text-neutral-300">Peso Corporal (kg)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-cyan-400" />
                  <span className="font-semibold text-slate-700 dark:text-neutral-300">% Gordura Corporal</span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className={`w-3 h-3 rounded-full ${
                  selectedMetric === 'weight' ? 'bg-amber-500' :
                  selectedMetric === 'bodyFat' ? 'bg-cyan-500' : 'bg-emerald-500'
                }`} />
                <span className="font-semibold text-slate-700 dark:text-neutral-300">
                  {selectedMetric === 'weight' ? 'Curva de Peso Corporal (kg)' :
                   selectedMetric === 'bodyFat' ? 'Curva de Percentagem de Gordura (% BF)' : 'Curva de Massa Muscular Estimada (kg)'}
                </span>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400">
            Total de {filteredLogs.length} pontos de medição no período
          </div>
        </div>

      </div>

      {/* Physical Assessments History Table (Dados puros, sem fotos para máxima rapidez) */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              Histórico Numérico de Avaliações Físicas
            </h3>
            <p className="text-xs text-slate-400 dark:text-neutral-500">
              Registos detalhados de pesagens, pregas, perímetros e observações do treinador
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-extrabold text-xs transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Registo</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-neutral-800 text-[11px] font-extrabold text-slate-400 dark:text-neutral-500 uppercase tracking-wider">
                <th className="py-3 px-3">Data</th>
                <th className="py-3 px-3">Peso</th>
                <th className="py-3 px-3">% Gordura</th>
                <th className="py-3 px-3">Massa Magra</th>
                <th className="py-3 px-3">Cintura</th>
                <th className="py-3 px-3">Braço</th>
                <th className="py-3 px-3">Tórax</th>
                <th className="py-3 px-3">Notas do Treinador</th>
                <th className="py-3 px-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800/60 font-medium">
              {sortedLogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 dark:text-neutral-500">
                    Ainda não existem avaliações físicas para este atleta. Clica em "Registar Avaliação Física" para criar a primeira!
                  </td>
                </tr>
              ) : (
                [...sortedLogs].reverse().map((log, idx) => {
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-neutral-800/40 transition">
                      <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {new Date(log.date).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                        {log.weightKg} kg
                      </td>
                      <td className="py-3.5 px-3 font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                        {log.bodyFatPercent !== undefined ? `${log.bodyFatPercent}%` : '--'}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        {log.muscleMassKg !== undefined ? `${log.muscleMassKg} kg` : '--'}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-neutral-300">
                        {log.waistCm ? `${log.waistCm} cm` : '--'}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-neutral-300">
                        {log.armCm ? `${log.armCm} cm` : '--'}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-neutral-300">
                        {log.chestCm ? `${log.chestCm} cm` : '--'}
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 dark:text-neutral-400 max-w-xs truncate" title={log.notes}>
                        {log.notes || <span className="text-slate-300 dark:text-neutral-600 italic">Sem observações</span>}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => handleDeleteLog(log.id, log.date)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition cursor-pointer"
                          title="Eliminar este registo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Registar Nova Avaliação Física (Pure Data, zero photo bloat) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div 
            className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between bg-slate-50/50 dark:bg-neutral-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Nova Avaliação Física
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-neutral-400">
                    Atleta: <strong className="text-amber-500">{currentClient?.displayName}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-neutral-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveAssessment} className="p-6 overflow-y-auto space-y-4 flex-1">
              
              {/* Date & Weight (Required) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                    Data da Avaliação *
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                    Peso Corporal (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="Ex: 81.5"
                    required
                    className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Body Fat & Muscle Mass */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                    % Gordura Corporal (% BF)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newBodyFat}
                    onChange={(e) => setNewBodyFat(e.target.value)}
                    placeholder="Ex: 17.5"
                    className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                    Massa Muscular (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMuscleMass}
                    onChange={(e) => setNewMuscleMass(e.target.value)}
                    placeholder="Ex: 40.2"
                    className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Perimeters Section */}
              <div className="pt-2 border-t border-slate-100 dark:border-neutral-800">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-neutral-500 block mb-2">
                  Perímetros Corporais (Opcional)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10px] text-slate-500 dark:text-neutral-400 mb-1">
                      Cintura (cm)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={newWaist}
                      onChange={(e) => setNewWaist(e.target.value)}
                      placeholder="84.0"
                      className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs font-mono text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 dark:text-neutral-400 mb-1">
                      Braço (cm)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={newArm}
                      onChange={(e) => setNewArm(e.target.value)}
                      placeholder="38.5"
                      className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs font-mono text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 dark:text-neutral-400 mb-1">
                      Tórax (cm)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={newChest}
                      onChange={(e) => setNewChest(e.target.value)}
                      placeholder="104.0"
                      className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs font-mono text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 dark:text-neutral-400 mb-1">
                      Anca (cm)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={newHips}
                      onChange={(e) => setNewHips(e.target.value)}
                      placeholder="97.0"
                      className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs font-mono text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 dark:text-neutral-400 mb-1">
                      Coxa (cm)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={newThigh}
                      onChange={(e) => setNewThigh(e.target.value)}
                      placeholder="60.0"
                      className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs font-mono text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="pt-2 border-t border-slate-100 dark:border-neutral-800">
                <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                  Notas Clínicas / Observações do Treinador
                </label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={2}
                  placeholder="Ex: Excelente resposta muscular, retenção reduzida, cumprimento da dieta a 100%..."
                  className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-neutral-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs hover:bg-amber-400 transition shadow-md shadow-amber-500/10 cursor-pointer"
                >
                  Gravar Avaliação
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// High-fidelity SVG Evolution Chart Component
interface EvolutionChartProps {
  logs: ProgressLog[];
  metric: 'weight' | 'bodyFat' | 'muscleMass' | 'waist' | 'comparison';
}

const EvolutionChart: React.FC<EvolutionChartProps> = ({ logs, metric }) => {
  if (!logs || logs.length === 0) return null;

  // Single point handling:
  if (logs.length === 1) {
    const single = logs[0];
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
        <Scale className="w-8 h-8 text-amber-500 mb-2" />
        <p className="text-sm font-bold text-slate-800 dark:text-white">Apenas 1 registo disponível ({single.date})</p>
        <p className="text-xs text-slate-400 mt-1">Peso: {single.weightKg}kg • %BF: {single.bodyFatPercent || '--'}%</p>
        <p className="text-[11px] text-amber-500 mt-2">Adiciona uma segunda avaliação para visualizar a curva de evolução contínua.</p>
      </div>
    );
  }

  const width = 800;
  const height = 260;
  const paddingX = 50;
  const paddingTop = 25;
  const paddingBottom = 40;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingTop - paddingBottom;

  // Metric extraction
  const getVal = (log: ProgressLog, m: string) => {
    if (m === 'weight') return log.weightKg;
    if (m === 'bodyFat') return log.bodyFatPercent || 20;
    if (m === 'muscleMass') return log.muscleMassKg || (log.weightKg * 0.5);
    if (m === 'waist') return log.waistCm || 80;
    return log.weightKg;
  };

  if (metric !== 'comparison') {
    const values = logs.map(l => getVal(l, metric));
    const minVal = Math.floor(Math.min(...values) * 0.98);
    const maxVal = Math.ceil(Math.max(...values) * 1.02);
    const range = maxVal - minVal || 1;

    // Build SVG points
    const points = logs.map((log, index) => {
      const x = paddingX + (index / (logs.length - 1)) * chartWidth;
      const val = getVal(log, metric);
      const y = paddingTop + chartHeight - ((val - minVal) / range) * chartHeight;
      return { x, y, val, date: log.date, notes: log.notes };
    });

    const pathD = points.reduce((acc, p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      // Smooth cubic bezier curve
      const prev = points[i - 1];
      const cx1 = prev.x + (p.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (p.x - prev.x) / 2;
      const cy2 = p.y;
      return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p.x} ${p.y}`;
    }, '');

    const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;

    const strokeColor = metric === 'weight' ? '#f59e0b' : metric === 'bodyFat' ? '#06b6d4' : '#10b981';
    const gradientId = `grad-${metric}`;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible select-none">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
          const y = paddingTop + chartHeight * (1 - pct);
          const gridVal = (minVal + range * pct).toFixed(1);
          return (
            <g key={idx}>
              <line 
                x1={paddingX} 
                y1={y} 
                x2={width - paddingX} 
                y2={y} 
                stroke="currentColor" 
                strokeOpacity="0.08" 
                strokeDasharray="4 4"
              />
              <text 
                x={paddingX - 10} 
                y={y + 4} 
                textAnchor="end" 
                className="text-[10px] fill-slate-400 font-mono font-bold"
              >
                {gridVal}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaD} fill={`url(#${gradientId})`} />

        {/* Line curve */}
        <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points & labels */}
        {points.map((p, i) => (
          <g key={i} className="group cursor-pointer">
            <circle
              cx={p.x}
              cy={p.y}
              r="5"
              fill={strokeColor}
              stroke="#0f172a"
              strokeWidth="2"
              className="transition-transform group-hover:scale-150"
            />
            {/* Value bubble above point */}
            <text
              x={p.x}
              y={p.y - 10}
              textAnchor="middle"
              className="text-[11px] font-black font-mono fill-slate-800 dark:fill-white"
            >
              {p.val}
            </text>
            {/* Date below axis */}
            <text
              x={p.x}
              y={height - 12}
              textAnchor="middle"
              className="text-[10px] font-bold fill-slate-400"
            >
              {new Date(p.date).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })}
            </text>
          </g>
        ))}
      </svg>
    );
  }

  // Cross comparison: Weight (Left Axis) vs Body Fat (Right Axis)
  const weightValues = logs.map(l => l.weightKg);
  const minW = Math.floor(Math.min(...weightValues) * 0.98);
  const maxW = Math.ceil(Math.max(...weightValues) * 1.02);
  const rangeW = maxW - minW || 1;

  const bfValues = logs.map(l => l.bodyFatPercent || 20);
  const minBf = Math.floor(Math.min(...bfValues) * 0.95);
  const maxBf = Math.ceil(Math.max(...bfValues) * 1.05);
  const rangeBf = maxBf - minBf || 1;

  const weightPoints = logs.map((log, index) => {
    const x = paddingX + (index / (logs.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((log.weightKg - minW) / rangeW) * chartHeight;
    return { x, y, val: log.weightKg, date: log.date };
  });

  const bfPoints = logs.map((log, index) => {
    const x = paddingX + (index / (logs.length - 1)) * chartWidth;
    const bf = log.bodyFatPercent || 20;
    const y = paddingTop + chartHeight - ((bf - minBf) / rangeBf) * chartHeight;
    return { x, y, val: bf, date: log.date };
  });

  const pathWeight = weightPoints.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = weightPoints[i - 1];
    const cx1 = prev.x + (p.x - prev.x) / 2;
    return `${acc} C ${cx1} ${prev.y}, ${cx1} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  const pathBf = bfPoints.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = bfPoints[i - 1];
    const cx1 = prev.x + (p.x - prev.x) / 2;
    return `${acc} C ${cx1} ${prev.y}, ${cx1} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible select-none">
      {/* Grid lines */}
      {[0, 0.5, 1].map((pct, idx) => {
        const y = paddingTop + chartHeight * (1 - pct);
        return (
          <line 
            key={idx}
            x1={paddingX} 
            y1={y} 
            x2={width - paddingX} 
            y2={y} 
            stroke="currentColor" 
            strokeOpacity="0.08" 
            strokeDasharray="4 4"
          />
        );
      })}

      {/* Curves */}
      <path d={pathWeight} fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
      <path d={pathBf} fill="none" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 3" />

      {/* Points */}
      {weightPoints.map((p, i) => (
        <g key={`w-${i}`}>
          <circle cx={p.x} cy={p.y} r="4.5" fill="#f59e0b" stroke="#0f172a" strokeWidth="2" />
          <text x={p.x} y={p.y - 8} textAnchor="middle" className="text-[10px] font-black font-mono fill-amber-500">
            {p.val}kg
          </text>
          <text x={p.x} y={height - 12} textAnchor="middle" className="text-[10px] font-bold fill-slate-400">
            {new Date(p.date).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })}
          </text>
        </g>
      ))}

      {bfPoints.map((p, i) => (
        <g key={`bf-${i}`}>
          <circle cx={p.x} cy={p.y} r="4.5" fill="#06b6d4" stroke="#0f172a" strokeWidth="2" />
          <text x={p.x} y={p.y + 16} textAnchor="middle" className="text-[10px] font-black font-mono fill-cyan-400">
            {p.val}%
          </text>
        </g>
      ))}
    </svg>
  );
};
