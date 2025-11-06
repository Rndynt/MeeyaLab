import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  CreditCard,
  Building2,
  Wallet,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface PaymentMethod {
  id: string;
  name: string;
  type: "bank_transfer" | "e_wallet" | "cod";
  accountName?: string;
  accountNumber?: string;
  instructions?: string;
  icon?: string;
  isActive: boolean;
  displayOrder: number;
}

export default function PaymentMethodsSettingsPage() {
  const [, setLocation] = useLocation();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      name: "BCA",
      type: "bank_transfer",
      accountName: "PT MeeyaLab Indonesia",
      accountNumber: "1234567890",
      instructions: "Transfer ke rekening BCA dan upload bukti transfer",
      isActive: true,
      displayOrder: 1,
    },
    {
      id: "2",
      name: "Mandiri",
      type: "bank_transfer",
      accountName: "PT MeeyaLab Indonesia",
      accountNumber: "0987654321",
      instructions: "Transfer ke rekening Mandiri dan upload bukti transfer",
      isActive: true,
      displayOrder: 2,
    },
    {
      id: "3",
      name: "GoPay",
      type: "e_wallet",
      accountNumber: "081234567890",
      instructions: "Transfer ke nomor GoPay dan screenshot bukti pembayaran",
      isActive: true,
      displayOrder: 3,
    },
    {
      id: "4",
      name: "OVO",
      type: "e_wallet",
      accountNumber: "081234567890",
      instructions: "Transfer ke nomor OVO dan screenshot bukti pembayaran",
      isActive: true,
      displayOrder: 4,
    },
    {
      id: "5",
      name: "Cash on Delivery (COD)",
      type: "cod",
      instructions: "Bayar saat barang diterima",
      isActive: false,
      displayOrder: 5,
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    type: "bank_transfer" as "bank_transfer" | "e_wallet" | "cod",
    accountName: "",
    accountNumber: "",
    instructions: "",
    isActive: true,
  });

  const stats = {
    total: paymentMethods.length,
    active: paymentMethods.filter((m) => m.isActive).length,
    inactive: paymentMethods.filter((m) => !m.isActive).length,
  };

  const handleAdd = () => {
    setFormData({
      name: "",
      type: "bank_transfer",
      accountName: "",
      accountNumber: "",
      instructions: "",
      isActive: true,
    });
    setAddDialogOpen(true);
  };

  const handleEdit = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setFormData({
      name: method.name,
      type: method.type,
      accountName: method.accountName || "",
      accountNumber: method.accountNumber || "",
      instructions: method.instructions || "",
      isActive: method.isActive,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this payment method?")) {
      console.log("Delete payment method:", id);
    }
  };

  const handleToggleActive = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m))
    );
  };

  const handleSaveNew = () => {
    console.log("Add new payment method:", formData);
    setAddDialogOpen(false);
  };

  const handleSaveEdit = () => {
    console.log("Update payment method:", selectedMethod?.id, formData);
    setEditDialogOpen(false);
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case "bank_transfer":
        return <Building2 className="h-5 w-5 text-blue-600" />;
      case "e_wallet":
        return <Wallet className="h-5 w-5 text-purple-600" />;
      case "cod":
        return <CreditCard className="h-5 w-5 text-gray-600" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "bank_transfer":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
            Bank Transfer
          </Badge>
        );
      case "e_wallet":
        return (
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
            E-wallet
          </Badge>
        );
      case "cod":
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">
            Cash on Delivery
          </Badge>
        );
    }
  };

  return (
    <AdminLayout onLogout={() => setLocation("/admin/login")}>
      <div className="space-y-6" data-testid="page-payment-methods">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Payment Methods</h1>
            <p className="text-slate-600 mt-2">
              Manage available payment methods for customers
            </p>
          </div>
          <Button onClick={handleAdd} data-testid="button-add-method">
            <Plus className="w-4 h-4 mr-2" />
            Add Method
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="transition-all hover:shadow-md" data-testid="card-stats-total">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Methods
              </CardTitle>
              <div className="h-10 w-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-cyan-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-total-count">
                {stats.total}
              </div>
              <p className="text-xs text-slate-500 mt-1">Payment options</p>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md" data-testid="card-stats-active">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Active Methods
              </CardTitle>
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-active-count">
                {stats.active}
              </div>
              <p className="text-xs text-slate-500 mt-1">Currently available</p>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md" data-testid="card-stats-inactive">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Inactive Methods
              </CardTitle>
              <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-inactive-count">
                {stats.inactive}
              </div>
              <p className="text-xs text-slate-500 mt-1">Disabled options</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paymentMethods.map((method) => (
            <Card
              key={method.id}
              className="hover:shadow-md transition-all"
              data-testid={`card-method-${method.id}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center">
                      {getMethodIcon(method.type)}
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <CardTitle className="text-sm font-semibold truncate" data-testid={`text-method-name-${method.id}`}>
                        {method.name}
                      </CardTitle>
                      {getTypeBadge(method.type)}
                    </div>
                  </div>
                  <Badge
                    className={
                      method.isActive
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }
                    data-testid={`badge-status-${method.id}`}
                  >
                    {method.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  {method.accountName && (
                    <div>
                      <p className="text-xs text-slate-500">Account Name</p>
                      <p className="font-medium" data-testid={`text-account-name-${method.id}`}>
                        {method.accountName}
                      </p>
                    </div>
                  )}
                  {method.accountNumber && (
                    <div>
                      <p className="text-xs text-slate-500">Account Number</p>
                      <p className="font-mono text-sm" data-testid={`text-account-number-${method.id}`}>
                        {method.accountNumber}
                      </p>
                    </div>
                  )}
                  {method.instructions && (
                    <div>
                      <p className="text-xs text-slate-500">Instructions</p>
                      <p className="text-sm text-slate-600" data-testid={`text-instructions-${method.id}`}>
                        {method.instructions}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleEdit(method)}
                    data-testid={`button-edit-${method.id}`}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleToggleActive(method.id)}
                    data-testid={`button-toggle-${method.id}`}
                  >
                    {method.isActive ? "Disable" : "Enable"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDelete(method.id)}
                    data-testid={`button-delete-${method.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent data-testid="dialog-add-method">
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
            </DialogHeader>
            <DialogBody className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Method Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., BCA, GoPay, COD"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  data-testid="input-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "bank_transfer" | "e_wallet" | "cod") =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger data-testid="select-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="e_wallet">E-wallet</SelectItem>
                    <SelectItem value="cod">Cash on Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type === "bank_transfer" && (
                <div className="space-y-2">
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    id="accountName"
                    placeholder="e.g., PT MeeyaLab Indonesia"
                    value={formData.accountName}
                    onChange={(e) =>
                      setFormData({ ...formData, accountName: e.target.value })
                    }
                    data-testid="input-account-name"
                  />
                </div>
              )}

              {(formData.type === "bank_transfer" || formData.type === "e_wallet") && (
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">
                    {formData.type === "bank_transfer" ? "Account Number" : "Phone Number"}
                  </Label>
                  <Input
                    id="accountNumber"
                    placeholder={
                      formData.type === "bank_transfer"
                        ? "e.g., 1234567890"
                        : "e.g., 081234567890"
                    }
                    value={formData.accountNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, accountNumber: e.target.value })
                    }
                    data-testid="input-account-number"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="instructions">Payment Instructions</Label>
                <Textarea
                  id="instructions"
                  placeholder="Enter payment instructions for customers..."
                  value={formData.instructions}
                  onChange={(e) =>
                    setFormData({ ...formData, instructions: e.target.value })
                  }
                  rows={3}
                  data-testid="textarea-instructions"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Active</Label>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                  data-testid="switch-active"
                />
              </div>
            </DialogBody>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setAddDialogOpen(false)}
                data-testid="button-cancel-add"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveNew}
                disabled={!formData.name || !formData.type}
                data-testid="button-save-add"
              >
                Add Method
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent data-testid="dialog-edit-method">
            <DialogHeader>
              <DialogTitle>Edit Payment Method</DialogTitle>
            </DialogHeader>
            <DialogBody className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Method Name *</Label>
                <Input
                  id="edit-name"
                  placeholder="e.g., BCA, GoPay, COD"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  data-testid="input-edit-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "bank_transfer" | "e_wallet" | "cod") =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger data-testid="select-edit-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="e_wallet">E-wallet</SelectItem>
                    <SelectItem value="cod">Cash on Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type === "bank_transfer" && (
                <div className="space-y-2">
                  <Label htmlFor="edit-accountName">Account Name</Label>
                  <Input
                    id="edit-accountName"
                    placeholder="e.g., PT MeeyaLab Indonesia"
                    value={formData.accountName}
                    onChange={(e) =>
                      setFormData({ ...formData, accountName: e.target.value })
                    }
                    data-testid="input-edit-account-name"
                  />
                </div>
              )}

              {(formData.type === "bank_transfer" || formData.type === "e_wallet") && (
                <div className="space-y-2">
                  <Label htmlFor="edit-accountNumber">
                    {formData.type === "bank_transfer" ? "Account Number" : "Phone Number"}
                  </Label>
                  <Input
                    id="edit-accountNumber"
                    placeholder={
                      formData.type === "bank_transfer"
                        ? "e.g., 1234567890"
                        : "e.g., 081234567890"
                    }
                    value={formData.accountNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, accountNumber: e.target.value })
                    }
                    data-testid="input-edit-account-number"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="edit-instructions">Payment Instructions</Label>
                <Textarea
                  id="edit-instructions"
                  placeholder="Enter payment instructions for customers..."
                  value={formData.instructions}
                  onChange={(e) =>
                    setFormData({ ...formData, instructions: e.target.value })
                  }
                  rows={3}
                  data-testid="textarea-edit-instructions"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="edit-isActive">Active</Label>
                <Switch
                  id="edit-isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                  data-testid="switch-edit-active"
                />
              </div>
            </DialogBody>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                data-testid="button-cancel-edit"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={!formData.name || !formData.type}
                data-testid="button-save-edit"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
