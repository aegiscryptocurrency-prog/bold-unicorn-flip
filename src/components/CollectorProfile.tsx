"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const CollectorProfile = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Collector Profile</CardTitle>
        <CardDescription>Manage your collector profile details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Collector Name</Label>
          <Input id="name" placeholder="Your name or collector alias" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="collections">What do you collect?</Label>
          <Textarea id="collections" placeholder="e.g., Renaissance paintings, rare coins from the Roman Empire, vintage action figures" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lookingFor">What are you looking for?</Label>
          <Textarea id="lookingFor" placeholder="e.g., Specific artists, uncirculated coins, items from a particular era" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact">Contact Links (e.g., social media, personal website)</Label>
          <Input id="contact" placeholder="https://your-portfolio.com" />
        </div>
        <Button className="w-full">Save Profile</Button>
      </CardContent>
    </Card>
  );
};

export default CollectorProfile;