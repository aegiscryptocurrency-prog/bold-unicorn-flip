"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabase';
import { showError } from '@/utils/toast';
import { useAuth } from '@/hooks/use-auth';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Define the structure of a single item as it comes directly from the Supabase query
interface RawSupabaseCollectorInterest {
  id: string;
  created_at: string;
  user_id: string;
  appraisal: {
    id: string;
    item_name: string;
    item_description: string;
    item_photo_url: string;
    status: 'pending' | 'appraised' | 'listed';
    appraisal_data: {
      estimated_value?: string;
    } | null;
  } | null | Array<any>; // Allow appraisal to be null, a single object, or an array
  interested_consumer_profile: {
    id: string;
    account_type: 'collector' | 'consumer';
    description?: string;
    contact_links?: Array<{ type: string; value: string }>;
  } | null | Array<any>; // Allow profile to be null, a single object, or an array
}

interface InterestDetail {
  id: string;
  created_at: string;
  user_id: string; // The consumer who expressed interest
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
  interested_consumer_profile: {
    id: string;
    account_type: 'collector' | 'consumer';
    description?: string;
    contact_links?: Array<{ type: string; value: string }>;
  };
}

const CollectorInterests: React.FC = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [interests, setInterests] = useState<InterestDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || profile?.account_type !== 'collector')) {
      navigate('/dashboard'); // Redirect if not authenticated or not a collector
      return;
    }

    const fetchCollectorInterests = async () => {
      if (!user) return;

      setLoading(true);
      // Fetch appraisals owned by the current collector
      const { data: appraisalsData, error: appraisalsError } = await supabase
        .from('appraisals')
        .select('id')
        .eq('user_id', user.id);

      if (appraisalsError) {
        showError(`Error fetching your appraisals: ${appraisalsError.message}`);
        console.error('Error fetching collector appraisals:', appraisalsError);
        setInterests([]);
        setLoading(false);
        return;
      }

      const appraisalIds = appraisalsData?.map(app => app.id) || [];

      if (appraisalIds.length === 0) {
        setInterests([]);
        setLoading(false);
        return;
      }

      // Fetch interests for these appraisal IDs
      const { data: interestsData, error: interestsError } = await supabase
        .from('interests')
        .select(`
          id,
          created_at,
          user_id,
          appraisal:appraisal_id (
            id,
            item_name,
            item_description,
            item_photo_url,
            status,
            appraisal_data
          ),
          interested_consumer_profile:user_id (
            id,
            account_type,
            description,
            contact_links
          )
        `)
        .in('appraisal_id', appraisalIds)
        .order('created_at', { ascending: false });

      if (interestsError) {
        showError(`Error fetching interests in your items: ${interestsError.message}`);
        console.error('Error fetching collector interests:', interestsError);
        setInterests([]);
      } else {
        const rawInterests: RawSupabaseCollectorInterest[] = (interestsData || []) as RawSupabaseCollectorInterest[];

        // Filter out any interests where appraisal or profile data might be null or an empty array
        const filteredInterests: InterestDetail[] = rawInterests
          .filter((item): item is Omit<RawSupabaseCollectorInterest, 'appraisal' | 'interested_consumer_profile'> & { appraisal: NonNullable<RawSupabaseCollectorInterest['appraisal']>, interested_consumer_profile: NonNullable<RawSupabaseCollectorInterest['interested_consumer_profile']> } => {
            const appraisal = Array.isArray(item.appraisal) ? item.appraisal[0] : item.appraisal;
            const profile = Array.isArray(item.interested_consumer_profile) ? item.interested_consumer_profile[0] : item.interested_consumer_profile;
            return appraisal !== null && profile !== null;
          })
          .map(item => {
            const appraisalData = Array.isArray(item.appraisal) ? item.appraisal[0] : item.appraisal;
            const profileData = Array.isArray(item.interested_consumer_profile) ? item.interested_consumer_profile[0] : item.interested_consumer_profile;

            return {
              id: item.id,
              created_at: item.created_at,
              user_id: item.user_id,
              appraisal: {
                id: appraisalData.id,
                item_name: appraisalData.item_name,
                item_description: appraisalData.item_description,
                item_photo_url: appraisalData.item_photo_url,
                status: appraisalData.status,
                appraisal_data: appraisalData.appraisal_data,
              },
              interested_consumer_profile: {
                id: profileData.id,
                account_type: profileData.account_type,
                description: profileData.description,
                contact_links: profileData.contact_links,
              },
            };
          });
        setInterests(filteredInterests);
      }
      setLoading(false);
    };

    if (user && profile?.account_type === 'collector') {
      fetchCollectorInterests();
    }
  }, [user, profile, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-lg text-gray-700 dark:text-gray-300">Loading interests in your items...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-5xl mt-8">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Interests in Your Appraisals</CardTitle>
          <CardDescription>
            View consumers who have expressed interest in your appraised items.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {interests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                No consumers have expressed interest in your items yet.
              </p>
              <Button onClick={() => navigate('/my-appraisals')}>
                View Your Appraisals
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Interested Consumer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Expressed On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {interests.map((interest) => (
                    <TableRow key={interest.id}>
                      <TableCell className="font-medium">{interest.appraisal.item_name}</TableCell>
                      <TableCell>
                        {interest.interested_consumer_profile?.description || `User ID: ${interest.user_id}`}
                      </TableCell>
                      <TableCell>
                        {interest.interested_consumer_profile?.contact_links?.length ? (
                          interest.interested_consumer_profile.contact_links.map((link, index) => (
                            <span key={index} className="block text-sm text-muted-foreground">
                              {link.type}:{' '}
                              {link.type === 'email' ? (
                                <a href={`mailto:${link.value}`} className="underline text-blue-500 hover:text-blue-700">
                                  {link.value}
                                </a>
                              ) : link.value.startsWith('http') || link.value.startsWith('https') ? (
                                <a href={link.value} target="_blank" rel="noopener noreferrer" className="underline text-blue-500 hover:text-blue-700">
                                  {link.value}
                                </a>
                              ) : (
                                link.value
                              )}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>{new Date(interest.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/appraisal/${interest.appraisal.id}`)}>
                          View Item
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CollectorInterests;