import React, { useState, useRef } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound, 
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Dumbbell,
  Sun,
  Moon,
  Upload,
  UserCog,
  ShieldAlert,
  Trash2,
  RotateCcw,
  Eye,
  EyeOff,
  Image as ImageIcon,
  UserPlus,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLogo } from '../../context/LogoContext';
import { CoachCunhaLogo } from '../../components/CoachCunhaLogo';
import { db, doc, getDoc } from '../../firebase';

export const AuthPortalView: React.FC = () => {
  const { 
    loginWithEmail, 
    registerWithEmail,
    isEmailAuthorized,
    requestPasswordReset,
    completePasswordReset,
    checkPasswordResetRequest,
    switchPersona 
  } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { 
    logoUrl, 
    isCustomLogo, 
    isLogoRemoved, 
    showAuthLogo, 
    removeLogoCompletely, 
    toggleAuthLogo, 
    resetToDefaultLogo,
    updateLogo 
  } = useLogo();

  const [showBrandingModal, setShowBrandingModal] = useState(false);
  const [brandingFeedback, setBrandingFeedback] = useState<string | null>(null);
  const [isSavingBranding, setIsSavingBranding] = useState(false);
  const quickFileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset-password'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCheckUnlock = (targetEmail?: string) => {
    const checkEmail = (targetEmail || email).trim().toLowerCase();
    if (!checkEmail || !checkEmail.includes('@')) {
      setError('Por favor indica um endereço de e-mail válido.');
      return;
    }
    const req = checkPasswordResetRequest(checkEmail);
    if (req && req.status === 'unlocked') {
      setEmail(checkEmail);
      setMode('reset-password');
      setPassword('');
      setConfirmPassword('');
      setError(null);
      setSuccessMessage('🔓 O teu Coach Sérgio Cunha desbloqueou o teu acesso! Define agora a tua nova palavra-passe.');
    } else if (req && req.status === 'pending') {
      setError('⏳ O teu pedido ainda está pendente. O Coach Sérgio Cunha foi notificado e irá desbloquear o teu acesso em breve.');
    } else {
      setError('Ainda não existe nenhum pedido de desbloqueio aprovado para este e-mail. Clica em "Solicitar Recuperação" para notificar o Coach.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const emailTrim = email.trim().toLowerCase();

    if (mode === 'forgot') {
      if (!emailTrim || !emailTrim.includes('@')) {
        setError('Por favor introduz um endereço de e-mail válido.');
        return;
      }
    }

    if (mode === 'register') {
      if (!emailTrim || !emailTrim.includes('@')) {
        setError('Por favor introduz o endereço de e-mail que o Coach adicionou à base de dados.');
        return;
      }
      if (password.length < 6) {
        setError('A palavra-passe deve conter pelo menos 6 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setError('As palavras-passe introduzidas não coincidem. Confirma se são idênticas.');
        return;
      }

      // Check if email is authorized before proceeding
      let isAuthorized = isEmailAuthorized(emailTrim);
      if (!isAuthorized) {
        try {
          const snap = await getDoc(doc(db, 'authorized_students', emailTrim));
          if (snap.exists()) {
            isAuthorized = true;
          }
        } catch (e) {
          console.warn('Firestore authorization check notice:', e);
        }
      }

      if (!isAuthorized) {
        setError(`O seu e-mail não existe. O endereço "${emailTrim}" não foi pré-aprovado nem adicionado à base de dados pelo Coach Sérgio Cunha.`);
        return;
      }
    }

    if (mode === 'reset-password') {
      if (password.length < 6) {
        setError('A nova palavra-passe deve conter pelo menos 6 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setError('As palavras-passe introduzidas não coincidem.');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        // If coach recently unlocked a password reset for this email, route to set new password!
        const resetReq = checkPasswordResetRequest(emailTrim);
        if (resetReq && resetReq.status === 'unlocked') {
          setMode('reset-password');
          setPassword('');
          setConfirmPassword('');
          setSuccessMessage('🔓 O Coach Sérgio Cunha desbloqueou o teu acesso! Define agora a tua nova palavra-passe abaixo:');
          return;
        }

        await loginWithEmail(emailTrim, password, rememberMe);
      } else if (mode === 'register') {
        await registerWithEmail(emailTrim, password, '', rememberMe);
        setSuccessMessage('🎉 Registo concluído com sucesso! Bem-vindo ao programa do Coach Sérgio Cunha.');
      } else if (mode === 'forgot') {
        const res = await requestPasswordReset(emailTrim);
        setSuccessMessage(
          res.message || 'Pedido enviado ao Coach Sérgio Cunha com sucesso! Assim que o Coach aprovar o desbloqueio, poderás definir a tua nova senha.'
        );
      } else if (mode === 'reset-password') {
        await completePasswordReset(emailTrim, password);
        setSuccessMessage('Palavra-passe alterada com sucesso! A iniciar sessão no teu programa...');
      }
    } catch (err: any) {
      console.error('Auth error in portal:', err);
      let msg = 'Ocorreu um erro no processamento. Por favor tenta novamente.';
      if (err?.message?.includes('não existe')) {
        msg = err.message;
      } else if (err?.code === 'auth/user-not-found' || err?.code === 'auth/wrong-password' || err?.code === 'auth/invalid-credential') {
        msg = mode === 'register' 
          ? `O seu e-mail não existe. O endereço "${emailTrim}" não foi pré-aprovado nem adicionado à base de dados pelo Coach Sérgio Cunha.`
          : 'E-mail ou palavra-passe incorretos. Verifica os dados ou solicita recuperação ao Coach.';
      } else if (err?.code === 'auth/email-already-in-use') {
        msg = 'Já existe uma conta associada a este e-mail. Clica em "Entrar" ou recupera a palavra-passe.';
      } else if (err?.code === 'auth/weak-password') {
        msg = 'A palavra-passe deve conter no mínimo 6 caracteres seguros.';
      } else if (err?.code === 'auth/invalid-email') {
        msg = 'O formato do e-mail introduzido é inválido.';
      } else if (err?.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-neutral-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-amber-500 selection:text-black">
      
      {/* Background Graphic Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/30 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-10 right-10 w-80 h-80 bg-amber-600/20 rounded-full blur-[120px]" />
      </div>

      {/* Top Bar with Brand & Theme Toggle & Branding Controls */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500/90">
            Coach Cunha Project
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Branding & Logo Button */}
          <button
            type="button"
            onClick={() => setShowBrandingModal(true)}
            className="p-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/40 text-neutral-300 hover:text-amber-400 transition shadow-sm text-xs flex items-center gap-1.5 cursor-pointer"
            title="Personalizar ou eliminar logótipo desta página"
          >
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline text-[11px] font-semibold">
              {isLogoRemoved || !showAuthLogo ? 'Sem Logótipo' : 'Gerir Logótipo'}
            </span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-300 hover:text-amber-400 hover:border-amber-500/40 transition shadow-sm text-xs flex items-center gap-2 cursor-pointer"
            title={isDark ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            <span className="hidden sm:inline text-[11px] font-semibold">
              {isDark ? 'Modo Claro' : 'Modo Escuro'}
            </span>
          </button>
        </div>
      </header>

      {/* Main Central Authentication Card */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-md w-full mx-auto">
        
        {/* Central Official App Header - Only shows logo if NOT removed and allowed */}
        {showAuthLogo && !isLogoRemoved && logoUrl ? (
          <div className="mb-6 flex flex-col items-center animate-fade-in p-2">
            <CoachCunhaLogo size="hero" />

            <div className="mt-3 text-center">
              <span className="text-[11px] font-extrabold tracking-[0.25em] text-amber-400 uppercase drop-shadow-md">
                Acompanhamento de Elite & Alta Performance
              </span>
              <p className="text-xs text-neutral-400 mt-0.5">
                Portal Central de Autenticação
              </p>
            </div>

            {/* Direct Quick Button to Eliminate Logo */}
            <button
              type="button"
              onClick={async () => {
                await removeLogoCompletely();
              }}
              className="mt-2.5 text-[11px] text-neutral-300 hover:text-red-400 flex items-center gap-1.5 transition cursor-pointer px-3 py-1 rounded-full bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:border-red-500/40 shadow-sm"
              title="Eliminar este logótipo imediatamente"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span>Ocultar / Eliminar Logótipo</span>
            </button>
          </div>
        ) : (
          <div className="mb-6 flex flex-col items-center animate-fade-in text-center px-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-3 shadow-sm">
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Coach Cunha Project</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Acompanhamento <span className="text-amber-500">de Elite</span>
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Portal Oficial de Autenticação
            </p>
          </div>
        )}

        {/* Authentication Box */}
        <div className="w-full bg-neutral-900/90 border border-neutral-800/90 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl transition-all">
          
          {/* Tabs: Entrar, Registo, Recuperar */}
          {mode !== 'reset-password' ? (
            <div className="grid grid-cols-3 p-1 mb-5 bg-neutral-950/80 rounded-2xl border border-neutral-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); setSuccessMessage(null); }}
                className={`py-2 rounded-xl transition cursor-pointer ${
                  mode === 'login'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(null); setSuccessMessage(null); }}
                className={`py-2 rounded-xl transition cursor-pointer ${
                  mode === 'register'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Registo
              </button>
              <button
                type="button"
                onClick={() => { setMode('forgot'); setError(null); setSuccessMessage(null); }}
                className={`py-2 rounded-xl transition cursor-pointer ${
                  mode === 'forgot'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Recuperar
              </button>
            </div>
          ) : (
            <div className="mb-5 flex items-center justify-between p-3 bg-amber-500/10 rounded-2xl border border-amber-500/30 text-xs animate-fade-in">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <KeyRound className="w-4 h-4" />
                <span>Nova Palavra-passe Autorizada pelo Coach</span>
              </div>
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className="text-[11px] text-neutral-400 hover:text-white underline cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          )}

          {/* Feedback messages */}
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-red-950/40 border border-red-800/60 flex items-start gap-2.5 text-xs text-red-300 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-start gap-2.5 text-xs text-emerald-300 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Mode: register notification */}
            {mode === 'register' && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1.5 mb-2 animate-fade-in">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Registo de Aluno (E-mail Autorizado)</span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  Insere o teu e-mail (que já foi previamente adicionado à base de dados pelo <strong className="text-amber-400">Coach Sérgio Cunha</strong>) e escolhe a tua palavra-passe. O teu e-mail tem de constar na base de dados do Coach para ser validado e poderes iniciar.
                </p>
              </div>
            )}

            {/* Mode: reset-password notification */}
            {mode === 'reset-password' && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2 mb-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Desbloqueio Ativo pelo Coach</span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  O Coach Sérgio Cunha aprovou a recuperação para o e-mail: <strong className="text-amber-400">{email}</strong>. Define a tua nova palavra-passe para teres acesso ao teu programa.
                </p>
              </div>
            )}

            {/* Email (Login, Register, Forgot) */}
            {mode !== 'reset-password' && (
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  {mode === 'register' ? 'E-mail do Aluno (adicionado pelo Coach)' : 'E-mail'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="o_teu_email@exemplo.com"
                    className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-amber-500 text-white transition"
                  />
                </div>

                {mode === 'forgot' && (
                  <p className="text-[11px] text-neutral-400 mt-1.5 leading-relaxed">
                    💡 Ao clicares em enviar, o Coach Sérgio Cunha recebe o pedido no painel de controlo. Assim que ele desbloquear o teu perfil, poderás definir a nova palavra-passe.
                  </p>
                )}
              </div>
            )}

            {/* Password (Login, Register, Reset-password) */}
            {mode !== 'forgot' && (
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  {mode === 'reset-password' ? 'Nova Palavra-passe' : mode === 'register' ? 'Escolhe a Palavra-passe' : 'Palavra-passe'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-amber-500 text-white transition"
                  />
                </div>
              </div>
            )}

            {/* Confirm Password (Register or Reset-password) */}
            {(mode === 'register' || mode === 'reset-password') && (
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  {mode === 'register' ? 'Confirmar Palavra-passe' : 'Confirmar Nova Palavra-passe'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repete a palavra-passe para confirmar"
                    className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-amber-500 text-white transition"
                  />
                </div>
                {mode === 'register' && password && confirmPassword && (
                  <p className={`text-[11px] mt-1 font-semibold ${password === confirmPassword ? 'text-emerald-400' : 'text-red-400'}`}>
                    {password === confirmPassword ? '✓ As palavras-passe coincidem' : '✕ As palavras-passe não são iguais'}
                  </p>
                )}
              </div>
            )}

            {/* Manter Sessão Iniciada Checkbox (Login / Register) */}
            {(mode === 'login' || mode === 'register') && (
              <div className="flex items-center justify-between text-xs py-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-300 hover:text-white transition">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-700 bg-neutral-950 text-amber-500 focus:ring-amber-500/30 accent-amber-500 cursor-pointer"
                  />
                  <span className="font-medium text-[11px] sm:text-xs">Manter sessão iniciada</span>
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(null); }}
                    className="text-[11px] sm:text-xs text-amber-400 hover:underline font-semibold cursor-pointer"
                  >
                    Esqueceste-te da senha?
                  </button>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-4 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>A processar...</span>
                </>
              ) : mode === 'login' ? (
                <>
                  <span>Entrar no Programa</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : mode === 'register' ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Registar & Iniciar Sessão</span>
                </>
              ) : mode === 'forgot' ? (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Solicitar Desbloqueio ao Coach</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Gravar Nova Palavra-passe & Entrar</span>
                </>
              )}
            </button>

            {/* Secondary action for Forgot Mode: check if coach already unlocked */}
            {mode === 'forgot' && (
              <button
                type="button"
                onClick={() => handleCheckUnlock()}
                className="w-full py-2.5 px-4 rounded-xl border border-neutral-800 hover:border-amber-500/50 text-neutral-300 hover:text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                <span>Verificar se o Coach Já Desbloqueou</span>
              </button>
            )}
          </form>

          {/* Mode Switcher footer texts */}
          {mode === 'login' && (
            <div className="mt-4 text-center text-xs text-neutral-400">
              Novo aluno com e-mail adicionado pelo Coach?{' '}
              <button
                type="button"
                onClick={() => { setMode('register'); setError(null); setSuccessMessage(null); }}
                className="text-amber-400 hover:underline font-bold cursor-pointer"
              >
                Regista a tua senha aqui
              </button>
            </div>
          )}

          {mode === 'register' && (
            <div className="mt-4 text-center text-xs text-neutral-400">
              Já tens uma palavra-passe definida?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); setSuccessMessage(null); }}
                className="text-amber-400 hover:underline font-bold cursor-pointer"
              >
                Clica aqui para Entrar
              </button>
            </div>
          )}

          {mode === 'forgot' && (
            <div className="mt-4 text-center text-xs text-neutral-400 space-y-1.5">
              <div>
                Lembraste-te da palavra-passe?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); }}
                  className="text-amber-400 hover:underline font-bold cursor-pointer"
                >
                  Voltar ao Início de Sessão
                </button>
              </div>
              <div>
                Primeiro acesso de aluno?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(null); }}
                  className="text-neutral-300 hover:underline cursor-pointer"
                >
                  Registar Palavra-passe
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Authorized Profiles Info & Demo Tester */}
        <div className="w-full mt-4 p-3.5 bg-neutral-900/60 border border-neutral-800/60 rounded-2xl text-center backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Perfis Autorizados (Regra de Acesso)
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Base de Dados Nuvem
            </span>
          </div>

          <p className="text-[11px] text-neutral-400 text-left mb-2.5">
            Apenas dois perfis têm acesso às ferramentas de Coach: o <strong className="text-amber-400">Coach Sérgio Cunha</strong> e o <strong className="text-purple-400">Administrador</strong> (que pode manipular qualquer perfil).
          </p>

          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => switchPersona('coach', undefined, rememberMe)}
              className="py-2 px-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25 transition font-semibold flex flex-col items-center justify-center gap-0.5 cursor-pointer"
              title="Entrar imediatamente como Coach (sgpmcunha@gmail.com)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] leading-tight">Coach PT</span>
            </button>
            
            <button
              type="button"
              onClick={() => switchPersona('admin', undefined, rememberMe)}
              className="py-2 px-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 hover:bg-purple-500/25 transition font-semibold flex flex-col items-center justify-center gap-0.5 cursor-pointer"
              title="Entrar como Super Admin para manipular qualquer atleta ou coach"
            >
              <UserCog className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[11px] leading-tight">Super Admin</span>
            </button>

            <button
              type="button"
              onClick={() => switchPersona('client', 0, rememberMe)}
              className="py-2 px-2 rounded-xl bg-neutral-800 border border-neutral-700 text-neutral-200 hover:bg-neutral-700 transition font-semibold flex flex-col items-center justify-center gap-0.5 cursor-pointer"
              title="Entrar como Aluno"
            >
              <Dumbbell className="w-3.5 h-3.5 text-neutral-300" />
              <span className="text-[11px] leading-tight">Aluno</span>
            </button>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-neutral-500">
        <p>© {new Date().getFullYear()} Coach Cunha Project. Todos os direitos reservados.</p>
        <p className="text-[10px] text-neutral-600 mt-0.5">
          Armazenamento Seguro em Google Cloud Firestore • Autenticação Verificada
        </p>
      </footer>

      {/* Quick Branding & Logo Customizer Modal */}
      {showBrandingModal && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowBrandingModal(false)}
        >
          <div 
            className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl text-white space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight">
                    Gestão de Logótipo & Marca
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Controla o que aparece na página inicial e no sistema
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBrandingModal(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Feedback message */}
            {brandingFeedback && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="flex-1">{brandingFeedback}</span>
                <button onClick={() => setBrandingFeedback(null)} className="p-0.5 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Current Status Box */}
            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 overflow-hidden">
                  {showAuthLogo && !isLogoRemoved && logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-neutral-500" />
                  )}
                </div>
                <div>
                  <span className="font-bold text-white block">
                    {isLogoRemoved 
                      ? 'Logótipo Eliminado' 
                      : !showAuthLogo 
                      ? 'Logótipo Ocultado no Login' 
                      : 'Logótipo Ativo'}
                  </span>
                  <span className="text-[11px] text-neutral-400 block">
                    {isLogoRemoved 
                      ? 'Nenhum logótipo está a ser exibido no sistema.' 
                      : !showAuthLogo 
                      ? 'A página de entrada exibe apenas o título limpo.' 
                      : 'O logótipo atual é visível no topo deste ecrã.'}
                  </span>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isLogoRemoved || !showAuthLogo 
                  ? 'bg-amber-500/20 text-amber-300' 
                  : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {isLogoRemoved || !showAuthLogo ? 'Oculto' : 'Visível'}
              </span>
            </div>

            {/* Action Buttons Grid */}
            <div className="space-y-2">
              {/* Button 1: Eliminate Logo completely */}
              {!isLogoRemoved && (
                <button
                  type="button"
                  disabled={isSavingBranding}
                  onClick={async () => {
                    setIsSavingBranding(true);
                    try {
                      await removeLogoCompletely();
                      setBrandingFeedback('Logótipo eliminado permanentemente da página inicial e do sistema!');
                    } catch (e: any) {
                      setBrandingFeedback('Erro ao eliminar logótipo: ' + (e?.message || 'Tenta novamente.'));
                    } finally {
                      setIsSavingBranding(false);
                    }
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-red-500/15 border border-red-500/30 hover:bg-red-500/25 text-red-400 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                  <span>Eliminar Logótipo Desta Página & Sistema</span>
                </button>
              )}

              {/* Button 2: Toggle Visibility on Login */}
              <button
                type="button"
                disabled={isSavingBranding}
                onClick={async () => {
                  setIsSavingBranding(true);
                  try {
                    await toggleAuthLogo(!showAuthLogo);
                    setBrandingFeedback(showAuthLogo 
                      ? 'Logótipo ocultado da página inicial.' 
                      : 'Logótipo agora visível na página inicial.');
                  } catch (e: any) {
                    setBrandingFeedback('Erro ao alternar visibilidade.');
                  } finally {
                    setIsSavingBranding(false);
                  }
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                {showAuthLogo && !isLogoRemoved ? (
                  <>
                    <EyeOff className="w-4 h-4 text-amber-400" />
                    <span>Ocultar Logótipo Desta Página</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 text-amber-400" />
                    <span>Mostrar Logótipo Nesta Página</span>
                  </>
                )}
              </button>

              {/* Button 3: Restore Default Emblem */}
              {(isCustomLogo || isLogoRemoved) && (
                <button
                  type="button"
                  disabled={isSavingBranding}
                  onClick={async () => {
                    setIsSavingBranding(true);
                    try {
                      await resetToDefaultLogo();
                      setBrandingFeedback('Emblema oficial dourado do Coach Cunha reposto com sucesso!');
                    } catch (e: any) {
                      setBrandingFeedback('Erro ao repor logótipo.');
                    } finally {
                      setIsSavingBranding(false);
                    }
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span>Repor Emblema Padrão Original</span>
                </button>
              )}

              {/* Button 4: Upload Custom Image */}
              <input
                ref={quickFileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
                onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    setIsSavingBranding(true);
                    const reader = new FileReader();
                    reader.onload = async (ev) => {
                      const dataUrl = ev.target?.result as string;
                      if (dataUrl) {
                        try {
                          await updateLogo(dataUrl, file.name, file.size);
                          setBrandingFeedback(`Logótipo "${file.name}" gravado com sucesso!`);
                        } catch (err) {
                          setBrandingFeedback('Erro ao carregar ficheiro.');
                        } finally {
                          setIsSavingBranding(false);
                        }
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <button
                type="button"
                disabled={isSavingBranding}
                onClick={() => quickFileInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 text-amber-400 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>Carregar Nova Imagem / Logótipo</span>
              </button>
            </div>

            <div className="pt-2 flex justify-end border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setShowBrandingModal(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white transition cursor-pointer"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
