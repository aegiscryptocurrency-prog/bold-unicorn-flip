"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabase';
import { showError, showSuccess } from '@/utils/toast';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from "@/components/ui/badge";

interface Appraisal {
  id: string;
  user_id: string;
  item_name: string;
  item_description: string;
  item_photo_url: string;
  status: 'pending' | 'appraised' | 'listed';
  appraisal_data: {
    history?: string;
    quality?: string;
    estimated_value?: string;
    notes?: string;
  } | null;
  created_at: string;
}

const AppraisalDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const [appraisal, setAppraisal] = useState<Appraisal | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasExpressedInterest, setHasExpressedInterest] = useState(false);
  const [interestLoading, setInterestLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signin'); // Redirect if not authenticated
      return;
    }

    const fetchAppraisalDetailsAndInterest = async () => {
      if (!user || !id) return;

      setLoading(true);
      const { data, error } = await supabase
        .from('appraisals')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        showError(`Error fetching appraisal details: ${error.message}`);
        console.error('Error fetching appraisal details:', error);
        setAppraisal(null);
      } else {
        setAppraisal(data);
        // Check if the current user has already expressed interest
        if (profile?.account_type === 'consumer') {
          const { data: interestData, error: interestError } = await supabase
            .from('interests')
            .select('id')
            .eq('user_id', user.id)
            .eq('appraisal_id', id)
            .single();
          
          if (interestData) {
            setHasExpressedInterest(true);
          } else if (interestError && interestError.code !== 'PGRST116') { // PGRST116 means "no rows found"
            console.error('Error checking interest:', interestError);
          }
        }
      }
      setLoading(false);
    };

    if (user && id) {
      fetchAppraisalDetailsAndInterest();
    }
  }, [user, profile, authLoading, id, navigate]);

  const handleExpressInterest = async () => {
    if (!user || !appraisal) return;
    setInterestLoading(true);
    try {
      const { error } = await supabase.from('interests').insert({
        user_id: user.id,
        appraisal_id: appraisal.id,
      });

      if (error) {
        throw error;
      }
      showSuccess('Interest expressed successfully!');
      setHasExpressedInterest(true);
    } catch (error: any) {
      showError(`Error expressing interest: ${error.message}`);
      console.error('Error expressing interest:', error);
    } finally {
      setInterestLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-lg text-gray-700 dark:text-gray-300">Loading appraisal details...</p>
      </div>
    );
  }

  if (!appraisal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Appraisal Not Found</CardTitle>
            <CardDescription>
              The appraisal you are looking for does not exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/browse-appraisals')}>
              Back to Browse Appraisals
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOwner = user?.id === appraisal.user_id;
  const canExpressInterest = profile?.account_type === 'consumer' && !isOwner && (appraisal.status === 'appraised' || appraisal.status === 'listed');

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-3xl mt-8">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">{appraisal.item_name}</CardTitle>
          <CardDescription>
            Details for this appraisal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <img
              src={appraisal.item_photo_url}
              alt={appraisal.item_name}
              className="max-w-full h-auto rounded-md shadow-md"
              style={{ maxWidth: '300px', maxHeight: '300px', objectFit: 'contain' }}
            />
          </div>

          <div className="grid gap-2 text-gray-700 dark:text-gray-300">
            <p><strong>Status:</strong> <Badge
              variant={
                appraisal.status === 'pending'
                  ? 'secondary'
                  : appraisal.status === 'appraised'
                  ? 'default'
                  : 'outline'
              }
            >
              {appraisal.status}
            </Badge></p>
            <p><strong>Submitted On:</strong> {new Date(appraisal.created_at).toLocaleDateString()}</p>
            <p><strong>Description:</strong> {appraisal.item_description}</p>
          </div>

          {appraisal.status === 'appraised' || appraisal.status === 'listed' ? (
            <div className="space-y-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Appraisal Results</h3>
              {appraisal.appraisal_data ? (
                <div className="grid gap-2 text-gray-700 dark:text-gray-300">
                  {appraisal.appraisal_data.history && <p><strong>History:</strong> {appraisal.appraisal_data.history}</p>}
                  {appraisal.appraisal_data.quality && <p><strong>Quality:</strong> {appraisal.appraisal_data.quality}</p>}
                  {appraisal.appraisal_data.estimated_value && <p><strong>Estimated Value:</strong> {appraisal.appraisal_data.estimated_value}</p>}
                  {appraisal.appraisal_data.notes && <p><strong>Notes:</strong> {appraisal.appraisal_data.notes}</p>}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  Appraisal data is not yet available.
                </p>
              )}
              {isOwner && appraisal.status === 'appraised' && (
                <Button className="w-full">
                  List Item for Sale (Future Feature)
                </Button>
              )}
              {canExpressInterest && (
                <Button 
                  onClick={handleExpressInterest} 
                  className="w-full" 
                  disabled={hasExpressedInterest || interestLoading}
                >
                  {interestLoading ? 'Expressing Interest...' : hasExpressedInterest ? 'Interest Expressed' : 'Express Interest'}
                </Button>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400">
              This appraisal is currently pending review.
            </p>
          )}

          <Button variant="outline" onClick={() => navigate('/browse-appraisals')} className="w-full">
            Back to Browse Appraisals
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppraisalDetails;