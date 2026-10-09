import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  Calendar, 
  Users, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Clock, 
  Play, 
  Moon, 
  Coffee, 
  ChevronRight, 
  ChevronDown, 
  ArrowRight, 
  Search, 
  X,
  Layers,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  WorkoutPlan, 
  DayWorkout, 
  DayExercise, 
  WorkoutSet, 
  Exercise, 
  DailyWorkoutTemplate, 
  WeeklyWorkoutTemplate 
} from '../../types';

export const CoachWorkoutsView: React.FC = () => {
  const { allClients } = useAuth();
  const { 
    exercises, 
    workoutPlans, 
    saveWorkoutPlan, 
    dailyWorkoutTemplates, 
    weeklyWorkoutTemplates,
    selectedAthleteId, 
    setSelectedAthleteId 
  } = useData();

  // Active athlete selection
  const [selectedClientId, setSelectedClientId] = useState<string>(
    selectedAthleteId || allClients[0]?.uid || 'client-ricardo-silva'
  );

  // Plan Details
  const [planTitle, setPlanTitle] = useState('Mesociclo de Hipertrofia & Força Funcional');
  const [weekStart, setWeekStart] = useState('2026-10-05');
  const [weekEnd, setWeekEnd] = useState('2026-10-11');
  const [planNotes, setPlanNotes] = useState('Foco na cadência excêntrica de 3s e progressão nas primeiras séries.');

  // Weekly Calendar (7 days)
  const defaultDays: DayWorkout[] = [
    { dayOfWeek: 'Segunda-feira', dayIndex: 0, name: 'Treino A - Peito e Tríceps', isRestDay: false, focusArea: 'Peitoral & Tríceps', exercises: [] },
    { dayOfWeek: 'Terça-feira', dayIndex: 1, name: 'Treino B - Costas e Bíceps', isRestDay: false, focusArea: 'Dorsal & Bíceps', exercises: [] },
    { dayOfWeek: 'Quarta-feira', dayIndex: 2, name: 'Descanso Ativo', isRestDay: true, focusArea: 'Recuperação', exercises: [] },
    { dayOfWeek: 'Quinta-feira', dayIndex: 3, name: 'Treino C - Pernas Completo', isRestDay: false, focusArea: 'Quadríceps & Glúteos', exercises: [] },
    { dayOfWeek: 'Sexta-feira', dayIndex: 4, name: 'Treino D - Ombros e Core', isRestDay: false, focusArea: 'Deltoides & Abdómen', exercises: [] },
    { dayOfWeek: 'Sábado', dayIndex: 5, name: 'Descanso', isRestDay: true, focusArea: 'Recuperação', exercises: [] },
    { dayOfWeek: 'Domingo', dayIndex: 6, name: 'Descanso Total', isRestDay: true, focusArea: 'Recuperação', exercises: [] },
  ];

  const [days, setDays] = useState<DayWorkout[]>(defaultDays);

  // Modals & Pickers
  const [showWeeklyPickerModal, setShowWeeklyPickerModal] = useState(false);
  const [showDailyPickerModal, setShowDailyPickerModal] = useState<number | null>(null); // dayIndex or null
  const [showExercisePickerModal, setShowExercisePickerModal] = useState<number | null>(null); // dayIndex or null
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [publishedNotice, setPublishedNotice] = useState(false);

  // Sync with context selectedAthleteId
  useEffect(() => {
    if (selectedAthleteId && selectedAthleteId !== selectedClientId) {
      setSelectedClientId(selectedAthleteId);
    }
  }, [selectedAthleteId]);

  // Load client's plan when athlete changes
  useEffect(() => {
    const existingPlan = workoutPlans.find(p => p.clientId === selectedClientId && p.status === 'active') ||
                         workoutPlans.find(p => p.clientId === selectedClientId);

    if (existingPlan && existingPlan.days && existingPlan.days.length > 0) {
      setPlanTitle(existingPlan.title);
      setWeekStart(existingPlan.weekStartDate || '2026-10-05');
      setWeekEnd(existingPlan.weekEndDate || '2026-10-11');
      setPlanNotes(existingPlan.notes || '');
      setDays(JSON.parse(JSON.stringify(existingPlan.days)));
    }
  }, [selectedClientId, workoutPlans]);

  const targetClient = allClients.find(c => c.uid === selectedClientId) || allClients[0];

  // Helper to determine current day of week (Portugal local time)
  const todayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const todayDayName = todayNames[new Date().getDay()];

  // -------------------------------------------------------------
  // ACTION: Atribuir Plano Semanal Predefinido da Biblioteca
  // (Ocupa os dias todos automaticamente como solicitado pelo user!)
  // -------------------------------------------------------------
  const handleApplyWeeklyTemplate = (weeklyTmpl: WeeklyWorkoutTemplate) => {
    setPlanTitle(weeklyTmpl.name);
    if (weeklyTmpl.description) setPlanNotes(weeklyTmpl.description);

    const newDays: DayWorkout[] = weeklyTmpl.days.map((d) => ({
      dayOfWeek: d.dayOfWeek,
      dayIndex: d.dayIndex,
      name: d.isRestDay ? 'Descanso / Recuperação' : (d.dailyWorkoutName || 'Treino Atribuído'),
      isRestDay: d.isRestDay,
      focusArea: d.isRestDay ? 'Recuperação' : 'Musculação',
      exercises: d.isRestDay ? [] : JSON.parse(JSON.stringify(d.exercises || []))
    }));

    setDays(newDays);
    setShowWeeklyPickerModal(false);
  };

  // -------------------------------------------------------------
  // ACTION: Atribuir Plano Diário da Biblioteca a um Dia Específico
  // -------------------------------------------------------------
  const handleApplyDailyTemplateToDay = (dayIndex: number, dailyTmpl: DailyWorkoutTemplate) => {
    setDays(prev => prev.map((d, i) => {
      if (i === dayIndex) {
        return {
          ...d,
          name: dailyTmpl.name,
          focusArea: dailyTmpl.focusArea || d.focusArea,
          isRestDay: false,
          exercises: JSON.parse(JSON.stringify(dailyTmpl.exercises || []))
        };
      }
      return d;
    }));
    setShowDailyPickerModal(null);
  };

  // -------------------------------------------------------------
  // ACTION: Adicionar Exercício Manualmente da Biblioteca
  // -------------------------------------------------------------
  const handleAddExerciseToDay = (dayIndex: number, ex: Exercise) => {
    const setsCount = ex.setsCount || 3;
    const repsStr = ex.isToFailure ? 'Até à falha' : (ex.reps || '10-12');
    const restSec = ex.restSeconds || 90;

    const defaultSets: WorkoutSet[] = Array.from({ length: setsCount }, (_, i) => ({
      setNumber: i + 1,
      reps: repsStr,
      targetWeightKg: 50,
      restSeconds: restSec,
      completed: false
    }));

    const newExercise: DayExercise = {
      exerciseId: ex.id,
      exerciseName: ex.name,
      muscleGroup: ex.muscleGroup,
      videoUrl: ex.videoUrl,
      imageUrl: ex.imageUrl,
      notes: ex.instructions,
      sets: defaultSets
    };

    setDays(prev => prev.map((d, i) => {
      if (i === dayIndex) {
        return {
          ...d,
          isRestDay: false,
          exercises: [...d.exercises, newExercise]
        };
      }
      return d;
    }));
  };

  // Toggle Rest Day
  const handleToggleRestDay = (dayIndex: number) => {
    setDays(prev => prev.map((d, i) => {
      if (i === dayIndex) {
        const nextRest = !d.isRestDay;
        return {
          ...d,
          isRestDay: nextRest,
          name: nextRest ? 'Descanso / Recuperação' : 'Treino de Força'
        };
      }
      return d;
    }));
  };

  // Remove exercise from day
  const handleRemoveExercise = (dayIndex: number, exIdx: number) => {
    setDays(prev => prev.map((d, i) => {
      if (i === dayIndex) {
        return {
          ...d,
          exercises: d.exercises.filter((_, idx) => idx !== exIdx)
        };
      }
      return d;
    }));
  };

  // Move exercise up/down in day
  const handleMoveExercise = (dayIndex: number, exIdx: number, targetIdx: number) => {
    setDays(prev => prev.map((d, i) => {
      if (i === dayIndex) {
        if (targetIdx < 0 || targetIdx >= d.exercises.length) return d;
        const copy = [...d.exercises];
        const [moved] = copy.splice(exIdx, 1);
        copy.splice(targetIdx, 0, moved);
        return { ...d, exercises: copy };
      }
      return d;
    }));
  };

  // Publish / Save Plan to Athlete
  const handlePublishPlan = async () => {
    if (!targetClient) return;

    const planToSave: WorkoutPlan = {
      id: 'workout-' + targetClient.uid + '-' + Date.now(),
      clientId: targetClient.uid,
      clientName: targetClient.displayName,
      coachId: 'coach-sergio-cunha',
      title: planTitle,
      weekStartDate: weekStart,
      weekEndDate: weekEnd,
      status: 'active',
      notes: planNotes,
      days: days,
      createdAt: new Date().toISOString()
    };

    await saveWorkoutPlan(planToSave);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });

    setPublishedNotice(true);
    setTimeout(() => setPublishedNotice(false), 4000);
  };

  return (
    <div className="space-y-6 pb-20">

      {/* Success Notification Banner */}
      {publishedNotice && (
        <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-extrabold text-sm">Plano de Treino Publicado com Sucesso!</p>
              <p className="text-xs">O aluno {targetClient?.displayName} já tem acesso imediato no seu calendário semanal.</p>
            </div>
          </div>
          <button onClick={() => setPublishedNotice(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header & Athlete Selector Card */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          {/* Title & Subtitle */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500">
                <Dumbbell className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Atribuição de Treinos
                </h1>
                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  Seleciona o aluno e atribui treinos diários ou planos semanais da biblioteca com 1 clique.
                </p>
              </div>
            </div>
          </div>

          {/* Athlete Selector Dropdown */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-2xl">
              <img 
                src={targetClient?.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                alt={targetClient?.displayName}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-amber-500/40"
              />
              <div className="min-w-0 pr-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 block">Aluno Ativo</label>
                <select
                  value={selectedClientId}
                  onChange={(e) => {
                    setSelectedClientId(e.target.value);
                    setSelectedAthleteId(e.target.value);
                  }}
                  className="bg-transparent font-extrabold text-xs text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                >
                  {allClients.map((c) => (
                    <option key={c.uid} value={c.uid} className="bg-white dark:bg-neutral-900 text-slate-900 dark:text-white">
                      {c.displayName} ({c.subscriptionStatus === 'active' ? 'Ativo' : 'Expirado'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick General Action: Atribuir Plano Semanal Predefinido da Biblioteca */}
            <button
              onClick={() => setShowWeeklyPickerModal(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-neutral-200 text-xs font-black transition shadow-md cursor-pointer"
              title="Preenche todos os 7 dias automaticamente a partir de um plano semanal da biblioteca"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Atribuir Plano Semanal da Biblioteca</span>
              <span className="sm:hidden">Plano Semanal</span>
            </button>

            {/* Final Save / Publish Button */}
            <button
              onClick={handlePublishPlan}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black transition shadow-lg shadow-amber-500/25 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Publicar ao Aluno</span>
            </button>
          </div>
        </div>

        {/* Plan Title & Notes Inline Editor */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-neutral-800/80 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="font-bold text-slate-500 dark:text-neutral-400 block mb-1">Título do Plano Semanal</label>
            <input
              type="text"
              value={planTitle}
              onChange={(e) => setPlanTitle(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="font-bold text-slate-500 dark:text-neutral-400 block mb-1">Notas / Recomendações para o Aluno</label>
            <input
              type="text"
              value={planNotes}
              onChange={(e) => setPlanNotes(e.target.value)}
              placeholder="Ex: Foco na recuperação e cadência controlada..."
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* WEEKLY CALENDAR (SEGUNDA A DOMINGO)                        */}
      {/* ========================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-500" />
            <h2 className="font-black text-sm uppercase tracking-wider text-slate-900 dark:text-white">
              Calendário Semanal do Aluno ({days.length} Dias)
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Clica em cada dia para atribuir planos diários ou exercícios manuais da biblioteca.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-3.5">
          {days.map((day, dayIndex) => {
            const isToday = day.dayOfWeek === todayDayName;

            return (
              <div
                key={day.dayOfWeek}
                className={`flex flex-col justify-between rounded-3xl border p-4 transition shadow-sm ${
                  isToday
                    ? 'ring-2 ring-amber-500 bg-white dark:bg-neutral-900 border-amber-500/50'
                    : day.isRestDay
                    ? 'bg-slate-50/70 dark:bg-neutral-950/40 border-slate-200 dark:border-neutral-800/80'
                    : 'bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800'
                }`}
              >
                {/* Day Header */}
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-neutral-800">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                        {day.dayOfWeek.split('-')[0]}
                      </span>
                      {isToday && (
                        <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black font-black text-[9px] uppercase tracking-wider">
                          Hoje
                        </span>
                      )}
                    </div>

                    {/* Rest Day Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleRestDay(dayIndex)}
                      className={`p-1 rounded-lg text-xs transition cursor-pointer ${
                        day.isRestDay 
                          ? 'bg-purple-500/10 text-purple-500 hover:bg-purple-500 hover:text-white' 
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-neutral-300'
                      }`}
                      title={day.isRestDay ? 'Mudar para Dia de Treino' : 'Marcar como Dia de Descanso'}
                    >
                      {day.isRestDay ? <Coffee className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Day Status / Workout Name */}
                  <div className="my-2.5">
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">
                      {day.isRestDay ? 'Descanso' : (day.focusArea || 'Musculação')}
                    </span>
                    <h3 className="font-extrabold text-xs text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                      {day.name}
                    </h3>
                  </div>

                  {/* Actions for this day */}
                  {!day.isRestDay && (
                    <div className="space-y-1.5 mb-3">
                      {/* Atribuir Plano Diário da Biblioteca */}
                      <button
                        type="button"
                        onClick={() => setShowDailyPickerModal(dayIndex)}
                        className="w-full flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-slate-100 dark:bg-neutral-800 hover:bg-amber-500 hover:text-black text-slate-700 dark:text-neutral-300 text-[11px] font-bold transition cursor-pointer"
                        title="Atribuir um plano diário predefinido da biblioteca a este dia"
                      >
                        <Layers className="w-3 h-3" />
                        <span>Plano Diário</span>
                      </button>

                      {/* Adicionar Exercício Singular Manualmente */}
                      <button
                        type="button"
                        onClick={() => setShowExercisePickerModal(dayIndex)}
                        className="w-full flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl border border-dashed border-slate-300 dark:border-neutral-700 hover:border-amber-500 text-slate-600 dark:text-neutral-400 hover:text-amber-500 text-[11px] font-semibold transition cursor-pointer"
                        title="Adicionar exercício individual da biblioteca"
                      >
                        <Plus className="w-3 h-3" />
                        <span>+ Exercício</span>
                      </button>
                    </div>
                  )}

                  {/* Exercises Stack for this day */}
                  {day.isRestDay ? (
                    <div className="py-8 flex flex-col items-center justify-center text-center text-slate-400">
                      <Coffee className="w-6 h-6 mb-1 text-purple-400 opacity-60" />
                      <p className="text-[11px] font-semibold">Descanso / Recuperação</p>
                    </div>
                  ) : day.exercises.length === 0 ? (
                    <div className="py-6 flex flex-col items-center justify-center text-center text-slate-400 border border-dashed border-slate-200 dark:border-neutral-800 rounded-2xl">
                      <p className="text-[10px] text-slate-400">Sem exercícios atribuídos.</p>
                      <span className="text-[9px] text-amber-500 mt-0.5">Usa os botões acima</span>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-0.5">
                      {day.exercises.map((ex, exIdx) => (
                        <div 
                          key={exIdx}
                          className="p-2 rounded-xl bg-slate-50 dark:bg-neutral-950/80 border border-slate-200 dark:border-neutral-800/80 text-xs flex flex-col justify-between group"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-bold text-[11px] text-slate-900 dark:text-white line-clamp-1">
                              {ex.exerciseName}
                            </span>
                            <div className="flex items-center opacity-70 group-hover:opacity-100 transition">
                              <button
                                type="button"
                                disabled={exIdx === 0}
                                onClick={() => handleMoveExercise(dayIndex, exIdx, exIdx - 1)}
                                className="p-0.5 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                disabled={exIdx === day.exercises.length - 1}
                                onClick={() => handleMoveExercise(dayIndex, exIdx, exIdx + 1)}
                                className="p-0.5 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                              >
                                ↓
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveExercise(dayIndex, exIdx)}
                                className="p-0.5 text-red-500 hover:text-red-400 cursor-pointer ml-1"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-neutral-400 mt-1">
                            <span>{ex.sets?.length || 3} Séries</span>
                            {ex.sets?.[0]?.reps && <span>{ex.sets[0].reps} reps</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Day Summary Footer */}
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-neutral-800 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>{day.isRestDay ? 'Descanso' : `${day.exercises.length} Exercícios`}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: SELECIONAR PLANO SEMANAL DA BIBLIOTECA              */}
      {/* ========================================================= */}
      {showWeeklyPickerModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Atribuir Plano Semanal Predefinido da Biblioteca
                </h3>
              </div>
              <button onClick={() => setShowWeeklyPickerModal(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Escolhe um dos planos semanais criados na biblioteca para preencher automaticamente os 7 dias do aluno:
            </p>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {weeklyWorkoutTemplates.map(weekly => (
                <div
                  key={weekly.id}
                  onClick={() => handleApplyWeeklyTemplate(weekly)}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-neutral-800 hover:border-amber-500 bg-slate-50 dark:bg-neutral-950/60 hover:bg-amber-500/5 transition cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-amber-500 transition">
                      {weekly.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">{weekly.description}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      {weekly.days.map((d, i) => (
                        <span 
                          key={i} 
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            d.isRestDay ? 'bg-slate-200 dark:bg-neutral-800 text-slate-400' : 'bg-amber-500/20 text-amber-500'
                          }`}
                        >
                          {d.dayOfWeek.slice(0, 3)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <span className="p-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs flex items-center gap-1 group-hover:scale-105 transition">
                    <span>Atribuir</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: SELECIONAR PLANO DIÁRIO PARA UM DIA ESPECÍFICO      */}
      {/* ========================================================= */}
      {showDailyPickerModal !== null && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Atribuir Treino Diário a {days[showDailyPickerModal]?.dayOfWeek}
                </h3>
              </div>
              <button onClick={() => setShowDailyPickerModal(null)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Seleciona um treino diário estruturado na biblioteca para ocupar este dia com todos os seus exercícios:
            </p>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {dailyWorkoutTemplates.map(daily => (
                <div
                  key={daily.id}
                  onClick={() => handleApplyDailyTemplateToDay(showDailyPickerModal, daily)}
                  className="p-3 rounded-2xl border border-slate-200 dark:border-neutral-800 hover:border-amber-500 bg-slate-50 dark:bg-neutral-950/60 hover:bg-amber-500/5 transition cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-amber-500 transition">
                      {daily.name}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {daily.exercises.length} exercícios • {daily.focusArea || 'Geral'}
                    </span>
                  </div>

                  <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-500 font-extrabold text-[11px] group-hover:bg-amber-500 group-hover:text-black transition">
                    Carregar Dia
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADICIONAR EXERCÍCIO INDIVIDUAL DA BIBLIOTECA       */}
      {/* ========================================================= */}
      {showExercisePickerModal !== null && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Adicionar Exercício a {days[showExercisePickerModal]?.dayOfWeek}
                </h3>
              </div>
              <button onClick={() => setShowExercisePickerModal(null)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar exercício por nome ou grupo muscular..."
                value={exerciseSearch}
                onChange={(e) => setExerciseSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {exercises
                .filter(ex => ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) || ex.muscleGroup.toLowerCase().includes(exerciseSearch.toLowerCase()))
                .map(ex => (
                  <div
                    key={ex.id}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-neutral-800 flex items-center justify-between hover:border-amber-500 transition"
                  >
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{ex.name}</h4>
                      <span className="text-[10px] text-amber-500 font-semibold">{ex.category} • {ex.muscleGroup}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        handleAddExerciseToDay(showExercisePickerModal, ex);
                        setShowExercisePickerModal(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition cursor-pointer"
                    >
                      + Adicionar
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
