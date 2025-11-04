# Phase 1: Inventory Management System - Functionality Implementation Plan

**Status:** Design Complete ✅ | Functionality: Pending ⏳  
**Tanggal:** 4 November 2025  
**Tujuan:** Implementasi functionality untuk Inventory Management System setelah design selesai

---

## 📋 Overview

Dokumen ini berisi rencana detail implementasi **functionality** untuk Phase 1 Inventory Management System. Design UI sudah selesai dibuat, functionality akan diimplementasikan setelah approval design.

**Design Components yang Sudah Dibuat:**
- ✅ InventoryPage - Main inventory dashboard dengan filtering & search
- ✅ LowStockAlerts - Alert components untuk low stock, out of stock, expiring batches
- ✅ StockAdjustmentDialog - Form untuk stock adjustment
- ✅ StockHistoryView - Audit trail untuk stock changes
- ✅ BatchManagementView - Batch/lot tracking dengan expiry dates
- ✅ BulkStockUpdateDialog - Bulk update multiple products

---

## 🗄️ Database Schema Design

### Tables yang Perlu Dibuat

#### 1. Orders & Order Items
```typescript
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderCode: text("order_code").notNull().unique(),
  customerName: text("customer_name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  province: text("province").notNull(),
  postalCode: text("postal_code").notNull(),
  subtotal: integer("subtotal").notNull(),
  shippingCost: integer("shipping_cost").notNull().default(0),
  total: integer("total").notNull(),
  status: text("status").notNull().default("PENDING_PAYMENT"),
  paymentMethod: text("payment_method"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: varchar("product_id").notNull().references(() => products.id),
  productName: text("product_name").notNull(),
  productPrice: integer("product_price").notNull(),
  quantity: integer("quantity").notNull(),
  subtotal: integer("subtotal").notNull(),
});
```

#### 2. Inventory Transactions (Audit Trail)
```typescript
export const inventoryTransactions = pgTable("inventory_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  type: text("type").notNull(), // 'add', 'remove', 'adjustment', 'order_fulfillment', 'return'
  quantity: integer("quantity").notNull(),
  previousStock: integer("previous_stock").notNull(),
  newStock: integer("new_stock").notNull(),
  reason: text("reason").notNull(),
  batchNumber: text("batch_number"),
  orderId: varchar("order_id").references(() => orders.id),
  performedBy: text("performed_by").notNull(), // username admin
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

#### 3. Product Batches (BPOM Compliance)
```typescript
export const productBatches = pgTable("product_batches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  batchNumber: text("batch_number").notNull(),
  quantity: integer("quantity").notNull(),
  remainingQuantity: integer("remaining_quantity").notNull(),
  expiryDate: timestamp("expiry_date"),
  manufacturingDate: timestamp("manufacturing_date"),
  receivedDate: timestamp("received_date").notNull().defaultNow(),
  supplier: text("supplier"),
  notes: text("notes"),
  isActive: boolean("is_active").notNull().default(true),
});
```

#### 4. Update Products Table
```typescript
// Tambahkan fields ke existing products table:
reservedStock: integer("reserved_stock").notNull().default(0),
reorderPoint: integer("reorder_point").notNull().default(10),
description: text("description"),
ingredients: text("ingredients"),
usage: text("usage"),
benefits: text("benefits"),
size: text("size"),
```

---

## 🔧 Backend Implementation Tasks

### Task 1: Update Storage Interface (server/storage.ts)

```typescript
export interface IStorage {
  // User methods (existing)
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  
  // Inventory methods
  getInventoryItems(): Promise<InventoryItem[]>;
  adjustStock(params: {
    productId: string;
    type: 'add' | 'remove';
    quantity: number;
    reason: string;
    batchNumber?: string;
    performedBy: string;
  }): Promise<void>;
  getStockHistory(productId: string): Promise<InventoryTransaction[]>;
  getAllStockHistory(): Promise<InventoryTransaction[]>;
  
  // Batch methods
  createBatch(batch: InsertProductBatch): Promise<ProductBatch>;
  getProductBatches(productId: string): Promise<ProductBatch[]>;
  getAllBatches(): Promise<ProductBatch[]>;
  getExpiringBatches(daysThreshold: number): Promise<ProductBatch[]>;
  updateBatchQuantity(batchId: string, quantity: number): Promise<void>;
  
  // Order methods
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  getAllOrders(): Promise<Order[]>;
  updateOrderStatus(orderId: string, status: string): Promise<void>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
}
```

### Task 2: Implement API Routes (server/routes.ts)

#### Inventory Routes
```typescript
// GET /api/inventory - Get all inventory items with stock status
router.get('/api/inventory', async (req, res) => {
  const items = await storage.getInventoryItems();
  res.json(items);
});

// POST /api/inventory/adjust - Adjust stock
router.post('/api/inventory/adjust', async (req, res) => {
  const { productId, type, quantity, reason, batchNumber } = req.body;
  const performedBy = req.user?.username || 'system';
  
  await storage.adjustStock({
    productId,
    type,
    quantity,
    reason,
    batchNumber,
    performedBy
  });
  
  res.json({ success: true });
});

// GET /api/inventory/history - Get all stock history
router.get('/api/inventory/history', async (req, res) => {
  const history = await storage.getAllStockHistory();
  res.json(history);
});

// GET /api/inventory/history/:productId - Get stock history for product
router.get('/api/inventory/history/:productId', async (req, res) => {
  const history = await storage.getStockHistory(req.params.productId);
  res.json(history);
});
```

#### Batch Routes
```typescript
// GET /api/batches - Get all batches
router.get('/api/batches', async (req, res) => {
  const batches = await storage.getAllBatches();
  res.json(batches);
});

// GET /api/batches/expiring - Get expiring batches
router.get('/api/batches/expiring', async (req, res) => {
  const days = parseInt(req.query.days as string) || 30;
  const batches = await storage.getExpiringBatches(days);
  res.json(batches);
});

// POST /api/batches - Create new batch
router.post('/api/batches', async (req, res) => {
  const batch = await storage.createBatch(req.body);
  res.json(batch);
});

// GET /api/batches/product/:productId - Get batches for product
router.get('/api/batches/product/:productId', async (req, res) => {
  const batches = await storage.getProductBatches(req.params.productId);
  res.json(batches);
});
```

#### Product Routes Enhancement
```typescript
// GET /api/products - Get all products (sudah ada, enhance dengan filter)
router.get('/api/products', async (req, res) => {
  const products = await storage.getAllProducts();
  
  // Filter by stock status if needed
  const { stockStatus } = req.query;
  if (stockStatus === 'low') {
    products = products.filter(p => p.stock > 0 && p.stock <= p.reorderPoint);
  } else if (stockStatus === 'out') {
    products = products.filter(p => p.stock === 0);
  }
  
  res.json(products);
});
```

### Task 3: Implement Business Logic

#### Stock Adjustment Logic
```typescript
async adjustStock(params) {
  const product = await this.getProduct(params.productId);
  if (!product) throw new Error('Product not found');
  
  const previousStock = product.stock;
  let newStock: number;
  
  if (params.type === 'add') {
    newStock = previousStock + params.quantity;
  } else {
    newStock = Math.max(0, previousStock - params.quantity);
  }
  
  // Update product stock
  await this.updateProduct(params.productId, { stock: newStock });
  
  // Create transaction record
  await db.insert(inventoryTransactions).values({
    productId: params.productId,
    type: params.type,
    quantity: params.quantity,
    previousStock,
    newStock,
    reason: params.reason,
    batchNumber: params.batchNumber,
    performedBy: params.performedBy,
  });
  
  // If batch number provided, update batch quantity
  if (params.batchNumber) {
    const batch = await db.query.productBatches.findFirst({
      where: (batches, { and, eq }) => and(
        eq(batches.batchNumber, params.batchNumber),
        eq(batches.productId, params.productId)
      )
    });
    
    if (batch) {
      const newBatchQty = params.type === 'add' 
        ? batch.remainingQuantity + params.quantity
        : Math.max(0, batch.remainingQuantity - params.quantity);
      
      await db.update(productBatches)
        .set({ remainingQuantity: newBatchQty })
        .where(eq(productBatches.id, batch.id));
    }
  }
}
```

#### Order Fulfillment with Stock Deduction
```typescript
async createOrder(order: InsertOrder, items: InsertOrderItem[]) {
  // Create order
  const [newOrder] = await db.insert(orders).values(order).returning();
  
  // Create order items and deduct stock
  for (const item of items) {
    await db.insert(orderItems).values({
      ...item,
      orderId: newOrder.id
    });
    
    // Deduct stock when order is PAID or PROCESSING
    if (order.status === 'PAID' || order.status === 'PROCESSING') {
      await this.adjustStock({
        productId: item.productId,
        type: 'remove',
        quantity: item.quantity,
        reason: `Order fulfillment: ${order.orderCode}`,
        orderId: newOrder.id,
        performedBy: 'system'
      });
      
      // Update reserved stock
      const product = await this.getProduct(item.productId);
      if (product) {
        await this.updateProduct(item.productId, {
          reservedStock: Math.max(0, (product.reservedStock || 0) - item.quantity)
        });
      }
    }
  }
  
  return newOrder;
}
```

---

## 🎨 Frontend Integration Tasks

### Task 4: Connect InventoryPage to Real API

```typescript
// Replace mock data dengan API calls
const { data: inventoryItems, isLoading } = useQuery({
  queryKey: ['/api/inventory'],
});

const { data: products } = useQuery({
  queryKey: ['/api/products'],
});

const adjustStockMutation = useMutation({
  mutationFn: async (adjustment: StockAdjustment) => {
    return apiRequest('/api/inventory/adjust', {
      method: 'POST',
      body: JSON.stringify(adjustment),
    });
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
    queryClient.invalidateQueries({ queryKey: ['/api/products'] });
  },
});
```

### Task 5: Implement Stock History View

```typescript
const { data: stockHistory } = useQuery({
  queryKey: ['/api/inventory/history', productId],
  enabled: !!productId,
});

// Display in table format with:
// - Date/Time
// - Type (add/remove/adjustment)
// - Quantity change
// - Previous/New stock
// - Reason
// - Batch number (if any)
// - Performed by
```

### Task 6: Implement Batch Management

```typescript
const { data: batches } = useQuery({
  queryKey: ['/api/batches'],
});

const { data: expiringBatches } = useQuery({
  queryKey: ['/api/batches/expiring'],
});

const createBatchMutation = useMutation({
  mutationFn: async (batch: NewBatch) => {
    return apiRequest('/api/batches', {
      method: 'POST',
      body: JSON.stringify(batch),
    });
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/batches'] });
  },
});
```

---

## 📊 Implementation Sequence

### Week 1: Database & Backend Setup
1. **Day 1-2:** Update database schema
   - Add new tables (orders, order_items, inventory_transactions, product_batches)
   - Update products table with new fields
   - Run migrations: `npm run db:push`

2. **Day 3-4:** Implement Storage Interface
   - Add all inventory methods
   - Add batch management methods
   - Add order methods with stock integration

3. **Day 5:** Implement API Routes
   - Inventory routes
   - Batch routes
   - Update product routes

### Week 2: Frontend Integration
1. **Day 1-2:** Connect InventoryPage
   - Replace mock data dengan API calls
   - Implement real stock adjustment
   - Add loading states

2. **Day 3:** Stock History Implementation
   - Create API integration
   - Display transaction history
   - Add filters & search

3. **Day 4:** Batch Management Implementation
   - Batch list view
   - Create/edit batch dialog
   - Expiry date tracking

4. **Day 5:** Order Integration
   - Auto stock deduction on order fulfillment
   - Reserved stock management
   - Testing end-to-end

### Week 3: Testing & Polish
1. **Day 1-2:** Testing
   - Unit tests untuk business logic
   - Integration tests untuk API
   - E2E tests untuk UI flows

2. **Day 3-4:** Bug Fixes & Optimization
   - Fix issues dari testing
   - Performance optimization
   - Database query optimization

3. **Day 5:** Documentation & Deployment
   - Update documentation
   - Deployment preparation
   - Final review

---

## 🧪 Testing Checklist

### Inventory Management
- [ ] Stock adjustment (add) berhasil update stock
- [ ] Stock adjustment (remove) tidak bisa negative
- [ ] Stock history tercatat dengan benar
- [ ] Low stock alerts muncul ketika stock <= reorder point
- [ ] Out of stock alerts muncul ketika stock = 0
- [ ] Filter (all/low/out) berfungsi dengan benar
- [ ] Search by product name berfungsi
- [ ] Export CSV menghasilkan file yang benar

### Batch Management
- [ ] Create batch berhasil
- [ ] Batch quantity update seiring stock adjustment
- [ ] Expiring batches (30 days) terdeteksi
- [ ] Batch list display dengan benar
- [ ] Filter by product berfungsi

### Order Integration
- [ ] Stock berkurang otomatis saat order PAID/PROCESSING
- [ ] Reserved stock ter-update saat pending order
- [ ] Stock history mencatat order fulfillment
- [ ] Order tidak bisa dibuat jika stock insufficient
- [ ] Cancel order mengembalikan stock

### UI/UX
- [ ] Loading states tampil dengan baik
- [ ] Error handling & messages jelas
- [ ] Responsive di mobile & desktop
- [ ] Toast notifications berfungsi
- [ ] Dialog forms validation bekerja

---

## 🚀 Future Enhancements (Post Phase 1)

1. **Bulk Stock Update**
   - CSV import untuk mass update
   - Excel template download
   - Batch processing

2. **Advanced Alerts**
   - Email notifications untuk low stock
   - WhatsApp alerts untuk critical items
   - Daily inventory reports

3. **Analytics**
   - Stock turnover rate
   - Dead stock identification
   - Reorder point optimization

4. **Supplier Management**
   - Supplier database
   - Purchase orders
   - Automatic reorder

---

## 📝 Notes

- **Database Migration:** Use `npm run db:push` untuk sync schema
- **Mock Data:** Keep mock data untuk development/testing
- **Authentication:** Pastikan semua inventory routes protected dengan auth middleware
- **Validation:** Gunakan Zod schemas untuk validate request body
- **Error Handling:** Implement proper error handling di semua endpoints
- **Logging:** Add logging untuk audit trail

---

**Document ini akan di-update seiring progress implementasi functionality.**

*Last Updated: 4 November 2025*
