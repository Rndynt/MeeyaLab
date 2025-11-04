# Phase 1 Point 2: Payment Verification & Management - Implementation Plan

**Status:** Design Phase IN PROGRESS 🔄 | Functionality: Pending ⏳  
**Tanggal Terakhir Diupdate:** 5 November 2025  
**Feature:** PRIORITAS 1 (P1) - Feature #2 dari ADMIN_FEATURE_ANALYSIS.md  
**Tujuan:** Implementasi design dan functionality untuk Payment Verification & Management System

---

## 📋 Overview

Dokumen ini berisi rencana detail implementasi **Payment Verification & Management** untuk Phase 2 sesuai dengan ADMIN_FEATURE_ANALYSIS.md (P1 Feature #2). Ini adalah fitur critical untuk operasional bisnis e-commerce.

## 🎯 Fitur yang Akan Dibangun

### Fitur Utama (dari ADMIN_FEATURE_ANALYSIS.md):
1. **Upload & View Payment Proof** - Customer upload bukti transfer, admin view & verify
2. **Payment Verification Workflow** - Pending → Verified → Rejected
3. **Multiple Payment Methods** - Transfer Bank, E-wallet, COD
4. **Payment Reminder Automation** - Email/WhatsApp untuk pending payments
5. **Refund Management System** - Handle refund requests dan processing
6. **Payment Reconciliation Report** - Daily/weekly payment reports

### Design Mockup Konsep (dari Analysis):
```
┌─────────────────────────────────────────────┐
│ Payment Verification Queue                  │
├─────────────────────────────────────────────┤
│ ⏳ Pending Verification: 12 payments        │
├─────────────────────────────────────────────┤
│ Order: ORD-2025-001    Customer: John Doe   │
│ Amount: Rp450.000      Bank: BCA            │
│ [View Proof] [Verify ✓] [Reject ✗]         │
├─────────────────────────────────────────────┤
│ Order: ORD-2025-002    Customer: Jane Smith │
│ Amount: Rp350.000      E-wallet: GoPay      │
│ [View Proof] [Verify ✓] [Reject ✗]         │
└─────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema Design

### 1. Payment Proofs Table
```typescript
export const paymentProofs = pgTable("payment_proofs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  paymentMethod: text("payment_method").notNull(), // 'bank_transfer', 'e_wallet', 'cod'
  bankName: text("bank_name"),
  accountName: text("account_name"),
  accountNumber: text("account_number"),
  transactionId: text("transaction_id"),
  amount: integer("amount").notNull(),
  paymentDate: timestamp("payment_date"),
  verificationStatus: text("verification_status").notNull().default("pending"), // 'pending', 'verified', 'rejected'
  verifiedBy: text("verified_by"),
  verifiedAt: timestamp("verified_at"),
  rejectionReason: text("rejection_reason"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

### 2. Payment Methods Settings
```typescript
export const paymentMethods = pgTable("payment_methods", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // 'BCA', 'Mandiri', 'GoPay', 'OVO', etc.
  type: text("type").notNull(), // 'bank_transfer', 'e_wallet', 'cod'
  accountName: text("account_name"),
  accountNumber: text("account_number"),
  instructions: text("instructions"),
  icon: text("icon"),
  isActive: boolean("is_active").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

### 3. Refunds Table
```typescript
export const refunds = pgTable("refunds", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id),
  refundCode: text("refund_code").notNull().unique(),
  amount: integer("amount").notNull(),
  reason: text("reason").notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'approved', 'rejected', 'completed'
  requestedBy: text("requested_by"), // customer name/email
  processedBy: text("processed_by"), // admin username
  processingNotes: text("processing_notes"),
  refundMethod: text("refund_method"), // 'bank_transfer', 'e_wallet', 'store_credit'
  refundProofUrl: text("refund_proof_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  processedAt: timestamp("processed_at"),
});
```

### 4. Update Orders Table
```typescript
// Add these fields to existing orders table:
export const orders = pgTable("orders", {
  // ... existing fields ...
  paymentStatus: text("payment_status").notNull().default("pending"), // 'pending', 'paid', 'failed', 'refunded'
  paymentProofId: varchar("payment_proof_id").references(() => paymentProofs.id),
  paidAt: timestamp("paid_at"),
  // ... existing fields ...
});
```

---

## 🎨 Design Components to Build

### Component 1: PaymentVerificationPage
**Location:** `client/src/pages/admin/PaymentVerificationPage.tsx`

**Features:**
- Payment verification queue dengan pending count
- Filter buttons (All, Pending, Verified, Rejected)
- Search by order code / customer name
- Payment cards dengan order details
- Quick actions: View Proof, Verify, Reject
- Stats cards (Pending, Verified Today, Rejected)
- Date range filter

**Mock Data Structure:**
```typescript
interface PaymentVerification {
  id: string;
  orderCode: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  paymentMethod: string;
  bankName?: string;
  transactionId?: string;
  paymentDate: string;
  proofImageUrl: string;
  status: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}
```

**Design Principles:**
- Use gradient backgrounds untuk sections
- Color-coded status badges (yellow=pending, green=verified, red=rejected)
- Enhanced shadows dan hover effects
- Icons untuk visual clarity
- Responsive table/grid layout
- Loading states dengan skeleton

---

### Component 2: PaymentProofDialog
**Location:** Component dalam PaymentVerificationPage atau separate file

**Features:**
- Full-size image viewer dengan zoom functionality
- Payment details display (method, bank, amount, date)
- Transaction ID display
- Order summary info
- Quick verify/reject actions
- Download proof button
- Close/minimize functionality

**Design:**
- Modal dialog dengan image preview
- Zoom in/out controls
- Details sidebar atau bottom section
- Action buttons (Verify, Reject, Download, Close)

---

### Component 3: PaymentRejectionDialog
**Location:** Component dalam PaymentVerificationPage

**Features:**
- Rejection reason selection (dropdown atau radio buttons)
- Custom rejection message textarea
- Order & payment summary display
- Confirmation buttons
- Toast notification on success

**Rejection Reasons:**
```typescript
const rejectionReasons = [
  "Proof tidak jelas / blur",
  "Nominal tidak sesuai",
  "Rekening tujuan salah",
  "Bukti transfer palsu",
  "Tanggal transfer tidak valid",
  "Lainnya (tulis alasan)",
];
```

---

### Component 4: RefundManagementDialog
**Location:** `client/src/pages/admin/RefundManagementPage.tsx` atau dalam PaymentVerificationPage

**Features:**
- Refund request list dengan status
- Refund details (order, amount, reason)
- Approve/Reject actions
- Refund method selection (Bank Transfer, E-wallet, Store Credit)
- Upload refund proof functionality
- Processing notes field
- Refund history timeline

**Refund Statuses:**
- Pending (yellow)
- Approved (blue)
- Rejected (red)
- Completed (green)

---

### Component 5: PaymentMethodsSettings
**Location:** Dalam Settings Page atau separate page

**Features:**
- Active payment methods list
- Add/Edit/Delete payment methods
- Payment method configuration:
  - Name (BCA, Mandiri, GoPay, etc.)
  - Type (Bank Transfer, E-wallet, COD)
  - Account details
  - Instructions for customers
  - Icon upload
  - Active/Inactive toggle
  - Display order
- Drag-to-reorder functionality

---

### Component 6: PaymentReconciliationReport
**Location:** `client/src/pages/admin/PaymentReconciliationPage.tsx`

**Features:**
- Daily/Weekly/Monthly reconciliation reports
- Total payments received
- Breakdown by payment method
- Verification rate (verified vs total)
- Pending payments value
- Export to Excel/PDF
- Date range selector
- Charts:
  - Payment volume by date (line chart)
  - Payment methods distribution (pie chart)
  - Verification status (bar chart)

---

## 🔧 Backend Implementation Tasks

### Task 1: Update Storage Interface (server/storage.ts)

```typescript
export interface IStorage {
  // ... existing methods ...
  
  // Payment Proof Methods
  createPaymentProof(proof: InsertPaymentProof): Promise<PaymentProof>;
  getPaymentProof(id: string): Promise<PaymentProof | undefined>;
  getPaymentProofByOrderId(orderId: string): Promise<PaymentProof | undefined>;
  getPendingPaymentProofs(): Promise<PaymentProof[]>;
  verifyPaymentProof(proofId: string, verifiedBy: string): Promise<void>;
  rejectPaymentProof(proofId: string, reason: string, rejectedBy: string): Promise<void>;
  
  // Payment Methods
  getAllPaymentMethods(): Promise<PaymentMethod[]>;
  getActivePaymentMethods(): Promise<PaymentMethod[]>;
  createPaymentMethod(method: InsertPaymentMethod): Promise<PaymentMethod>;
  updatePaymentMethod(id: string, updates: Partial<InsertPaymentMethod>): Promise<PaymentMethod>;
  deletePaymentMethod(id: string): Promise<void>;
  
  // Refunds
  createRefund(refund: InsertRefund): Promise<Refund>;
  getRefund(id: string): Promise<Refund | undefined>;
  getAllRefunds(): Promise<Refund[]>;
  getPendingRefunds(): Promise<Refund[]>;
  approveRefund(refundId: string, processedBy: string, notes?: string): Promise<void>;
  rejectRefund(refundId: string, processedBy: string, reason: string): Promise<void>;
  completeRefund(refundId: string, proofUrl: string): Promise<void>;
}
```

### Task 2: Implement API Routes (server/routes.ts)

#### Payment Verification Routes
```typescript
// GET /api/payment-proofs - Get all payment proofs
router.get('/api/payment-proofs', async (req, res) => {
  const { status } = req.query;
  let proofs = await storage.getPendingPaymentProofs();
  
  if (status) {
    proofs = proofs.filter(p => p.verificationStatus === status);
  }
  
  res.json(proofs);
});

// POST /api/payment-proofs - Upload payment proof
router.post('/api/payment-proofs', async (req, res) => {
  const proof = await storage.createPaymentProof(req.body);
  res.json(proof);
});

// POST /api/payment-proofs/:id/verify - Verify payment
router.post('/api/payment-proofs/:id/verify', async (req, res) => {
  const verifiedBy = req.user?.username || 'admin';
  await storage.verifyPaymentProof(req.params.id, verifiedBy);
  
  // Update order status to PAID
  const proof = await storage.getPaymentProof(req.params.id);
  if (proof) {
    await storage.updateOrderStatus(proof.orderId, 'PAID');
  }
  
  res.json({ success: true });
});

// POST /api/payment-proofs/:id/reject - Reject payment
router.post('/api/payment-proofs/:id/reject', async (req, res) => {
  const { reason } = req.body;
  const rejectedBy = req.user?.username || 'admin';
  await storage.rejectPaymentProof(req.params.id, reason, rejectedBy);
  
  res.json({ success: true });
});
```

#### Refund Routes
```typescript
// GET /api/refunds - Get all refunds
router.get('/api/refunds', async (req, res) => {
  const refunds = await storage.getAllRefunds();
  res.json(refunds);
});

// POST /api/refunds - Create refund request
router.post('/api/refunds', async (req, res) => {
  const refund = await storage.createRefund(req.body);
  res.json(refund);
});

// POST /api/refunds/:id/approve - Approve refund
router.post('/api/refunds/:id/approve', async (req, res) => {
  const { notes } = req.body;
  const processedBy = req.user?.username || 'admin';
  await storage.approveRefund(req.params.id, processedBy, notes);
  
  res.json({ success: true });
});

// POST /api/refunds/:id/reject - Reject refund
router.post('/api/refunds/:id/reject', async (req, res) => {
  const { reason } = req.body;
  const processedBy = req.user?.username || 'admin';
  await storage.rejectRefund(req.params.id, processedBy, reason);
  
  res.json({ success: true });
});

// POST /api/refunds/:id/complete - Complete refund
router.post('/api/refunds/:id/complete', async (req, res) => {
  const { proofUrl } = req.body;
  await storage.completeRefund(req.params.id, proofUrl);
  
  // Update order payment status to refunded
  const refund = await storage.getRefund(req.params.id);
  if (refund) {
    await storage.updateOrder(refund.orderId, { paymentStatus: 'refunded' });
  }
  
  res.json({ success: true });
});
```

---

## 📊 Implementation Sequence

### Week 1: Design Components (CURRENT)
**Day 1-2:** Database Schema & Documentation ✅
- [x] Create database schema design
- [x] Create functionality plan document
- [ ] Build PaymentVerificationPage design component
- [ ] Build PaymentProofDialog component
- [ ] Build PaymentRejectionDialog component

**Day 3-4:** Remaining Design Components
- [ ] Build RefundManagementDialog component
- [ ] Build PaymentMethodsSettings component
- [ ] Update AdminLayout navigation
- [ ] Polish all components dengan consistent styling

**Day 5:** Review & Documentation
- [ ] Review design dengan architect
- [ ] Fix any design issues
- [ ] Complete design documentation
- [ ] Prepare for functionality implementation

### Week 2: Backend Implementation
**Day 1-2:** Database Setup
- [ ] Add new tables to schema.ts
- [ ] Run `npm run db:push` untuk sync schema
- [ ] Create insert schemas dengan drizzle-zod
- [ ] Add seed data untuk testing

**Day 3-4:** Storage & API Implementation
- [ ] Implement storage interface methods
- [ ] Implement API routes
- [ ] Add validation dengan Zod
- [ ] Test API endpoints

**Day 5:** Integration Testing
- [ ] Test payment verification workflow
- [ ] Test refund management workflow
- [ ] Fix any backend issues

### Week 3: Frontend Integration & Testing
**Day 1-2:** Connect Frontend to API
- [ ] Replace mock data dengan API calls
- [ ] Implement TanStack Query mutations
- [ ] Add loading states
- [ ] Add error handling

**Day 3-4:** End-to-End Testing
- [ ] Test complete verification workflow
- [ ] Test refund workflow
- [ ] Test payment methods management
- [ ] Fix any integration issues

**Day 5:** Polish & Deployment Prep
- [ ] Final review dan testing
- [ ] Update documentation
- [ ] Deployment preparation

---

## 🧪 Testing Checklist

### Payment Verification
- [ ] Upload payment proof berhasil
- [ ] View payment proof image dengan zoom
- [ ] Verify payment updates order status to PAID
- [ ] Reject payment dengan reason
- [ ] Filter by status (pending/verified/rejected)
- [ ] Search by order code / customer name
- [ ] Stats cards update real-time

### Refund Management
- [ ] Create refund request
- [ ] Approve refund
- [ ] Reject refund dengan reason
- [ ] Complete refund dengan proof upload
- [ ] Refund updates order payment status
- [ ] Refund history timeline

### Payment Methods
- [ ] Add new payment method
- [ ] Edit payment method
- [ ] Delete payment method
- [ ] Toggle active/inactive
- [ ] Reorder payment methods
- [ ] Display on checkout page

### UI/UX
- [ ] Responsive di mobile & desktop
- [ ] Loading states tampil dengan baik
- [ ] Error handling & messages jelas
- [ ] Toast notifications berfungsi
- [ ] Dialog forms validation bekerja
- [ ] Icons dan colors consistent

---

## 🎨 Design Guidelines

### Color Scheme
- **Pending:** Yellow/Amber (#F59E0B) - Needs attention
- **Verified:** Green (#10B981) - Success
- **Rejected:** Red (#EF4444) - Error
- **Processing:** Blue (#3B82F6) - In progress
- **Primary Action:** Cyan (#06B6D4) - Brand color

### Component Styling
- Use gradient backgrounds untuk visual depth
- Shadow system (shadow-sm, shadow-md, shadow-lg)
- Smooth transitions (duration-200/300)
- Enhanced hover states
- Icons dari lucide-react untuk consistency
- Proper spacing dan typography

### Data Display
- Use tables dengan sorting & filtering
- Badge components untuk status
- Stats cards dengan icons
- Charts untuk analytics (recharts)
- Date/time formatting dengan date-fns
- Currency formatting untuk IDR

---

## 🚀 Future Enhancements (Post Phase 2)

1. **Automated Payment Verification**
   - Integration dengan payment gateway webhooks
   - Auto-verify payments dari Midtrans/Xendit
   - OCR untuk extract payment details dari proof image

2. **Payment Reminders**
   - Email notifications untuk pending payments
   - WhatsApp reminders after 24 hours
   - Automated follow-up sequence

3. **Advanced Reconciliation**
   - Bank statement import & matching
   - Discrepancy detection
   - Automated reconciliation reports
   - Multi-currency support

4. **Customer Self-Service**
   - Customer portal untuk upload proof
   - Real-time verification status
   - Refund request dari customer side
   - Payment history tracking

---

## 📝 Notes

- **Image Upload:** Use Cloudinary atau similar service untuk payment proof storage
- **Security:** Validate image uploads (type, size, dimensions)
- **Authentication:** All payment routes harus protected dengan auth middleware
- **Validation:** Gunakan Zod schemas untuk validate request body
- **Audit Trail:** Log semua payment verification actions
- **Email Notifications:** Send email saat payment verified/rejected
- **WhatsApp Integration:** Optional WhatsApp notifications untuk customer

---

**Document ini akan di-update seiring progress implementasi design dan functionality.**

*Last Updated: 5 November 2025*
