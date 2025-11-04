import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer, { type CartItem } from "@/components/CartDrawer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Heart, 
  ShoppingBag, 
  User, 
  Settings, 
  LogOut,
  ChevronRight,
  Bell
} from "lucide-react";

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}

function MenuItem({ icon, title, description, onClick }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 rounded-lg border border-slate-200/60 hover:border-slate-300 hover:bg-slate-50 transition-all group"
      data-testid={`button-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <h3 className="font-semibold text-slate-900 mb-0.5">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
    </button>
  );
}

export default function Profile() {
  const [, setLocation] = useLocation();
  const [cartOpen, setCartOpen] = useState(false);

  const cartItems: CartItem[] = [];
  const cartItemCount = 0;

  const handleLogout = () => {
    console.log("Logout clicked");
    alert("Logout successful! (Design only - functionality not implemented)");
    setLocation("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header 
        cartItemCount={cartItemCount} 
        onCartClick={() => setCartOpen(true)}
        onProfileClick={() => {}} 
      />
      
      <main className="flex-1 py-8 pt-24 md:pt-28">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2" data-testid="text-page-title">
              My Profile
            </h1>
            <p className="text-slate-600">
              Manage your account and preferences
            </p>
          </div>

          <Card className="border border-slate-200/60 shadow-sm mb-6">
            <CardHeader className="border-b border-slate-100 bg-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-white">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-xl">John Doe</CardTitle>
                  <CardDescription>john.doe@example.com</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              <Button 
                variant="outline" 
                className="w-full border-slate-300 hover:bg-slate-50"
                onClick={() => console.log("Edit profile clicked")}
                data-testid="button-edit-profile"
              >
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4 mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Account</h2>
            
            <MenuItem
              icon={<MapPin className="h-5 w-5" />}
              title="Shipping Addresses"
              description="Manage your delivery addresses"
              onClick={() => console.log("Shipping addresses clicked")}
            />

            <MenuItem
              icon={<Heart className="h-5 w-5" />}
              title="My Favorites"
              description="View all your favorite products"
              onClick={() => setLocation("/favorites")}
            />

            <MenuItem
              icon={<ShoppingBag className="h-5 w-5" />}
              title="Order History"
              description="Track and view your past orders"
              onClick={() => console.log("Order history clicked")}
            />

            <MenuItem
              icon={<Bell className="h-5 w-5" />}
              title="Notifications"
              description="Manage your notification preferences"
              onClick={() => console.log("Notifications clicked")}
            />
          </div>

          <div className="space-y-4 mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Settings</h2>
            
            <MenuItem
              icon={<Settings className="h-5 w-5" />}
              title="Account Settings"
              description="Update password and security"
              onClick={() => console.log("Account settings clicked")}
            />
          </div>

          <Card className="border border-slate-200/60 shadow-sm bg-white">
            <CardContent className="p-6">
              <Button
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                onClick={handleLogout}
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />

      <CartDrawer
        open={cartOpen}
        onOpenChange={setCartOpen}
        items={cartItems}
        onUpdateQuantity={(id, qty) => console.log("Update qty:", id, qty)}
        onRemoveItem={(id) => console.log("Remove:", id)}
        onCheckout={() => setCartOpen(false)}
        onLogin={() => {
          setCartOpen(false);
          setLocation("/login");
        }}
      />
    </div>
  );
}
