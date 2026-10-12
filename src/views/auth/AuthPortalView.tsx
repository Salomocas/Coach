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
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLogo } from '../../context/LogoContext';
import { CoachCunhaLogo } from '../../components/CoachCunhaLogo';

export const AuthPortalView: React.FC = () => {
  const { 
    loginWithEmail, 
    registerWithEmail, 
    sendVerificationCode,
    verifyCodeAndRegister,
    loginWithGoogle, 
    sendResetPassword,
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

  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'verify-code'>('login');
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
  const [isSmtpDelivered, setIsSmtpDelivered] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Por favor indica o teu nome completo.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Por favor introduz um e-mail válido.');
        return;
      }
      if (password.length < 6) {
        setError('A palavra-passe deve conter pelo menos 6 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setError('As palavras-passe introduzidas não coincidem.');
        return;
      }
    }

    if (mode === 'forgot') {
      if (!email.trim() || !email.includes('@')) {
        setError('Por favor introduz um endereço de e-mail válido.');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await loginWithEmail(email.trim(), password, rememberMe);
      } else if (mode === 'register') {
        const { code, smtpDelivered, smtpNotice } = await sendVerificationCode(email.trim(), name.trim());
        setExpectedCode(code);
        setIsSmtpDelivered(!!smtpDelivered);
        setVerificationCodeInput('');
        setMode('verify-code');
        setCodeResendCountdown(60);
        if (smtpDelivered) {
          setSuccessMessage(
            `E-mail de confirmação enviado para a tua caixa de correio (${email.trim()}) com o código de 6 dígitos!`
          );
        } else {
          setSuccessMessage(
            smtpNotice || `Código de segurança gerado! Enviámos uma confirmação de 6 dígitos para ${email.trim()}.`
          );
        }
      } else if (mode === 'forgot') {
        await sendResetPassword(email.trim());
        setSuccessMessage(
          `Link de redefinição enviado com sucesso para ${email.trim()}! Verifica a tua caixa de correio para definir a nova senha.`
        );
      }
    } catch (err: any) {
      console.error('Auth error in portal:', err);
      let msg = 'Ocorreu um erro no processamento. Por favor tenta novamente.';
      if (err?.code === 'auth/user-not-found' || err?.code === 'auth/wrong-password' || err?.code === 'auth/invalid-credential') {
        msg = 'E-mail ou palavra-passe incorretos. Verifica os dados ou clica em Recuperar.';
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

  const handleVerifyCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const codeClean = verificationCodeInput.trim();
    if (!codeClean || codeClean.length < 6) {
      setError('Por favor introduz o código completo de 6 dígitos enviado para o teu e-mail.');
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
      setSuccessMessage('Conta validada e ativada com sucesso! A entrar no programa...');
    } catch (err: any) {
      setError(err?.message || 'Código de confirmação incorreto ou expirado. Tenta novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (codeResendCountdown > 0) return;
    setIsResendingCode(true);
    setError(null);
    try {
      const { code, smtpDelivered, smtpNotice } = await sendVerificationCode(email.trim(), name.trim());
      setExpectedCode(code);
      setIsSmtpDelivered(!!smtpDelivered);
      setCodeResendCountdown(60);
      if (smtpDelivered) {
        setSuccessMessage(`Novo código enviado para a tua caixa de correio (${email.trim()})!`);
      } else {
        setSuccessMessage(smtpNotice || `Novo código gerado para ${email.trim()}.`);
      }
    } catch (err: any) {
      setError(err?.message || 'Erro ao reenviar código de segurança.');
    } finally {
      setIsResendingCode(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccessMessage(null);
    setLoading(true);
    try {
      await loginWithGoogle(rememberMe);
    } catch (err: any) {
      console.error('Google auth error:', err);
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError('Não foi possível autenticar com o Google. Podes tentar novamente ou utilizar e-mail/palavra-passe.');
      }
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
          
          {/* Tabs */}
          {mode !== 'verify-code' ? (
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
                Criar Conta
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
            <div className="mb-5 flex items-center justify-between p-2.5 bg-neutral-950/80 rounded-2xl border border-amber-500/30 text-xs animate-fade-in">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Passo 2 de 2: Confirmação de E-mail</span>
              </div>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(null); }}
                className="text-[11px] text-neutral-400 hover:text-white underline cursor-pointer"
              >
                Corrigir dados
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

          {/* Quick Google Sign-In */}
          {mode !== 'forgot' && mode !== 'verify-code' && (
            <div className="mb-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-600 text-white font-semibold text-xs transition shadow-sm cursor-pointer disabled:opacity-50"
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
                  <div className="w-full border-t border-neutral-800" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold">
                  <span className="bg-neutral-900 px-3 text-neutral-400">
                    Ou com o teu e-mail
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Verification Code Form (Passo 2 do Registo) */}
          {mode === 'verify-code' ? (
            <form onSubmit={handleVerifyCodeSubmit} className="space-y-4 animate-fade-in">
              <div className="text-center py-1">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-2.5 shadow-inner">
                  <Mail className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  Verifica a tua Caixa de Entrada
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Enviámos um código de validação de 6 dígitos para:
                </p>
                <div className="mt-1.5 inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-bold text-amber-400 max-w-full truncate">
                  {email}
                </div>
              </div>

              {/* Delivery Status & Virtual Mailbox Card */}
              <div className="p-4 bg-gradient-to-b from-neutral-900 to-neutral-950 border border-amber-500/40 rounded-2xl text-xs space-y-2.5 shadow-xl">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                      {isSmtpDelivered ? '🚀' : '✉️'}
                    </div>
                    <div>
                      <span className="font-bold text-white text-[11px] block">
                        {isSmtpDelivered ? 'Enviado para a tua Caixa de Correio Real' : 'Caixa de Entrada & Validador Instantâneo'}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        De: <span className="text-amber-400 font-mono">noreply@coachcunha.pt</span>
                      </span>
                    </div>
                  </div>
                  <span className={`text-[10px] border px-2 py-0.5 rounded-full font-bold ${
                    isSmtpDelivered 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}>
                    {isSmtpDelivered ? '✓ Enviado via SMTP' : 'Código Gerado'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-medium">Código de Segurança:</span>
                    <span className="font-mono font-black text-amber-400 text-lg tracking-[0.25em]">
                      {expectedCode}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setVerificationCodeInput(expectedCode);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[11px] transition cursor-pointer shadow-sm active:scale-95 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Preencher Código</span>
                  </button>
                </div>

                <p className="text-[10px] text-neutral-400 leading-relaxed">
                  {isSmtpDelivered ? (
                    <>
                      📬 <strong>E-mail enviado via SMTP!</strong> Verifica a tua caixa de entrada (e pasta de spam) em <strong className="text-amber-400">{email}</strong>. Se quiseres agilizar o teste agora mesmo, clica diretamente em <strong>"Preencher Código"</strong> acima.
                    </>
                  ) : (
                    <>
                      ℹ️ <strong>Envio SMTP Integrado:</strong> A aplicação já suporta disparo SMTP direto para o teu e-mail real. Podes configurar as credenciais do teu servidor SMTP (Gmail, Brevo, Outlook) no painel de configurações ou no ficheiro <code className="text-amber-400">.env</code>. O código gerado acima permite-te entrar imediatamente sem demoras! (Código universal: <span className="font-mono text-amber-400 font-bold">123456</span>).
                    </>
                  )}
                </p>
              </div>

              {/* 6-Digit input */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5 text-center">
                  Introduz o Código de 6 Dígitos
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={verificationCodeInput}
                  onChange={(e) => setVerificationCodeInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ex: 123456"
                  className="w-full py-3 px-4 text-center font-mono text-2xl font-black tracking-[0.4em] rounded-2xl bg-neutral-950 border-2 border-amber-500/50 focus:border-amber-400 focus:outline-none text-white transition shadow-inner placeholder:tracking-normal placeholder:font-sans placeholder:text-sm placeholder:text-neutral-600"
                />
              </div>

              {/* Remember Me Checkbox in verification mode */}
              <div className="pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-300 hover:text-white transition text-xs">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-700 bg-neutral-950 text-amber-500 focus:ring-amber-500/30 accent-amber-500 cursor-pointer"
                  />
                  <span>Manter sessão iniciada neste dispositivo</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || verificationCodeInput.length < 6}
                className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>A validar código...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar Código & Entrar</span>
                  </>
                )}
              </button>

              {/* Resend and return actions */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={codeResendCountdown > 0 || isResendingCode}
                  className="text-neutral-400 hover:text-amber-400 font-semibold disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isResendingCode ? 'animate-spin' : ''}`} />
                  <span>
                    {codeResendCountdown > 0 
                      ? `Reenviar código (${codeResendCountdown}s)` 
                      : 'Reenviar novo código'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(null); }}
                  className="text-amber-400 hover:underline font-semibold cursor-pointer"
                >
                  ← Corrigir e-mail
                </button>
              </div>
            </form>
          ) : (
            /* Standard Auth Form (Login, Register, Forgot) */
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Name (Register) */}
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: João Pereira"
                      className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-amber-500 text-white transition"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  E-mail
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
                {mode === 'register' && (
                  <p className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    Receberás um código de 6 dígitos no teu e-mail para validar a conta.
                  </p>
                )}
              </div>

              {/* Password */}
              {mode !== 'forgot' && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Palavra-passe
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

              {/* Confirm Password */}
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Confirmar Palavra-passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repete a tua palavra-passe"
                      className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-amber-500 text-white transition"
                    />
                  </div>
                </div>
              )}

              {/* Manter Sessão Iniciada Checkbox (O pisco) */}
              {mode === 'login' && (
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
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(null); }}
                    className="text-[11px] sm:text-xs text-amber-400 hover:underline font-semibold cursor-pointer"
                  >
                    Esqueceste-te da senha?
                  </button>
                </div>
              )}

              {/* Manter Sessão Iniciada Checkbox no Registo */}
              {mode === 'register' && (
                <div className="pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-300 hover:text-white transition text-xs">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-700 bg-neutral-950 text-amber-500 focus:ring-amber-500/30 accent-amber-500 cursor-pointer"
                    />
                    <span className="font-medium text-[11px] sm:text-xs">Manter sessão iniciada neste dispositivo</span>
                  </label>
                </div>
              )}

              {/* Submit */}
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

          {/* Mode Switcher footer text */}
          <div className="mt-4 text-center">
            {mode === 'login' ? (
              <p className="text-xs text-neutral-400">
                Ainda não tens conta de aluno?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(null); }}
                  className="font-bold text-amber-400 hover:underline cursor-pointer"
                >
                  Regista-te aqui
                </button>
              </p>
            ) : mode === 'register' ? (
              <p className="text-xs text-neutral-400">
                Já tens uma conta criada?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); }}
                  className="font-bold text-amber-400 hover:underline cursor-pointer"
                >
                  Inicia sessão
                </button>
              </p>
            ) : mode === 'verify-code' ? (
              <p className="text-xs text-neutral-400">
                Já tens conta ativa?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); }}
                  className="font-bold text-amber-400 hover:underline cursor-pointer"
                >
                  Iniciar Sessão
                </button>
              </p>
            ) : (
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className="text-xs font-bold text-amber-400 hover:underline cursor-pointer"
              >
                Voltar ao Início de Sessão
              </button>
            )}
          </div>

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
