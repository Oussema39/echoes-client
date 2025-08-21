import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Documents";
import "./App.css";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./auth/ProtectedRoute";
import LoginPage from "./pages/Auth/Login/Login";
import RegisterPage from "./pages/Auth/Register/Register";
import { SocketProvider } from "./context/SocketProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SocketProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route>
                <Route path="/" element={<Index />} />
              </Route>
              <Route element={<ProtectedRoute />}>
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </SocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
