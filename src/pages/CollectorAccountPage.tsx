"use client";

import React from "react";
import CollectorProfile from "@/components/CollectorProfile";
import { MadeWithDyad } from "@/components/made-with-dyad";

const CollectorAccountPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <CollectorProfile />
      <MadeWithDyad />
    </div>
  );
};

export default CollectorAccountPage;