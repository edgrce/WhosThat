import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import type { User } from 'firebase/auth';

interface AuthContextType {
  currentUser: User | null;
  user: User | null; 
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  user: null,
  loading: true
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, user: currentUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);