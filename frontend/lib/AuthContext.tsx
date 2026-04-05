'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: string;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  setRole: (role: string) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('user');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      // Persist user info for API calls
      if (firebaseUser) {
        localStorage.setItem('jeewan_user', JSON.stringify({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || 'User',
          role: localStorage.getItem('jeewan_role') || 'user',
          photoURL: firebaseUser.photoURL,
        }));
        firebaseUser.getIdToken().then(token => {
          localStorage.setItem('jeewan_token', token);
        });
      } else {
        localStorage.removeItem('jeewan_user');
        localStorage.removeItem('jeewan_token');
      }
    });

    // Restore role from localStorage
    const savedRole = localStorage.getItem('jeewan_role');
    if (savedRole) setRole(savedRole);

    return () => unsubscribe();
  }, []);

  const handleSetRole = (newRole: string) => {
    setRole(newRole);
    localStorage.setItem('jeewan_role', newRole);
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('jeewan_user');
    localStorage.removeItem('jeewan_token');
    localStorage.removeItem('jeewan_role');
    setRole('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, role, loginWithGoogle, loginWithEmail, registerWithEmail, logout, setRole: handleSetRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
