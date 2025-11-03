import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, Check } from "lucide-react";
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
  const [openSection, setOpenSection] = useState("contact");
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>(null);
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

  const validVouchers = [
    { code: "WELCOME10", discount: 0.10, description: "10% off for new customers" },
    { code: "SAVE20K", discount: 20000, description: "Rp20.000 off" },
    { code: "FREESHIP", discount: 0, description: "Free shipping" },
  ];

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
  const baseShippingCost = selectedCourier?.cost || 0;
  
  let discount = 0;
  let shippingCost = baseShippingCost;
  
  if (appliedVoucher) {
    if (appliedVoucher.code === "FREESHIP") {
      shippingCost = 0;
    } else if (appliedVoucher.discount < 1) {
      discount = subtotal * appliedVoucher.discount;
    } else {
      discount = Math.min(appliedVoucher.discount, subtotal);
    }
  }
  
  const total = Math.max(0, subtotal + shippingCost - discount);

  const isContactComplete = formData.fullName && formData.phone;
  const isAddressComplete = formData.streetAddress && formData.city && formData.province && formData.postalCode;
  const isShippingComplete = formData.courier;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.courier) {
      setCourierError(true);
      setOpenSection("shipping");
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

  const handleApplyVoucher = () => {
    const voucher = validVouchers.find(v => v.code.toUpperCase() === voucherCode.toUpperCase());
    if (voucher) {
      setAppliedVoucher(voucher);
      toast({
        title: "Voucher Applied!",
        description: voucher.description,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Voucher",
        description: "The voucher code you entered is not valid.",
      });
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode("");
    toast({
      title: "Voucher Removed",
      description: "The voucher has been removed from your order.",
    });
  };

  const SectionHeader = ({ 
    title, 
    isComplete, 
    isOpen 
  }: { 
    title: string; 
    isComplete: boolean; 
    isOpen: boolean; 
  }) => (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
          isComplete ? 'bg-cyan-500 text-white' : 'border-2 border-slate-300 text-slate-500'
        }`}>
          {isComplete ? <Check className="h-3.5 w-3.5" /> : ''}
        </div>
        <h2 className="text-base md:text-lg font-semibold text-slate-900">{title}</h2>
      </div>
      <ChevronDown className={`h-5 w-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 pt-24 md:pt-28" data-testid="form-checkout">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 md:mb-8">Checkout</h1>
      
      <div className="grid md:grid-cols-3 gap-6 md:gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Collapsible
              open={openSection === "contact"}
              onOpenChange={(open) => setOpenSection(open ? "contact" : "")}
            >
              <Card className="border-2 border-slate-200">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                    <SectionHeader 
                      title="Contact Information" 
                      isComplete={!!isContactComplete} 
                      isOpen={openSection === "contact"} 
                    />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4 pb-6">
                    <div>
                      <Label htmlFor="fullName" className="text-sm">Full Name *</Label>
                      <Input
                        id="fullName"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Enter your full name"
                        className="mt-1.5"
                        data-testid="input-full-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm">Phone Number (WhatsApp) *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="08xx-xxxx-xxxx"
                        className="mt-1.5"
                        data-testid="input-phone"
                      />
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            <Collapsible
              open={openSection === "address"}
              onOpenChange={(open) => setOpenSection(open ? "address" : "")}
            >
              <Card className="border-2 border-slate-200">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                    <SectionHeader 
                      title="Shipping Address" 
                      isComplete={!!isAddressComplete} 
                      isOpen={openSection === "address"} 
                    />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4 pb-6">
                    <div>
                      <Label htmlFor="streetAddress" className="text-sm">Street Address *</Label>
                      <Textarea
                        id="streetAddress"
                        required
                        value={formData.streetAddress}
                        onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                        placeholder="Street address, building, apartment, etc."
                        rows={2}
                        className="mt-1.5"
                        data-testid="input-street-address"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-sm">City *</Label>
                        <Input
                          id="city"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="City"
                          className="mt-1.5"
                          data-testid="input-city"
                        />
                      </div>
                      <div>
                        <Label htmlFor="province" className="text-sm">Province *</Label>
                        <Input
                          id="province"
                          required
                          value={formData.province}
                          onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                          placeholder="Province"
                          className="mt-1.5"
                          data-testid="input-province"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="postalCode" className="text-sm">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        placeholder="12345"
                        className="mt-1.5"
                        data-testid="input-postal-code"
                      />
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            <Collapsible
              open={openSection === "shipping"}
              onOpenChange={(open) => setOpenSection(open ? "shipping" : "")}
            >
              <Card className="border-2 border-slate-200">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                    <SectionHeader 
                      title="Shipping Method" 
                      isComplete={!!isShippingComplete} 
                      isOpen={openSection === "shipping"} 
                    />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4 pb-6">
                    <div>
                      <Label htmlFor="courier" className={`text-sm ${courierError ? "text-red-600" : ""}`}>
                        Select Courier *
                      </Label>
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
                          className={`mt-1.5 ${courierError ? "border-red-500" : ""}`}
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
                              <div className="flex justify-between items-center w-full">
                                <span>{courier.label.split(" - ")[0]}</span>
                                <span className="text-xs text-slate-500 ml-2">{formatPrice(courier.cost)}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {courierError && (
                        <p className="text-xs text-red-600 mt-1.5">Please select a shipping courier</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="notes" className="text-sm">Order Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Any special instructions?"
                        rows={3}
                        className="mt-1.5"
                        data-testid="input-notes"
                      />
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium mt-6"
              data-testid="button-pay-midtrans"
            >
              Complete Order - Pay with Midtrans
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
                <Label className="text-sm font-medium mb-2 block">Promo Code</Label>
                {appliedVoucher ? (
                  <div className="flex items-center justify-between p-3 bg-cyan-50 border border-cyan-200 rounded-md">
                    <div>
                      <p className="text-sm font-medium text-cyan-900">{appliedVoucher.code}</p>
                      <p className="text-xs text-cyan-700">
                        {validVouchers.find(v => v.code === appliedVoucher.code)?.description}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveVoucher}
                      className="text-cyan-700 hover:text-cyan-900 hover:bg-cyan-100"
                      data-testid="button-remove-voucher"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                      className="text-sm"
                      data-testid="input-voucher"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleApplyVoucher}
                      disabled={!voucherCode}
                      className="whitespace-nowrap"
                      data-testid="button-apply-voucher"
                    >
                      Apply
                    </Button>
                  </div>
                )}
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
                    {baseShippingCost > 0 ? (
                      <>
                        {shippingCost === 0 && baseShippingCost > 0 ? (
                          <>
                            <span className="line-through text-slate-400 mr-2">{formatPrice(baseShippingCost)}</span>
                            <span className="text-cyan-600">FREE</span>
                          </>
                        ) : (
                          formatPrice(shippingCost)
                        )}
                      </>
                    ) : "-"}
                  </span>
                </div>
                
                {selectedCourier && (
                  <div className="text-xs text-slate-500">
                    via {selectedCourier.label.split(" - ")[0]}
                  </div>
                )}

                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Discount</span>
                    <span className="font-medium text-cyan-600" data-testid="text-discount">
                      -{formatPrice(discount)}
                    </span>
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
