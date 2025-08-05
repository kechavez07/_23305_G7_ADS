
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AppointmentCartPage from "./pages/AppointmentCartPage";
import VoucherPage from "./pages/VoucherPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AppointmentProvider } from "./context/AppointmentContext";
import { useEffect } from "react";
import AuthCheck from "./components/AuthCheck";

const queryClient = new QueryClient();

const App = () => {
  // Check if admin is logged in on app load (for demo purposes)
  useEffect(() => {
    const adminLogin = new URLSearchParams(window.location.search).get('adminLogin');
    if (adminLogin === 'true') {
      sessionStorage.setItem('userLoggedIn', 'true');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppointmentProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={
                <AuthCheck>
                  <Index />
                </AuthCheck>
              } />
              <Route path="/appointment-cart" element={
                <AuthCheck>
                  <AppointmentCartPage />
                </AuthCheck>
              } />
              <Route path="/voucher" element={
                <AuthCheck>
                  <VoucherPage />
                </AuthCheck>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppointmentProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
