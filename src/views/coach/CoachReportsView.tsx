import React, { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Scale, 
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
  BarChart2,
  Sliders,
  Tag,
  Utensils,
  AlertTriangle,
  AlertCircle,
  Eye,
  Apple,
  Clock,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ProgressLog, CustomMetricDefinition, NutritionPlan, MealAdherenceLog, Meal } from '../../types';
import { EvolutionChart, MetricConfig } from '../../components/EvolutionChart';

export const STANDARD_METRICS: MetricConfig[] = [
  { key: 'weight', label: 'Peso', unit: 'kg', color: '#f59e0b', isCustom: false },
  { key: 'bodyFat', label: '% Gordura', unit: '%', color: '#06b6d4', isCustom: false },
  { key: 'muscleMass', label: 'Massa Muscular', unit: 'kg', color: '#10b981', isCustom: false },
  { key: 'waist', label: 'Cintura', unit: 'cm', color: '#a855f7', isCustom: false },
  { key: 'arm', label: 'Braço', unit: 'cm', color: '#ec4899', isCustom: false },
  { key: 'chest', label: 'Tórax', unit: 'cm', color: '#3b82f6', isCustom: false }
];

const PRESET_COLORS = [
  { label: 'Laranja', hex: '#f97316' },
  { label: 'Ciano', hex: '#06b6d4' },
  { label: 'Esmeralda', hex: '#10b981' },
  { label: 'Roxo', hex: '#a855f7' },
  { label: 'Rosa', hex: '#ec4899' },
  { label: 'Amarelo', hex: '#eab308' },
  { label: 'Vermelho', hex: '#ef4444' },
  { label: 'Azul', hex: '#3b82f6' },
];

export const CoachReportsView: React.FC = () => {
  const { allClients } = useAuth();
  const { 
    progressLogs, 
    selectedAthleteId, 
    setSelectedAthleteId, 
    addProgressLog, 
    deleteProgressLog,
    customMetrics,
    addCustomMetric,
    deleteCustomMetric,
    nutritionPlans,
    mealAdherenceLogs,
    sendMessage
  } = useData();

  // Multi-selection of metrics to plot/cross:
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['weight', 'bodyFat']);
  
  // Date interval: purely 'De [date] até [date]' (shortcuts removed as requested)
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCustomMetricModalOpen, setIsCustomMetricModalOpen] = useState(false);
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
  const [newCustomValues, setNewCustomValues] = useState<Record<string, string>>({});

  // New custom metric form state
  const [newMetricName, setNewMetricName] = useState('');
  const [newMetricUnit, setNewMetricUnit] = useState('cm');
  const [newMetricColor, setNewMetricColor] = useState('#f97316');
  const [newMetricDesc, setNewMetricDesc] = useState('');

  // Current client
  const currentClient = useMemo(() => {
    return allClients.find(c => c.uid === selectedAthleteId) || allClients[0] || null;
  }, [allClients, selectedAthleteId]);

  // Weekly Diet Menu Inspector Modal State
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [selectedMenuDayIndex, setSelectedMenuDayIndex] = useState(0);
  const [menuFilterOnlyMissed, setMenuFilterOnlyMissed] = useState(false);
  const [coachNoteToAthlete, setCoachNoteToAthlete] = useState('');

  // Active nutrition plan for the selected athlete
  const currentNutritionPlan = useMemo(() => {
    return nutritionPlans.find(p => p.clientId === selectedAthleteId) || nutritionPlans[0] || null;
  }, [nutritionPlans, selectedAthleteId]);

  // Meal adherence logs for this athlete
  const athleteMealLogs = useMemo(() => {
    return mealAdherenceLogs.filter(log => log.clientId === selectedAthleteId);
  }, [mealAdherenceLogs, selectedAthleteId]);

  // Derived diet compliance statistics
  const dietStats = useMemo(() => {
    // Normalization helper for accent/whitespace invariant string comparison
    const norm = (s?: string) => s ? s.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '') : '';

    // Daily breakdown for Monday(0) to Sunday(6)
    const daysData = [0, 1, 2, 3, 4, 5, 6].map(dayIndex => {
      const dayName = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][dayIndex];
      const fullDayName = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'][dayIndex];
      
      const dayPlan = currentNutritionPlan?.days.find(d => d.dayIndex === dayIndex) || currentNutritionPlan?.days[0];
      const plannedMeals = dayPlan?.meals || [];
      
      // Map each scheduled meal to its status from athleteMealLogs
      const mealsStatus = plannedMeals.map((meal) => {
        const log = athleteMealLogs.find(
          l => l.dayIndex === dayIndex && (
            (l.mealId && meal.id && l.mealId === meal.id) || 
            norm(l.mealName) === norm(meal.name) ||
            (norm(l.mealName).length > 3 && norm(meal.name).length > 3 && (norm(l.mealName).includes(norm(meal.name)) || norm(meal.name).includes(norm(l.mealName))))
          )
        );
        const isMissed = log?.status === 'missed';
        // Only completed if not missed, and if log exists it must be completed
        const isCompleted = log ? log.status === 'completed' : !isMissed;
        return {
          meal,
          mealId: meal.id,
          mealName: meal.name,
          time: meal.time,
          calories: meal.calories,
          proteinG: meal.proteinG,
          carbsG: meal.carbsG,
          fatG: meal.fatG,
          foods: meal.foods || [],
          description: meal.description,
          isMissed,
          isCompleted: !isMissed && isCompleted,
          missedReason: isMissed ? (log?.missedReason || 'Refeição assinalada como não consumida pelo aluno') : undefined,
          date: log?.date
        };
      });

      // Capture any adherence logs for this day marked as missed that were not mapped above
      const extraMissedLogs = athleteMealLogs.filter(
        l => l.dayIndex === dayIndex && l.status === 'missed' &&
        !mealsStatus.some(m => (m.mealId && l.mealId === m.mealId) || norm(m.mealName) === norm(l.mealName))
      ).map(l => ({
        meal: {
          id: l.mealId,
          name: l.mealName,
          time: l.time,
          calories: 450,
          proteinG: 35,
          carbsG: 45,
          fatG: 12,
          foods: []
        } as Meal,
        mealId: l.mealId,
        mealName: l.mealName,
        time: l.time,
        calories: 450,
        proteinG: 35,
        carbsG: 45,
        fatG: 12,
        foods: [],
        description: 'Refeição prescrita',
        isMissed: true,
        isCompleted: false,
        missedReason: l.missedReason || 'Refeição assinalada como não consumida pelo aluno',
        date: l.date
      }));

      const allMealsStatus = [...mealsStatus, ...extraMissedLogs];
      const missedMeals = allMealsStatus.filter(m => m.isMissed);
      const missedCount = missedMeals.length;
      const totalExpected = plannedMeals.length > 0 ? plannedMeals.length : Math.max(allMealsStatus.length, 4);

      // Invariant: If missedCount > 0, completedCount is strictly totalExpected - missedCount!
      // This mathematically guarantees that completedCount can NEVER be equal to totalExpected if a meal was missed!
      const completedCount = missedCount > 0 
        ? Math.max(0, totalExpected - missedCount)
        : totalExpected;

      const hasMissed = missedCount > 0;
      const missedNames = missedMeals.map(m => `${m.mealName}${m.time ? ` (${m.time})` : ''}`).join(', ');

      return {
        dayIndex,
        dayName,
        fullDayName,
        dayPlan,
        completedCount,
        totalExpected,
        hasMissed,
        missedMeals,
        missedNames,
        mealsStatus: allMealsStatus,
        rate: totalExpected > 0 ? Math.round((completedCount / totalExpected) * 100) : 100
      };
    });

    const totalScheduled = daysData.reduce((acc, d) => acc + d.totalExpected, 0);
    const totalCompleted = daysData.reduce((acc, d) => acc + d.completedCount, 0);
    const allMissedMeals = daysData.flatMap(d => d.missedMeals.map(m => ({ 
      ...m, 
      dayIndex: d.dayIndex, 
      dayOfWeek: d.fullDayName,
      dayName: d.dayName
    })));
    const missedCount = allMissedMeals.length;
    const complianceRate = totalScheduled > 0 ? Math.round((totalCompleted / totalScheduled) * 100) : 100;

    return {
      complianceRate,
      completedCount: totalCompleted,
      missedCount,
      totalScheduled,
      missedLogs: allMissedMeals,
      daysData,
      dailyCaloriesTarget: currentNutritionPlan?.dailyCalories || 2350
    };
  }, [athleteMealLogs, currentNutritionPlan]);

  // Combined metric configs: standard + client's custom metrics
  const combinedMetricConfigs: MetricConfig[] = useMemo(() => {
    const customList: MetricConfig[] = customMetrics.map(cm => ({
      key: cm.id,
      label: cm.name,
      unit: cm.unit,
      color: cm.color || '#f97316',
      isCustom: true
    }));
    return [...STANDARD_METRICS, ...customList];
  }, [customMetrics]);

  // Client logs chronologically sorted
  const sortedLogs = useMemo(() => {
    if (!currentClient) return [];
    const logs = [...progressLogs].filter(p => p.clientId === currentClient.uid);
    return logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [progressLogs, currentClient]);

  // Initialize date range when athlete changes
  useEffect(() => {
    if (sortedLogs.length > 0) {
      setStartDate(sortedLogs[0].date);
      setEndDate(new Date().toISOString().split('T')[0]);
    } else {
      setStartDate('2026-01-01');
      setEndDate(new Date().toISOString().split('T')[0]);
    }
  }, [selectedAthleteId, sortedLogs.length]);

  const toggleMetric = (key: string) => {
    setSelectedMetrics(prev => {
      if (prev.includes(key)) {
        if (prev.length === 1) return prev; // keep at least 1 active
        return prev.filter(k => k !== key);
      } else {
        return [...prev, key];
      }
    });
  };

  // Filter logs by date interval
  const filteredLogs = useMemo(() => {
    if (!sortedLogs || sortedLogs.length === 0) return [];
    return sortedLogs.filter(log => {
      const afterStart = !startDate || log.date >= startDate;
      const beforeEnd = !endDate || log.date <= endDate;
      return afterStart && beforeEnd;
    });
  }, [sortedLogs, startDate, endDate]);

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
      setFeedback('Por favor introduza um peso corporal válido.');
      setTimeout(() => setFeedback(null), 3500);
      return;
    }

    // Process custom values
    const customValuesToSave: Record<string, number> = {};
    customMetrics.forEach(cm => {
      const valStr = newCustomValues[cm.id];
      if (valStr && !isNaN(parseFloat(valStr))) {
        customValuesToSave[cm.id] = parseFloat(valStr);
      }
    });

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
      customValues: Object.keys(customValuesToSave).length > 0 ? customValuesToSave : undefined,
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
    setNewCustomValues({});
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  // Handle Save Custom Metric Definition
  const handleSaveCustomMetric = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClient || !newMetricName.trim()) return;

    const metricId = 'metric-' + Date.now();
    await addCustomMetric({
      clientId: currentClient.uid,
      name: newMetricName.trim(),
      unit: newMetricUnit.trim() || 'cm',
      color: newMetricColor,
      description: newMetricDesc.trim() || undefined
    });

    // Auto-select so its curve is immediately visible
    setSelectedMetrics(prev => [...prev, metricId]);

    setFeedback(`Nova métrica "${newMetricName.trim()}" criada para ${currentClient.displayName}!`);
    setTimeout(() => setFeedback(null), 4000);

    setNewMetricName('');
    setNewMetricDesc('');
    setIsCustomMetricModalOpen(false);
  };

  // Handle Delete Custom Metric
  const handleDeleteCustomMetric = async (metricId: string, name: string) => {
    if (window.confirm(`Tem a certeza que deseja remover a métrica "${name}" deste aluno?`)) {
      await deleteCustomMetric(metricId);
      setSelectedMetrics(prev => prev.filter(k => k !== metricId));
      setFeedback(`Métrica "${name}" removida.`);
      setTimeout(() => setFeedback(null), 3000);
    }
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
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
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
            Visualização gráfica de peso, gordura corporal, perímetros e métricas personalizadas por aluno.
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

          {/* Action Buttons: Definir Métricas & Registar Avaliação */}
          <div className="flex items-center gap-2 self-end sm:self-auto sm:mt-4">
            <button
              onClick={() => setIsCustomMetricModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-800 dark:text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Definir métricas específicas para este aluno (ex: Antebraço, Supino, etc.)"
            >
              <Sliders className="w-4 h-4 text-amber-500" />
              <span>Métricas do Aluno</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs hover:bg-amber-400 transition flex items-center gap-2 shadow-md shadow-amber-500/10 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Registar Avaliação</span>
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
                <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {currentClient.displayName}
                </h2>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  currentClient.subscriptionStatus === 'active' || currentClient.isManuallyUnlocked
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                }`}>
                  {currentClient.subscriptionStatus === 'active' || currentClient.isManuallyUnlocked ? 'Ativo' : 'Bloqueado'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                Objetivo: <strong className="text-slate-800 dark:text-slate-200">{currentClient.goals || 'Hipertrofia & Definição'}</strong> • Altura: <strong className="text-slate-800 dark:text-slate-200">{currentClient.heightCm || 175} cm</strong>
              </p>
            </div>
          </div>

          {/* Quick Metrics Badges for this Student */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-slate-400 font-semibold">Métricas personalizadas ativas:</span>
            {customMetrics.length === 0 ? (
              <span className="text-xs text-slate-400 italic">Nenhuma ainda. Clica em "Métricas do Aluno" para criar.</span>
            ) : (
              customMetrics.map(cm => (
                <span 
                  key={cm.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 shadow-sm"
                  style={{ borderLeftColor: cm.color, borderLeftWidth: '3px' }}
                >
                  <span className="text-slate-800 dark:text-slate-200">{cm.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({cm.unit})</span>
                </span>
              ))
            )}
          </div>
        </div>
      )}

      {/* KPI Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Peso */}
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 dark:text-neutral-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Peso Corporal</span>
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
              <span className="text-slate-400">Estável</span>
            )}
            <span className="text-[11px] text-slate-400 dark:text-neutral-500 font-normal">desde a 1ª avaliação</span>
          </div>
        </div>

        {/* Card 2: % Gordura */}
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 dark:text-neutral-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">% Gordura (BF)</span>
            <TrendingUp className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {stats.latestBodyFat || 16.5}
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

        {/* Card 4: IMC */}
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

      {/* Diet Compliance Summary Card (Esteticamente separado, sem encavalitar informação) */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-neutral-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold shrink-0">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Resumo de Cumprimento da Dieta
                </h3>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  dietStats.complianceRate >= 85
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : dietStats.complianceRate >= 70
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                }`}>
                  {dietStats.complianceRate >= 85 ? 'Excelente Adesão' : dietStats.complianceRate >= 70 ? 'Atenção às Faltas' : 'Adesão Crítica'}
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-neutral-500 mt-0.5">
                Plano ativo: <strong className="text-slate-700 dark:text-neutral-300">{currentNutritionPlan?.title || 'Ementa Semanal'}</strong> (~{dietStats.dailyCaloriesTarget} kcal/dia)
              </p>
            </div>
          </div>

          {/* Action button to inspect weekly menu */}
          <button
            onClick={() => {
              setMenuFilterOnlyMissed(false);
              setIsMenuModalOpen(true);
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm ${
              dietStats.missedCount > 0
                ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-800 dark:text-white'
            }`}
            title="Abrir cardápio semanal para auditar refeições e motivos das faltas"
          >
            <Eye className="w-4 h-4 text-amber-500" />
            <span>Visualizar Cardápio Semanal</span>
            {dietStats.missedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[10px] font-black">
                {dietStats.missedCount} {dietStats.missedCount === 1 ? 'falta' : 'faltas'}
              </span>
            )}
          </button>
        </div>

        {/* 3 Main Compliance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Box 1: Compliance Rate */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-neutral-950/60 border border-slate-100 dark:border-neutral-800/80 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-black text-sm shrink-0 font-mono">
              {dietStats.complianceRate}%
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-neutral-500 block">Taxa de Cumprimento</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                {dietStats.completedCount} de {dietStats.totalScheduled} refeições
              </span>
            </div>
          </div>

          {/* Box 2: Missed meals alert */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-neutral-950/60 border border-slate-100 dark:border-neutral-800/80 flex items-center gap-3.5">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
              dietStats.missedCount > 0 ? 'bg-amber-500/15 text-amber-500' : 'bg-emerald-500/15 text-emerald-500'
            }`}>
              {dietStats.missedCount > 0 ? <AlertTriangle className="w-5 h-5 text-amber-500" /> : <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-neutral-500 block">Faltas Registadas</span>
              <span className={`text-sm font-extrabold ${dietStats.missedCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {dietStats.missedCount === 0 ? '0 Faltas • 100% rigor' : `${dietStats.missedCount} ${dietStats.missedCount === 1 ? 'refeição saltada' : 'refeições saltadas'}`}
              </span>
            </div>
          </div>

          {/* Box 3: Calories Average */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-neutral-950/60 border border-slate-100 dark:border-neutral-800/80 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center font-black text-sm shrink-0">
              <Apple className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-neutral-500 block">Calorias Médias</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                ~{dietStats.complianceRate >= 85 ? dietStats.dailyCaloriesTarget - 60 : dietStats.dailyCaloriesTarget - 240} kcal
                <span className="text-xs text-slate-400 font-normal ml-1">/ {dietStats.dailyCaloriesTarget} alvo</span>
              </span>
            </div>
          </div>
        </div>

        {/* 7 Days of the Week Adherence Tracker (Horizontal clean bar) */}
        <div className="pt-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
            <span>Cumprimento por Dia da Semana:</span>
            <span>{dietStats.daysData.filter(d => !d.hasMissed).length} de 7 dias sem faltas</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {dietStats.daysData.map(d => {
              return (
                <div 
                  key={d.dayIndex}
                  onClick={() => {
                    setSelectedMenuDayIndex(d.dayIndex);
                    setMenuFilterOnlyMissed(false);
                    setIsMenuModalOpen(true);
                  }}
                  className={`p-2 sm:p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-between ${
                    d.hasMissed
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-300 hover:bg-amber-500/20 shadow-sm ring-1 ring-amber-500/20'
                      : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/20'
                  }`}
                  title={`${d.fullDayName}: ${d.completedCount}/${d.totalExpected} refeições cumpridas.${d.hasMissed ? ` Falta registada: ${d.missedNames}. Clique para auditar cardápio deste dia.` : ' 100% cumprido!'}`}
                >
                  <div className="text-[10px] uppercase font-bold tracking-wider">{d.dayName}</div>
                  
                  <div className="my-1">
                    {d.hasMissed ? (
                      <div className="space-y-0.5">
                        <span className="text-[9px] sm:text-[10px] font-black text-amber-700 dark:text-amber-400 bg-amber-500/20 px-1 sm:px-1.5 py-0.5 rounded inline-block">
                          ⚠️ Falta
                        </span>
                        <div className="text-[9px] font-extrabold text-amber-800 dark:text-amber-200 truncate max-w-full font-sans" title={`Refeição saltada: ${d.missedNames}`}>
                          {d.missedNames}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        <span className="text-[9px] sm:text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-500/20 px-1 sm:px-1.5 py-0.5 rounded inline-block">
                          ✔️ 100%
                        </span>
                        <div className="text-[9px] text-emerald-600 dark:text-emerald-400 opacity-80 font-medium hidden sm:block">
                          Completo
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-[9px] opacity-75 font-mono font-bold">
                    {d.completedCount}/{d.totalExpected}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Explicit discrimination of which meals were missed */}
        {dietStats.missedLogs.length > 0 ? (
          <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-neutral-800/80">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-neutral-300">
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                <span>Refeições Não Cumpridas nesta Semana ({dietStats.missedLogs.length} registadas):</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  // Pre-select first day with a miss
                  const firstMissedDay = dietStats.daysData.find(d => d.hasMissed)?.dayIndex ?? 0;
                  setSelectedMenuDayIndex(firstMissedDay);
                  setMenuFilterOnlyMissed(true);
                  setIsMenuModalOpen(true);
                }}
                className="text-amber-700 dark:text-amber-400 font-bold hover:underline text-[11px] cursor-pointer flex items-center gap-1"
              >
                <span>Auditar Todas no Cardápio</span>
                <span>&rarr;</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {dietStats.missedLogs.map((missed, mIdx) => (
                <div
                  key={mIdx}
                  onClick={() => {
                    setSelectedMenuDayIndex(missed.dayIndex);
                    setMenuFilterOnlyMissed(false);
                    setIsMenuModalOpen(true);
                  }}
                  className="p-3 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/30 hover:border-amber-500/60 transition cursor-pointer shadow-sm group flex flex-col justify-between"
                  title={`Clique para abrir o cardápio de ${missed.dayOfWeek}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-neutral-300 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        {missed.dayOfWeek}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-600 dark:text-red-400 text-[10px] font-extrabold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {missed.mealName} ({missed.time})
                      </span>
                    </div>

                    <div className="text-xs font-medium text-slate-800 dark:text-neutral-200 mt-1">
                      <strong className="text-amber-700 dark:text-amber-400 block font-semibold text-[11px]">
                        {missed.mealName} Saltado ({missed.calories} kcal • {missed.proteinG}g P)
                      </strong>
                      {missed.foods && missed.foods.length > 0 && (
                        <p className="text-[11px] text-slate-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                          Prescrito: {missed.foods.map((f: any) => `${f.item} (${f.quantity})`).join(', ')}
                        </p>
                      )}
                    </div>

                    {missed.missedReason && (
                      <div className="mt-2 p-2 rounded-xl bg-white dark:bg-neutral-900 border border-amber-500/20 text-[11px] text-slate-600 dark:text-neutral-300">
                        <span className="font-bold text-slate-700 dark:text-white block text-[10px] text-amber-600">
                          Motivo reportado pelo aluno:
                        </span>
                        <span className="italic line-clamp-2">"{missed.missedReason}"</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-amber-500/20 flex items-center justify-between text-[11px] font-bold text-amber-700 dark:text-amber-400 group-hover:underline">
                    <span>Ver no cardápio do dia</span>
                    <span>&rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Excelente consistência! O aluno não registou qualquer falta de refeição nesta semana (100% de adesão).</span>
          </div>
        )}
      </div>

      {/* Graphical Evolution Section */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        
        {/* Graph Controls */}
        <div className="space-y-3 border-b border-slate-100 dark:border-neutral-800/80 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-amber-500" />
                Evolução Gráfica no Tempo
              </h3>
              <p className="text-xs text-slate-400 dark:text-neutral-500">
                Clica em qualquer métrica para mostrar ou cruzar linhas no gráfico
              </p>
            </div>

            {/* Metric multi-select buttons: standard + student custom metrics */}
            <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-auto">
              <span className="text-[11px] font-bold text-slate-400 mr-1 hidden sm:inline">Parâmetros:</span>
              {combinedMetricConfigs.map((m) => {
                const isSelected = selectedMetrics.includes(m.key);
                return (
                  <button
                    key={m.key}
                    onClick={() => toggleMetric(m.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
                      isSelected
                        ? 'text-black font-extrabold ring-2 ring-black/20'
                        : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    style={isSelected ? { backgroundColor: m.color } : {}}
                    title={isSelected ? `Ocultar linha de ${m.label}` : `Mostrar e cruzar linha de ${m.label}`}
                  >
                    <span 
                      className={`w-2 h-2 rounded-full ${isSelected ? 'bg-black' : ''}`} 
                      style={!isSelected ? { backgroundColor: m.color } : {}}
                    />
                    <span>{m.label} ({m.unit})</span>
                    {m.isCustom && (
                      <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${isSelected ? 'bg-black/20 text-black' : 'bg-slate-200 dark:bg-neutral-700 text-slate-500'}`}>
                        aluno
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Botão para definir nova métrica para este aluno */}
              <button
                onClick={() => setIsCustomMetricModalOpen(true)}
                className="px-2.5 py-1.5 rounded-xl border border-dashed border-amber-500/50 hover:border-amber-500 text-amber-600 dark:text-amber-400 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                title="Criar nova métrica específica para este aluno"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nova Métrica</span>
              </button>
            </div>
          </div>

          {/* Time Range Selector: Puro 'De ... até ...' (SEM ATALHOS conforme solicitado) */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800/80 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-neutral-300 mr-2">
              <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Intervalo:</span>
            </div>

            {/* De */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-400">De</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-2.5 py-1 text-xs font-mono text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none shadow-sm cursor-pointer"
              />
            </div>

            {/* Até */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-400">até</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-2.5 py-1 text-xs font-mono text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none shadow-sm cursor-pointer"
              />
            </div>

            <div className="text-[11px] text-slate-400 ml-auto font-mono hidden md:inline">
              {filteredLogs.length} medições registadas no período
            </div>
          </div>
        </div>

        {/* SVG Interactive Chart Canvas */}
        <div className="w-full h-64 sm:h-72 relative pt-2">
          {filteredLogs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <TrendingUp className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-xs font-bold">Sem dados registados no intervalo selecionado ({startDate} a {endDate}).</p>
            </div>
          ) : (
            <EvolutionChart 
              logs={filteredLogs} 
              selectedMetrics={selectedMetrics}
              metricConfigs={combinedMetricConfigs}
              startDate={startDate}
              endDate={endDate}
            />
          )}
        </div>

        {/* Dynamic Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-slate-500 dark:text-neutral-400 border-t border-slate-100 dark:border-neutral-800/80">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[11px] text-slate-400 font-semibold">Linhas ativas:</span>
            {combinedMetricConfigs.filter(m => selectedMetrics.includes(m.key)).map(m => (
              <div key={m.key} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }} />
                <span className="font-semibold text-slate-700 dark:text-neutral-300">
                  {m.label} ({m.unit})
                </span>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            {filteredLogs.length} pontos de medição ({selectedMetrics.length} {selectedMetrics.length === 1 ? 'linha' : 'linhas'} cruzadas)
          </div>
        </div>
      </div>

      {/* Physical Assessments History Table (Dados puros, com colunas para métricas personalizadas) */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              Histórico Numérico de Avaliações Físicas
            </h3>
            <p className="text-xs text-slate-400 dark:text-neutral-500">
              Registos detalhados partilhados entre Treinador e Aluno em tempo real
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
                {/* Dynamic columns for custom metrics of this athlete */}
                {customMetrics.map(cm => (
                  <th key={cm.id} className="py-3 px-3 text-amber-600 dark:text-amber-400">
                    {cm.name}
                  </th>
                ))}
                <th className="py-3 px-3">Notas</th>
                <th className="py-3 px-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800/60 font-medium">
              {sortedLogs.length === 0 ? (
                <tr>
                  <td colSpan={9 + customMetrics.length} className="py-8 text-center text-slate-400 dark:text-neutral-500">
                    Ainda não existem avaliações físicas para este atleta. Clica em "Registar Avaliação" para criar a primeira!
                  </td>
                </tr>
              ) : (
                [...sortedLogs].reverse().map((log) => {
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
                      {/* Dynamic cells for custom metrics */}
                      {customMetrics.map(cm => (
                        <td key={cm.id} className="py-3.5 px-3 font-mono font-semibold" style={{ color: cm.color }}>
                          {log.customValues && log.customValues[cm.id] !== undefined 
                            ? `${log.customValues[cm.id]} ${cm.unit}` 
                            : '--'}
                        </td>
                      ))}
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

      {/* Modal: Registar Nova Avaliação Física (Pure Data, com campos dinâmicos para métricas do aluno) */}
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
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-neutral-800 transition cursor-pointer"
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

              {/* Standard Perimeters */}
              <div className="pt-2 border-t border-slate-100 dark:border-neutral-800">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-neutral-500 block mb-2">
                  Perímetros Padrão (cm)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10px] text-slate-500 dark:text-neutral-400 mb-1">
                      Cintura
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
                      Braço
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
                      Tórax
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
                      Anca
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
                      Coxa
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

              {/* Custom Metrics Dynamic Inputs */}
              {customMetrics.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-neutral-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-500 block">
                      Métricas Personalizadas do Aluno
                    </span>
                    <span className="text-[10px] text-slate-400">definidas pelo treinador</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {customMetrics.map(cm => (
                      <div key={cm.id}>
                        <label className="block text-[10px] font-bold text-slate-700 dark:text-neutral-300 mb-1 flex items-center justify-between">
                          <span>{cm.name} ({cm.unit})</span>
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cm.color }} />
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={newCustomValues[cm.id] || ''}
                          onChange={(e) => setNewCustomValues(prev => ({ ...prev, [cm.id]: e.target.value }))}
                          placeholder={`Valor em ${cm.unit}`}
                          className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs font-mono text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-neutral-700 transition cursor-pointer"
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

      {/* Modal: Definir Novas Métricas para este Aluno */}
      {isCustomMetricModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div 
            className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between bg-slate-50/50 dark:bg-neutral-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Métricas Personalizadas do Aluno
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-neutral-400">
                    Aluno: <strong className="text-amber-500">{currentClient?.displayName}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCustomMetricModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Existing custom metrics list */}
            <div className="p-5 border-b border-slate-100 dark:border-neutral-800/80 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-neutral-300 block">
                Métricas Ativas para {currentClient?.displayName}:
              </span>
              {customMetrics.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  Este aluno ainda não tem métricas personalizadas adicionais.
                </p>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {customMetrics.map(cm => (
                    <div 
                      key={cm.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cm.color }} />
                        <span className="font-bold text-slate-800 dark:text-white">{cm.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({cm.unit})</span>
                      </div>
                      <button
                        onClick={() => handleDeleteCustomMetric(cm.id, cm.name)}
                        className="p-1 text-slate-400 hover:text-red-500 transition cursor-pointer"
                        title="Eliminar esta métrica"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Create new custom metric form */}
            <form onSubmit={handleSaveCustomMetric} className="p-5 space-y-3.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-500 block">
                Criar Nova Métrica
              </span>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                  Nome da Métrica *
                </label>
                <input
                  type="text"
                  required
                  value={newMetricName}
                  onChange={(e) => setNewMetricName(e.target.value)}
                  placeholder="Ex: Perímetro Antebraço, Dobra Abdominal, Supino Máx."
                  className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                    Unidade / Tipo *
                  </label>
                  <select
                    value={newMetricUnit}
                    onChange={(e) => setNewMetricUnit(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none cursor-pointer"
                  >
                    <option value="cm">Centímetros (cm)</option>
                    <option value="kg">Quilogramas (kg)</option>
                    <option value="%">Percentagem (%)</option>
                    <option value="mm">Milímetros / Pregas (mm)</option>
                    <option value="reps">Repetições (reps)</option>
                    <option value="pts">Pontuação (pts)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                    Cor no Gráfico
                  </label>
                  <div className="flex items-center gap-1.5 pt-1">
                    {PRESET_COLORS.map(c => (
                      <button
                        type="button"
                        key={c.hex}
                        onClick={() => setNewMetricColor(c.hex)}
                        className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                          newMetricColor === c.hex ? 'ring-2 ring-white ring-offset-2 scale-110' : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                  Descrição ou Objetivo (opcional)
                </label>
                <input
                  type="text"
                  value={newMetricDesc}
                  onChange={(e) => setNewMetricDesc(e.target.value)}
                  placeholder="Ex: Medido em contração máxima a meio do antebraço"
                  className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomMetricModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-neutral-700 transition cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs hover:bg-amber-400 transition shadow-md shadow-amber-500/10 cursor-pointer"
                >
                  Adicionar Métrica
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Weekly Menu & Missed Meals Inspector Modal */}
      {isMenuModalOpen && currentNutritionPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-neutral-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-neutral-950/40">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-bold shrink-0 mt-0.5">
                  <Utensils className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                      Cardápio Semanal • {currentClient?.displayName}
                    </h2>
                    {dietStats.missedCount > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] font-black flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {dietStats.missedCount} {dietStats.missedCount === 1 ? 'Falta Detetada' : 'Faltas Detetadas'}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        100% Cumprido
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
                    {currentNutritionPlan.title} • Meta: {currentNutritionPlan.dailyCalories} kcal / dia • Auditoria de adesão em tempo real
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsMenuModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Subheader Filters: Days of the Week tabs + Missed filter toggle */}
            <div className="px-5 sm:px-6 pt-3 pb-2 border-b border-slate-100 dark:border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-neutral-900">
              {/* Day selection pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {dietStats.daysData.map(d => {
                  const isSelected = selectedMenuDayIndex === d.dayIndex;
                  return (
                    <button
                      key={d.dayIndex}
                      onClick={() => setSelectedMenuDayIndex(d.dayIndex)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-black shadow-sm shadow-amber-500/20'
                          : d.hasMissed
                          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                          : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span>{d.dayName}</span>
                      {d.hasMissed ? (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-extrabold ${isSelected ? 'bg-black text-amber-400' : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'}`}>
                          Falta: {d.missedNames}
                        </span>
                      ) : (
                        <span className={`text-[9px] opacity-75 font-mono ${isSelected ? 'text-black' : ''}`}>
                          {d.completedCount}/{d.totalExpected}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Filter toggle: only missed meals */}
              {dietStats.missedCount > 0 && (
                <button
                  type="button"
                  onClick={() => setMenuFilterOnlyMissed(prev => !prev)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer ${
                    menuFilterOnlyMissed
                      ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40'
                      : 'bg-slate-50 dark:bg-neutral-950 text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-neutral-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>{menuFilterOnlyMissed ? 'A exibir apenas faltas' : 'Filtrar apenas faltas'}</span>
                </button>
              )}
            </div>

            {/* Modal Body: Meals of the Selected Day */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {(() => {
                const dayData = dietStats.daysData.find(d => d.dayIndex === selectedMenuDayIndex) || dietStats.daysData[0];
                const dayPlan = dayData.dayPlan;
                
                let mealsToShow = dayData.mealsStatus || [];
                if (menuFilterOnlyMissed) {
                  mealsToShow = mealsToShow.filter(m => m.isMissed);
                }

                return (
                  <>
                    {/* Day summary card */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-neutral-950/60 border border-slate-200 dark:border-neutral-800">
                      <div>
                        <div className="text-xs uppercase font-extrabold text-amber-500">
                          {dayData.fullDayName}
                        </div>
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-0.5">
                          {dayData.hasMissed 
                            ? `⚠️ Falta Registada no Dia: ${dayData.missedNames}` 
                            : '✔️ Dia 100% Conforme o Plano (Todas as refeições consumidas)'}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                          Total prescrito: {dayPlan?.totalCalories || currentNutritionPlan.dailyCalories} kcal • {dayPlan?.totalProtein || 180}g Proteína • {dayPlan?.totalCarbs || 230}g Hidratos • {dayPlan?.totalFat || 65}g Gorduras
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-xl text-xs font-black ${
                          dayData.hasMissed 
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30' 
                            : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {dayData.completedCount} / {dayData.totalExpected} Refeições Cumpridas
                        </span>
                      </div>
                    </div>

                    {/* Meal list */}
                    {mealsToShow.length === 0 ? (
                      <div className="p-8 text-center bg-slate-50 dark:bg-neutral-950/30 rounded-2xl border border-slate-200 dark:border-neutral-800 text-slate-400">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                        <p className="text-xs font-bold">Sem faltas registadas neste dia. Todas as refeições foram consumidas!</p>
                      </div>
                    ) : (
                      <div className="space-y-3.5">
                        {mealsToShow.map(meal => {
                          const isMissed = meal.isMissed;
                          const isCompleted = meal.isCompleted;

                          return (
                            <div
                              key={meal.mealId}
                              className={`rounded-2xl border p-4 sm:p-5 transition-all shadow-sm ${
                                isMissed
                                  ? 'bg-amber-500/10 dark:bg-amber-950/20 border-amber-500/50 ring-1 ring-amber-500/30'
                                  : 'bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs font-bold text-amber-500">{meal.time}</span>
                                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                                      {meal.mealName}
                                    </h4>
                                    {isMissed && (
                                      <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-black border border-red-500/30">
                                        FALTA
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                                    {meal.description}
                                  </p>
                                </div>

                                {/* Status badge */}
                                <div className="shrink-0">
                                  {isMissed ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-black">
                                      <AlertTriangle className="w-3.5 h-3.5" />
                                      <span>NÃO CUMPRIDA / SALTADA</span>
                                    </span>
                                  ) : isCompleted ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Cumprida Conforme o Plano</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-500 text-xs font-semibold">
                                      <Clock className="w-3.5 h-3.5" />
                                      <span>Pendente</span>
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Missed Meal Callout Note if any */}
                              {isMissed && (
                                <div className="p-3 mb-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs">
                                  <strong className="text-red-700 dark:text-red-400 block mb-0.5 flex items-center gap-1.5">
                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                    Motivo da Falta Reportado pelo Aluno:
                                  </strong>
                                  <p className="text-slate-700 dark:text-neutral-300 leading-relaxed font-medium mt-1">
                                    {meal.missedReason || 'Aluno reportou que saltou esta refeição prescrita.'}
                                  </p>
                                </div>
                              )}

                              {/* Prescribed Foods & Quantities Table */}
                              <div className="bg-slate-50 dark:bg-neutral-950/60 rounded-xl p-3 border border-slate-100 dark:border-neutral-800/80">
                                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
                                  <span>Ingredientes Prescritos</span>
                                  <span className="font-mono text-amber-500 font-black">
                                    {meal.calories} kcal ({meal.proteinG}g P • {meal.carbsG}g C • {meal.fatG}g G)
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                  {meal.foods?.map((f: any, fIdx: number) => (
                                    <div key={fIdx} className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
                                      <span className="text-slate-800 dark:text-neutral-200 font-medium">{f.item}</span>
                                      <span className="font-mono font-bold text-amber-500 ml-2 shrink-0">{f.quantity}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Coach Feedback/Note Quick Sender to Student */}
                    <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-neutral-950/80 border border-slate-200 dark:border-neutral-800">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-amber-500" />
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                          Enviar Orientação Nutricional ao Aluno
                        </h4>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={coachNoteToAthlete}
                          onChange={(e) => setCoachNoteToAthlete(e.target.value)}
                          placeholder="Escreve uma recomendação (ex: 'Ajustei o lanche de quarta para ser mais prático...')"
                          className="flex-1 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            if (!coachNoteToAthlete.trim() || !currentClient) return;
                            await sendMessage(`[Nota Nutricional do Coach]: ${coachNoteToAthlete.trim()}`, currentClient.uid);
                            setFeedback(`Orientação enviada com sucesso para ${currentClient.displayName}!`);
                            setTimeout(() => setFeedback(null), 3500);
                            setCoachNoteToAthlete('');
                          }}
                          className="px-4 py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs hover:bg-amber-400 transition cursor-pointer shrink-0"
                        >
                          Enviar
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-neutral-800 flex items-center justify-between bg-slate-50/50 dark:bg-neutral-950/40">
              <span className="text-xs text-slate-400">
                Auditoria de cardápio semanal isolada da visualização de relatórios físicos.
              </span>
              <button
                type="button"
                onClick={() => setIsMenuModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-extrabold text-xs transition cursor-pointer shadow-sm hover:opacity-90"
              >
                Concluir Auditoria
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
