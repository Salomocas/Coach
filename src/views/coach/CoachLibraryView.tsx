import React, { useState } from 'react';
import { 
  Dumbbell, 
  UtensilsCrossed, 
  Plus, 
  Search, 
  Filter, 
  Play, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Calendar, 
  Clock, 
  AlertCircle, 
  Video, 
  Image as ImageIcon, 
  X, 
  GripVertical, 
  Flame, 
  Check, 
  ArrowRight,
  Info,
  ChevronDown
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { 
  Exercise, 
  DailyWorkoutTemplate, 
  WeeklyWorkoutTemplate, 
  Meal, 
  DailyMealTemplate, 
  WeeklyMealTemplate,
  DayExercise 
} from '../../types';

export const CoachLibraryView: React.FC = () => {
  const { 
    exercises, 
    addExercise, 
    updateExercise, 
    deleteExercise,
    dailyWorkoutTemplates,
    addDailyWorkoutTemplate,
    updateDailyWorkoutTemplate,
    deleteDailyWorkoutTemplate,
    weeklyWorkoutTemplates,
    addWeeklyWorkoutTemplate,
    updateWeeklyWorkoutTemplate,
    deleteWeeklyWorkoutTemplate,
    mealLibrary,
    addMealToLibrary,
    updateMealInLibrary,
    deleteMealFromLibrary,
    dailyMealTemplates,
    addDailyMealTemplate,
    updateDailyMealTemplate,
    deleteDailyMealTemplate,
    weeklyMealTemplates,
    addWeeklyMealTemplate,
    updateWeeklyMealTemplate,
    deleteWeeklyMealTemplate
  } = useData();

  // Main Tab: 'workouts' (Exercícios e Treinos) vs 'nutrition' (Ementas e Nutrição)
  const [mainTab, setMainTab] = useState<'workouts' | 'nutrition'>('workouts');

  // Sub-tier for Workouts: 1 = singular, 2 = daily, 3 = weekly
  const [workoutTier, setWorkoutTier] = useState<'singular' | 'daily' | 'weekly'>('singular');

  // Sub-tier for Nutrition: 1 = singular, 2 = daily, 3 = weekly
  const [nutritionTier, setNutritionTier] = useState<'singular' | 'daily' | 'weekly'>('singular');

  // -------------------------------------------------------------
  // STATE: 1. Treino Singular Modal
  // -------------------------------------------------------------
  const [showSingularModal, setShowSingularModal] = useState(false);
  const [editingSingularId, setEditingSingularId] = useState<string | null>(null);
  const [singularName, setSingularName] = useState('');
  const [singularCategory, setSingularCategory] = useState<Exercise['category']>('Peito');
  const [singularMuscleGroup, setSingularMuscleGroup] = useState('');
  const [singularSets, setSingularSets] = useState<number | ''>('');
  const [singularReps, setSingularReps] = useState('');
  const [singularIsFailure, setSingularIsFailure] = useState(false);
  const [singularDuration, setSingularDuration] = useState<number | ''>('');
  const [singularRest, setSingularRest] = useState<number | ''>(90);
  const [singularVideoUrl, setSingularVideoUrl] = useState('');
  const [singularImageUrl, setSingularImageUrl] = useState('');
  const [singularInstructions, setSingularInstructions] = useState('');
  const [singularError, setSingularError] = useState<string | null>(null);

  // Search & Filter in Singular Workouts
  const [singularSearch, setSingularSearch] = useState('');
  const [singularFilterCat, setSingularFilterCat] = useState<string>('Todos');

  // -------------------------------------------------------------
  // STATE: 2. Treino Diário Builder & Modal
  // -------------------------------------------------------------
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [editingDailyId, setEditingDailyId] = useState<string | null>(null);
  const [dailyName, setDailyName] = useState('');
  const [dailyFocusArea, setDailyFocusArea] = useState('');
  const [dailySelectedExercises, setDailySelectedExercises] = useState<DayExercise[]>([]);
  const [dailyPickerSearch, setDailyPickerSearch] = useState('');

  // -------------------------------------------------------------
  // STATE: 3. Treino Semanal Builder & Modal
  // -------------------------------------------------------------
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);
  const [editingWeeklyId, setEditingWeeklyId] = useState<string | null>(null);
  const [weeklyName, setWeeklyName] = useState('');
  const [weeklyDesc, setWeeklyDesc] = useState('');
  const dayNames: ('Segunda-feira' | 'Terça-feira' | 'Quarta-feira' | 'Quinta-feira' | 'Sexta-feira' | 'Sábado' | 'Domingo')[] = [
    'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'
  ];
  const [weeklyDays, setWeeklyDays] = useState<{
    dayOfWeek: 'Segunda-feira' | 'Terça-feira' | 'Quarta-feira' | 'Quinta-feira' | 'Sexta-feira' | 'Sábado' | 'Domingo';
    dayIndex: number;
    dailyWorkoutId?: string;
    dailyWorkoutName?: string;
    isRestDay: boolean;
    exercises: DayExercise[];
  }[]>([
    { dayOfWeek: 'Segunda-feira', dayIndex: 0, isRestDay: false, exercises: [] },
    { dayOfWeek: 'Terça-feira', dayIndex: 1, isRestDay: false, exercises: [] },
    { dayOfWeek: 'Quarta-feira', dayIndex: 2, isRestDay: true, exercises: [] },
    { dayOfWeek: 'Quinta-feira', dayIndex: 3, isRestDay: false, exercises: [] },
    { dayOfWeek: 'Sexta-feira', dayIndex: 4, isRestDay: false, exercises: [] },
    { dayOfWeek: 'Sábado', dayIndex: 5, isRestDay: true, exercises: [] },
    { dayOfWeek: 'Domingo', dayIndex: 6, isRestDay: true, exercises: [] }
  ]);

  // -------------------------------------------------------------
  // STATE: 4. Refeição Singular Modal
  // -------------------------------------------------------------
  const [showMealModal, setShowMealModal] = useState(false);
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const [mealName, setMealName] = useState('');
  const [mealTime, setMealTime] = useState('12:30');
  const [mealCategory, setMealCategory] = useState<Meal['category']>('Almoço');
  const [mealCalories, setMealCalories] = useState<number>(550);
  const [mealProtein, setMealProtein] = useState<number>(45);
  const [mealCarbs, setMealCarbs] = useState<number>(60);
  const [mealFat, setMealFat] = useState<number>(14);
  const [mealFoodsText, setMealFoodsText] = useState('150g Frango grelhado\n150g Arroz basmati\n100g Brócolos cozidos');
  const [mealDescription, setMealDescription] = useState('');

  // -------------------------------------------------------------
  // STATE: 5. Ementa Diária Builder & Modal
  // -------------------------------------------------------------
  const [showDailyMealModal, setShowDailyMealModal] = useState(false);
  const [editingDailyMealId, setEditingDailyMealId] = useState<string | null>(null);
  const [dailyMealName, setDailyMealName] = useState('');
  const [dailyMealNotes, setDailyMealNotes] = useState('');
  const [dailyMealSelectedMeals, setDailyMealSelectedMeals] = useState<Meal[]>([]);

  // -------------------------------------------------------------
  // STATE: 6. Ementa Semanal Builder & Modal
  // -------------------------------------------------------------
  const [showWeeklyMealModal, setShowWeeklyMealModal] = useState(false);
  const [editingWeeklyMealId, setEditingWeeklyMealId] = useState<string | null>(null);
  const [weeklyMealName, setWeeklyMealName] = useState('');
  const [weeklyMealDesc, setWeeklyMealDesc] = useState('');
  const [weeklyMealDays, setWeeklyMealDays] = useState<{
    dayOfWeek: 'Segunda-feira' | 'Terça-feira' | 'Quarta-feira' | 'Quinta-feira' | 'Sexta-feira' | 'Sábado' | 'Domingo';
    dayIndex: number;
    dailyMealId?: string;
    dailyMealName?: string;
    meals: Meal[];
    totalCalories: number;
  }[]>([
    { dayOfWeek: 'Segunda-feira', dayIndex: 0, meals: [], totalCalories: 0 },
    { dayOfWeek: 'Terça-feira', dayIndex: 1, meals: [], totalCalories: 0 },
    { dayOfWeek: 'Quarta-feira', dayIndex: 2, meals: [], totalCalories: 0 },
    { dayOfWeek: 'Quinta-feira', dayIndex: 3, meals: [], totalCalories: 0 },
    { dayOfWeek: 'Sexta-feira', dayIndex: 4, meals: [], totalCalories: 0 },
    { dayOfWeek: 'Sábado', dayIndex: 5, meals: [], totalCalories: 0 },
    { dayOfWeek: 'Domingo', dayIndex: 6, meals: [], totalCalories: 0 }
  ]);

  // Helper notice
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const triggerNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  // -------------------------------------------------------------
  // HANDLERS: Singular Workout (Unidade de Treino)
  // -------------------------------------------------------------
  const handleOpenCreateSingular = () => {
    setEditingSingularId(null);
    setSingularName('');
    setSingularCategory('Peito');
    setSingularMuscleGroup('');
    setSingularSets('');
    setSingularReps('');
    setSingularIsFailure(false);
    setSingularDuration('');
    setSingularRest(90);
    setSingularVideoUrl('');
    setSingularImageUrl('');
    setSingularInstructions('');
    setSingularError(null);
    setShowSingularModal(true);
  };

  const handleOpenEditSingular = (ex: Exercise) => {
    setEditingSingularId(ex.id);
    setSingularName(ex.name);
    setSingularCategory(ex.category);
    setSingularMuscleGroup(ex.muscleGroup);
    setSingularSets(ex.setsCount || '');
    setSingularReps(ex.reps || '');
    setSingularIsFailure(!!ex.isToFailure);
    setSingularDuration(ex.durationSeconds || '');
    setSingularRest(ex.restSeconds || 90);
    setSingularVideoUrl(ex.videoUrl || '');
    setSingularImageUrl(ex.imageUrl || '');
    setSingularInstructions(ex.instructions || '');
    setSingularError(null);
    setShowSingularModal(true);
  };

  const handleSaveSingular = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singularName.trim()) {
      setSingularError('Por favor insere o nome do treino/exercício.');
      return;
    }

    // MANDATORY CONSTRAINT: "Ainda nessa janela de criaçao ha opçao de linkar um video demonstrativo e uma imagem (opcional), mas um dos dois tem que se colocar."
    if (!singularVideoUrl.trim() && !singularImageUrl.trim()) {
      setSingularError('É obrigatório colocar pelo menos um link de vídeo demonstrativo OU uma imagem!');
      return;
    }

    setSingularError(null);

    const payload = {
      coachId: 'coach-sergio-cunha',
      name: singularName.trim(),
      category: singularCategory,
      muscleGroup: singularMuscleGroup.trim() || 'Geral',
      setsCount: singularSets ? Number(singularSets) : undefined,
      reps: singularReps.trim() || (singularIsFailure ? 'Até à falha' : undefined),
      isToFailure: singularIsFailure,
      durationSeconds: singularDuration ? Number(singularDuration) : undefined,
      restSeconds: singularRest ? Number(singularRest) : undefined,
      videoUrl: singularVideoUrl.trim() || undefined,
      imageUrl: singularImageUrl.trim() || undefined,
      instructions: singularInstructions.trim() || 'Execução estrita com cadência controlada.',
      equipment: 'Livre / Máquina'
    };

    if (editingSingularId) {
      await updateExercise(editingSingularId, payload);
      triggerNotice(`Treino singular "${singularName}" atualizado com sucesso!`);
    } else {
      await addExercise(payload);
      triggerNotice(`Treino singular "${singularName}" adicionado à biblioteca!`);
    }

    setShowSingularModal(false);
  };

  // -------------------------------------------------------------
  // HANDLERS: Treino Diário (Conjunto de treinos singulares por ordem)
  // -------------------------------------------------------------
  const handleOpenCreateDaily = () => {
    setEditingDailyId(null);
    setDailyName('');
    setDailyFocusArea('');
    setDailySelectedExercises([]);
    setDailyPickerSearch('');
    setShowDailyModal(true);
  };

  const handleOpenEditDaily = (tmpl: DailyWorkoutTemplate) => {
    setEditingDailyId(tmpl.id);
    setDailyName(tmpl.name);
    setDailyFocusArea(tmpl.focusArea || '');
    setDailySelectedExercises(JSON.parse(JSON.stringify(tmpl.exercises)));
    setDailyPickerSearch('');
    setShowDailyModal(true);
  };

  const handleAddSingularToDaily = (ex: Exercise) => {
    const setsNumber = ex.setsCount || 3;
    const repsStr = ex.isToFailure ? 'Até à falha' : (ex.reps || '10-12');
    const restSec = ex.restSeconds || 90;

    const sets = Array.from({ length: setsNumber }, (_, i) => ({
      setNumber: i + 1,
      reps: repsStr,
      targetWeightKg: 50,
      restSeconds: restSec,
      completed: false
    }));

    const newDayExercise: DayExercise = {
      exerciseId: ex.id,
      exerciseName: ex.name,
      muscleGroup: ex.muscleGroup,
      videoUrl: ex.videoUrl,
      imageUrl: ex.imageUrl,
      notes: ex.instructions,
      sets
    };

    setDailySelectedExercises(prev => [...prev, newDayExercise]);
  };

  const handleRemoveFromDaily = (idx: number) => {
    setDailySelectedExercises(prev => prev.filter((_, i) => i !== idx));
  };

  const handleMoveDailyExercise = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= dailySelectedExercises.length) return;
    setDailySelectedExercises(prev => {
      const copy = [...prev];
      const [moved] = copy.splice(fromIdx, 1);
      copy.splice(toIdx, 0, moved);
      return copy;
    });
  };

  const handleSaveDaily = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dailyName.trim()) {
      alert('Por favor atribui um nome ao treino diário.');
      return;
    }
    if (dailySelectedExercises.length === 0) {
      alert('Adiciona pelo menos um treino singular da biblioteca ao teu plano diário.');
      return;
    }

    const payload = {
      coachId: 'coach-sergio-cunha',
      name: dailyName.trim(),
      focusArea: dailyFocusArea.trim() || 'Geral',
      exercises: dailySelectedExercises,
      notes: 'Plano diário estruturado na biblioteca.'
    };

    if (editingDailyId) {
      await updateDailyWorkoutTemplate(editingDailyId, payload);
      triggerNotice(`Treino diário "${dailyName}" atualizado com sucesso!`);
    } else {
      await addDailyWorkoutTemplate(payload);
      triggerNotice(`Treino diário "${dailyName}" gravado na biblioteca!`);
    }

    setShowDailyModal(false);
  };

  // -------------------------------------------------------------
  // HANDLERS: Treino Semanal (Conjunto de treinos diários por dias de semana)
  // -------------------------------------------------------------
  const handleOpenCreateWeekly = () => {
    setEditingWeeklyId(null);
    setWeeklyName('');
    setWeeklyDesc('');
    setWeeklyDays(dayNames.map((d, i) => ({
      dayOfWeek: d,
      dayIndex: i,
      isRestDay: i === 2 || i === 5 || i === 6,
      exercises: []
    })));
    setShowWeeklyModal(true);
  };

  const handleOpenEditWeekly = (tmpl: WeeklyWorkoutTemplate) => {
    setEditingWeeklyId(tmpl.id);
    setWeeklyName(tmpl.name);
    setWeeklyDesc(tmpl.description || '');
    setWeeklyDays(JSON.parse(JSON.stringify(tmpl.days)));
    setShowWeeklyModal(true);
  };

  const handleAssignDailyToWeeklyDay = (dayIndex: number, dailyId: string) => {
    const daily = dailyWorkoutTemplates.find(d => d.id === dailyId);
    if (!daily) {
      setWeeklyDays(prev => prev.map((d, i) => i === dayIndex ? {
        ...d,
        dailyWorkoutId: undefined,
        dailyWorkoutName: undefined,
        exercises: [],
        isRestDay: true
      } : d));
      return;
    }

    setWeeklyDays(prev => prev.map((d, i) => i === dayIndex ? {
      ...d,
      dailyWorkoutId: daily.id,
      dailyWorkoutName: daily.name,
      exercises: daily.exercises,
      isRestDay: false
    } : d));
  };

  const handleSaveWeekly = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weeklyName.trim()) {
      alert('Por favor atribui um nome ao treino semanal.');
      return;
    }

    const payload = {
      coachId: 'coach-sergio-cunha',
      name: weeklyName.trim(),
      description: weeklyDesc.trim() || 'Mesociclo semanal estruturado na biblioteca.',
      days: weeklyDays
    };

    if (editingWeeklyId) {
      await updateWeeklyWorkoutTemplate(editingWeeklyId, payload);
      triggerNotice(`Treino semanal "${weeklyName}" atualizado com sucesso!`);
    } else {
      await addWeeklyWorkoutTemplate(payload);
      triggerNotice(`Treino semanal "${weeklyName}" gravado na biblioteca!`);
    }

    setShowWeeklyModal(false);
  };

  // -------------------------------------------------------------
  // HANDLERS: Ementas Singulares
  // -------------------------------------------------------------
  const handleOpenCreateMeal = () => {
    setEditingMealId(null);
    setMealName('');
    setMealTime('12:30');
    setMealCategory('Almoço');
    setMealCalories(550);
    setMealProtein(45);
    setMealCarbs(60);
    setMealFat(14);
    setMealFoodsText('150g Frango grelhado\n150g Arroz basmati\n100g Brócolos cozidos');
    setMealDescription('');
    setShowMealModal(true);
  };

  const handleOpenEditMeal = (m: Meal) => {
    setEditingMealId(m.id);
    setMealName(m.name);
    setMealTime(m.time);
    setMealCategory(m.category || 'Almoço');
    setMealCalories(m.calories);
    setMealProtein(m.proteinG);
    setMealCarbs(m.carbsG);
    setMealFat(m.fatG);
    setMealFoodsText(m.foods.map(f => `${f.quantity} ${f.item}`).join('\n'));
    setMealDescription(m.description || '');
    setShowMealModal(true);
  };

  const handleSaveMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim()) {
      alert('Por favor insere o nome da refeição.');
      return;
    }

    const foods = mealFoodsText
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const parts = line.split(' ');
        if (parts.length > 1) {
          return { quantity: parts[0], item: parts.slice(1).join(' ') };
        }
        return { item: line, quantity: '1 dose' };
      });

    const mealData: Meal = {
      id: editingMealId || 'lib-meal-' + Date.now(),
      name: mealName.trim(),
      time: mealTime,
      category: mealCategory,
      calories: Number(mealCalories) || 0,
      proteinG: Number(mealProtein) || 0,
      carbsG: Number(mealCarbs) || 0,
      fatG: Number(mealFat) || 0,
      description: mealDescription.trim(),
      foods: foods.length > 0 ? foods : [{ item: mealName.trim(), quantity: '1 porção' }]
    };

    if (editingMealId) {
      await updateMealInLibrary(editingMealId, mealData);
      triggerNotice(`Refeição "${mealName}" atualizada na biblioteca!`);
    } else {
      await addMealToLibrary(mealData);
      triggerNotice(`Refeição "${mealName}" adicionada à biblioteca!`);
    }

    setShowMealModal(false);
  };

  // -------------------------------------------------------------
  // HANDLERS: Ementa Diária
  // -------------------------------------------------------------
  const handleOpenCreateDailyMeal = () => {
    setEditingDailyMealId(null);
    setDailyMealName('');
    setDailyMealNotes('');
    setDailyMealSelectedMeals([]);
    setShowDailyMealModal(true);
  };

  const handleOpenEditDailyMeal = (tmpl: DailyMealTemplate) => {
    setEditingDailyMealId(tmpl.id);
    setDailyMealName(tmpl.name);
    setDailyMealNotes(tmpl.notes || '');
    setDailyMealSelectedMeals(JSON.parse(JSON.stringify(tmpl.meals)));
    setShowDailyMealModal(true);
  };

  const handleAddMealToDaily = (m: Meal) => {
    setDailyMealSelectedMeals(prev => [...prev, { ...m, id: 'm-' + Date.now() + Math.random().toString().slice(2, 6) }]);
  };

  const handleRemoveMealFromDaily = (idx: number) => {
    setDailyMealSelectedMeals(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSaveDailyMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dailyMealName.trim()) {
      alert('Por favor insere o nome da ementa diária.');
      return;
    }
    if (dailyMealSelectedMeals.length === 0) {
      alert('Adiciona pelo menos uma refeição singular à ementa diária.');
      return;
    }

    const totalKcal = dailyMealSelectedMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
    const totalProt = dailyMealSelectedMeals.reduce((acc, m) => acc + (m.proteinG || 0), 0);
    const totalCarbs = dailyMealSelectedMeals.reduce((acc, m) => acc + (m.carbsG || 0), 0);
    const totalFat = dailyMealSelectedMeals.reduce((acc, m) => acc + (m.fatG || 0), 0);

    const payload = {
      coachId: 'coach-sergio-cunha',
      name: dailyMealName.trim(),
      meals: dailyMealSelectedMeals,
      totalCalories: totalKcal,
      totalProtein: totalProt,
      totalCarbs: totalCarbs,
      totalFat: totalFat,
      notes: dailyMealNotes.trim()
    };

    if (editingDailyMealId) {
      await updateDailyMealTemplate(editingDailyMealId, payload);
      triggerNotice(`Ementa diária "${dailyMealName}" atualizada!`);
    } else {
      await addDailyMealTemplate(payload);
      triggerNotice(`Ementa diária "${dailyMealName}" gravada na biblioteca!`);
    }

    setShowDailyMealModal(false);
  };

  // -------------------------------------------------------------
  // HANDLERS: Ementa Semanal
  // -------------------------------------------------------------
  const handleOpenCreateWeeklyMeal = () => {
    setEditingWeeklyMealId(null);
    setWeeklyMealName('');
    setWeeklyMealDesc('');
    setWeeklyMealDays(dayNames.map((d, i) => ({
      dayOfWeek: d,
      dayIndex: i,
      meals: [],
      totalCalories: 0
    })));
    setShowWeeklyMealModal(true);
  };

  const handleOpenEditWeeklyMeal = (tmpl: WeeklyMealTemplate) => {
    setEditingWeeklyMealId(tmpl.id);
    setWeeklyMealName(tmpl.name);
    setWeeklyMealDesc(tmpl.description || '');
    setWeeklyMealDays(JSON.parse(JSON.stringify(tmpl.days)));
    setShowWeeklyMealModal(true);
  };

  const handleAssignDailyMealToWeeklyDay = (dayIndex: number, dailyMealId: string) => {
    const daily = dailyMealTemplates.find(d => d.id === dailyMealId);
    if (!daily) {
      setWeeklyMealDays(prev => prev.map((d, i) => i === dayIndex ? {
        ...d,
        dailyMealId: undefined,
        dailyMealName: undefined,
        meals: [],
        totalCalories: 0
      } : d));
      return;
    }

    setWeeklyMealDays(prev => prev.map((d, i) => i === dayIndex ? {
      ...d,
      dailyMealId: daily.id,
      dailyMealName: daily.name,
      meals: daily.meals,
      totalCalories: daily.totalCalories
    } : d));
  };

  const handleSaveWeeklyMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weeklyMealName.trim()) {
      alert('Por favor insere o nome da ementa semanal.');
      return;
    }

    const payload = {
      coachId: 'coach-sergio-cunha',
      name: weeklyMealName.trim(),
      description: weeklyMealDesc.trim(),
      days: weeklyMealDays
    };

    if (editingWeeklyMealId) {
      await updateWeeklyMealTemplate(editingWeeklyMealId, payload);
      triggerNotice(`Ementa semanal "${weeklyMealName}" atualizada!`);
    } else {
      await addWeeklyMealTemplate(payload);
      triggerNotice(`Ementa semanal "${weeklyMealName}" gravada na biblioteca!`);
    }

    setShowWeeklyMealModal(false);
  };

  // Filtered singular workouts list
  const filteredSingularExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(singularSearch.toLowerCase()) ||
                          ex.muscleGroup.toLowerCase().includes(singularSearch.toLowerCase());
    const matchesCat = singularFilterCat === 'Todos' || ex.category === singularFilterCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Notification Toast */}
      {actionNotice && (
        <div className="fixed top-20 right-6 z-50 bg-amber-500 text-black px-4 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                <Layers className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Biblioteca Central
                </h1>
                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  Gerador modular de treinos e planos alimentares em 3 níveis (Singular → Diário → Semanal)
                </p>
              </div>
            </div>
          </div>

          {/* Two Main Groups Toggle */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-neutral-800 rounded-xl">
            <button
              onClick={() => setMainTab('workouts')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                mainTab === 'workouts'
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              <span>Exercícios & Treinos</span>
            </button>
            <button
              onClick={() => setMainTab('nutrition')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                mainTab === 'nutrition'
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Ementas & Nutrição</span>
            </button>
          </div>
        </div>

        {/* Sub-tiers pills */}
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-neutral-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {mainTab === 'workouts' ? (
              <>
                <button
                  onClick={() => setWorkoutTier('singular')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    workoutTier === 'singular'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                      : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:bg-slate-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] flex items-center justify-center font-black">1</span>
                  <span>Unidade de Treino (Singular)</span>
                  <span className="text-[10px] opacity-70">({exercises.length})</span>
                </button>

                <button
                  onClick={() => setWorkoutTier('daily')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    workoutTier === 'daily'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                      : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:bg-slate-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] flex items-center justify-center font-black">2</span>
                  <span>Treino Diário</span>
                  <span className="text-[10px] opacity-70">({dailyWorkoutTemplates.length})</span>
                </button>

                <button
                  onClick={() => setWorkoutTier('weekly')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    workoutTier === 'weekly'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                      : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:bg-slate-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] flex items-center justify-center font-black">3</span>
                  <span>Treino Semanal</span>
                  <span className="text-[10px] opacity-70">({weeklyWorkoutTemplates.length})</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setNutritionTier('singular')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    nutritionTier === 'singular'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                      : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:bg-slate-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-black text-[10px] flex items-center justify-center font-black">1</span>
                  <span>Refeição Singular</span>
                  <span className="text-[10px] opacity-70">({mealLibrary.length})</span>
                </button>

                <button
                  onClick={() => setNutritionTier('daily')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    nutritionTier === 'daily'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                      : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:bg-slate-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-black text-[10px] flex items-center justify-center font-black">2</span>
                  <span>Ementa Diária</span>
                  <span className="text-[10px] opacity-70">({dailyMealTemplates.length})</span>
                </button>

                <button
                  onClick={() => setNutritionTier('weekly')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    nutritionTier === 'weekly'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                      : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:bg-slate-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-black text-[10px] flex items-center justify-center font-black">3</span>
                  <span>Ementa Semanal</span>
                  <span className="text-[10px] opacity-70">({weeklyMealTemplates.length})</span>
                </button>
              </>
            )}
          </div>

          {/* Primary Action Button for current active tier */}
          <div>
            {mainTab === 'workouts' && workoutTier === 'singular' && (
              <button
                onClick={handleOpenCreateSingular}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold transition shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Criar Treino Singular</span>
              </button>
            )}

            {mainTab === 'workouts' && workoutTier === 'daily' && (
              <button
                onClick={handleOpenCreateDaily}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold transition shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Criar Treino Diário</span>
              </button>
            )}

            {mainTab === 'workouts' && workoutTier === 'weekly' && (
              <button
                onClick={handleOpenCreateWeekly}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold transition shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Criar Treino Semanal</span>
              </button>
            )}

            {mainTab === 'nutrition' && nutritionTier === 'singular' && (
              <button
                onClick={handleOpenCreateMeal}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold transition shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Criar Refeição Singular</span>
              </button>
            )}

            {mainTab === 'nutrition' && nutritionTier === 'daily' && (
              <button
                onClick={handleOpenCreateDailyMeal}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold transition shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Criar Ementa Diária</span>
              </button>
            )}

            {mainTab === 'nutrition' && nutritionTier === 'weekly' && (
              <button
                onClick={handleOpenCreateWeeklyMeal}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold transition shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Criar Ementa Semanal</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: UNIDADE DE TREINO (TREINO SINGULAR)             */}
      {/* ========================================================= */}
      {mainTab === 'workouts' && workoutTier === 'singular' && (
        <div className="space-y-4">
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar treino singular por nome ou músculo..."
                value={singularSearch}
                onChange={(e) => setSingularSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {['Todos', 'Peito', 'Costas', 'Pernas', 'Ombros', 'Braços', 'Core', 'Cardio'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSingularFilterCat(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    singularFilterCat === cat
                      ? 'bg-amber-500 text-black'
                      : 'bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Singular Workouts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSingularExercises.map((ex) => (
              <div 
                key={ex.id}
                className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group hover:border-amber-500/50 transition"
              >
                {/* Media Preview: Image or Video */}
                <div className="relative h-44 bg-neutral-950 overflow-hidden">
                  {ex.imageUrl ? (
                    <img 
                      src={ex.imageUrl} 
                      alt={ex.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-slate-500">
                      <Video className="w-10 h-10 text-amber-500 mb-1" />
                      <span className="text-[11px] font-semibold">Demonstração em Vídeo</span>
                    </div>
                  )}

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                      {ex.category}
                    </span>
                  </div>

                  {ex.videoUrl && (
                    <a
                      href={ex.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/80 hover:bg-amber-500 hover:text-black text-white text-[11px] font-bold backdrop-blur-md transition shadow-md"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Ver Vídeo</span>
                    </a>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{ex.name}</h3>
                    <p className="text-xs text-amber-500 font-semibold mt-0.5">{ex.muscleGroup}</p>
                    
                    {/* Optional metadata badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                      {ex.setsCount && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                          {ex.setsCount} Séries
                        </span>
                      )}
                      {ex.reps && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                          {ex.reps} Reps
                        </span>
                      )}
                      {ex.isToFailure && (
                        <span className="px-2 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-red-500 text-[10px] font-bold uppercase">
                          Até à Falha
                        </span>
                      )}
                      {ex.durationSeconds && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                          {ex.durationSeconds}s Tempo
                        </span>
                      )}
                      {ex.restSeconds && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                          {ex.restSeconds}s Descanso
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-neutral-400 mt-2 line-clamp-2">
                      {ex.instructions}
                    </p>
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between">
                    <button
                      onClick={() => handleOpenEditSingular(ex)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-neutral-400 hover:text-amber-500 dark:hover:text-amber-400 transition cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Tens a certeza que queres eliminar o treino singular "${ex.name}"?`)) {
                          deleteExercise(ex.id);
                          triggerNotice(`Treino singular removido.`);
                        }
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-400 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 2: TREINO DIÁRIO (CONJUNTO DE TREINOS SINGULARES)   */}
      {/* ========================================================= */}
      {mainTab === 'workouts' && workoutTier === 'daily' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailyWorkoutTemplates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm hover:border-amber-500/50 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-500">
                        {tmpl.focusArea || 'Treino Diário'}
                      </span>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-1.5">{tmpl.name}</h3>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300">
                      {tmpl.exercises.length} Exercícios
                    </span>
                  </div>

                  {/* List of exercises inside this daily routine */}
                  <div className="mt-4 space-y-2">
                    {tmpl.exercises.map((ex, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-neutral-950/60 border border-slate-100 dark:border-neutral-800/80 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-500 font-bold text-[10px] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-medium text-slate-800 dark:text-neutral-200 truncate">{ex.exerciseName}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-neutral-400 shrink-0 font-semibold">
                          {ex.sets?.length || 3} Séries
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Controls: Edit & Delete */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between">
                  <button
                    onClick={() => handleOpenEditDaily(tmpl)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-neutral-400 hover:text-amber-500 dark:hover:text-amber-400 transition cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Editar Treino Diário</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Tens a certeza que queres eliminar o treino diário "${tmpl.name}"?`)) {
                        deleteDailyWorkoutTemplate(tmpl.id);
                        triggerNotice(`Treino diário eliminado da biblioteca.`);
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-400 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 3: TREINO SEMANAL (CONJUNTO DE TREINOS DIÁRIOS)    */}
      {/* ========================================================= */}
      {mainTab === 'workouts' && workoutTier === 'weekly' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {weeklyWorkoutTemplates.map((weekly) => (
              <div
                key={weekly.id}
                className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm hover:border-amber-500/50 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-500">
                        Plano Semanal (7 Dias)
                      </span>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-1">{weekly.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">{weekly.description}</p>
                    </div>
                  </div>

                  {/* 7 Days Grid Breakdown */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {weekly.days.map((d, idx) => (
                      <div 
                        key={idx}
                        className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between ${
                          d.isRestDay
                            ? 'bg-slate-50 dark:bg-neutral-950/40 border-dashed border-slate-200 dark:border-neutral-800 opacity-70'
                            : 'bg-amber-50/50 dark:bg-neutral-800/60 border-amber-500/20'
                        }`}
                      >
                        <span className="font-bold text-[11px] text-slate-500 dark:text-neutral-400 block">
                          {d.dayOfWeek}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white truncate mt-1">
                          {d.isRestDay ? 'Descanso / Recuperação' : (d.dailyWorkoutName || 'Treino Atribuído')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Controls: Edit & Delete */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between">
                  <button
                    onClick={() => handleOpenEditWeekly(weekly)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-neutral-400 hover:text-amber-500 dark:hover:text-amber-400 transition cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Editar Plano Semanal</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Tens a certeza que queres eliminar o plano semanal "${weekly.name}"?`)) {
                        deleteWeeklyWorkoutTemplate(weekly.id);
                        triggerNotice(`Plano semanal eliminado da biblioteca.`);
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-400 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 4: REFEIÇÃO SINGULAR                               */}
      {/* ========================================================= */}
      {mainTab === 'nutrition' && nutritionTier === 'singular' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mealLibrary.map((meal) => (
              <div 
                key={meal.id}
                className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm hover:border-emerald-500/50 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                      {meal.category || 'Refeição'}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      {meal.calories} kcal
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-2">{meal.name}</h3>
                  {meal.description && (
                    <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 line-clamp-2">{meal.description}</p>
                  )}

                  {/* Macros badges */}
                  <div className="flex items-center gap-2 mt-3 text-[11px] font-bold">
                    <span className="text-emerald-500">P: {meal.proteinG}g</span>
                    <span className="text-sky-500">H: {meal.carbsG}g</span>
                    <span className="text-amber-500">G: {meal.fatG}g</span>
                  </div>

                  {/* Foods list */}
                  <div className="mt-3 bg-slate-50 dark:bg-neutral-950/60 p-2.5 rounded-xl border border-slate-100 dark:border-neutral-800/80 text-xs space-y-1">
                    {meal.foods.map((f, i) => (
                      <div key={i} className="flex justify-between text-slate-700 dark:text-neutral-300">
                        <span className="font-medium truncate">{f.item}</span>
                        <span className="text-slate-400 font-semibold">{f.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Controls */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between">
                  <button
                    onClick={() => handleOpenEditMeal(meal)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-neutral-400 hover:text-emerald-500 transition cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Tens a certeza que queres eliminar a refeição "${meal.name}"?`)) {
                        deleteMealFromLibrary(meal.id);
                        triggerNotice(`Refeição eliminada da biblioteca.`);
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-400 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 5: EMENTA DIÁRIA                                   */}
      {/* ========================================================= */}
      {mainTab === 'nutrition' && nutritionTier === 'daily' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailyMealTemplates.map((dMeal) => (
              <div
                key={dMeal.id}
                className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm hover:border-emerald-500/50 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                        Ementa Diária
                      </span>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-1.5">{dMeal.name}</h3>
                    </div>
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                      <Flame className="w-4 h-4" />
                      {dMeal.totalCalories} kcal
                    </span>
                  </div>

                  {/* Meals inside */}
                  <div className="mt-4 space-y-2">
                    {dMeal.meals.map((m, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-neutral-950/60 border border-slate-100 dark:border-neutral-800/80 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-semibold text-slate-800 dark:text-neutral-200 truncate">{m.name}</span>
                        </div>
                        <span className="text-slate-400 font-semibold">{m.calories} kcal</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between">
                  <button
                    onClick={() => handleOpenEditDailyMeal(dMeal)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-neutral-400 hover:text-emerald-500 transition cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Editar Ementa Diária</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Tens a certeza que queres eliminar a ementa diária "${dMeal.name}"?`)) {
                        deleteDailyMealTemplate(dMeal.id);
                        triggerNotice(`Ementa diária eliminada.`);
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-400 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 6: EMENTA SEMANAL                                  */}
      {/* ========================================================= */}
      {mainTab === 'nutrition' && nutritionTier === 'weekly' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {weeklyMealTemplates.map((wMeal) => (
              <div
                key={wMeal.id}
                className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm hover:border-emerald-500/50 transition flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                    Plano Alimentar Semanal (7 Dias)
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-1">{wMeal.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">{wMeal.description}</p>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {wMeal.days.map((d, idx) => (
                      <div 
                        key={idx}
                        className="p-2.5 rounded-xl border bg-slate-50 dark:bg-neutral-950/60 border-slate-200 dark:border-neutral-800 text-xs flex flex-col justify-between"
                      >
                        <span className="font-bold text-[11px] text-slate-500 dark:text-neutral-400 block">
                          {d.dayOfWeek}
                        </span>
                        <div className="flex justify-between items-center mt-1">
                          <span className="font-semibold text-slate-900 dark:text-white truncate">
                            {d.dailyMealName || 'Ementa Configurada'}
                          </span>
                          {d.totalCalories > 0 && (
                            <span className="text-[11px] text-amber-500 font-bold ml-1">{d.totalCalories} kcal</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between">
                  <button
                    onClick={() => handleOpenEditWeeklyMeal(wMeal)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-neutral-400 hover:text-emerald-500 transition cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Editar Plano Semanal</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Tens a certeza que queres eliminar o plano semanal "${wMeal.name}"?`)) {
                        deleteWeeklyMealTemplate(wMeal.id);
                        triggerNotice(`Plano semanal alimentar eliminado.`);
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-400 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: CRIAR/EDITAR TREINO SINGULAR                      */}
      {/* ========================================================= */}
      {showSingularModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                  <Dumbbell className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {editingSingularId ? 'Editar Treino Singular' : 'Criar Treino Singular'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                    Estipula um único treino para a biblioteca.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowSingularModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {singularError && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{singularError}</span>
              </div>
            )}

            <form onSubmit={handleSaveSingular} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-neutral-300 block mb-1">
                  Nome do Exercício / Treino Singular *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Supino Inclinado com Halteres"
                  value={singularName}
                  onChange={(e) => setSingularName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-neutral-300 block mb-1">
                    Categoria
                  </label>
                  <select
                    value={singularCategory}
                    onChange={(e) => setSingularCategory(e.target.value as Exercise['category'])}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  >
                    {['Peito', 'Costas', 'Pernas', 'Ombros', 'Braços', 'Core', 'Cardio', 'Mobilidade'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-neutral-300 block mb-1">
                    Grupo Muscular Alvo
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Peitoral Superior & Tríceps"
                    value={singularMuscleGroup}
                    onChange={(e) => setSingularMuscleGroup(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Optional parameters: Series, Reps, Até à Falha, Tempo, Descanso */}
              <div className="p-3.5 bg-slate-50 dark:bg-neutral-950/60 border border-slate-200 dark:border-neutral-800 rounded-2xl space-y-3">
                <span className="font-extrabold text-[11px] uppercase tracking-wider text-amber-500 block">
                  Parâmetros de Execução (Todos Opcionais)
                </span>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-slate-500 dark:text-neutral-400 block mb-1">Séries</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      placeholder="Ex: 4"
                      value={singularSets}
                      onChange={(e) => setSingularSets(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 dark:text-neutral-400 block mb-1">Repetições</label>
                    <input
                      type="text"
                      disabled={singularIsFailure}
                      placeholder="Ex: 8-10"
                      value={singularReps}
                      onChange={(e) => setSingularReps(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white disabled:opacity-40"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 dark:text-neutral-400 block mb-1">Descanso (s)</label>
                    <input
                      type="number"
                      placeholder="Ex: 90"
                      value={singularRest}
                      onChange={(e) => setSingularRest(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-neutral-800">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={singularIsFailure}
                      onChange={(e) => {
                        setSingularIsFailure(e.target.checked);
                        if (e.target.checked) setSingularReps('Até à falha');
                      }}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                    />
                    <span className="font-semibold text-slate-700 dark:text-neutral-300">Treinar até à falha</span>
                  </label>

                  <div>
                    <label className="text-slate-500 dark:text-neutral-400 block mb-0.5">Tempo de Execução (s)</label>
                    <input
                      type="number"
                      placeholder="Ex: 45s"
                      value={singularDuration}
                      onChange={(e) => setSingularDuration(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* MEDIA REQUIREMENT: "Ainda nessa janela de criaçao ha opçao de linkar um video demonstrativo e uma imagem (opcional), mas um dos dois tem que se colocar." */}
              <div className="p-3.5 bg-amber-500/5 border border-amber-500/20 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[11px] uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5" />
                    <span>Média Demonstrativa (Obrigatório Pelo Menos 1) *</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Vídeo OU Imagem</span>
                </div>

                <div>
                  <label className="text-slate-600 dark:text-neutral-400 block mb-0.5 font-medium">
                    Link de Vídeo Demonstrativo (YouTube, Vimeo ou URL)
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={singularVideoUrl}
                    onChange={(e) => setSingularVideoUrl(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-600 dark:text-neutral-400 block mb-0.5 font-medium">
                    Link de Imagem (URL ou Foto)
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={singularImageUrl}
                    onChange={(e) => setSingularImageUrl(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-neutral-300 block mb-1">
                  Instruções e Notas de Execução
                </label>
                <textarea
                  rows={2}
                  placeholder="Cadência recomendada, dicas posturais ou pontos de segurança..."
                  value={singularInstructions}
                  onChange={(e) => setSingularInstructions(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowSingularModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-neutral-400 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  {editingSingularId ? 'Guardar Alterações' : 'Submeter Treino Singular'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: CRIAR/EDITAR TREINO DIÁRIO                        */}
      {/* ========================================================= */}
      {showDailyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {editingDailyId ? 'Editar Treino Diário' : 'Criador de Treino Diário'}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                  Adiciona treinos singulares da biblioteca por ordem para estruturar o teu treino diário.
                </p>
              </div>
              <button onClick={() => setShowDailyModal(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-neutral-300 block mb-1">
                  Nome do Treino Diário *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Treino A - Peitoral & Tríceps"
                  value={dailyName}
                  onChange={(e) => setDailyName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-neutral-300 block mb-1">
                  Área de Foco
                </label>
                <input
                  type="text"
                  placeholder="Ex: Peito e Tríceps"
                  value={dailyFocusArea}
                  onChange={(e) => setDailyFocusArea(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Split View: Left = Library Picker, Right = Current Day Ordered Stack */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              
              {/* Left: Library Singular Workouts to pick */}
              <div className="p-3 bg-slate-50 dark:bg-neutral-950/60 border border-slate-200 dark:border-neutral-800 rounded-2xl flex flex-col h-96">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-neutral-800">
                  <span className="font-extrabold uppercase text-[11px] text-amber-500">
                    Treinos Singulares da Biblioteca
                  </span>
                  <span className="text-[10px] text-slate-400">Clica em (+) para adicionar</span>
                </div>

                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filtrar exercícios..."
                    value={dailyPickerSearch}
                    onChange={(e) => setDailyPickerSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg text-xs"
                  />
                </div>

                <div className="overflow-y-auto space-y-1.5 flex-1 pr-1">
                  {exercises
                    .filter(ex => ex.name.toLowerCase().includes(dailyPickerSearch.toLowerCase()))
                    .map(ex => (
                      <div 
                        key={ex.id}
                        className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 flex items-center justify-between hover:border-amber-500/50 transition"
                      >
                        <div className="min-w-0 pr-2">
                          <h4 className="font-bold text-slate-900 dark:text-white truncate">{ex.name}</h4>
                          <span className="text-[10px] text-amber-500 font-semibold">{ex.category} • {ex.muscleGroup}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddSingularToDaily(ex)}
                          className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-black transition cursor-pointer shrink-0"
                          title="Adicionar à ordem"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {/* Right: Ordered Exercises Stack */}
              <div className="p-3 bg-slate-50 dark:bg-neutral-950/60 border border-slate-200 dark:border-neutral-800 rounded-2xl flex flex-col h-96">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-neutral-800">
                  <span className="font-extrabold uppercase text-[11px] text-amber-500">
                    Sequência Ordenada do Treino ({dailySelectedExercises.length})
                  </span>
                  <span className="text-[10px] text-slate-400">Ordem de execução</span>
                </div>

                {dailySelectedExercises.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 p-4">
                    <Dumbbell className="w-8 h-8 mb-2 opacity-40 text-amber-500" />
                    <p className="text-xs font-semibold">Nenhum exercício adicionado ainda.</p>
                    <p className="text-[11px]">Clica em (+) nos treinos da esquerda para construir a ordem.</p>
                  </div>
                ) : (
                  <div className="overflow-y-auto space-y-1.5 flex-1 pr-1">
                    {dailySelectedExercises.map((ex, idx) => (
                      <div 
                        key={idx}
                        className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-5 h-5 rounded-md bg-amber-500 text-black font-black text-[10px] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 dark:text-white truncate">{ex.exerciseName}</h4>
                            <span className="text-[10px] text-slate-400">{ex.sets?.length || 3} Séries configuradas</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveDailyExercise(idx, idx - 1)}
                            className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                            title="Subir na ordem"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            disabled={idx === dailySelectedExercises.length - 1}
                            onClick={() => handleMoveDailyExercise(idx, idx + 1)}
                            className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                            title="Descer na ordem"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveFromDaily(idx)}
                            className="p-1 rounded text-red-500 hover:text-red-400 cursor-pointer"
                            title="Remover"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setShowDailyModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-neutral-400 font-semibold cursor-pointer text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveDaily}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold shadow-lg shadow-amber-500/20 cursor-pointer text-xs"
              >
                {editingDailyId ? 'Guardar Alterações' : 'Gravar Treino Diário na Biblioteca'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: CRIAR/EDITAR TREINO SEMANAL                       */}
      {/* ========================================================= */}
      {showWeeklyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {editingWeeklyId ? 'Editar Treino Semanal' : 'Criador de Treino Semanal'}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                  Atribui treinos diários da biblioteca aos 7 dias da semana (apenas treinos diários!).
                </p>
              </div>
              <button onClick={() => setShowWeeklyModal(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-neutral-300 block mb-1">
                  Nome do Treino Semanal *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mesociclo Hipertrofia 4 Dias A/B/C/D"
                  value={weeklyName}
                  onChange={(e) => setWeeklyName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-neutral-300 block mb-1">
                  Descrição / Notas do Mesociclo
                </label>
                <input
                  type="text"
                  placeholder="Ex: Foco na sobrecarga progressiva com descanso ativo"
                  value={weeklyDesc}
                  onChange={(e) => setWeeklyDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* 7 Days Assignment */}
            <div className="space-y-2 text-xs pt-2">
              <span className="font-extrabold text-[11px] uppercase tracking-wider text-amber-500 block">
                Atribuição dos 7 Dias da Semana
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-96 overflow-y-auto pr-1">
                {weeklyDays.map((day, idx) => (
                  <div 
                    key={day.dayOfWeek}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-neutral-950/60 border border-slate-200 dark:border-neutral-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{day.dayOfWeek}</span>
                      <label className="flex items-center gap-1.5 cursor-pointer text-[11px]">
                        <input
                          type="checkbox"
                          checked={day.isRestDay}
                          onChange={(e) => {
                            const isRest = e.target.checked;
                            setWeeklyDays(prev => prev.map((d, i) => i === idx ? {
                              ...d,
                              isRestDay: isRest,
                              dailyWorkoutId: isRest ? undefined : d.dailyWorkoutId,
                              dailyWorkoutName: isRest ? undefined : d.dailyWorkoutName,
                              exercises: isRest ? [] : d.exercises
                            } : d));
                          }}
                          className="w-3.5 h-3.5 rounded text-amber-500"
                        />
                        <span className="text-slate-500">Dia de Descanso</span>
                      </label>
                    </div>

                    {!day.isRestDay ? (
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">
                          Selecionar Treino Diário da Biblioteca:
                        </label>
                        <select
                          value={day.dailyWorkoutId || ''}
                          onChange={(e) => handleAssignDailyToWeeklyDay(idx, e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs text-slate-900 dark:text-white"
                        >
                          <option value="">-- Escolhe um treino diário da biblioteca --</option>
                          {dailyWorkoutTemplates.map(tmpl => (
                            <option key={tmpl.id} value={tmpl.id}>
                              {tmpl.name} ({tmpl.exercises.length} ex.)
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic">Descanso & Recuperação Ativa.</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setShowWeeklyModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-neutral-400 font-semibold cursor-pointer text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveWeekly}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold shadow-lg shadow-amber-500/20 cursor-pointer text-xs"
              >
                {editingWeeklyId ? 'Guardar Alterações' : 'Gravar Plano Semanal na Biblioteca'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: CRIAR/EDITAR REFEIÇÃO SINGULAR                    */}
      {/* ========================================================= */}
      {showMealModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {editingMealId ? 'Editar Refeição Singular' : 'Criar Refeição Singular'}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                  Refeição ou prato reutilizável para a biblioteca de nutrição.
                </p>
              </div>
              <button onClick={() => setShowMealModal(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMeal} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-neutral-300 block mb-1">
                  Nome da Refeição *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Frango Grelhado com Arroz Basmati"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-neutral-300 block mb-1">
                    Categoria da Refeição
                  </label>
                  <select
                    value={mealCategory}
                    onChange={(e) => setMealCategory(e.target.value as Meal['category'])}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white"
                  >
                    {['Pequeno-Almoço', 'Almoço', 'Lanche', 'Jantar', 'Ceia', 'Pré/Pós-Treino'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-neutral-300 block mb-1">
                    Horário Sugerido
                  </label>
                  <input
                    type="time"
                    value={mealTime}
                    onChange={(e) => setMealTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Macros */}
              <div className="grid grid-cols-4 gap-2 p-3 bg-slate-50 dark:bg-neutral-950/60 rounded-xl border border-slate-200 dark:border-neutral-800">
                <div>
                  <label className="text-slate-400 block mb-1">Calorias</label>
                  <input
                    type="number"
                    value={mealCalories}
                    onChange={(e) => setMealCalories(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-emerald-500 block mb-1">Proteína (g)</label>
                  <input
                    type="number"
                    value={mealProtein}
                    onChange={(e) => setMealProtein(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-sky-500 block mb-1">Hidratos (g)</label>
                  <input
                    type="number"
                    value={mealCarbs}
                    onChange={(e) => setMealCarbs(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-amber-500 block mb-1">Gordura (g)</label>
                  <input
                    type="number"
                    value={mealFat}
                    onChange={(e) => setMealFat(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-neutral-300 block mb-1">
                  Alimentos e Doses (1 por linha)
                </label>
                <textarea
                  rows={3}
                  placeholder="150g Frango grelhado&#10;150g Arroz basmati&#10;100g Brócolos"
                  value={mealFoodsText}
                  onChange={(e) => setMealFoodsText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowMealModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-neutral-400 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  {editingMealId ? 'Guardar Alterações' : 'Submeter Refeição'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: CRIAR/EDITAR EMENTA DIÁRIA                        */}
      {/* ========================================================= */}
      {showDailyMealModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {editingDailyMealId ? 'Editar Ementa Diária' : 'Criador de Ementa Diária'}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                  Agrupa refeições singulares da biblioteca para um dia completo.
                </p>
              </div>
              <button onClick={() => setShowDailyMealModal(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-neutral-300 block mb-1">
                  Nome da Ementa Diária *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dia de Treino - 2400 kcal Alta Proteína"
                  value={dailyMealName}
                  onChange={(e) => setDailyMealName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-neutral-300 block mb-1">
                  Recomendações e Hidratação
                </label>
                <input
                  type="text"
                  placeholder="Ex: Ingestão de 3L de água diários"
                  value={dailyMealNotes}
                  onChange={(e) => setDailyMealNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Meals Selector Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-3 bg-slate-50 dark:bg-neutral-950/60 border border-slate-200 dark:border-neutral-800 rounded-2xl flex flex-col h-80">
                <span className="font-extrabold uppercase text-[11px] text-emerald-500 pb-2 mb-2 border-b border-slate-200 dark:border-neutral-800">
                  Refeições Singulares Disponíveis
                </span>
                <div className="overflow-y-auto space-y-1.5 flex-1 pr-1">
                  {mealLibrary.map(m => (
                    <div 
                      key={m.id}
                      className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <h4 className="font-bold text-slate-900 dark:text-white truncate">{m.name}</h4>
                        <span className="text-[10px] text-slate-400">{m.calories} kcal • P: {m.proteinG}g</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddMealToDaily(m)}
                        className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-black transition cursor-pointer shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-neutral-950/60 border border-slate-200 dark:border-neutral-800 rounded-2xl flex flex-col h-80">
                <span className="font-extrabold uppercase text-[11px] text-emerald-500 pb-2 mb-2 border-b border-slate-200 dark:border-neutral-800">
                  Refeições Selecionadas ({dailyMealSelectedMeals.length})
                </span>
                {dailyMealSelectedMeals.length === 0 ? (
                  <p className="text-slate-400 text-center my-auto">Adiciona refeições à esquerda.</p>
                ) : (
                  <div className="overflow-y-auto space-y-1.5 flex-1 pr-1">
                    {dailyMealSelectedMeals.map((m, idx) => (
                      <div 
                        key={idx}
                        className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 flex items-center justify-between"
                      >
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 dark:text-white truncate">{m.name}</h4>
                          <span className="text-[10px] text-emerald-500 font-semibold">{m.calories} kcal</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMealFromDaily(idx)}
                          className="p-1 text-red-500 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setShowDailyMealModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-neutral-400 font-semibold cursor-pointer text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveDailyMeal}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold shadow-lg shadow-emerald-500/20 cursor-pointer text-xs"
              >
                {editingDailyMealId ? 'Guardar Alterações' : 'Gravar Ementa Diária'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 6: CRIAR/EDITAR EMENTA SEMANAL                       */}
      {/* ========================================================= */}
      {showWeeklyMealModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {editingWeeklyMealId ? 'Editar Ementa Semanal' : 'Criador de Ementa Semanal'}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                  Distribui ementas diárias da biblioteca pelos 7 dias da semana.
                </p>
              </div>
              <button onClick={() => setShowWeeklyMealModal(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-neutral-300 block mb-1">
                  Nome do Plano Alimentar Semanal *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Plano Semanal - Recomposição & Alta Proteína"
                  value={weeklyMealName}
                  onChange={(e) => setWeeklyMealName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-neutral-300 block mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  placeholder="Ex: 2400 kcal em dias de treino, 1900 kcal ao fim de semana"
                  value={weeklyMealDesc}
                  onChange={(e) => setWeeklyMealDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* 7 Days Assignment */}
            <div className="space-y-2 text-xs pt-2">
              <span className="font-extrabold text-[11px] uppercase tracking-wider text-emerald-500 block">
                Atribuição das Ementas Diárias por Dia
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-96 overflow-y-auto pr-1">
                {weeklyMealDays.map((day, idx) => (
                  <div 
                    key={day.dayOfWeek}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-neutral-950/60 border border-slate-200 dark:border-neutral-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{day.dayOfWeek}</span>
                      {day.totalCalories > 0 && (
                        <span className="text-amber-500 font-bold">{day.totalCalories} kcal</span>
                      )}
                    </div>

                    <select
                      value={day.dailyMealId || ''}
                      onChange={(e) => handleAssignDailyMealToWeeklyDay(idx, e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs text-slate-900 dark:text-white"
                    >
                      <option value="">-- Escolhe uma ementa diária da biblioteca --</option>
                      {dailyMealTemplates.map(tmpl => (
                        <option key={tmpl.id} value={tmpl.id}>
                          {tmpl.name} ({tmpl.totalCalories} kcal)
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setShowWeeklyMealModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-neutral-400 font-semibold cursor-pointer text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveWeeklyMeal}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold shadow-lg shadow-emerald-500/20 cursor-pointer text-xs"
              >
                {editingWeeklyMealId ? 'Guardar Alterações' : 'Gravar Ementa Semanal'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
