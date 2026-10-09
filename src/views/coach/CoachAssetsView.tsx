import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Download, 
  Trash2, 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  Layers, 
  FileText,
  Plus
} from 'lucide-react';
import { useLogo } from '../../context/LogoContext';
import { CoachCunhaLogo } from '../../components/CoachCunhaLogo';

export const CoachAssetsView: React.FC = () => {
  const { 
    logoUrl, 
    isCustomLogo, 
    logoDetails, 
    assets, 
    updateLogo, 
    resetToDefaultLogo, 
    addAsset, 
    removeAsset 
  } = useLogo();

  const [dragActive, setDragActive] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const extraAssetInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setFeedback({
        type: 'error',
        message: 'Por favor carrega um ficheiro de imagem válido (JPEG, PNG, WEBP, SVG).'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        updateLogo(dataUrl, file.name, file.size);
        setFeedback({
          type: 'success',
          message: `Imagem "${file.name}" carregada com sucesso! O teu logótipo oficial foi atualizado e está agora centralizado em toda a aplicação.`
        });
      }
    };
    reader.onerror = () => {
      setFeedback({
        type: 'error',
        message: 'Não foi possível ler o ficheiro. Tenta novamente.'
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleExtraAssetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        if (url) {
          addAsset({
            name: file.name,
            url,
            sizeBytes: file.size,
            category: 'hero'
          });
          setFeedback({
            type: 'success',
            message: `Imagem "${file.name}" adicionada à galeria de ativos!`
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredAssets = selectedCategory === 'all' 
    ? assets 
    : assets.filter(a => a.category === selectedCategory);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
              Personalização & Multimédia
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mt-1">
            Gestor de Assets & Imagens
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-1">
            Larga a tua imagem oficial (<code className="text-amber-500 font-mono font-bold">Logo.jpeg</code>) para definir o logótipo central da aplicação e autenticação.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isCustomLogo && (
            <button
              onClick={() => {
                resetToDefaultLogo();
                setFeedback({
                  type: 'success',
                  message: 'Logótipo reposto para o modelo de fábrica.'
                });
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-800 text-xs font-semibold text-slate-700 dark:text-neutral-300 transition"
              title="Repor emblema padrão"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Repor Original</span>
            </button>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-md shadow-amber-500/20 transition cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Carregar Ficheiro</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div className={`p-4 rounded-2xl flex items-start justify-between gap-3 text-xs animate-fade-in ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200' 
            : 'bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200'
        }`}>
          <div className="flex items-start gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button 
            onClick={() => setFeedback(null)} 
            className="text-xs font-bold hover:underline opacity-80 cursor-pointer"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Main Drag & Drop Zone */}
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer group ${
          dragActive 
            ? 'border-amber-500 bg-amber-500/10 scale-[1.01]' 
            : 'border-slate-300 dark:border-neutral-700/80 bg-slate-50/50 dark:bg-neutral-900/40 hover:border-amber-500/80 hover:bg-amber-500/5'
        }`}
      >
        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300 shadow-lg shadow-amber-500/10">
            <Upload className="w-8 h-8" />
          </div>

          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Arrasta e solta aqui a tua imagem (<code className="text-amber-500 font-mono">Logo.jpeg</code>)
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-1 mb-4">
            Ou clica para escolher no teu computador. Suporta JPEG, PNG, WEBP e SVG.
          </p>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200/80 dark:bg-neutral-800 text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Fica instantaneamente aplicado no centro da autenticação e topo do app</span>
          </div>
        </div>
      </div>

      {/* Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Preview 1: Center of Authentication Portal */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 border border-neutral-800 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              1. Visão Central na Autenticação
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
              Vista ao Vivo
            </span>
          </div>

          <div className="py-8 flex flex-col items-center justify-center min-h-[260px] bg-neutral-950/80 rounded-2xl border border-neutral-800/80 p-4">
            <CoachCunhaLogo size="xl" showText={false} />
            <div className="mt-4 text-center">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                Coach Cunha Project
              </span>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Área Exclusiva de Acesso
              </p>
            </div>
          </div>

          <p className="text-[11px] text-neutral-400 mt-4 text-center">
            Este é o elemento central que todos os utilizadores veem ao aceder à página de login.
          </p>
        </div>

        {/* Preview 2: Navbar Header */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-slate-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                2. Visão na Barra Superior (Navbar)
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 font-bold">
                Cabeçalho
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-neutral-950 rounded-2xl border border-slate-200 dark:border-neutral-800 flex items-center gap-3">
              <div className="w-10 h-14 flex items-center justify-center">
                <img 
                  src={logoUrl} 
                  alt="Navbar preview" 
                  className="w-full h-full object-contain filter drop-shadow-md"
                />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase leading-tight">
                  Coach Cunha <span className="text-amber-500">Project</span>
                </h4>
                <p className="text-[10px] text-slate-400 dark:text-neutral-500 font-medium">
                  Painel de Alta Performance
                </p>
              </div>
            </div>
          </div>

          {/* Details & Metadata Card */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-neutral-800 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-600 dark:text-neutral-400">
              <span>Estado Atual:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isCustomLogo ? 'Logótipo Personalizado Ativo' : 'Modelo Padrão'}
              </span>
            </div>
            {logoDetails && (
              <>
                <div className="flex justify-between items-center text-slate-600 dark:text-neutral-400">
                  <span>Nome do Ficheiro:</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">{logoDetails.fileName}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 dark:text-neutral-400">
                  <span>Tamanho Estimado:</span>
                  <span className="font-semibold">{logoDetails.fileSizeKb} KB</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Preview 3: Original Asset & Direct Actions */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-slate-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                3. Ações do Ativo Oficial
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 font-bold">
                Gestão
              </span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-neutral-950 rounded-2xl border border-slate-200 dark:border-neutral-800 flex flex-col items-center justify-center min-h-[160px]">
              <img 
                src={logoUrl} 
                alt="Full logo view" 
                className="max-h-32 object-contain filter drop-shadow-xl"
              />
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <a 
              href={logoUrl} 
              download={logoDetails?.fileName || 'coach_cunha_logo.png'}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 text-slate-800 dark:text-white font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descarregar Cópia do Ficheiro</span>
            </a>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Substituir por Outra Imagem</span>
            </button>
          </div>
        </div>

      </div>

      {/* Gallery of App Pictures / Media Assets */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-neutral-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-500" />
              <span>Galeria de Imagens do Projeto</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
              Ficheiros multimédia guardados para treinos, ementas e transformações físicas dos atletas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => extraAssetInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 text-slate-800 dark:text-white font-bold text-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-500" />
              <span>Adicionar Foto / Imagem</span>
            </button>
            <input 
              type="file" 
              ref={extraAssetInputRef} 
              onChange={handleExtraAssetUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap gap-2 mb-5">
          {[
            { id: 'all', label: 'Todos os Ficheiros' },
            { id: 'logo', label: 'Logótipos & Badges' },
            { id: 'hero', label: 'Banners & Fotos' },
            { id: 'athlete', label: 'Atletas & Transformações' },
            { id: 'exercise', label: 'Exercícios' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-black font-bold'
                  : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredAssets.map(asset => (
            <div 
              key={asset.id} 
              className="group relative bg-slate-50 dark:bg-neutral-950 rounded-2xl border border-slate-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
            >
              <div className="aspect-square w-full p-2 flex items-center justify-center bg-slate-100/50 dark:bg-neutral-900/50 relative overflow-hidden">
                <img 
                  src={asset.url} 
                  alt={asset.name} 
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300" 
                />

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button
                    onClick={() => updateLogo(asset.url, asset.name, asset.sizeBytes)}
                    className="p-1.5 rounded-lg bg-amber-500 text-black hover:bg-amber-400 transition"
                    title="Definir como logótipo oficial"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                  <a
                    href={asset.url}
                    download={asset.name}
                    className="p-1.5 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 transition"
                    title="Descarregar"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  {asset.id !== 'default-logo-badge' && (
                    <button
                      onClick={() => removeAsset(asset.id)}
                      className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-500 transition"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="p-2.5">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate" title={asset.name}>
                  {asset.name}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-neutral-500 mt-1">
                  <span className="capitalize">{asset.category}</span>
                  {asset.url === logoUrl && (
                    <span className="text-amber-500 font-extrabold">Ativo</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
