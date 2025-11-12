"use client";

import React from "react";
import AppraisalResultCard from "@/components/AppraisalResultCard";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation and useNavigate
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const AppraisalResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const appraisalResult = location.state?.appraisalResult; // Access the passed state

  // If no appraisal result is found (e.g., direct navigation),
  // we can use mock data or redirect. For now, let's use mock data as a fallback.
  const defaultMockAppraisalResult = {
    itemName: "Oil Painting: 'Sunset over the Lake'",
    itemCategory: "Fine Art",
    appraisedValue: 15000,
    currency: "USD",
    history: "Believed to be painted by a regional artist in the late 19th century. Acquired by a private collector in 1950 and passed down through generations.",
    description: "A vibrant oil on canvas depicting a serene sunset scene over a calm lake, with a small boat in the foreground. The brushwork suggests an impressionistic style.",
    qualityAssessment: "Good Condition",
    qualityExplanation: "Minor craquelure visible on close inspection, consistent with age. No significant paint loss or damage. Original frame shows some wear.",
    sellBuyOptions: [
      "Local Art Galleries (e.g., 'The Art Nook' in downtown)",
      "Online Art Marketplaces (e.g., Artsy, Saatchi Art)",
      "Auction Houses (e.g., Sotheby's, Christie's for higher value pieces)",
      "Specialized Art Dealers",
    ],
    imageUrl: "https://via.placeholder.com/400x300?text=Oil+Painting", // Placeholder image
  };

  const displayResult = appraisalResult || defaultMockAppraisalResult;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-3xl mx-auto mb-4">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Appraisal Form
        </Button>
      </div>
      <AppraisalResultCard {...displayResult} />
      <MadeWithDyad />
    </div>
  );
};

export default AppraisalResultPage;