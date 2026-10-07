import React, { useState } from 'react';
import { 
  Calendar, 
  Play, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Dumbbell, 
  Sparkles, 
  ChevronRight, 
  AlertCircle,
  X,
  ExternalLink,
  Flame,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { DayWorkout, DayExercise, WorkoutSet } from '../../types';

export const ClientCalendarView: React.FC = () => {
  const { currentUser } = useAuth();
  const { activeWorkoutPlan, previousWorkoutPlan, logExerciseSet, currentWeekNumber } = useData();
  
  // Default to today's day of week or Monday (0)
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState<DayExercise | null>(null);
  const [completedWorkoutToday, setCompletedWorkoutToday] = useState(false);
  const [viewingPreviousWeek, setViewingPreviousWeek] = useState(false);

  // Rest Timer State
  const [restTimeRemaining, setRestTimeRemaining] = useState<number | null>(null);
  const [totalRestSeconds, setTotalRestSeconds] = useState<number>(90);

  const displayedPlan = (viewingPreviousWeek && previousWorkoutPlan) ? previousWorkoutPlan : activeWorkoutPlan;

  React.useEffect(() => {
    if (restTimeRemaining === null || restTimeRemaining <= 0) return;
    const timer = setInterval(() => {
      setRestTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, ctx.currentTime);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
          } catch (e) {
            // Audio context policy
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [restTimeRemaining]);

  const startRestTimer = (seconds: number) => {
    setTotalRestSeconds(seconds);
    setRestTimeRemaining(seconds);
  };

  const daysOfWeek = [
    { label: 'Seg', full: 'Segunda-feira', index: 0 },
    { label: 'Ter', full: 'Terça-feira', index: 1 },
    { label: 'Qua', full: 'Quarta-feira', index: 2 },
    { label: 'Qui', full: 'Quinta-feira', index: 3 },
    { label: 'Sex', full: 'Sexta-feira', index: 4 },
    { label: 'Sáb', full: 'Sábado', index: 5 },
    { label: 'Dom', full: 'Domingo', index: 6 },
  ];

  if (!displayedPlan) {
    return (
      <div className="p-8 text-center bg-neutral-900 border border-neutral-800 rounded-3xl">
        <Dumbbell className="w-12 h-12 text-amber-500 mx-auto mb-3 opacity-60" />
        <h3 className="text-lg font-bold text-white">Nenhum Plano de Treino Ativo</h3>
        <p className="text-sm text-neutral-400 mt-1">O Coach Sérgio Cunha irá atribuir a tua rotina semanal em breve.</p>
      </div>
    );
  }

  const currentDayWorkout: DayWorkout | undefined = displayedPlan.days.find(
    d => d.dayIndex === selectedDayIndex
  ) || displayedPlan.days[0];

  const handleSetToggle = (exercise: DayExercise, set: WorkoutSet, index: number, loggedWeight?: number) => {
    const isCompleted = !set.completed;
    const finalWeight = loggedWeight !== undefined ? loggedWeight : (set.loggedWeightKg || set.targetWeightKg || 0);

    logExerciseSet({
      workoutPlanId: displayedPlan.id,
      exerciseId: exercise.exerciseId,
      exerciseName: exercise.exerciseName,
      dayOfWeek: currentDayWorkout.dayOfWeek,
      date: new Date().toISOString().split('T')[0],
      setNumber: set.setNumber,
      reps: set.loggedReps || set.reps,
      weightKg: finalWeight,
      completed: isCompleted,
    });

    if (isCompleted) {
      startRestTimer(set.restSeconds || 90);
    }
  };

  const handleCompleteWorkout = () => {
    setCompletedWorkoutToday(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Helper for YouTube embed
  const getEmbedUrl = (url?: string) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  return (
    <div className="space-y-6">
      
      {/* Plan Header */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                Plano da Semana {displayedPlan.weekNumber || 1}
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                {displayedPlan.weekStartDate} até {displayedPlan.weekEndDate}
              </span>
              
              {/* Optional previous week toggle if available */}
              {previousWorkoutPlan && (
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => setViewingPreviousWeek(false)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition ${
                      !viewingPreviousWeek 
                        ? 'bg-amber-500 text-black' 
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    Semana Atual ({activeWorkoutPlan?.weekNumber || 1})
                  </button>
                  <button
                    onClick={() => setViewingPreviousWeek(true)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition ${
                      viewingPreviousWeek 
                        ? 'bg-amber-500 text-black' 
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    Semana Anterior
                  </button>
                </div>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {displayedPlan.title}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-2xl leading-relaxed">
              {displayedPlan.notes}
            </p>
          </div>

          <div className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-4 shrink-0 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-neutral-400">Prescrito por</div>
              <div className="text-sm font-bold text-white">Coach Sérgio Cunha</div>
            </div>
          </div>
        </div>
      </div>

      {/* SUNDAY TRANSITION & CYCLE STATUS BANNER */}
      {selectedDayIndex === 6 ? (
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <span>Domingo • Último Dia da Semana {displayedPlan.weekNumber || 1}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Rotina em Aberto
                </span>
              </div>
              <p className="text-neutral-300 mt-0.5 leading-relaxed">
                Ainda não acabaste o teu último treino? Fica tranquilo: todas as séries continuam ativas para poderes registar as cargas até ao final do dia. A nova semana só será exibida após o Coach Sérgio Cunha confirmar o reset de domingo.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2 bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800 font-mono text-[11px] text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Semana {displayedPlan.weekNumber || 1} em Conclusão</span>
          </div>
        </div>
      ) : (displayedPlan.weekNumber && displayedPlan.weekNumber > 1) ? (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-2xl p-3.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Semana {displayedPlan.weekNumber} Ativa!</strong> As tuas séries foram reiniciadas pelo Coach Sérgio Cunha com novo ciclo de cargas.
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-200">
            Novo Ciclo
          </span>
        </div>
      ) : null}

      {completedWorkoutToday && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Sessão Concluída com Sucesso! 🔥</strong> Treino registado. O Coach Sérgio Cunha está a avaliar as tuas cargas para o próximo ciclo de domingo.
            </span>
          </div>
        </div>
      )}

      {/* Week Day Pills Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {daysOfWeek.map((day) => {
          const isSelected = selectedDayIndex === day.index;
          const dayPlan = displayedPlan.days.find(d => d.dayIndex === day.index);
          const isRest = dayPlan?.isRestDay;
          const hasExercises = (dayPlan?.exercises.length || 0) > 0;

          return (
            <button
              key={day.index}
              onClick={() => {
                setSelectedDayIndex(day.index);
                setCompletedWorkoutToday(false);
              }}
              className={`flex-1 min-w-[70px] sm:min-w-[100px] py-3 px-3 rounded-2xl border text-center transition-all ${
                isSelected
                  ? 'bg-amber-500 text-black border-amber-500 font-extrabold shadow-lg shadow-amber-500/15 scale-[1.02]'
                  : 'bg-neutral-900/80 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:text-white'
              }`}
            >
              <div className="text-xs uppercase tracking-wider">{day.label}</div>
              <div className="text-sm font-bold mt-0.5">
                {isRest ? 'Descanso' : hasExercises ? `${dayPlan?.exercises.length} ex.` : 'Ativo'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Workout Container */}
      {currentDayWorkout?.isRestDay ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-10 text-center max-w-xl mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">{currentDayWorkout.name}</h3>
          <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
            Dia programado pelo Coach para recuperação neuromuscular, síntese proteica e hidratação. Aproveita para caminhar 30 a 45 minutos (Zona 2) ou fazer mobilidade articular suave.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Day Title bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
            <div>
              <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
                {currentDayWorkout?.dayOfWeek} • {currentDayWorkout?.focusArea}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {currentDayWorkout?.name}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-400">
                {currentDayWorkout?.exercises.length} exercícios programados
              </span>
              <button
                onClick={handleCompleteWorkout}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  completedWorkoutToday
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {completedWorkoutToday ? 'Treino Concluído! 🔥' : 'Finalizar Sessão'}
              </button>
            </div>
          </div>

          {/* Exercises List */}
          <div className="space-y-4">
            {currentDayWorkout?.exercises.map((exercise, exIdx) => {
              const allSetsCompleted = exercise.sets.every(s => s.completed);

              return (
                <div
                  key={exercise.exerciseId + exIdx}
                  className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700/80 rounded-2xl p-5 transition-all shadow-md"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                    
                    {/* Exercise Info */}
                    <div className="flex items-start gap-4">
                      {exercise.imageUrl && (
                        <img
                          src={exercise.imageUrl}
                          alt={exercise.exerciseName}
                          className="w-16 h-16 rounded-xl object-cover ring-1 ring-neutral-700 shrink-0 hidden sm:block"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-neutral-800 text-amber-400 text-xs font-mono font-bold flex items-center justify-center">
                            {exIdx + 1}
                          </span>
                          <h3 className="font-bold text-base text-white">
                            {exercise.exerciseName}
                          </h3>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1">
                          Grupo Muscular: <span className="text-neutral-200">{exercise.muscleGroup || 'Peitoral / Tronco'}</span>
                        </p>
                        {exercise.notes && (
                          <div className="mt-1 text-xs text-amber-400/90 flex items-center gap-1.5 font-medium">
                            <Info className="w-3.5 h-3.5 shrink-0" />
                            <span>Nota do Coach: {exercise.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* View Technique & Video Button */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedExerciseForModal(exercise)}
                        className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <Play className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>Ver Vídeo Demonstrativo & Execução</span>
                      </button>
                    </div>
                  </div>

                  {/* Series and Load Logging Table */}
                  <div className="bg-neutral-950/60 rounded-xl p-3 border border-neutral-800/80">
                    <div className="grid grid-cols-12 gap-2 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider pb-2 border-b border-neutral-800 px-2">
                      <div className="col-span-2 sm:col-span-1 text-center">Série</div>
                      <div className="col-span-3 sm:col-span-2">Reps Alvo</div>
                      <div className="col-span-3 sm:col-span-3">Carga Prescrita</div>
                      <div className="col-span-4 sm:col-span-4">Carga Usada (Registo)</div>
                      <div className="hidden sm:block sm:col-span-2 text-right">Ação</div>
                    </div>

                    <div className="divide-y divide-neutral-900 mt-1">
                      {exercise.sets.map((set, sIdx) => {
                        return (
                          <div
                            key={sIdx}
                            className={`grid grid-cols-12 gap-2 items-center py-2 px-2 text-xs rounded-lg transition ${
                              set.completed ? 'bg-amber-500/5' : ''
                            }`}
                          >
                            {/* Set # */}
                            <div className="col-span-2 sm:col-span-1 text-center font-mono font-bold text-neutral-300">
                              #{set.setNumber}
                            </div>

                            {/* Reps */}
                            <div className="col-span-3 sm:col-span-2 font-mono text-white">
                              {set.reps} reps
                            </div>

                            {/* Target Weight and Rest badge */}
                            <div className="col-span-3 sm:col-span-3 flex items-center gap-1.5 text-neutral-300 flex-wrap">
                              <span>{set.targetWeightKg ? `${set.targetWeightKg} kg` : 'Carga livre'}</span>
                              <button
                                type="button"
                                onClick={() => startRestTimer(set.restSeconds || 90)}
                                className="text-[10px] text-neutral-500 hover:text-amber-400 font-mono flex items-center gap-1 px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 transition"
                                title="Iniciar cronómetro de descanso para esta série"
                              >
                                <Clock className="w-2.5 h-2.5 text-amber-500" />
                                <span>{set.restSeconds || 90}s</span>
                              </button>
                            </div>

                            {/* User Logged Weight Field */}
                            <div className="col-span-4 sm:col-span-4 flex items-center gap-2">
                              <input
                                type="number"
                                placeholder={set.targetWeightKg ? `${set.targetWeightKg}` : '0'}
                                defaultValue={set.loggedWeightKg || ''}
                                onBlur={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val)) {
                                    handleSetToggle(exercise, set, sIdx, val);
                                  }
                                }}
                                className="w-16 sm:w-20 px-2 py-1 rounded bg-neutral-900 border border-neutral-700 text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                              />
                              <span className="text-[11px] text-neutral-400">kg</span>
                            </div>

                            {/* Complete Checkbox */}
                            <div className="col-span-12 sm:col-span-2 flex justify-end mt-1 sm:mt-0">
                              <button
                                onClick={() => handleSetToggle(exercise, set, sIdx)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                                  set.completed
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                    : 'bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700'
                                }`}
                              >
                                {set.completed ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Feita</span>
                                  </>
                                ) : (
                                  <>
                                    <Circle className="w-3.5 h-3.5" />
                                    <span>Concluir</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Floating Rest Timer Bar */}
      {restTimeRemaining !== null && (
        <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-neutral-900/95 backdrop-blur-md border border-amber-500/50 rounded-2xl p-3 shadow-2xl flex items-center gap-3 text-xs min-w-[290px] sm:min-w-[360px] animate-in fade-in slide-in-from-bottom-4">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-black flex items-center justify-center font-bold shrink-0">
            <Clock className="w-4 h-4 animate-spin" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-white truncate">Descanso entre Séries</span>
              <span className="font-mono font-bold text-amber-400 text-sm">
                {Math.floor(restTimeRemaining / 60).toString().padStart(2, '0')}:{(restTimeRemaining % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <div className="w-full bg-neutral-800 rounded-full h-1.5 mt-1 overflow-hidden">
              <div 
                className="bg-amber-500 h-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (restTimeRemaining / (totalRestSeconds || 1)) * 100)}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setRestTimeRemaining(prev => (prev || 0) + 30)}
              className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[10px] font-mono text-neutral-300"
              title="Adicionar 30 segundos"
            >
              +30s
            </button>
            <button
              type="button"
              onClick={() => setRestTimeRemaining(null)}
              className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
              title="Parar / Fechar Cronómetro"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Exercise Modal with Technique Video & Instructions */}
      {selectedExerciseForModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
                  Técnica de Execução & Vídeo
                </span>
                <h3 className="text-xl font-bold text-white">
                  {selectedExerciseForModal.exerciseName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedExerciseForModal(null)}
                className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto py-4 space-y-4">
              
              {/* Video Player or Embed */}
              {selectedExerciseForModal.videoUrl ? (
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-neutral-800">
                  {getEmbedUrl(selectedExerciseForModal.videoUrl)?.includes('embed') ? (
                    <iframe
                      src={getEmbedUrl(selectedExerciseForModal.videoUrl) || ''}
                      title={selectedExerciseForModal.exerciseName}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={selectedExerciseForModal.videoUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              ) : selectedExerciseForModal.imageUrl ? (
                <img
                  src={selectedExerciseForModal.imageUrl}
                  alt={selectedExerciseForModal.exerciseName}
                  className="w-full max-h-72 object-cover rounded-2xl border border-neutral-800"
                />
              ) : null}

              {/* Coach execution instructions */}
              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                <h4 className="font-bold text-sm text-white mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Instruções & Dicas Posturais do Coach Sérgio Cunha
                </h4>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {selectedExerciseForModal.notes || 'Executa o movimento com cadência controlada (3 segundos na fase excêntrica). Mantém a estabilidade articular e evita compensações com a lombar.'}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setSelectedExerciseForModal(null)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs"
              >
                Entendido, Continuar Treino
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
