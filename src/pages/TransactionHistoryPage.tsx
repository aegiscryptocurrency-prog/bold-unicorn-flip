"use client";

import React from "react";
import TransactionStatusCard from "@/components/TransactionStatusCard";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TransactionHistoryPage = () => {
  // Mock data for demonstration purposes
  const mockTransactions = [
    {
      transactionId: "TXN-001-ABC",
      itemName: "Vintage Rolex Submariner",
      itemValue: 18500,
      buyerName: "Collector Alex",
      sellerName: "Consumer Sarah",
      status: "Shipped" as const,
      trackingNumber: "1Z9999999999999999",
      shippingCarrier: "UPS",
      lastUpdate: "2023-10-26 10:30 AM",
    },
    {
      transactionId: "TXN-002-DEF",
      itemName: "Ancient Roman Denarius (Augustus)",
      itemValue: 2500,
      buyerName: "Coin Hunter Chloe",
      sellerName: "John's Collectibles",
      status: "Payment Confirmed" as const,
      trackingNumber: undefined,
      shippingCarrier: undefined,
      lastUpdate: "2023-10-25 03:15 PM",
    },
    {
      transactionId: "TXN-003-GHI",
      itemName: "Abstract Oil Painting",
      itemValue: 7500,
      buyerName: "Art Enthusiast Alex",
      sellerName: "Maria's Art Finds",
      status: "Delivered" as const,
      trackingNumber: "9400108901000000000000",
      shippingCarrier: "USPS",
      lastUpdate: "2023-10-24 09:00 AM",
    },
    {
      transactionId: "TXN-004-JKL",
      itemName: "Rare Emerald Gemstone",
      itemValue: 30000,
      buyerName: "Gemstone Guru George",
      sellerName: "Consumer Sarah",
      status: "Pending Escrow" as const,
      trackingNumber: undefined,
      shippingCarrier: undefined,
      lastUpdate: "2023-10-26 11:00 AM",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-4xl mx-auto mb-6">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 dark:text-gray-400">
            View the status of your ongoing and past transactions.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {mockTransactions.map((transaction) => (
          <TransactionStatusCard key={transaction.transactionId} {...transaction} />
        ))}
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default TransactionHistoryPage;