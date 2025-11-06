# Phase 1 Point 3: Shipping & Logistics Management - Implementation Plan

**Status:** Design Phase IN PROGRESS 🔄 | Functionality: Pending ⏳  
**Tanggal Dibuat:** 6 November 2025  
**Feature:** PRIORITAS 1 (P1) - Feature #3 dari ADMIN_FEATURE_ANALYSIS.md  
**Tujuan:** Implementasi design dan functionality untuk Shipping & Logistics Management System

---

## 📋 Overview

Dokumen ini berisi rencana detail implementasi **Shipping & Logistics Management** untuk Phase 1 P3 sesuai dengan ADMIN_FEATURE_ANALYSIS.md (P1 Feature #3). Ini adalah fitur critical untuk operasional bisnis e-commerce, khususnya untuk manage pengiriman produk ke customer.

## 🎯 Fitur yang Akan Dibangun

### Fitur Utama (dari ADMIN_FEATURE_ANALYSIS.md):
1. **Integration dengan Kurir** - JNE, J&T, SiCepat, AnterAja (API integration untuk auto-generate tracking)
2. **Auto-generate Shipping Label & Receipt Number** - Generate label dan resi otomatis
3. **Bulk Print Shipping Labels** - Print banyak label sekaligus untuk batch shipping
4. **Real-time Tracking Status Update** - Update status pengiriman real-time
5. **Shipping Cost Calculator** - Calculate ongkir berdasarkan tujuan dan berat
6. **Delivery Confirmation with Photo Proof** - Bukti foto saat barang diterima
7. **Failed Delivery Management** - Handle gagal kirim (reschedule/return)

### Design Mockup Konsep (dari Analysis):
```
┌─────────────────────────────────────────────┐
│ Ready to Ship: 8 orders                     │
├─────────────────────────────────────────────┤
│ [ ] ORD-2025-001 | JNE REG | Jakarta       │
│ [ ] ORD-2025-002 | J&T YES | Bandung       │
│ [ ] ORD-2025-003 | SiCepat | Surabaya      │
├─────────────────────────────────────────────┤
│ [Select All] [Print Labels] [Mark Shipped]  │
│                                              │
│ In Transit: 15 orders | Track All           │
│ Delivered: 142 orders | View Report         │
└─────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema Design

### 1. Shipping Information Table
```typescript
export const shippingInfo = pgTable("shipping_info", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  
  // Courier Information
  courierName: text("courier_name").notNull(), // 'JNE', 'J&T', 'SiCepat', 'AnterAja', etc.
  courierService: text("courier_service").notNull(), // 'REG', 'YES', 'HALU', etc.
  trackingNumber: text("tracking_number").notNull().unique(),
  
  // Shipping Details
  shippingCost: integer("shipping_cost").notNull(),
  estimatedDeliveryDays: integer("estimated_delivery_days"),
  weight: integer("weight").notNull(), // dalam gram
  
  // Address Information
  recipientName: text("recipient_name").notNull(),
  recipientPhone: text("recipient_phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  province: text("province").notNull(),
  postalCode: text("postal_code").notNull(),
  
  // Status Tracking
  status: text("status").notNull().default("ready_to_ship"), 
  // 'ready_to_ship', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned'
  
  // Shipping Label
  labelUrl: text("label_url"), // URL to generated shipping label PDF
  labelPrintedAt: timestamp("label_printed_at"),
  
  // Timestamps
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

### 2. Shipping Status History (Tracking Timeline)
```typescript
export const shippingStatusHistory = pgTable("shipping_status_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shippingId: varchar("shipping_id").notNull().references(() => shippingInfo.id, { onDelete: "cascade" }),
  
  status: text("status").notNull(),
  location: text("location"), // e.g., "Jakarta Hub", "Bandung Sorting Center"
  description: text("description").notNull(), // e.g., "Package picked up by courier"
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  
  updatedBy: text("updated_by").notNull().default("system"), // 'system', 'courier', 'admin'
});
```

### 3. Failed Deliveries Table
```typescript
export const failedDeliveries = pgTable("failed_deliveries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shippingId: varchar("shipping_id").notNull().references(() => shippingInfo.id),
  orderId: varchar("order_id").notNull().references(() => orders.id),
  
  failureReason: text("failure_reason").notNull(), 
  // 'customer_not_available', 'wrong_address', 'refused', 'address_incomplete', 'other'
  failureDetails: text("failure_details"),
  failureDate: timestamp("failure_date").notNull(),
  
  // Resolution
  resolution: text("resolution"), // 'rescheduled', 'returned_to_sender', 'cancelled'
  rescheduleDate: timestamp("reschedule_date"),
  resolutionNotes: text("resolution_notes"),
  
  // Photos
  photoProofUrl: text("photo_proof_url"), // Photo of delivery attempt/issue
  
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: text("resolved_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

### 4. Delivery Confirmations Table
```typescript
export const deliveryConfirmations = pgTable("delivery_confirmations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shippingId: varchar("shipping_id").notNull().references(() => shippingInfo.id),
  orderId: varchar("order_id").notNull().references(() => orders.id),
  
  // Receiver Information
  receiverName: text("receiver_name").notNull(),
  receiverRelation: text("receiver_relation"), // 'self', 'family', 'neighbor', 'security'
  receiverSignature: text("receiver_signature"), // Image URL
  
  // Delivery Proof
  photoProofUrls: text("photo_proof_urls").array(), // Array of photo URLs
  deliveryNotes: text("delivery_notes"),
  
  deliveredAt: timestamp("delivered_at").notNull().defaultNow(),
  confirmedBy: text("confirmed_by").notNull(), // Courier name or ID
});
```

### 5. Update Orders Table
```typescript
// Add these fields to existing orders table:
export const orders = pgTable("orders", {
  // ... existing fields ...
  shippingStatus: text("shipping_status").default("pending"), 
  // 'pending', 'ready_to_ship', 'shipped', 'in_transit', 'delivered', 'failed', 'returned'
  trackingNumber: text("tracking_number"),
  // ... existing fields ...
});
```

---

## 🎨 Design Components to Build

### Component 1: ShippingLogisticsPage (Main Page)
**Location:** `client/src/pages/admin/ShippingLogisticsPage.tsx`

**Layout & Sections:**
1. **Header Section**
   - Page title: "Shipping & Logistics" (text-2xl font-bold tracking-tight for mobile optimization)
   - Live badge showing active shipments

2. **Stats Cards Row** (4 cards on desktop, 2 on mobile)
   - Ready to Ship (yellow badge)
   - In Transit (blue badge)
   - Delivered Today (green badge)
   - Failed Deliveries (red badge)

3. **Action Bar**
   - Search by order code/tracking number
   - Filter dropdown (All, Ready to Ship, In Transit, Out for Delivery, Delivered, Failed)
   - Bulk actions: Select All, Print Selected Labels, Mark as Shipped
   - Date range filter

4. **Shipping Queue Section** (Tab-based or filtered view)
   **Ready to Ship Tab:**
   - Checkbox selection for bulk actions
   - Order details card layout (responsive grid)
   - Each card shows:
     - Order code
     - Customer name
     - Destination city
     - Courier & service
     - Weight & shipping cost
     - Actions: Generate Label, View Details, Mark Shipped
   
   **In Transit Tab:**
   - List of orders currently being delivered
   - Tracking number display
   - Current status badge
   - Quick action: Update Status, View Tracking
   
   **Delivered Tab:**
   - Delivered orders with delivery confirmation
   - Photo proof display
   - Receiver information
   
   **Failed Deliveries Tab:**
   - Failed delivery cards with reason
   - Resolution actions: Reschedule, Return to Sender

**Mock Data Structure:**
```typescript
interface ShippingOrder {
  id: string;
  orderId: string;
  orderCode: string;
  customerName: string;
  recipientName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  
  courierName: 'JNE' | 'J&T' | 'SiCepat' | 'AnterAja';
  courierService: string;
  trackingNumber?: string;
  weight: number; // grams
  shippingCost: number;
  estimatedDeliveryDays: number;
  
  status: 'ready_to_ship' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed' | 'returned';
  
  shippedAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

interface ShippingStatusUpdate {
  timestamp: string;
  status: string;
  location: string;
  description: string;
}
```

**Design Principles:**
- Clean white background with slate borders
- Card-based layout for better mobile responsiveness
- Color-coded status badges (yellow, blue, green, red)
- Icons for visual clarity (Truck, Package, CheckCircle, AlertTriangle)
- Hover effects with shadows
- Responsive grid (grid md:grid-cols-2 lg:grid-cols-3)
- No gradients - follow minimalist design from Payment Verification redesign
- Consistent slate colors for text (text-slate-600, text-slate-500)

---

### Component 2: ShippingLabelDialog
**Location:** Component in ShippingLogisticsPage or separate file

**Features:**
- Order summary (order code, customer, items)
- Shipping address display (formatted nicely)
- Courier selection dropdown (JNE, J&T, SiCepat, AnterAja)
- Service type selection (REG, YES, HALU, etc.)
- Weight input (with auto-calculate from products)
- Shipping cost calculator (based on destination + weight)
- Generate tracking number (auto or manual)
- Preview shipping label (PDF format)
- Actions: Print Label, Download PDF, Mark as Shipped

**Label Design (PDF):**
```
┌──────────────────────────────────────┐
│ [LOGO] MeeyaLab                      │
│                                      │
│ FROM:                                │
│ MeeyaLab Store                       │
│ Jakarta, Indonesia                   │
│                                      │
│ TO:                                  │
│ [Customer Name]                      │
│ [Full Address]                       │
│ [City, Province, Postal Code]        │
│ [Phone Number]                       │
│                                      │
│ ──────────────────────────────────   │
│ Courier: [JNE REG]                   │
│ Tracking: [TRACK-NUMBER]             │
│ Weight: [500g]                       │
│ ──────────────────────────────────   │
│                                      │
│ [BARCODE: Tracking Number]           │
│                                      │
│ Order: [ORD-2025-001]                │
└──────────────────────────────────────┘
```

---

### Component 3: TrackingUpdateDialog
**Location:** Component in ShippingLogisticsPage

**Features:**
- Current tracking timeline (vertical timeline component)
- Status update form:
  - Status selection dropdown (Picked Up, In Transit, Out for Delivery, Delivered)
  - Location input (e.g., "Jakarta Hub")
  - Description/notes textarea
  - Photo upload for proof (optional)
- Real-time tracking number display
- Estimated delivery date
- Update button with confirmation
- Send notification to customer (checkbox)

**Timeline Display:**
```
🟢 Delivered - 2025-01-05 14:30
   📍 Customer Address
   Package received by customer

🔵 Out for Delivery - 2025-01-05 08:00
   📍 Jakarta Hub
   Package is on the way

🔵 In Transit - 2025-01-04 16:00
   📍 Sorting Center Jakarta
   Package in transit

🔵 Picked Up - 2025-01-04 10:00
   📍 MeeyaLab Store
   Package picked up by courier
```

---

### Component 4: FailedDeliveryDialog
**Location:** Component in ShippingLogisticsPage

**Features:**
- Order & shipping information display
- Failure reason selection:
  - Customer not available
  - Wrong/incomplete address
  - Customer refused
  - Address inaccessible
  - Other (with text input)
- Failure details textarea
- Photo proof upload (photo of location/attempt)
- Resolution options:
  - **Reschedule Delivery**
    - Select new delivery date
    - Add notes for next attempt
  - **Return to Sender**
    - Reason for return
    - Return shipping cost (who pays)
  - **Cancel Order**
    - Initiate refund process
    - Cancel reason
- Notification to customer (auto-send)
- Save button

---

### Component 5: BulkShippingActions Component
**Location:** Component in ShippingLogisticsPage

**Features:**
- Checkbox "Select All" functionality
- Selected count display (e.g., "5 orders selected")
- Bulk actions toolbar (appears when items selected):
  - **Print All Labels** - Generate PDF with all labels
  - **Mark as Shipped** - Bulk update status
  - **Assign Courier** - Set same courier for all
  - **Export List** - Download CSV/Excel
- Clear selection button

---

### Component 6: CourierIntegrationSettings
**Location:** Settings page or separate tab in ShippingLogisticsPage

**Features:**
- Courier accounts management:
  - Add courier API credentials (JNE, J&T, SiCepat, etc.)
  - Enable/disable courier options
  - Default courier selection
  - Service type preferences
- Shipping rate configuration:
  - Base rates per courier
  - Additional charges (insurance, packing)
  - Free shipping thresholds
- Label template customization:
  - Upload logo
  - Sender information
  - Label size preferences

---

## 🔧 Backend Implementation Tasks

### Task 1: Update Storage Interface (server/storage.ts)

```typescript
export interface IStorage {
  // ... existing methods ...
  
  // Shipping Information Methods
  createShippingInfo(shipping: InsertShippingInfo): Promise<ShippingInfo>;
  getShippingInfo(id: string): Promise<ShippingInfo | undefined>;
  getShippingInfoByOrderId(orderId: string): Promise<ShippingInfo | undefined>;
  getShippingByStatus(status: string): Promise<ShippingInfo[]>;
  getAllShippingOrders(): Promise<ShippingInfo[]>;
  updateShippingStatus(shippingId: string, status: string): Promise<void>;
  updateShippingInfo(shippingId: string, updates: Partial<InsertShippingInfo>): Promise<ShippingInfo>;
  
  // Shipping Status History
  addStatusUpdate(update: InsertShippingStatusHistory): Promise<ShippingStatusHistory>;
  getShippingHistory(shippingId: string): Promise<ShippingStatusHistory[]>;
  
  // Failed Deliveries
  createFailedDelivery(failed: InsertFailedDelivery): Promise<FailedDelivery>;
  getFailedDeliveries(): Promise<FailedDelivery[]>;
  resolveFailedDelivery(failedId: string, resolution: string, notes?: string): Promise<void>;
  
  // Delivery Confirmations
  createDeliveryConfirmation(confirmation: InsertDeliveryConfirmation): Promise<DeliveryConfirmation>;
  getDeliveryConfirmation(shippingId: string): Promise<DeliveryConfirmation | undefined>;
  
  // Tracking
  getTrackingInfo(trackingNumber: string): Promise<ShippingInfo | undefined>;
}
```

### Task 2: Implement API Routes (server/routes.ts)

#### Shipping Routes
```typescript
// GET /api/shipping - Get all shipping orders
router.get('/api/shipping', async (req, res) => {
  const { status } = req.query;
  let shipments = await storage.getAllShippingOrders();
  
  if (status) {
    shipments = shipments.filter(s => s.status === status);
  }
  
  res.json(shipments);
});

// POST /api/shipping - Create shipping info for order
router.post('/api/shipping', async (req, res) => {
  const shipping = await storage.createShippingInfo(req.body);
  
  // Update order status
  await storage.updateOrderStatus(req.body.orderId, 'PROCESSING');
  
  res.json(shipping);
});

// GET /api/shipping/:id - Get shipping details
router.get('/api/shipping/:id', async (req, res) => {
  const shipping = await storage.getShippingInfo(req.params.id);
  if (!shipping) {
    return res.status(404).json({ error: 'Shipping info not found' });
  }
  res.json(shipping);
});

// PATCH /api/shipping/:id - Update shipping info
router.patch('/api/shipping/:id', async (req, res) => {
  const shipping = await storage.updateShippingInfo(req.params.id, req.body);
  res.json(shipping);
});

// POST /api/shipping/:id/status - Update shipping status
router.post('/api/shipping/:id/status', async (req, res) => {
  const { status, location, description } = req.body;
  
  // Update shipping status
  await storage.updateShippingStatus(req.params.id, status);
  
  // Add status history
  await storage.addStatusUpdate({
    shippingId: req.params.id,
    status,
    location,
    description,
    updatedBy: req.user?.username || 'admin',
  });
  
  // Update order shipping status if delivered
  if (status === 'delivered') {
    const shipping = await storage.getShippingInfo(req.params.id);
    if (shipping) {
      await storage.updateOrder(shipping.orderId, { 
        status: 'COMPLETED',
        shippingStatus: 'delivered'
      });
    }
  }
  
  res.json({ success: true });
});

// GET /api/shipping/:id/tracking - Get tracking history
router.get('/api/shipping/:id/tracking', async (req, res) => {
  const history = await storage.getShippingHistory(req.params.id);
  res.json(history);
});

// GET /api/tracking/:trackingNumber - Public tracking endpoint
router.get('/api/tracking/:trackingNumber', async (req, res) => {
  const shipping = await storage.getTrackingInfo(req.params.trackingNumber);
  if (!shipping) {
    return res.status(404).json({ error: 'Tracking number not found' });
  }
  
  const history = await storage.getShippingHistory(shipping.id);
  res.json({ shipping, history });
});
```

#### Failed Delivery Routes
```typescript
// GET /api/failed-deliveries - Get all failed deliveries
router.get('/api/failed-deliveries', async (req, res) => {
  const failures = await storage.getFailedDeliveries();
  res.json(failures);
});

// POST /api/failed-deliveries - Report failed delivery
router.post('/api/failed-deliveries', async (req, res) => {
  const failed = await storage.createFailedDelivery(req.body);
  
  // Update shipping status
  await storage.updateShippingStatus(req.body.shippingId, 'failed');
  
  res.json(failed);
});

// POST /api/failed-deliveries/:id/resolve - Resolve failed delivery
router.post('/api/failed-deliveries/:id/resolve', async (req, res) => {
  const { resolution, notes, rescheduleDate } = req.body;
  
  await storage.resolveFailedDelivery(
    req.params.id,
    resolution,
    notes
  );
  
  res.json({ success: true });
});
```

#### Delivery Confirmation Routes
```typescript
// POST /api/shipping/:id/confirm-delivery - Confirm delivery
router.post('/api/shipping/:id/confirm-delivery', async (req, res) => {
  const confirmation = await storage.createDeliveryConfirmation({
    ...req.body,
    shippingId: req.params.id,
  });
  
  // Update shipping status to delivered
  await storage.updateShippingStatus(req.params.id, 'delivered');
  
  res.json(confirmation);
});
```

---

## 📊 Implementation Sequence

### Week 1: Design Components (CURRENT)
**Day 1:** Planning & Documentation
- [x] Create PHASE_1_P3_SHIPPING_LOGISTICS.md document
- [ ] Design database schema
- [ ] Create mock data structure

**Day 2-3:** Main Page Component
- [ ] Build ShippingLogisticsPage main layout
- [ ] Build stats cards section
- [ ] Build shipping queue with filters
- [ ] Build tab navigation (Ready to Ship, In Transit, Delivered, Failed)

**Day 4:** Dialog Components
- [ ] Build ShippingLabelDialog
- [ ] Build TrackingUpdateDialog
- [ ] Build FailedDeliveryDialog

**Day 5:** Polish & Integration
- [ ] Build BulkShippingActions component
- [ ] Add to App.tsx routes
- [ ] Update AdminLayout navigation
- [ ] Review and polish design
- [ ] Update documentation

### Week 2: Backend Implementation
**Day 1-2:** Database Setup
- [ ] Add shipping tables to schema.ts
- [ ] Create Zod schemas with drizzle-zod
- [ ] Run `npm run db:push` to sync
- [ ] Add seed data for testing

**Day 3-4:** Storage & API
- [ ] Implement storage interface methods
- [ ] Implement API routes
- [ ] Add validation with Zod
- [ ] Test all endpoints

**Day 5:** Integration Testing
- [ ] Test shipping workflows
- [ ] Test tracking updates
- [ ] Test failed delivery handling
- [ ] Fix backend issues

### Week 3: Frontend Integration & Features
**Day 1-2:** API Integration
- [ ] Replace mock data with API calls
- [ ] Implement TanStack Query mutations
- [ ] Add loading/error states
- [ ] Implement real-time updates

**Day 3:** Advanced Features
- [ ] PDF label generation (jsPDF or similar)
- [ ] Bulk actions functionality
- [ ] CSV export functionality
- [ ] Photo upload handling

**Day 4:** Courier API Integration (Optional for Phase 1)
- [ ] Research courier APIs (Biteship aggregator)
- [ ] Implement auto-tracking number generation
- [ ] Implement shipping cost calculator
- [ ] Real-time tracking updates

**Day 5:** Testing & Polish
- [ ] End-to-end testing
- [ ] Mobile responsiveness check
- [ ] Performance optimization
- [ ] Final documentation update

---

## 🧪 Testing Checklist

### Shipping Management
- [ ] Create shipping info for paid order
- [ ] Generate shipping label (PDF)
- [ ] Print shipping label
- [ ] Bulk select and print labels
- [ ] Update tracking status
- [ ] View tracking timeline
- [ ] Filter by status works correctly
- [ ] Search by order code/tracking number

### Delivery Management
- [ ] Mark order as delivered
- [ ] Upload delivery photo proof
- [ ] Confirm delivery with receiver info
- [ ] View delivery confirmation details

### Failed Deliveries
- [ ] Report failed delivery with reason
- [ ] Upload failure proof photo
- [ ] Reschedule delivery
- [ ] Return to sender
- [ ] Update order status accordingly

### UI/UX
- [ ] Responsive on mobile & desktop
- [ ] Loading states display correctly
- [ ] Error handling works
- [ ] Toast notifications function
- [ ] Forms validate properly
- [ ] Icons and colors consistent
- [ ] Tab navigation smooth

---

## 🎨 Design Guidelines

### Color Scheme (Following Phase 1 P2 Redesign)
- **White backgrounds** with subtle hover effects
- **Slate colors** for text hierarchy (text-slate-600, text-slate-500)
- **Simple shadows** (shadow-md on hover only)
- **No gradients** - clean minimalist design
- **Status colors:**
  - Ready to Ship: Yellow (#F59E0B)
  - In Transit: Blue (#3B82F6)
  - Delivered: Green (#10B981)
  - Failed: Red (#EF4444)
  - Primary Actions: Cyan (#06B6D4)

### Typography
- Page title: text-2xl font-bold tracking-tight (mobile optimized)
- Section headers: text-lg font-semibold
- Body text: text-slate-600
- Secondary text: text-slate-500
- All text uses consistent slate colors

### Component Styling
- Clean white cards with border border-slate-200
- Hover effects: hover:shadow-md transition-all
- Icons from lucide-react (Truck, Package, MapPin, CheckCircle, etc.)
- Responsive grid: grid md:grid-cols-2 lg:grid-cols-3
- Consistent spacing with Tailwind scale
- Mobile-first responsive design

---

## 🚀 Future Enhancements (Post Phase 1)

1. **Courier API Integration**
   - Biteship API for multi-courier management
   - Auto-generate tracking numbers
   - Real-time rate comparison
   - Automatic tracking updates via webhook

2. **Advanced Label Features**
   - Thermal printer support
   - Custom label templates
   - Barcode/QR code generation
   - Batch label printing optimization

3. **Analytics & Reporting**
   - Shipping performance dashboard
   - Delivery success rate
   - Average delivery time by courier
   - Failed delivery analysis
   - Cost analysis per courier

4. **Customer Features**
   - Customer tracking page (public)
   - SMS/WhatsApp tracking updates
   - Delivery slot selection
   - Address validation

5. **Warehouse Integration**
   - Pick & pack workflow
   - Shipping manifest
   - Batch picking
   - Inventory location tracking

---

## 📝 Notes

- **PDF Generation:** Use jsPDF or PDFKit untuk shipping labels
- **Photo Upload:** Gunakan Cloudinary atau similar untuk delivery photos
- **Courier APIs:** Consider Biteship sebagai aggregator untuk multiple couriers
- **Tracking Updates:** Implement webhook untuk auto-update dari courier
- **Notifications:** Send WhatsApp/email saat status update
- **Barcode:** Generate barcode untuk tracking number
- **Security:** Validate all file uploads (photos, PDFs)
- **Mobile:** Ensure mobile-friendly untuk warehouse staff usage

---

**Document ini akan di-update seiring progress implementasi design dan functionality.**

*Last Updated: 6 November 2025*
