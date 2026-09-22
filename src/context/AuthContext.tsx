import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as fbSignOut, 
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'user' | 'admin';
  createdAt?: any;
  lastLoginAt?: any;
  isAnonymous?: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const snap = await getDoc(userDocRef);
          
          if (!snap.exists()) {
            const newProfile: UserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || (currentUser.isAnonymous ? 'guest@safephish.local' : 'user@domain.local'),
              displayName: currentUser.displayName || (currentUser.isAnonymous ? 'Guest Security Analyst' : 'Security Analyst'),
              photoURL: currentUser.photoURL || null,
              role: 'user',
              createdAt: serverTimestamp(),
              lastLoginAt: serverTimestamp(),
              isAnonymous: currentUser.isAnonymous,
            };
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);
          } else {
            const data = snap.data() as UserProfile;
            setProfile(data);
            // Update last login
            await setDoc(userDocRef, { lastLoginAt: serverTimestamp() }, { merge: true }).catch(() => {});
          }
        } catch (err: any) {
          console.warn('Could not sync user profile to Firestore:', err);
          // Fallback in-memory profile
          setProfile({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName || (currentUser.isAnonymous ? 'Guest User' : 'User'),
            photoURL: currentUser.photoURL,
            role: 'user',
            isAnonymous: currentUser.isAnonymous,
          });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign-in failed:', err);
      if (err.code === 'auth/popup-blocked') {
        setAuthError('Sign-in popup was blocked by your browser. Please allow popups or use email/password.');
      } else if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in was cancelled.');
      } else {
        setAuthError(err.message || 'Failed to authenticate with Google.');
      }
      throw err;
    }
  };

  const signInWithEmail = async (emailVal: string, passVal: string) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, emailVal, passVal);
    } catch (err: any) {
      console.error('Email sign-in failed:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setAuthError('Invalid email or password.');
      } else if (err.code === 'auth/invalid-email') {
        setAuthError('Please enter a valid email address.');
      } else {
        setAuthError(err.message || 'Sign in failed.');
      }
      throw err;
    }
  };

  const signUpWithEmail = async (emailVal: string, passVal: string, name?: string) => {
    setAuthError(null);
    try {
      const res = await createUserWithEmailAndPassword(auth, emailVal, passVal);
      if (name && res.user) {
        await updateProfile(res.user, { displayName: name });
      }
    } catch (err: any) {
      console.error('Email sign-up failed:', err);
      if (err.code === 'auth/email-already-in-use') {
        setAuthError('An account with this email already exists. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        setAuthError('Password should be at least 6 characters.');
      } else {
        setAuthError(err.message || 'Registration failed.');
      }
      throw err;
    }
  };

  const signInAsGuest = async () => {
    setAuthError(null);
    try {
      await signInAnonymously(auth);
    } catch (err: any) {
      console.error('Guest Sign-in failed:', err);
      setAuthError('Guest authentication encountered an error. Please try again.');
      throw err;
    }
  };

  const signOut = async () => {
    setAuthError(null);
    try {
      await fbSignOut(auth);
    } catch (err: any) {
      console.error('Sign-out failed:', err);
      setAuthError(err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signInAsGuest,
        signOut,
        authError,
        clearAuthError: () => setAuthError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
