import React, { useState } from 'react';
import { 
  TrendingUp, 
  Camera, 
  Plus, 
  Scale, 
  Ruler, 
  Calendar, 
  ArrowDown, 
  ArrowUp, 
  CheckCircle2, 
  Sparkles,
  X,
  UploadCloud,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ProgressLog } from '../../types';

export const ClientProgressView: React.FC = () => {
  const { currentUser } = useAuth();
  const { progressLogs, addProgressLog } = useData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPhotoTab, setSelectedPhotoTab] = useState<'front' | 'side' | 'back'>('front');

  // Form state for new entry
  const [newWeight, setNewWeight] = useState('');
  const [newFat, setNewFat] = useState('');
  const [newChest, setNewChest] = useState('');
  const [newWaist, setNewWaist] = useState('');
  const [newHips, setNewHips] = useState('');
  const [newArm, setNewArm] = useState('');
  const [newThigh, setNewThigh] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newPhotoFront, setNewPhotoFront] = useState('');
  const [newPhotoSide, setNewPhotoSide] = useState('');
  const [newPhotoBack, setNewPhotoBack] = useState('');

  // Sort logs chronologically
  const sortedLogs = [...progressLogs].sort((a, b) => a.date.localeCompare(b.date));
  const latestLog = sortedLogs[sortedLogs.length - 1];
  const firstLog = sortedLogs[0];

  const weightDelta = latestLog && firstLog ? (latestLog.weightKg - firstLog.weightKg).toFixed(1) : '0';
  const waistDelta = latestLog?.waistCm && firstLog?.waistCm ? (latestLog.waistCm - firstLog.waistCm).toFixed(1) : '0';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight) return;

    await addProgressLog({
      clientId: currentUser?.uid || 'client-ricardo-silva',
      date: new Date().toISOString().split('T')[0],
      weightKg: parseFloat(newWeight),
      bodyFatPercent: newFat ? parseFloat(newFat) : undefined,
      chestCm: newChest ? parseFloat(newChest) : undefined,
      waistCm: newWaist ? parseFloat(newWaist) : undefined,
      hipsCm: newHips ? parseFloat(newHips) : undefined,
      armCm: newArm ? parseFloat(newArm) : undefined,
      thighCm: newThigh ? parseFloat(newThigh) : undefined,
      photoFront: newPhotoFront || 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=400&q=80',
      photoSide: newPhotoSide || 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=400&q=80',
      photoBack: newPhotoBack || 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=400&q=80',
      notes: newNotes,
    });

    setShowAddModal(false);
    // Reset form
    setNewWeight('');
    setNewFat('');
    setNewChest('');
    setNewWaist('');
    setNewHips('');
    setNewArm('');
    setNewThigh('');
    setNewNotes('');
  };

  // SVG Chart Calculation for weights
  const minWeight = Math.min(...sortedLogs.map(l => l.weightKg), 70) - 1;
  const maxWeight = Math.max(...sortedLogs.map(l => l.weightKg), 90) + 1;
  const chartHeight = 160;
  const chartWidth = 500;

  const points = sortedLogs.map((log, index) => {
    const x = sortedLogs.length > 1 ? (index / (sortedLogs.length - 1)) * (chartWidth - 40) + 20 : chartWidth / 2;
    const y = chartHeight - ((log.weightKg - minWeight) / (maxWeight - minWeight)) * (chartHeight - 30) - 15;
    return { x, y, log };
  });

  const pathD = points.length > 0 
    ? points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '')
    : '';

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`
    : '';

  return (
    <div className="space-y-6">
      
      {/* Header and Add Evaluation Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
            Acompanhamento Antropométrico & Visual
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Evolução Física & Avaliações
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Histórico de pesagens, perímetros corporais e fotos periódicas de controlo.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Avaliação / Pesagem</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Peso Atual</span>
            <Scale className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{latestLog?.weightKg || 80}</span>
            <span className="text-xs text-neutral-400">kg</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium">
            {parseFloat(weightDelta) <= 0 ? (
              <span className="text-emerald-400 flex items-center gap-0.5">
                <ArrowDown className="w-3.5 h-3.5" />
                {Math.abs(parseFloat(weightDelta))} kg desde o início
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-0.5">
                <ArrowUp className="w-3.5 h-3.5" />
                +{weightDelta} kg desde o início
              </span>
            )}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Gordura Corporal</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{latestLog?.bodyFatPercent || 16.5}</span>
            <span className="text-xs text-neutral-400">%</span>
          </div>
          <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
            <span>Redução consistente do % MG</span>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Perímetro Cintura</span>
            <Ruler className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{latestLog?.waistCm || 84.5}</span>
            <span className="text-xs text-neutral-400">cm</span>
          </div>
          <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
            <ArrowDown className="w-3.5 h-3.5" />
            <span>{Math.abs(parseFloat(waistDelta))} cm de cintura eliminados</span>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Braço Relaxado / Contraído</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{latestLog?.armCm || 38.8}</span>
            <span className="text-xs text-neutral-400">cm</span>
          </div>
          <div className="mt-2 text-xs text-amber-400 flex items-center gap-1">
            <ArrowUp className="w-3.5 h-3.5" />
            <span>+1.8 cm de massa muscular no braço</span>
          </div>
        </div>

      </div>

      {/* Graphical Weight Progression Chart */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-white">Evolução do Peso Corporal (kg)</h3>
            <p className="text-xs text-neutral-400">Registo contínuo ao longo das semanas de treino</p>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
            {sortedLogs.length} medições registadas
          </span>
        </div>

        {/* SVG Responsive Line Chart */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[450px]">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44 overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines */}
              {[0, 1, 2, 3].map(i => {
                const y = (chartHeight / 4) * i + 10;
                return (
                  <line
                    key={i}
                    x1="0"
                    y1={y}
                    x2={chartWidth}
                    y2={y}
                    stroke="#262626"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Area Fill */}
              {areaD && <path d={areaD} fill="url(#chartGradient)" />}

              {/* Path Line */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data points */}
              {points.map((pt, i) => (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    fill="#0a0a0a"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    className="hover:r-7 transition-all cursor-pointer"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 12}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="bold"
                    className="font-mono"
                  >
                    {pt.log.weightKg}kg
                  </text>
                  <text
                    x={pt.x}
                    y={chartHeight - 4}
                    textAnchor="middle"
                    fill="#737373"
                    fontSize="9"
                    className="font-mono"
                  >
                    {pt.log.date.slice(5)}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Evolution Photos & Measurements Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Evolution Photos Gallery */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-white">Registo Fotográfico Periódico</h3>
              <p className="text-xs text-neutral-400">Fotos de controlo partilhadas com o treinador</p>
            </div>
            
            {/* View Angle selector */}
            <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
              <button
                onClick={() => setSelectedPhotoTab('front')}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  selectedPhotoTab === 'front' ? 'bg-amber-500 text-black font-bold' : 'text-neutral-400'
                }`}
              >
                Frente
              </button>
              <button
                onClick={() => setSelectedPhotoTab('side')}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  selectedPhotoTab === 'side' ? 'bg-amber-500 text-black font-bold' : 'text-neutral-400'
                }`}
              >
                Perfil
              </button>
              <button
                onClick={() => setSelectedPhotoTab('back')}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  selectedPhotoTab === 'back' ? 'bg-amber-500 text-black font-bold' : 'text-neutral-400'
                }`}
              >
                Costas
              </button>
            </div>
          </div>

          {/* Photo display */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 flex items-center justify-center">
            {latestLog && (
              <img
                src={
                  selectedPhotoTab === 'front' 
                    ? latestLog.photoFront 
                    : selectedPhotoTab === 'side' 
                    ? latestLog.photoSide 
                    : latestLog.photoBack
                }
                alt="Foto de evolução"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute bottom-3 left-3 bg-neutral-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-neutral-800 text-xs text-white font-mono">
              Avaliação de: {latestLog?.date}
            </div>
          </div>

          <p className="text-xs text-neutral-400 mt-3 italic text-center">
            "{latestLog?.notes || 'Evolução consistente na tonificação e linha da cintura.'}"
          </p>
        </div>

        {/* Measurements Evolution Table */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-white">Histórico de Perímetros (cm)</h3>
              <p className="text-xs text-neutral-400">Comparação das últimas medições</p>
            </div>
            <Ruler className="w-5 h-5 text-amber-500" />
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider font-semibold text-[10px]">
                  <th className="py-2.5">Data</th>
                  <th className="py-2.5">Peso</th>
                  <th className="py-2.5">Peito</th>
                  <th className="py-2.5">Cintura</th>
                  <th className="py-2.5">Braço</th>
                  <th className="py-2.5">Perna</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80">
                {sortedLogs.slice().reverse().map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-800/40 transition">
                    <td className="py-3 font-mono font-medium text-white">{log.date}</td>
                    <td className="py-3 font-mono text-amber-400 font-bold">{log.weightKg} kg</td>
                    <td className="py-3 font-mono text-neutral-300">{log.chestCm || '-'} cm</td>
                    <td className="py-3 font-mono text-neutral-300">{log.waistCm || '-'} cm</td>
                    <td className="py-3 font-mono text-neutral-300">{log.armCm || '-'} cm</td>
                    <td className="py-3 font-mono text-neutral-300">{log.thighCm || '-'} cm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800 text-[11px] text-neutral-500 flex items-center justify-between">
            <span>Medições padronizadas em jejum</span>
            <span className="text-amber-500 font-semibold">Validado por Sérgio Cunha</span>
          </div>
        </div>

      </div>

      {/* Modal: New Physical Assessment Entry */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <h3 className="font-bold text-lg text-white">Registar Nova Avaliação Física</h3>
                <p className="text-xs text-neutral-400">Aponta o teu peso e perímetros desta semana</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="py-4 space-y-4">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Peso Corporal (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="ex: 79.5"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    % Massa Gorda (opcional)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newFat}
                    onChange={(e) => setNewFat(e.target.value)}
                    placeholder="ex: 16.0"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                    Peito (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newChest}
                    onChange={(e) => setNewChest(e.target.value)}
                    placeholder="105"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                    Cintura (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newWaist}
                    onChange={(e) => setNewWaist(e.target.value)}
                    placeholder="84"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                    Anca (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newHips}
                    onChange={(e) => setNewHips(e.target.value)}
                    placeholder="96"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                    Braço (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newArm}
                    onChange={(e) => setNewArm(e.target.value)}
                    placeholder="38.5"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                    Coxa / Perna (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newThigh}
                    onChange={(e) => setNewThigh(e.target.value)}
                    placeholder="61"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Notas ou Sensações
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="ex: Boa energia nos treinos, sensação de maior definição na cintura."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-lg shadow-amber-500/20"
                >
                  Guardar Avaliação
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
