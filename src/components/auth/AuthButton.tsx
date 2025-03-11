import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AuthButton = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <button
      onClick={() => navigate(user ? '/profile' : '/signin')}
      className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors"
    >
      <LogIn className="w-4 h-4" />
      <span>{user ? 'Profile' : 'Sign In'}</span>
    </button>
  );
};

export default AuthButton;