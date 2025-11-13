"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabase';
import { showError, showSuccess } from '@/utils/toast';
import { useAuth } from '@/hooks/use-auth';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

const AppraisalManagement: React.FC = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [pendingAppraisals, setPendingAppraisals] = useState<Appraisal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppraisal, setSelectedAppraisal] = useState<Appraisal | null>(null);
  const [history, setHistory] = useState('');
  const [quality, setQuality] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [notes, setNotes] = useState('');
  const [submittingAppraisal, setSubmittingAppraisal] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || profile?.account_type !== 'collector')) {
      navigate('/dashboard'); // Redirect if not authenticated or not a collector
      return;
    }

    const fetchPendingAppraisals = async () => {
      if (!user || profile?.account_type !== 'collector') return;

      setLoading(true);
      const { data, error } = await supabase
        .from('appraisals')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (error) {
        showError(`Error fetching pending appraisals: ${error.message}`);
        console.error('Error fetching pending appraisals:', error);
        setPendingAppraisals([]);
      } else {
        setPendingAppraisals(data || []);
      }
      setLoading(false);
    };

    if (user && profile?.account_type === 'collector') {
      fetchPendingAppraisals();
    }
  }, [user, profile, authLoading, navigate]);

  const handleAppraiseClick = (appraisal: Appraisal) => {
    setSelectedAppraisal(appraisal);
    setHistory(appraisal.appraisal_data?.history || '');
    setQuality(appraisal.appraisal_data?.quality || '');
    setEstimatedValue(appraisal.appraisal_data?.estimated_value || '');
    setNotes(appraisal.appraisal_data?.notes || '');
    setIsDialogOpen(true);
  };

  const handleSubmitAppraisal = async () => {
    if (!selectedAppraisal) return;

    setSubmittingAppraisal(true);
    try {
      const { error } = await supabase
        .from('appraisals')
        .update({
          status: 'appraised',
          appraisal_data: {
            history,
            quality,
            estimated_value: estimatedValue,
            notes,
          },
        })
        .eq('id', selectedAppraisal.id);

      if (error) {
        throw error;
      }

      showSuccess('Appraisal submitted successfully!');
      setIsDialogOpen(false);
      setSelectedAppraisal(null);
      // Refresh the list of pending appraisals
      setPendingAppraisals(prev => prev.filter(app => app.id !== selectedAppraisal.id));
    } catch (error: any) {
      showError(`Error submitting appraisal: ${error.message}`);
      console.error('Error submitting appraisal:', error);
    } finally {
      setSubmittingAppraisal(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-lg text-gray-700 dark:text-gray-300">Loading appraisal management...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-4xl mt-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Appraisal Management</CardTitle>
          <CardDescription>
            Review and appraise pending item submissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingAppraisals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                No pending appraisals to review at this time.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Submitted On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingAppraisals.map((appraisal) => (
                    <TableRow key={appraisal.id}>
                      <TableCell className="font-medium">{appraisal.item_name}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[250px] truncate">
                        {appraisal.item_description}
                      </TableCell>
                      <TableCell>{new Date(appraisal.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" onClick={() => handleAppraiseClick(appraisal)}>
                          Appraise Item
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Appraise Item: {selectedAppraisal?.item_name}</DialogTitle>
            <DialogDescription>
              Provide your expert appraisal details for this item.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="history" className="text-right">
                History
              </Label>
              <Textarea
                id="history"
                value={history}
                onChange={(e) => setHistory(e.target.value)}
                className="col-span-3"
                placeholder="Historical context, origin, etc."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quality" className="text-right">
                Quality
              </Label>
              <Input
                id="quality"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Excellent, Good, Fair"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="estimatedValue" className="text-right">
                Est. Value
              </Label>
              <Input
                id="estimatedValue"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(e.target.value)}
                className="col-span-3"
                placeholder="e.g., $1,500 - $2,000"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="col-span-3"
                placeholder="Any additional notes or considerations."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmitAppraisal} disabled={submittingAppraisal}>
              {submittingAppraisal ? 'Submitting...' : 'Submit Appraisal'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppraisalManagement;