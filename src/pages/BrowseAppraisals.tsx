"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabase';
import { showError } from '@/utils/toast';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from "@/components/ui/badge";

interface Appraisal {
  id: string;
  item_name: string;
  item_description: string;
  item_photo_url: string;
  status: 'pending' | 'appraised' | 'listed';
  appraisal_data: {
    estimated_value?: string;
  } | null;
  created_at: string;
}

const BrowseAppraisals: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [appraisals, setAppraisals] = useState<Appraisal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signin'); // Redirect if not authenticated
      return;
    }

    const fetchAppraisals = async () => {
      if (!user) return;

      setLoading(true);
      // Fetch appraisals that are either 'appraised' or 'listed'
      const { data, error } = await supabase
        .from('appraisals')
        .select('*')
        .in('status', ['appraised', 'listed'])
        .order('created_at', { ascending: false });

      if (error) {
        showError(`Error fetching appraisals: ${error.message}`);
        console.error('Error fetching appraisals:', error);
        setAppraisals([]);
      } else {
        setAppraisals(data || []);
      }
      setLoading(false);
    };

    if (user) {
      fetchAppraisals();
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-lg text-gray-700 dark:text-gray-300">Loading available appraisals...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-5xl mt-8">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Browse Appraised Items</CardTitle>
          <CardDescription>
            Discover items that have been appraised and are available for interest.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {appraisals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                No appraised items are currently available.
              </p>
              <Button onClick={() => navigate('/submit-appraisal')}>
                Submit Your Own Item for Appraisal
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {appraisals.map((appraisal) => (
                <Card key={appraisal.id} className="flex flex-col">
                  <CardHeader className="flex-grow">
                    <img
                      src={appraisal.item_photo_url}
                      alt={appraisal.item_name}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <CardTitle className="text-xl font-semibold truncate">{appraisal.item_name}</CardTitle>
                    <CardDescription className="line-clamp-2">{appraisal.item_description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex justify-between items-center mb-4">
                      <Badge
                        variant={
                          appraisal.status === 'pending'
                            ? 'secondary'
                            : appraisal.status === 'appraised'
                            ? 'default'
                            : 'outline'
                        }
                      >
                        {appraisal.status}
                      </Badge>
                      {appraisal.appraisal_data?.estimated_value && (
                        <span className="text-lg font-bold text-primary">
                          {appraisal.appraisal_data.estimated_value}
                        </span>
                      )}
                    </div>
                    <Button className="w-full" onClick={() => navigate(`/appraisal/${appraisal.id}`)}>
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BrowseAppraisals;