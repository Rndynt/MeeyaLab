import { useState } from "react";
import { useLocation } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  TrendingUp,
  Clock,
  Download,
  CheckCircle,
  Building2,
  Wallet,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type DateRangeType = "daily" | "weekly" | "monthly";

export default function PaymentReconciliationPage() {
  const [, setLocation] = useLocation();
  const [dateRange, setDateRange] = useState<DateRangeType>("daily");

  const stats = {
    totalPayments: 42500000,
    verifiedCount: 15,
    totalCount: 18,
    pendingValue: 1250000,
  };

  const verificationRate = ((stats.verifiedCount / stats.totalCount) * 100).toFixed(1);

  const paymentVolumeData = [
    { date: "4 Jan", amount: 8500000 },
    { date: "5 Jan", amount: 9200000 },
    { date: "6 Jan", amount: 7800000 },
    { date: "7 Jan", amount: 11000000 },
    { date: "8 Jan", amount: 6000000 },
  ];

  const paymentMethodsData = [
    { name: "Bank Transfer", value: 65, color: "#06B6D4" },
    { name: "E-wallet", value: 30, color: "#8B5CF6" },
    { name: "COD", value: 5, color: "#64748B" },
  ];

  const verificationStatusData = [
    { status: "Verified", count: 15, color: "#10B981" },
    { status: "Pending", count: 3, color: "#F59E0B" },
    { status: "Rejected", count: 0, color: "#EF4444" },
  ];

  const paymentBreakdown = [
    {
      method: "BCA Transfer",
      count: 8,
      amount: 18500000,
      percentage: 43.5,
      verified: 7,
    },
    {
      method: "Mandiri Transfer",
      count: 5,
      amount: 12000000,
      percentage: 28.2,
      verified: 4,
    },
    {
      method: "GoPay",
      count: 3,
      amount: 8500000,
      percentage: 20.0,
      verified: 3,
    },
    {
      method: "OVO",
      count: 2,
      amount: 3500000,
      percentage: 8.3,
      verified: 1,
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatCurrencyCompact = (value: number) => {
    if (value >= 1000000) {
      return `Rp${(value / 1000000).toFixed(1)}M`;
    }
    return formatCurrency(value);
  };

  return (
    <AdminLayout onLogout={() => setLocation("/admin/login")}>
      <div className="space-y-6" data-testid="page-payment-reconciliation">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Payment Reconciliation</h1>
            <p className="text-slate-600 mt-2">
              Analyze payment data and generate reconciliation reports
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" disabled data-testid="button-export-pdf">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" disabled data-testid="button-export-excel">
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={dateRange === "daily" ? "default" : "outline"}
            onClick={() => setDateRange("daily")}
            data-testid="button-range-daily"
          >
            Daily
          </Button>
          <Button
            variant={dateRange === "weekly" ? "default" : "outline"}
            onClick={() => setDateRange("weekly")}
            data-testid="button-range-weekly"
          >
            Weekly
          </Button>
          <Button
            variant={dateRange === "monthly" ? "default" : "outline"}
            onClick={() => setDateRange("monthly")}
            data-testid="button-range-monthly"
          >
            Monthly
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="transition-all hover:shadow-md" data-testid="card-stats-total">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Payments Received
              </CardTitle>
              <div className="h-10 w-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-cyan-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-total-amount">
                {formatCurrencyCompact(stats.totalPayments)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {stats.totalCount} transactions
              </p>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md" data-testid="card-stats-verified">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Verification Rate
              </CardTitle>
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-verification-rate">
                {verificationRate}%
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {stats.verifiedCount} of {stats.totalCount} verified
              </p>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md" data-testid="card-stats-pending">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Pending Value
              </CardTitle>
              <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-pending-value">
                {formatCurrencyCompact(stats.pendingValue)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {stats.totalCount - stats.verifiedCount} pending
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card data-testid="card-payment-volume">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Payment Volume Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={paymentVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    tickLine={{ stroke: "#E2E8F0" }}
                  />
                  <YAxis
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    tickLine={{ stroke: "#E2E8F0" }}
                    tickFormatter={formatCurrencyCompact}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), "Amount"]}
                    contentStyle={{
                      backgroundColor: "#FFF",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#06B6D4"
                    strokeWidth={2}
                    name="Daily Amount"
                    dot={{ fill: "#06B6D4", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card data-testid="card-payment-methods">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Payment Methods Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentMethodsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentMethodsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, "Percentage"]}
                    contentStyle={{
                      backgroundColor: "#FFF",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card data-testid="card-verification-status">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Verification Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={verificationStatusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="status"
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    tickLine={{ stroke: "#E2E8F0" }}
                  />
                  <YAxis
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    tickLine={{ stroke: "#E2E8F0" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFF",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="count" name="Count" radius={[8, 8, 0, 0]}>
                    {verificationStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card data-testid="card-payment-breakdown">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Payment Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">%</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentBreakdown.map((item, index) => (
                    <TableRow key={index} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {item.method.includes("Transfer") ? (
                            <Building2 className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Wallet className="w-4 h-4 text-purple-600" />
                          )}
                          <span data-testid={`text-method-name-${index}`}>{item.method}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right" data-testid={`text-count-${index}`}>
                        <Badge
                          variant="outline"
                          className="bg-slate-50 text-slate-700 border-slate-200"
                        >
                          {item.count}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium" data-testid={`text-amount-${index}`}>
                        {formatCurrencyCompact(item.amount)}
                      </TableCell>
                      <TableCell className="text-right text-slate-600" data-testid={`text-percentage-${index}`}>
                        {item.percentage.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card data-testid="card-summary">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-600 mb-1">Total Transactions</p>
                <p className="text-2xl font-bold" data-testid="text-summary-transactions">
                  {stats.totalCount}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-600 mb-1">Verified</p>
                <p className="text-2xl font-bold text-green-600" data-testid="text-summary-verified">
                  {stats.verifiedCount}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-600 mb-1">Pending</p>
                <p className="text-2xl font-bold text-yellow-600" data-testid="text-summary-pending">
                  {stats.totalCount - stats.verifiedCount}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-600 mb-1">Verification Rate</p>
                <p className="text-2xl font-bold text-cyan-600" data-testid="text-summary-rate">
                  {verificationRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
