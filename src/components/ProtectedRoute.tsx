"use client";

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

interface ProtectedRouteProps {
  requiredAccountType?: 'collector' | 'consumer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredAccountType }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-lg text-gray-700 dark:text-gray-300">Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (requiredAccountType && (!profile || profile.account_type !== requiredAccountType)) {
    // If a specific account type is required and the user doesn't match, redirect to dashboard
    // or a more appropriate "access denied" page. For now, dashboard.
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;