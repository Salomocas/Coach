import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Link as LinkIcon, 
  Check, 
  Camera, 
  User, 
  Phone, 
  Loader2, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Curated avatar options for quick selection
const PRESET_AVATARS = [
  {
    label: 'Treinador Sérgio',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  },
  {
    label: 'Atleta Fitness 1',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  },
  {
    label: 'Atleta Fitness 2',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
  },
  {
    label: 'Atleta Musculação',
    url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80'
  },
  {
    label: 'Atleta Corrida',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
  },
  {
    label: 'Atleta Performance',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
  }
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateUserProfile } = useAuth();
  
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [activePhotoTab, setActivePhotoTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever modal opens
  React.useEffect(() => {
    if (isOpen && currentUser) {
      setDisplayName(currentUser.displayName || '');
      setPhotoURL(currentUser.photoURL || '');
      setPhone(currentUser.phone || '');
      setCustomUrlInput(currentUser.photoURL || '');
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  // Handle local file upload & compress/convert to data URL
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Por favor selecione um ficheiro de imagem válido (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('A imagem é demasiado grande. Por favor escolha uma imagem até 5MB.');
      return;
    }

    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize to optimal avatar dimensions (max 500x500) to keep Firestore doc lightweight
        const canvas = document.createElement('canvas');
        const MAX_DIM = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setPhotoURL(compressedDataUrl);
        } else {
          setPhotoURL(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!customUrlInput.trim()) {
      setErrorMsg('Por favor insira um link de imagem válido.');
      return;
    }
    setErrorMsg('');
    setPhotoURL(customUrlInput.trim());
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setErrorMsg('O nome não pode estar em branco.');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');

    try {
      await updateUserProfile({
        displayName: displayName.trim(),
        photoURL: photoURL.trim(),
        phone: phone.trim()
      });

      setSuccessMsg('Perfil atualizado com sucesso!');
      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 700);
    } catch (err) {
      console.error('Error saving profile:', err);
      setErrorMsg('Erro ao guardar alterações. Tente novamente.');
      setIsSaving(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Editar Perfil</h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400">Atualiza o teu nome e fotografia de perfil</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Avatar Section */}
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-5 p-4 bg-slate-50 dark:bg-neutral-950/60 rounded-xl border border-slate-200 dark:border-neutral-800/80">
            {/* Avatar Preview */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-amber-500/40 shadow-lg bg-slate-200 dark:bg-neutral-800">
                <img 
                  src={photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'} 
                  alt={displayName} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if broken image URL
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity cursor-pointer"
                title="Alterar fotografia"
              >
                <Camera className="w-5 h-5 mb-1 text-amber-400" />
                <span className="text-[10px] font-semibold">Alterar</span>
              </button>
            </div>

            {/* Photo Edit Options */}
            <div className="flex-1 w-full space-y-3">
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setActivePhotoTab('upload')}
                  className={`flex-1 py-1.5 px-2 rounded-md font-medium text-center transition ${
                    activePhotoTab === 'upload' 
                      ? 'bg-amber-500 text-black font-semibold shadow-sm' 
                      : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Carregar Ficheiro
                </button>
                <button
                  type="button"
                  onClick={() => setActivePhotoTab('url')}
                  className={`flex-1 py-1.5 px-2 rounded-md font-medium text-center transition ${
                    activePhotoTab === 'url' 
                      ? 'bg-amber-500 text-black font-semibold shadow-sm' 
                      : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Link URL
                </button>
                <button
                  type="button"
                  onClick={() => setActivePhotoTab('presets')}
                  className={`flex-1 py-1.5 px-2 rounded-md font-medium text-center transition ${
                    activePhotoTab === 'presets' 
                      ? 'bg-amber-500 text-black font-semibold shadow-sm' 
                      : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Predefinidos
                </button>
              </div>

              {/* Sub-tab 1: Upload */}
              {activePhotoTab === 'upload' && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 px-3 border border-dashed border-slate-300 dark:border-neutral-700 hover:border-amber-500/50 rounded-xl text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-neutral-900/60 flex items-center justify-center gap-2 text-xs transition group"
                  >
                    <Upload className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                    <span>Escolher imagem do dispositivo</span>
                  </button>
                  <p className="text-[11px] text-slate-400 dark:text-neutral-500 text-center mt-1.5">
                    Formatos JPG, PNG ou WebP até 5MB
                  </p>
                </div>
              )}

              {/* Sub-tab 2: URL */}
              {activePhotoTab === 'url' && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500" />
                      <input
                        type="url"
                        value={customUrlInput}
                        onChange={(e) => setCustomUrlInput(e.target.value)}
                        placeholder="https://exemplo.com/minha-foto.jpg"
                        className="w-full pl-9 pr-3 py-2 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyUrl}
                      className="px-3 py-2 bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 text-slate-900 dark:text-white rounded-lg text-xs font-semibold transition"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              )}

              {/* Sub-tab 3: Presets */}
              {activePhotoTab === 'presets' && (
                <div className="grid grid-cols-6 gap-2">
                  {PRESET_AVATARS.map((avatar, idx) => (
                    <button
                      key={idx}
                      type="button"
                      title={avatar.label}
                      onClick={() => setPhotoURL(avatar.url)}
                      className={`relative w-full aspect-square rounded-lg overflow-hidden border transition ${
                        photoURL === avatar.url 
                          ? 'border-amber-500 ring-2 ring-amber-500/40 scale-105' 
                          : 'border-slate-200 dark:border-neutral-800 hover:border-slate-400 dark:hover:border-neutral-600 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={avatar.url} alt={avatar.label} className="w-full h-full object-cover" />
                      {photoURL === avatar.url && (
                        <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-amber-400 drop-shadow" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Text Fields */}
          <div className="space-y-4">
            {/* Nome */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
                Nome de Exibição <span className="text-amber-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ex: Sérgio Cunha ou Ricardo Silva"
                  className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>

            {/* Email (Read-only reference) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
                Endereço de Email
              </label>
              <input
                type="email"
                disabled
                value={currentUser?.email || ''}
                className="w-full px-3 py-2.5 bg-slate-100 dark:bg-neutral-950/60 border border-slate-200 dark:border-neutral-800/60 rounded-xl text-sm text-slate-500 dark:text-neutral-400 cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1">
                Associado à tua conta de utilizador
              </p>
            </div>

            {/* Telefone / WhatsApp */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
                Contacto Telefónico / WhatsApp
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+351 912 345 678"
                  className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white font-medium text-xs transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-2 transition disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>A guardar...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Guardar Alterações</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
