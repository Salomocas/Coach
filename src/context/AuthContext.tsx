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
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  sendResetPassword: (email: string) => Promise<void>;
  changePassword: (newPassword: string, currentPassword?: string) => Promise<{ success: boolean; message?: string }>;
  reloadUser: () => Promise<void>;
  logout: () => void;
  switchPersona: (persona: 'coach' | 'client' | 'admin', clientIndex?: number) => void;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  renewSubscription: (planName: string) => Promise<void>;
  updateClientSubscription: (clientId: string, status: SubscriptionStatus) => Promise<void>;
  toggleStudentManualAccess: (clientId: string, unlock: boolean) => Promise<void>;
  allClients: UserProfile[];
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
  
  // Real authenticated root profile
  const [rootUser, setRootUser] = useState<UserProfile | null>(() => {
    try {
      const activeSession = localStorage.getItem('app_active_session');
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
              emailVerified: fbUser.emailVerified,
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
        const activeSession = localStorage.getItem('app_active_session');
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

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    const emailLower = email.trim().toLowerCase();
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
    } catch (err) {
      console.warn('Firebase email sign-in fallback check:', err);
      if (COACH_EMAILS.includes(emailLower)) {
        setRootUser(COACH_PROFILE);
        localStorage.setItem('app_active_session', 'coach');
      } else if (ADMIN_EMAILS.includes(emailLower)) {
        setRootUser(ADMIN_PROFILE);
        localStorage.setItem('app_active_session', 'admin');
      } else {
        const found = allClients.find(c => c.email.toLowerCase() === emailLower);
        if (found) {
          setRootUser(found);
          localStorage.setItem('app_active_session', 'client');
        } else {
          throw err;
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    setLoading(true);
    const emailLower = email.trim().toLowerCase();
    try {
      const res = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      
      if (name && res.user) {
        try {
          await fbUpdateProfile(res.user, { displayName: name });
        } catch (e) {}
      }

      try {
        await sendEmailVerification(res.user);
      } catch (e) {}

      const isCoachAccount = COACH_EMAILS.includes(emailLower);
      const isAdminAccount = ADMIN_EMAILS.includes(emailLower);
      const assignedRole: UserRole = isCoachAccount ? 'coach' : isAdminAccount ? 'admin' : 'client';

      const newProfile: UserProfile = {
        uid: res.user.uid,
        email: email.trim(),
        displayName: name || (isCoachAccount ? 'Coach Sérgio Cunha' : isAdminAccount ? 'Administrador Master' : 'Novo Atleta'),
        role: assignedRole,
        subscriptionStatus: 'active',
        subscriptionPlan: isCoachAccount ? 'Coach Master' : isAdminAccount ? 'Super Admin' : 'Acompanhamento VIP Mensal',
        subscriptionValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        coachId: 'coach-sergio-cunha',
        emailVerified: res.user.emailVerified,
        heightCm: 175,
        initialWeightKg: 75,
        currentWeightKg: 75
      };

      try {
        await setDoc(doc(db, 'users', res.user.uid), newProfile);
      } catch (e) {}

      setRootUser(newProfile);

      if (assignedRole === 'client') {
        saveClients([newProfile, ...allClients.filter(c => c.uid !== newProfile.uid)]);
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
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
      // Local/simulated session update
      try {
        if (currentUser?.uid) {
          localStorage.setItem(`user_pwd_${currentUser.uid}`, newPassword.trim());
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
      localStorage.removeItem('app_active_session');
    } catch (e) {}
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
  const switchPersona = (persona: 'coach' | 'client' | 'admin', clientIndex: number = 0) => {
    if (persona === 'coach') {
      // ONLY Coach and Admin are allowed to enter Coach mode
      if (!canAccessCoach && rootUser?.role === 'client') {
        console.warn('Access denied: Students cannot switch to Coach profile.');
        return;
      }
      try {
        localStorage.setItem('app_active_session', 'coach');
      } catch (e) {}
      const savedCoach = localStorage.getItem(`profile_override_${COACH_PROFILE.uid}`);
      setRootUser(savedCoach ? JSON.parse(savedCoach) : COACH_PROFILE);
      setImpersonatedUser(null);
    } else if (persona === 'admin') {
      try {
        localStorage.setItem('app_active_session', 'admin');
      } catch (e) {}
      setRootUser(ADMIN_PROFILE);
      setImpersonatedUser(null);
    } else {
      try {
        localStorage.setItem('app_active_session', 'client');
      } catch (e) {}
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
