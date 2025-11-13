"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/lib/supabase';
import { showSuccess, showError } from '@/utils/toast';
import { useAuth } from '@/hooks/use-auth';

type AccountType = 'collector' | 'consumer' | '';

const ProfileSetup: React.FC = () => {
  const { user, loading: authLoading, profile } = useAuth();
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<AccountType>(profile?.account_type || '');
  const [description, setDescription] = useState(profile?.description || '');
  const [lookingFor, setLookingFor] = useState(profile?.looking_for || '');
  const [homeAddress, setHomeAddress] = useState(profile?.home_address || '');
  const [shippingAddress, setShippingAddress] = useState(profile?.shipping_address || '');
  const [contactLinks, setContactLinks] = useState<string>(JSON.stringify(profile?.contact_links || [{ type: 'email', value: user?.email || '' }]));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signin'); // Redirect if not authenticated
    }
    if (!authLoading && user && profile && profile.account_type) {
      // If profile already exists and has an account type, redirect to dashboard
      // This prevents users from re-setting up their profile unless they explicitly navigate here to edit
      // For initial setup, we allow them to proceed.
      // If they are editing, the fields will be pre-filled.
      setAccountType(profile.account_type);
      setDescription(profile.description || '');
      setLookingFor(profile.looking_for || '');
      setHomeAddress(profile.home_address || '');
      setShippingAddress(profile.shipping_address || '');
      setContactLinks(JSON.stringify(profile.contact_links || [{ type: 'email', value: user?.email || '' }]));
    }
  }, [user, authLoading, profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showError('You must be logged in to set up your profile.');
      return;
    }
    if (!accountType) {
      showError('Please select an account type.');
      return;
    }

    setLoading(true);
    try {
      const parsedContactLinks = JSON.parse(contactLinks); // Assuming contactLinks is a JSON string

      const profileData = {
        id: user.id,
        account_type: accountType,
        description,
        contact_links: parsedContactLinks,
        ...(accountType === 'collector' && { looking_for: lookingFor }),
        ...(accountType === 'consumer' && { home_address: homeAddress, shipping_address: shippingAddress }),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' }); // Use upsert to insert or update

      if (error) {
        throw error;
      }

      showSuccess('Profile saved successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      showError(`Error saving profile: ${error.message}`);
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-lg text-gray-700 dark:text-gray-300">Loading profile setup...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Set Up Your Profile</CardTitle>
          <CardDescription>
            Choose your account type and provide details to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="accountType">Account Type</Label>
              <Select value={accountType} onValueChange={(value: AccountType) => setAccountType(value)}>
                <SelectTrigger id="accountType">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="collector">Collector</SelectItem>
                  <SelectItem value="consumer">Consumer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell us about yourself or your interests..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {accountType === 'collector' && (
              <div className="grid gap-2">
                <Label htmlFor="lookingFor">What are you looking for?</Label>
                <Textarea
                  id="lookingFor"
                  placeholder="e.g., Rare coins, impressionist paintings, specific gemstones..."
                  value={lookingFor}
                  onChange={(e) => setLookingFor(e.target.value)}
                />
              </div>
            )}

            {accountType === 'consumer' && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="homeAddress">Home Address</Label>
                  <Input
                    id="homeAddress"
                    type="text"
                    placeholder="Your home address"
                    value={homeAddress}
                    onChange={(e) => setHomeAddress(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="shippingAddress">Shipping Address</Label>
                  <Input
                    id="shippingAddress"
                    type="text"
                    placeholder="Your preferred shipping address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="grid gap-2">
              <Label htmlFor="contactLinks">Contact Links (JSON format)</Label>
              <Textarea
                id="contactLinks"
                placeholder='e.g., [{"type": "email", "value": "your@email.com"}, {"type": "app", "value": "your_app_handle"}]'
                value={contactLinks}
                onChange={(e) => setContactLinks(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Provide contact links in JSON array format.
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Saving Profile...' : 'Save Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;