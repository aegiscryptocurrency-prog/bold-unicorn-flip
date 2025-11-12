"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const ConsumerProfile = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Consumer Profile</CardTitle>
        <CardDescription>Manage your consumer profile and listing details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" placeholder="your.email@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="homeAddress">Home Address</Label>
          <Input id="homeAddress" placeholder="123 Main St, Anytown, USA" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="shippingAddress">Shipping Address</Label>
          <Input id="shippingAddress" placeholder="456 Oak Ave, Othercity, USA (if different)" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="itemsForSale">Items you may have for sale</Label>
          <Textarea id="itemsForSale" placeholder="e.g., A collection of vintage stamps, an antique vase, a rare comic book" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact">Contact Links (e.g., social media, personal website)</Label>
          <Input id="contact" placeholder="https://your-shop.com" />
        </div>
        <Button className="w-full">Save Profile</Button>
      </CardContent>
    </Card>
  );
};

export default ConsumerProfile;