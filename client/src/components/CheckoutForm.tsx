import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CartItem } from "./CartDrawer";

interface CheckoutFormProps {
  cartItems: CartItem[];
  onSubmit?: (data: CheckoutData) => void;
}

export interface CheckoutData {
  fullName: string;
  phone: string;
  address: string;
  notes: string;
}

export default function CheckoutForm({ cartItems, onSubmit }: CheckoutFormProps) {
  const [formData, setFormData] = useState<CheckoutData>({
    fullName: "",
    phone: "",
    address: "",
    notes: "",
  });

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString("id-ID")}`;
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8" data-testid="form-checkout">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter your full name"
                data-testid="input-full-name"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number (WhatsApp) *</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="08xx-xxxx-xxxx"
                data-testid="input-phone"
              />
            </div>

            <div>
              <Label htmlFor="address">Delivery Address *</Label>
              <Textarea
                id="address"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter your complete delivery address"
                rows={4}
                data-testid="input-address"
              />
            </div>

            <div>
              <Label htmlFor="notes">Order Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any special instructions?"
                rows={3}
                data-testid="input-notes"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
              data-testid="button-pay-midtrans"
            >
              Pay with Midtrans
            </Button>
          </form>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-600">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold" data-testid="text-total">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
