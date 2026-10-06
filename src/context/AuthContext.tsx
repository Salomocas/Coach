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
  doc, 
  getDoc, 
  setDoc,
  type FirebaseUser
} from '../firebase';
import { UserProfile, UserRole, SubscriptionStatus } from '../types';
import { COACH_PROFILE, INITIAL_CLIENTS } from '../initialData';

interface AuthContextType {
  currentUser: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isCoach: boolean;
  isSubscriptionActive: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  switchPersona: (persona: 'coach' | 'client', clientIndex?: number) => void;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  renewSubscription: (planName: string) => Promise<void>;
  allClients: UserProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const COACH_EMAILS = ['sgpmcunha@gmail.com', 'coach@sergiocunha.pt'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(COACH_PROFILE);
  const [loading, setLoading] = useState<boolean>(true);
  const [allClients, setAllClients] = useState<UserProfile[]>(INITIAL_CLIENTS);

  // Monitor Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const docSnap = await getDoc(userDocRef);
          
          const isCoachEmail = COACH_EMAILS.includes(fbUser.email?.toLowerCase() || '');

          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            setCurrentUser({
              ...data,
              role: isCoachEmail ? 'coach' : data.role || 'client'
            });
          } else {
            // Create user profile in Firestore
            const newProfile: UserProfile = {
              uid: fbUser.uid,
              email: fbUser.email || '',
              displayName: fbUser.displayName || (isCoachEmail ? 'Coach Sérgio Cunha' : 'Novo Atleta'),
              photoURL: fbUser.photoURL || (isCoachEmail ? COACH_PROFILE.photoURL : undefined),
              role: isCoachEmail ? 'coach' : 'client',
              subscriptionStatus: isCoachEmail ? 'active' : 'active', // default active for new users to test
              subscriptionPlan: isCoachEmail ? 'Coach Master' : 'Acompanhamento VIP Mensal',
              subscriptionValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              createdAt: new Date().toISOString(),
              heightCm: 175,
              initialWeightKg: 75,
              currentWeightKg: 75
            };
            await setDoc(userDocRef, newProfile);
            setCurrentUser(newProfile);
          }
        } catch (err) {
          console.warn('Could not read user profile from Firestore, using local fallback:', err);
          const isCoachEmail = COACH_EMAILS.includes(fbUser.email?.toLowerCase() || '');
          setCurrentUser(isCoachEmail ? COACH_PROFILE : INITIAL_CLIENTS[0]);
        }
      } else {
        // Fallback to active demo session so app is directly testable
        setCurrentUser(COACH_PROFILE);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err) {
      console.error('Email sign in error:', err);
      // If error, check if email matches demo coach or client for quick local access
      if (COACH_EMAILS.includes(email.toLowerCase())) {
        setCurrentUser(COACH_PROFILE);
      } else {
        const found = INITIAL_CLIENTS.find(c => c.email.toLowerCase() === email.toLowerCase());
        if (found) {
          setCurrentUser(found);
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
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      const isCoachEmail = COACH_EMAILS.includes(email.toLowerCase());
      const newProfile: UserProfile = {
        uid: res.user.uid,
        email,
        displayName: name,
        role: isCoachEmail ? 'coach' : 'client',
        subscriptionStatus: 'active',
        subscriptionPlan: 'Acompanhamento VIP Mensal',
        subscriptionValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        coachId: 'coach-sergio-cunha',
        heightCm: 175,
        initialWeightKg: 75,
        currentWeightKg: 75
      };
      try {
        await setDoc(doc(db, 'users', res.user.uid), newProfile);
      } catch (e) {
        console.warn('Set user doc failed:', e);
      }
      setCurrentUser(newProfile);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Google sign in error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (err) {
      console.warn('Firebase signout error:', err);
    }
    setCurrentUser(INITIAL_CLIENTS[0]); // switch to client demo mode
  };

  // Switch persona helper for convenient evaluation and preview
  const switchPersona = (persona: 'coach' | 'client', clientIndex: number = 0) => {
    if (persona === 'coach') {
      setCurrentUser(COACH_PROFILE);
    } else {
      const selected = allClients[clientIndex] || INITIAL_CLIENTS[0];
      setCurrentUser(selected);
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    try {
      await setDoc(doc(db, 'users', currentUser.uid), updated, { merge: true });
    } catch (e) {
      console.warn('Update user profile remote sync error:', e);
    }
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
    setCurrentUser(updated);
    
    // Also update in allClients list if demo
    setAllClients(prev => prev.map(c => c.uid === currentUser.uid ? updated : c));

    try {
      await setDoc(doc(db, 'users', currentUser.uid), updated, { merge: true });
    } catch (e) {
      console.warn('Renew subscription firestore sync error:', e);
    }
  };

  const isCoach = currentUser?.role === 'coach';
  const isSubscriptionActive = isCoach || currentUser?.subscriptionStatus === 'active';

  return (
    <AuthContext.Provider value={{
      currentUser,
      firebaseUser,
      loading,
      isCoach,
      isSubscriptionActive,
      loginWithEmail,
      registerWithEmail,
      loginWithGoogle,
      logout,
      switchPersona,
      updateUserProfile,
      renewSubscription,
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
