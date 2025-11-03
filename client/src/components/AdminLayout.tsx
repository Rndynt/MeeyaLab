import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Package, ShoppingCart, LogOut, LayoutDashboard, Menu, Settings, ExternalLink } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

export default function AdminLayout({ children, onLogout }: AdminLayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  const isActive = (href: string) => location === href;

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold">MeeyaLab Admin</h2>
      </div>
      <nav className="p-4 space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive(item.href) ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  isActive(item.href) ? "bg-cyan-100 text-cyan-700" : ""
                }`}
                onClick={() => setSidebarOpen(false)}
                data-testid={`link-${item.label.toLowerCase()}`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-200 mt-auto space-y-2">
        <Link href="/">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
            onClick={() => setSidebarOpen(false)}
            data-testid="button-visit-store"
          >
            <ExternalLink className="h-4 w-4" />
            Visit Store
          </Button>
        </Link>
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
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50" data-testid="layout-admin">
      <div className="lg:flex">
        <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-slate-200 min-h-screen fixed">
          <SidebarContent />
        </aside>

        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">MeeyaLab Admin</h2>
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="button-menu-toggle">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 flex flex-col">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>

        <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
          <div className="p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
