import { useState } from "react";
import { useLocation } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import AdminProductList, { type AdminProduct } from "@/components/AdminProductList";

export default function AdminProductsPage() {
  const [, setLocation] = useLocation();
  
  const [products, setProducts] = useState<AdminProduct[]>([
    {
      id: "1",
      name: "Hydrating Serum",
      price: 250000,
      category: "Serums",
      stock: 50,
      isActive: true,
      imageUrl: "/placeholder.jpg",
    },
    {
      id: "2",
      name: "Daily Moisturizer",
      price: 180000,
      category: "Moisturizers",
      stock: 30,
      isActive: true,
      imageUrl: "/placeholder.jpg",
    },
  ]);

  return (
    <AdminLayout onLogout={() => setLocation("/admin/login")}>
      <AdminProductList
        products={products}
        onAddProduct={(product) => {
          console.log("Add product:", product);
          setProducts([...products, { ...product, id: String(products.length + 1) }]);
        }}
        onEditProduct={(id, updates) => {
          console.log("Edit product:", id, updates);
          setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
        }}
        onDeleteProduct={(id) => {
          console.log("Delete product:", id);
          if (confirm("Are you sure you want to delete this product?")) {
            setProducts(products.filter(p => p.id !== id));
          }
        }}
      />
    </AdminLayout>
  );
}
