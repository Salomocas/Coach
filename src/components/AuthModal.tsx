import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  KeyRound, 
  RefreshCw,
  Sparkles,
  Dumbbell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login' 
}) => {
  const { 
    loginWithEmail, 
    registerWithEmail, 
    loginWithGoogle, 
    requestPasswordReset,
    completePasswordReset,
    checkPasswordResetRequest,
    switchPersona,
    currentUser,
    firebaseUser
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset-password'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Reset internal states when opened
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setSuccessMessage(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleCheckUnlock = (targetEmail?: string) => {
    const checkEmail = (targetEmail || email).trim().toLowerCase();
    if (!checkEmail || !checkEmail.includes('@')) {
      setError('Por favor introduz um e-mail válido.');
      return;
    }
    const req = checkPasswordResetRequest(checkEmail);
    if (req && req.status === 'unlocked') {
      setEmail(checkEmail);
      setMode('reset-password');
      setPassword('');
      setConfirmPassword('');
      setError(null);
      setSuccessMessage('🔓 O teu Coach desbloqueou o teu acesso! Define a tua nova palavra-passe.');
    } else if (req && req.status === 'pending') {
      setError('⏳ O teu pedido ainda está pendente de aprovação pelo Coach Sérgio Cunha.');
    } else {
      setError('Ainda não existe nenhum pedido ativo para este e-mail.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const emailTrim = email.trim().toLowerCase();

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Por favor introduz o teu nome completo.');
        return;
      }
      if (!emailTrim || !emailTrim.includes('@')) {
        setError('Por favor introduz um e-mail válido.');
        return;
      }
      if (password.length < 6) {
        setError('A palavra-passe deve ter pelo menos 6 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setError('As palavras-passe não coincidem.');
        return;
      }
    }

    if (mode === 'forgot') {
      if (!emailTrim || !emailTrim.includes('@')) {
        setError('Por favor introduz um e-mail válido.');
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
        const resetReq = checkPasswordResetRequest(emailTrim);
        if (resetReq && resetReq.status === 'unlocked') {
          setMode('reset-password');
          setPassword('');
          setConfirmPassword('');
          setSuccessMessage('🔓 O Coach Sérgio Cunha desbloqueou o teu acesso! Define a tua nova palavra-passe:');
          return;
        }

        await loginWithEmail(emailTrim, password, rememberMe);
        setSuccessMessage('Sessão iniciada com sucesso!');
        setTimeout(() => {
          onClose();
        }, 800);
      } else if (mode === 'register') {
        await registerWithEmail(emailTrim, password, name.trim(), rememberMe);
        setSuccessMessage('Conta criada com sucesso! O teu programa aguarda ativação pelo treinador.');
        setTimeout(() => {
          onClose();
        }, 800);
      } else if (mode === 'forgot') {
        const res = await requestPasswordReset(emailTrim);
        setSuccessMessage(
          res.message || 'Pedido enviado ao Coach com sucesso! Assim que ele desbloquear, define a tua nova senha.'
        );
      } else if (mode === 'reset-password') {
        await completePasswordReset(emailTrim, password);
        setSuccessMessage('Palavra-passe alterada com sucesso! A entrar no programa...');
        setTimeout(() => {
          onClose();
        }, 800);
      }
    } catch (err: any) {
      console.error('Auth error in modal:', err);
      let msg = 'Ocorreu um erro no processamento. Por favor tenta novamente.';
      if (err?.code === 'auth/user-not-found' || err?.code === 'auth/wrong-password' || err?.code === 'auth/invalid-credential') {
        msg = 'E-mail ou palavra-passe incorretos. Verifica os dados ou solicita recuperação ao Coach.';
      } else if (err?.code === 'auth/email-already-in-use') {
        msg = 'Já existe uma conta associada a este e-mail. Clica em "Entrar" ou recupera a palavra-passe.';
      } else if (err?.code === 'auth/weak-password') {
        msg = 'A palavra-passe deve conter pelo menos 6 caracteres.';
      } else if (err?.code === 'auth/invalid-email') {
        msg = 'O formato do e-mail é inválido.';
      } else if (err?.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleLogin = async () => {
    setError(null);
    setSuccessMessage(null);
    setLoading(true);
    try {
      await loginWithGoogle(rememberMe);
      setSuccessMessage('Sessão iniciada com Google!');
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err: any) {
      console.error('Google login error:', err);
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError('Não foi possível autenticar com o Google. Podes tentar novamente ou utilizar e-mail.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden transition-all text-slate-900 dark:text-neutral-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with App Branding & Close */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-100 dark:border-neutral-800/80 bg-slate-50/50 dark:bg-neutral-900/50">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:text-neutral-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-neutral-800 transition"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-black flex items-center justify-center font-black shadow-md shadow-amber-500/20">
              SC
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
                Plataforma de Treino Online
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                Sérgio Cunha Coaching
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
            {mode === 'login' && 'Inicia sessão para acederes aos teus treinos ou ao painel de treinador.'}
            {mode === 'register' && 'Cria a tua conta com o e-mail previamente autorizado pelo Coach Sérgio Cunha.'}
            {mode === 'forgot' && 'Solicita a recuperação da tua palavra-passe ao Coach Sérgio Cunha.'}
            {mode === 'reset-password' && 'Desbloqueio autorizado! Define agora a tua nova palavra-passe.'}
          </p>
        </div>

        {/* Mode Tabs */}
        {mode !== 'reset-password' ? (
          <div className="grid grid-cols-3 p-1 mx-6 mt-4 bg-slate-100 dark:bg-neutral-950 rounded-2xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); setSuccessMessage(null); }}
              className={`py-2 rounded-xl transition cursor-pointer ${
                mode === 'login'
                  ? 'bg-white dark:bg-neutral-800 text-amber-600 dark:text-amber-400 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); setSuccessMessage(null); }}
              className={`py-2 rounded-xl transition cursor-pointer ${
                mode === 'register'
                  ? 'bg-white dark:bg-neutral-800 text-amber-600 dark:text-amber-400 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Criar Conta
            </button>
            <button
              type="button"
              onClick={() => { setMode('forgot'); setError(null); setSuccessMessage(null); }}
              className={`py-2 rounded-xl transition cursor-pointer ${
                mode === 'forgot'
                  ? 'bg-white dark:bg-neutral-800 text-amber-600 dark:text-amber-400 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Recuperar
            </button>
          </div>
        ) : (
          <div className="mx-6 mt-4 p-2.5 bg-amber-500/10 rounded-2xl border border-amber-500/30 flex items-center justify-between text-xs animate-fade-in">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold">
              <KeyRound className="w-4 h-4" />
              <span>Nova Palavra-passe Autorizada pelo Coach</span>
            </div>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className="text-[11px] text-slate-500 dark:text-neutral-400 hover:underline cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto px-6 py-2 space-y-4">
          
          {/* Notifications / Alerts */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-2.5 text-xs text-emerald-700 dark:text-emerald-300 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Google Quick Sign-In (For Login and Register) */}
          {mode !== 'forgot' && mode !== 'reset-password' && (
            <div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-2xl bg-white dark:bg-neutral-800/80 border border-slate-300 dark:border-neutral-700 hover:border-slate-400 dark:hover:border-neutral-600 text-slate-800 dark:text-neutral-100 font-semibold text-xs transition shadow-sm hover:shadow cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continuar com o Google</span>
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-neutral-800" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-semibold">
                  <span className="bg-white dark:bg-neutral-900 px-3 text-slate-400 dark:text-neutral-500">
                    Ou através de e-mail
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Mode: reset-password notice */}
            {mode === 'reset-password' && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Desbloqueio Aprovado pelo Coach</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-neutral-300 leading-relaxed">
                  O Coach Sérgio Cunha aprovou a recuperação para o e-mail: <strong className="text-amber-600 dark:text-amber-400">{email}</strong>. Define a tua nova palavra-passe abaixo:
                </p>
              </div>
            )}
            
            {/* Name (Register only) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                  Nome Completo do Aluno
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-neutral-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: João Silva"
                    className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 transition"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            {mode !== 'reset-password' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                  Endereço de E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-neutral-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teuemail@exemplo.com"
                    className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 transition"
                  />
                </div>
                {mode === 'register' && (
                  <div className="p-2.5 mt-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed flex items-start gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>Acesso por Autorização:</strong> O teu Coach deve ter adicionado previamente o teu e-mail à aplicação. A tua palavra-passe é criada aqui por ti. O teu programa inicia em versão bloqueada e é ativado diretamente pelo Coach sem pagamentos adicionais.
                    </span>
                  </div>
                )}
                {mode === 'forgot' && (
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
                    💡 Ao clicares no botão, o Coach Sérgio Cunha recebe a notificação no painel de controlo. Assim que ele desbloquear o teu perfil, poderás definir a tua nova palavra-passe.
                  </p>
                )}
              </div>
            )}

            {/* Password Field */}
            {mode !== 'forgot' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                  {mode === 'reset-password' ? 'Nova Palavra-passe' : 'Palavra-passe'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-neutral-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 transition"
                  />
                </div>
              </div>
            )}

            {/* Confirm Password (Register & Reset-password) */}
            {(mode === 'register' || mode === 'reset-password') && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                  {mode === 'reset-password' ? 'Confirmar Nova Palavra-passe' : 'Confirmar Palavra-passe'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-neutral-500" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repete a tua palavra-passe"
                    className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 transition"
                  />
                </div>
              </div>
            )}

            {/* Manter Sessão Iniciada Checkbox */}
            {(mode === 'login' || mode === 'register') && (
              <div className="flex items-center justify-between text-xs py-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-amber-500 focus:ring-amber-500/30 accent-amber-500 cursor-pointer"
                  />
                  <span className="font-medium text-[11px] sm:text-xs">Manter sessão iniciada</span>
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(null); }}
                    className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
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
              className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs tracking-wide uppercase flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-50 mt-4 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>A processar...</span>
                </>
              ) : mode === 'login' ? (
                <>
                  <span>Iniciar Sessão</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : mode === 'register' ? (
                <>
                  <span>Criar Conta de Aluno</span>
                  <ArrowRight className="w-4 h-4" />
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

            {/* Secondary check button for forgot mode */}
            {mode === 'forgot' && (
              <button
                type="button"
                onClick={() => handleCheckUnlock()}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-neutral-800 hover:border-amber-500/50 text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
                <span>Verificar se o Coach Já Desbloqueou</span>
              </button>
            )}
          </form>

          {/* Mode Switchers */}
          <div className="text-center pt-2">
            {mode === 'login' ? (
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Ainda não és aluno?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(null); }}
                  className="font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  Regista-te agora
                </button>
              </p>
            ) : mode === 'register' ? (
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Já tens conta criada?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); }}
                  className="font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  Iniciar Sessão
                </button>
              </p>
            ) : (
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                Voltar ao Início de Sessão
              </button>
            )}
          </div>

        </div>

        {/* Quick Demo Switcher Footer */}
        <div className="p-4 bg-slate-50 dark:bg-neutral-950/80 border-t border-slate-200 dark:border-neutral-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Acesso Rápido de Teste (Demonstração)
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Nuvem Gratuita 100%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                switchPersona('coach', undefined, rememberMe);
                onClose();
              }}
              className="px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-semibold flex items-center justify-center gap-1.5 hover:bg-amber-500/25 transition cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Modo PT (Coach)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                switchPersona('client', 0, rememberMe);
                onClose();
              }}
              className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 text-slate-700 dark:text-neutral-200 font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-300 dark:hover:bg-neutral-700 transition cursor-pointer"
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Modo Aluno (Ricardo)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
