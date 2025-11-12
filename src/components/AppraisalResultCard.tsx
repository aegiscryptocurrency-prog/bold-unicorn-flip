"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface AppraisalResultProps {
  itemName: string;
  itemCategory: string;
  appraisedValue: number;
  currency?: string;
  history: string;
  description: string;
  qualityAssessment: string;
  qualityExplanation: string;
  sellBuyOptions: string[];
  imageUrl?: string;
}

const AppraisalResultCard: React.FC<AppraisalResultProps> = ({
  itemName,
  itemCategory,
  appraisedValue,
  currency = "USD",
  history,
  description,
  qualityAssessment,
  qualityExplanation,
  sellBuyOptions,
  imageUrl,
}) => {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl">{itemName}</CardTitle>
        <CardDescription className="text-lg">{itemCategory}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {imageUrl && (
          <div className="flex justify-center mb-4">
            <img src={imageUrl} alt={itemName} className="max-h-80 object-contain rounded-lg shadow-md" />
          </div>
        )}

        <div className="text-center">
          <h3 className="text-2xl font-semibold text-green-600 dark:text-green-400">Appraised Value:</h3>
          <p className="text-4xl font-bold text-green-700 dark:text-green-300">
            {new Intl.NumberFormat("en-US", { style: "currency", currency: currency }).format(appraisedValue)}
          </p>
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="text-xl font-semibold">History</h4>
          <p className="text-gray-700 dark:text-gray-300">{history}</p>
        </div>

        <div className="space-y-2">
          <h4 className="text-xl font-semibold">Description</h4>
          <p className="text-gray-700 dark:text-gray-300">{description}</p>
        </div>

        <div className="space-y-2">
          <h4 className="text-xl font-semibold">Quality Assessment</h4>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-medium">{qualityAssessment}</span> - {qualityExplanation}
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-xl font-semibold">Where to Sell or Buy</h4>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
            {sellBuyOptions.map((option, index) => (
              <li key={index}>{option}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppraisalResultCard;