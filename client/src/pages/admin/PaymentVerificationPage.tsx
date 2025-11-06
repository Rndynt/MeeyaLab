import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Eye,
  AlertCircle,
  Clock,
  Search,
  Wallet,
  Building2,
  Calendar,
  Hash,
  User,
  Download,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

interface PaymentVerification {
  id: string;
  orderCode: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  paymentMethod: "bank_transfer" | "e_wallet" | "cod";
  bankName?: string;
  transactionId?: string;
  paymentDate: string;
  proofImageUrl: string;
  status: "pending" | "verified" | "rejected";
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

type FilterType = "all" | "pending" | "verified" | "rejected";

export default function PaymentVerificationPage() {
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [proofDialogOpen, setProofDialogOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentVerification | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [zoomLevel, setZoomLevel] = useState(100);

  const [payments] = useState<PaymentVerification[]>([
    {
      id: "1",
      orderCode: "SK-2025-001",
      customerName: "Siti Nurhaliza",
      customerEmail: "siti.nurhaliza@email.com",
      amount: 450000,
      paymentMethod: "bank_transfer",
      bankName: "BCA",
      transactionId: "TRX-BCA-20250104-001",
      paymentDate: "2025-01-04T10:30:00",
      proofImageUrl: "https://placehold.co/800x600/e0f2fe/06b6d4?text=BCA+Transfer+Receipt",
      status: "pending",
      createdAt: "2025-01-04T10:35:00",
    },
    {
      id: "2",
      orderCode: "SK-2025-002",
      customerName: "Budi Santoso",
      customerEmail: "budi.santoso@email.com",
      amount: 350000,
      paymentMethod: "e_wallet",
      bankName: "GoPay",
      transactionId: "GP-20250104-8374",
      paymentDate: "2025-01-04T11:15:00",
      proofImageUrl: "https://placehold.co/800x600/dcfce7/10b981?text=GoPay+Payment+Success",
      status: "pending",
      createdAt: "2025-01-04T11:20:00",
    },
    {
      id: "3",
      orderCode: "SK-2025-003",
      customerName: "Dewi Lestari",
      customerEmail: "dewi.lestari@email.com",
      amount: 620000,
      paymentMethod: "bank_transfer",
      bankName: "Mandiri",
      transactionId: "MDR-20250104-5621",
      paymentDate: "2025-01-04T09:45:00",
      proofImageUrl: "https://placehold.co/800x600/e0f2fe/06b6d4?text=Mandiri+Transfer+Receipt",
      status: "verified",
      verifiedBy: "Admin",
      verifiedAt: "2025-01-04T10:00:00",
      createdAt: "2025-01-04T09:50:00",
    },
    {
      id: "4",
      orderCode: "SK-2025-004",
      customerName: "Ahmad Hidayat",
      customerEmail: "ahmad.hidayat@email.com",
      amount: 280000,
      paymentMethod: "e_wallet",
      bankName: "OVO",
      transactionId: "OVO-20250104-1247",
      paymentDate: "2025-01-04T12:30:00",
      proofImageUrl: "https://placehold.co/800x600/dcfce7/10b981?text=OVO+Payment+Success",
      status: "pending",
      createdAt: "2025-01-04T12:35:00",
    },
    {
      id: "5",
      orderCode: "SK-2025-005",
      customerName: "Rina Wijaya",
      customerEmail: "rina.wijaya@email.com",
      amount: 525000,
      paymentMethod: "bank_transfer",
      bankName: "BNI",
      transactionId: "BNI-20250104-9823",
      paymentDate: "2025-01-04T08:20:00",
      proofImageUrl: "https://placehold.co/800x600/fee2e2/ef4444?text=Invalid+Receipt",
      status: "rejected",
      rejectionReason: "Nominal tidak sesuai",
      createdAt: "2025-01-04T08:25:00",
    },
    {
      id: "6",
      orderCode: "SK-2025-006",
      customerName: "Fajar Ramadhan",
      customerEmail: "fajar.ramadhan@email.com",
      amount: 720000,
      paymentMethod: "bank_transfer",
      bankName: "BCA",
      transactionId: "TRX-BCA-20250104-002",
      paymentDate: "2025-01-04T13:10:00",
      proofImageUrl: "https://placehold.co/800x600/e0f2fe/06b6d4?text=BCA+Transfer+Receipt",
      status: "verified",
      verifiedBy: "Admin",
      verifiedAt: "2025-01-04T13:25:00",
      createdAt: "2025-01-04T13:15:00",
    },
    {
      id: "7",
      orderCode: "SK-2025-007",
      customerName: "Linda Kusuma",
      customerEmail: "linda.kusuma@email.com",
      amount: 390000,
      paymentMethod: "e_wallet",
      bankName: "GoPay",
      transactionId: "GP-20250104-2891",
      paymentDate: "2025-01-04T14:40:00",
      proofImageUrl: "https://placehold.co/800x600/dcfce7/10b981?text=GoPay+Payment+Success",
      status: "pending",
      createdAt: "2025-01-04T14:45:00",
    },
    {
      id: "8",
      orderCode: "SK-2025-008",
      customerName: "Rudi Hartono",
      customerEmail: "rudi.hartono@email.com",
      amount: 480000,
      paymentMethod: "bank_transfer",
      bankName: "Mandiri",
      transactionId: "MDR-20250104-7456",
      paymentDate: "2025-01-04T15:20:00",
      proofImageUrl: "https://placehold.co/800x600/e0f2fe/06b6d4?text=Mandiri+Transfer+Receipt",
      status: "pending",
      createdAt: "2025-01-04T15:25:00",
    },
    {
      id: "9",
      orderCode: "SK-2025-009",
      customerName: "Maya Sari",
      customerEmail: "maya.sari@email.com",
      amount: 315000,
      paymentMethod: "e_wallet",
      bankName: "OVO",
      transactionId: "OVO-20250104-5632",
      paymentDate: "2025-01-04T16:05:00",
      proofImageUrl: "https://placehold.co/800x600/dcfce7/10b981?text=OVO+Payment+Success",
      status: "verified",
      verifiedBy: "Admin",
      verifiedAt: "2025-01-04T16:20:00",
      createdAt: "2025-01-04T16:10:00",
    },
    {
      id: "10",
      orderCode: "SK-2025-010",
      customerName: "Andi Prasetyo",
      customerEmail: "andi.prasetyo@email.com",
      amount: 670000,
      paymentMethod: "bank_transfer",
      bankName: "BCA",
      transactionId: "TRX-BCA-20250104-003",
      paymentDate: "2025-01-04T16:50:00",
      proofImageUrl: "https://placehold.co/800x600/e0f2fe/06b6d4?text=BCA+Transfer+Receipt",
      status: "pending",
      createdAt: "2025-01-04T16:55:00",
    },
  ]);

  const stats = useMemo(() => {
    const pending = payments.filter((p) => p.status === "pending").length;
    const verifiedToday = payments.filter((p) => p.status === "verified").length;
    const rejectedToday = payments.filter((p) => p.status === "rejected").length;
    return { pending, verifiedToday, rejectedToday };
  }, [payments]);

  const filteredPayments = useMemo(() => {
    let filtered = payments;

    if (filter !== "all") {
      filtered = filtered.filter((p) => p.status === filter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.customerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [payments, filter, searchQuery]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentMethodBadge = (method: string) => {
    switch (method) {
      case "bank_transfer":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors" data-testid="badge-method-bank">
            <Building2 className="w-3 h-3 mr-1" />
            Bank Transfer
          </Badge>
        );
      case "e_wallet":
        return (
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors" data-testid="badge-method-ewallet">
            <Wallet className="w-3 h-3 mr-1" />
            E-wallet
          </Badge>
        );
      case "cod":
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors" data-testid="badge-method-cod">
            <CreditCard className="w-3 h-3 mr-1" />
            COD
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors" data-testid="badge-status-pending">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200 transition-colors" data-testid="badge-status-verified">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200 transition-colors" data-testid="badge-status-rejected">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
    }
  };

  const handleViewProof = (payment: PaymentVerification) => {
    console.log("View proof for payment:", payment.id, payment.orderCode);
    setSelectedPayment(payment);
    setZoomLevel(100);
    setProofDialogOpen(true);
  };

  const handleVerify = (payment: PaymentVerification) => {
    console.log("Verify payment:", payment.id, payment.orderCode, {
      customerName: payment.customerName,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      bankName: payment.bankName,
      transactionId: payment.transactionId,
    });
    setProofDialogOpen(false);
  };

  const handleOpenRejectDialog = (payment: PaymentVerification) => {
    console.log("Open reject dialog for payment:", payment.id, payment.orderCode);
    setSelectedPayment(payment);
    setRejectionReason("");
    setCustomReason("");
    setProofDialogOpen(false);
    setRejectionDialogOpen(true);
  };

  const handleConfirmReject = () => {
    if (!selectedPayment) return;

    const finalReason = rejectionReason === "Lainnya" ? customReason : rejectionReason;
    console.log("Reject payment:", selectedPayment.id, selectedPayment.orderCode, {
      reason: finalReason,
      customerName: selectedPayment.customerName,
      amount: selectedPayment.amount,
    });
    setRejectionDialogOpen(false);
    setSelectedPayment(null);
  };

  const handleFilterChange = (newFilter: FilterType) => {
    console.log("Filter changed:", newFilter);
    setFilter(newFilter);
  };

  const handleSearchChange = (query: string) => {
    console.log("Search query:", query);
    setSearchQuery(query);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 25, 50));
  };

  return (
    <AdminLayout onLogout={() => setLocation("/admin/login")}>
      <div className="space-y-6" data-testid="page-payment-verification">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payment Verification</h1>
          <p className="text-slate-600 mt-2">
            Verify customer payment proofs and manage payment status
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="transition-all hover:shadow-md" data-testid="card-stats-pending">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Pending Verifications
              </CardTitle>
              <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-pending-count">
                {stats.pending}
              </div>
              <p className="text-xs text-slate-500 mt-1">Awaiting review</p>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md" data-testid="card-stats-verified">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Verified Today
              </CardTitle>
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-verified-count">
                {stats.verifiedToday}
              </div>
              <p className="text-xs text-slate-500 mt-1">Successfully verified</p>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md" data-testid="card-stats-rejected">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Rejected Today
              </CardTitle>
              <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-rejected-count">
                {stats.rejectedToday}
              </div>
              <p className="text-xs text-slate-500 mt-1">Payment issues found</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => handleFilterChange("all")}
              data-testid="button-filter-all"
            >
              All Payments
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              onClick={() => handleFilterChange("pending")}
              data-testid="button-filter-pending"
            >
              <Clock className="w-4 h-4 mr-2" />
              Pending
            </Button>
            <Button
              variant={filter === "verified" ? "default" : "outline"}
              onClick={() => handleFilterChange("verified")}
              data-testid="button-filter-verified"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Verified
            </Button>
            <Button
              variant={filter === "rejected" ? "default" : "outline"}
              onClick={() => handleFilterChange("rejected")}
              data-testid="button-filter-rejected"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Rejected
            </Button>
          </div>

          <div className="sm:ml-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by order code or customer..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 w-full sm:w-80"
              data-testid="input-search"
            />
          </div>
        </div>

        {filteredPayments.length === 0 ? (
          <Card className="p-8 md:p-12 text-center" data-testid="empty-state">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 md:h-20 md:w-20 bg-slate-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 md:h-10 md:w-10 text-slate-400" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-semibold text-slate-700">No payments found</h3>
                <p className="text-sm md:text-base text-slate-500 mt-1">
                  {searchQuery
                    ? "Try adjusting your search criteria"
                    : "No payments match the selected filter"}
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {filteredPayments.map((payment) => (
              <Card
                key={payment.id}
                className="hover:shadow-md transition-all"
                data-testid={`card-payment-${payment.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0 flex-1">
                      <CardTitle className="text-base md:text-lg font-semibold truncate" data-testid={`text-order-code-${payment.id}`}>
                        {payment.orderCode}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-slate-600">
                        <User className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                        <span className="truncate" data-testid={`text-customer-name-${payment.id}`}>{payment.customerName}</span>
                      </div>
                    </div>
                    {getStatusBadge(payment.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Amount</p>
                      <p className="text-lg md:text-xl font-bold" data-testid={`text-amount-${payment.id}`}>
                        {formatCurrency(payment.amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Payment Method</p>
                      {getPaymentMethodBadge(payment.paymentMethod)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-sm">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Bank/Provider</p>
                      <p className="font-medium text-sm" data-testid={`text-bank-${payment.id}`}>
                        {payment.bankName || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Transaction ID</p>
                      <p className="font-mono text-xs text-slate-700 truncate" data-testid={`text-transaction-id-${payment.id}`}>
                        {payment.transactionId || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs md:text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                      <span data-testid={`text-payment-date-${payment.id}`}>{formatDate(payment.paymentDate)}</span>
                    </div>
                  </div>

                  {payment.status === "rejected" && payment.rejectionReason && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-slate-700 mb-1">Rejection Reason:</p>
                      <p className="text-sm text-slate-600" data-testid={`text-rejection-reason-${payment.id}`}>
                        {payment.rejectionReason}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button
                      variant="outline"
                      className="w-full sm:flex-1"
                      onClick={() => handleViewProof(payment)}
                      data-testid={`button-view-proof-${payment.id}`}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Proof
                    </Button>
                    {payment.status === "pending" && (
                      <>
                        <Button
                          className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                          onClick={() => handleVerify(payment)}
                          data-testid={`button-verify-${payment.id}`}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Verify
                        </Button>
                        <Button
                          variant="destructive"
                          className="w-full sm:w-auto"
                          onClick={() => handleOpenRejectDialog(payment)}
                          data-testid={`button-reject-${payment.id}`}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={proofDialogOpen} onOpenChange={setProofDialogOpen}>
          <DialogContent className="max-w-4xl" data-testid="dialog-payment-proof">
            <DialogHeader>
              <DialogTitle>Payment Proof - {selectedPayment?.orderCode}</DialogTitle>
            </DialogHeader>
            <DialogBody className="space-y-4">
              {selectedPayment && (
                <>
                  <div className="bg-slate-100 rounded-lg p-4 relative">
                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleZoomOut}
                        disabled={zoomLevel <= 50}
                        data-testid="button-zoom-out"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleZoomIn}
                        disabled={zoomLevel >= 200}
                        data-testid="button-zoom-in"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="overflow-auto max-h-96">
                      <img
                        src={selectedPayment.proofImageUrl}
                        alt="Payment Proof"
                        className="w-full rounded transition-transform"
                        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
                        data-testid="img-payment-proof"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-semibold">
                          Payment Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Payment Method:</span>
                          <span className="font-medium" data-testid="text-proof-method">
                            {selectedPayment.paymentMethod === "bank_transfer" ? "Bank Transfer" : "E-wallet"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Bank/Provider:</span>
                          <span className="font-medium" data-testid="text-proof-bank">
                            {selectedPayment.bankName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Amount:</span>
                          <span className="font-bold text-lg" data-testid="text-proof-amount">
                            {formatCurrency(selectedPayment.amount)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Transaction ID:</span>
                          <span className="font-mono text-xs" data-testid="text-proof-transaction-id">
                            {selectedPayment.transactionId}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Payment Date:</span>
                          <span className="font-medium" data-testid="text-proof-date">
                            {formatDate(selectedPayment.paymentDate)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-semibold">
                          Order Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Order Code:</span>
                          <span className="font-bold" data-testid="text-proof-order-code">
                            {selectedPayment.orderCode}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Customer:</span>
                          <span className="font-medium" data-testid="text-proof-customer">
                            {selectedPayment.customerName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Email:</span>
                          <span className="text-xs" data-testid="text-proof-email">
                            {selectedPayment.customerEmail}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span className="text-slate-600 font-semibold">Total:</span>
                          <span className="font-bold text-lg" data-testid="text-proof-total">
                            {formatCurrency(selectedPayment.amount)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </DialogBody>
            <DialogFooter>
              <Button
                variant="outline"
                disabled
                data-testid="button-download-proof"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                onClick={() => setProofDialogOpen(false)}
                data-testid="button-close-proof"
              >
                Close
              </Button>
              {selectedPayment?.status === "pending" && (
                <>
                  <Button
                    variant="destructive"
                    onClick={() => selectedPayment && handleOpenRejectDialog(selectedPayment)}
                    data-testid="button-reject-from-dialog"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => selectedPayment && handleVerify(selectedPayment)}
                    data-testid="button-verify-from-dialog"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
          <DialogContent data-testid="dialog-payment-rejection">
            <DialogHeader>
              <DialogTitle>Reject Payment</DialogTitle>
            </DialogHeader>
            <DialogBody className="space-y-4">
              {selectedPayment && (
                <>
                  <Card className="bg-slate-50">
                    <CardContent className="pt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Order Code:</span>
                        <span className="font-bold" data-testid="text-reject-order-code">
                          {selectedPayment.orderCode}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Customer:</span>
                        <span className="font-medium" data-testid="text-reject-customer">
                          {selectedPayment.customerName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Amount:</span>
                        <span className="font-bold text-lg" data-testid="text-reject-amount">
                          {formatCurrency(selectedPayment.amount)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Rejection Reason <span className="text-red-500">*</span>
                    </label>
                    <Select value={rejectionReason} onValueChange={setRejectionReason}>
                      <SelectTrigger data-testid="select-rejection-reason">
                        <SelectValue placeholder="Select a reason..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Proof tidak jelas / blur">
                          Proof tidak jelas / blur
                        </SelectItem>
                        <SelectItem value="Nominal tidak sesuai">
                          Nominal tidak sesuai
                        </SelectItem>
                        <SelectItem value="Rekening tujuan salah">
                          Rekening tujuan salah
                        </SelectItem>
                        <SelectItem value="Bukti transfer palsu">
                          Bukti transfer palsu
                        </SelectItem>
                        <SelectItem value="Tanggal transfer tidak valid">
                          Tanggal transfer tidak valid
                        </SelectItem>
                        <SelectItem value="Lainnya">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {rejectionReason === "Lainnya" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Custom Reason <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        placeholder="Please specify the reason for rejection..."
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        rows={3}
                        data-testid="textarea-custom-reason"
                      />
                    </div>
                  )}

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-semibold">Warning</p>
                        <p className="mt-1">
                          This action will notify the customer via email. Make sure the rejection
                          reason is clear and accurate.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </DialogBody>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setRejectionDialogOpen(false)}
                data-testid="button-cancel-reject"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmReject}
                disabled={!rejectionReason || (rejectionReason === "Lainnya" && !customReason.trim())}
                data-testid="button-confirm-reject"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Confirm Reject
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
