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
    sendVerificationCode,
    verifyCodeAndRegister,
    loginWithGoogle, 
    sendResetPassword,
    switchPersona,
    currentUser,
    firebaseUser
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'verify-code'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Verification code states
  const [verificationCodeInput, setVerificationCodeInput] = useState('');
  const [expectedCode, setExpectedCode] = useState('');
  const [codeResendCountdown, setCodeResendCountdown] = useState(60);
  const [isResendingCode, setIsResendingCode] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Reset internal states when opened
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setSuccessMessage(null);
      setVerificationCodeInput('');
      setExpectedCode('');
    }
  }, [isOpen, initialMode]);

  // Countdown timer for resending verification code
  React.useEffect(() => {
    let timer: any;
    if (mode === 'verify-code' && codeResendCountdown > 0) {
      timer = setInterval(() => {
        setCodeResendCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, codeResendCountdown]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Por favor introduz o teu nome completo.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
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
      if (!email.trim() || !email.includes('@')) {
        setError('Por favor introduz um e-mail válido.');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await loginWithEmail(email.trim(), password, rememberMe);
        setSuccessMessage('Sessão iniciada com sucesso!');
        setTimeout(() => {
          onClose();
        }, 800);
      } else if (mode === 'register') {
        const { code } = await sendVerificationCode(email.trim(), name.trim());
        setExpectedCode(code);
        setVerificationCodeInput('');
        setMode('verify-code');
        setCodeResendCountdown(60);
        setSuccessMessage(
          `Código de segurança gerado! Enviámos uma confirmação de 6 dígitos para ${email.trim()}.`
        );
      } else if (mode === 'forgot') {
        await sendResetPassword(email.trim());
        setSuccessMessage(
          `Link de redefinição enviado com sucesso para ${email.trim()}! Verifica a tua caixa de correio (e pasta de spam) para criar uma nova palavra-passe.`
        );
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = 'Ocorreu um erro ao processar o pedido. Tenta novamente.';
      if (err?.code === 'auth/user-not-found' || err?.code === 'auth/wrong-password' || err?.code === 'auth/invalid-credential') {
        msg = 'E-mail ou palavra-passe incorretos. Verifica os dados ou recupera a palavra-passe.';
      } else if (err?.code === 'auth/email-already-in-use') {
        msg = 'Já existe uma conta associada a este e-mail. Clica em "Iniciar Sessão" ou recupera a palavra-passe.';
      } else if (err?.code === 'auth/weak-password') {
        msg = 'A palavra-passe deve conter pelo menos 6 caracteres seguros.';
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

  const handleVerifyCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const codeClean = verificationCodeInput.trim();
    if (!codeClean || codeClean.length < 6) {
      setError('Por favor introduz o código completo de 6 dígitos.');
      return;
    }

    setLoading(true);
    try {
      await verifyCodeAndRegister(
        email.trim(),
        password,
        name.trim(),
        codeClean,
        expectedCode,
        rememberMe
      );
      setSuccessMessage('Conta validada e ativada com sucesso! A iniciar...');
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err: any) {
      setError(err?.message || 'Código de confirmação incorreto ou expirado.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (codeResendCountdown > 0) return;
    setIsResendingCode(true);
    setError(null);
    try {
      const { code } = await sendVerificationCode(email.trim(), name.trim());
      setExpectedCode(code);
      setCodeResendCountdown(60);
      setSuccessMessage(`Novo código enviado para ${email.trim()}.`);
    } catch (err: any) {
      setError(err?.message || 'Erro ao reenviar código de segurança.');
    } finally {
      setIsResendingCode(false);
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
            {mode === 'register' && 'Cria a tua conta de aluno com confirmação por e-mail e dados na nuvem.'}
            {mode === 'forgot' && 'Recuperação segura: enviaremos um link oficial para redefinires a tua senha.'}
          </p>
        </div>

          {mode !== 'verify-code' ? (
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
            <div className="mx-6 mt-4 p-2.5 bg-slate-100 dark:bg-neutral-950 rounded-2xl border border-amber-500/30 flex items-center justify-between text-xs animate-fade-in">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Passo 2 de 2: Confirmação de E-mail</span>
              </div>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(null); }}
                className="text-[11px] text-slate-500 dark:text-neutral-400 hover:underline cursor-pointer"
              >
                Corrigir dados
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
          {mode !== 'forgot' && mode !== 'verify-code' && (
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

          {/* Verification Code Form */}
          {mode === 'verify-code' ? (
            <form onSubmit={handleVerifyCodeSubmit} className="space-y-4 animate-fade-in">
              <div className="text-center py-1">
                <div className="w-10 h-10 mx-auto rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center mb-2">
                  <Mail className="w-5 h-5 animate-pulse" />
                </div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-neutral-100">
                  Verifica o teu E-mail
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">
                  Enviámos um código de 6 dígitos para:
                </p>
                <div className="mt-1 inline-block px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-bold text-amber-600 dark:text-amber-400 max-w-full truncate">
                  {email}
                </div>
              </div>

              {/* Instant code test indicator */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-amber-500/30 text-xs space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-700 dark:text-neutral-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                    Código enviado:
                  </span>
                  <span className="font-mono font-black text-amber-600 dark:text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded text-xs tracking-widest border border-amber-500/40">
                    {expectedCode}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-neutral-400">
                  Introduz o código de segurança para ativar a tua conta imediatamente.
                </p>
              </div>

              {/* 6 Digit Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1 text-center">
                  Código de Confirmação (6 Dígitos)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={verificationCodeInput}
                  onChange={(e) => setVerificationCodeInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ex: 123456"
                  className="w-full py-2.5 px-4 text-center font-mono text-xl font-black tracking-[0.3em] rounded-xl bg-slate-50 dark:bg-neutral-950 border-2 border-amber-500/50 focus:border-amber-400 focus:outline-none text-slate-900 dark:text-neutral-100 transition placeholder:tracking-normal placeholder:font-sans placeholder:text-xs"
                />
              </div>

              {/* Remember Me */}
              <div className="pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition text-xs">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-amber-500 focus:ring-amber-500/30 accent-amber-500 cursor-pointer"
                  />
                  <span>Manter sessão iniciada neste dispositivo</span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || verificationCodeInput.length < 6}
                className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs tracking-wide uppercase flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>A validar...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar Código & Entrar</span>
                  </>
                )}
              </button>

              {/* Resend and return */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={codeResendCountdown > 0 || isResendingCode}
                  className="text-slate-500 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 font-semibold disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isResendingCode ? 'animate-spin' : ''}`} />
                  <span>
                    {codeResendCountdown > 0 
                      ? `Reenviar (${codeResendCountdown}s)` 
                      : 'Reenviar código'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(null); }}
                  className="text-amber-600 dark:text-amber-400 hover:underline font-semibold cursor-pointer"
                >
                  ← Corrigir e-mail
                </button>
              </div>
            </form>
          ) : (
            /* Standard Modal Form */
            <form onSubmit={handleSubmit} className="space-y-3">
              
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
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 shrink-0" />
                    Receberás um código de 6 dígitos no teu e-mail para validar a conta.
                  </p>
                )}
              </div>

              {/* Password Field (Login & Register) */}
              {mode !== 'forgot' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                    Palavra-passe
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

              {/* Confirm Password (Register only) */}
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                    Confirmar Palavra-passe
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

              {/* Manter Sessão Iniciada Checkbox (O pisco) */}
              {mode === 'login' && (
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
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(null); }}
                    className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    Esqueceste-te da senha?
                  </button>
                </div>
              )}

              {/* Manter Sessão Iniciada no Registo */}
              {mode === 'register' && (
                <div className="pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition text-xs">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-amber-500 focus:ring-amber-500/30 accent-amber-500 cursor-pointer"
                    />
                    <span className="font-medium text-[11px] sm:text-xs">Manter sessão iniciada neste dispositivo</span>
                  </label>
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
                    <span>Criar Conta & Receber Código</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Enviar Link de Recuperação</span>
                  </>
                )}
              </button>
            </form>
          )}

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
            ) : mode === 'verify-code' ? (
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Já tens conta ativa?{' '}
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
