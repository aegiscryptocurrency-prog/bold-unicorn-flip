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

interface Appraisal {
  id: string;
  item_name: string;
  item_description: string;
  item_photo_url: string;
  status: 'pending' | 'appraised' | 'listed';
  created_at: string;
}

const MyAppraisals: React.FC = () => {
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
      const { data, error } = await supabase
        .from('appraisals')
        .select('*')
        .eq('user_id', user.id)
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
        <p className="text-lg text-gray-700 dark:text-gray-300">Loading your appraisals...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-3xl mt-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">My Appraisal Submissions</CardTitle>
          <CardDescription>
            View the status and details of your submitted items.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {appraisals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You haven't submitted any appraisals yet.
              </p>
              <Button onClick={() => navigate('/submit-appraisal')}>
                Submit Your First Appraisal
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appraisals.map((appraisal) => (
                    <TableRow key={appraisal.id}>
                      <TableCell className="font-medium">{appraisal.item_name}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">
                        {appraisal.item_description}
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>{new Date(appraisal.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/appraisal/${appraisal.id}`)}>
                          View Details
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

export default MyAppraisals;