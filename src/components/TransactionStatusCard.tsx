"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface TransactionStatusCardProps {
  transactionId: string;
  itemName: string;
  itemValue: number;
  currency?: string;
  buyerName: string;
  sellerName: string;
  status: "Pending Escrow" | "Payment Confirmed" | "Shipped" | "Delivered" | "Completed" | "Cancelled";
  trackingNumber?: string;
  shippingCarrier?: string;
  lastUpdate: string;
}

const getStatusColor = (status: TransactionStatusCardProps["status"]) => {
  switch (status) {
    case "Pending Escrow":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "Payment Confirmed":
      return "bg-blue-500 hover:bg-blue-600";
    case "Shipped":
      return "bg-indigo-500 hover:bg-indigo-600";
    case "Delivered":
      return "bg-purple-500 hover:bg-purple-600";
    case "Completed":
      return "bg-green-500 hover:bg-green-600";
    case "Cancelled":
      return "bg-red-500 hover:bg-red-600";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
};

const getTrackingLink = (carrier: string | undefined, trackingNum: string | undefined) => {
  if (!carrier || !trackingNum) return "#";
  switch (carrier.toLowerCase()) {
    case "ups":
      return `https://www.ups.com/track?tracknum=${trackingNum}`;
    case "fedex":
      return `https://www.fedex.com/fedextrack/?tracknumbers=${trackingNum}`;
    case "usps":
      return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNum}`;
    case "dhl":
      return `https://www.dhl.com/us-en/home/tracking/tracking-parcel.html?submit=1&tracking-id=${trackingNum}`;
    default:
      return `https://www.google.com/search?q=track+package+${trackingNum}`;
  }
};

const TransactionStatusCard: React.FC<TransactionStatusCardProps> = ({
  transactionId,
  itemName,
  itemValue,
  currency = "USD",
  buyerName,
  sellerName,
  status,
  trackingNumber,
  shippingCarrier,
  lastUpdate,
}) => {
  const trackingLink = getTrackingLink(shippingCarrier, trackingNumber);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex justify-between items-center">
          <span>Transaction ID: {transactionId}</span>
          <Badge className={`${getStatusColor(status)} text-white`}>{status}</Badge>
        </CardTitle>
        <CardDescription>Last Updated: {lastUpdate}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold">Item:</h4>
          <p>{itemName}</p>
        </div>
        <div>
          <h4 className="font-semibold">Value:</h4>
          <p>{new Intl.NumberFormat("en-US", { style: "currency", currency: currency }).format(itemValue)}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold">Buyer:</h4>
            <p>{buyerName}</p>
          </div>
          <div>
            <h4 className="font-semibold">Seller:</h4>
            <p>{sellerName}</p>
          </div>
        </div>
        {trackingNumber && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-semibold">Shipping Details:</h4>
              <p>Tracking Number: {trackingNumber}</p>
              <p>Carrier: {shippingCarrier || "N/A"}</p>
              <Button asChild className="w-full mt-2">
                <a href={trackingLink} target="_blank" rel="noopener noreferrer">Track Shipment</a>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionStatusCard;