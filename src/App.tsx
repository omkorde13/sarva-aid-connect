import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import HelpRequestForm from "./pages/citizen/HelpRequestForm";
import ShelterMap from "./pages/citizen/ShelterMap";
import AlertsPage from "./pages/citizen/AlertsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import HelpRequestManagement from "./pages/admin/HelpRequestManagement";
import BroadcastAlert from "./pages/admin/BroadcastAlert";
import ShelterManagement from "./pages/admin/ShelterManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            
            {/* Citizen Routes */}
            <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
            <Route path="/citizen/help-request" element={<HelpRequestForm />} />
            <Route path="/citizen/shelters" element={<ShelterMap />} />
            <Route path="/citizen/alerts" element={<AlertsPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/requests" element={<HelpRequestManagement />} />
            <Route path="/admin/broadcast" element={<BroadcastAlert />} />
            <Route path="/admin/shelters" element={<ShelterManagement />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;