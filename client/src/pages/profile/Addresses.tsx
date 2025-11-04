import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import ProfileLayout from "@/components/ProfileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Plus, Trash2, Edit2, Star, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  isPrimary: boolean;
}

const addressSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(10, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(5, "Postal code must be at least 5 digits"),
});

type AddressFormData = z.infer<typeof addressSchema>;

const mockAddresses: Address[] = [
  {
    id: "1",
    name: "John Doe",
    phone: "+62 812-3456-7890",
    address: "Jl. Sudirman No. 123, Blok A",
    city: "Jakarta Selatan",
    postalCode: "12190",
    isPrimary: true,
  },
  {
    id: "2",
    name: "John Doe",
    phone: "+62 812-3456-7890",
    address: "Jl. Gatot Subroto Kav. 56",
    city: "Jakarta Pusat",
    postalCode: "10260",
    isPrimary: false,
  },
];

export default function Addresses() {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location]);

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
    },
  });

  const handleAddNew = () => {
    setEditingAddress(null);
    form.reset({
      name: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
    });
    setDialogOpen(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    form.reset({
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      postalCode: address.postalCode,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
    toast({
      title: "Address deleted",
      description: "The address has been removed successfully.",
    });
  };

  const handleSetPrimary = (id: string) => {
    setAddresses(addresses.map(a => ({
      ...a,
      isPrimary: a.id === id,
    })));
    toast({
      title: "Primary address updated",
      description: "This address is now set as your primary address.",
    });
  };

  const onSubmit = (data: AddressFormData) => {
    if (editingAddress) {
      setAddresses(addresses.map(a => 
        a.id === editingAddress.id 
          ? { ...a, ...data }
          : a
      ));
      toast({
        title: "Address updated",
        description: "Your address has been updated successfully.",
      });
    } else {
      const newAddress: Address = {
        id: Math.random().toString(),
        ...data,
        isPrimary: addresses.length === 0,
      };
      setAddresses([...addresses, newAddress]);
      toast({
        title: "Address added",
        description: "Your new address has been added successfully.",
      });
    }
    setDialogOpen(false);
  };

  return (
    <ProfileLayout>
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <button
          onClick={() => setLocation("/profile")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          data-testid="button-back-to-profile"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to Profile</span>
        </button>

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2" data-testid="text-page-title">
            Shipping Addresses
          </h1>
          <p className="text-slate-600">
            Manage your delivery addresses
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleAddNew}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white"
            data-testid="button-add-address"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Address
          </Button>

          {addresses.map((address) => (
            <Card 
              key={address.id} 
              className={`border ${address.isPrimary ? 'border-slate-900 shadow-md' : 'border-slate-200/60'} hover:shadow-sm transition-shadow`}
              data-testid={`card-address-${address.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-slate-700" />
                    <h3 className="font-semibold text-slate-900" data-testid={`text-address-name-${address.id}`}>
                      {address.name}
                    </h3>
                    {address.isPrimary && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900 text-white text-xs font-medium">
                        <Star className="h-3 w-3" />
                        Primary
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1 mb-4 text-sm text-slate-700">
                  <p data-testid={`text-address-phone-${address.id}`}>{address.phone}</p>
                  <p data-testid={`text-address-street-${address.id}`}>{address.address}</p>
                  <p data-testid={`text-address-city-${address.id}`}>{address.city}, {address.postalCode}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(address)}
                    className="border-slate-300 hover:bg-slate-50"
                    data-testid={`button-edit-${address.id}`}
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  
                  {!address.isPrimary && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetPrimary(address.id)}
                      className="border-slate-300 hover:bg-slate-50"
                      data-testid={`button-set-primary-${address.id}`}
                    >
                      <Star className="h-4 w-4 mr-1" />
                      Set as Primary
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(address.id)}
                    className="border-red-200 text-red-600 hover:bg-red-50 ml-auto"
                    data-testid={`button-delete-${address.id}`}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[500px]" data-testid="dialog-address-form">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? "Edit Address" : "Add New Address"}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} data-testid="input-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+62 812-3456-7890" {...field} data-testid="input-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Jl. Sudirman No. 123" {...field} data-testid="input-address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Jakarta" {...field} data-testid="input-city" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="12190" {...field} data-testid="input-postal-code" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white"
                    data-testid="button-save"
                  >
                    {editingAddress ? "Update" : "Add"} Address
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </ProfileLayout>
  );
}
