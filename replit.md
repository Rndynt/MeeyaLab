# SkinLite - Minimalist Skincare Online Shop

## Overview
SkinLite is a minimalist e-commerce platform for skincare products, designed as a guest-checkout focused online shop. It enables customers to browse products, add items to a cart, and complete purchases without requiring an account. The platform includes an admin panel for product and order management, features Midtrans payment integration, and utilizes WhatsApp for order notifications. The project emphasizes a clean, minimalist design inspired by high-end skincare brands, using a black/white color scheme with cyan accents.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework & Tooling**: React with TypeScript, Vite, Wouter for routing, TanStack Query for data fetching.
- **UI/UX Decisions**:
    - **Design System**: Minimalist aesthetic with a premium elegant color palette (soft beige/cream backgrounds, slate for text, dark slate for CTAs), Inter font family, bold typography for headlines.
    - **Components**: Utilizes shadcn/ui (built on Radix UI) and Tailwind CSS for styling.
    - **Responsive Design**: Mobile-first approach.
    - **Key Features**: Integrated Header+Hero with auto-playing carousel, guest checkout, shopping cart (drawer UI), product filtering, order tracking, admin dashboard.
    - **Component Redesigns**: Redesigned Toast Notifications, Dialog components (fixed header/footer), Product Cards, Checkout page (collapsible sections, voucher system), Footer (three-column responsive layout), Admin layout (responsive, "Visit Store" link).
    - **Product Detail Page**: Dedicated page with detailed product info (description, ingredients, usage, benefits), responsive layout, and Add to Cart functionality.
    - **Admin Order Management**: Detailed order view with customer info, shipping, order summary, items, notes, and status updates. Orders are grouped by date and include status filtering.
    - **Add to Cart Design**: Icon-only buttons using Plus icon (not ShoppingCart) with square shape and rounded corners (rounded-md), includes full accessibility support (aria-label, title tooltips), shows Check icon when item added successfully.
    - **Admin Sidebar**: Collapsible/expandable sidebar (w-64 expanded, w-20 collapsed) with smooth transitions, submenu support for nested navigation, active state highlighting (cyan), and mobile responsive design using Sheet component. When collapsed, clicking a menu with submenus expands the sidebar first (requires two clicks for submenu access).

### Backend
- **Server Framework**: Express.js with TypeScript for API endpoints.
- **Data Layer**: Drizzle ORM, Neon PostgreSQL (serverless), schema-first approach.
- **API Design**: RESTful API (`/api` prefix), CRUD operations abstracted via a storage interface.
- **Authentication**: Session-based authentication for the admin panel; no authentication for public users (guest checkout).

### Data Schema
- **Entities**: Users, Products (id, name, price, category, brand, imageUrl, stock, isActive, bpom, certificates, description, ingredients, usage, benefits, size), Orders (orderCode, customerName, phone, total, status, items).
- **Order Statuses**: PENDING_PAYMENT, PAID, PROCESSING, SHIPPED, COMPLETED, CANCELLED.

## External Dependencies
- **Payment Gateway**: Midtrans (server-side Snap integration, webhooks).
- **Notification Service**: WhatsApp notifications for order updates.
- **Database**: Neon PostgreSQL (serverless).
- **Deployment Configuration**: `netlify.toml` for frontend deployment (though Replit is recommended for full-stack).