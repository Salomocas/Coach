import React, { useState } from 'react';
import { Mail, CheckCircle2, RefreshCw, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const EmailVerificationBanner: React.FC = () => {
  const { firebaseUser, sendVerificationEmail, reloadUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  // Show only if user is logged in via Firebase, has an email, but it's not verified
  if (!firebaseUser || firebaseUser.emailVerified || dismissed || !firebaseUser.email) {
    return null;
  }

  const handleResend = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      await sendVerificationEmail();
      setStatusMessage('Novo link de confirmação enviado para o teu e-mail!');
    } catch (err: any) {
      console.warn('Resend verification email error:', err);
      setStatusMessage('Aguarde alguns instantes antes de reenviar novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = async () => {
    setLoading(true);
    try {
      await reloadUser();
      if (firebaseUser.emailVerified) {
        setStatusMessage('E-mail verificado com sucesso! Obrigado.');
      } else {
        setStatusMessage('O e-mail ainda não se encontra validado. Clica no link que recebeste no teu correio.');
      }
    } catch (err) {
      console.warn('Reload user error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-amber-500/15 border-b border-amber-500/30 text-slate-800 dark:text-neutral-200 px-4 py-2.5 transition animate-fade-in">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500 text-black flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-amber-700 dark:text-amber-400">
              Confirmação de Conta Pendente:
            </span>{' '}
            <span>
              Enviámos um link de validação para <strong className="underline">{firebaseUser.email}</strong>. Por favor verifica a tua caixa de correio.
            </span>
            {statusMessage && (
              <p className="font-semibold text-amber-600 dark:text-amber-300 mt-0.5">
                {statusMessage}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleResend}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-800 border border-amber-500/40 text-slate-800 dark:text-neutral-200 hover:text-amber-600 dark:hover:text-amber-400 font-semibold shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5 text-amber-500" />}
            <span>Reenviar link</span>
          </button>

          <button
            onClick={handleCheck}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-extrabold shadow-sm transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Já verifiquei</span>
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-neutral-400 dark:hover:text-neutral-200 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition"
            title="Fechar aviso temporariamente"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
