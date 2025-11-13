"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/lib/supabase';
import { showSuccess, showError } from '@/utils/toast';
import { useAuth } from '@/hooks/use-auth';

const AppraisalSubmission: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPhoto, setItemPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setItemPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showError('You must be logged in to submit an appraisal.');
      return;
    }
    if (!itemName || !itemDescription || !itemPhoto) {
      showError('Please fill in all fields and upload a photo.');
      return;
    }

    setLoading(true);
    try {
      // In a real application, you would upload the image to Supabase Storage
      // and get a public URL. For now, we'll use a placeholder.
      const mockPhotoUrl = 'https://via.placeholder.com/150?text=Item+Image';

      const { error } = await supabase
        .from('appraisals')
        .insert({
          user_id: user.id,
          item_name: itemName,
          item_description: itemDescription,
          item_photo_url: mockPhotoUrl,
          status: 'pending',
        });

      if (error) {
        throw error;
      }

      showSuccess('Appraisal submitted successfully! We will review it shortly.');
      navigate('/dashboard'); // Redirect to dashboard or a "my appraisals" page
    } catch (error: any) {
      showError(`Error submitting appraisal: ${error.message}`);
      console.error('Error submitting appraisal:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Submit Item for Appraisal</CardTitle>
          <CardDescription>
            Provide details and a photo of your item for appraisal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="itemName">Item Name</Label>
              <Input
                id="itemName"
                type="text"
                placeholder="e.g., Vintage Rolex Watch"
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="itemDescription">Item Description</Label>
              <Textarea
                id="itemDescription"
                placeholder="Describe your item, its condition, any known history, etc."
                required
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="itemPhoto">Item Photo</Label>
              <Input
                id="itemPhoto"
                type="file"
                accept="image/*"
                required
                onChange={handleFileChange}
              />
              <p className="text-sm text-muted-foreground">
                Upload a clear photo of your item.
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Appraisal'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppraisalSubmission;