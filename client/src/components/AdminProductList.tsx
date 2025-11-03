import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface AdminProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  isActive: boolean;
  imageUrl: string;
  bpom?: string;
  certificates?: string[];
}

interface AdminProductListProps {
  products: AdminProduct[];
  onAddProduct?: (product: Omit<AdminProduct, "id">) => void;
  onEditProduct?: (id: string, product: Partial<AdminProduct>) => void;
  onDeleteProduct?: (id: string) => void;
}

export default function AdminProductList({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
}: AdminProductListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString("id-ID")}`;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const certificatesValue = formData.get("certificates") as string;
    const certificates = certificatesValue 
      ? certificatesValue.split(',').map(cert => cert.trim()).filter(cert => cert.length > 0)
      : undefined;
    
    const productData = {
      name: formData.get("name") as string,
      price: parseInt(formData.get("price") as string),
      category: formData.get("category") as string,
      brand: formData.get("brand") as string,
      stock: parseInt(formData.get("stock") as string),
      isActive: formData.get("isActive") === "on",
      imageUrl: formData.get("imageUrl") as string,
      bpom: formData.get("bpom") as string || undefined,
      certificates,
    };

    if (editingProduct) {
      onEditProduct?.(editingProduct.id, productData);
    } else {
      onAddProduct?.(productData);
    }

    setDialogOpen(false);
    setEditingProduct(null);
  };

  return (
    <div data-testid="admin-product-list">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-500 hover:bg-cyan-600" onClick={() => setEditingProduct(null)} data-testid="button-add-product">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="flex flex-col">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>
                {editingProduct ? "Update the product details below" : "Fill in the product details below"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} id="product-form" className="flex flex-col flex-1 min-h-0">
              <DialogBody>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      defaultValue={editingProduct?.name}
                      data-testid="input-product-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      required
                      defaultValue={editingProduct?.price}
                      data-testid="input-product-price"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      name="category"
                      required
                      defaultValue={editingProduct?.category}
                      data-testid="input-product-category"
                    />
                  </div>
                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      name="brand"
                      required
                      defaultValue={editingProduct?.brand}
                      data-testid="input-product-brand"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      required
                      defaultValue={editingProduct?.stock}
                      data-testid="input-product-stock"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bpom">BPOM Number (Optional)</Label>
                    <Input
                      id="bpom"
                      name="bpom"
                      defaultValue={editingProduct?.bpom}
                      placeholder="e.g., NA18210100123"
                      data-testid="input-product-bpom"
                    />
                  </div>
                  <div>
                    <Label htmlFor="certificates">Certificates (Optional)</Label>
                    <Input
                      id="certificates"
                      name="certificates"
                      defaultValue={editingProduct?.certificates?.join(', ')}
                      placeholder="e.g., Halal, Cruelty-Free, Organic"
                      data-testid="input-product-certificates"
                    />
                    <p className="text-xs text-slate-500 mt-1">Separate multiple certificates with commas</p>
                  </div>
                  <div>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      required
                      defaultValue={editingProduct?.imageUrl}
                      data-testid="input-product-image"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      defaultChecked={editingProduct?.isActive ?? true}
                      className="h-4 w-4"
                      data-testid="input-product-active"
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                </div>
              </DialogBody>
              <DialogFooter>
                <Button type="submit" className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-600" data-testid="button-save-product">
                  {editingProduct ? "Update Product" : "Add Product"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg border border-slate-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} data-testid={`row-product-${product.id}`}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Badge variant={product.isActive ? "default" : "secondary"}>
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingProduct(product);
                        setDialogOpen(true);
                      }}
                      data-testid={`button-edit-${product.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteProduct?.(product.id)}
                      data-testid={`button-delete-${product.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
