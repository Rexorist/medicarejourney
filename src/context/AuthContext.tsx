
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('medicare_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('medicare_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Mock sign-in function
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, you would call an API here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Demo user - in a real app this would come from your backend
      if (email === 'demo@example.com' && password === 'password') {
        const mockUser = {
          id: '123456',
          name: 'John Doe',
          email: 'demo@example.com',
          avatar: '',
        };
        setUser(mockUser);
        localStorage.setItem('medicare_user', JSON.stringify(mockUser));
        toast({
          title: 'Success',
          description: 'You have successfully signed in!',
        });
        return;
      }
      
      throw new Error('Invalid email or password');
    } catch (error) {
      toast({
        title: 'Authentication failed',
        description: error instanceof Error ? error.message : 'Failed to sign in',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock sign-in with Google
  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would call Google OAuth API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const mockUser = {
        id: '789012',
        name: 'Google User',
        email: 'google.user@gmail.com',
        avatar: 'https://lh3.googleusercontent.com/a/default-user',
      };
      
      setUser(mockUser);
      localStorage.setItem('medicare_user', JSON.stringify(mockUser));
      
      toast({
        title: 'Success',
        description: 'You have successfully signed in with Google!',
      });
    } catch (error) {
      toast({
        title: 'Google Authentication failed',
        description: 'Failed to sign in with Google',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock sign-up function
  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, you would call an API here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const mockUser = {
        id: Math.random().toString(36).substring(2, 11),
        name,
        email,
        avatar: '',
      };
      
      setUser(mockUser);
      localStorage.setItem('medicare_user', JSON.stringify(mockUser));
      
      toast({
        title: 'Account created',
        description: 'Your account has been successfully created!',
      });
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: 'Failed to create your account',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = () => {
    setUser(null);
    localStorage.removeItem('medicare_user');
    toast({
      title: 'Signed out',
      description: 'You have successfully signed out',
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signInWithGoogle, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
