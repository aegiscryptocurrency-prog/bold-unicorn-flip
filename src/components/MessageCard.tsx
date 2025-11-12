"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Added import for Badge
import { ArrowRight } from "lucide-react";

interface MessageCardProps {
  senderName: string;
  senderAvatarUrl?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  conversationLink: string;
}

const MessageCard: React.FC<MessageCardProps> = ({
  senderName,
  senderAvatarUrl,
  lastMessage,
  timestamp,
  unreadCount,
  conversationLink,
}) => {
  return (
    <Card className="w-full cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <CardContent className="flex items-center p-4 space-x-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={senderAvatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${senderName}`} alt={senderName} />
          <AvatarFallback>{senderName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">{senderName}</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">{timestamp}</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm truncate">{lastMessage}</p>
        </div>
        {unreadCount && unreadCount > 0 && (
          <Badge className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs font-bold">
            {unreadCount}
          </Badge>
        )}
        <Button variant="ghost" size="icon" asChild>
          <a href={conversationLink}>
            <ArrowRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default MessageCard;