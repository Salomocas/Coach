import React, { useState } from 'react';
import { 
  Bell, 
  ChevronDown, 
  LogOut, 
  CheckCircle2, 
  Calendar, 
  Utensils, 
  MessageSquare, 
  UserCog,
  KeyRound,
  Sun,
  Moon,
  ShieldCheck,
  UserCheck,
  Sparkles,
  ArrowLeft,
  Settings,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { EditProfileModal } from './EditProfileModal';
import { ChangePasswordModal } from './ChangePasswordModal';
import { SettingsModal } from './SettingsModal';

interface NavbarProps {
  onNavigateClient?: (view: string) => void;
  onNavigateCoach?: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateClient, onNavigateCoach }) => {
  const { 
    currentUser, 
    firebaseUser, 
    isCoach, 
    isAdmin, 
    canAccessCoach,
    isImpersonating,
    stopImpersonation,
    impersonateProfile,
    switchPersona, 
    logout, 
    allClients 
  } = useAuth();

  const { notifications, unreadCount, markNotificationAsRead } = useData();
  const { theme, isDark, toggleTheme } = useTheme();
  
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAdminSwitcher, setShowAdminSwitcher] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'theme' | 'logo' | 'security' | 'profile'>('theme');

  return (
    <>
      {/* Super Admin Impersonation Notice Bar */}
      {isImpersonating && (
        <div className="bg-amber-500 text-black px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md z-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>
              Modo Administrador: A manipular a conta de <span className="underline">{currentUser?.displayName}</span> ({currentUser?.role === 'coach' ? 'Coach' : 'Aluno'}).
            </span>
          </div>
          <button
            onClick={stopImpersonation}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black text-amber-400 hover:bg-neutral-900 transition text-[11px] font-extrabold cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Perfil Principal</span>
          </button>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-neutral-100 px-4 lg:px-8 py-2.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-lg tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                  Coach Cunha <span className="text-amber-500">Project</span>
                </span>
                
                {/* Role badge only for Coach/Admin - student mode indicator removed as requested */}
                {(isAdmin || isCoach) && (
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                    isAdmin
                      ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                      : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  }`}>
                    {isAdmin ? 'Super Admin' : 'Modo PT (Coach)'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-neutral-400 hidden sm:block">
                Acompanhamento de Treino, Nutrição & Performance
              </p>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Admin Switcher: Only accessible to Coach & Admin to inspect/manipulate accounts */}
            {canAccessCoach && (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setShowAdminSwitcher(!showAdminSwitcher)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:border-amber-500/50 text-xs font-semibold text-slate-700 dark:text-neutral-300 transition"
                  title="Controlar ou inspecionar perfil de aluno/coach"
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span className="truncate max-w-[120px]">
                    {isCoach ? 'Ver Perfil' : currentUser?.displayName}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showAdminSwitcher && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-2xl z-50 p-2 text-xs">
                    <p className="px-2 py-1 text-[10px] font-extrabold uppercase text-amber-500 tracking-wider">
                      Painel de Gestão: Alternar Perfil
                    </p>
                    
                    <button
                      onClick={() => {
                        impersonateProfile('coach');
                        setShowAdminSwitcher(false);
                      }}
                      className="w-full text-left px-2 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-800 dark:text-neutral-200 flex items-center justify-between font-semibold"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>Coach Sérgio Cunha (PT)</span>
                      </div>
                      {isCoach && <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />}
                    </button>

                    <div className="my-1 border-t border-slate-200 dark:border-neutral-800" />
                    <p className="px-2 py-1 text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase">
                      Alunos para Manipulação:
                    </p>

                    <div className="max-h-48 overflow-y-auto space-y-0.5">
                      {allClients.map((client) => (
                        <button
                          key={client.uid}
                          onClick={() => {
                            impersonateProfile(client);
                            setShowAdminSwitcher(false);
                          }}
                          className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-300 flex items-center justify-between text-xs"
                        >
                          <span className="truncate">{client.displayName}</span>
                          {!isCoach && currentUser?.uid === client.uid && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2 rounded-xl bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-neutral-700 transition shadow-sm cursor-pointer"
                aria-label="Notificações"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-black font-bold text-[10px] flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-2xl z-50 p-3 transition-colors">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-neutral-800">
                    <div className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-500" />
                      Notificações
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-neutral-400">
                      {unreadCount} novas
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-center text-xs text-slate-400 dark:text-neutral-500 py-4">Sem notificações de momento.</p>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            if (notif.type === 'workout' && onNavigateClient) onNavigateClient('calendar');
                            if (notif.type === 'nutrition' && onNavigateClient) onNavigateClient('nutrition');
                            if (notif.type === 'chat' && onNavigateClient) onNavigateClient('chat');
                            setShowNotifs(false);
                          }}
                          className={`p-2.5 rounded-xl text-xs cursor-pointer transition ${
                            notif.read 
                              ? 'bg-slate-50 dark:bg-neutral-950/60 text-slate-500 dark:text-neutral-400' 
                              : 'bg-amber-50 dark:bg-neutral-800/80 text-slate-800 dark:text-neutral-200 border border-amber-500/20'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5">
                              {notif.type === 'workout' && <Calendar className="w-3.5 h-3.5 text-amber-500" />}
                              {notif.type === 'nutrition' && <Utensils className="w-3.5 h-3.5 text-emerald-500" />}
                              {notif.type === 'chat' && <MessageSquare className="w-3.5 h-3.5 text-sky-500" />}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-slate-900 dark:text-white flex items-center justify-between">
                                <span>{notif.title}</span>
                                <span className="text-[10px] text-slate-400 dark:text-neutral-500">{notif.createdAt}</span>
                              </div>
                              <p className="text-[11px] text-slate-600 dark:text-neutral-300 mt-0.5 line-clamp-2">{notif.message}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ONLY BUTTON: Sair / Terminar Sessão (Returns to Auth Portal) */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 hover:border-red-500/30 font-bold text-xs transition cursor-pointer"
              title="Terminar Sessão e voltar à página de autenticação"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>

            {/* User Profile & Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-xl bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 transition shadow-sm cursor-pointer"
              >
                <img
                  src={currentUser?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={currentUser?.displayName}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-300 dark:ring-neutral-700"
                />
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                    {currentUser?.displayName}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-neutral-400">
                    {isAdmin ? 'Administrador' : isCoach ? 'Treinador Principal (PT)' : currentUser?.subscriptionPlan}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-2xl z-50 p-2 text-xs transition-colors">
                  <div className="p-2 border-b border-slate-200 dark:border-neutral-800 mb-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{currentUser?.displayName}</p>
                      {(isAdmin || isCoach) && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isAdmin
                            ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400'
                            : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                        }`}>
                          {isAdmin ? 'Admin' : 'Coach PT'}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 dark:text-neutral-400 text-[11px] truncate mt-0.5">{currentUser?.email}</p>
                    
                    {firebaseUser && (
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${firebaseUser.emailVerified ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span className="text-[10px] text-slate-600 dark:text-neutral-300">
                          {firebaseUser.emailVerified ? 'E-mail Verificado ✅' : 'E-mail por Confirmar ⚠️'}
                        </span>
                      </div>
                    )}

                    <div className="mt-1 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${currentUser?.subscriptionStatus === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className="text-[10px] text-slate-600 dark:text-neutral-300 capitalize">
                        Subscrição: {currentUser?.isManuallyUnlocked ? 'Acesso Livre (Coach)' : currentUser?.subscriptionStatus === 'active' ? 'Ativa' : 'Expirada / Pendente'}
                      </span>
                    </div>
                  </div>

                  {/* Actions & Settings Menu */}
                  <div className="py-1 border-b border-slate-200 dark:border-neutral-800/80 mb-1 space-y-0.5">
                    {/* Botão Configurações da Aplicação */}
                    <button
                      onClick={() => {
                        setSettingsTab('theme');
                        setIsSettingsOpen(true);
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white flex items-center gap-2.5 transition group cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-md bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition">
                        <Settings className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-semibold text-xs block text-slate-800 dark:text-neutral-200 group-hover:text-slate-900 dark:group-hover:text-white">Configurações</span>
                        <span className="text-[10px] text-slate-500 dark:text-neutral-400 block">Aparência, logótipo e sistema</span>
                      </div>
                    </button>

                    {/* Opção Imagens & Logótipo para Coach e Admin */}
                    {(isCoach || isAdmin) && (
                      <button
                        onClick={() => {
                          setSettingsTab('logo');
                          setIsSettingsOpen(true);
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white flex items-center gap-2.5 transition group cursor-pointer"
                      >
                        <div className="w-6 h-6 rounded-md bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition">
                          <ImageIcon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-semibold text-xs block text-slate-800 dark:text-neutral-200 group-hover:text-slate-900 dark:group-hover:text-white">Imagens & Logótipo</span>
                          <span className="text-[10px] text-slate-500 dark:text-neutral-400 block">Dropar imagem centralizada</span>
                        </div>
                      </button>
                    )}

                    {/* Edit Profile Action */}
                    <button
                      onClick={() => {
                        setIsEditProfileOpen(true);
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white flex items-center gap-2.5 transition group cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-md bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition">
                        <UserCog className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-semibold text-xs block text-slate-800 dark:text-neutral-200 group-hover:text-slate-900 dark:group-hover:text-white">Editar Perfil</span>
                        <span className="text-[10px] text-slate-500 dark:text-neutral-400 block">Alterar foto e nome</span>
                      </div>
                    </button>

                    {/* Alterar Palavra-passe Action */}
                    <button
                      onClick={() => {
                        setSettingsTab('security');
                        setIsSettingsOpen(true);
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white flex items-center gap-2.5 transition group cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-md bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition">
                        <KeyRound className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-semibold text-xs block text-slate-800 dark:text-neutral-200 group-hover:text-slate-900 dark:group-hover:text-white">Alterar Palavra-passe</span>
                        <span className="text-[10px] text-slate-500 dark:text-neutral-400 block">Credenciais e segurança</span>
                      </div>
                    </button>
                  </div>

                  {/* Theme Mode Quick Toggle Option in Dropdown */}
                  <div className="py-1 border-b border-slate-200 dark:border-neutral-800/80 mb-1">
                    <button
                      onClick={toggleTheme}
                      className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white flex items-center justify-between transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-slate-200 dark:bg-neutral-800 text-slate-700 dark:text-amber-400 flex items-center justify-center">
                          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                        </div>
                        <span className="font-medium text-xs">
                          {isDark ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-200 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400">
                        {theme}
                      </span>
                    </button>
                  </div>

                  {/* Impersonation exit if active */}
                  {isImpersonating && (
                    <div className="py-1 border-b border-slate-200 dark:border-neutral-800/80 mb-1">
                      <button
                        onClick={() => {
                          stopImpersonation();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 font-bold flex items-center gap-2"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Voltar ao Meu Perfil Admin</span>
                      </button>
                    </div>
                  )}

                  {/* Exit button in dropdown */}
                  <div className="pt-1">
                    <button
                      onClick={() => { logout(); setShowUserMenu(false); }}
                      className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center gap-2 font-bold cursor-pointer transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Terminar Sessão (Voltar ao Login)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Edit Profile Modal */}
        <EditProfileModal 
          isOpen={isEditProfileOpen} 
          onClose={() => setIsEditProfileOpen(false)} 
        />

        {/* Change Password Modal */}
        <ChangePasswordModal
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
        />

        {/* Application Settings Modal (Appearance, Logo Dropper, Security, Profile) */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          defaultTab={settingsTab}
        />
      </header>
    </>
  );
};
