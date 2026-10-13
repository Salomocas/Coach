import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  TrendingUp, 
  X, 
  Sparkles, 
  Lock, 
  Unlock,
  Trash2,
  Database,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
  ShieldAlert,
  Server,
  UserPlus,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  Mail,
  Clock,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { UserProfile, AuthorizedStudent, PasswordResetRequest } from '../../types';
import { firebaseConfig } from '../../firebase';

interface CoachAthletesViewProps {
  onNavigateTab: (tab: string) => void;
}

export const CoachAthletesView: React.FC<CoachAthletesViewProps> = ({ onNavigateTab }) => {
  const { 
    allClients, 
    toggleStudentManualAccess, 
    deleteClientAccount, 
    isAdmin, 
    isCoach,
    authorizedStudents,
    authorizeEmail,
    revokeAuthorizedEmail,
    passwordResetRequests,
    unlockPasswordReset
  } = useAuth();
  const { setSelectedAthleteId } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // State for athlete deletion confirmation modal
  const [clientToDelete, setClientToDelete] = useState<UserProfile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State for Database Info Modal
  const [showDatabaseModal, setShowDatabaseModal] = useState(false);

  const filteredClients = allClients.filter(c => {
    return c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           c.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleToggleAccess = async (client: UserProfile) => {
    const isCurrentlyActive = client.subscriptionStatus === 'active' || client.isManuallyUnlocked;
    const newUnlock = !isCurrentlyActive;
    await toggleStudentManualAccess(client.uid, newUnlock);
    
    setActionFeedback(newUnlock
      ? `Acesso ativado para ${client.displayName} (sem pagar).`
      : `Acesso bloqueado para ${client.displayName}.`
    );
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const handleUnlockReset = async (email: string) => {
    try {
      await unlockPasswordReset(email);
      setActionFeedback(`🔓 Desbloqueio aprovado para ${email}! Quando o aluno aceder à aplicação, será encaminhado diretamente para definir a nova palavra-passe.`);
      setTimeout(() => setActionFeedback(null), 6000);
    } catch (err: any) {
      alert(err?.message || 'Erro ao desbloquear recuperação.');
    }
  };

  const pendingResetRequests = passwordResetRequests.filter(r => r.status === 'pending');

  const handleOpenAthlete = (clientId: string) => {
    setSelectedAthleteId(clientId);
    onNavigateTab('reports');
  };

  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteClientAccount(clientToDelete.uid);
      setActionFeedback(`Conta de ${clientToDelete.displayName} (${clientToDelete.email}) foi eliminada com sucesso.`);
      setClientToDelete(null);
      setTimeout(() => setActionFeedback(null), 5000);
    } catch (err: any) {
      alert(err?.message || 'Erro ao eliminar conta.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      
      {/* Feedback Toast */}
      {actionFeedback && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-medium flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
          <button 
            onClick={() => setActionFeedback(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-amber-500" />
            <span>Gestão de Atletas & Contas</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
            Estado de ativação, eliminação e controlo de acesso dos alunos ({allClients.length} registados)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Authorize Student in Settings Button */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open-settings', { detail: { tab: 'authorizations' } }))}
            className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer shadow-sm shadow-amber-500/20"
            title="Abrir Configurações do Coach para autorizar novos alunos"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Autorizar Alunos</span>
          </button>

          {/* Database Guide Button */}
          <button
            type="button"
            onClick={() => setShowDatabaseModal(true)}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-neutral-700"
            title="Como aceder à Base de Dados e gerir contas"
          >
            <Database className="w-3.5 h-3.5 text-amber-500" />
            <span>Base de Dados</span>
          </button>

          {/* Search */}
          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 text-slate-400 dark:text-neutral-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar atleta..."
              className="w-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* NOTIFICAÇÃO: Pedidos de Recuperação de Palavra-passe */}
      {pendingResetRequests.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-red-500/10 to-amber-500/15 border-2 border-amber-500/60 shadow-lg shadow-amber-500/10 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-black flex items-center justify-center font-black animate-pulse shadow-md shadow-amber-500/30">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{pendingResetRequests.length === 1 ? '1 Pedido de Recuperação de Senha' : `${pendingResetRequests.length} Pedidos de Recuperação de Senha`}</span>
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 text-[10px] font-bold animate-pulse">
                    Requer Desbloqueio
                  </span>
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                  O aluno esqueceu a palavra-passe e solicitou recuperação. Clica em desbloquear para autorizares a definição da nova senha.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {pendingResetRequests.map((req) => (
              <div 
                key={req.email}
                className="p-3.5 bg-white dark:bg-neutral-900 rounded-xl border border-amber-500/40 flex items-center justify-between gap-3 shadow-sm"
              >
                <div className="min-w-0">
                  <span className="font-bold text-xs text-slate-900 dark:text-white block truncate">
                    {req.studentName}
                  </span>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-mono block truncate">
                    {req.email}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>Pedido às: {new Date(req.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleUnlockReset(req.email)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition flex items-center gap-1.5 shrink-0 shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Desbloquear Acesso</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Database Quick Access Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-neutral-900/40 to-neutral-900/60 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-800 dark:text-white block sm:inline">
              Base de Dados Ativa em Nuvem:
            </span>{' '}
            <span className="text-slate-600 dark:text-neutral-300">
              Google Firestore (Projeto <code className="bg-neutral-800/80 px-1.5 py-0.5 rounded text-amber-400 font-mono text-[11px]">{firebaseConfig.projectId}</code>).
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowDatabaseModal(true)}
          className="text-amber-500 dark:text-amber-400 hover:underline font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0"
        >
          <span>Instruções de acesso e eliminação</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Clean, spacious athlete list with only identity, active/blocked state and switch */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-neutral-800">
        {filteredClients.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Nenhum atleta encontrado para a pesquisa.
          </div>
        ) : (
          filteredClients.map((client) => {
            const isActive = client.subscriptionStatus === 'active' || client.isManuallyUnlocked;

            return (
              <div 
                key={client.uid}
                className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-neutral-800/30 transition"
              >
                {/* Athlete identity */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={client.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={client.displayName}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-neutral-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {client.displayName}
                      </h3>
                      {client.emailVerified && (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.2 rounded font-semibold">
                          E-mail Validado
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 truncate">
                      {client.email}
                    </p>
                  </div>
                </div>

                {/* Right side: Activation State, Reports, and Account Deletion */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  {/* Status Indicator */}
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span className="hidden sm:inline">{isActive ? 'Acesso Ativo' : 'Versão Bloqueada'}</span>
                  </span>

                  {/* Toggle Button */}
                  <button
                    onClick={() => handleToggleAccess(client)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-slate-100 hover:bg-red-500/10 text-slate-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-neutral-700'
                        : 'bg-emerald-500 text-black hover:bg-emerald-400 font-extrabold shadow-sm'
                    }`}
                    title={isActive ? 'Bloquear programa do atleta' : 'Desbloquear programa sem pagar'}
                  >
                    {isActive ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Bloquear</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Desbloquear (Sem Pagar)</span>
                      </>
                    )}
                  </button>

                  {/* Open / Relatório */}
                  <button
                    onClick={() => handleOpenAthlete(client.uid)}
                    className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-black dark:text-amber-400 transition cursor-pointer"
                    title="Ver Relatórios do Atleta"
                  >
                    <TrendingUp className="w-4 h-4" />
                  </button>

                  {/* Eliminar Conta Permanentemente */}
                  <button
                    onClick={() => setClientToDelete(client)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white transition cursor-pointer border border-red-500/20"
                    title="Eliminar esta conta do sistema e da base de dados"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Modal for Deleting Account */}
      {clientToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-red-500/30 rounded-3xl max-w-md w-full p-6 shadow-2xl text-white space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-white">
                Eliminar Conta do Sistema
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Tens a certeza que desejas eliminar permanentemente esta conta?
              </p>
            </div>

            {/* Account Details Box */}
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-2xl text-xs space-y-1">
              <div className="font-bold text-white flex items-center justify-between">
                <span>Nome:</span>
                <span className="text-amber-400">{clientToDelete.displayName}</span>
              </div>
              <div className="text-neutral-400 flex items-center justify-between">
                <span>E-mail:</span>
                <span className="font-mono text-white">{clientToDelete.email}</span>
              </div>
              <div className="text-neutral-400 flex items-center justify-between">
                <span>ID Firestore:</span>
                <span className="font-mono text-[10px] text-neutral-500">{clientToDelete.uid}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-xs text-red-300 leading-relaxed">
              ⚠️ <strong>Atenção:</strong> Os dados deste aluno serão removidos da coleção <code>users</code> da base de dados e a conta não poderá mais aceder ao sistema.
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setClientToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-600/30"
              >
                {isDeleting ? (
                  <span>A eliminar...</span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirmar Eliminação</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Informative Database Access Modal */}
      {showDatabaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Como Aceder à Base de Dados & Gerir Contas
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Guia de administração para o Coach Sérgio Cunha e Administrador
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDatabaseModal(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Option 1: Direct in App */}
              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Método 1: Eliminar Contas Diretamente na Aplicação (Recomendado)</span>
                </div>
                <p className="text-neutral-300 leading-relaxed">
                  Não precisas de abrir a consola técnica para remover uma conta indesejada. Basta clicares no ícone do caixote do lixo (<Trash2 className="w-3.5 h-3.5 inline text-red-500" />) na tabela de atletas acima.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-neutral-400 text-[11px]">
                  <li>O documento do aluno é eliminado da coleção <code className="text-amber-400">users</code> no Firestore.</li>
                  <li>O acesso à aplicação é revogado instantaneamente.</li>
                  <li>A lista de alunos atualiza automaticamente sem necessidade de reiniciar.</li>
                </ul>
              </div>

              {/* Option 2: Firebase Console Root */}
              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-purple-400 text-sm">
                  <Server className="w-4 h-4" />
                  <span>Método 2: Acesso Técnico ao Google Firebase Console</span>
                </div>
                <p className="text-neutral-300 leading-relaxed">
                  A base de dados da aplicação está aprovisionada no projeto <code className="text-amber-400 font-mono">{firebaseConfig.projectId}</code> com a base de dados Firestore <code className="text-amber-400 font-mono">{firebaseConfig.firestoreDatabaseId}</code>:
                </p>

                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] leading-relaxed">
                  <span className="font-semibold text-blue-200 block mb-1">ℹ️ Por que apareceu o aviso "Não tem projetos no Firebase"?</span>
                  O link anterior continha um identificador temporário. Além disso, se tiver mais de uma conta Google aberta no navegador, a consola da Google abre frequentemente na conta errada. Certifica-te de que no canto superior direito da consola Firebase está selecionada a tua conta Google (<code className="text-white font-semibold">sgpmcunha@gmail.com</code>).
                </div>

                <div className="space-y-2 bg-neutral-900/80 p-3 rounded-xl border border-neutral-800">
                  <div>
                    <span className="font-semibold text-white block">1. Firestore Database (Coleção 'users' e dados):</span>
                    <a 
                      href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/databases/${firebaseConfig.firestoreDatabaseId}/data`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline font-mono text-[11px] flex items-center gap-1 mt-0.5 break-all"
                    >
                      <span>{`https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/...`}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                    <span className="text-[11px] text-neutral-400 block mt-0.5">
                      Permite navegar pelas coleções, editar documentos ou clicar nos 3 pontos &gt; "Delete document".
                    </span>
                  </div>

                  <div className="pt-2 border-t border-neutral-800">
                    <span className="font-semibold text-white block">2. Firebase Authentication (Contas de Autenticação):</span>
                    <a 
                      href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/users`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline font-mono text-[11px] flex items-center gap-1 mt-0.5 break-all"
                    >
                      <span>{`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/users`}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                    <span className="text-[11px] text-neutral-400 block mt-0.5">
                      Permite ver todos os e-mails registados e eliminar contas diretamente no Auth.
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Safety Note */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <span>
                  <strong>Dica de Segurança:</strong> Os perfis do Coach Sérgio Cunha (<code className="text-white">sgpmcunha@gmail.com</code>) e do Administrador possuem proteção especial no sistema e nunca são apagados acidentalmente.
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowDatabaseModal(false)}
                className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
