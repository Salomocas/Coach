import React, { useState, useRef, useEffect } from 'react';
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
  Check,
  Sparkles,
  Smartphone,
  Layout,
  Lock,
  Trash2,
  Eye,
  EyeOff,
  Shield,
  Database,
  Users,
  Send,
  MailCheck,
  Server
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLogo } from '../context/LogoContext';
import { CoachCunhaLogo } from './CoachCunhaLogo';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'theme' | 'logo' | 'security' | 'profile' | 'database';
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'logo'
}) => {
  const { currentUser, isCoach, isAdmin, changePassword, allClients, deleteClientAccount } = useAuth();
  const { theme, setTheme, isDark } = useTheme();
  const { 
    logoUrl, 
    isCustomLogo, 
    isLogoRemoved,
    showAuthLogo,
    logoDetails, 
    updateLogo, 
    resetToDefaultLogo,
    removeLogoCompletely,
    toggleAuthLogo
  } = useLogo();

  const [activeTab, setActiveTab] = useState<'theme' | 'logo' | 'security' | 'profile' | 'database' | 'smtp'>(defaultTab);

  // Sync tab when modal opens or defaultTab changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab, isOpen]);

  // Logo uploader state
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [logoFeedback, setLogoFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSavingLogo, setIsSavingLogo] = useState(false);
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

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setLogoFeedback({
        type: 'error',
        message: 'Por favor carrega um ficheiro de imagem válido (PNG, JPEG, WEBP ou SVG).'
      });
      return;
    }

    setIsSavingLogo(true);
    setLogoFeedback(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        try {
          await updateLogo(dataUrl, file.name, file.size);
          setLogoFeedback({
            type: 'success',
            message: `Logótipo "${file.name}" gravado com sucesso! Aplicado imediatamente no ecrã de login, cabeçalho e toda a plataforma.`
          });
        } catch (err: any) {
          setLogoFeedback({
            type: 'error',
            message: 'Erro ao gravar o logótipo. Tenta novamente com outra imagem.'
          });
        } finally {
          setIsSavingLogo(false);
        }
      }
    };
    reader.onerror = () => {
      setIsSavingLogo(false);
      setLogoFeedback({
        type: 'error',
        message: 'Não foi possível ler o ficheiro de imagem.'
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
    setIsSavingLogo(true);
    try {
      await resetToDefaultLogo();
      setLogoFeedback({
        type: 'success',
        message: 'Logótipo padrão do Coach Cunha reposto com sucesso no Firebase e no dispositivo.'
      });
    } catch (e: any) {
      setLogoFeedback({
        type: 'error',
        message: 'Não foi possível repor o logótipo original: ' + (e?.message || '')
      });
    } finally {
      setIsSavingLogo(false);
    }
  };

  const handleRemoveLogo = async () => {
    setIsSavingLogo(true);
    try {
      await removeLogoCompletely();
      setLogoFeedback({
        type: 'success',
        message: 'Logótipo eliminado da página inicial e do sistema! Alterações gravadas permanentemente.'
      });
    } catch (e: any) {
      setLogoFeedback({
        type: 'error',
        message: 'Erro ao eliminar o logótipo: ' + (e?.message || 'Tenta novamente.')
      });
    } finally {
      setIsSavingLogo(false);
    }
  };

  const handleToggleAuthLogo = async (show: boolean) => {
    setIsSavingLogo(true);
    try {
      await toggleAuthLogo(show);
      setLogoFeedback({
        type: 'success',
        message: show 
          ? 'Visibilidade do logótipo ativada na página inicial.'
          : 'Logótipo ocultado da página inicial (ecrã de login).'
      });
    } catch (e: any) {
      setLogoFeedback({
        type: 'error',
        message: 'Erro ao alterar visibilidade: ' + (e?.message || '')
      });
    } finally {
      setIsSavingLogo(false);
    }
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

  const [dbSearch, setDbSearch] = useState('');
  const [accountToDelete, setAccountToDelete] = useState<{ uid: string; name: string; email: string } | null>(null);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [accountActionFeedback, setAccountActionFeedback] = useState<string | null>(null);

  // SMTP Settings State
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('465');
  const [smtpSecure, setSmtpSecure] = useState(true);
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [smtpFromName, setSmtpFromName] = useState('Coach Cunha');
  const [smtpFromEmail, setSmtpFromEmail] = useState('noreply@coachcunha.pt');
  const [smtpStatusInfo, setSmtpStatusInfo] = useState<{ configured: boolean; source: string; host: string | null } | null>(null);
  const [smtpFeedback, setSmtpFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [isSavingSmtp, setIsSavingSmtp] = useState(false);

  useEffect(() => {
    // Fetch SMTP status on open
    if (isOpen) {
      fetch('/api/smtp/status')
        .then(res => res.json())
        .then(data => {
          setSmtpStatusInfo(data);
          if (data.host) setSmtpHost(data.host);
          if (data.port) setSmtpPort(String(data.port));
          if (data.secure !== undefined) setSmtpSecure(data.secure);
          if (data.fromName) setSmtpFromName(data.fromName);
          if (data.fromEmail) setSmtpFromEmail(data.fromEmail);
        })
        .catch(err => console.warn('Could not check SMTP status:', err));
    }
  }, [isOpen]);

  const handleTestSmtp = async () => {
    setIsTestingSmtp(true);
    setSmtpFeedback(null);
    try {
      const res = await fetch('/api/smtp/verify-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: smtpHost.trim(),
          port: Number(smtpPort),
          secure: smtpSecure,
          user: smtpUser.trim(),
          pass: smtpPass.trim(),
          fromName: smtpFromName.trim(),
          fromEmail: smtpFromEmail.trim(),
          saveToRuntime: true
        })
      });
      const data = await res.json();
      if (data.success) {
        setSmtpFeedback({ type: 'success', message: data.message });
        setSmtpStatusInfo({ configured: true, source: 'runtime_saved', host: smtpHost });
      } else {
        setSmtpFeedback({ type: 'error', message: data.message });
      }
    } catch (e: any) {
      setSmtpFeedback({ type: 'error', message: e.message || 'Falha ao testar conexão SMTP.' });
    } finally {
      setIsTestingSmtp(false);
    }
  };

  const handleSaveSmtp = async () => {
    setIsSavingSmtp(true);
    setSmtpFeedback(null);
    try {
      const res = await fetch('/api/smtp/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: smtpHost.trim(),
          port: Number(smtpPort),
          secure: smtpSecure,
          user: smtpUser.trim(),
          pass: smtpPass.trim(),
          fromName: smtpFromName.trim(),
          fromEmail: smtpFromEmail.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setSmtpFeedback({ type: 'success', message: 'Configurações SMTP guardadas com sucesso no servidor!' });
        setSmtpStatusInfo({ configured: !!smtpHost && !!smtpUser, source: 'runtime_saved', host: smtpHost });
      } else {
        setSmtpFeedback({ type: 'error', message: data.message });
      }
    } catch (e: any) {
      setSmtpFeedback({ type: 'error', message: e.message || 'Erro ao guardar configurações SMTP.' });
    } finally {
      setIsSavingSmtp(false);
    }
  };

  const handleDeleteAccountSubmit = async () => {
    if (!accountToDelete) return;
    setIsDeletingAccount(true);
    try {
      await deleteClientAccount(accountToDelete.uid);
      setAccountActionFeedback(`A conta de ${accountToDelete.name} (${accountToDelete.email}) foi eliminada definitivamente da base de dados.`);
      setAccountToDelete(null);
      setTimeout(() => setAccountActionFeedback(null), 6000);
    } catch (e: any) {
      setAccountActionFeedback(`Erro ao eliminar conta: ${e?.message || 'Tenta novamente.'}`);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
        <div 
          className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-6 sm:my-8 max-h-[88vh] transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between bg-slate-50/70 dark:bg-neutral-950/70 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  Configurações da Plataforma
                </h2>
                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  Logótipo oficial, aparência visual, segurança e conta
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              title="Fechar configurações"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 dark:border-neutral-800 px-4 sm:px-6 pt-2 gap-1.5 sm:gap-2 bg-slate-50/40 dark:bg-neutral-950/40 overflow-x-auto scrollbar-none shrink-0">
            <button
              onClick={() => setActiveTab('logo')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'logo'
                  ? 'border-amber-500 text-amber-500'
                  : 'border-transparent text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Logótipo & Marca</span>
              {isCustomLogo && (
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Logótipo personalizado ativo" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('theme')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'theme'
                  ? 'border-amber-500 text-amber-500'
                  : 'border-transparent text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              <span>Tema Visual</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
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
              className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'profile'
                  ? 'border-amber-500 text-amber-500'
                  : 'border-transparent text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Dados da Conta</span>
            </button>

            {(isCoach || isAdmin) && (
              <>
                <button
                  onClick={() => setActiveTab('database')}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
                    activeTab === 'database'
                      ? 'border-amber-500 text-amber-500'
                      : 'border-transparent text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Base de Dados & Contas</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-500 font-bold">
                    {allClients.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('smtp')}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
                    activeTab === 'smtp'
                      ? 'border-amber-500 text-amber-500'
                      : 'border-transparent text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Server className="w-3.5 h-3.5" />
                  <span>Serviço SMTP (E-mails)</span>
                  {smtpStatusInfo?.configured && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </button>
              </>
            )}
          </div>

          {/* Tab Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">

            {/* TAB 1: LOGO & BRANDING */}
            {activeTab === 'logo' && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-neutral-800">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-amber-500" />
                      Logótipo Oficial da Aplicação & Ecrã de Login
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                      Personaliza ou remove o logótipo do ecrã de entrada (login), cabeçalho e áreas de alunos.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Toggle Auth Logo Visibility */}
                    <button
                      type="button"
                      onClick={() => handleToggleAuthLogo(!showAuthLogo)}
                      disabled={isSavingLogo}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer disabled:opacity-50 ${
                        showAuthLogo && !isLogoRemoved
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
                          : 'bg-slate-100 dark:bg-neutral-800 border-slate-300 dark:border-neutral-700 text-slate-600 dark:text-neutral-400 hover:text-white'
                      }`}
                      title={showAuthLogo ? 'Ocultar logótipo no login' : 'Mostrar logótipo no login'}
                    >
                      {showAuthLogo && !isLogoRemoved ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-amber-500" />
                          <span>Login: Visível</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Login: Oculto</span>
                        </>
                      )}
                    </button>

                    {/* Eliminate Logo Completely */}
                    {!isLogoRemoved && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        disabled={isSavingLogo}
                        className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 dark:hover:text-red-400 font-bold px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition cursor-pointer disabled:opacity-50"
                        title="Eliminar este logótipo da página inicial e de todo o sistema"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar Logótipo</span>
                      </button>
                    )}

                    {/* Restore Default */}
                    {(isCustomLogo || isLogoRemoved) && (
                      <button
                        type="button"
                        onClick={handleResetLogo}
                        disabled={isSavingLogo}
                        className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 transition cursor-pointer disabled:opacity-50"
                        title="Repor emblema padrão original"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Repor Padrão</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Callout Banner */}
                <div className={`p-3 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
                  isLogoRemoved || !showAuthLogo
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                }`}>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 shrink-0 text-amber-500" />
                    <span>
                      {isLogoRemoved 
                        ? 'O logótipo está atualmente ELIMINADO de todo o sistema (ecrã inicial e cabeçalho).'
                        : !showAuthLogo
                        ? 'O logótipo está OCULTO apenas na página inicial (login), mantendo o cabeçalho limpo.'
                        : 'O logótipo está ATIVO e visível na página inicial e no cabeçalho.'}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] uppercase font-bold shrink-0 px-2 py-0.5 rounded bg-black/20">
                    Sincronizado na Nuvem
                  </span>
                </div>

                {/* Feedback toast */}
                {logoFeedback && (
                  <div className={`p-3.5 rounded-2xl text-xs font-medium flex items-center gap-2.5 animate-fade-in ${
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
                    <button onClick={() => setLogoFeedback(null)} className="p-0.5 cursor-pointer">
                      <X className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
                    </button>
                  </div>
                )}

                {/* Live Preview Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Preview 1: Authentication Screen */}
                  <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-center flex flex-col items-center justify-center relative overflow-hidden min-h-[160px]">
                    <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider mb-2 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Pré-visualização: Ecrã de Login
                    </span>
                    
                    {showAuthLogo && !isLogoRemoved && logoUrl ? (
                      <>
                        <div className="w-24 h-24 my-1 flex items-center justify-center">
                          <img 
                            src={logoUrl} 
                            alt="Logo Oficial" 
                            className="max-w-full max-h-full object-contain filter drop-shadow-[0_8px_16px_rgba(245,158,11,0.3)]" 
                          />
                        </div>
                        <span className="text-[10px] text-neutral-400 font-mono mt-1">
                          {isCustomLogo ? (logoDetails?.fileName || 'Personalizado') : 'Logo Oficial'}
                        </span>
                      </>
                    ) : (
                      <div className="py-5 px-3 flex flex-col items-center justify-center text-center">
                        <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 mb-2">
                          <EyeOff className="w-5 h-5 text-amber-500/70" />
                        </div>
                        <span className="text-xs font-bold text-white uppercase tracking-tight">Sem Logótipo no Login</span>
                        <p className="text-[10px] text-neutral-400 mt-0.5">Apenas título e campos limpos</p>
                      </div>
                    )}
                  </div>

                  {/* Preview 2: Navbar / Headers */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 flex flex-col justify-between min-h-[160px]">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-neutral-400 tracking-wider mb-2 flex items-center gap-1">
                      <Layout className="w-3 h-3 text-amber-500" />
                      Pré-visualização: Cabeçalho da App
                    </span>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 flex items-center gap-2.5 shadow-sm my-auto">
                      {!isLogoRemoved && logoUrl ? (
                        <img 
                          src={logoUrl} 
                          alt="Logo Icon" 
                          className="w-8 h-8 rounded-lg object-contain shrink-0" 
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold shrink-0 text-xs">
                          <Shield className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <span className="font-extrabold text-xs text-slate-900 dark:text-white block uppercase">
                          Coach Cunha <span className="text-amber-500">Project</span>
                        </span>
                        <span className="text-[9px] text-slate-400 dark:text-neutral-500 block">
                          Acompanhamento de Elite
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-neutral-400 pt-2">
                      <span>Estado:</span>
                      <span className="font-bold text-emerald-500">
                        {isLogoRemoved ? 'Eliminado' : isCustomLogo ? 'Personalizado' : 'Padrão'}
                      </span>
                    </div>
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
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {isSavingLogo ? 'A processar e otimizar logótipo...' : 'Clica aqui ou arrasta a imagem para atualizar'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
                  Formatos suportados: PNG (com fundo transparente), JPEG, WEBP ou SVG. A imagem é otimizada e guardada permanentemente.
                </p>
                <div className="mt-3.5">
                  <span className="inline-block px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-extrabold shadow-sm hover:bg-amber-400 transition">
                    Carregar Ficheiro de Logótipo
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: THEME (Light vs Dark) - Clean, direct, zero redundancy */}
          {activeTab === 'theme' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Aparência Visual & Tema
                </h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                  Clica no modo pretendido para alternar instantaneamente entre o modo claro e escuro.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Light Mode Card */}
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-5 rounded-2xl border text-left transition relative cursor-pointer ${
                    !isDark
                      ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30 shadow-lg scale-[1.01]'
                      : 'border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 bg-slate-50 dark:bg-neutral-950 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Sun className="w-5 h-5" />
                    </div>
                    {!isDark && (
                      <span className="flex items-center gap-1 text-xs font-black text-amber-700 dark:text-amber-400 bg-amber-200/60 dark:bg-amber-500/20 px-2.5 py-0.5 rounded-full">
                        <Check className="w-3.5 h-3.5" /> Ativo
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Modo Claro (Light)</h4>
                  <p className="text-xs text-slate-600 dark:text-neutral-400 mt-1 leading-relaxed">
                    Fundo branco limpo com contrastes nítidos, ideal para ambientes bem iluminados e leitura diurna.
                  </p>
                </button>

                {/* Dark Mode Card */}
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-5 rounded-2xl border text-left transition relative cursor-pointer ${
                    isDark
                      ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30 shadow-lg scale-[1.01]'
                      : 'border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 bg-slate-50 dark:bg-neutral-950 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-800 text-amber-400 flex items-center justify-center">
                      <Moon className="w-5 h-5" />
                    </div>
                    {isDark && (
                      <span className="flex items-center gap-1 text-xs font-black text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full">
                        <Check className="w-3.5 h-3.5" /> Ativo
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Modo Escuro (Dark)</h4>
                  <p className="text-xs text-slate-600 dark:text-neutral-400 mt-1 leading-relaxed">
                    Interface escura de alta fidelidade e contraste suave, reduzindo a fadiga visual.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY & PASSWORD */}
          {activeTab === 'security' && (
            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Alteração de Palavra-passe
                </h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                  Atualiza as tuas credenciais de acesso para manter a conta protegida.
                </p>
              </div>

              {passwordStatus.type && (
                <div className={`p-3.5 rounded-2xl text-xs font-medium flex items-center gap-2.5 animate-fade-in ${
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

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                  Palavra-passe Atual
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Introduz a palavra-passe atual..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                    Nova Palavra-passe
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
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
                    placeholder="Repete a nova palavra-passe..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
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
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Informação do Utilizador
                </h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                  Dados associados à sessão e perfil ativo no sistema.
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

          {/* TAB 5: DATABASE & ACCOUNTS MANAGEMENT */}
          {activeTab === 'database' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-neutral-800">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-amber-500" />
                    Base de Dados Firestore & Gestão de Contas
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                    Controlo direto da base de dados na nuvem e eliminação definitiva de contas ({allClients.length} registadas)
                  </p>
                </div>
              </div>

              {/* Action feedback banner */}
              {accountActionFeedback && (
                <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{accountActionFeedback}</span>
                </div>
              )}

              {/* Cloud Connection Details Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800 dark:text-neutral-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Estado da Ligação Cloud Firestore: Ativo
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    Sincronizado
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-neutral-400 font-mono">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-neutral-900">
                    <span className="text-slate-400 dark:text-neutral-500 block text-[10px] font-sans">Projeto Google Cloud / Firebase:</span>
                    project-69bf2730-abe4-41ab-b0f
                  </div>
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-neutral-900">
                    <span className="text-slate-400 dark:text-neutral-500 block text-[10px] font-sans">Base de Dados Firestore ID:</span>
                    ai-studio-c507f05d-edce-44fa-9e53-fb16b2dda884
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-slate-600 dark:text-neutral-300">
                  <p className="leading-relaxed">
                    💡 <strong className="text-amber-600 dark:text-amber-400">Por que o console do Firebase diz "não tem projetos"?</strong> Este projeto foi provisionado pela infraestrutura cloud da aplicação. Por isso, a consola externa do Firebase com o teu e-mail pessoal não lista este projeto. <strong>Não precisas da consola externa!</strong> Podes gerir, criar e eliminar contas diretamente aqui em baixo na base de dados com 1 clique.
                  </p>
                </div>
              </div>

              {/* Accounts List & Delete Section */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-500" />
                    Contas de Utilizadores na Base de Dados ({allClients.length})
                  </h4>
                  <input
                    type="text"
                    value={dbSearch}
                    onChange={(e) => setDbSearch(e.target.value)}
                    placeholder="Filtrar por nome ou e-mail..."
                    className="py-1 px-2.5 text-xs rounded-lg bg-slate-100 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 w-48 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="divide-y divide-slate-100 dark:divide-neutral-800/80 rounded-2xl border border-slate-200 dark:border-neutral-800 overflow-hidden bg-slate-50/50 dark:bg-neutral-950/50 max-h-56 overflow-y-auto">
                  {allClients
                    .filter(c => 
                      !dbSearch.trim() || 
                      c.displayName.toLowerCase().includes(dbSearch.toLowerCase()) || 
                      c.email.toLowerCase().includes(dbSearch.toLowerCase())
                    )
                    .map((client) => {
                      const isOwner = client.email === 'sgpmcunha@gmail.com' || client.email === 'admin@coachcunha.pt';
                      return (
                        <div key={client.uid} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-100/60 dark:hover:bg-neutral-900/60 transition">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                                {client.displayName}
                              </span>
                              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                client.role === 'coach' 
                                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' 
                                  : client.role === 'admin' 
                                  ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400' 
                                  : 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                              }`}>
                                {client.role === 'coach' ? 'Coach' : client.role === 'admin' ? 'Admin' : 'Atleta'}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 dark:text-neutral-400 block truncate">
                              {client.email}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {isOwner ? (
                              <span className="text-[10px] text-neutral-400 px-2 py-1 font-semibold italic">
                                Conta Mestre
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setAccountToDelete({ uid: client.uid, name: client.displayName, email: client.email })}
                                className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 border border-red-500/20 hover:border-red-500/40 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                                title="Eliminar esta conta da base de dados"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Eliminar</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Confirmation Modal to Delete Account */}
              {accountToDelete && (
                <div className="p-4 rounded-2xl bg-red-500/10 border-2 border-red-500/30 space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-xs">
                    <Trash2 className="w-4 h-4 shrink-0" />
                    <span>Confirmas a eliminação definitiva desta conta?</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-neutral-300">
                    Estás prestes a apagar <strong>{accountToDelete.name}</strong> ({accountToDelete.email}) da base de dados do Firestore. Todos os registos, treinos e histórico associados serão removidos.
                  </p>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      disabled={isDeletingAccount}
                      onClick={() => setAccountToDelete(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-neutral-800 text-xs font-bold text-slate-700 dark:text-neutral-300 hover:bg-slate-300 dark:hover:bg-neutral-700 transition cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      disabled={isDeletingAccount}
                      onClick={handleDeleteAccountSubmit}
                      className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold transition cursor-pointer shadow-md flex items-center gap-1.5"
                    >
                      {isDeletingAccount ? 'A Eliminar...' : 'Sim, Eliminar Definitivamente'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SMTP SERVICE (E-MAIL SENDING CONFIGURATION) */}
          {activeTab === 'smtp' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-neutral-800">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-amber-500" />
                    Configuração do Serviço SMTP (Envio Real de E-mails)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                    Garante o disparo físico de e-mails com o código de 6 dígitos para o Gmail, Hotmail ou Outlook dos novos atletas.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                    smtpStatusInfo?.configured
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${smtpStatusInfo?.configured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    <span>{smtpStatusInfo?.configured ? 'Serviço Ativo' : 'Não Configurado'}</span>
                  </span>
                </div>
              </div>

              {/* Status Feedback Banner */}
              {smtpFeedback && (
                <div className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in ${
                  smtpFeedback.type === 'success'
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                    : 'bg-red-500/15 border border-red-500/30 text-red-700 dark:text-red-300'
                }`}>
                  {smtpFeedback.type === 'success' ? (
                    <MailCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Shield className="w-4 h-4 text-red-500 shrink-0" />
                  )}
                  <span>{smtpFeedback.message}</span>
                </div>
              )}

              {/* Quick Presets */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider block">
                  Modelos Rápidos de Provedor SMTP:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSmtpHost('smtp.gmail.com');
                      setSmtpPort('465');
                      setSmtpSecure(true);
                      setSmtpFromName('Coach Cunha');
                      setSmtpFromEmail('sgpmcunha@gmail.com');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-neutral-800 text-xs font-bold text-slate-700 dark:text-neutral-300 hover:bg-amber-500/20 hover:text-amber-500 transition cursor-pointer"
                  >
                    📧 Gmail (Porta 465 SSL)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSmtpHost('smtp.office365.com');
                      setSmtpPort('587');
                      setSmtpSecure(false);
                      setSmtpFromName('Coach Cunha');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-neutral-800 text-xs font-bold text-slate-700 dark:text-neutral-300 hover:bg-amber-500/20 hover:text-amber-500 transition cursor-pointer"
                  >
                    📬 Outlook / Office365 (Porta 587)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSmtpHost('smtp-relay.brevo.com');
                      setSmtpPort('587');
                      setSmtpSecure(false);
                      setSmtpFromName('Coach Cunha');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-neutral-800 text-xs font-bold text-slate-700 dark:text-neutral-300 hover:bg-amber-500/20 hover:text-amber-500 transition cursor-pointer"
                  >
                    ⚡ Brevo / Sendinblue (Porta 587)
                  </button>
                </div>
              </div>

              {/* SMTP Credentials Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-neutral-300 font-bold mb-1">
                    Servidor SMTP (Host):
                  </label>
                  <input
                    type="text"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    placeholder="Ex: smtp.gmail.com"
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 dark:text-neutral-300 font-bold mb-1">
                      Porta:
                    </label>
                    <input
                      type="number"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                      placeholder="465 ou 587"
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-neutral-300 font-bold mb-1">
                      SSL / TLS Seguro:
                    </label>
                    <select
                      value={smtpSecure ? 'true' : 'false'}
                      onChange={(e) => setSmtpSecure(e.target.value === 'true')}
                      className="w-full py-2 px-2.5 rounded-xl bg-slate-100 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-amber-500"
                    >
                      <option value="true">Sim (SSL - 465)</option>
                      <option value="false">Não (TLS - 587/25)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-neutral-300 font-bold mb-1">
                    Utilizador / E-mail de Envio (User):
                  </label>
                  <input
                    type="text"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    placeholder="Ex: seu-email@gmail.com"
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-neutral-300 font-bold mb-1">
                    Palavra-passe / Palavra-passe de Aplicação:
                  </label>
                  <input
                    type="password"
                    value={smtpPass}
                    onChange={(e) => setSmtpPass(e.target.value)}
                    placeholder="Ex: abcd efgh ijkl mnop"
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-slate-500 dark:text-neutral-400 mt-0.5 block">
                    No Gmail, utiliza a "Palavra-passe de aplicação" gerada na segurança da Google.
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-neutral-300 font-bold mb-1">
                    Nome do Remetente (From Name):
                  </label>
                  <input
                    type="text"
                    value={smtpFromName}
                    onChange={(e) => setSmtpFromName(e.target.value)}
                    placeholder="Coach Cunha"
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-neutral-300 font-bold mb-1">
                    E-mail do Remetente (From Email):
                  </label>
                  <input
                    type="email"
                    value={smtpFromEmail}
                    onChange={(e) => setSmtpFromEmail(e.target.value)}
                    placeholder="noreply@coachcunha.pt"
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-neutral-800">
                <span className="text-[11px] text-slate-500 dark:text-neutral-400">
                  Podes testar a autenticação antes de guardar as configurações.
                </span>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    disabled={isTestingSmtp || !smtpHost || !smtpUser}
                    onClick={handleTestSmtp}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-200 dark:bg-neutral-800 text-slate-800 dark:text-neutral-200 text-xs font-bold hover:bg-slate-300 dark:hover:bg-neutral-700 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isTestingSmtp ? 'A testar conexão...' : 'Testar Conexão'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSavingSmtp || !smtpHost || !smtpUser}
                    onClick={handleSaveSmtp}
                    className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black transition cursor-pointer shadow-md disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isSavingSmtp ? 'A Guardar...' : 'Guardar Configurações'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-neutral-800 flex justify-end bg-slate-50/50 dark:bg-neutral-900/50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-neutral-800 text-slate-800 dark:text-neutral-200 text-xs font-bold hover:bg-slate-300 dark:hover:bg-neutral-700 transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>
);
};
