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
  FileText
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { DayNutrition, Meal } from '../../types';

export const ClientNutritionView: React.FC = () => {
  const { activeNutritionPlan } = useData();
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [expandedMealId, setExpandedMealId] = useState<string | null>('meal-1');
  const [waterIntakeMl, setWaterIntakeMl] = useState<number>(2250);
  const [completedMeals, setCompletedMeals] = useState<Record<string, boolean>>({ 'meal-1': true, 'meal-2': true });

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
        <p className="text-sm text-neutral-400 mt-1">O Coach Sérgio Cunha irá prescrever a tua ementa alimentar em breve.</p>
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
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                Ementa Nutricional Semanal
              </span>
              <span className="text-xs text-neutral-400">
                Meta Diária: ~{activeNutritionPlan.dailyCalories} kcal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {activeNutritionPlan.title}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-2xl leading-relaxed">
              {activeNutritionPlan.notes}
            </p>
          </div>

          <div className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-4 shrink-0 flex items-center gap-4">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Hidratação Mínima</span>
              <span className="text-lg font-extrabold text-sky-400 flex items-center justify-center gap-1">
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
          return (
            <button
              key={day.index}
              onClick={() => setSelectedDayIndex(day.index)}
              className={`flex-1 min-w-[70px] sm:min-w-[100px] py-3 px-3 rounded-2xl border text-center transition-all ${
                isSelected
                  ? 'bg-amber-500 text-black border-amber-500 font-extrabold shadow-lg shadow-amber-500/15 scale-[1.02]'
                  : 'bg-neutral-900/80 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:text-white'
              }`}
            >
              <div className="text-xs uppercase tracking-wider">{day.label}</div>
              <div className="text-sm font-bold mt-0.5">
                {currentDayNutrition?.totalCalories || activeNutritionPlan.dailyCalories} kcal
              </div>
            </button>
          );
        })}
      </div>

      {/* Day Macro Targets Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-center">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Calorias Totais</span>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {currentDayNutrition?.totalCalories || activeNutritionPlan.dailyCalories}
          </div>
          <span className="text-[10px] text-neutral-500">kcal planeadas</span>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-center">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Proteína</span>
          <div className="text-2xl font-black text-red-400 mt-1">
            {currentDayNutrition?.totalProtein || 180}g
          </div>
          <span className="text-[10px] text-neutral-500">~2.2g / kg corporal</span>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-center">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Hidratos de Carbono</span>
          <div className="text-2xl font-black text-blue-400 mt-1">
            {currentDayNutrition?.totalCarbs || 230}g
          </div>
          <span className="text-[10px] text-neutral-500">Energia & glicogénio</span>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-center">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Gorduras Saudáveis</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {currentDayNutrition?.totalFat || 65}g
          </div>
          <span className="text-[10px] text-neutral-500">Suporte hormonal</span>
        </div>
      </div>

      {/* Interactive Water Tracker */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center font-bold shrink-0">
            <Droplet className="w-5 h-5 fill-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">Registo de Hidratação Diária</h3>
              <span className="text-xs font-mono font-bold text-sky-400">
                {(waterIntakeMl / 1000).toFixed(2)}L / {(currentDayNutrition?.waterIntakeLiters || 3.5).toFixed(1)}L
              </span>
            </div>
            <div className="w-48 sm:w-64 bg-neutral-950 rounded-full h-2 mt-1.5 overflow-hidden border border-neutral-800">
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
            className="px-3 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 text-xs font-semibold flex items-center gap-1 transition"
          >
            <span>+250ml</span>
          </button>
          <button
            type="button"
            onClick={() => setWaterIntakeMl(prev => prev + 500)}
            className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 text-xs font-bold flex items-center gap-1 transition"
          >
            <span>+500ml</span>
          </button>
          <button
            type="button"
            onClick={() => setWaterIntakeMl(0)}
            className="px-2 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-neutral-500 hover:text-neutral-300 text-[11px]"
            title="Repor água"
          >
            Repor
          </button>
        </div>
      </div>

      {/* Meals List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Refeições do Dia • {currentDayNutrition?.dayOfWeek}
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              {Object.values(completedMeals).filter(Boolean).length} / {currentDayNutrition?.meals.length || 0} consumidas
            </span>
          </div>
          <span className="text-xs text-neutral-400">
            {currentDayNutrition?.meals.length || 0} refeições estruturadas
          </span>
        </div>

        {(!currentDayNutrition?.meals || currentDayNutrition.meals.length === 0) ? (
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-8 text-center text-neutral-400 text-sm">
            <Apple className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
            Ementa idêntica à de Segunda-feira para este dia. Mantém a consistência alimentar.
          </div>
        ) : (
          currentDayNutrition.meals.map((meal) => {
            const isExpanded = expandedMealId === meal.id;
            const isCompleted = !!completedMeals[meal.id];

            return (
              <div
                key={meal.id}
                className={`bg-neutral-900 border rounded-2xl overflow-hidden transition-all shadow-md ${
                  isCompleted ? 'border-emerald-500/40 bg-neutral-900/90' : 'border-neutral-800 hover:border-neutral-700/80'
                }`}
              >
                {/* Meal Header */}
                <div
                  className="p-4 sm:p-5 flex items-center justify-between select-none"
                >
                  <div 
                    onClick={() => toggleMealExpand(meal.id)}
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-amber-500'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-400">{meal.time}</span>
                        <h3 className="font-bold text-base text-white">{meal.name}</h3>
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">{meal.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
                      <span className="text-amber-400 font-bold">{meal.calories} kcal</span>
                      <span className="text-neutral-500">•</span>
                      <span className="text-red-400">{meal.proteinG}g P</span>
                      <span className="text-neutral-500">•</span>
                      <span className="text-blue-400">{meal.carbsG}g C</span>
                      <span className="text-neutral-500">•</span>
                      <span className="text-emerald-400">{meal.fatG}g G</span>
                    </div>

                    {/* Meal completed checkmark button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCompletedMeals(prev => ({ ...prev, [meal.id]: !prev[meal.id] }));
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700'
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-400' : 'text-neutral-500'}`} />
                      <span>{isCompleted ? 'Consumida' : 'Marcar'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleMealExpand(meal.id)}
                      className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Food Items List */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-neutral-800/80 bg-neutral-950/40">
                    <div className="mt-3">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                        Ingredientes & Quantidades Prescritas
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {meal.foods.map((food, fIdx) => (
                          <div
                            key={fIdx}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900 border border-neutral-800/80 text-xs"
                          >
                            <span className="font-medium text-neutral-200">{food.item}</span>
                            <span className="font-mono font-bold text-amber-400 ml-2">{food.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-neutral-900">
                      <span>Substituições: Caso não tenhas peito de frango, podes substituir por peru ou pescada na mesma quantidade.</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
