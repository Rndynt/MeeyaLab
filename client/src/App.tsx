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
import AdminLoginPage from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProductsPage from "@/pages/admin/ProductsPage";
import AdminOrdersPage from "@/pages/admin/OrdersPage";
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
      
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/products" component={AdminProductsPage} />
      <Route path="/admin/orders" component={AdminOrdersPage} />
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
