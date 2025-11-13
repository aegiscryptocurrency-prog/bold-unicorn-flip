"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

interface AppraisalCardProps {
  appraisal: Appraisal;
}

const AppraisalCard: React.FC<AppraisalCardProps> = ({ appraisal }) => {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-grow">
        <img
          src={appraisal.item_photo_url}
          alt={appraisal.item_name}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
        <CardTitle className="text-xl font-semibold truncate">{appraisal.item_name}</CardTitle>
        <CardDescription className="line-clamp-2">{appraisal.item_description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-between items-center mb-4">
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
          {appraisal.appraisal_data?.estimated_value && (
            <span className="text-lg font-bold text-primary">
              {appraisal.appraisal_data.estimated_value}
            </span>
          )}
        </div>
        <Button className="w-full" onClick={() => navigate(`/appraisal/${appraisal.id}`)}>
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default AppraisalCard;