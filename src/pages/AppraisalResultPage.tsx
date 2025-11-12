"use client";

import React from "react";
import AppraisalResultCard from "@/components/AppraisalResultCard";
import { MadeWithDyad } from "@/components/made-with-dyad";

const AppraisalResultPage = () => {
  // Mock data for demonstration purposes
  const mockAppraisalResult = {
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <AppraisalResultCard {...mockAppraisalResult} />
      <MadeWithDyad />
    </div>
  );
};

export default AppraisalResultPage;