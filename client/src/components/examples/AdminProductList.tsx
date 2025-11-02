import { useState } from "react";
import AdminProductList, { type AdminProduct } from "../AdminProductList";
import AdminLayout from "../AdminLayout";

export default function AdminProductListExample() {
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
    <AdminLayout onLogout={() => console.log("Logout")}>
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
          setProducts(products.filter(p => p.id !== id));
        }}
      />
    </AdminLayout>
  );
}
