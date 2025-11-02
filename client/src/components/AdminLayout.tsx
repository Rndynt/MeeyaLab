import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, LogOut, LayoutDashboard } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

export default function AdminLayout({ children, onLogout }: AdminLayoutProps) {
  const [location] = useLocation();

  const menuItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  ];

  const isActive = (href: string) => location === href;

  return (
    <div className="min-h-screen bg-slate-50" data-testid="layout-admin">
      <div className="flex">
        <aside className="w-64 bg-white border-r border-slate-200 min-h-screen fixed">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold">SkinLite Admin</h2>
          </div>
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive(item.href) ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-3 ${
                      isActive(item.href) ? "bg-cyan-100 text-cyan-700" : ""
                    }`}
                    data-testid={`link-${item.label.toLowerCase()}`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
          <div className="absolute bottom-0 w-64 p-4 border-t border-slate-200">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={onLogout}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        <main className="flex-1 ml-64">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
