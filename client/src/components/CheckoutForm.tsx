import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { CartItem } from "./CartDrawer";

interface CheckoutFormProps {
  cartItems: CartItem[];
  onSubmit?: (data: CheckoutData) => void;
}

export interface CheckoutData {
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  province: string;
  postalCode: string;
  courier: string;
  notes: string;
}

export default function CheckoutForm({ cartItems, onSubmit }: CheckoutFormProps) {
  const { toast } = useToast();
  const [courierError, setCourierError] = useState(false);
  const [formData, setFormData] = useState<CheckoutData>({
    fullName: "",
    phone: "",
    streetAddress: "",
    city: "",
    province: "",
    postalCode: "",
    courier: "",
    notes: "",
  });

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString("id-ID")}`;
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // Indonesian courier services with estimated shipping costs
  const couriers = [
    { value: "jne-reg", label: "JNE Regular (3-5 hari)", cost: 15000 },
    { value: "jne-yes", label: "JNE YES (1-2 hari)", cost: 25000 },
    { value: "jnt-reg", label: "J&T Regular (3-5 hari)", cost: 12000 },
    { value: "jnt-express", label: "J&T Express (2-3 hari)", cost: 20000 },
    { value: "sicepat-reg", label: "SiCepat Regular (2-4 hari)", cost: 13000 },
    { value: "sicepat-best", label: "SiCepat BEST (1-2 hari)", cost: 22000 },
    { value: "anteraja-reg", label: "AnterAja Regular (3-5 hari)", cost: 11000 },
    { value: "anteraja-next", label: "AnterAja Next Day (1 hari)", cost: 28000 },
  ];
  
  const selectedCourier = couriers.find(c => c.value === formData.courier);
  const shippingCost = selectedCourier?.cost || 0;
  const total = subtotal + shippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate courier selection
    if (!formData.courier) {
      setCourierError(true);
      toast({
        variant: "destructive",
        title: "Courier Required",
        description: "Please select a shipping courier to continue.",
      });
      return;
    }
    
    setCourierError(false);
    onSubmit?.(formData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8" data-testid="form-checkout">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
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
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="streetAddress">Street Address *</Label>
                  <Textarea
                    id="streetAddress"
                    required
                    value={formData.streetAddress}
                    onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                    placeholder="Street address, building, apartment, etc."
                    rows={2}
                    data-testid="input-street-address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City"
                      data-testid="input-city"
                    />
                  </div>

                  <div>
                    <Label htmlFor="province">Province *</Label>
                    <Input
                      id="province"
                      required
                      value={formData.province}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                      placeholder="Province"
                      data-testid="input-province"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="12345"
                    data-testid="input-postal-code"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Shipping Method</h2>
              <div>
                <Label htmlFor="courier" className={courierError ? "text-red-600" : ""}>Select Courier *</Label>
                <Select
                  value={formData.courier}
                  onValueChange={(value) => {
                    setFormData({ ...formData, courier: value });
                    setCourierError(false);
                  }}
                >
                  <SelectTrigger 
                    id="courier" 
                    data-testid="select-courier"
                    className={courierError ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Choose shipping courier" />
                  </SelectTrigger>
                  <SelectContent>
                    {couriers.map((courier) => (
                      <SelectItem
                        key={courier.value}
                        value={courier.value}
                        data-testid={`courier-${courier.value}`}
                      >
                        {courier.label} - {formatPrice(courier.cost)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {courierError && (
                  <p className="text-sm text-red-600 mt-1">Please select a shipping courier</p>
                )}
              </div>
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
              
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium" data-testid="text-subtotal">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Shipping Cost</span>
                  <span className="font-medium" data-testid="text-shipping">
                    {shippingCost > 0 ? formatPrice(shippingCost) : "-"}
                  </span>
                </div>
                
                {selectedCourier && (
                  <div className="text-xs text-slate-500">
                    via {selectedCourier.label.split(" - ")[0]}
                  </div>
                )}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="text-xl font-bold text-cyan-600" data-testid="text-total">
                    {formatPrice(total)}
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
