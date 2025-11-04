import { useLocation } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, DollarSign, Users, TrendingUp, AlertTriangle, PackageX, TrendingDown } from "lucide-react";
import ShoppingBagMinimal from "@/components/icons/ShoppingBagMinimal";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();

  const stats = [
    { title: "Total Products", value: "24", icon: Package, color: "text-cyan-600", bgColor: "bg-cyan-100", lucideIcon: true },
    { title: "Total Orders", value: "156", icon: ShoppingBagMinimal, color: "text-green-600", bgColor: "bg-green-100", lucideIcon: false },
    { title: "Revenue", value: "Rp42.5M", icon: DollarSign, color: "text-yellow-600", bgColor: "bg-yellow-100", lucideIcon: true },
    { title: "Customers", value: "89", icon: Users, color: "text-blue-600", bgColor: "bg-blue-100", lucideIcon: true },
  ];

  const inventoryStats = [
    { title: "Low Stock Items", value: "3", icon: AlertTriangle, color: "text-yellow-600", bgColor: "bg-yellow-100", badge: "Needs Attention" },
    { title: "Out of Stock", value: "2", icon: PackageX, color: "text-red-600", bgColor: "bg-red-100", badge: "Critical" },
    { title: "Total Stock Value", value: "Rp125M", icon: TrendingUp, color: "text-green-600", bgColor: "bg-green-100", badge: "Good" },
  ];

  const revenueData = [
    { month: "Jul", revenue: 28000000 },
    { month: "Aug", revenue: 32000000 },
    { month: "Sep", revenue: 35000000 },
    { month: "Oct", revenue: 38000000 },
    { month: "Nov", revenue: 42500000 },
  ];

  const stockByCategory = [
    { category: "Serums", stock: 245, color: "#06B6D4" },
    { category: "Moisturizers", stock: 180, color: "#10B981" },
    { category: "Cleansers", stock: 156, color: "#F59E0B" },
    { category: "Sunscreens", stock: 120, color: "#EF4444" },
    { category: "Toners", stock: 95, color: "#8B5CF6" },
  ];

  const topProducts = [
    { name: "Hydrating Serum", sold: 85 },
    { name: "Daily Moisturizer", sold: 72 },
    { name: "Gentle Cleanser", sold: 68 },
    { name: "Vitamin C Serum", sold: 54 },
    { name: "Night Cream", sold: 48 },
  ];

  const stockDistribution = [
    { name: "In Stock", value: 19, color: "#10B981" },
    { name: "Low Stock", value: 3, color: "#F59E0B" },
    { name: "Out of Stock", value: 2, color: "#EF4444" },
  ];

  const formatCurrency = (value: number) => {
    return `Rp${(value / 1000000).toFixed(1)}M`;
  };

  return (
    <AdminLayout onLogout={() => setLocation("/admin/login")}>
      <div className="space-y-6" data-testid="admin-dashboard">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-3 py-1">
            Live Data
          </Badge>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="transition-all hover:shadow-md" data-testid={`card-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
                  <div className={`h-10 w-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    {stat.lucideIcon ? (
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    ) : (
                      <Icon className={stat.color} size={20} />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {inventoryStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="transition-all hover:shadow-md" data-testid={`card-inventory-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`h-12 w-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <Badge 
                      className={
                        stat.badge === "Critical" ? "bg-red-100 text-red-800 hover:bg-red-100" :
                        stat.badge === "Needs Attention" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                        "bg-green-100 text-green-800 hover:bg-green-100"
                      }
                    >
                      {stat.badge}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="transition-all hover:shadow-md" data-testid="card-revenue-trend">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Revenue Trend
                  </CardTitle>
                  <p className="text-sm text-slate-500 mt-1">Last 5 months</p>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  +15%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#64748b"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#64748b"
                    style={{ fontSize: '12px' }}
                    tickFormatter={formatCurrency}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#06B6D4" 
                    strokeWidth={3}
                    dot={{ fill: '#06B6D4', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md" data-testid="card-stock-by-category">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-cyan-600" />
                    Stock by Category
                  </CardTitle>
                  <p className="text-sm text-slate-500 mt-1">Current inventory levels</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stockByCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="category" 
                    stroke="#64748b"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#64748b"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar 
                    dataKey="stock" 
                    radius={[8, 8, 0, 0]}
                  >
                    {stockByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="transition-all hover:shadow-md" data-testid="card-top-products">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Top Selling Products
              </CardTitle>
              <p className="text-sm text-slate-500">This month</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#64748b" style={{ fontSize: '12px' }} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={120}
                    stroke="#64748b"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar 
                    dataKey="sold" 
                    fill="#10B981"
                    radius={[0, 8, 8, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md" data-testid="card-stock-distribution">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-cyan-600" />
                Stock Status Distribution
              </CardTitle>
              <p className="text-sm text-slate-500">Total 24 products</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stockDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stockDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
