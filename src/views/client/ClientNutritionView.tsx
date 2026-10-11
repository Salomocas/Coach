import React, { useState } from 'react';
import { 
  Utensils, 
  Droplet, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Apple, 
  Fish, 
  ChevronDown, 
  ChevronUp,
  FileText,
  AlertCircle,
  AlertTriangle,
  X,
  MessageSquare
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { DayNutrition, Meal } from '../../types';

export const ClientNutritionView: React.FC = () => {
  const { currentUser } = useAuth();
  const { activeNutritionPlan, mealAdherenceLogs, toggleMealAdherence } = useData();

  // Get today's index in Monday..Sunday (0..6)
  const getTodayDayIndex = (): number => {
    const jsDay = new Date().getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
    return jsDay === 0 ? 6 : jsDay - 1;
  };

  const todayIndex = getTodayDayIndex();

  // Default directly to today's day of week
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(todayIndex);
  const [expandedMealId, setExpandedMealId] = useState<string | null>('meal-1');
  const [waterIntakeMl, setWaterIntakeMl] = useState<number>(2250);
  const [completedMeals, setCompletedMeals] = useState<Record<string, boolean>>({});
  
  // Dialog state for registering meal miss with reason
  const [missedMealDialog, setMissedMealDialog] = useState<{ meal: Meal; reason: string } | null>(null);

  const daysOfWeek = [
    { label: 'Seg', full: 'Segunda-feira', index: 0 },
    { label: 'Ter', full: 'Terça-feira', index: 1 },
    { label: 'Qua', full: 'Quarta-feira', index: 2 },
    { label: 'Qui', full: 'Quinta-feira', index: 3 },
    { label: 'Sex', full: 'Sexta-feira', index: 4 },
    { label: 'Sáb', full: 'Sábado', index: 5 },
    { label: 'Dom', full: 'Domingo', index: 6 },
  ];

  if (!activeNutritionPlan) {
    return (
      <div className="p-8 text-center bg-neutral-900 border border-neutral-800 rounded-3xl">
        <Utensils className="w-12 h-12 text-amber-500 mx-auto mb-3 opacity-60" />
        <h3 className="text-lg font-bold text-white">Nenhum Plano Nutricional Ativo</h3>
        <p className="text-sm text-neutral-400 mt-1">A tua ementa nutricional será atribuída em breve.</p>
      </div>
    );
  }

  const currentDayNutrition: DayNutrition | undefined = activeNutritionPlan.days.find(
    d => d.dayIndex === selectedDayIndex
  ) || activeNutritionPlan.days[0];

  const toggleMealExpand = (id: string) => {
    setExpandedMealId(expandedMealId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-gradient-to-r dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                Ementa Nutricional Semanal
              </span>
              <span className="text-xs text-slate-500 dark:text-neutral-400">
                Meta Diária: ~{activeNutritionPlan.dailyCalories} kcal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {activeNutritionPlan.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-300 mt-2 max-w-2xl leading-relaxed">
              {activeNutritionPlan.notes}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-neutral-950/80 border border-slate-200 dark:border-neutral-800 rounded-2xl p-4 shrink-0 flex items-center gap-4">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-neutral-400 block">Hidratação Mínima</span>
              <span className="text-lg font-extrabold text-sky-500 dark:text-sky-400 flex items-center justify-center gap-1">
                <Droplet className="w-4 h-4 fill-sky-400" />
                {currentDayNutrition?.waterIntakeLiters || 3.5}L / dia
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Week Day Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {daysOfWeek.map((day) => {
          const isSelected = selectedDayIndex === day.index;
          const isToday = todayIndex === day.index;
          const dayPlan = activeNutritionPlan.days.find(d => d.dayIndex === day.index);
          const calories = dayPlan?.totalCalories || activeNutritionPlan.dailyCalories;

          return (
            <button
              key={day.index}
              onClick={() => setSelectedDayIndex(day.index)}
              className={`flex-1 min-w-[75px] sm:min-w-[100px] py-3 px-3 rounded-2xl border text-center transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-amber-500 text-black border-amber-500 font-extrabold shadow-md shadow-amber-500/15 scale-[1.02]'
                  : 'bg-white dark:bg-neutral-900/80 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 hover:border-slate-300 dark:hover:border-neutral-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isToday && (
                <span className={`inline-block text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-full mb-0.5 ${
                  isSelected 
                    ? 'bg-black text-amber-400' 
                    : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40'
                }`}>
                  Hoje
                </span>
              )}
              <div className="text-xs uppercase tracking-wider font-semibold">{day.label}</div>
              <div className="text-sm font-bold mt-0.5">
                {calories} kcal
              </div>
            </button>
          );
        })}
      </div>

      {/* Day Macro Targets Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-4 text-center shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">Calorias Totais</span>
          <div className="text-2xl font-black text-amber-500 dark:text-amber-400 mt-1">
            {currentDayNutrition?.totalCalories || activeNutritionPlan.dailyCalories}
          </div>
          <span className="text-[10px] text-slate-400 dark:text-neutral-500">kcal planeadas</span>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-4 text-center shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">Proteína</span>
          <div className="text-2xl font-black text-red-500 dark:text-red-400 mt-1">
            {currentDayNutrition?.totalProtein || 180}g
          </div>
          <span className="text-[10px] text-slate-400 dark:text-neutral-500">~2.2g / kg corporal</span>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-4 text-center shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">Hidratos de Carbono</span>
          <div className="text-2xl font-black text-blue-500 dark:text-blue-400 mt-1">
            {currentDayNutrition?.totalCarbs || 230}g
          </div>
          <span className="text-[10px] text-slate-400 dark:text-neutral-500">Energia & glicogénio</span>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-4 text-center shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">Gorduras Saudáveis</span>
          <div className="text-2xl font-black text-emerald-500 dark:text-emerald-400 mt-1">
            {currentDayNutrition?.totalFat || 65}g
          </div>
          <span className="text-[10px] text-slate-400 dark:text-neutral-500">Suporte hormonal</span>
        </div>
      </div>

      {/* Interactive Water Tracker */}
      <div className="bg-white dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-500 dark:text-sky-400 flex items-center justify-center font-bold shrink-0">
            <Droplet className="w-5 h-5 fill-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Registo de Hidratação Diária</h3>
              <span className="text-xs font-mono font-bold text-sky-500 dark:text-sky-400">
                {(waterIntakeMl / 1000).toFixed(2)}L / {(currentDayNutrition?.waterIntakeLiters || 3.5).toFixed(1)}L
              </span>
            </div>
            <div className="w-48 sm:w-64 bg-slate-100 dark:bg-neutral-950 rounded-full h-2 mt-1.5 overflow-hidden border border-slate-200 dark:border-neutral-800">
              <div 
                className="bg-sky-400 h-full transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(100, (waterIntakeMl / ((currentDayNutrition?.waterIntakeLiters || 3.5) * 1000)) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setWaterIntakeMl(prev => prev + 250)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-neutral-950 hover:bg-slate-200 dark:hover:bg-neutral-800 border border-slate-200 dark:border-neutral-800 text-slate-800 dark:text-neutral-200 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
          >
            <span>+250ml</span>
          </button>
          <button
            type="button"
            onClick={() => setWaterIntakeMl(prev => prev + 500)}
            className="px-3 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-sky-700 dark:text-sky-300 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
          >
            <span>+500ml</span>
          </button>
          <button
            type="button"
            onClick={() => setWaterIntakeMl(0)}
            className="px-2 py-1.5 rounded-xl bg-slate-100 dark:bg-neutral-950 hover:bg-slate-200 dark:hover:bg-neutral-800 text-slate-400 dark:text-neutral-500 hover:text-slate-700 dark:hover:text-neutral-300 text-[11px] transition cursor-pointer"
            title="Repor água"
          >
            Repor
          </button>
        </div>
      </div>

      {/* Meals List */}
      <div className="space-y-4">
        {(() => {
          const norm = (s?: string) => s ? s.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '') : '';
          const meals = currentDayNutrition?.meals || [];
          const athleteId = currentUser?.uid || 'client-ricardo-silva';
          
          const mealsAdherence = meals.map(meal => {
            const log = mealAdherenceLogs.find(
              l => l.clientId === athleteId &&
                   l.dayIndex === selectedDayIndex &&
                   (l.mealId === meal.id || norm(l.mealName) === norm(meal.name))
            );
            const isMissed = log?.status === 'missed';
            const isCompleted = log ? log.status === 'completed' : !!completedMeals[`${selectedDayIndex}_${meal.id}`];
            return {
              meal,
              isCompleted: !isMissed && isCompleted,
              isMissed,
              missedReason: isMissed ? log?.missedReason : undefined,
              log
            };
          });

          const completedCount = mealsAdherence.filter(m => m.isCompleted).length;
          const missedMeals = mealsAdherence.filter(m => m.isMissed);
          const missedCount = missedMeals.length;
          const missedNames = missedMeals.map(m => m.meal.name).join(', ');

          return (
            <>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-neutral-800">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    Refeições do Dia • {currentDayNutrition?.dayOfWeek}
                  </h2>
                  {selectedDayIndex === todayIndex && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] font-extrabold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      HOJE
                    </span>
                  )}
                  {missedCount > 0 ? (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full border font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>{completedCount} / {meals.length} consumidas • Falta em: {missedNames}</span>
                    </span>
                  ) : completedCount === meals.length && meals.length > 0 ? (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full border font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span>{completedCount} / {meals.length} consumidas (100% cumprido)</span>
                    </span>
                  ) : (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full border font-bold bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-neutral-700">
                      {completedCount} / {meals.length} consumidas
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500 dark:text-neutral-400">
                  {meals.length} refeições estruturadas
                </span>
              </div>

              {(!meals || meals.length === 0) ? (
                <div className="bg-slate-50 dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 rounded-2xl p-8 text-center text-slate-500 dark:text-neutral-400 text-sm">
                  <Apple className="w-8 h-8 text-slate-400 dark:text-neutral-600 mx-auto mb-2" />
                  Ementa idêntica à de Segunda-feira para este dia. Mantém a consistência alimentar.
                </div>
              ) : (
                mealsAdherence.map(({ meal, isCompleted, isMissed, log }) => {
                  const isExpanded = expandedMealId === meal.id;

                  return (
                    <div
                      key={meal.id}
                      className={`bg-white dark:bg-neutral-900 border rounded-2xl overflow-hidden transition-all shadow-sm ${
                        isCompleted 
                          ? 'border-emerald-500/40 bg-emerald-50/20 dark:bg-neutral-900/90' 
                          : isMissed
                          ? 'border-amber-500/40 bg-amber-50/10 dark:bg-neutral-900/80 ring-1 ring-amber-500/10'
                          : 'border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700/80'
                      }`}
                    >
                      {/* Meal Header */}
                      <div className="p-4 sm:p-5 flex items-center justify-between select-none">
                        <div 
                          onClick={() => toggleMealExpand(meal.id)}
                          className="flex items-center gap-3 cursor-pointer flex-1"
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                            isCompleted 
                              ? 'bg-emerald-500/20 text-emerald-500 dark:text-emerald-400' 
                              : isMissed
                              ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                              : 'bg-slate-100 dark:bg-neutral-800 text-amber-500'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            ) : isMissed ? (
                              <AlertCircle className="w-5 h-5 text-amber-500" />
                            ) : (
                              <Clock className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-mono font-bold text-amber-500 dark:text-amber-400">{meal.time}</span>
                              <h3 className="font-bold text-base text-slate-900 dark:text-white">{meal.name}</h3>
                              {isMissed && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 border border-amber-500/30">
                                  Falta Assinalada
                                </span>
                              )}
                              {isCompleted && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                  Cumprida
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">{meal.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
                            <span className="text-amber-500 dark:text-amber-400 font-bold">{meal.calories} kcal</span>
                            <span className="text-slate-300 dark:text-neutral-500">•</span>
                            <span className="text-red-500 dark:text-red-400">{meal.proteinG}g P</span>
                            <span className="text-slate-300 dark:text-neutral-500">•</span>
                            <span className="text-blue-500 dark:text-blue-400">{meal.carbsG}g C</span>
                            <span className="text-slate-300 dark:text-neutral-500">•</span>
                            <span className="text-emerald-500 dark:text-emerald-400">{meal.fatG}g G</span>
                          </div>

                          {/* Meal Action Buttons */}
                          <div className="flex items-center gap-1.5">
                            {isCompleted ? (
                              <div className="flex items-center gap-1">
                                <span className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                  <span>Cumprida</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMissedMealDialog({ meal, reason: 'Não consegui consumir a refeição prescrita' });
                                  }}
                                  className="px-2 py-1 rounded-xl text-[11px] font-semibold text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10 transition cursor-pointer"
                                  title="Marcar afinal como falta"
                                >
                                  Saltar
                                </button>
                              </div>
                            ) : isMissed ? (
                              <div className="flex items-center gap-1.5">
                                <span className="px-2.5 py-1.5 rounded-xl bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 text-xs font-black flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                                  <span>FALTA</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    setCompletedMeals(prev => ({ ...prev, [`${selectedDayIndex}_${meal.id}`]: true }));
                                    await toggleMealAdherence(
                                      athleteId,
                                      selectedDayIndex,
                                      meal.id,
                                      'completed',
                                      undefined,
                                      meal.name,
                                      meal.time
                                    );
                                  }}
                                  className="px-2.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold transition cursor-pointer"
                                  title="Marcar afinal como consumida"
                                >
                                  Consumi
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    setCompletedMeals(prev => ({ ...prev, [`${selectedDayIndex}_${meal.id}`]: true }));
                                    await toggleMealAdherence(
                                      athleteId,
                                      selectedDayIndex,
                                      meal.id,
                                      'completed',
                                      undefined,
                                      meal.name,
                                      meal.time
                                    );
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-500/20 hover:text-emerald-700 dark:bg-neutral-800 dark:hover:bg-emerald-500/20 text-slate-700 dark:text-neutral-300 hover:border-emerald-500/40 border border-slate-200 dark:border-neutral-700 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500" />
                                  <span>Consumida</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMissedMealDialog({ meal, reason: 'Reunião de trabalho / Falta de tempo' });
                                  }}
                                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-500/20 hover:text-amber-700 dark:bg-neutral-800 dark:hover:bg-amber-500/20 text-slate-500 dark:text-neutral-400 hover:border-amber-500/40 border border-slate-200 dark:border-neutral-700 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                                  title="Registar falta e indicar motivo ao treinador"
                                >
                                  <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Saltar</span>
                                </button>
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => toggleMealExpand(meal.id)}
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 cursor-pointer"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Missed meal note banner */}
                      {isMissed && (
                        <div className="mx-4 sm:mx-5 mb-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-start justify-between gap-2">
                          <div>
                            <span className="font-bold text-amber-800 dark:text-amber-300 block text-[11px] flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              Falta Registada • Motivo comunicado ao Coach:
                            </span>
                            <p className="italic text-slate-700 dark:text-neutral-300 mt-0.5">
                              "{log?.missedReason || 'Refeição assinalada como não consumida.'}"
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setMissedMealDialog({ meal, reason: log?.missedReason || '' })}
                            className="text-[10px] text-amber-700 dark:text-amber-400 font-bold hover:underline shrink-0 cursor-pointer"
                          >
                            Editar Motivo
                          </button>
                        </div>
                      )}

                      {/* Expanded Food Items List */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 border-t border-slate-200 dark:border-neutral-800/80 bg-slate-50/60 dark:bg-neutral-950/40">
                          <div className="mt-3">
                            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 mb-2">
                              Ingredientes & Quantidades Prescritas
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {meal.foods.map((food, fIdx) => (
                                <div
                                  key={fIdx}
                                  className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800/80 text-xs shadow-sm"
                                >
                                  <span className="font-medium text-slate-800 dark:text-neutral-200">{food.item}</span>
                                  <span className="font-mono font-bold text-amber-500 dark:text-amber-400 ml-2">{food.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-neutral-400 pt-2 border-t border-slate-200 dark:border-neutral-900">
                            <span>Substituições: Caso não tenhas a fonte principal, podes trocar por equivalente magro respeitando as macros.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </>
          );
        })()}
      </div>

      {/* Modal for reporting missed meal reason */}
      {missedMealDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-neutral-800">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Registar Falta de Refeição</span>
              </div>
              <button
                type="button"
                onClick={() => setMissedMealDialog(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {missedMealDialog.meal.name} ({missedMealDialog.meal.time})
              </h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                Indica o motivo pelo qual não conseguiste realizar esta refeição prescrita. O Coach Sérgio Cunha terá acesso a esta justificação no relatório.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider block">
                Motivos Frequentes:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Reunião de trabalho urgente',
                  'Falta de tempo no horário',
                  'Sem apetite / Enjoado',
                  'Refeição fora de casa / Restaurante',
                  'Falta de ingredientes'
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setMissedMealDialog(prev => prev ? { ...prev, reason: preset } : null)}
                    className={`text-[11px] px-2.5 py-1 rounded-xl border transition cursor-pointer ${
                      missedMealDialog.reason === preset
                        ? 'bg-amber-500 text-black border-amber-500 font-bold'
                        : 'bg-slate-50 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 border-slate-200 dark:border-neutral-700 hover:border-amber-500/50'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider block mb-1">
                Justificação / Observações:
              </label>
              <textarea
                value={missedMealDialog.reason}
                onChange={(e) => setMissedMealDialog(prev => prev ? { ...prev, reason: e.target.value } : null)}
                placeholder="Ex: Tive um imprevisto profissional e saltei para a refeição seguinte..."
                rows={3}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setMissedMealDialog(null)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={async () => {
                  const m = missedMealDialog.meal;
                  const reason = missedMealDialog.reason.trim() || 'Refeição não consumida';
                  setCompletedMeals(prev => ({ ...prev, [`${selectedDayIndex}_${m.id}`]: false }));
                  await toggleMealAdherence(
                    currentUser?.uid || 'client-ricardo-silva',
                    selectedDayIndex,
                    m.id,
                    'missed',
                    reason,
                    m.name,
                    m.time
                  );
                  setMissedMealDialog(null);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition shadow-md shadow-amber-500/20 cursor-pointer"
              >
                Confirmar Falta
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
