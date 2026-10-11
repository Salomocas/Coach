import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Plus, 
  Scale, 
  Ruler, 
  Calendar, 
  ArrowDown, 
  ArrowUp, 
  CheckCircle2, 
  Sparkles, 
  X, 
  Pencil, 
  Trash2, 
  Activity, 
  BarChart2 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ProgressLog } from '../../types';
import { EvolutionChart, MetricConfig } from '../../components/EvolutionChart';

const CLIENT_STANDARD_METRICS: MetricConfig[] = [
  { key: 'weight', label: 'Peso', unit: 'kg', color: '#f59e0b', isCustom: false },
  { key: 'bodyFat', label: '% Gordura', unit: '%', color: '#06b6d4', isCustom: false },
  { key: 'muscleMass', label: 'Massa Magra', unit: 'kg', color: '#10b981', isCustom: false },
  { key: 'waist', label: 'Cintura', unit: 'cm', color: '#a855f7', isCustom: false },
  { key: 'arm', label: 'Braço', unit: 'cm', color: '#ec4899', isCustom: false },
  { key: 'chest', label: 'Peito', unit: 'cm', color: '#3b82f6', isCustom: false },
  { key: 'thigh', label: 'Coxa', unit: 'cm', color: '#14b8a6', isCustom: false }
];

export const ClientProgressView: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    progressLogs, 
    addProgressLog, 
    updateProgressLog, 
    deleteProgressLog,
    customMetrics 
  } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Multi-selection of metrics to plot/cross in the student chart:
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['weight', 'bodyFat']);

  // Date interval
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Form state
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formWeight, setFormWeight] = useState('');
  const [formFat, setFormFat] = useState('');
  const [formMuscle, setFormMuscle] = useState('');
  const [formChest, setFormChest] = useState('');
  const [formWaist, setFormWaist] = useState('');
  const [formHips, setFormHips] = useState('');
  const [formArm, setFormArm] = useState('');
  const [formThigh, setFormThigh] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formCustomValues, setFormCustomValues] = useState<Record<string, string>>({});

  // Combined metric configs: standard + custom metrics defined by Coach
  const combinedMetricConfigs: MetricConfig[] = useMemo(() => {
    const customList: MetricConfig[] = customMetrics.map(cm => ({
      key: cm.id,
      label: cm.name,
      unit: cm.unit,
      color: cm.color || '#f97316',
      isCustom: true
    }));
    return [...CLIENT_STANDARD_METRICS, ...customList];
  }, [customMetrics]);

  // Sort logs chronologically filtered strictly for the active client
  const sortedLogs = useMemo(() => {
    const athleteId = currentUser?.uid || 'client-ricardo-silva';
    return progressLogs
      .filter(p => p.clientId === athleteId)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [progressLogs, currentUser?.uid]);

  // Initialize date range on mount
  React.useEffect(() => {
    if (sortedLogs.length > 0) {
      setStartDate(sortedLogs[0].date);
      setEndDate(new Date().toISOString().split('T')[0]);
    } else {
      setStartDate('2026-01-01');
      setEndDate(new Date().toISOString().split('T')[0]);
    }
  }, [sortedLogs.length]);

  const latestLog = sortedLogs[sortedLogs.length - 1];
  const firstLog = sortedLogs[0];

  const weightDelta = latestLog && firstLog ? (latestLog.weightKg - firstLog.weightKg).toFixed(1) : '0';
  const waistDelta = latestLog?.waistCm && firstLog?.waistCm ? (latestLog.waistCm - firstLog.waistCm).toFixed(1) : '0';
  const fatDelta = latestLog?.bodyFatPercent && firstLog?.bodyFatPercent ? (latestLog.bodyFatPercent - firstLog.bodyFatPercent).toFixed(1) : null;

  // Toggle metric selection in chart
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

  // Filter logs for the chart
  const filteredLogs = useMemo(() => {
    if (!sortedLogs || sortedLogs.length === 0) return [];
    return sortedLogs.filter(log => {
      const afterStart = !startDate || log.date >= startDate;
      const beforeEnd = !endDate || log.date <= endDate;
      return afterStart && beforeEnd;
    });
  }, [sortedLogs, startDate, endDate]);

  // Open modal for NEW entry
  const handleOpenAddModal = () => {
    setEditingLogId(null);
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormWeight('');
    setFormFat('');
    setFormMuscle('');
    setFormChest('');
    setFormWaist('');
    setFormHips('');
    setFormArm('');
    setFormThigh('');
    setFormNotes('');
    setFormCustomValues({});
    setIsModalOpen(true);
  };

  // Open modal for EDIT entry
  const handleOpenEditModal = (log: ProgressLog) => {
    setEditingLogId(log.id);
    setFormDate(log.date);
    setFormWeight(log.weightKg ? String(log.weightKg) : '');
    setFormFat(log.bodyFatPercent !== undefined ? String(log.bodyFatPercent) : '');
    setFormMuscle(log.muscleMassKg !== undefined ? String(log.muscleMassKg) : '');
    setFormChest(log.chestCm !== undefined ? String(log.chestCm) : '');
    setFormWaist(log.waistCm !== undefined ? String(log.waistCm) : '');
    setFormHips(log.hipsCm !== undefined ? String(log.hipsCm) : '');
    setFormArm(log.armCm !== undefined ? String(log.armCm) : '');
    setFormThigh(log.thighCm !== undefined ? String(log.thighCm) : '');
    setFormNotes(log.notes || '');

    // Fill custom values
    const customs: Record<string, string> = {};
    if (log.customValues) {
      Object.entries(log.customValues).forEach(([k, v]) => {
        customs[k] = String(v);
      });
    }
    setFormCustomValues(customs);
    setIsModalOpen(true);
  };

  // Submit form (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const weightVal = parseFloat(formWeight);
    if (isNaN(weightVal) || weightVal <= 0) {
      setFeedback('Por favor introduz um peso corporal numérico válido.');
      setTimeout(() => setFeedback(null), 3500);
      return;
    }

    // Process custom values
    const customValuesToSave: Record<string, number> = {};
    customMetrics.forEach(cm => {
      const valStr = formCustomValues[cm.id];
      if (valStr && !isNaN(parseFloat(valStr))) {
        customValuesToSave[cm.id] = parseFloat(valStr);
      }
    });

    const payload = {
      date: formDate,
      weightKg: weightVal,
      bodyFatPercent: formFat ? parseFloat(formFat) : undefined,
      muscleMassKg: formMuscle ? parseFloat(formMuscle) : undefined,
      chestCm: formChest ? parseFloat(formChest) : undefined,
      waistCm: formWaist ? parseFloat(formWaist) : undefined,
      hipsCm: formHips ? parseFloat(formHips) : undefined,
      armCm: formArm ? parseFloat(formArm) : undefined,
      thighCm: formThigh ? parseFloat(formThigh) : undefined,
      customValues: Object.keys(customValuesToSave).length > 0 ? customValuesToSave : undefined,
      notes: formNotes.trim() || undefined,
    };

    if (editingLogId) {
      await updateProgressLog(editingLogId, payload);
      setFeedback('Avaliação física atualizada com sucesso!');
    } else {
      await addProgressLog({
        clientId: currentUser?.uid || 'client-ricardo-silva',
        ...payload,
      });
      setFeedback('Nova avaliação física registada com sucesso!');
    }

    setIsModalOpen(false);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Delete handler
  const handleDelete = async (id: string, date: string) => {
    await deleteProgressLog(id);
    setFeedback(`Registo da avaliação de ${date} eliminado com sucesso.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* Toast Feedback */}
      {feedback && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header and Add Assessment Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-neutral-800">
        <div>
          <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
            Acompanhamento Antropométrico & Composição
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-amber-500" />
            Evolução Física
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-1">
            Visualiza a evolução de qualquer medição ao longo do tempo. Podes registar, editar ou eliminar avaliações.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Registar Nova Avaliação</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Peso */}
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-neutral-400 text-xs">
            <span className="font-bold uppercase tracking-wider">Peso Atual</span>
            <Scale className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {latestLog?.weightKg || 80}
            </span>
            <span className="text-xs font-bold text-slate-400">kg</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium">
            {parseFloat(weightDelta) <= 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <ArrowDown className="w-3.5 h-3.5" />
                {Math.abs(parseFloat(weightDelta))} kg desde o início
              </span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                <ArrowUp className="w-3.5 h-3.5" />
                +{weightDelta} kg desde o início
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Gordura Corporal */}
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-neutral-400 text-xs">
            <span className="font-bold uppercase tracking-wider">Gordura Corporal</span>
            <Sparkles className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {latestLog?.bodyFatPercent !== undefined ? latestLog.bodyFatPercent : 16.5}
            </span>
            <span className="text-xs font-bold text-slate-400">%</span>
          </div>
          <div className="mt-2 text-xs font-medium">
            {fatDelta !== null ? (
              parseFloat(fatDelta) <= 0 ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                  <ArrowDown className="w-3.5 h-3.5" />
                  {Math.abs(parseFloat(fatDelta))}% de gordura reduzida
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                  <ArrowUp className="w-3.5 h-3.5" />
                  +{fatDelta}% desde o início
                </span>
              )
            ) : (
              <span className="text-slate-400">Sem histórico anterior</span>
            )}
          </div>
        </div>

        {/* Card 3: Cintura */}
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-neutral-400 text-xs">
            <span className="font-bold uppercase tracking-wider">Cintura</span>
            <Ruler className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {latestLog?.waistCm || 84.5}
            </span>
            <span className="text-xs font-bold text-slate-400">cm</span>
          </div>
          <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
            <ArrowDown className="w-3.5 h-3.5" />
            <span>{Math.abs(parseFloat(waistDelta))} cm de cintura eliminados</span>
          </div>
        </div>

        {/* Card 4: Massa Muscular / Braço */}
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-neutral-400 text-xs">
            <span className="font-bold uppercase tracking-wider">Braço</span>
            <Activity className="w-4 h-4 text-pink-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {latestLog?.armCm || 38.8}
            </span>
            <span className="text-xs font-bold text-slate-400">cm</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-neutral-400 flex items-center gap-1 font-medium">
            <span>Perímetro braquial aferido</span>
          </div>
        </div>

      </div>

      {/* Multi-Metric Graphical Evolution Section */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        
        {/* Controls */}
        <div className="space-y-3 border-b border-slate-100 dark:border-neutral-800/80 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-amber-500" />
                Evolução Gráfica de Medições
              </h3>
              <p className="text-xs text-slate-400 dark:text-neutral-500">
                Seleciona as medições que pretendes cruzar e analisar no gráfico
              </p>
            </div>

            {/* Metric multi-select buttons: allows student to view evolution of ANY measurement */}
            <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-auto">
              <span className="text-[11px] font-bold text-slate-400 mr-1 hidden sm:inline">Medições:</span>
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
                        coach
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date interval De ... até ... */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800/80 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-neutral-300 mr-2">
              <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Intervalo:</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-400">De</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-2.5 py-1 text-xs font-mono text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none shadow-sm cursor-pointer"
              />
            </div>

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
              {filteredLogs.length} medições registadas
            </div>
          </div>
        </div>

        {/* High-Fidelity SVG Interactive Chart Canvas */}
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
            <span className="text-[11px] text-slate-400 font-semibold">Linhas no gráfico:</span>
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

      {/* Numerical History Table with Edit & Delete actions */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              Histórico Numérico de Avaliações
            </h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Clica em <span className="font-semibold text-amber-500">Editar</span> ou <span className="font-semibold text-red-500">Eliminar</span> se te enganaste ao registar qualquer dado.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Medição</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-neutral-800 text-slate-400 dark:text-neutral-400 uppercase tracking-wider font-semibold text-[10px]">
                <th className="py-3 px-3">Data</th>
                <th className="py-3 px-3">Peso</th>
                <th className="py-3 px-3">% Gordura</th>
                <th className="py-3 px-3">Massa Magra</th>
                <th className="py-3 px-3">Cintura</th>
                <th className="py-3 px-3">Peito</th>
                <th className="py-3 px-3">Braço</th>
                <th className="py-3 px-3">Coxa</th>
                {/* Dynamic columns for custom metrics configured by Coach */}
                {customMetrics.map(cm => (
                  <th key={cm.id} className="py-3 px-3 text-amber-600 dark:text-amber-400">
                    {cm.name}
                  </th>
                ))}
                <th className="py-3 px-3">Observações</th>
                <th className="py-3 px-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800/80 font-medium">
              {sortedLogs.length === 0 ? (
                <tr>
                  <td colSpan={10 + customMetrics.length} className="py-8 text-center text-slate-400">
                    Ainda não tens avaliações registadas. Clica em "Registar Nova Avaliação" para começar!
                  </td>
                </tr>
              ) : (
                [...sortedLogs].reverse().map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-neutral-800/40 transition">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {new Date(log.date).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3 px-3 font-mono text-amber-600 dark:text-amber-400 font-bold">
                      {log.weightKg} kg
                    </td>
                    <td className="py-3 px-3 font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                      {log.bodyFatPercent !== undefined ? `${log.bodyFatPercent}%` : '--'}
                    </td>
                    <td className="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      {log.muscleMassKg !== undefined ? `${log.muscleMassKg} kg` : '--'}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700 dark:text-neutral-300">
                      {log.waistCm ? `${log.waistCm} cm` : '--'}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700 dark:text-neutral-300">
                      {log.chestCm ? `${log.chestCm} cm` : '--'}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700 dark:text-neutral-300">
                      {log.armCm ? `${log.armCm} cm` : '--'}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700 dark:text-neutral-300">
                      {log.thighCm ? `${log.thighCm} cm` : '--'}
                    </td>
                    {/* Custom metrics cells */}
                    {customMetrics.map(cm => (
                      <td key={cm.id} className="py-3 px-3 font-mono font-semibold" style={{ color: cm.color }}>
                        {log.customValues && log.customValues[cm.id] !== undefined 
                          ? `${log.customValues[cm.id]} ${cm.unit}` 
                          : '--'}
                      </td>
                    ))}
                    <td className="py-3 px-3 text-slate-500 dark:text-neutral-400 max-w-xs truncate" title={log.notes}>
                      {log.notes || <span className="text-slate-300 dark:text-neutral-600 italic">Sem notas</span>}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEditModal(log)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 transition cursor-pointer"
                          title="Editar esta avaliação"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(log.id, log.date)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition cursor-pointer"
                          title="Eliminar esta avaliação"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Nova Avaliação / Editar Avaliação (Pure Data, com suporte para métricas do aluno) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                  {editingLogId ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    {editingLogId ? 'Editar Avaliação Física' : 'Registar Nova Avaliação Física'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-neutral-400">
                    {editingLogId ? 'Corrige os valores caso te tenhas enganado' : 'Regista o teu peso e perímetros desta semana'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="py-4 space-y-4">
              
              {/* Date */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-neutral-300 block mb-1">
                  Data da Avaliação *
                </label>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Weight & Body Fat */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block mb-1">
                    Peso Corporal (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formWeight}
                    onChange={(e) => setFormWeight(e.target.value)}
                    placeholder="ex: 79.5"
                    className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block mb-1">
                    % Gordura (opcional)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formFat}
                    onChange={(e) => setFormFat(e.target.value)}
                    placeholder="ex: 15.5"
                    className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Muscle Mass & Chest */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block mb-1">
                    Massa Magra (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formMuscle}
                    onChange={(e) => setFormMuscle(e.target.value)}
                    placeholder="ex: 40.2"
                    className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block mb-1">
                    Peito / Tórax (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formChest}
                    onChange={(e) => setFormChest(e.target.value)}
                    placeholder="105"
                    className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Waist & Hips */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block mb-1">
                    Cintura (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formWaist}
                    onChange={(e) => setFormWaist(e.target.value)}
                    placeholder="84"
                    className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block mb-1">
                    Anca (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formHips}
                    onChange={(e) => setFormHips(e.target.value)}
                    placeholder="96"
                    className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Arm & Thigh */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block mb-1">
                    Braço (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formArm}
                    onChange={(e) => setFormArm(e.target.value)}
                    placeholder="38.5"
                    className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block mb-1">
                    Coxa (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formThigh}
                    onChange={(e) => setFormThigh(e.target.value)}
                    placeholder="61"
                    className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Custom Metrics defined by Coach for this Athlete */}
              {customMetrics.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-neutral-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-500 block">
                      Métricas do Teu Plano (Definidas pelo Treinador)
                    </span>
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
                          value={formCustomValues[cm.id] || ''}
                          onChange={(e) => setFormCustomValues(prev => ({ ...prev, [cm.id]: e.target.value }))}
                          placeholder={`Valor em ${cm.unit}`}
                          className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs font-mono text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block mb-1">
                  Notas ou Sensações
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="ex: Boa energia nos treinos, sensação de maior definição na cintura..."
                  className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  {editingLogId ? 'Atualizar Avaliação' : 'Guardar Avaliação'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
