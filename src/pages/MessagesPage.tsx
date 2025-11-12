"use client";

import React from "react";
import MessageCard from "@/components/MessageCard";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MessagesPage = () => {
  // Mock data for demonstration purposes
  const mockConversations = [
    {
      senderName: "Collector Alex",
      lastMessage: "I'm interested in the vintage watch. Can we discuss the price?",
      timestamp: "2 hours ago",
      unreadCount: 1,
      conversationLink: "#", // Placeholder for actual conversation page
      senderAvatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Alex",
    },
    {
      senderName: "Sarah's Estate Sales",
      lastMessage: "The antique dresser is still available. When would you like to view it?",
      timestamp: "Yesterday",
      unreadCount: 0,
      conversationLink: "#",
      senderAvatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Sarah",
    },
    {
      senderName: "Gemstone Guru George",
      lastMessage: "I've received the emerald. It's stunning! Confirming transaction completion.",
      timestamp: "3 days ago",
      unreadCount: 0,
      conversationLink: "#",
      senderAvatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=George",
    },
    {
      senderName: "John's Collectibles",
      lastMessage: "Regarding the Roman coin, I'm ready to ship. Please confirm your address.",
      timestamp: "Last week",
      unreadCount: 2,
      conversationLink: "#",
      senderAvatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=John",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-3xl mx-auto mb-6">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Your Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Communicate with other users about appraisals and transactions.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4 w-full max-w-3xl">
        {mockConversations.map((conversation, index) => (
          <MessageCard key={index} {...conversation} />
        ))}
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default MessagesPage;