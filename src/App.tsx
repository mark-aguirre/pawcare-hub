import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Pets from "./pages/Pets";
import Owners from "./pages/Owners";
import Appointments from "./pages/Appointments";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pets" element={<Pets />} />
          <Route path="/owners" element={<Owners />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/records" element={<ComingSoon title="Medical Records" />} />
          <Route path="/inventory" element={<ComingSoon title="Inventory" />} />
          <Route path="/billing" element={<ComingSoon title="Billing" />} />
          <Route path="/reports" element={<ComingSoon title="Reports" />} />
          <Route path="/settings" element={<ComingSoon title="Settings" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
