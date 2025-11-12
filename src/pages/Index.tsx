"use client";

import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Welcome to Your Appraisal App</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Start building your amazing project here!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/collector-account">
            <Button className="w-full sm:w-auto">Go to Collector Account</Button>
          </Link>
          <Link to="/consumer-account">
            <Button className="w-full sm:w-auto" variant="secondary">Go to Consumer Account</Button>
          </Link>
          <Link to="/appraise-item">
            <Button className="w-full sm:w-auto" variant="outline">Appraise an Item</Button>
          </Link>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;