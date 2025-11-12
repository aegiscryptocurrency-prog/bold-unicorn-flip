"use client";

import React from "react";
import ConsumerProfile from "@/components/ConsumerProfile";
import { MadeWithDyad } from "@/components/made-with-dyad";

const ConsumerAccountPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <ConsumerProfile />
      <MadeWithDyad />
    </div>
  );
};

export default ConsumerAccountPage;