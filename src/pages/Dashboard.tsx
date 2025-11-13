"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

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
          {profile ? (
            <>
              <p className="text-gray-700 dark:text-gray-300">
                You are logged in as a <span className="font-semibold capitalize">{profile.account_type}</span>.
              </p>
              {profile.description && (
                <p className="text-gray-700 dark:text-gray-300">
                  Description: {profile.description}
                </p>
              )}
              {profile.account_type === 'collector' && profile.looking_for && (
                <p className="text-gray-700 dark:text-gray-300">
                  Looking for: {profile.looking_for}
                </p>
              )}
              {profile.account_type === 'consumer' && profile.shipping_address && (
                <p className="text-gray-700 dark:text-gray-300">
                  Shipping Address: {profile.shipping_address}
                </p>
              )}
              <div className="flex flex-col space-y-2 mt-4">
                <Button onClick={() => navigate('/profile-setup')}>
                  Edit Profile
                </Button>
                <Button onClick={() => navigate('/submit-appraisal')} variant="secondary">
                  Submit New Appraisal
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-700 dark:text-gray-300">
                It looks like you haven't set up your profile yet.
              </p>
              <Button onClick={() => navigate('/profile-setup')}>
                Set Up Your Profile
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;