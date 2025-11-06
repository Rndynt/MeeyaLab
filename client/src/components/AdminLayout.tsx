import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Package, 
  LogOut, 
  LayoutDashboard, 
  Menu, 
  Settings, 
  ExternalLink, 
  Boxes, 
  CreditCard,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CheckCircle,
  Receipt,
  FileBarChart,
  Truck
} from "lucide-react";
import ShoppingBagMinimal from "@/components/icons/ShoppingBagMinimal";

interface MenuItem {
  href?: string;
  label: string;
  icon: any;
  lucideIcon: boolean;
  subItems?: { href: string; label: string; icon: any }[];
}

interface AdminLayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

export default function AdminLayout({ children, onLogout }: AdminLayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["Payments"]);

  const menuItems: MenuItem[] = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, lucideIcon: true },
    { href: "/admin/products", label: "Products", icon: Package, lucideIcon: true },
    { href: "/admin/inventory", label: "Inventory", icon: Boxes, lucideIcon: true },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBagMinimal, lucideIcon: false },
    { href: "/admin/shipping", label: "Shipping", icon: Truck, lucideIcon: true },
    { 
      label: "Payments", 
      icon: CreditCard, 
      lucideIcon: true,
      subItems: [
        { href: "/admin/payments", label: "Verification", icon: CheckCircle },
        { href: "/admin/payment-methods", label: "Payment Methods", icon: Receipt },
        { href: "/admin/reconciliation", label: "Reconciliation", icon: FileBarChart },
      ]
    },
    { href: "/admin/settings", label: "Settings", icon: Settings, lucideIcon: true },
  ];

  const isActive = (href: string) => location === href;

  const isMenuActive = (item: MenuItem) => {
    if (item.href) return isActive(item.href);
    if (item.subItems) {
      return item.subItems.some(sub => isActive(sub.href));
    }
    return false;
  };

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const SidebarContent = ({ forMobile = false }: { forMobile?: boolean }) => {
    const collapsed = forMobile ? false : sidebarCollapsed;
    
    return (
      <>
        <div className={`p-6 border-b border-slate-200 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && <h2 className="text-xl font-bold">MeeyaLab Admin</h2>}
          {!forMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-8 w-8"
              data-testid="button-toggle-sidebar"
            >
              {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
            </Button>
          )}
        </div>
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedMenus.includes(item.label);
            const active = isMenuActive(item);

            if (hasSubItems) {
              return (
                <div key={item.label} className="space-y-1">
                  <Button
                    variant={active ? "secondary" : "ghost"}
                    className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start gap-3'} ${
                      active ? "bg-cyan-100 text-cyan-700" : ""
                    }`}
                    onClick={() => {
                      if (collapsed) {
                        setSidebarCollapsed(false);
                      } else {
                        toggleMenu(item.label);
                      }
                    }}
                    data-testid={`menu-${item.label.toLowerCase()}`}
                  >
                    {item.lucideIcon ? (
                      <Icon className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <Icon size={16} className="flex-shrink-0" />
                    )}
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </>
                    )}
                  </Button>
                  {isExpanded && !collapsed && item.subItems && (
                    <div className="ml-4 space-y-1 border-l-2 border-slate-200 pl-2">
                      {item.subItems.map((subItem) => {
                        const SubIcon = subItem.icon;
                        return (
                          <Link key={subItem.href} href={subItem.href}>
                            <Button
                              variant={isActive(subItem.href) ? "secondary" : "ghost"}
                              className={`w-full justify-start gap-3 ${
                                isActive(subItem.href) ? "bg-cyan-50 text-cyan-700" : ""
                              }`}
                              onClick={() => forMobile && setSidebarOpen(false)}
                              data-testid={`link-${subItem.label.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              <SubIcon className="h-3.5 w-3.5" />
                              <span className="text-sm">{subItem.label}</span>
                            </Button>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            if (!item.href) return null;
            
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={active ? "secondary" : "ghost"}
                  className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start gap-3'} ${
                    active ? "bg-cyan-100 text-cyan-700" : ""
                  }`}
                  onClick={() => forMobile && setSidebarOpen(false)}
                  data-testid={`link-${item.label.toLowerCase()}`}
                >
                  {item.lucideIcon ? (
                    <Icon className="h-4 w-4" />
                  ) : (
                    <Icon size={16} />
                  )}
                  {!collapsed && item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
        <div className={`p-4 border-t border-slate-200 mt-auto space-y-2 ${collapsed ? '' : ''}`}>
          <Link href="/">
            <Button
              variant="ghost"
              className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start gap-3'} text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50`}
              onClick={() => forMobile && setSidebarOpen(false)}
              data-testid="button-visit-store"
            >
              <ExternalLink className="h-4 w-4" />
              {!collapsed && "Visit Store"}
            </Button>
          </Link>
          <Button
            variant="ghost"
            className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start gap-3'}`}
            onClick={onLogout}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && "Logout"}
          </Button>
        </div>
      </>
    );
  };

  const sidebarWidth = sidebarCollapsed ? 'w-20' : 'w-64';
  const mainMargin = sidebarCollapsed ? 'md:ml-20' : 'md:ml-64';

  return (
    <div className="min-h-screen bg-slate-50" data-testid="layout-admin">
      <aside className={`hidden md:flex md:flex-col ${sidebarWidth} bg-white border-r border-slate-200 h-screen fixed top-0 left-0 z-30 transition-all duration-300`}>
        <SidebarContent />
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">MeeyaLab Admin</h2>
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" data-testid="button-menu-toggle">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 flex flex-col">
            <SidebarContent forMobile={true} />
          </SheetContent>
        </Sheet>
      </div>

      <main className={`pt-16 md:pt-0 ${mainMargin} transition-all duration-300`}>
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
