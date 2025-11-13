import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard"; // Import the new Dashboard page
import AuthLayout from "./components/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the new ProtectedRoute
import Navbar from "./components/Navbar"; // Import the new Navbar
import { useAuth } from "./hooks/use-auth";
import React from "react";

const queryClient = new QueryClient();

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-lg text-gray-700 dark:text-gray-300">Loading application...</p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar /> {/* Add Navbar here */}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<AuthLayout><SignIn /></AuthLayout>} />
            <Route path="/signup" element={<AuthLayout><SignUp /></AuthLayout>} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Future protected routes like profile pages will go here */}
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;