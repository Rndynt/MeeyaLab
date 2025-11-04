import { useLocation } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, DollarSign, Users } from "lucide-react";
import ShoppingBagMinimal from "@/components/icons/ShoppingBagMinimal";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();

  const stats = [
    { title: "Total Products", value: "24", icon: Package, color: "text-cyan-600", lucideIcon: true },
    { title: "Total Orders", value: "156", icon: ShoppingBagMinimal, color: "text-green-600", lucideIcon: false },
    { title: "Revenue", value: "Rp42.5M", icon: DollarSign, color: "text-yellow-600", lucideIcon: true },
    { title: "Customers", value: "89", icon: Users, color: "text-blue-600", lucideIcon: true },
  ];

  return (
    <AdminLayout onLogout={() => setLocation("/admin/login")}>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                {stat.lucideIcon ? (
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                ) : (
                  <Icon className={stat.color} size={16} />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">Recent orders and activities will appear here.</p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
