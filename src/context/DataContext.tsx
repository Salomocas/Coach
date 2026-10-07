import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  db, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  setDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  handleFirestoreError,
  OperationType
} from '../firebase';
import { 
  Exercise, 
  WorkoutPlan, 
  WorkoutLogEntry, 
  NutritionPlan, 
  NutritionTemplate, 
  ProgressLog, 
  Message, 
  AppNotification, 
  UserProfile,
  Meal 
} from '../types';
import { 
  INITIAL_EXERCISES, 
  INITIAL_WORKOUT_PLAN, 
  INITIAL_NUTRITION_PLAN, 
  ALL_INITIAL_WORKOUT_PLANS,
  ALL_INITIAL_NUTRITION_PLANS,
  INITIAL_NUTRITION_TEMPLATES, 
  INITIAL_PROGRESS_LOGS, 
  INITIAL_MESSAGES,
  INITIAL_MEAL_LIBRARY 
} from '../initialData';
import { useAuth } from './AuthContext';

interface DataContextType {
  exercises: Exercise[];
  addExercise: (exercise: Omit<Exercise, 'id' | 'createdAt'>) => Promise<void>;
  updateExercise: (id: string, exercise: Partial<Exercise>) => Promise<void>;
  deleteExercise: (id: string) => Promise<void>;

  workoutPlans: WorkoutPlan[];
  activeWorkoutPlan: WorkoutPlan | null;
  previousWorkoutPlan: WorkoutPlan | null;
  saveWorkoutPlan: (plan: WorkoutPlan) => Promise<void>;

  workoutLogs: WorkoutLogEntry[];
  logExerciseSet: (logData: {
    workoutPlanId?: string;
    exerciseId: string;
    exerciseName: string;
    dayOfWeek: string;
    date: string;
    setNumber: number;
    reps: string;
    weightKg: number;
    completed: boolean;
  }) => Promise<void>;

  nutritionPlans: NutritionPlan[];
  activeNutritionPlan: NutritionPlan | null;
  saveNutritionPlan: (plan: NutritionPlan) => Promise<void>;
  nutritionTemplates: NutritionTemplate[];
  applyTemplateToClient: (templateId: string, clientId: string, clientName: string) => Promise<void>;
  mealLibrary: Meal[];
  addMealToLibrary: (meal: Meal) => Promise<void>;

  progressLogs: ProgressLog[];
  addProgressLog: (log: Omit<ProgressLog, 'id' | 'createdAt'>) => Promise<void>;

  messages: Message[];
  sendMessage: (text: string, recipientClientId?: string) => Promise<void>;
  markMessagesAsRead: (clientId: string) => Promise<void>;

  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  unreadCount: number;

  selectedAthleteId: string;
  setSelectedAthleteId: (id: string) => void;

  currentWeekNumber: number;
  startNewWeekReset: (options: {
    newWeekNumber: number;
    startDate: string;
    endDate: string;
    notes?: string;
  }) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isCoach } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>(INITIAL_EXERCISES);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>(ALL_INITIAL_WORKOUT_PLANS);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLogEntry[]>([]);
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>(ALL_INITIAL_NUTRITION_PLANS);
  const [nutritionTemplates, setNutritionTemplates] = useState<NutritionTemplate[]>(INITIAL_NUTRITION_TEMPLATES);
  const [mealLibrary, setMealLibrary] = useState<Meal[]>(INITIAL_MEAL_LIBRARY);
  const [progressLogs, setProgressLogs] = useState<ProgressLog[]>(INITIAL_PROGRESS_LOGS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      userId: 'client-ricardo-silva',
      title: 'Novo Plano de Treino Disponível',
      message: 'O Coach Sérgio Cunha publicou o teu mesociclo de treino para esta semana.',
      type: 'workout',
      read: false,
      createdAt: '2026-10-05 09:00'
    },
    {
      id: 'notif-2',
      userId: 'client-ricardo-silva',
      title: 'Ementa Alimentar Associada',
      message: 'A tua nova ementa semanal de recomposição (2350 kcal) já se encontra ativa no teu menu de nutrição.',
      type: 'nutrition',
      read: false,
      createdAt: '2026-10-05 09:05'
    }
  ]);
  const [selectedAthleteId, setSelectedAthleteId] = useState<string>('client-ricardo-silva');
  const [currentWeekNumber, setCurrentWeekNumber] = useState<number>(1);

  // Client ID currently targeted: if athlete is logged in, their own UID; if coach, the selected athlete
  const targetClientId = isCoach ? selectedAthleteId : (currentUser?.uid || 'client-ricardo-silva');

  // Exercise management
  const addExercise = async (exData: Omit<Exercise, 'id' | 'createdAt'>) => {
    const newEx: Exercise = {
      ...exData,
      id: 'ex-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setExercises(prev => [newEx, ...prev]);
    try {
      await setDoc(doc(db, 'exercises', newEx.id), newEx);
    } catch (e) {
      console.warn('Sync exercise to Firestore:', e);
    }
  };

  const updateExercise = async (id: string, exData: Partial<Exercise>) => {
    setExercises(prev => prev.map(ex => ex.id === id ? { ...ex, ...exData } : ex));
    try {
      await updateDoc(doc(db, 'exercises', id), exData);
    } catch (e) {
      console.warn('Update exercise in Firestore:', e);
    }
  };

  const deleteExercise = async (id: string) => {
    setExercises(prev => prev.filter(ex => ex.id !== id));
    try {
      await deleteDoc(doc(db, 'exercises', id));
    } catch (e) {
      console.warn('Delete exercise in Firestore:', e);
    }
  };

  // Workout plan management
  const saveWorkoutPlan = async (plan: WorkoutPlan) => {
    setWorkoutPlans(prev => {
      const exists = prev.some(p => p.id === plan.id);
      if (exists) {
        return prev.map(p => p.id === plan.id ? plan : p);
      }
      return [plan, ...prev];
    });

    // Notify client
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      userId: plan.clientId,
      title: 'Novo Plano de Treino Atualizado',
      message: `O Coach Sérgio Cunha atribuiu-te o plano: "${plan.title}".`,
      type: 'workout',
      read: false,
      createdAt: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications(prev => [newNotif, ...prev]);

    try {
      await setDoc(doc(db, 'workout_plans', plan.id), plan);
      await setDoc(doc(db, 'notifications', newNotif.id), newNotif);
    } catch (e) {
      console.warn('Save workout plan to Firestore:', e);
    }
  };

  // Log exercise set load
  const logExerciseSet = async (logData: {
    workoutPlanId?: string;
    exerciseId: string;
    exerciseName: string;
    dayOfWeek: string;
    date: string;
    setNumber: number;
    reps: string;
    weightKg: number;
    completed: boolean;
  }) => {
    const existingIndex = workoutLogs.findIndex(
      l => l.exerciseId === logData.exerciseId && l.date === logData.date
    );

    const updatedLog: WorkoutLogEntry = existingIndex >= 0 ? {
      ...workoutLogs[existingIndex],
      sets: [
        ...workoutLogs[existingIndex].sets.filter(s => s.setNumber !== logData.setNumber),
        {
          setNumber: logData.setNumber,
          reps: logData.reps,
          weightKg: logData.weightKg,
          completed: logData.completed
        }
      ].sort((a, b) => a.setNumber - b.setNumber)
    } : {
      id: 'log-' + Date.now(),
      clientId: currentUser?.uid || targetClientId,
      workoutPlanId: logData.workoutPlanId,
      exerciseId: logData.exerciseId,
      exerciseName: logData.exerciseName,
      dayOfWeek: logData.dayOfWeek,
      date: logData.date,
      sets: [{
        setNumber: logData.setNumber,
        reps: logData.reps,
        weightKg: logData.weightKg,
        completed: logData.completed
      }],
      completed: true,
      createdAt: new Date().toISOString()
    };

    setWorkoutLogs(prev => {
      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = updatedLog;
        return copy;
      }
      return [updatedLog, ...prev];
    });

    // Also update current active workout plan sets if matched
    setWorkoutPlans(prevPlans => prevPlans.map(plan => {
      return {
        ...plan,
        days: plan.days.map(day => {
          if (day.dayOfWeek === logData.dayOfWeek) {
            return {
              ...day,
              exercises: day.exercises.map(ex => {
                if (ex.exerciseId === logData.exerciseId) {
                  return {
                    ...ex,
                    sets: ex.sets.map(s => {
                      if (s.setNumber === logData.setNumber) {
                        return {
                          ...s,
                          loggedWeightKg: logData.weightKg,
                          loggedReps: logData.reps,
                          completed: logData.completed
                        };
                      }
                      return s;
                    })
                  };
                }
                return ex;
              })
            };
          }
          return day;
        })
      };
    }));

    try {
      await setDoc(doc(db, 'workout_logs', updatedLog.id), updatedLog);
    } catch (e) {
      console.warn('Save workout log to Firestore:', e);
    }
  };

  // Nutrition plan management
  const saveNutritionPlan = async (plan: NutritionPlan) => {
    setNutritionPlans(prev => {
      const exists = prev.some(p => p.id === plan.id);
      if (exists) {
        return prev.map(p => p.id === plan.id ? plan : p);
      }
      return [plan, ...prev];
    });

    // Notify client
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      userId: plan.clientId,
      title: 'Novo Plano Nutricional Atribuído',
      message: `O Coach Sérgio Cunha publicou a tua ementa: "${plan.title}".`,
      type: 'nutrition',
      read: false,
      createdAt: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications(prev => [newNotif, ...prev]);

    try {
      await setDoc(doc(db, 'nutrition_plans', plan.id), plan);
      await setDoc(doc(db, 'notifications', newNotif.id), newNotif);
    } catch (e) {
      console.warn('Save nutrition plan to Firestore:', e);
    }
  };

  const applyTemplateToClient = async (templateId: string, clientId: string, clientName: string) => {
    const template = nutritionTemplates.find(t => t.id === templateId);
    if (!template) return;

    const newPlan: NutritionPlan = {
      id: 'nutri-' + Date.now(),
      clientId,
      clientName,
      coachId: 'coach-sergio-cunha',
      title: template.title,
      weekStartDate: '2026-10-05',
      weekEndDate: '2026-10-11',
      dailyCalories: template.dailyCalories,
      days: INITIAL_NUTRITION_PLAN.days, // apply structured meal plan
      notes: `Baseado no modelo predefinido: ${template.description}`,
      createdAt: new Date().toISOString()
    };

    await saveNutritionPlan(newPlan);
  };

  const addMealToLibrary = async (meal: Meal) => {
    const newLibMeal: Meal = {
      ...meal,
      id: 'lib-meal-' + Date.now()
    };
    setMealLibrary(prev => [newLibMeal, ...prev]);
    try {
      await setDoc(doc(db, 'meal_library', newLibMeal.id), newLibMeal);
    } catch (e) {
      console.warn('Sync meal to library Firestore:', e);
    }
  };

  const startNewWeekReset = async (options: {
    newWeekNumber: number;
    startDate: string;
    endDate: string;
    notes?: string;
  }) => {
    setCurrentWeekNumber(options.newWeekNumber);

    // Update workout plans: archive current active plans and create new week active plans
    setWorkoutPlans(prev => {
      const activePlans = prev.filter(p => p.status === 'active');
      const otherPlans = prev.filter(p => p.status !== 'active');

      const archivedOldPlans: WorkoutPlan[] = activePlans.map(p => ({
        ...p,
        id: p.id + '-archived-sem-' + (p.weekNumber || 1),
        status: 'archived' as const
      }));

      const newWeekPlans: WorkoutPlan[] = activePlans.map(plan => ({
        ...plan,
        id: 'workout-' + plan.clientId + '-sem-' + options.newWeekNumber,
        weekNumber: options.newWeekNumber,
        weekStartDate: options.startDate,
        weekEndDate: options.endDate,
        notes: options.notes || plan.notes,
        status: 'active' as const,
        days: plan.days.map(d => ({
          ...d,
          exercises: d.exercises.map(ex => ({
            ...ex,
            sets: ex.sets.map(s => ({
              ...s,
              completed: false,
              targetWeightKg: s.loggedWeightKg || s.targetWeightKg,
              loggedWeightKg: undefined
            }))
          }))
        }))
      }));

      return [...newWeekPlans, ...archivedOldPlans, ...otherPlans];
    });

    // Update nutrition plans
    setNutritionPlans(prev => {
      return prev.map(np => ({
        ...np,
        weekNumber: options.newWeekNumber,
        weekStartDate: options.startDate,
        weekEndDate: options.endDate
      }));
    });

    // Notify all clients
    const notifRicardo: AppNotification = {
      id: 'notif-reset-' + Date.now(),
      userId: 'client-ricardo-silva',
      title: `🔥 Nova Semana ${options.newWeekNumber} Ativada pelo Coach!`,
      message: `O Coach Sérgio Cunha iniciou o novo ciclo semanal (${options.startDate} a ${options.endDate}). Os teus treinos e ementas foram reiniciados para a nova semana.`,
      type: 'workout',
      read: false,
      createdAt: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    };

    const notifMarta: AppNotification = {
      id: 'notif-reset-' + (Date.now() + 1),
      userId: 'client-marta-pereira',
      title: `🔥 Nova Semana ${options.newWeekNumber} Ativada pelo Coach!`,
      message: `O Coach Sérgio Cunha iniciou o novo ciclo semanal (${options.startDate} a ${options.endDate}).`,
      type: 'workout',
      read: false,
      createdAt: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    };

    setNotifications(prev => [notifRicardo, notifMarta, ...prev]);
  };

  // Progress logs
  const addProgressLog = async (logData: Omit<ProgressLog, 'id' | 'createdAt'>) => {
    const newLog: ProgressLog = {
      ...logData,
      id: 'prog-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setProgressLogs(prev => [newLog, ...prev]);
    try {
      await setDoc(doc(db, 'progress_logs', newLog.id), newLog);
    } catch (e) {
      console.warn('Save progress log to Firestore:', e);
    }
  };

  // Messages / Chat
  const sendMessage = async (text: string, recipientClientId?: string) => {
    if (!text.trim()) return;
    const clientId = isCoach ? (recipientClientId || selectedAthleteId) : (currentUser?.uid || 'client-ricardo-silva');
    const senderRole = isCoach ? 'coach' : 'client';
    const senderName = isCoach ? 'Coach Sérgio Cunha' : (currentUser?.displayName || 'Atleta');

    const newMsg: Message = {
      id: 'msg-' + Date.now(),
      clientId,
      coachId: 'coach-sergio-cunha',
      senderId: currentUser?.uid || (isCoach ? 'coach-sergio-cunha' : clientId),
      senderRole,
      senderName,
      text: text.trim(),
      read: false,
      createdAt: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);

    // Send notification to recipient
    const recipientUserId = isCoach ? clientId : 'coach-sergio-cunha';
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      userId: recipientUserId,
      title: isCoach ? 'Nova Mensagem do Treinador Sérgio Cunha' : `Nova Mensagem de ${senderName}`,
      message: text.slice(0, 100),
      type: 'chat',
      read: false,
      createdAt: newMsg.createdAt
    };
    setNotifications(prev => [newNotif, ...prev]);

    try {
      await setDoc(doc(db, 'messages', newMsg.id), newMsg);
      await setDoc(doc(db, 'notifications', newNotif.id), newNotif);
    } catch (e) {
      console.warn('Save message to Firestore:', e);
    }
  };

  const markMessagesAsRead = async (clientId: string) => {
    setMessages(prev => prev.map(m => m.clientId === clientId ? { ...m, read: true } : m));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const activeWorkoutPlan = workoutPlans.find(
    p => p.clientId === targetClientId && p.status === 'active'
  ) || workoutPlans.find(p => p.clientId === targetClientId) || workoutPlans[0] || null;

  const previousWorkoutPlan = workoutPlans.find(
    p => p.clientId === targetClientId && p.status === 'archived'
  ) || null;

  const activeNutritionPlan = nutritionPlans.find(
    p => p.clientId === targetClientId
  ) || nutritionPlans[0] || null;

  const myNotifications = notifications.filter(
    n => isCoach ? true : n.userId === (currentUser?.uid || 'client-ricardo-silva')
  );
  const unreadCount = myNotifications.filter(n => !n.read).length;

  return (
    <DataContext.Provider value={{
      exercises,
      addExercise,
      updateExercise,
      deleteExercise,
      workoutPlans,
      activeWorkoutPlan,
      previousWorkoutPlan,
      saveWorkoutPlan,
      workoutLogs,
      logExerciseSet,
      nutritionPlans,
      activeNutritionPlan,
      saveNutritionPlan,
      nutritionTemplates,
      applyTemplateToClient,
      mealLibrary,
      addMealToLibrary,
      progressLogs: progressLogs.filter(p => isCoach ? (p.clientId === selectedAthleteId) : (p.clientId === (currentUser?.uid || 'client-ricardo-silva'))),
      addProgressLog,
      messages,
      sendMessage,
      markMessagesAsRead,
      notifications: myNotifications,
      markNotificationAsRead,
      unreadCount,
      selectedAthleteId,
      setSelectedAthleteId,
      currentWeekNumber,
      startNewWeekReset,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
