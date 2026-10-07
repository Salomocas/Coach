import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Plus, 
  Copy, 
  Trash2, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  Droplet, 
  Clock, 
  Download,
  Check,
  BookOpen,
  Search,
  Filter,
  BookmarkPlus,
  ArrowRight,
  Layers,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { NutritionPlan, DayNutrition, Meal, FoodItem } from '../../types';

export const CoachNutritionBuilderView: React.FC = () => {
  const { allClients } = useAuth();
  const { 
    nutritionTemplates, 
    activeNutritionPlan, 
    nutritionPlans,
    saveNutritionPlan, 
    mealLibrary,
    addMealToLibrary,
    selectedAthleteId, 
    setSelectedAthleteId 
  } = useData();

  const [selectedClientId, setSelectedClientId] = useState<string>(selectedAthleteId || allClients[0]?.uid || 'client-ricardo-silva');
  const [planTitle, setPlanTitle] = useState('Ementa Semanal - Recomposição & Alta Proteína');
  const [dailyCalories, setDailyCalories] = useState(2350);
  const [notes, setNotes] = useState('Ingestão de pelo menos 3.5L de água por dia. Consumir hidratos 2 horas antes do treino.');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Modals state
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [showMealLibraryModal, setShowMealLibraryModal] = useState(false);
  const [libraryModalTab, setLibraryModalTab] = useState<'meals' | 'templates'>('meals');
  const [librarySearchQuery, setLibrarySearchQuery] = useState('');
  const [libraryCategoryFilter, setLibraryCategoryFilter] = useState('Todas');
  const [targetDaysToCopy, setTargetDaysToCopy] = useState<number[]>([]);
  const [publishedNotice, setPublishedNotice] = useState(false);
  const [savedToLibraryNotice, setSavedToLibraryNotice] = useState<string | null>(null);

  // Initialize draft days from active plan or default
  const [days, setDays] = useState<DayNutrition[]>(activeNutritionPlan?.days || []);

  // Sync when selected athlete changes
  React.useEffect(() => {
    if (selectedAthleteId && selectedAthleteId !== selectedClientId) {
      setSelectedClientId(selectedAthleteId);
    }
  }, [selectedAthleteId]);

  // Load client's plan into the builder when client selection changes
  React.useEffect(() => {
    const plan = nutritionPlans.find(p => p.clientId === selectedClientId) || nutritionPlans[0];
    if (plan) {
      setPlanTitle(plan.title);
      setDailyCalories(plan.dailyCalories);
      setNotes(plan.notes || '');
      if (plan.days && plan.days.length > 0) {
        setDays(JSON.parse(JSON.stringify(plan.days)));
      }
    }
  }, [selectedClientId, nutritionPlans]);

  const currentDay = days[selectedDayIndex] || days[0];
  const targetClient = allClients.find(c => c.uid === selectedClientId) || allClients[0];

  const categories = ['Todas', 'Pequeno-Almoço', 'Almoço', 'Jantar', 'Lanche', 'Pré/Pós-Treino', 'Ceia'];

  const filteredLibraryMeals = mealLibrary.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(librarySearchQuery.toLowerCase()) ||
                          m.foods.some(f => f.item.toLowerCase().includes(librarySearchQuery.toLowerCase()));
    const matchesCategory = libraryCategoryFilter === 'Todas' || m.category === libraryCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleApplyTemplate = async (templateId: string) => {
    const tmpl = nutritionTemplates.find(t => t.id === templateId);
    if (!tmpl) return;

    setPlanTitle(tmpl.title);
    setDailyCalories(tmpl.dailyCalories);
    setNotes(tmpl.description);

    // Apply template structure if it has days
    if (tmpl.days && tmpl.days.length > 0) {
      setDays(JSON.parse(JSON.stringify(tmpl.days)));
    } else if (activeNutritionPlan?.days) {
      setDays(JSON.parse(JSON.stringify(activeNutritionPlan.days)));
    }

    setSavedToLibraryNotice(`Modelo "${tmpl.title}" aplicado com sucesso a todos os dias!`);
    setTimeout(() => setSavedToLibraryNotice(null), 3500);
  };

  const handleAddMealBlank = () => {
    const newMeal: Meal = {
      id: 'meal-' + Date.now(),
      name: 'Nova Refeição',
      time: '16:00',
      category: 'Lanche',
      description: 'Refeição proteica personalizada',
      calories: 400,
      proteinG: 30,
      carbsG: 45,
      fatG: 10,
      foods: [
        { item: 'Whey Protein Isolado', quantity: '35g' },
        { item: 'Farinha de Aveia integral', quantity: '50g' }
      ]
    };

    setDays(prev => prev.map((d, i) => {
      if (i === selectedDayIndex) {
        return { ...d, meals: [...d.meals, newMeal] };
      }
      return d;
    }));
  };

  // Pull meal from library into the current day
  const handleInsertMealFromLibrary = (libMeal: Meal) => {
    const clonedMeal: Meal = {
      ...libMeal,
      id: 'meal-' + Date.now(),
      foods: libMeal.foods.map(f => ({ ...f }))
    };

    setDays(prev => prev.map((d, i) => {
      if (i === selectedDayIndex) {
        return { 
          ...d, 
          meals: [...d.meals, clonedMeal],
          totalCalories: d.meals.reduce((acc, m) => acc + m.calories, 0) + clonedMeal.calories,
          totalProtein: d.meals.reduce((acc, m) => acc + m.proteinG, 0) + clonedMeal.proteinG,
          totalCarbs: d.meals.reduce((acc, m) => acc + m.carbsG, 0) + clonedMeal.carbsG,
          totalFat: d.meals.reduce((acc, m) => acc + m.fatG, 0) + clonedMeal.fatG,
        };
      }
      return d;
    }));

    setShowMealLibraryModal(false);
  };

  // Pull full day meal set from template into current day
  const handlePullFullDayTemplate = (templateId: string) => {
    const tmpl = nutritionTemplates.find(t => t.id === templateId);
    if (!tmpl || !activeNutritionPlan?.days[0]) return;

    const templateMeals = JSON.parse(JSON.stringify(activeNutritionPlan.days[0].meals));

    setDays(prev => prev.map((d, i) => {
      if (i === selectedDayIndex) {
        return {
          ...d,
          meals: templateMeals,
          totalCalories: tmpl.dailyCalories,
          totalProtein: tmpl.macros.protein,
          totalCarbs: tmpl.macros.carbs,
          totalFat: tmpl.macros.fat
        };
      }
      return d;
    }));

    setShowMealLibraryModal(false);
  };

  const handleSaveMealToLibrary = async (meal: Meal) => {
    await addMealToLibrary(meal);
    setSavedToLibraryNotice(`Refeição "${meal.name}" gravada na biblioteca com sucesso!`);
    setTimeout(() => setSavedToLibraryNotice(null), 3000);
  };

  const handleRemoveMeal = (mealIdx: number) => {
    setDays(prev => prev.map((d, i) => {
      if (i === selectedDayIndex) {
        return { ...d, meals: d.meals.filter((_, idx) => idx !== mealIdx) };
      }
      return d;
    }));
  };

  const handleAddFoodItem = (mealIdx: number) => {
    setDays(prev => prev.map((d, i) => {
      if (i === selectedDayIndex) {
        const copyMeals = [...d.meals];
        copyMeals[mealIdx].foods.push({ item: 'Novo Alimento', quantity: '100g' });
        return { ...d, meals: copyMeals };
      }
      return d;
    }));
  };

  // Agile Copy & Paste current day meals to selected other days
  const handleExecuteCopy = () => {
    if (!currentDay) return;
    const mealsToCopy = JSON.parse(JSON.stringify(currentDay.meals));

    setDays(prev => prev.map((d, i) => {
      if (targetDaysToCopy.includes(i)) {
        return {
          ...d,
          meals: mealsToCopy,
          totalCalories: currentDay.totalCalories,
          totalProtein: currentDay.totalProtein,
          totalCarbs: currentDay.totalCarbs,
          totalFat: currentDay.totalFat
        };
      }
      return d;
    }));

    setShowCopyModal(false);
    setTargetDaysToCopy([]);
  };

  const handlePublishNutrition = async () => {
    const newPlan: NutritionPlan = {
      id: 'nutri-' + Date.now(),
      clientId: selectedClientId,
      clientName: targetClient?.displayName || 'Atleta',
      coachId: 'coach-sergio-cunha',
      title: planTitle,
      weekStartDate: '2026-10-05',
      weekEndDate: '2026-10-11',
      dailyCalories,
      days,
      notes,
      createdAt: new Date().toISOString()
    };

    await saveNutritionPlan(newPlan);
    setPublishedNotice(true);
    confetti({ particleCount: 70, spread: 60 });
    setTimeout(() => setPublishedNotice(false), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
            Ementas, Templates & Biblioteca de Menus
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Criador de Plano Alimentar Semanal
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Puxa refeições e menus da biblioteca, copia dias de forma ágil e notifica o aluno automaticamente.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              setLibraryModalTab('meals');
              setShowMealLibraryModal(true);
            }}
            className="px-4 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-neutral-700 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>Puxar da Biblioteca ({mealLibrary.length} refeições)</span>
          </button>

          <button
            onClick={handlePublishNutrition}
            className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Publicar & Notificar Aluno</span>
          </button>
        </div>
      </div>

      {publishedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Ementa nutricional associada com sucesso a {targetClient?.displayName}! Notificação enviada.</span>
        </div>
      )}

      {savedToLibraryNotice && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{savedToLibraryNotice}</span>
        </div>
      )}

      {/* Predefined Templates Quick Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Biblioteca de Menus Predefinidos (Vincular com 1 Clique)</span>
          </h3>
          <span className="text-[11px] text-neutral-400">Puxa automaticamente calorias & estrutura</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {nutritionTemplates.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => handleApplyTemplate(tmpl.id)}
              className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/60 cursor-pointer transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-white group-hover:text-amber-400 transition">
                    {tmpl.title}
                  </h4>
                  <span className="font-mono text-xs font-bold text-amber-500">
                    {tmpl.dailyCalories} kcal
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2">{tmpl.description}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[10px] text-neutral-400">
                <span>{tmpl.macros.protein}g P • {tmpl.macros.carbs}g C • {tmpl.macros.fat}g G</span>
                <span className="text-amber-400 font-bold group-hover:underline">Carregar</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Athlete and Basic Plan Info */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">
              Atleta Destinatário *
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => {
                setSelectedClientId(e.target.value);
                setSelectedAthleteId(e.target.value);
              }}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
            >
              {allClients.map(c => (
                <option key={c.uid} value={c.uid}>
                  {c.displayName} ({c.subscriptionStatus === 'active' ? 'Ativo' : 'Pendente'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">
              Título da Ementa *
            </label>
            <input
              type="text"
              value={planTitle}
              onChange={(e) => setPlanTitle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">
              Meta Calórica Diária (kcal)
            </label>
            <input
              type="number"
              value={dailyCalories}
              onChange={(e) => setDailyCalories(parseInt(e.target.value) || 2000)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-300 block mb-1">
            Instruções Nutricionais & Recomendações de Hidratação
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Week Day Pills & Copy Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {days.map((day, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDayIndex(idx)}
              className={`min-w-[70px] sm:min-w-[90px] py-2.5 px-3 rounded-2xl border text-center transition-all ${
                selectedDayIndex === idx
                  ? 'bg-amber-500 text-black border-amber-500 font-extrabold shadow-lg shadow-amber-500/15'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white'
              }`}
            >
              <div className="text-[11px] uppercase">{day.dayOfWeek.slice(0, 3)}</div>
              <div className="text-xs font-bold mt-0.5">{day.meals.length} ref.</div>
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowCopyModal(true)}
          className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-bold flex items-center gap-2 transition shrink-0"
        >
          <Copy className="w-3.5 h-3.5 text-amber-500" />
          <span>Copiar {currentDay?.dayOfWeek} para outros dias</span>
        </button>
      </div>

      {/* Meals in Current Day with Library Pull Button */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4">
        
        {/* Day Header with Library Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
                {currentDay?.dayOfWeek}
              </span>
              <span className="text-neutral-500">•</span>
              <span className="text-xs text-neutral-400 font-mono">
                {currentDay?.meals.length || 0} refeições • {currentDay?.totalCalories || dailyCalories} kcal
              </span>
            </div>
            <h3 className="font-bold text-lg text-white mt-0.5">
              Refeições Programadas
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* PULL FROM LIBRARY BUTTON */}
            <button
              type="button"
              onClick={() => setShowMealLibraryModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-md shadow-amber-500/15 transition"
            >
              <BookOpen className="w-4 h-4" />
              <span>Puxar da Biblioteca</span>
            </button>

            {/* CREATE BLANK MEAL BUTTON */}
            <button
              type="button"
              onClick={handleAddMealBlank}
              className="px-3.5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center gap-1.5 border border-neutral-700 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Criar em Branco</span>
            </button>
          </div>
        </div>

        {/* Meals list */}
        {(!currentDay?.meals || currentDay.meals.length === 0) ? (
          <div className="p-10 text-center border-2 border-dashed border-neutral-800 rounded-2xl">
            <UtensilsCrossed className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-neutral-300">Nenhuma refeição adicionada a {currentDay?.dayOfWeek}</p>
            <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
              Clica em <strong className="text-amber-400">"Puxar da Biblioteca"</strong> para inserir opções pré-definidas (Pequeno-Almoço, Almoço, Jantar, Lanches) ou cria uma refeição em branco.
            </p>
            <button
              type="button"
              onClick={() => setShowMealLibraryModal(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs inline-flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Abrir Biblioteca de Refeições</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {currentDay.meals.map((meal, mIdx) => (
              <div
                key={meal.id}
                className="bg-neutral-950/70 border border-neutral-800 hover:border-neutral-700/80 rounded-2xl p-4 space-y-3 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-neutral-800 text-amber-400 text-xs font-bold font-mono flex items-center justify-center">
                      {mIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={meal.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDays(prev => prev.map((d, i) => {
                          if (i === selectedDayIndex) {
                            const copy = [...d.meals];
                            copy[mIdx].name = val;
                            return { ...d, meals: copy };
                          }
                          return d;
                        }));
                      }}
                      className="bg-transparent font-bold text-white text-sm border-b border-neutral-700 pb-0.5 focus:border-amber-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={meal.time}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDays(prev => prev.map((d, i) => {
                          if (i === selectedDayIndex) {
                            const copy = [...d.meals];
                            copy[mIdx].time = val;
                            return { ...d, meals: copy };
                          }
                          return d;
                        }));
                      }}
                      className="w-16 bg-neutral-900 border border-neutral-800 rounded px-2 py-0.5 text-xs text-amber-400 font-mono text-center focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-xs font-mono mr-2">
                      <span className="text-amber-400 font-bold">{meal.calories} kcal</span>
                      <span className="text-neutral-500">•</span>
                      <span className="text-red-400">{meal.proteinG}g P</span>
                      <span className="text-neutral-500">•</span>
                      <span className="text-blue-400">{meal.carbsG}g C</span>
                      <span className="text-neutral-500">•</span>
                      <span className="text-emerald-400">{meal.fatG}g G</span>
                    </div>

                    {/* SAVE THIS MEAL TO LIBRARY */}
                    <button
                      type="button"
                      onClick={() => handleSaveMealToLibrary(meal)}
                      className="p-1.5 rounded-lg bg-neutral-900 hover:bg-amber-500/20 text-neutral-400 hover:text-amber-400 border border-neutral-800"
                      title="Guardar esta Refeição na Biblioteca para reutilizar com outros atletas"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5" />
                    </button>

                    {/* REMOVE MEAL */}
                    <button
                      type="button"
                      onClick={() => handleRemoveMeal(mIdx)}
                      className="p-1.5 rounded-lg bg-neutral-900 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 border border-neutral-800"
                      title="Remover Refeição"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Foods List */}
                <div className="bg-neutral-900/60 rounded-xl p-3 border border-neutral-800">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-2">
                    Ingredientes & Quantidades Prescritas
                  </span>
                  <div className="space-y-2">
                    {meal.foods.map((food, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs">
                        <input
                          type="text"
                          value={food.item}
                          onChange={(e) => {
                            const val = e.target.value;
                            setDays(prev => prev.map((d, i) => {
                              if (i === selectedDayIndex) {
                                const copy = [...d.meals];
                                copy[mIdx].foods[fIdx].item = val;
                                return { ...d, meals: copy };
                              }
                              return d;
                            }));
                          }}
                          className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-white text-xs focus:border-amber-500 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={food.quantity}
                          onChange={(e) => {
                            const val = e.target.value;
                            setDays(prev => prev.map((d, i) => {
                              if (i === selectedDayIndex) {
                                const copy = [...d.meals];
                                copy[mIdx].foods[fIdx].quantity = val;
                                return { ...d, meals: copy };
                              }
                              return d;
                            }));
                          }}
                          className="w-28 bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-amber-400 font-mono text-xs focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddFoodItem(mIdx)}
                    className="mt-2 text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Adicionar Alimento</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: MEAL LIBRARY PICKER (PUXAR DA BIBLIOTECA) */}
      {showMealLibraryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Biblioteca de Refeições & Menus</h3>
                  <p className="text-xs text-neutral-400">
                    Insere refeições pré-configuradas diretamente em <strong className="text-amber-400">{currentDay?.dayOfWeek}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowMealLibraryModal(false)}
                className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search and Category Filter Bar */}
            <div className="py-3 border-b border-neutral-800 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  value={librarySearchQuery}
                  onChange={(e) => setLibrarySearchQuery(e.target.value)}
                  placeholder="Pesquisar por prato ou ingrediente (aveia, salmão, frango, quinoa, whey...)..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setLibraryCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                      libraryCategoryFilter === cat
                        ? 'bg-amber-500 text-black font-bold'
                        : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Action: Pull complete full-day menu */}
            <div className="p-3 bg-neutral-950/80 rounded-2xl border border-neutral-800 my-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase text-amber-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Puxar Dia Inteiro Completo Pré-Definido
                </span>
                <p className="text-xs text-neutral-400">
                  Preenche este dia com 5 refeições equilibradas com 1 clique:
                </p>
              </div>

              <div className="flex items-center gap-2">
                {nutritionTemplates.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handlePullFullDayTemplate(tmpl.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-amber-500 hover:text-black text-neutral-300 text-[11px] font-bold border border-neutral-800 transition"
                  >
                    {tmpl.title.split('-')[0].trim()}
                  </button>
                ))}
              </div>
            </div>

            {/* Library Meals List */}
            <div className="overflow-y-auto py-2 space-y-3 flex-1 pr-1">
              {filteredLibraryMeals.length === 0 ? (
                <div className="p-8 text-center text-neutral-500 text-xs">
                  Nenhuma refeição encontrada para a pesquisa indicada.
                </div>
              ) : (
                filteredLibraryMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group transition"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {meal.category || 'Refeição'}
                        </span>
                        <span className="font-mono text-xs text-neutral-400">{meal.time}</span>
                        <h4 className="font-bold text-sm text-white group-hover:text-amber-400 transition">
                          {meal.name}
                        </h4>
                      </div>

                      <p className="text-xs text-neutral-400 line-clamp-1 italic">
                        {meal.description}
                      </p>

                      {/* Ingredients pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {meal.foods.map((food, fIdx) => (
                          <span
                            key={fIdx}
                            className="text-[10px] bg-neutral-900 text-neutral-300 px-2 py-0.5 rounded-md border border-neutral-800"
                          >
                            {food.item} <strong className="text-amber-400 font-mono">({food.quantity})</strong>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-900">
                      <div className="text-right font-mono text-xs">
                        <div className="text-amber-400 font-bold">{meal.calories} kcal</div>
                        <div className="text-[10px] text-neutral-400">
                          {meal.proteinG}g P • {meal.carbsG}g C • {meal.fatG}g G
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleInsertMealFromLibrary(meal)}
                        className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition flex items-center gap-1 shadow-md shadow-amber-500/10"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Inserir no Dia</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-neutral-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowMealLibraryModal(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-white text-xs font-semibold"
              >
                Fechar Biblioteca
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Copy-Paste Modal */}
      {showCopyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="font-bold text-lg text-white mb-1">
              Copiar Ementa de {currentDay?.dayOfWeek}
            </h3>
            <p className="text-xs text-neutral-400 mb-4">
              Seleciona para quais dias queres replicar esta mesma estrutura de refeições:
            </p>

            <div className="space-y-2 mb-6">
              {days.map((day, idx) => {
                if (idx === selectedDayIndex) return null;
                const isChecked = targetDaysToCopy.includes(idx);
                return (
                  <label
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer hover:border-neutral-700"
                  >
                    <span className="text-xs font-semibold text-white">{day.dayOfWeek}</span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        setTargetDaysToCopy(prev => 
                          isChecked ? prev.filter(i => i !== idx) : [...prev, idx]
                        );
                      }}
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                  </label>
                );
              })}
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCopyModal(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecuteCopy}
                disabled={targetDaysToCopy.length === 0}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black text-xs font-bold shadow-lg shadow-amber-500/20"
              >
                Replicar Refeições ({targetDaysToCopy.length})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
