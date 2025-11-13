"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface AppraisalResultCardProps {
  itemName: string;
  itemCategory: string;
  appraisedValue: number;
  currency?: string;
  history: string;
  description: string;
  qualityAssessment: string;
  qualityExplanation: string;
  sellBuyOptions: string[];
  imageUrl: string;
  // New fields for appraisal methodology
  appraisalMethodology: string;
  dataSources: string[];
  expertInsights: string;
}

const AppraisalResultCard: React.FC<AppraisalResultCardProps> = ({
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
  appraisalMethodology, // Destructure new props
  dataSources,
  expertInsights,
}) => {
  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">{itemName}</CardTitle>
        <CardDescription className="text-lg text-gray-600 dark:text-gray-400">{itemCategory}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <img src={imageUrl} alt={itemName} className="max-h-80 object-contain rounded-lg shadow-md" />
        </div>

        <Separator />

        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Appraised Value:</h3>
          <p className="text-5xl font-extrabold text-green-600 dark:text-green-400 mt-2">
            {new Intl.NumberFormat("en-US", { style: "currency", currency: currency }).format(appraisedValue)}
          </p>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Item Details</h3>
          <div>
            <p className="font-medium">Description:</p>
            <p className="text-gray-700 dark:text-gray-300">{description}</p>
          </div>
          <div>
            <p className="font-medium">History/Provenance:</p>
            <p className="text-gray-700 dark:text-gray-300">{history}</p>
          </div>
          <div>
            <p className="font-medium">Quality Assessment:</p>
            <p className="text-gray-700 dark:text-gray-300">{qualityAssessment}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{qualityExplanation}</p>
          </div>
        </div>

        <Separator />

        {/* New Section: Appraisal Methodology */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Appraisal Methodology</h3>
          <div>
            <p className="font-medium">Method Used:</p>
            <p className="text-gray-700 dark:text-gray-300">{appraisalMethodology}</p>
          </div>
          <div>
            <p className="font-medium">Key Data Sources:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {dataSources.map((source, index) => (
                <Badge key={index} variant="secondary">{source}</Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="font-medium">Expert Insights:</p>
            <p className="text-gray-700 dark:text-gray-300">{expertInsights}</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Potential Sell/Buy Options</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
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