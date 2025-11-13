"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabase';
import { showError } from '@/utils/toast';
import { useAuth } from '@/hooks/use-auth';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppraisalCard from '@/components/AppraisalCard'; // Import the new component

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
  const [allAppraisals, setAllAppraisals] = useState<Appraisal[]>([]);
  const [filteredAppraisals, setFilteredAppraisals] = useState<Appraisal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'value_high', 'value_low'

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
        .in('status', ['appraised', 'listed'])
        .order('created_at', { ascending: false }); // Default order

      if (error) {
        showError(`Error fetching appraisals: ${error.message}`);
        console.error('Error fetching appraisals:', error);
        setAllAppraisals([]);
      } else {
        setAllAppraisals(data || []);
      }
      setLoading(false);
    };

    if (user) {
      fetchAppraisals();
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    let currentAppraisals = [...allAppraisals];

    // Apply search filter
    if (searchTerm) {
      currentAppraisals = currentAppraisals.filter(appraisal =>
        appraisal.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appraisal.item_description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    currentAppraisals.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortBy === 'value_high') {
        const valueA = parseFloat(a.appraisal_data?.estimated_value?.replace(/[^0-9.-]+/g, "") || '0');
        const valueB = parseFloat(b.appraisal_data?.estimated_value?.replace(/[^0-9.-]+/g, "") || '0');
        return valueB - valueA;
      } else if (sortBy === 'value_low') {
        const valueA = parseFloat(a.appraisal_data?.estimated_value?.replace(/[^0-9.-]+/g, "") || '0');
        const valueB = parseFloat(b.appraisal_data?.estimated_value?.replace(/[^0-9.-]+/g, "") || '0');
        return valueA - valueB;
      }
      return 0;
    });

    setFilteredAppraisals(currentAppraisals);
  }, [searchTerm, sortBy, allAppraisals]);

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
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
              placeholder="Search by item name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="value_high">Value: High to Low</SelectItem>
                <SelectItem value="value_low">Value: Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredAppraisals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                No appraised items match your criteria.
              </p>
              <Button onClick={() => navigate('/submit-appraisal')}>
                Submit Your Own Item for Appraisal
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAppraisals.map((appraisal) => (
                <AppraisalCard key={appraisal.id} appraisal={appraisal} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BrowseAppraisals;