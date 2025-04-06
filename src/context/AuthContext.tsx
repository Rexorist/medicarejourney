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
  resetPassword: (email: string) => Promise<void>;
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

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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

  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('medicare_user');
    toast({
      title: 'Signed out',
      description: 'You have successfully signed out',
    });
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Password reset link sent',
        description: 'If an account exists with this email, we have sent password reset instructions.',
      });
    } catch (error) {
      toast({
        title: 'Password reset failed',
        description: 'Failed to send password reset link',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      signIn, 
      signInWithGoogle, 
      signUp, 
      signOut,
      resetPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
