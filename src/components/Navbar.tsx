"use client";

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabase';
import { showError, showSuccess } from '@/utils/toast';
import { useAuth } from '@/hooks/use-auth';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showError(error.message);
    } else {
      showSuccess('Signed out successfully!');
      navigate('/signin');
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
        Appraisal App
      </Link>
      <div className="space-x-4">
        {user ? (
          <>
            <Link to="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Dashboard
            </Link>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Link to="/signin" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Sign In
            </Link>
            <Link to="/signup" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;