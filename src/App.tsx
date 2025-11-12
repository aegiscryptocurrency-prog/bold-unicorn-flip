import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CollectorAccountPage from "./pages/CollectorAccountPage";
import ConsumerAccountPage from "./pages/ConsumerAccountPage";
import AppraisalPage from "./pages/AppraisalPage";
import AppraisalResultPage from "./pages/AppraisalResultPage";
import FindMatchBuyerPage from "./pages/FindMatchBuyerPage";
import FindMatchSellerPage from "./pages/FindMatchSellerPage";
import TransactionPage from "./pages/TransactionPage"; // Import new page

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/collector-account" element={<CollectorAccountPage />} />
          <Route path="/consumer-account" element={<ConsumerAccountPage />} />
          <Route path="/appraise-item" element={<AppraisalPage />} />
          <Route path="/appraisal-result" element={<AppraisalResultPage />} />
          <Route path="/find-match-buyer" element={<FindMatchBuyerPage />} />
          <Route path="/find-match-seller" element={<FindMatchSellerPage />} />
          <Route path="/initiate-transaction" element={<TransactionPage />} /> {/* New route */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;