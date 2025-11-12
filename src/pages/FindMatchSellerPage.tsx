"use client";

import React from "react";
import MatchCard from "@/components/MatchCard";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FindMatchSellerPage = () => {
  // Mock data for demonstration
  const mockConsumers = [
    {
      name: "Sarah's Estate Sales",
      type: "Consumer" as const,
      description: "Selling inherited antique furniture and vintage jewelry.",
      itemsForSale: "Antique Victorian dresser, gold locket, various silver rings.",
      contactLink: "#", // Placeholder for in-app contact
      avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Sarah",
    },
    {
      name: "John's Collectibles",
      type: "Consumer" as const,
      description: "Downsizing a personal collection of comic books and action figures.",
      itemsForSale: "First edition Spider-Man comics, rare Star Wars action figures.",
      contactLink: "#",
      avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=John",
    },
    {
      name: "Maria's Art Finds",
      type: "Consumer" as const,
      description: "Occasional seller of unique art pieces found at local markets.",
      itemsForSale: "Abstract acrylic painting, small bronze sculpture, ceramic vase.",
      contactLink: "#",
      avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Maria",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-4xl mx-auto mb-6">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Find a Match Seller (Consumers)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Browse potential sellers with items that might interest you.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {mockConsumers.map((consumer, index) => (
          <MatchCard key={index} {...consumer} />
        ))}
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default FindMatchSellerPage;