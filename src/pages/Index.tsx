"use client";

import { MadeWithDyad } from "@/components/made-with-dyad";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Welcome to Your Dyad App!</CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
            Start building your amazing project here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            This is a simple starter page. Feel free to modify it or add new components and pages.
          </p>
          <Button onClick={() => alert("Button clicked!")}>
            Explore Features
          </Button>
        </CardContent>
      </Card>
      <div className="mt-8">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;