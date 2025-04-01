
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import HealthConcerns from "./pages/HealthConcerns";
import MedicalHistory from "./pages/MedicalHistory";
import FamilyHealth from "./pages/FamilyHealth";
import Consultations from "./pages/Consultations";
import Medications from "./pages/Medications";
import FindDoctors from "./pages/FindDoctors";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/health-concerns" element={<HealthConcerns />} />
          <Route path="/medical-history" element={<MedicalHistory />} />
          <Route path="/family-health" element={<FamilyHealth />} />
          <Route path="/consultations" element={<Consultations />} />
          <Route path="/medications" element={<Medications />} />
          <Route path="/find-doctors" element={<FindDoctors />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
