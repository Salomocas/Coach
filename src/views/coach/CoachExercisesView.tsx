import React, { useState } from 'react';
import { 
  Dumbbell, 
  Plus, 
  Search, 
  Filter, 
  Play, 
  Edit2, 
  Trash2, 
  X, 
  CheckCircle2, 
  Sparkles,
  Video,
  Info
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Exercise } from '../../types';

export const CoachExercisesView: React.FC = () => {
  const { exercises, addExercise, updateExercise, deleteExercise } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Todos');
  const [showModal, setShowModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Exercise['category']>('Peito');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [equipment, setEquipment] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [instructions, setInstructions] = useState('');

  const categories: ('Todos' | Exercise['category'])[] = [
    'Todos', 'Peito', 'Costas', 'Pernas', 'Ombros', 'Braços', 'Core', 'Cardio', 'Mobilidade'
  ];

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'Todos' || ex.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenCreate = () => {
    setEditingExercise(null);
    setName('');
    setCategory('Peito');
    setMuscleGroup('');
    setEquipment('');
    setVideoUrl('');
    setImageUrl('');
    setInstructions('');
    setShowModal(true);
  };

  const handleOpenEdit = (ex: Exercise) => {
    setEditingExercise(ex);
    setName(ex.name);
    setCategory(ex.category);
    setMuscleGroup(ex.muscleGroup);
    setEquipment(ex.equipment || '');
    setVideoUrl(ex.videoUrl || '');
    setImageUrl(ex.imageUrl || '');
    setInstructions(ex.instructions);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingExercise) {
      await updateExercise(editingExercise.id, {
        name,
        category,
        muscleGroup,
        equipment,
        videoUrl,
        imageUrl,
        instructions
      });
    } else {
      await addExercise({
        coachId: 'coach-sergio-cunha',
        name,
        category,
        muscleGroup: muscleGroup || 'Geral',
        equipment,
        videoUrl: videoUrl || 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80',
        instructions: instructions || 'Execução estrita com cadência controlada e respiração diafragmática.'
      });
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
            Variáveis Reutilizáveis & Vídeos
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Biblioteca de Exercícios do Coach
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Cadastra exercícios com links de demonstração e instruções posturais para vincular diretamente aos planos.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Exercício</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-900 border border-neutral-800 rounded-2xl p-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar exercício ou músculo..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                categoryFilter === cat ? 'bg-amber-500 text-black font-bold' : 'bg-neutral-950 text-neutral-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map((ex) => (
          <div
            key={ex.id}
            className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-3xl p-5 flex flex-col justify-between transition-all shadow-md group"
          >
            <div>
              {/* Image & Video Tag */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 mb-3">
                <img
                  src={ex.imageUrl || 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80'}
                  alt={ex.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-2 left-2 bg-neutral-950/80 backdrop-blur-md text-[10px] uppercase font-bold px-2 py-0.5 rounded-md text-amber-400 border border-neutral-800">
                  {ex.category}
                </span>
                {ex.videoUrl && (
                  <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md text-[10px] font-bold px-2 py-1 rounded-lg text-white flex items-center gap-1">
                    <Video className="w-3 h-3 text-red-500" />
                    Vídeo Demo
                  </span>
                )}
              </div>

              {/* Title & Muscles */}
              <h3 className="font-bold text-base text-white">{ex.name}</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Foco: <span className="text-neutral-200 font-medium">{ex.muscleGroup}</span>
              </p>
              {ex.equipment && (
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Equipamento: {ex.equipment}
                </p>
              )}

              {/* Instructions preview */}
              <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed italic bg-neutral-950/40 p-2.5 rounded-xl border border-neutral-800/80">
                "{ex.instructions}"
              </p>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-[10px] text-neutral-500 font-mono">
                Variável de treino
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(ex)}
                  className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                  title="Editar"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteExercise(ex.id)}
                  className="p-2 rounded-xl bg-neutral-800 hover:bg-red-500/20 text-neutral-400 hover:text-red-400"
                  title="Eliminar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create/Edit Exercise */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <h3 className="font-bold text-lg text-white">
                  {editingExercise ? 'Editar Exercício' : 'Adicionar Novo Exercício'}
                </h3>
                <p className="text-xs text-neutral-400">
                  Preenche os dados e o vídeo demonstrativo
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="py-4 space-y-4">
              
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Nome do Exercício *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: Supino Inclinado com Halteres"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    {categories.filter(c => c !== 'Todos').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Músculo Alvo / Grupo
                  </label>
                  <input
                    type="text"
                    value={muscleGroup}
                    onChange={(e) => setMuscleGroup(e.target.value)}
                    placeholder="ex: Peitoral Superior, Tríceps"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Equipamento Necessário
                </label>
                <input
                  type="text"
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                  placeholder="ex: Banco Inclinado 30° e Halteres"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  URL do Vídeo Demonstrativo (YouTube / Vimeo / MP4)
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  URL da Imagem de Capa
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Instruções de Execução & Cues do Coach
                </label>
                <textarea
                  rows={3}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Descreve o posicionamento das omoplatas, cotovelos, trajetória e cadência..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-lg shadow-amber-500/20"
                >
                  {editingExercise ? 'Atualizar Exercício' : 'Gravar Exercício'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
