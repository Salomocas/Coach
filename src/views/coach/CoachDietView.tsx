import React, { useState, useEffect } from 'react';
import { 
  UtensilsCrossed, 
  Calendar, 
  Users, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Clock, 
  Flame, 
  Droplet, 
  ChevronRight, 
  ChevronDown, 
  ArrowRight, 
  Search, 
  X,
  Layers,
  Edit2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  NutritionPlan, 
  DayNutrition, 
  Meal, 
  FoodItem,
  DailyMealTemplate, 
  WeeklyMealTemplate 
} from '../../types';

export const CoachDietView: React.FC = () => {
  const { allClients } = useAuth();
  const { 
    nutritionPlans, 
    saveNutritionPlan, 
    mealLibrary, 
    dailyMealTemplates, 
    weeklyMealTemplates,
    selectedAthleteId, 
    setSelectedAthleteId 
  } = useData();

  // Active athlete selection
  const [selectedClientId, setSelectedClientId] = useState<string>(
    selectedAthleteId || allClients[0]?.uid || 'client-ricardo-silva'
  );

  // Plan Details
  const [planTitle, setPlanTitle] = useState('Ementa Semanal - Recomposição & Alta Proteína');
  const [dailyCaloriesTarget, setDailyCaloriesTarget] = useState<number>(2350);
  const [planNotes, setPlanNotes] = useState('Ingestão de pelo menos 3.5L de água por dia. Consumir hidratos 2h antes do treino.');

  // Weekly Days (7 days)
  const defaultDays: DayNutrition[] = [
    { dayOfWeek: 'Segunda-feira', dayIndex: 0, meals: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, waterIntakeLiters: 3.5 },
    { dayOfWeek: 'Terça-feira', dayIndex: 1, meals: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, waterIntakeLiters: 3.5 },
    { dayOfWeek: 'Quarta-feira', dayIndex: 2, meals: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, waterIntakeLiters: 3.5 },
    { dayOfWeek: 'Quinta-feira', dayIndex: 3, meals: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, waterIntakeLiters: 3.5 },
    { dayOfWeek: 'Sexta-feira', dayIndex: 4, meals: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, waterIntakeLiters: 3.5 },
    { dayOfWeek: 'Sábado', dayIndex: 5, meals: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, waterIntakeLiters: 3.5 },
    { dayOfWeek: 'Domingo', dayIndex: 6, meals: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, waterIntakeLiters: 3.5 },
  ];

  const [days, setDays] = useState<DayNutrition[]>(defaultDays);

  // Modals
  const [showWeeklyPickerModal, setShowWeeklyPickerModal] = useState(false);
  const [showDailyPickerModal, setShowDailyPickerModal] = useState<number | null>(null); // dayIndex
  const [showLibraryMealModal, setShowLibraryMealModal] = useState<number | null>(null); // dayIndex
  const [showManualMealModal, setShowManualMealModal] = useState<number | null>(null); // dayIndex
  const [publishedNotice, setPublishedNotice] = useState(false);

  // Manual Meal Form State
  const [manualMealName, setManualMealName] = useState('');
  const [manualMealTime, setManualMealTime] = useState('12:30');
  const [manualMealCategory, setManualMealCategory] = useState<Meal['category']>('Almoço');
  const [manualMealKcal, setManualMealKcal] = useState<number>(500);
  const [manualMealProt, setManualMealProt] = useState<number>(40);
  const [manualMealCarbs, setManualMealCarbs] = useState<number>(55);
  const [manualMealFat, setManualMealFat] = useState<number>(12);
  const [manualMealFoodsText, setManualMealFoodsText] = useState('150g Salmão grelhado\n150g Batata-doce assada\nSalada mista');

  // Sync with context selectedAthleteId
  useEffect(() => {
    if (selectedAthleteId && selectedAthleteId !== selectedClientId) {
      setSelectedClientId(selectedAthleteId);
    }
  }, [selectedAthleteId]);

  // Load client's plan when athlete changes
  useEffect(() => {
    const existingPlan = nutritionPlans.find(p => p.clientId === selectedClientId);
    if (existingPlan && existingPlan.days && existingPlan.days.length > 0) {
      setPlanTitle(existingPlan.title);
      setDailyCaloriesTarget(existingPlan.dailyCalories || 2350);
      setPlanNotes(existingPlan.notes || '');
      setDays(JSON.parse(JSON.stringify(existingPlan.days)));
    }
  }, [selectedClientId, nutritionPlans]);

  const targetClient = allClients.find(c => c.uid === selectedClientId) || allClients[0];

  // Helper to determine today's day in PT
  const todayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const todayDayName = todayNames[new Date().getDay()];

  // Recalculate Day totals
  const recalculateDay = (day: DayNutrition): DayNutrition => {
    const totalCalories = day.meals.reduce((acc, m) => acc + (m.calories || 0), 0);
    const totalProtein = day.meals.reduce((acc, m) => acc + (m.proteinG || 0), 0);
    const totalCarbs = day.meals.reduce((acc, m) => acc + (m.carbsG || 0), 0);
    const totalFat = day.meals.reduce((acc, m) => acc + (m.fatG || 0), 0);
    return { ...day, totalCalories, totalProtein, totalCarbs, totalFat };
  };

  // -------------------------------------------------------------
  // ACTION: Atribuir Plano Semanal de Dieta da Biblioteca
  // -------------------------------------------------------------
  const handleApplyWeeklyTemplate = (weeklyTmpl: WeeklyMealTemplate) => {
    setPlanTitle(weeklyTmpl.name);
    if (weeklyTmpl.description) setPlanNotes(weeklyTmpl.description);

    const newDays: DayNutrition[] = weeklyTmpl.days.map((d, i) => {
      const dayMeals = JSON.parse(JSON.stringify(d.meals || []));
      const totalCalories = dayMeals.reduce((acc: number, m: Meal) => acc + (m.calories || 0), 0);
      const totalProtein = dayMeals.reduce((acc: number, m: Meal) => acc + (m.proteinG || 0), 0);
      const totalCarbs = dayMeals.reduce((acc: number, m: Meal) => acc + (m.carbsG || 0), 0);
      const totalFat = dayMeals.reduce((acc: number, m: Meal) => acc + (m.fatG || 0), 0);

      return {
        dayOfWeek: d.dayOfWeek,
        dayIndex: i,
        meals: dayMeals,
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
        waterIntakeLiters: 3.5
      };
    });

    setDays(newDays);
    setShowWeeklyPickerModal(false);
  };

  // -------------------------------------------------------------
  // ACTION: Atribuir Ementa Diária da Biblioteca a um Dia Específico
  // -------------------------------------------------------------
  const handleApplyDailyTemplateToDay = (dayIndex: number, dailyTmpl: DailyMealTemplate) => {
    setDays(prev => prev.map((d, i) => {
      if (i === dayIndex) {
        const clonedMeals = JSON.parse(JSON.stringify(dailyTmpl.meals || []));
        return recalculateDay({
          ...d,
          meals: clonedMeals
        });
      }
      return d;
    }));
    setShowDailyPickerModal(null);
  };

  // -------------------------------------------------------------
  // ACTION: Adicionar Refeição da Biblioteca
  // -------------------------------------------------------------
  const handleAddLibraryMealToDay = (dayIndex: number, meal: Meal) => {
    setDays(prev => prev.map((d, i) => {
      if (i === dayIndex) {
        const newMeal: Meal = {
          ...meal,
          id: 'meal-' + Date.now() + Math.random().toString().slice(2, 6)
        };
        return recalculateDay({
          ...d,
          meals: [...d.meals, newMeal]
        });
      }
      return d;
    }));
    setShowLibraryMealModal(null);
  };

  // -------------------------------------------------------------
  // ACTION: Adicionar Refeição Manualmente (Sem vir da biblioteca)
  // "Havendo sempre a hipotese de colocar menus singularmente sem ser vindos da biblioteca"
  // -------------------------------------------------------------
  const handleSaveManualMeal = (dayIndex: number) => {
    if (!manualMealName.trim()) {
      alert('Por favor insere o nome da refeição.');
      return;
    }

    const foods: FoodItem[] = manualMealFoodsText
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

    const newMeal: Meal = {
      id: 'manual-meal-' + Date.now(),
      name: manualMealName.trim(),
      time: manualMealTime,
      category: manualMealCategory,
      calories: Number(manualMealKcal) || 0,
      proteinG: Number(manualMealProt) || 0,
      carbsG: Number(manualMealCarbs) || 0,
      fatG: Number(manualMealFat) || 0,
      foods: foods.length > 0 ? foods : [{ item: manualMealName.trim(), quantity: '1 porção' }]
    };

    setDays(prev => prev.map((d, i) => {
      if (i === dayIndex) {
        return recalculateDay({
          ...d,
          meals: [...d.meals, newMeal]
        });
      }
      return d;
    }));

    setShowManualMealModal(null);
  };

  // Remove Meal from day
  const handleRemoveMeal = (dayIndex: number, mealIdx: number) => {
    setDays(prev => prev.map((d, i) => {
      if (i === dayIndex) {
        const updatedMeals = d.meals.filter((_, idx) => idx !== mealIdx);
        return recalculateDay({ ...d, meals: updatedMeals });
      }
      return d;
    }));
  };

  // Publish / Save Plan to Athlete
  const handlePublishPlan = async () => {
    if (!targetClient) return;

    const planToSave: NutritionPlan = {
      id: 'nutri-' + targetClient.uid + '-' + Date.now(),
      clientId: targetClient.uid,
      clientName: targetClient.displayName,
      coachId: 'coach-sergio-cunha',
      title: planTitle,
      dailyCalories: dailyCaloriesTarget,
      weekStartDate: '2026-10-05',
      weekEndDate: '2026-10-11',
      notes: planNotes,
      days: days,
      createdAt: new Date().toISOString()
    };

    await saveNutritionPlan(planToSave);

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
              <p className="font-extrabold text-sm">Plano Alimentar Publicado com Sucesso!</p>
              <p className="text-xs">O aluno {targetClient?.displayName} já visualiza o plano atualizado na aba de nutrição.</p>
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
              <span className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
                <UtensilsCrossed className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Atribuição de Dieta & Nutrição
                </h1>
                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  Planeamento alimentar semanal com ementas diárias predefinidas ou refeições manuais.
                </p>
              </div>
            </div>
          </div>

          {/* Athlete Selector & Actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-2xl">
              <img 
                src={targetClient?.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                alt={targetClient?.displayName}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/40"
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

            {/* Atribuir Plano Semanal Predefinido da Biblioteca */}
            <button
              onClick={() => setShowWeeklyPickerModal(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-neutral-200 text-xs font-black transition shadow-md cursor-pointer"
              title="Preenche todos os 7 dias automaticamente a partir de um plano semanal da biblioteca"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Atribuir Plano Semanal da Biblioteca</span>
              <span className="sm:hidden">Plano Semanal</span>
            </button>

            {/* Final Save / Publish Button */}
            <button
              onClick={handlePublishPlan}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black transition shadow-lg shadow-emerald-500/25 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Publicar ao Aluno</span>
            </button>
          </div>
        </div>

        {/* Plan Title & Notes Inline Editor */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-neutral-800/80 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="font-bold text-slate-500 dark:text-neutral-400 block mb-1">Título da Ementa</label>
            <input
              type="text"
              value={planTitle}
              onChange={(e) => setPlanTitle(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="font-bold text-slate-500 dark:text-neutral-400 block mb-1">Meta Calórica Diária (kcal)</label>
            <input
              type="number"
              value={dailyCaloriesTarget}
              onChange={(e) => setDailyCaloriesTarget(Number(e.target.value))}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="font-bold text-slate-500 dark:text-neutral-400 block mb-1">Notas Nutricionais e Hidratação</label>
            <input
              type="text"
              value={planNotes}
              onChange={(e) => setPlanNotes(e.target.value)}
              placeholder="Ex: Beber 3.5L de água por dia..."
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
            <Calendar className="w-4 h-4 text-emerald-500" />
            <h2 className="font-black text-sm uppercase tracking-wider text-slate-900 dark:text-white">
              Ementa Semanal do Aluno ({days.length} Dias)
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Atribui ementas diárias predefinidas ou adiciona refeições singulares manuais.
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
                    ? 'ring-2 ring-emerald-500 bg-white dark:bg-neutral-900 border-emerald-500/50'
                    : 'bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800'
                }`}
              >
                <div>
                  {/* Day Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-neutral-800">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                        {day.dayOfWeek.split('-')[0]}
                      </span>
                      {isToday && (
                        <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-black font-black text-[9px] uppercase tracking-wider">
                          Hoje
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-amber-500 flex items-center gap-0.5">
                      <Flame className="w-3 h-3" />
                      {day.totalCalories} kcal
                    </span>
                  </div>

                  {/* Day Macros summary */}
                  <div className="flex items-center justify-between text-[10px] font-bold py-2 border-b border-slate-100 dark:border-neutral-800/80 text-slate-500">
                    <span className="text-emerald-500">P: {day.totalProtein}g</span>
                    <span className="text-sky-500">H: {day.totalCarbs}g</span>
                    <span className="text-amber-500">G: {day.totalFat}g</span>
                  </div>

                  {/* Day Actions: Ementa Diária vs Refeição Biblioteca vs Refeição Manual */}
                  <div className="space-y-1.5 my-3">
                    <button
                      type="button"
                      onClick={() => setShowDailyPickerModal(dayIndex)}
                      className="w-full flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 hover:text-black text-emerald-600 dark:text-emerald-400 text-[11px] font-bold transition cursor-pointer"
                      title="Atribuir uma ementa diária predefinida da biblioteca"
                    >
                      <Layers className="w-3 h-3" />
                      <span>Ementa Diária</span>
                    </button>

                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setShowLibraryMealModal(dayIndex)}
                        className="flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 text-slate-700 dark:text-neutral-300 text-[10px] font-bold transition cursor-pointer"
                        title="Adicionar da biblioteca de refeições"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Biblioteca</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setManualMealName('');
                          setManualMealTime('12:30');
                          setManualMealCategory('Almoço');
                          setManualMealKcal(500);
                          setManualMealProt(40);
                          setManualMealCarbs(55);
                          setManualMealFat(12);
                          setManualMealFoodsText('150g Frango grelhado\n150g Arroz basmati\nSalada');
                          setShowManualMealModal(dayIndex);
                        }}
                        className="flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl border border-dashed border-slate-300 dark:border-neutral-700 hover:border-emerald-500 text-slate-600 dark:text-neutral-400 hover:text-emerald-500 text-[10px] font-semibold transition cursor-pointer"
                        title="Criar refeição manual sem vir da biblioteca"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Manual</span>
                      </button>
                    </div>
                  </div>

                  {/* Meals List */}
                  {day.meals.length === 0 ? (
                    <div className="py-6 flex flex-col items-center justify-center text-center text-slate-400 border border-dashed border-slate-200 dark:border-neutral-800 rounded-2xl">
                      <p className="text-[10px] text-slate-400">Sem refeições hoje.</p>
                      <span className="text-[9px] text-emerald-500 mt-0.5">Usa os botões acima</span>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-0.5">
                      {day.meals.map((meal, mealIdx) => (
                        <div
                          key={mealIdx}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-neutral-950/80 border border-slate-200 dark:border-neutral-800/80 text-xs flex flex-col justify-between group"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <span className="text-[9px] font-bold uppercase text-emerald-500 block">
                                {meal.category} • {meal.time}
                              </span>
                              <h4 className="font-bold text-[11px] text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                                {meal.name}
                              </h4>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveMeal(dayIndex, mealIdx)}
                              className="p-0.5 text-slate-400 hover:text-red-500 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-neutral-400 mt-1.5">
                            <span className="font-bold text-amber-500">{meal.calories} kcal</span>
                            <span>P: {meal.proteinG}g</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-neutral-800 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>{day.meals.length} Refeições</span>
                  <span className="font-semibold">{day.totalCalories} kcal</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: SELECIONAR PLANO SEMANAL DE DIETA                   */}
      {/* ========================================================= */}
      {showWeeklyPickerModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Atribuir Plano Semanal Predefinido de Dieta
                </h3>
              </div>
              <button onClick={() => setShowWeeklyPickerModal(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Escolhe um dos planos semanais criados na biblioteca para preencher automaticamente os 7 dias alimentares do aluno:
            </p>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {weeklyMealTemplates.map(weekly => (
                <div
                  key={weekly.id}
                  onClick={() => handleApplyWeeklyTemplate(weekly)}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-neutral-800 hover:border-emerald-500 bg-slate-50 dark:bg-neutral-950/60 hover:bg-emerald-500/5 transition cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-emerald-500 transition">
                      {weekly.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">{weekly.description}</p>
                  </div>

                  <span className="p-2 rounded-xl bg-emerald-500 text-black font-extrabold text-xs flex items-center gap-1 group-hover:scale-105 transition">
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
      {/* MODAL: SELECIONAR EMENTA DIÁRIA PARA UM DIA ESPECÍFICO     */}
      {/* ========================================================= */}
      {showDailyPickerModal !== null && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-500" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Atribuir Ementa Diária a {days[showDailyPickerModal]?.dayOfWeek}
                </h3>
              </div>
              <button onClick={() => setShowDailyPickerModal(null)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {dailyMealTemplates.map(daily => (
                <div
                  key={daily.id}
                  onClick={() => handleApplyDailyTemplateToDay(showDailyPickerModal, daily)}
                  className="p-3 rounded-2xl border border-slate-200 dark:border-neutral-800 hover:border-emerald-500 bg-slate-50 dark:bg-neutral-950/60 hover:bg-emerald-500/5 transition cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-500 transition">
                      {daily.name}
                    </h4>
                    <span className="text-[10px] text-amber-500 font-bold">
                      {daily.totalCalories} kcal • {daily.meals.length} refeições
                    </span>
                  </div>

                  <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 font-extrabold text-[11px] group-hover:bg-emerald-500 group-hover:text-black transition">
                    Carregar Dia
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: SELECIONAR REFEIÇÃO DA BIBLIOTECA                  */}
      {/* ========================================================= */}
      {showLibraryMealModal !== null && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-500" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Adicionar Refeição da Biblioteca a {days[showLibraryMealModal]?.dayOfWeek}
                </h3>
              </div>
              <button onClick={() => setShowLibraryMealModal(null)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {mealLibrary.map(m => (
                <div
                  key={m.id}
                  onClick={() => handleAddLibraryMealToDay(showLibraryMealModal, m)}
                  className="p-3 rounded-2xl border border-slate-200 dark:border-neutral-800 hover:border-emerald-500 bg-slate-50 dark:bg-neutral-950/60 transition cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{m.name}</h4>
                    <span className="text-[10px] text-slate-400">
                      {m.category} • {m.calories} kcal • P: {m.proteinG}g
                    </span>
                  </div>
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black text-xs font-bold">
                    + Adicionar
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADICIONAR REFEIÇÃO MANUALMENTE (SEM BIBLIOTECA)     */}
      {/* ========================================================= */}
      {showManualMealModal !== null && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-emerald-500" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Refeição Singular Manual ({days[showManualMealModal]?.dayOfWeek})
                </h3>
              </div>
              <button onClick={() => setShowManualMealModal(null)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-neutral-300 block mb-1">Nome da Refeição *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Almoço Pós-Treino Personalizado"
                  value={manualMealName}
                  onChange={(e) => setManualMealName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-neutral-300 block mb-1">Categoria</label>
                  <select
                    value={manualMealCategory}
                    onChange={(e) => setManualMealCategory(e.target.value as Meal['category'])}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white"
                  >
                    {['Pequeno-Almoço', 'Almoço', 'Lanche', 'Jantar', 'Ceia', 'Pré/Pós-Treino'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-neutral-300 block mb-1">Horário</label>
                  <input
                    type="time"
                    value={manualMealTime}
                    onChange={(e) => setManualMealTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 p-3 bg-slate-50 dark:bg-neutral-950/60 rounded-xl border border-slate-200 dark:border-neutral-800">
                <div>
                  <label className="text-slate-400 block mb-1">Kcal</label>
                  <input
                    type="number"
                    value={manualMealKcal}
                    onChange={(e) => setManualMealKcal(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-emerald-500 block mb-1">Prot (g)</label>
                  <input
                    type="number"
                    value={manualMealProt}
                    onChange={(e) => setManualMealProt(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-sky-500 block mb-1">Hidr (g)</label>
                  <input
                    type="number"
                    value={manualMealCarbs}
                    onChange={(e) => setManualMealCarbs(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-amber-500 block mb-1">Gord (g)</label>
                  <input
                    type="number"
                    value={manualMealFat}
                    onChange={(e) => setManualMealFat(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-neutral-300 block mb-1">Alimentos</label>
                <textarea
                  rows={2}
                  placeholder="150g Peito de frango&#10;150g Arroz"
                  value={manualMealFoodsText}
                  onChange={(e) => setManualMealFoodsText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowManualMealModal(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-neutral-400 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveManualMeal(showManualMealModal)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  Adicionar a Este Dia
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
