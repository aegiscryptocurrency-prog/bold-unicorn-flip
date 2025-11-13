"use client";

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabase';
import { showSuccess, showError } from '@/utils/toast';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      showError(error.message);
    } else {
      showSuccess('Signed in successfully!');
      navigate('/'); // Redirect to home or dashboard after sign-in
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
        <CardDescription>
          Enter your email below to sign in to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignIn} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignIn;