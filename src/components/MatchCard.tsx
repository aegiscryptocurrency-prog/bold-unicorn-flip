"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MatchCardProps {
  name: string;
  type: "Collector" | "Consumer";
  description: string;
  itemsOfInterest?: string; // For Collectors
  itemsForSale?: string; // For Consumers
  contactLink: string;
  avatarUrl?: string;
}

const MatchCard: React.FC<MatchCardProps> = ({
  name,
  type,
  description,
  itemsOfInterest,
  itemsForSale,
  contactLink,
  avatarUrl,
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`} alt={name} />
          <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl">{name} ({type})</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {type === "Collector" && itemsOfInterest && (
          <div>
            <h4 className="font-semibold">Collecting:</h4>
            <p className="text-gray-700 dark:text-gray-300">{itemsOfInterest}</p>
          </div>
        )}
        {type === "Consumer" && itemsForSale && (
          <div>
            <h4 className="font-semibold">Items for Sale:</h4>
            <p className="text-gray-700 dark:text-gray-300">{itemsForSale}</p>
          </div>
        )}
        <Button asChild className="w-full">
          <a href={contactLink} target="_blank" rel="noopener noreferrer">Contact {name}</a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default MatchCard;