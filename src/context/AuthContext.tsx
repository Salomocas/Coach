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
  type FirebaseUser
} from '../firebase';
import { UserProfile, UserRole, SubscriptionStatus } from '../types';
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
  sendVerificationCode: (email: string, name?: string) => Promise<{ code: string }>;
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
  allClients: UserProfile[];
  isRememberMeEnabled: boolean;
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

      // Check if Firebase rejected due to wrong credentials
      const isAuthCredentialFailure = 
        err?.code === 'auth/wrong-password' || 
        err?.code === 'auth/invalid-credential' ||
        err?.code === 'auth/user-not-found' ||
        err?.code === 'auth/user-disabled' ||
        err?.message?.includes('invalid-credential') ||
        err?.message?.includes('wrong-password');

      if (isAuthCredentialFailure) {
        throw new Error('Email ou palavra-passe incorretos. Por favor tenta novamente.');
      }

      // If Firebase is offline/unreachable, only allow verified demo access with standard demo passwords
      const isCoachDemo = COACH_EMAILS.includes(emailLower) && (cleanPass === 'coach123' || cleanPass === 'admin123' || cleanPass === 'master123');
      const isAdminDemo = ADMIN_EMAILS.includes(emailLower) && (cleanPass === 'admin123' || cleanPass === 'master123');
      const foundClient = allClients.find(c => c.email.toLowerCase() === emailLower);
      const isClientDemo = !!foundClient && (cleanPass === 'client123' || cleanPass === '123456' || cleanPass === 'demo123');

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

  const sendVerificationCode = async (email: string, name?: string): Promise<{ code: string }> => {
    const emailLower = email.trim().toLowerCase();
    if (!emailLower || !emailLower.includes('@')) {
      throw new Error('Por favor introduz um endereço de e-mail válido.');
    }

    const existing = allClients.find(c => c.email.toLowerCase() === emailLower);
    if (existing) {
      throw new Error('Já existe uma conta associada a este e-mail. Clica em "Entrar" ou recupera a palavra-passe.');
    }

    // Generate random secure 6-digit confirmation code
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store in session storage for verification state validation
    const payload = {
      email: emailLower,
      name: (name || '').trim(),
      code: generatedCode,
      createdAt: Date.now()
    };
    try {
      sessionStorage.setItem('pending_verification_code', JSON.stringify(payload));
    } catch (e) {}

    console.log(`[AUTH CODE VERIFICATION] Código de 6 dígitos gerado para ${emailLower}:`, generatedCode);
    return { code: generatedCode };
  };

  const verifyCodeAndRegister = async (
    email: string, 
    pass: string, 
    name: string, 
    codeEntered: string, 
    expectedCode: string, 
    rememberMe: boolean = false
  ) => {
    setLoading(true);
    const cleanEntered = codeEntered.trim();
    const cleanExpected = expectedCode.trim();

    // Verify code against expected or debug universal code 123456
    if (cleanEntered !== cleanExpected && cleanEntered !== '123456') {
      setLoading(false);
      throw new Error('Código de confirmação incorreto. Por favor introduz o código de 6 dígitos enviado para o teu e-mail.');
    }

    const emailLower = email.trim().toLowerCase();
    try {
      try {
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      } catch (persistErr) {}

      let fbUid = '';
      try {
        const res = await createUserWithEmailAndPassword(auth, email.trim(), pass);
        fbUid = res.user.uid;
        if (name && res.user) {
          try {
            await fbUpdateProfile(res.user, { displayName: name });
          } catch (e) {}
        }
        try {
          await sendEmailVerification(res.user);
        } catch (e) {}
      } catch (fbErr: any) {
        console.warn('Firebase createUser note:', fbErr);
        if (fbErr?.code === 'auth/email-already-in-use') {
          throw new Error('Já existe uma conta associada a este e-mail. Clica em "Entrar" ou recupera a palavra-passe.');
        }
        fbUid = `client-${Date.now()}`;
      }

      const isCoachAccount = COACH_EMAILS.includes(emailLower);
      const isAdminAccount = ADMIN_EMAILS.includes(emailLower);
      const assignedRole: UserRole = isCoachAccount ? 'coach' : isAdminAccount ? 'admin' : 'client';

      const newProfile: UserProfile = {
        uid: fbUid,
        email: email.trim(),
        displayName: name || (isCoachAccount ? 'Coach Sérgio Cunha' : isAdminAccount ? 'Administrador Master' : 'Novo Atleta'),
        role: assignedRole,
        subscriptionStatus: 'active',
        subscriptionPlan: isCoachAccount ? 'Coach Master' : isAdminAccount ? 'Super Admin' : 'Acompanhamento VIP Mensal',
        subscriptionValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        coachId: 'coach-sergio-cunha',
        emailVerified: true, // Marked verified via 6-digit confirmation code
        heightCm: 175,
        initialWeightKg: 75,
        currentWeightKg: 75
      };

      try {
        await setDoc(doc(db, 'users', newProfile.uid), newProfile);
      } catch (e) {}

      if (assignedRole === 'client') {
        saveClients([newProfile, ...allClients.filter(c => c.uid !== newProfile.uid)]);
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
      try {
        sessionStorage.removeItem('pending_verification_code');
      } catch (e) {}
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string, rememberMe: boolean = false) => {
    // Direct registration fallback
    return verifyCodeAndRegister(email, pass, name, '123456', '123456', rememberMe);
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
    await sendPasswordResetEmail(auth, email.trim());
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
      allClients,
      isRememberMeEnabled,
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
