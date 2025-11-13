"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/hooks/use-auth';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Welcome to your Dashboard!</CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
            Hello, {user?.email}!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            This is your personalized dashboard. More features will be added here.
          </p>
          {/* Future content for choosing account type, managing profile, etc. */}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;