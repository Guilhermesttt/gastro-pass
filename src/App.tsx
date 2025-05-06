import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utils/protectedRoute";
import AdminProtectedRoute from "./utils/adminProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminRestaurants from "./pages/AdminRestaurants";
import AdminUsers from "./pages/AdminUsers";
import AdminPayments from "./pages/AdminPayments";
import AdminPlans from "./pages/AdminPlans";
import Reports from "./pages/Reports";
import ChangePassword from "./pages/ChangePassword";
import ManageSubscription from "./pages/ManageSubscription";
import Plans from "./pages/Plans";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// The issue is with TooltipProvider being directly used as a non-function component
// We need to wrap our application content in it correctly
const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/plans" element={<Plans />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/change-password" element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          } />
          
          <Route path="/manage-subscription" element={
            <ProtectedRoute>
              <ManageSubscription />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <Admin />
            </AdminProtectedRoute>
          } />
          
          <Route path="/admin/restaurants" element={
            <AdminProtectedRoute>
              <AdminRestaurants />
            </AdminProtectedRoute>
          } />
          
          <Route path="/admin/users" element={
            <AdminProtectedRoute>
              <AdminUsers />
            </AdminProtectedRoute>
          } />
          
          <Route path="/admin/payments" element={
            <AdminProtectedRoute>
              <AdminPayments />
            </AdminProtectedRoute>
          } />
          
          <Route path="/admin/plans" element={
            <AdminProtectedRoute>
              <AdminPlans />
            </AdminProtectedRoute>
          } />
          
          <Route path="/admin/reports" element={
            <AdminProtectedRoute>
              <Reports />
            </AdminProtectedRoute>
          } />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
