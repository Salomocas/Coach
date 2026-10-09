import React, { useState } from 'react';
import { 
  X, 
  KeyRound, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Mail, 
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, firebaseUser, changePassword, sendResetPassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingResetEmail, setIsSendingResetEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Reset state when opening/closing
  React.useEffect(() => {
    if (isOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMessage('');
      setSuccessMessage('');
      setResetEmailSent(false);
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('A nova palavra-passe tem de ter no mínimo 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('A nova palavra-passe e a confirmação não coincidem.');
      return;
    }

    if (currentPassword && currentPassword === newPassword) {
      setErrorMessage('A nova palavra-passe deve ser diferente da palavra-passe atual.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await changePassword(newPassword, currentPassword || undefined);
      setSuccessMessage(result.message || 'Palavra-passe alterada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        onClose();
      }, 1600);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Ocorreu um erro ao alterar a palavra-passe.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendResetEmail = async () => {
    const emailToSend = currentUser?.email || firebaseUser?.email;
    if (!emailToSend) {
      setErrorMessage('Nenhum e-mail associado a esta conta.');
      return;
    }

    setIsSendingResetEmail(true);
    setErrorMessage('');
    try {
      await sendResetPassword(emailToSend);
      setResetEmailSent(true);
    } catch (err: any) {
      setErrorMessage('Não foi possível enviar o e-mail de redefinição. Tenta novamente.');
    } finally {
      setIsSendingResetEmail(false);
    }
  };

  const isLengthValid = newPassword.length >= 6;
  const isMatchValid = newPassword.length > 0 && newPassword === confirmPassword;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Alterar Palavra-passe
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Segurança & Credenciais da Conta
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User identification info */}
        <div className="px-5 sm:px-6 pt-4 pb-2">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-100/70 dark:bg-neutral-800/50 border border-slate-200/80 dark:border-neutral-800">
            <img
              src={currentUser?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={currentUser?.displayName}
              className="w-9 h-9 rounded-xl object-cover ring-1 ring-amber-500/40"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {currentUser?.displayName}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-neutral-400 truncate">
                {currentUser?.email}
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Protegido</span>
            </div>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 pt-2">
          {/* Status feedback */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2.5 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {resetEmailSent && (
            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs flex items-start gap-2.5">
              <Mail className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                Enviámos um link de redefinição para <strong>{currentUser?.email}</strong>. Consulta a tua caixa de entrada ou spam.
              </div>
            </div>
          )}

          {/* Current password input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
              Palavra-passe Atual
              <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-normal ml-1">
                (opcional se sessão recente)
              </span>
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-300"
                tabIndex={-1}
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New password input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
              Nova Palavra-passe
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-300"
                tabIndex={-1}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm new password input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
              Confirmar Nova Palavra-passe
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repete a nova palavra-passe"
                required
                minLength={6}
                className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-300"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Dynamic Password checklist */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-1.5 text-[11px]">
            <div className={`flex items-center gap-2 ${isLengthValid ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400 dark:text-neutral-500'}`}>
              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${isLengthValid ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-200 dark:bg-neutral-800'}`}>
                {isLengthValid ? '✓' : '•'}
              </div>
              <span>No mínimo 6 caracteres</span>
            </div>
            <div className={`flex items-center gap-2 ${isMatchValid ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400 dark:text-neutral-500'}`}>
              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${isMatchValid ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-200 dark:bg-neutral-800'}`}>
                {isMatchValid ? '✓' : '•'}
              </div>
              <span>As duas palavras-passe coincidem</span>
            </div>
          </div>

          {/* Reset link alternative button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleSendResetEmail}
              disabled={isSendingResetEmail || resetEmailSent}
              className="text-[11px] text-amber-600 dark:text-amber-400 hover:text-amber-500 underline flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>
                {isSendingResetEmail 
                  ? 'A enviar link...' 
                  : resetEmailSent 
                  ? 'Link de recuperação enviado com sucesso!' 
                  : 'Esqueceste-te da senha? Enviar link de redefinição por e-mail'}
              </span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 text-xs font-semibold text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isLengthValid || !isMatchValid}
              className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>A guardar...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Alterar Palavra-passe</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
