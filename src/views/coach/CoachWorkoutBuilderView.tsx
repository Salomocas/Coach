import React, { useState } from 'react';
import { 
  CalendarPlus, 
  Dumbbell, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle2, 
  Sparkles, 
  Play, 
  Users, 
  ChevronRight,
  Clock,
  Send,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { WorkoutPlan, DayWorkout, DayExercise, WorkoutSet, Exercise } from '../../types';

export const CoachWorkoutBuilderView: React.FC = () => {
  const { allClients } = useAuth();
  const { exercises, saveWorkoutPlan, workoutPlans, activeWorkoutPlan, selectedAthleteId, setSelectedAthleteId } = useData();

  const [selectedClientId, setSelectedClientId] = useState<string>(selectedAthleteId || allClients[0]?.uid || 'client-ricardo-silva');
  const [planTitle, setPlanTitle] = useState('Mesociclo de Hipertrofia & Força Funcional');
  const [weekStart, setWeekStart] = useState('2026-10-05');
  const [weekEnd, setWeekEnd] = useState('2026-10-11');
  const [planNotes, setPlanNotes] = useState('Foco na progressão de carga e cadência controlada (3s na descida). Descanso de 90 a 120s entre séries nos exercícios compostos.');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  
  // Exercise picker modal
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [publishedNotice, setPublishedNotice] = useState(false);

  // Initialize draft days from active plan or default
  const [days, setDays] = useState<DayWorkout[]>(activeWorkoutPlan?.days || [
    { dayOfWeek: 'Segunda-feira', dayIndex: 0, name: 'Treino A - Peito e Tríceps', isRestDay: false, focusArea: 'Peitoral & Tríceps', exercises: [] },
    { dayOfWeek: 'Terça-feira', dayIndex: 1, name: 'Treino B - Costas e Bíceps', isRestDay: false, focusArea: 'Dorsal & Bíceps', exercises: [] },
    { dayOfWeek: 'Quarta-feira', dayIndex: 2, name: 'Descanso Ativo', isRestDay: true, focusArea: 'Recuperação', exercises: [] },
    { dayOfWeek: 'Quinta-feira', dayIndex: 3, name: 'Treino C - Pernas', isRestDay: false, focusArea: 'Quadríceps & Glúteos', exercises: [] },
    { dayOfWeek: 'Sexta-feira', dayIndex: 4, name: 'Treino D - Ombros e Core', isRestDay: false, focusArea: 'Deltoides & Abdómen', exercises: [] },
    { dayOfWeek: 'Sábado', dayIndex: 5, name: 'Cardio & Mobilidade', isRestDay: false, focusArea: 'Condicionamento', exercises: [] },
    { dayOfWeek: 'Domingo', dayIndex: 6, name: 'Descanso Total', isRestDay: true, focusArea: 'Recuperação', exercises: [] },
  ]);

  // Sync when selected athlete changes
  React.useEffect(() => {
    if (selectedAthleteId && selectedAthleteId !== selectedClientId) {
      setSelectedClientId(selectedAthleteId);
    }
  }, [selectedAthleteId]);

  // Load client's plan into the builder when client selection changes
  React.useEffect(() => {
    const plan = workoutPlans.find(p => p.clientId === selectedClientId && p.status === 'active') || workoutPlans.find(p => p.clientId === selectedClientId);
    if (plan) {
      setPlanTitle(plan.title);
      setWeekStart(plan.weekStartDate);
      setWeekEnd(plan.weekEndDate);
      setPlanNotes(plan.notes || '');
      if (plan.days && plan.days.length > 0) {
        setDays(JSON.parse(JSON.stringify(plan.days)));
      }
    }
  }, [selectedClientId, workoutPlans]);

  const currentDay = days[selectedDayIndex];
  const targetClient = allClients.find(c => c.uid === selectedClientId) || allClients[0];

  const handleToggleRestDay = () => {
    setDays(prev => prev.map((d, i) => i === selectedDayIndex ? { ...d, isRestDay: !d.isRestDay } : d));
  };

  const handleUpdateDayName = (name: string, focusArea: string) => {
    setDays(prev => prev.map((d, i) => i === selectedDayIndex ? { ...d, name, focusArea } : d));
  };

  // Add exercise from library into the current day
  const handleAddExerciseFromLibrary = (libExercise: Exercise) => {
    const newDayExercise: DayExercise = {
      exerciseId: libExercise.id,
      exerciseName: libExercise.name,
      videoUrl: libExercise.videoUrl,
      imageUrl: libExercise.imageUrl,
      muscleGroup: libExercise.muscleGroup,
      notes: libExercise.instructions,
      sets: [
        { setNumber: 1, reps: '10', targetWeightKg: 50, restSeconds: 90, completed: false },
        { setNumber: 2, reps: '10', targetWeightKg: 50, restSeconds: 90, completed: false },
        { setNumber: 3, reps: '8-10', targetWeightKg: 55, restSeconds: 90, completed: false },
      ]
    };

    setDays(prev => prev.map((d, i) => {
      if (i === selectedDayIndex) {
        return { ...d, exercises: [...d.exercises, newDayExercise] };
      }
      return d;
    }));

    setShowExercisePicker(false);
  };

  const handleRemoveExercise = (exIdx: number) => {
    setDays(prev => prev.map((d, i) => {
      if (i === selectedDayIndex) {
        return { ...d, exercises: d.exercises.filter((_, idx) => idx !== exIdx) };
      }
      return d;
    }));
  };

  const handleAddSet = (exIdx: number) => {
    setDays(prev => prev.map((d, i) => {
      if (i === selectedDayIndex) {
        const copyEx = [...d.exercises];
        const ex = copyEx[exIdx];
        const nextSetNum = ex.sets.length + 1;
        const lastSet = ex.sets[ex.sets.length - 1];
        ex.sets.push({
          setNumber: nextSetNum,
          reps: lastSet ? lastSet.reps : '10',
          targetWeightKg: lastSet ? lastSet.targetWeightKg : 50,
          restSeconds: lastSet ? lastSet.restSeconds : 90,
          completed: false
        });
        return { ...d, exercises: copyEx };
      }
      return d;
    }));
  };

  const handlePublishPlan = async () => {
    const newPlan: WorkoutPlan = {
      id: 'plan-' + Date.now(),
      clientId: selectedClientId,
      clientName: targetClient?.displayName || 'Atleta',
      coachId: 'coach-sergio-cunha',
      title: planTitle,
      weekStartDate: weekStart,
      weekEndDate: weekEnd,
      status: 'active',
      notes: planNotes,
      days,
      createdAt: new Date().toISOString()
    };

    await saveWorkoutPlan(newPlan);
    setPublishedNotice(true);
    confetti({ particleCount: 70, spread: 60 });
    setTimeout(() => setPublishedNotice(false), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-neutral-800">
        <div>
          <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
            Montador de Treino & Variáveis Automáticas
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Criador de Plano Semanal de Treino
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 mt-1">
            Seleciona o atleta, adiciona exercícios da biblioteca e publica com notificação instantânea.
          </p>
        </div>

        <button
          onClick={handlePublishPlan}
          className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Publicar & Notificar Aluno</span>
        </button>
      </div>

      {publishedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Plano de treino associado com sucesso a {targetClient?.displayName}! Notificação enviada.</span>
        </div>
      )}

      {/* Configuration Header Box */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block mb-1">
              Atleta Destinatário *
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => {
                setSelectedClientId(e.target.value);
                setSelectedAthleteId(e.target.value);
              }}
              className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
            >
              {allClients.map(c => (
                <option key={c.uid} value={c.uid}>
                  {c.displayName} ({c.subscriptionStatus === 'active' ? 'Ativo' : 'Pendente'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block mb-1">
              Título do Mesociclo / Rotina *
            </label>
            <input
              type="text"
              value={planTitle}
              onChange={(e) => setPlanTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block mb-1">Data Início</label>
              <input
                type="date"
                value={weekStart}
                onChange={(e) => setWeekStart(e.target.value)}
                className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block mb-1">Data Fim</label>
              <input
                type="date"
                value={weekEnd}
                onChange={(e) => setWeekEnd(e.target.value)}
                className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block mb-1">
            Instruções & Orientações Gerais do Coach
          </label>
          <textarea
            rows={2}
            value={planNotes}
            onChange={(e) => setPlanNotes(e.target.value)}
            className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Week Day Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {days.map((day, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedDayIndex(idx)}
            className={`flex-1 min-w-[70px] sm:min-w-[100px] py-3 px-3 rounded-2xl border text-center transition-all cursor-pointer ${
              selectedDayIndex === idx
                ? 'bg-amber-500 text-black border-amber-500 font-extrabold shadow-lg shadow-amber-500/15'
                : 'bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className="text-xs uppercase">{day.dayOfWeek.slice(0, 3)}</div>
            <div className="text-xs font-bold mt-0.5">
              {day.isRestDay ? 'Descanso' : `${day.exercises.length} ex.`}
            </div>
          </button>
        ))}
      </div>

      {/* Current Day Config & Exercises */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 space-y-6 shadow-sm">
        
        {/* Day Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-neutral-800">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 dark:text-neutral-400 block mb-1">
                Nome da Sessão ({currentDay.dayOfWeek})
              </label>
              <input
                type="text"
                value={currentDay.name}
                onChange={(e) => handleUpdateDayName(e.target.value, currentDay.focusArea || '')}
                className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-500 dark:text-neutral-400 block mb-1">
                Área de Foco Muscular
              </label>
              <input
                type="text"
                value={currentDay.focusArea || ''}
                onChange={(e) => handleUpdateDayName(currentDay.name, e.target.value)}
                placeholder="ex: Peito & Tríceps"
                className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleToggleRestDay}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                currentDay.isRestDay
                  ? 'bg-amber-500 text-black'
                  : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {currentDay.isRestDay ? 'Dia de Descanso Ativo' : 'Tornar Dia de Descanso'}
            </button>

            {!currentDay.isRestDay && (
              <button
                onClick={() => setShowExercisePicker(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Puxar da Biblioteca</span>
              </button>
            )}
          </div>
        </div>

        {/* Exercises in current day */}
        {currentDay.isRestDay ? (
          <div className="p-8 text-center text-slate-500 dark:text-neutral-400 text-xs">
            <Clock className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            Este dia está marcado como descanso ou recuperação ativa.
          </div>
        ) : currentDay.exercises.length === 0 ? (
          <div className="p-10 text-center border-2 border-dashed border-slate-200 dark:border-neutral-800 rounded-2xl">
            <Dumbbell className="w-8 h-8 text-slate-300 dark:text-neutral-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-neutral-300">Nenhum exercício adicionado a este dia</p>
            <p className="text-xs text-slate-400 dark:text-neutral-500 mt-1">Clica no botão "Puxar da Biblioteca" acima para adicionar exercícios com vídeo automático.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentDay.exercises.map((ex, exIdx) => (
              <div
                key={exIdx}
                className="bg-slate-50/80 dark:bg-neutral-950/70 border border-slate-200 dark:border-neutral-800 rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-neutral-800 text-amber-600 dark:text-amber-400 text-xs font-bold font-mono flex items-center justify-center">
                      {exIdx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{ex.exerciseName}</h4>
                      <span className="text-[10px] text-slate-500 dark:text-neutral-400">{ex.muscleGroup}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveExercise(exIdx)}
                    className="p-1.5 rounded-lg bg-slate-200 dark:bg-neutral-800 hover:bg-red-500/20 text-slate-500 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition cursor-pointer"
                    title="Remover Exercício"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Sets configuration row */}
                <div className="bg-white dark:bg-neutral-900/60 rounded-xl p-3 border border-slate-200 dark:border-neutral-800">
                  <div className="grid grid-cols-4 gap-2 text-[10px] uppercase font-bold text-slate-400 dark:text-neutral-500 pb-1.5 border-b border-slate-200 dark:border-neutral-800">
                    <div>Série</div>
                    <div>Repetições</div>
                    <div>Carga Alvo (kg)</div>
                    <div>Descanso (s)</div>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-neutral-800/60 mt-1">
                    {ex.sets.map((set, sIdx) => (
                      <div key={sIdx} className="grid grid-cols-4 gap-2 items-center py-1.5 text-xs">
                        <span className="font-mono font-bold text-slate-700 dark:text-neutral-300">#{set.setNumber}</span>
                        <input
                          type="text"
                          value={set.reps}
                          onChange={(e) => {
                            const val = e.target.value;
                            setDays(prev => prev.map((d, i) => {
                              if (i === selectedDayIndex) {
                                const copy = [...d.exercises];
                                copy[exIdx].sets[sIdx].reps = val;
                                return { ...d, exercises: copy };
                              }
                              return d;
                            }));
                          }}
                          className="w-16 px-2 py-0.5 rounded bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                        />
                        <input
                          type="number"
                          value={set.targetWeightKg || ''}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setDays(prev => prev.map((d, i) => {
                              if (i === selectedDayIndex) {
                                const copy = [...d.exercises];
                                copy[exIdx].sets[sIdx].targetWeightKg = isNaN(val) ? 0 : val;
                                return { ...d, exercises: copy };
                              }
                              return d;
                            }));
                          }}
                          className="w-16 px-2 py-0.5 rounded bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                        />
                        <input
                          type="number"
                          value={set.restSeconds || 90}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setDays(prev => prev.map((d, i) => {
                              if (i === selectedDayIndex) {
                                const copy = [...d.exercises];
                                copy[exIdx].sets[sIdx].restSeconds = isNaN(val) ? 90 : val;
                                return { ...d, exercises: copy };
                              }
                              return d;
                            }));
                          }}
                          className="w-16 px-2 py-0.5 rounded bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleAddSet(exIdx)}
                    className="mt-2 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Adicionar Série</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Modal: Exercise Library Selector (Variables) */}
      {showExercisePicker && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-neutral-800">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Selecionar da Biblioteca de Exercícios</h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400">Puxa o exercício com vídeo e instruções automáticas</p>
              </div>
              <button
                onClick={() => setShowExercisePicker(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto py-4 space-y-2 flex-1">
              {exercises.map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => handleAddExerciseFromLibrary(ex)}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 hover:border-amber-500 cursor-pointer transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={ex.imageUrl || 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=150&q=80'}
                      alt={ex.name}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-neutral-700"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition">
                        {ex.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-neutral-400">{ex.category} • {ex.muscleGroup}</p>
                    </div>
                  </div>

                  <span className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-neutral-900 group-hover:bg-amber-500 group-hover:text-black text-slate-700 dark:text-neutral-300 text-xs font-bold transition">
                    + Inserir
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
