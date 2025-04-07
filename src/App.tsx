
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Dashboard from "./pages/Dashboard";
import HealthConcerns from "./pages/HealthConcerns";
import MedicalHistory from "./pages/MedicalHistory";
import FamilyHealth from "./pages/FamilyHealth";
import Consultations from "./pages/Consultations";
import Medications from "./pages/Medications";
import FindDoctors from "./pages/FindDoctors";
import LabReports from "./pages/LabReports";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/health-concerns" element={<ProtectedRoute><HealthConcerns /></ProtectedRoute>} />
            <Route path="/medical-history" element={<ProtectedRoute><MedicalHistory /></ProtectedRoute>} />
            <Route path="/family-health" element={<ProtectedRoute><FamilyHealth /></ProtectedRoute>} />
            <Route path="/consultations" element={<ProtectedRoute><Consultations /></ProtectedRoute>} />
            <Route path="/medications" element={<ProtectedRoute><Medications /></ProtectedRoute>} />
            <Route path="/lab-reports" element={<ProtectedRoute><LabReports /></ProtectedRoute>} />
            <Route path="/find-doctors" element={<ProtectedRoute><FindDoctors /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
