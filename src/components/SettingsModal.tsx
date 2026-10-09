import React, { useState, useRef } from 'react';
import { 
  X, 
  Settings, 
  Sun, 
  Moon, 
  Image as ImageIcon, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound, 
  User, 
  ShieldCheck,
  Check,
  Sliders,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLogo } from '../context/LogoContext';
import { CoachCunhaLogo } from './CoachCunhaLogo';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'theme' | 'logo' | 'security' | 'profile';
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'theme'
}) => {
  const { currentUser, isCoach, isAdmin, changePassword } = useAuth();
  const { theme, setTheme, isDark, toggleTheme } = useTheme();
  const { 
    logoUrl, 
    isCustomLogo, 
    logoDetails, 
    updateLogo, 
    resetToDefaultLogo 
  } = useLogo();

  const [activeTab, setActiveTab] = useState<'theme' | 'logo' | 'security' | 'profile'>(defaultTab);

  // Logo uploader state
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [logoFeedback, setLogoFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isChangingPass, setIsChangingPass] = useState(false);

  if (!isOpen) return null;

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
      setLogoFeedback({
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
        setLogoFeedback({
          type: 'success',
          message: `Logótipo "${file.name}" atualizado com sucesso! Foi aplicado e centralizado em toda a aplicação.`
        });
      }
    };
    reader.onerror = () => {
      setLogoFeedback({
        type: 'error',
        message: 'Não foi possível ler o ficheiro de imagem. Tenta novamente.'
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

  const handleResetLogo = async () => {
    await resetToDefaultLogo();
    setLogoFeedback({
      type: 'success',
      message: 'Logótipo original do Coach Cunha reposto com sucesso.'
    });
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordStatus({ type: 'error', message: 'A nova palavra-passe tem de ter no mínimo 6 caracteres.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'As palavras-passe não coincidem.' });
      return;
    }

    setIsChangingPass(true);
    setPasswordStatus({ type: null, message: '' });

    try {
      const res = await changePassword(newPassword, currentPassword);
      if (res.success) {
        setPasswordStatus({ type: 'success', message: res.message || 'Palavra-passe atualizada com sucesso!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordStatus({ type: 'error', message: res.message || 'Erro ao alterar palavra-passe.' });
      }
    } catch (err: any) {
      setPasswordStatus({ type: 'error', message: err?.message || 'Falha ao atualizar a palavra-passe.' });
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between bg-slate-50/50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Configurações da Aplicação
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Aparência, logótipo da app, segurança e preferências
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-neutral-800 px-5 pt-2 gap-2 bg-slate-50/30 dark:bg-neutral-950/40 overflow-x-auto">
          <button
            onClick={() => setActiveTab('theme')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === 'theme'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            <span>Modo Luz / Escuro</span>
          </button>

          {(isCoach || isAdmin) && (
            <button
              onClick={() => setActiveTab('logo')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                activeTab === 'logo'
                  ? 'border-amber-500 text-amber-500'
                  : 'border-transparent text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Imagens & Logótipo</span>
              {isCustomLogo && (
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </button>
          )}

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Palavra-passe</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Dados de Conta</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">

          {/* TAB 1: THEME TOGGLE */}
          {activeTab === 'theme' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Aparência Visual & Tema
                </h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                  Escolhe o modo que melhor se adapta à tua visão e ambiente de trabalho.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Light Mode Card */}
                <button
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-2xl border text-left transition relative cursor-pointer ${
                    !isDark
                      ? 'border-amber-500 bg-amber-500/5 ring-2 ring-amber-500/20 shadow-md'
                      : 'border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 bg-slate-50 dark:bg-neutral-950'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Sun className="w-5 h-5" />
                    </div>
                    {!isDark && (
                      <span className="flex items-center gap-1 text-[11px] font-extrabold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Ativo
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Modo Claro (Light)</h4>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
                    Fundo branco limpo, ideal para locais iluminados e leitura diurna.
                  </p>
                </button>

                {/* Dark Mode Card */}
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-2xl border text-left transition relative cursor-pointer ${
                    isDark
                      ? 'border-amber-500 bg-amber-500/5 ring-2 ring-amber-500/20 shadow-md'
                      : 'border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 bg-slate-50 dark:bg-neutral-950'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-neutral-800 text-amber-400 flex items-center justify-center">
                      <Moon className="w-5 h-5" />
                    </div>
                    {isDark && (
                      <span className="flex items-center gap-1 text-[11px] font-extrabold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Ativo
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Modo Escuro (Dark)</h4>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
                    Interface escura de alta fidelidade e contraste, suave para a vista.
                  </p>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-neutral-800/60 border border-slate-200 dark:border-neutral-700/60 text-xs text-slate-600 dark:text-neutral-300 flex items-center justify-between">
                <span>Tema atualmente selecionado: <strong className="text-amber-500 uppercase font-mono">{theme}</strong></span>
                <button 
                  onClick={toggleTheme}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition"
                >
                  Alternar Agora
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: LOGO & IMAGES */}
          {activeTab === 'logo' && (isCoach || isAdmin) && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-500" />
                    Logótipo Oficial da Aplicação
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                    Carrega a tua imagem (ex: Logo.jpeg) para ser centralizada em todo o sistema.
                  </p>
                </div>

                {isCustomLogo && (
                  <button
                    onClick={handleResetLogo}
                    className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 dark:hover:text-red-400 font-bold px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition self-start"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Repor Padrão
                  </button>
                )}
              </div>

              {/* Feedback toast */}
              {logoFeedback && (
                <div className={`p-3.5 rounded-2xl text-xs font-medium flex items-center gap-2.5 ${
                  logoFeedback.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                    : 'bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300'
                }`}>
                  {logoFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  )}
                  <span className="flex-1">{logoFeedback.message}</span>
                  <button onClick={() => setLogoFeedback(null)} className="p-0.5">
                    <X className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
                  </button>
                </div>
              )}

              {/* Live Preview Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-2 flex items-center justify-center shrink-0 shadow-sm">
                  <CoachCunhaLogo size="md" showText={false} />
                </div>
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {isCustomLogo ? (logoDetails?.fileName || 'Logótipo Personalizado') : 'Logótipo Padrão Coach Cunha'}
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isCustomLogo
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-200 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400'
                    }`}>
                      {isCustomLogo ? 'Personalizado ✅' : 'Padrão'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
                    Exibido no ecrã de autenticação, cabeçalho e menus de atletas.
                  </p>
                  {logoDetails?.updatedAt && (
                    <p className="text-[11px] text-slate-400 dark:text-neutral-500 font-mono mt-1">
                      Última atualização: {new Date(logoDetails.updatedAt).toLocaleString('pt-PT')}
                    </p>
                  )}
                </div>
              </div>

              {/* Drag & Drop Upload Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed text-center transition cursor-pointer ${
                  dragActive
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-slate-300 dark:border-neutral-700 hover:border-amber-500/60 bg-white dark:bg-neutral-900/50 hover:bg-slate-50 dark:hover:bg-neutral-900'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Arrasta a imagem ou clica para selecionar
                </h4>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
                  Formatos suportados: JPEG, PNG, WEBP, SVG. Recomendado formato quadrado ou proporcional.
                </p>
                <div className="mt-3">
                  <span className="inline-block px-3 py-1.5 rounded-xl bg-amber-500 text-black text-xs font-bold shadow-sm">
                    Escolher Ficheiro
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY & PASSWORD */}
          {activeTab === 'security' && (
            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Alteração de Palavra-passe
                </h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                  Atualiza as tuas credenciais de acesso para manter a conta segura.
                </p>
              </div>

              {passwordStatus.type && (
                <div className={`p-3.5 rounded-2xl text-xs font-medium flex items-center gap-2.5 ${
                  passwordStatus.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                    : 'bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300'
                }`}>
                  {passwordStatus.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  )}
                  <span>{passwordStatus.message}</span>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                    Palavra-passe Atual
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                    Nova Palavra-passe
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                    className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                    Confirmar Nova Palavra-passe
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a nova palavra-passe"
                    required
                    className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="w-full py-2.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs hover:bg-amber-400 transition disabled:opacity-50 cursor-pointer shadow-md shadow-amber-500/10"
                >
                  {isChangingPass ? 'A Guardar...' : 'Atualizar Palavra-passe'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: PROFILE DATA */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Informação do Utilizador
                </h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                  Dados associados à sessão e perfil atual.
                </p>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800">
                <img
                  src={currentUser?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={currentUser?.displayName}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-500 shadow-sm"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                    {currentUser?.displayName}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 truncate">
                    {currentUser?.email}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
                      {isAdmin ? 'Administrador Master' : isCoach ? 'Coach Principal' : 'Atleta Registado'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      Acesso Ativo
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-neutral-800/50 border border-slate-200 dark:border-neutral-700/60 text-xs text-slate-600 dark:text-neutral-300">
                <p>
                  💡 Para editar o teu nome de apresentação ou fotografia de perfil, podes aceder à opção <strong className="text-amber-500">"Editar Perfil"</strong> no menu superior direito.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-neutral-800 flex justify-end bg-slate-50/50 dark:bg-neutral-900/50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-neutral-800 text-slate-800 dark:text-neutral-200 text-xs font-bold hover:bg-slate-300 dark:hover:bg-neutral-700 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
