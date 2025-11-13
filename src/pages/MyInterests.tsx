"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabase';
import { showError } from '@/utils/toast';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from "@/components/ui/badge";

// Define the structure of a single item as it comes directly from the Supabase query
interface RawSupabaseInterest {
  id: string;
  created_at: string;
  appraisal: {
    id: string;
    item_name: string;
    item_description: string;
    item_photo_url: string;
    status: 'pending' | 'appraised' | 'listed';
    appraisal_data: {
      estimated_value?: string;
    } | null;
  } | null; // 'appraisal' can be null if the joined record doesn't exist
}

// The interface for the state, where 'appraisal' is guaranteed to be non-null after filtering
interface Interest {
  id: string;
  created_at: string;
  appraisal: {
    id: string;
    item_name: string;
    item_description: string;
    item_photo_url: string;
    status: 'pending' | 'appraised' | 'listed';
    appraisal_data: {
      estimated_value?: string;
    } | null;
  };
}

const MyInterests: React.FC = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || profile?.account_type !== 'consumer')) {
      navigate('/dashboard'); // Redirect if not authenticated or not a consumer
      return;
    }

    const fetchMyInterests = async () => {
      if (!user) return;

      setLoading(true);
      const { data, error } = await supabase
        .from('interests')
        .select(`
          id,
          created_at,
          appraisal:appraisal_id (
            id,
            item_name,
            item_description,
            item_photo_url,
            status,
            appraisal_data
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        showError(`Error fetching your interests: ${error.message}`);
        console.error('Error fetching interests:', error);
        setInterests([]);
      } else {
        // The previous error indicated that 'data' might have 'appraisal' as an array.
        // Let's explicitly map the raw data to ensure 'appraisal' is a single object or null.
        const rawInterests: RawSupabaseInterest[] = (data || []).map((item: any) => {
          // If item.appraisal is an array, take the first element. Otherwise, use it directly.
          const appraisalData = Array.isArray(item.appraisal) && item.appraisal.length > 0
            ? item.appraisal[0]
            : item.appraisal;

          return {
            id: item.id,
            created_at: item.created_at,
            appraisal: appraisalData ? {
              id: appraisalData.id,
              item_name: appraisalData.item_name,
              item_description: appraisalData.item_description,
              item_photo_url: appraisalData.item_photo_url,
              status: appraisalData.status,
              appraisal_data: appraisalData.appraisal_data,
            } : null,
          };
        });

        // Filter out any interests where appraisal data might be null (e.g., if appraisal was deleted)
        // and then map to the final Interest type, asserting that appraisal is not null.
        const filteredAndTypedInterests: Interest[] = rawInterests
          .filter((interest): interest is Omit<RawSupabaseInterest, 'appraisal'> & { appraisal: NonNullable<RawSupabaseInterest['appraisal']> } => interest.appraisal !== null)
          .map(interest => ({
            id: interest.id,
            created_at: interest.created_at,
            appraisal: interest.appraisal, // TypeScript now knows appraisal is not null here
          }));
        setInterests(filteredAndTypedInterests);
      }
      setLoading(false);
    };

    if (user && profile?.account_type === 'consumer') {
      fetchMyInterests();
    }
  }, [user, profile, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-lg text-gray-700 dark:text-gray-300">Loading your interests...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-5xl mt-8">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">My Expressed Interests</CardTitle>
          <CardDescription>
            Items you've shown interest in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {interests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You haven't expressed interest in any items yet.
              </p>
              <Button onClick={() => navigate('/browse-appraisals')}>
                Browse Appraised Items
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {interests.map((interest) => (
                <Card key={interest.id} className="flex flex-col">
                  <CardHeader className="flex-grow">
                    <img
                      src={interest.appraisal.item_photo_url}
                      alt={interest.appraisal.item_name}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <CardTitle className="text-xl font-semibold truncate">{interest.appraisal.item_name}</CardTitle>
                    <CardDescription className="line-clamp-2">{interest.appraisal.item_description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex justify-between items-center mb-4">
                      <Badge
                        variant={
                          interest.appraisal.status === 'pending'
                            ? 'secondary'
                            : interest.appraisal.status === 'appraised'
                            ? 'default'
                            : 'outline'
                        }
                      >
                        {interest.appraisal.status}
                      </Badge>
                      {interest.appraisal.appraisal_data?.estimated_value && (
                        <span className="text-lg font-bold text-primary">
                          {interest.appraisal.appraisal_data.estimated_value}
                        </span>
                      )}
                    </div>
                    <Button className="w-full" onClick={() => navigate(`/appraisal/${interest.appraisal.id}`)}>
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

export default MyInterests;