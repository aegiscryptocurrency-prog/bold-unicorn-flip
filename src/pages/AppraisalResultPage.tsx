"use client";

import React, { useEffect, useState } from "react";
import AppraisalResultCard from "@/components/AppraisalResultCard";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tables } from "@/types/supabase"; // Import Tables type

type AppraisalRequestRow = Tables<'appraisal_requests'>;
type AppraisalResultRow = Tables<'appraisal_results'>;

const AppraisalResultPage = () => {
  const navigate = useNavigate();
  const { requestId } = useParams<{ requestId: string }>();
  const [appraisalResult, setAppraisalResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppraisalResult = async () => {
      if (!requestId) {
        setError("No appraisal request ID provided.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      const pollForResult = async () => {
        const { data: resultData, error: resultError } = await supabase
          .from('appraisal_results')
          .select('*')
          .eq('request_id', requestId)
          .single();

        if (resultError && resultError.code === 'PGRST116') {
          // If not found, it means the trigger hasn't processed it yet. Poll again.
          setTimeout(pollForResult, 3000);
        } else if (resultError) {
          console.error("Error fetching appraisal result:", resultError);
          setError(`Failed to load appraisal result: ${resultError.message}`);
          setIsLoading(false);
        } else if (resultData) {
          const { data: requestData, error: requestError } = await supabase
            .from('appraisal_requests')
            .select('item_name, item_category, item_history, item_description, image_url')
            .eq('id', requestId)
            .single();

          if (requestError) {
            console.error("Error fetching request data:", requestError);
            setError(`Failed to load item details: ${requestError.message}`);
            setIsLoading(false);
            return;
          }

          if (!requestData) {
            setError("Appraisal request details not found.");
            setIsLoading(false);
            return;
          }

          setAppraisalResult({
            itemName: requestData.item_name,
            itemCategory: requestData.item_category,
            appraisedValue: resultData.appraised_value,
            currency: resultData.currency,
            history: requestData.item_history || "Not provided.",
            description: requestData.item_description || "Not provided.",
            qualityAssessment: resultData.quality_assessment,
            qualityExplanation: resultData.quality_explanation,
            sellBuyOptions: resultData.sell_buy_options,
            imageUrl: requestData.image_url || "https://via.placeholder.com/400x300?text=Item+Image",
            appraisalMethodology: resultData.appraisal_methodology,
            dataSources: resultData.data_sources,
            expertInsights: resultData.expert_insights,
          });
          setIsLoading(false);
        }
      };

      pollForResult();
    };

    fetchAppraisalResult();
  }, [requestId, navigate]); // Added navigate to dependency array

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <div className="w-full max-w-3xl mx-auto mb-4">
          <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Appraisal Form
          </Button>
        </div>
        <Card className="w-full max-w-3xl mx-auto shadow-lg p-6 space-y-6">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
          <Skeleton className="h-64 w-full" />
          <Separator />
          <Skeleton className="h-10 w-1/3 mx-auto" />
          <Skeleton className="h-16 w-full" />
          <Separator />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Separator />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Separator />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </Card>
        <MadeWithDyad />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <div className="w-full max-w-3xl mx-auto mb-4">
          <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Appraisal Form
          </Button>
        </div>
        <Card className="w-full max-w-3xl mx-auto shadow-lg p-6 text-center text-red-500">
          <CardTitle>Error Loading Appraisal</CardTitle>
          <CardDescription>{error}</CardDescription>
          <Button onClick={() => navigate('/appraise-item')} className="mt-4">Try Another Appraisal</Button>
        </Card>
        <MadeWithDyad />
      </div>
    );
  }

  if (!appraisalResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <div className="w-full max-w-3xl mx-auto mb-4">
          <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Appraisal Form
          </Button>
        </div>
        <Card className="w-full max-w-3xl mx-auto shadow-lg p-6 text-center">
          <CardTitle>No Appraisal Result Found</CardTitle>
          <CardDescription>It seems there was an issue retrieving the appraisal for this request.</CardDescription>
          <Button onClick={() => navigate('/appraise-item')} className="mt-4">Start New Appraisal</Button>
        </Card>
        <MadeWithDyad />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-3xl mx-auto mb-4">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Appraisal Form
        </Button>
      </div>
      <AppraisalResultCard {...appraisalResult} />
      <MadeWithDyad />
    </div>
  );
};

export default AppraisalResultPage;