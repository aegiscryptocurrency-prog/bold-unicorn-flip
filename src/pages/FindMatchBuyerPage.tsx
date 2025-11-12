"use client";

import React from "react";
import MatchCard from "@/components/MatchCard";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FindMatchBuyerPage = () => {
  // Mock data for demonstration
  const mockCollectors = [
    {
      name: "Art Enthusiast Alex",
      type: "Collector" as const,
      description: "Passionate about modern art and abstract sculptures.",
      itemsOfInterest: "Looking for unique contemporary paintings and large-scale abstract pieces.",
      contactLink: "#", // Placeholder for in-app contact
      avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Alex",
    },
    {
      name: "Coin Hunter Chloe",
      type: "Collector" as const,
      description: "Specializes in ancient Roman and Greek coinage.",
      itemsOfInterest: "Seeking rare silver denarii and bronze sestertii from the Imperial period.",
      contactLink: "#",
      avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Chloe",
    },
    {
      name: "Gemstone Guru George",
      type: "Collector" as const,
      description: "Collector of raw and cut precious gemstones.",
      itemsOfInterest: "Interested in unpolished emeralds, rubies, and large sapphires.",
      contactLink: "#",
      avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=George",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-4xl mx-auto mb-6">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Find a Match Buyer (Collectors)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Browse potential collectors interested in items like yours.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {mockCollectors.map((collector, index) => (
          <MatchCard key={index} {...collector} />
        ))}
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default FindMatchBuyerPage;