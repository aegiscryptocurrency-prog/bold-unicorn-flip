"use client";

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-lg text-gray-700 dark:text-gray-300">Checking authentication...</p>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;