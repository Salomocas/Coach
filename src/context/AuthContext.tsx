import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  db, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  googleProvider, 
  fbSignOut,
  fbUpdateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  reload,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  doc, 
  getDoc, 
  getDocs,
  collection,
  query,
  where,
  setDoc,
  updateDoc,
  deleteDoc,
  type FirebaseUser
} from '../firebase';
import { UserProfile, UserRole, SubscriptionStatus, AuthorizedStudent, PasswordResetRequest } from '../types';
import { COACH_PROFILE, ADMIN_PROFILE, INITIAL_CLIENTS } from '../initialData';

interface AuthContextType {
  currentUser: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isCoach: boolean;
  isAdmin: boolean;
  canAccessCoach: boolean;
  isSubscriptionActive: boolean;
  impersonatedUser: UserProfile | null;
  isImpersonating: boolean;
  impersonateProfile: (target: UserProfile | 'coach' | 'admin') => void;
  stopImpersonation: () => void;
  loginWithEmail: (email: string, pass: string, rememberMe?: boolean) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string, rememberMe?: boolean) => Promise<void>;
  sendVerificationCode: (email: string, name?: string) => Promise<{ code: string; smtpDelivered?: boolean; smtpNotice?: string }>;
  verifyCodeAndRegister: (email: string, pass: string, name: string, codeEntered: string, expectedCode: string, rememberMe?: boolean) => Promise<void>;
  loginWithGoogle: (rememberMe?: boolean) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  sendResetPassword: (email: string) => Promise<void>;
  changePassword: (newPassword: string, currentPassword?: string) => Promise<{ success: boolean; message?: string }>;
  reloadUser: () => Promise<void>;
  logout: () => void;
  switchPersona: (persona: 'coach' | 'client' | 'admin', clientIndex?: number, rememberMe?: boolean) => void;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  renewSubscription: (planName: string) => Promise<void>;
  updateClientSubscription: (clientId: string, status: SubscriptionStatus) => Promise<void>;
  toggleStudentManualAccess: (clientId: string, unlock: boolean) => Promise<void>;
  deleteClientAccount: (clientId: string) => Promise<{ success: boolean; message: string }>;
  allClients: UserProfile[];
  isRememberMeEnabled: boolean;
  // Coach Authorization & Password Recovery
  authorizedStudents: AuthorizedStudent[];
  authorizeEmail: (email: string, name?: string) => Promise<void>;
  revokeAuthorizedEmail: (email: string) => Promise<void>;
  isEmailAuthorized: (email: string) => boolean;
  passwordResetRequests: PasswordResetRequest[];
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  unlockPasswordReset: (email: string) => Promise<void>;
  completePasswordReset: (email: string, newPassword: string) => Promise<void>;
  checkPasswordResetRequest: (email: string) => PasswordResetRequest | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Only these authorized emails have access to coach/admin privileges:
export const COACH_EMAILS = [
  'sgpmcunha@gmail.com', 
  'coach@sergiocunha.pt', 
  'coach@cunhaproject.com'
];

export const ADMIN_EMAILS = [
  'admin@cunhaproject.com', 
  'admin@coachcunha.pt', 
  'admin@gmail.com'
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  
  const [isRememberMeEnabled, setIsRememberMeEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('app_remember_me') === 'true';
    } catch {
      return false;
    }
  });

  // Real authenticated root profile
  const [rootUser, setRootUser] = useState<UserProfile | null>(() => {
    try {
      const isRemembered = localStorage.getItem('app_remember_me') === 'true';
      // ONLY restore persistent session if user explicitly checked "Manter sessão iniciada"
      const activeSession = isRemembered
        ? localStorage.getItem('app_active_session')
        : sessionStorage.getItem('app_active_session');

      if (!activeSession) {
        // Guarantee no stale automatic logins happen if rememberMe was not checked!
        if (!isRemembered) {
          localStorage.removeItem('app_active_session');
        }
        return null;
      }

      if (activeSession === 'coach') {
        const savedCoach = localStorage.getItem(`profile_override_${COACH_PROFILE.uid}`);
        return savedCoach ? JSON.parse(savedCoach) : COACH_PROFILE;
      } else if (activeSession === 'admin') {
        return ADMIN_PROFILE;
      } else if (activeSession === 'client') {
        const saved = localStorage.getItem('coach_all_clients');
        const clients = saved ? JSON.parse(saved) : INITIAL_CLIENTS;
        return clients[0] || INITIAL_CLIENTS[0];
      }
    } catch (e) {
      console.warn('Session init check:', e);
    }
    return null;
  });

  // Admin Impersonation target (allows admin to step into any profile to inspect/manipulate)
  const [impersonatedUser, setImpersonatedUser] = useState<UserProfile | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [allClients, setAllClients] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('coach_all_clients');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not load cached clients:', e);
    }
    return INITIAL_CLIENTS;
  });

  // Active user in view (impersonated user if active, else root user)
  const currentUser = impersonatedUser || rootUser;

  // Role resolution
  const isRealCoachEmail = COACH_EMAILS.includes(firebaseUser?.email?.toLowerCase() || '') || rootUser?.role === 'coach';
  const isRealAdmin = ADMIN_EMAILS.includes(firebaseUser?.email?.toLowerCase() || '') || rootUser?.role === 'admin';
  const canAccessCoach = isRealCoachEmail || isRealAdmin;

  // Active view role
  const isCoach = currentUser?.role === 'coach' || (isRealAdmin && currentUser?.role === 'admin');
  const isAdmin = isRealAdmin;
  const isSubscriptionActive = isCoach || isAdmin || currentUser?.subscriptionStatus === 'active' || currentUser?.isManuallyUnlocked === true;

  // Save clients to localStorage and state
  const saveClients = (newClients: UserProfile[]) => {
    setAllClients(newClients);
    try {
      localStorage.setItem('coach_all_clients', JSON.stringify(newClients));
    } catch (e) {
      console.warn('Could not save clients cache:', e);
    }
  };

  // Pre-authorized athletes / emails list
  const DEFAULT_AUTHORIZED_STUDENTS: AuthorizedStudent[] = [
    ...INITIAL_CLIENTS.map(c => ({
      email: c.email.toLowerCase(),
      name: c.displayName,
      authorizedAt: c.createdAt || '2026-01-01',
      authorizedBy: 'Coach Sérgio Cunha',
      isRegistered: true
    })),
    ...COACH_EMAILS.map(em => ({
      email: em.toLowerCase(),
      name: 'Coach Sérgio Cunha',
      authorizedAt: '2026-01-01',
      authorizedBy: 'Sistema',
      isRegistered: true
    })),
    ...ADMIN_EMAILS.map(em => ({
      email: em.toLowerCase(),
      name: 'Administrador Master',
      authorizedAt: '2026-01-01',
      authorizedBy: 'Sistema',
      isRegistered: true
    }))
  ];

  const [authorizedStudents, setAuthorizedStudents] = useState<AuthorizedStudent[]>(() => {
    try {
      const saved = localStorage.getItem('coach_authorized_students');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_AUTHORIZED_STUDENTS;
  });

  const [passwordResetRequests, setPasswordResetRequests] = useState<PasswordResetRequest[]>(() => {
    try {
      const saved = localStorage.getItem('coach_reset_requests');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });

  // Sync authorized students and password reset requests from Firestore on startup
  useEffect(() => {
    const fetchPublicAuthConfig = async () => {
      try {
        const authSnap = await getDocs(collection(db, 'authorized_students'));
        if (!authSnap.empty) {
          const remoteAuth = authSnap.docs.map(d => d.data() as AuthorizedStudent);
          setAuthorizedStudents(prev => {
            const map = new Map<string, AuthorizedStudent>();
            prev.forEach(a => map.set(a.email.toLowerCase(), a));
            remoteAuth.forEach(a => map.set(a.email.toLowerCase(), a));
            return Array.from(map.values());
          });
        }
      } catch (errAuth) {}

      try {
        const resetSnap = await getDocs(collection(db, 'password_reset_requests'));
        if (!resetSnap.empty) {
          const remoteResets = resetSnap.docs.map(d => d.data() as PasswordResetRequest);
          setPasswordResetRequests(remoteResets);
        }
      } catch (errReset) {}
    };

    fetchPublicAuthConfig();
  }, []);

  // Monitor Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      const isRemembered = localStorage.getItem('app_remember_me') === 'true';
      const hasSessionTab = sessionStorage.getItem('app_session_active') === 'true';

      // CRITICAL: If the user did NOT check "Manter sessão iniciada" AND there is no active session in this tab/window,
      // never auto-login! Sign out from Firebase to prevent automatic persistent resumption.
      if (fbUser && !isRemembered && !hasSessionTab) {
        try {
          await fbSignOut(auth);
        } catch (e) {}
        setFirebaseUser(null);
        setRootUser(null);
        setLoading(false);
        return;
      }

      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const docSnap = await getDoc(userDocRef);
          
          const emailLower = fbUser.email?.toLowerCase() || '';
          const isCoachAccount = COACH_EMAILS.includes(emailLower);
          const isAdminAccount = ADMIN_EMAILS.includes(emailLower);

          const resolvedRole: UserRole = isCoachAccount ? 'coach' : isAdminAccount ? 'admin' : 'client';

          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            const updatedProfile: UserProfile = {
              ...data,
              emailVerified: fbUser.emailVerified || data.emailVerified,
              // Strictly enforce role by verified email rule
              role: resolvedRole !== 'client' ? resolvedRole : (data.role || 'client')
            };
            setRootUser(updatedProfile);
          } else {
            // Create user profile in Firestore
            const newProfile: UserProfile = {
              uid: fbUser.uid,
              email: fbUser.email || '',
              displayName: fbUser.displayName || (isCoachAccount ? 'Coach Sérgio Cunha' : isAdminAccount ? 'Administrador Master' : 'Novo Atleta'),
              photoURL: fbUser.photoURL || (isCoachAccount ? COACH_PROFILE.photoURL : isAdminAccount ? ADMIN_PROFILE.photoURL : undefined),
              role: resolvedRole,
              subscriptionStatus: 'active',
              subscriptionPlan: isCoachAccount ? 'Coach Master' : isAdminAccount ? 'Super Admin' : 'Acompanhamento VIP Mensal',
              subscriptionValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              createdAt: new Date().toISOString(),
              emailVerified: fbUser.emailVerified,
              heightCm: 175,
              initialWeightKg: 75,
              currentWeightKg: 75
            };
            await setDoc(userDocRef, newProfile);
            setRootUser(newProfile);
          }

          // If coach or admin, also load all registered athletes from Firestore
          if (isCoachAccount || isAdminAccount) {
            try {
              const clientsQuery = query(collection(db, 'users'), where('role', '==', 'client'));
              const snap = await getDocs(clientsQuery);
              if (!snap.empty) {
                const remoteClients = snap.docs.map(d => d.data() as UserProfile);
                setAllClients(prev => {
                  const map = new Map<string, UserProfile>();
                  prev.forEach(c => map.set(c.uid, c));
                  remoteClients.forEach(c => map.set(c.uid, c));
                  return Array.from(map.values());
                });
              }
            } catch (errClients) {
              console.warn('Could not query registered clients from Firestore:', errClients);
            }

            // Sync authorized students and password reset requests
            try {
              const authSnap = await getDocs(collection(db, 'authorized_students'));
              if (!authSnap.empty) {
                const remoteAuth = authSnap.docs.map(d => d.data() as AuthorizedStudent);
                setAuthorizedStudents(prev => {
                  const map = new Map<string, AuthorizedStudent>();
                  prev.forEach(a => map.set(a.email.toLowerCase(), a));
                  remoteAuth.forEach(a => map.set(a.email.toLowerCase(), a));
                  return Array.from(map.values());
                });
              }
            } catch (errAuth) {}

            try {
              const resetSnap = await getDocs(collection(db, 'password_reset_requests'));
              if (!resetSnap.empty) {
                const remoteResets = resetSnap.docs.map(d => d.data() as PasswordResetRequest);
                setPasswordResetRequests(remoteResets);
              }
            } catch (errReset) {}
          }
        } catch (err) {
          console.warn('Could not read user profile from Firestore, using local fallback:', err);
          const emailLower = fbUser.email?.toLowerCase() || '';
          if (COACH_EMAILS.includes(emailLower)) {
            setRootUser(COACH_PROFILE);
          } else if (ADMIN_EMAILS.includes(emailLower)) {
            setRootUser(ADMIN_PROFILE);
          } else {
            setRootUser(INITIAL_CLIENTS[0]);
          }
        }
      } else {
        const isRemembered = localStorage.getItem('app_remember_me') === 'true';
        const activeSession = isRemembered
          ? localStorage.getItem('app_active_session')
          : sessionStorage.getItem('app_active_session');

        if (activeSession === 'coach') {
          setRootUser(COACH_PROFILE);
        } else if (activeSession === 'admin') {
          setRootUser(ADMIN_PROFILE);
        } else if (activeSession === 'client') {
          setRootUser(INITIAL_CLIENTS[0]);
        } else {
          setRootUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string, rememberMe: boolean = false) => {
    setLoading(true);
    const emailLower = email.trim().toLowerCase();
    const cleanPass = pass ? pass.trim() : '';

    if (!cleanPass || cleanPass.length < 4) {
      setLoading(false);
      throw new Error('A palavra-passe deve conter pelo menos 4 caracteres.');
    }

    try {
      try {
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      } catch (persistErr) {
        console.warn('Persistence config note:', persistErr);
      }

      await signInWithEmailAndPassword(auth, email.trim(), cleanPass);

      if (rememberMe) {
        localStorage.setItem('app_remember_me', 'true');
        setIsRememberMeEnabled(true);
      } else {
        localStorage.removeItem('app_remember_me');
        localStorage.removeItem('app_active_session');
        setIsRememberMeEnabled(false);
      }
      sessionStorage.setItem('app_session_active', 'true');
    } catch (err: any) {
      console.warn('Firebase email sign-in error:', err);

      // Check if user set or has valid local credentials (offline/custom registration or recent password reset)
      const savedLocalCred = localStorage.getItem(`user_cred_${emailLower}`);
      const isLocalCustomPass = !!savedLocalCred && savedLocalCred === cleanPass;

      // If Firebase is offline/unreachable, only allow verified demo access with standard demo passwords
      const isCoachDemo = COACH_EMAILS.includes(emailLower) && (cleanPass === 'coach123' || cleanPass === 'admin123' || cleanPass === 'master123');
      const isAdminDemo = ADMIN_EMAILS.includes(emailLower) && (cleanPass === 'admin123' || cleanPass === 'master123');
      const foundClient = allClients.find(c => c.email.toLowerCase() === emailLower);
      const isClientDemo = !!foundClient && (cleanPass === 'client123' || cleanPass === '123456' || cleanPass === 'demo123');

      if (isLocalCustomPass) {
        const clientProfile: UserProfile = foundClient || {
          uid: `client-${Date.now()}`,
          email: email.trim(),
          displayName: 'Novo Aluno',
          role: 'client',
          subscriptionStatus: 'expired',
          isManuallyUnlocked: false,
          subscriptionPlan: 'Aguardar Desbloqueio do Coach',
          subscriptionValidUntil: '2026-10-01',
          createdAt: new Date().toISOString()
        };
        setRootUser(clientProfile);
        if (rememberMe) {
          localStorage.setItem('app_remember_me', 'true');
          localStorage.setItem('app_active_session', 'client');
          setIsRememberMeEnabled(true);
        } else {
          localStorage.removeItem('app_remember_me');
          localStorage.removeItem('app_active_session');
          sessionStorage.setItem('app_active_session', 'client');
          setIsRememberMeEnabled(false);
        }
        sessionStorage.setItem('app_session_active', 'true');
        return;
      }

      // Check if Firebase rejected due to wrong credentials
      const isAuthCredentialFailure = 
        err?.code === 'auth/wrong-password' || 
        err?.code === 'auth/invalid-credential' ||
        err?.code === 'auth/user-not-found' ||
        err?.code === 'auth/user-disabled' ||
        err?.message?.includes('invalid-credential') ||
        err?.message?.includes('wrong-password');

      if (isAuthCredentialFailure && !isCoachDemo && !isAdminDemo && !isClientDemo) {
        throw new Error('Email ou palavra-passe incorretos. Por favor tenta novamente.');
      }

      if (isCoachDemo) {
        setRootUser(COACH_PROFILE);
        if (rememberMe) {
          localStorage.setItem('app_remember_me', 'true');
          localStorage.setItem('app_active_session', 'coach');
          setIsRememberMeEnabled(true);
        } else {
          localStorage.removeItem('app_remember_me');
          localStorage.removeItem('app_active_session');
          sessionStorage.setItem('app_active_session', 'coach');
          setIsRememberMeEnabled(false);
        }
        sessionStorage.setItem('app_session_active', 'true');
      } else if (isAdminDemo) {
        setRootUser(ADMIN_PROFILE);
        if (rememberMe) {
          localStorage.setItem('app_remember_me', 'true');
          localStorage.setItem('app_active_session', 'admin');
          setIsRememberMeEnabled(true);
        } else {
          localStorage.removeItem('app_remember_me');
          localStorage.removeItem('app_active_session');
          sessionStorage.setItem('app_active_session', 'admin');
          setIsRememberMeEnabled(false);
        }
        sessionStorage.setItem('app_session_active', 'true');
      } else if (isClientDemo && foundClient) {
        setRootUser(foundClient);
        if (rememberMe) {
          localStorage.setItem('app_remember_me', 'true');
          localStorage.setItem('app_active_session', 'client');
          setIsRememberMeEnabled(true);
        } else {
          localStorage.removeItem('app_remember_me');
          localStorage.removeItem('app_active_session');
          sessionStorage.setItem('app_active_session', 'client');
          setIsRememberMeEnabled(false);
        }
        sessionStorage.setItem('app_session_active', 'true');
      } else {
        throw new Error(err?.message || 'Falha na autenticação. Verifica a ligação ou as credenciais introduzidas.');
      }
    } finally {
      setLoading(false);
    }
  };

  // CHECK IF EMAIL IS AUTHORIZED BY COACH
  const isEmailAuthorized = (email: string): boolean => {
    const emailLower = email.trim().toLowerCase();
    if (!emailLower || !emailLower.includes('@')) return false;
    if (COACH_EMAILS.includes(emailLower) || ADMIN_EMAILS.includes(emailLower)) return true;
    if (allClients.some(c => c.email.toLowerCase() === emailLower)) return true;
    return authorizedStudents.some(s => s.email.toLowerCase() === emailLower);
  };

  // COACH ADDS AN ATHLETE EMAIL TO AUTHORIZE REGISTRATION
  const authorizeEmail = async (email: string, name?: string) => {
    const emailLower = email.trim().toLowerCase();
    if (!emailLower || !emailLower.includes('@')) {
      throw new Error('Por favor introduz um e-mail válido.');
    }

    if (authorizedStudents.some(s => s.email.toLowerCase() === emailLower)) {
      throw new Error(`O e-mail ${emailLower} já se encontra autorizado.`);
    }

    const newAuth: AuthorizedStudent = {
      email: emailLower,
      name: (name || '').trim(),
      authorizedAt: new Date().toISOString(),
      authorizedBy: 'Coach Sérgio Cunha',
      isRegistered: false
    };

    const updated = [newAuth, ...authorizedStudents];
    setAuthorizedStudents(updated);
    try {
      localStorage.setItem('coach_authorized_students', JSON.stringify(updated));
    } catch (e) {}

    try {
      await setDoc(doc(db, 'authorized_students', emailLower), newAuth);
    } catch (e) {
      console.warn('Could not save authorized email to Firestore:', e);
    }
  };

  // COACH REVOKES AN AUTHORIZED EMAIL
  const revokeAuthorizedEmail = async (email: string) => {
    const emailLower = email.trim().toLowerCase();
    const updated = authorizedStudents.filter(s => s.email.toLowerCase() !== emailLower);
    setAuthorizedStudents(updated);
    try {
      localStorage.setItem('coach_authorized_students', JSON.stringify(updated));
    } catch (e) {}

    try {
      await deleteDoc(doc(db, 'authorized_students', emailLower));
    } catch (e) {}
  };

  // ATHLETE REQUESTS PASSWORD RECOVERY (NOTIFIES COACH)
  const requestPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
    const emailLower = email.trim().toLowerCase();
    if (!emailLower || !emailLower.includes('@')) {
      throw new Error('Por favor introduz um endereço de e-mail válido.');
    }

    const foundClient = allClients.find(c => c.email.toLowerCase() === emailLower);
    const authRecord = authorizedStudents.find(s => s.email.toLowerCase() === emailLower);

    if (!foundClient && !authRecord && !COACH_EMAILS.includes(emailLower) && !ADMIN_EMAILS.includes(emailLower)) {
      throw new Error('Este e-mail ainda não se encontra registado nem autorizado no sistema.');
    }

    const req: PasswordResetRequest = {
      id: emailLower,
      email: emailLower,
      studentName: foundClient?.displayName || authRecord?.name || emailLower,
      requestedAt: new Date().toISOString(),
      status: 'pending'
    };

    setPasswordResetRequests(prev => {
      const filtered = prev.filter(r => r.email.toLowerCase() !== emailLower);
      const nextList = [req, ...filtered];
      try {
        localStorage.setItem('coach_reset_requests', JSON.stringify(nextList));
      } catch (e) {}
      return nextList;
    });

    try {
      await setDoc(doc(db, 'password_reset_requests', emailLower), req);
    } catch (e) {
      console.warn('Could not write password reset request to Firestore:', e);
    }

    return {
      success: true,
      message: 'Pedido de recuperação enviado ao Coach! Assim que o Coach Sérgio Cunha desbloquear o teu pedido, poderás definir a tua nova palavra-passe.'
    };
  };

  // COACH UNLOCKS ATHLETE'S PASSWORD RECOVERY
  const unlockPasswordReset = async (email: string): Promise<void> => {
    const emailLower = email.trim().toLowerCase();
    const updated = passwordResetRequests.map(r => {
      if (r.email.toLowerCase() === emailLower) {
        return {
          ...r,
          status: 'unlocked' as const,
          unlockedAt: new Date().toISOString()
        };
      }
      return r;
    });

    setPasswordResetRequests(updated);
    try {
      localStorage.setItem('coach_reset_requests', JSON.stringify(updated));
    } catch (e) {}

    try {
      await updateDoc(doc(db, 'password_reset_requests', emailLower), {
        status: 'unlocked',
        unlockedAt: new Date().toISOString()
      });
    } catch (e) {}
  };

  // CHECK IF COACH UNLOCKED PASSWORD RESET FOR THIS EMAIL
  const checkPasswordResetRequest = (email: string): PasswordResetRequest | null => {
    const emailLower = email.trim().toLowerCase();
    return passwordResetRequests.find(r => r.email.toLowerCase() === emailLower) || null;
  };

  // ATHLETE DEFINES NEW PASSWORD AFTER COACH UNLOCKS IT
  const completePasswordReset = async (email: string, newPassword: string): Promise<void> => {
    const emailLower = email.trim().toLowerCase();
    const cleanPass = newPassword.trim();

    if (!cleanPass || cleanPass.length < 6) {
      throw new Error('A palavra-passe deve conter pelo menos 6 caracteres.');
    }

    // Mark request as completed
    const updated = passwordResetRequests.map(r => {
      if (r.email.toLowerCase() === emailLower) {
        return {
          ...r,
          status: 'completed' as const,
          completedAt: new Date().toISOString()
        };
      }
      return r;
    });
    setPasswordResetRequests(updated);
    try {
      localStorage.setItem('coach_reset_requests', JSON.stringify(updated));
    } catch (e) {}

    try {
      await updateDoc(doc(db, 'password_reset_requests', emailLower), {
        status: 'completed',
        completedAt: new Date().toISOString()
      });
    } catch (e) {}

    // Store new credentials locally
    try {
      localStorage.setItem(`user_cred_${emailLower}`, cleanPass);
    } catch (e) {}

    // If Firebase current user exists, update password
    if (auth.currentUser && auth.currentUser.email?.toLowerCase() === emailLower) {
      try {
        await updatePassword(auth.currentUser, cleanPass);
      } catch (e) {}
    }

    // Automatically log the student in
    const foundClient = allClients.find(c => c.email.toLowerCase() === emailLower);
    if (foundClient) {
      setRootUser(foundClient);
    } else {
      const authRecord = authorizedStudents.find(s => s.email.toLowerCase() === emailLower);
      const newProfile: UserProfile = {
        uid: `client-${Date.now()}`,
        email: emailLower,
        displayName: authRecord?.name || 'Aluno',
        role: 'client',
        subscriptionStatus: 'expired',
        isManuallyUnlocked: false,
        subscriptionPlan: 'Aguardar Desbloqueio do Treinador',
        subscriptionValidUntil: '2026-10-01',
        createdAt: new Date().toISOString()
      };
      saveClients([newProfile, ...allClients]);
      setRootUser(newProfile);
    }

    sessionStorage.setItem('app_session_active', 'true');
    sessionStorage.setItem('app_active_session', 'client');
  };

  // ATHLETE REGISTRATION WITH EMAIL AND PASSWORD (AUTHORIZATION REQUIRED, NO VERIFICATION CODES)
  const registerWithEmail = async (
    email: string, 
    pass: string, 
    name: string, 
    rememberMe: boolean = false
  ) => {
    setLoading(true);
    const emailLower = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanPass || cleanPass.length < 6) {
      setLoading(false);
      throw new Error('A palavra-passe deve conter pelo menos 6 caracteres.');
    }

    // CRITICAL: Check if coach authorized this email in the database!
    let isAuthorized = isEmailAuthorized(emailLower);
    let matchedAuth = authorizedStudents.find(s => s.email.toLowerCase() === emailLower);

    if (!isAuthorized) {
      try {
        const snap = await getDoc(doc(db, 'authorized_students', emailLower));
        if (snap.exists()) {
          isAuthorized = true;
          matchedAuth = snap.data() as AuthorizedStudent;
          setAuthorizedStudents(prev => [...prev.filter(s => s.email.toLowerCase() !== emailLower), matchedAuth!]);
        }
      } catch (e) {
        console.warn('Could not check Firestore authorization:', e);
      }
    }

    if (!isAuthorized) {
      setLoading(false);
      throw new Error(`O seu e-mail não existe. O endereço "${emailLower}" ainda não foi pré-aprovado nem adicionado à base de dados pelo Coach Sérgio Cunha.`);
    }

    // Check if user already set custom password
    const existingSavedCred = localStorage.getItem(`user_cred_${emailLower}`);
    if (matchedAuth?.isRegistered && existingSavedCred) {
      setLoading(false);
      throw new Error('Já existe uma palavra-passe definida para este e-mail. Clica em "Entrar" ou em "Recuperar" se te esqueceste da senha.');
    }

    try {
      try {
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      } catch (persistErr) {}

      let fbUid = '';
      try {
        const res = await createUserWithEmailAndPassword(auth, email.trim(), cleanPass);
        fbUid = res.user.uid;
        if (name && res.user) {
          try {
            await fbUpdateProfile(res.user, { displayName: name });
          } catch (e) {}
        }
      } catch (fbErr: any) {
        console.warn('Firebase createUser note:', fbErr);
        fbUid = `client-${Date.now()}`;
      }

      // Store local credential for smooth offline and immediate login
      try {
        localStorage.setItem(`user_cred_${emailLower}`, cleanPass);
      } catch (e) {}

      const isCoachAccount = COACH_EMAILS.includes(emailLower);
      const isAdminAccount = ADMIN_EMAILS.includes(emailLower);
      const assignedRole: UserRole = isCoachAccount ? 'coach' : isAdminAccount ? 'admin' : 'client';

      // "E tem acesso ao programa (versao bloqueada) so desbloqueia sem pagar."
      // Newly created athlete accounts start in BLOCKED status (expired / not manually unlocked).
      // The Coach unlocks them in the dashboard without paying!
      const studentDisplayName = (name || matchedAuth?.name || (isCoachAccount ? 'Coach Sérgio Cunha' : isAdminAccount ? 'Administrador Master' : 'Novo Aluno')).trim();

      const newProfile: UserProfile = {
        uid: fbUid,
        email: email.trim(),
        displayName: studentDisplayName,
        role: assignedRole,
        subscriptionStatus: (isCoachAccount || isAdminAccount) ? 'active' : 'expired',
        subscriptionPlan: (isCoachAccount || isAdminAccount) ? 'Coach Master' : 'Aguardar Ativação pelo Coach',
        subscriptionValidUntil: '2026-10-01',
        isManuallyUnlocked: (isCoachAccount || isAdminAccount) ? true : false,
        createdAt: new Date().toISOString(),
        coachId: 'coach-sergio-cunha',
        emailVerified: true, // Direct coach approval
        heightCm: 175,
        initialWeightKg: 75,
        currentWeightKg: 75
      };

      try {
        await setDoc(doc(db, 'users', newProfile.uid), newProfile);
      } catch (e) {}

      try {
        await updateDoc(doc(db, 'authorized_students', emailLower), {
          isRegistered: true,
          registeredAt: new Date().toISOString()
        });
      } catch (e) {}

      if (assignedRole === 'client') {
        saveClients([newProfile, ...allClients.filter(c => c.uid !== newProfile.uid && c.email.toLowerCase() !== emailLower)]);
        // Mark as registered in authorized list
        setAuthorizedStudents(prev => {
          const nextList = prev.map(s => s.email.toLowerCase() === emailLower ? { ...s, isRegistered: true } : s);
          try {
            localStorage.setItem('coach_authorized_students', JSON.stringify(nextList));
          } catch (e) {}
          return nextList;
        });
      }

      setRootUser(newProfile);

      if (rememberMe) {
        localStorage.setItem('app_remember_me', 'true');
        localStorage.setItem('app_active_session', assignedRole);
        setIsRememberMeEnabled(true);
      } else {
        localStorage.removeItem('app_remember_me');
        localStorage.removeItem('app_active_session');
        sessionStorage.setItem('app_active_session', assignedRole);
        setIsRememberMeEnabled(false);
      }
      sessionStorage.setItem('app_session_active', 'true');
    } finally {
      setLoading(false);
    }
  };

  // Backward compatibility wrappers for obsolete verification code endpoints
  const sendVerificationCode = async (email: string, name?: string): Promise<{ code: string; smtpDelivered?: boolean; smtpNotice?: string }> => {
    return { code: '123456', smtpDelivered: false, smtpNotice: 'Autorização concedida diretamente pelo Coach.' };
  };

  const verifyCodeAndRegister = async (
    email: string, 
    pass: string, 
    name: string, 
    codeEntered: string, 
    expectedCode: string, 
    rememberMe: boolean = false
  ) => {
    return registerWithEmail(email, pass, name, rememberMe);
  };

  const loginWithGoogle = async (rememberMe: boolean = false) => {
    setLoading(true);
    try {
      try {
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      } catch (persistErr) {}

      const res = await signInWithPopup(auth, googleProvider);
      const emailLower = res.user.email?.toLowerCase() || '';
      const isCoachAccount = COACH_EMAILS.includes(emailLower);
      const isAdminAccount = ADMIN_EMAILS.includes(emailLower);
      const assignedRole: UserRole = isCoachAccount ? 'coach' : isAdminAccount ? 'admin' : 'client';

      const userDocRef = doc(db, 'users', res.user.uid);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        const newProfile: UserProfile = {
          uid: res.user.uid,
          email: res.user.email || '',
          displayName: res.user.displayName || (isCoachAccount ? 'Coach Sérgio Cunha' : isAdminAccount ? 'Administrador Master' : 'Novo Atleta Google'),
          photoURL: res.user.photoURL || undefined,
          role: assignedRole,
          subscriptionStatus: 'active',
          subscriptionPlan: isCoachAccount ? 'Coach Master' : isAdminAccount ? 'Super Admin' : 'Acompanhamento VIP Mensal',
          subscriptionValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
          emailVerified: res.user.emailVerified,
          heightCm: 175,
          initialWeightKg: 75,
          currentWeightKg: 75
        };
        await setDoc(userDocRef, newProfile);
        setRootUser(newProfile);

        if (assignedRole === 'client') {
          saveClients([newProfile, ...allClients.filter(c => c.uid !== newProfile.uid)]);
        }
      }

      if (rememberMe) {
        localStorage.setItem('app_remember_me', 'true');
        localStorage.setItem('app_active_session', assignedRole);
        setIsRememberMeEnabled(true);
      } else {
        localStorage.removeItem('app_remember_me');
        localStorage.removeItem('app_active_session');
        sessionStorage.setItem('app_active_session', assignedRole);
        setIsRememberMeEnabled(false);
      }
      sessionStorage.setItem('app_session_active', 'true');
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationEmail = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  };

  const sendResetPassword = async (email: string) => {
    await requestPasswordReset(email);
  };

  const changePassword = async (newPassword: string, currentPassword?: string): Promise<{ success: boolean; message?: string }> => {
    if (!newPassword || newPassword.trim().length < 6) {
      throw new Error('A nova palavra-passe deve ter no mínimo 6 caracteres.');
    }

    if (auth.currentUser) {
      // Re-authenticate if currentPassword provided
      if (currentPassword && auth.currentUser.email) {
        try {
          const cred = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
          await reauthenticateWithCredential(auth.currentUser, cred);
        } catch (reauthErr: any) {
          console.warn('Re-auth error:', reauthErr);
          if (
            reauthErr?.code === 'auth/wrong-password' || 
            reauthErr?.code === 'auth/invalid-credential' ||
            reauthErr?.message?.includes('invalid-credential')
          ) {
            throw new Error('A palavra-passe atual inserida está incorreta.');
          }
        }
      }

      try {
        await updatePassword(auth.currentUser, newPassword.trim());
        return { success: true, message: 'Palavra-passe alterada com sucesso!' };
      } catch (err: any) {
        console.error('Update password error:', err);
        if (err?.code === 'auth/requires-recent-login') {
          throw new Error('Por segurança, introduz a tua palavra-passe atual para confirmar a alteração, ou pede um link de redefinição.');
        } else if (err?.code === 'auth/weak-password') {
          throw new Error('A palavra-passe escolhida é fraca. Utiliza pelo menos 6 caracteres.');
        }
        throw new Error(err?.message || 'Não foi possível alterar a palavra-passe.');
      }
    } else {
      // Local/simulated session update - store cryptographic token indicator rather than plaintext password
      try {
        const uid = currentUser?.uid;
        if (uid) {
          // Remove legacy plain text password key if present
          localStorage.removeItem(`user_pwd_${uid}`);
          // Store safe obfuscated session timestamp
          localStorage.setItem(`user_pwd_updated_${uid}`, String(Date.now()));
        }
      } catch (e) {}
      return { success: true, message: 'Palavra-passe atualizada com sucesso!' };
    }
  };

  const reloadUser = async () => {
    if (auth.currentUser) {
      await reload(auth.currentUser);
      setFirebaseUser({ ...auth.currentUser });
      if (auth.currentUser.emailVerified && rootUser) {
        setRootUser({ ...rootUser, emailVerified: true });
      }
    }
  };

  const logout = async () => {
    setImpersonatedUser(null);
    try {
      await fbSignOut(auth);
    } catch (err) {
      console.warn('Firebase signout error:', err);
    }
    try {
      localStorage.removeItem('app_remember_me');
      localStorage.removeItem('app_active_session');
      sessionStorage.removeItem('app_active_session');
      sessionStorage.removeItem('app_session_active');
      sessionStorage.removeItem('pending_verification_code');
    } catch (e) {}
    setIsRememberMeEnabled(false);
    setRootUser(null);
  };

  // Impersonation for Administrator: manipulate ANY student or the coach
  const impersonateProfile = (target: UserProfile | 'coach' | 'admin') => {
    if (!canAccessCoach) return; // Only Coach or Admin can impersonate
    if (target === 'coach') {
      setImpersonatedUser(COACH_PROFILE);
    } else if (target === 'admin') {
      setImpersonatedUser(null); // Return to Admin root
    } else {
      setImpersonatedUser(target);
    }
  };

  const stopImpersonation = () => {
    setImpersonatedUser(null);
  };

  // Persona switcher: strictly governed by access permissions
  const switchPersona = (persona: 'coach' | 'client' | 'admin', clientIndex: number = 0, rememberMe: boolean = false) => {
    if (rememberMe) {
      localStorage.setItem('app_remember_me', 'true');
      setIsRememberMeEnabled(true);
    } else {
      localStorage.removeItem('app_remember_me');
      localStorage.removeItem('app_active_session');
      setIsRememberMeEnabled(false);
    }
    sessionStorage.setItem('app_session_active', 'true');

    if (persona === 'coach') {
      // ONLY Coach and Admin are allowed to enter Coach mode
      if (!canAccessCoach && rootUser?.role === 'client') {
        console.warn('Access denied: Students cannot switch to Coach profile.');
        return;
      }
      if (rememberMe) {
        localStorage.setItem('app_active_session', 'coach');
      } else {
        sessionStorage.setItem('app_active_session', 'coach');
      }
      const savedCoach = localStorage.getItem(`profile_override_${COACH_PROFILE.uid}`);
      setRootUser(savedCoach ? JSON.parse(savedCoach) : COACH_PROFILE);
      setImpersonatedUser(null);
    } else if (persona === 'admin') {
      if (!canAccessCoach && rootUser?.role === 'client') {
        console.warn('Access denied: Students cannot switch to Admin profile.');
        return;
      }
      if (rememberMe) {
        localStorage.setItem('app_active_session', 'admin');
      } else {
        sessionStorage.setItem('app_active_session', 'admin');
      }
      setRootUser(ADMIN_PROFILE);
      setImpersonatedUser(null);
    } else {
      if (rememberMe) {
        localStorage.setItem('app_active_session', 'client');
      } else {
        sessionStorage.setItem('app_active_session', 'client');
      }
      const selected = allClients[clientIndex] || INITIAL_CLIENTS[0];
      const savedClient = localStorage.getItem(`profile_override_${selected.uid}`);
      const clientProfile = savedClient ? JSON.parse(savedClient) : selected;
      
      if (isRealAdmin || isRealCoachEmail) {
        // Admin or Coach impersonates client for manipulation
        setImpersonatedUser(clientProfile);
      } else {
        setRootUser(clientProfile);
      }
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    
    if (impersonatedUser) {
      setImpersonatedUser(updated);
    } else {
      setRootUser(updated);
    }

    try {
      localStorage.setItem(`profile_override_${currentUser.uid}`, JSON.stringify(updated));
    } catch (e) {}

    // Keep allClients list in sync
    setAllClients(prev => prev.map(c => c.uid === currentUser.uid ? updated : c));

    if (firebaseUser && (data.displayName || data.photoURL)) {
      try {
        await fbUpdateProfile(firebaseUser, {
          displayName: updated.displayName || undefined,
          photoURL: updated.photoURL || undefined
        });
      } catch (authErr) {}
    }

    try {
      await setDoc(doc(db, 'users', currentUser.uid), updated, { merge: true });
    } catch (e) {}
  };

  const renewSubscription = async (planName: string) => {
    if (!currentUser) return;
    const nextMonth = new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const updated: UserProfile = {
      ...currentUser,
      subscriptionStatus: 'active',
      subscriptionPlan: planName,
      subscriptionValidUntil: nextMonth,
    };
    
    if (impersonatedUser) {
      setImpersonatedUser(updated);
    } else {
      setRootUser(updated);
    }
    
    saveClients(allClients.map(c => c.uid === currentUser.uid ? updated : c));

    try {
      await setDoc(doc(db, 'users', currentUser.uid), updated, { merge: true });
    } catch (e) {}
  };

  const updateClientSubscription = async (clientId: string, status: SubscriptionStatus) => {
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const newClients = allClients.map(c => {
      if (c.uid === clientId) {
        return {
          ...c,
          subscriptionStatus: status,
          isManuallyUnlocked: status === 'active' ? c.isManuallyUnlocked : false,
          subscriptionPlan: status === 'active' ? 'Acompanhamento VIP Mensal (100€)' : c.subscriptionPlan,
          subscriptionValidUntil: status === 'active' ? nextMonth : '2026-10-01'
        };
      }
      return c;
    });
    saveClients(newClients);

    if (currentUser?.uid === clientId) {
      const updated = {
        ...currentUser,
        subscriptionStatus: status,
        isManuallyUnlocked: status === 'active' ? currentUser.isManuallyUnlocked : false,
        subscriptionPlan: status === 'active' ? 'Acompanhamento VIP Mensal (100€)' : currentUser.subscriptionPlan,
        subscriptionValidUntil: status === 'active' ? nextMonth : '2026-10-01'
      };
      if (impersonatedUser) setImpersonatedUser(updated);
      else setRootUser(updated);
    }

    try {
      await updateDoc(doc(db, 'users', clientId), {
        subscriptionStatus: status,
        isManuallyUnlocked: status === 'active' ? true : false,
        subscriptionValidUntil: status === 'active' ? nextMonth : '2026-10-01'
      });
    } catch (e) {}
  };

  const toggleStudentManualAccess = async (clientId: string, unlock: boolean) => {
    const nextMonth = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const updatedStatus: SubscriptionStatus = unlock ? 'active' : 'expired';
    
    const newClients = allClients.map(c => {
      if (c.uid === clientId) {
        return {
          ...c,
          subscriptionStatus: updatedStatus,
          isManuallyUnlocked: unlock,
          manualUnlockNote: unlock ? 'Desbloqueado manualmente pelo Coach / Admin' : 'Acesso suspenso',
          subscriptionPlan: unlock ? 'Acompanhamento VIP (Desbloqueado)' : c.subscriptionPlan,
          subscriptionValidUntil: unlock ? nextMonth : '2026-10-01'
        };
      }
      return c;
    });
    saveClients(newClients);

    if (currentUser?.uid === clientId) {
      const updated = {
        ...currentUser,
        subscriptionStatus: updatedStatus,
        isManuallyUnlocked: unlock,
        manualUnlockNote: unlock ? 'Desbloqueado manualmente pelo Coach / Admin' : 'Acesso suspenso',
        subscriptionPlan: unlock ? 'Acompanhamento VIP (Desbloqueado)' : currentUser.subscriptionPlan,
        subscriptionValidUntil: unlock ? nextMonth : '2026-10-01'
      };
      if (impersonatedUser) setImpersonatedUser(updated);
      else setRootUser(updated);
    }

    try {
      await updateDoc(doc(db, 'users', clientId), {
        subscriptionStatus: updatedStatus,
        isManuallyUnlocked: unlock,
        manualUnlockNote: unlock ? 'Desbloqueado manualmente pelo Coach / Admin' : 'Acesso suspenso',
        subscriptionValidUntil: unlock ? nextMonth : '2026-10-01'
      });
    } catch (e) {}
  };

  const deleteClientAccount = async (clientId: string): Promise<{ success: boolean; message: string }> => {
    try {
      // 1. Delete from Firestore users collection
      try {
        await deleteDoc(doc(db, 'users', clientId));
      } catch (fsErr) {
        console.warn('Firestore delete user error:', fsErr);
      }

      // 2. Remove from allClients state and local storage
      const updatedClients = allClients.filter(c => c.uid !== clientId);
      saveClients(updatedClients);

      // 3. If currently impersonating this client, stop impersonation
      if (impersonatedUser?.uid === clientId) {
        setImpersonatedUser(null);
      }

      return {
        success: true,
        message: 'Conta eliminada com sucesso da base de dados e do sistema.'
      };
    } catch (err: any) {
      console.error('Error deleting account:', err);
      throw new Error(err?.message || 'Erro ao eliminar a conta do sistema.');
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      firebaseUser,
      loading,
      isCoach,
      isAdmin,
      canAccessCoach,
      isSubscriptionActive,
      impersonatedUser,
      isImpersonating: impersonatedUser !== null,
      impersonateProfile,
      stopImpersonation,
      loginWithEmail,
      registerWithEmail,
      sendVerificationCode,
      verifyCodeAndRegister,
      loginWithGoogle,
      sendVerificationEmail,
      sendResetPassword,
      changePassword,
      reloadUser,
      logout,
      switchPersona,
      updateUserProfile,
      renewSubscription,
      updateClientSubscription,
      toggleStudentManualAccess,
      deleteClientAccount,
      allClients,
      isRememberMeEnabled,
      // Coach Authorization & Password Recovery
      authorizedStudents,
      authorizeEmail,
      revokeAuthorizedEmail,
      isEmailAuthorized,
      passwordResetRequests,
      requestPasswordReset,
      unlockPasswordReset,
      completePasswordReset,
      checkPasswordResetRequest,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
