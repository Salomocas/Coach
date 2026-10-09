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
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLogo } from '../../context/LogoContext';
import { CoachCunhaLogo } from '../../components/CoachCunhaLogo';

export const AuthPortalView: React.FC = () => {
  const { 
    loginWithEmail, 
    registerWithEmail, 
    loginWithGoogle, 
    sendResetPassword,
    switchPersona 
  } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { updateLogo, isCustomLogo } = useLogo();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Logo dropzone state directly on the authentication view
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Por favor carrega um ficheiro de imagem válido (ex: Logo.jpeg ou PNG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        updateLogo(dataUrl, file.name, file.size);
        setSuccessMessage(`Logótipo oficial "${file.name}" atualizado e centralizado com sucesso!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingLogo(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLogoFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Por favor indica o teu nome completo.');
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
        await loginWithEmail(email.trim(), password);
      } else if (mode === 'register') {
        await registerWithEmail(email.trim(), password, name.trim());
        setSuccessMessage(
          `Conta de aluno criada com sucesso! Enviámos um link de validação para ${email.trim()}. Acede ao teu correio para confirmar a conta.`
        );
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

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccessMessage(null);
    setLoading(true);
    try {
      await loginWithGoogle();
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

      {/* Top Bar with Brand & Theme Toggle */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500/90">
            Coach Cunha Project
          </span>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-300 hover:text-amber-400 hover:border-amber-500/40 transition shadow-sm text-xs flex items-center gap-2 cursor-pointer"
          title={isDark ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          <span className="hidden sm:inline text-[11px] font-semibold">
            {isDark ? 'Modo Claro' : 'Modo Escuro'}
          </span>
        </button>
      </header>

      {/* Main Central Authentication Card */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-md w-full mx-auto">
        
        {/* Central Official App Logo & Quick Dropzone */}
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDraggingLogo(true); }}
          onDragLeave={() => setIsDraggingLogo(false)}
          onDrop={handleLogoDrop}
          className={`mb-5 flex flex-col items-center animate-fade-in transition-all duration-300 p-3 rounded-3xl ${
            isDraggingLogo 
              ? 'ring-2 ring-amber-500 bg-amber-500/10 scale-105' 
              : 'hover:bg-neutral-900/30'
          }`}
        >
          <div className="relative group cursor-pointer" onClick={() => logoInputRef.current?.click()}>
            <CoachCunhaLogo size="hero" />
            
            {/* Quick hover badge to change/drop logo */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-3xl transition flex flex-col items-center justify-center text-amber-400 p-2 text-center">
              <Upload className="w-6 h-6 mb-1 animate-bounce" />
              <span className="text-[11px] font-bold">Larga ou Clica aqui</span>
              <span className="text-[9px] text-neutral-300">para colocar Logo.jpeg</span>
            </div>
          </div>

          <div className="mt-2 text-center">
            <span className="text-[11px] font-extrabold tracking-[0.25em] text-amber-400 uppercase drop-shadow-md">
              Acompanhamento de Elite & Alta Performance
            </span>
            <p className="text-xs text-neutral-400 mt-0.5">
              Portal Central de Autenticação
            </p>
          </div>

          {/* Direct Button to drop or upload Logo.jpeg */}
          <div className="mt-1.5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold transition hover:underline cursor-pointer"
              title="Carregar ou substituir o logótipo oficial da aplicação"
            >
              <Upload className="w-3 h-3" />
              <span>{isCustomLogo ? 'Alterar Logótipo Oficial' : 'Carregar / Dropar Imagem Oficial (Logo.jpeg)'}</span>
            </button>
            <input 
              type="file" 
              ref={logoInputRef} 
              onChange={(e) => e.target.files?.[0] && handleLogoFile(e.target.files[0])} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
        </div>

        {/* Authentication Box */}
        <div className="w-full bg-neutral-900/90 border border-neutral-800/90 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl transition-all">
          
          {/* Tabs */}
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
          {mode !== 'forgot' && (
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

          {/* Form */}
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
                  Receberás um link de validação no teu e-mail para confirmar a tua conta.
                </p>
              )}
            </div>

            {/* Password */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-neutral-300">
                    Palavra-passe
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setError(null); }}
                      className="text-[11px] text-amber-400 hover:underline font-semibold cursor-pointer"
                    >
                      Esqueceste-te da senha?
                    </button>
                  )}
                </div>
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-4 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>A verificar...</span>
                </>
              ) : mode === 'login' ? (
                <>
                  <span>Entrar no Programa</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : mode === 'register' ? (
                <>
                  <span>Criar Conta de Aluno & Receber Link</span>
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
              onClick={() => switchPersona('coach')}
              className="py-2 px-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25 transition font-semibold flex flex-col items-center justify-center gap-0.5 cursor-pointer"
              title="Entrar imediatamente como Coach (sgpmcunha@gmail.com)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] leading-tight">Coach PT</span>
            </button>
            
            <button
              type="button"
              onClick={() => switchPersona('admin')}
              className="py-2 px-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 hover:bg-purple-500/25 transition font-semibold flex flex-col items-center justify-center gap-0.5 cursor-pointer"
              title="Entrar como Super Admin para manipular qualquer atleta ou coach"
            >
              <UserCog className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[11px] leading-tight">Super Admin</span>
            </button>

            <button
              type="button"
              onClick={() => switchPersona('client', 0)}
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

    </div>
  );
};
