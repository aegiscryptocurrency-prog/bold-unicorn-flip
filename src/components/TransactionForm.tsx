"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const TransactionForm = () => {
  const [itemName, setItemName] = useState("");
  const [itemValue, setItemValue] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerShippingAddress, setBuyerShippingAddress] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!itemName || !itemValue || !buyerName || !buyerShippingAddress) {
      toast.error("Please fill in all required transaction details.");
      return;
    }
    // In a real application, this would initiate the escrow process
    // and store transaction details in a backend.
    console.log({ itemName, itemValue, buyerName, buyerShippingAddress, trackingNumber });
    toast.success("Transaction initiated! Funds will be held in escrow. (Backend integration needed)");
    // Reset form
    setItemName("");
    setItemValue("");
    setBuyerName("");
    setBuyerShippingAddress("");
    setTrackingNumber("");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Initiate Transaction</CardTitle>
        <CardDescription>Set up a secure transaction with escrow and provide shipping details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="itemName">Item Name</Label>
            <Input
              id="itemName"
              placeholder="e.g., Vintage Rolex Watch"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="itemValue">Agreed Item Value (USD)</Label>
            <Input
              id="itemValue"
              type="number"
              placeholder="e.g., 15000"
              value={itemValue}
              onChange={(e) => setItemValue(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="buyerName">Buyer's Name</Label>
            <Input
              id="buyerName"
              placeholder="Name of the buyer"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="buyerShippingAddress">Buyer's Shipping Address</Label>
            <Textarea
              id="buyerShippingAddress"
              placeholder="Full shipping address for the buyer"
              value={buyerShippingAddress}
              onChange={(e) => setBuyerShippingAddress(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trackingNumber">Shipping Tracking Number (Optional)</Label>
            <Input
              id="trackingNumber"
              placeholder="Enter tracking number once shipped"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">Initiate Escrow & Transaction</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;