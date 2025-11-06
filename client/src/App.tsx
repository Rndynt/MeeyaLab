import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Checkout from "@/pages/Checkout";
import CheckOrder from "@/pages/CheckOrder";
import Contact from "@/pages/Contact";
import LoginPage from "@/pages/Login";
import Favorites from "@/pages/Favorites";
import Profile from "@/pages/Profile";
import ProfileAddresses from "@/pages/profile/Addresses";
import ProfileOrders from "@/pages/profile/Orders";
import ProfileNotifications from "@/pages/profile/Notifications";
import ProfileSettings from "@/pages/profile/Settings";
import AdminLoginPage from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProductsPage from "@/pages/admin/ProductsPage";
import AdminInventoryPage from "@/pages/admin/InventoryPage";
import AdminOrdersPage from "@/pages/admin/OrdersPage";
import AdminOrderDetailPage from "@/pages/admin/OrderDetailPage";
import AdminPaymentVerificationPage from "@/pages/admin/PaymentVerificationPage";
import AdminPaymentMethodsSettingsPage from "@/pages/admin/PaymentMethodsSettingsPage";
import AdminPaymentReconciliationPage from "@/pages/admin/PaymentReconciliationPage";
import AdminSettingsPage from "@/pages/admin/SettingsPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/products" component={Products} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/check-order" component={CheckOrder} />
      <Route path="/contact" component={Contact} />
      <Route path="/login" component={LoginPage} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/profile/addresses" component={ProfileAddresses} />
      <Route path="/profile/orders" component={ProfileOrders} />
      <Route path="/profile/notifications" component={ProfileNotifications} />
      <Route path="/profile/settings" component={ProfileSettings} />
      <Route path="/profile" component={Profile} />
      
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/inventory" component={AdminInventoryPage} />
      <Route path="/admin/orders/:id" component={AdminOrderDetailPage} />
      <Route path="/admin/orders" component={AdminOrdersPage} />
      <Route path="/admin/payments" component={AdminPaymentVerificationPage} />
      <Route path="/admin/payment-methods" component={AdminPaymentMethodsSettingsPage} />
      <Route path="/admin/reconciliation" component={AdminPaymentReconciliationPage} />
      <Route path="/admin/products" component={AdminProductsPage} />
      <Route path="/admin/settings" component={AdminSettingsPage} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
