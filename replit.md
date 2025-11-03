# SkinLite - Minimalist Skincare Online Shop

## Overview

SkinLite is a minimalist e-commerce platform for skincare products built as a guest-checkout focused online shop. The application allows customers to browse products, add items to cart, and complete purchases without creating an account. It features an admin panel for managing products and orders, with Midtrans payment integration and WhatsApp notifications for order updates.

The project follows a clean, minimalist design philosophy inspired by brands like Aesop and The Ordinary, with a black/white color scheme and cyan accent colors.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- React with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query for server state management and data fetching

**UI Component System**
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Component-based architecture with reusable UI elements
- Responsive design with mobile-first approach

**Design System**
- Premium elegant color palette with soft beige/cream backgrounds (#F5F1ED, #F9E4D4, #EDE8E3, #F8F4F0)
- Slate color palette for text (900 for primary, 600 for secondary)
- Dark slate (900) for primary CTAs replacing previous cyan
- Consistent spacing using Tailwind's spacing scale
- Inter font family for typography
- Bold, large typography for hero headlines (4xl-7xl responsive)

**Key Frontend Features**
- Integrated Header+Hero component with seamless design
- Auto-playing carousel with 4 slides (5-second intervals)
- Manual carousel navigation with prev/next buttons
- Slide indicators (dots and numeric counter)
- Smooth slide transitions with slide-specific backgrounds
- Guest checkout flow (no user authentication required for customers)
- Shopping cart with drawer UI pattern
- Product filtering and categorization
- Order tracking by order code
- Admin dashboard with authentication

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and API endpoints
- TypeScript for type safety across the stack
- Custom middleware for request logging and JSON parsing

**Data Layer**
- Drizzle ORM for database operations
- Neon PostgreSQL (serverless) as the database
- Schema-first approach with TypeScript types generated from database schema
- In-memory storage abstraction (MemStorage) as fallback/development option

**API Design**
- RESTful API with `/api` prefix for all routes
- CRUD operations abstracted through storage interface
- Session-based approach for potential future authentication

**Current Storage Interface**
- User management methods (getUser, getUserByUsername, createUser)
- Designed to be extended for products, orders, and other entities
- Abstraction allows swapping between memory and database implementations

### External Dependencies

**Payment Integration**
- Midtrans payment gateway (planned)
- Server-side Snap integration
- Webhook handling for payment status updates
- Environment-based configuration (MIDTRANS_SERVER_KEY, MIDTRANS_CLIENT_KEY)

**Notification Service**
- WhatsApp notifications for order confirmations and payment settlements
- Triggered via webhooks after order creation and payment completion

**Database**
- Neon PostgreSQL (serverless)
- Connection via DATABASE_URL environment variable
- WebSocket support for serverless environments

**Development Tools**
- Replit-specific plugins for development (cartographer, dev banner, runtime error overlay)
- Hot module replacement (HMR) through Vite

**Deployment Considerations**
- Originally designed for Netlify deployment with serverless functions
- Current structure supports Express server deployment
- Database migrations managed through Drizzle Kit

### Data Schema

**Current Schema**
- Users table with UUID primary keys
- Username/password authentication fields
- Extensible schema design for products, orders, categories

**Planned Entities** (based on component structure)
- Products: name, price, category, brand, stock, imageUrl, isActive
- Orders: orderCode, customerName, phone, total, status, items
- Order statuses: PENDING_PAYMENT, PAID, PROCESSING, SHIPPED, COMPLETED, CANCELLED

### Authentication & Authorization

**Admin Access**
- Login-protected admin panel
- Session-based authentication approach
- Admin routes: /admin/login, /admin/dashboard, /admin/products, /admin/orders

**Public Access**
- No authentication required for browsing and checkout
- Guest checkout workflow

### File Structure

**Client Structure**
- `/client/src/components` - Reusable UI components
  - `HeroHeader.tsx` - Integrated header and hero carousel component (replaces separate Header and Hero)
  - `Header.tsx` - Original header component (deprecated, use HeroHeader)
  - `Hero.tsx` - Original hero component (deprecated, use HeroHeader)
- `/client/src/pages` - Route-based page components
- `/client/src/lib` - Utilities and query client setup
- `/client/src/hooks` - Custom React hooks

**Server Structure**
- `/server/index.ts` - Express server entry point
- `/server/routes.ts` - API route definitions
- `/server/storage.ts` - Data access layer abstraction
- `/server/db.ts` - Database connection and Drizzle setup

**Shared**
- `/shared/schema.ts` - Database schema and TypeScript types shared between client and server

## Recent Changes

### UI/UX Improvements (November 2025)

**Admin Dashboard Enhancements**
- Made admin layout fully responsive for mobile/tablet/desktop
- Added collapsible sidebar menu for mobile devices using Sheet component
- Mobile header with hamburger menu for small screens
- Desktop maintains fixed sidebar navigation
- Updated admin routes to include Settings page

**Settings Page**
- Created comprehensive settings page at `/admin/settings`
- Configurable application information (name, tagline, description)
- Contact information management (email, phone, WhatsApp, address)
- Social media handles (Instagram, Facebook)
- Form validation and toast notifications for user feedback

**Product Card Redesign**
- More elegant and minimalist typography
- Reduced price text size for better visual hierarchy
- Improved spacing and padding for cleaner look
- Lighter borders and refined hover states
- Consistent styling across Home and Products pages

**Header Improvements**
- Fixed cart icon and badge alignment
- Smaller, better-positioned cart count indicator
- Improved visual consistency

**Checkout Page Redesign**
- Fixed header overlap issue with proper top padding
- Implemented collapsible form sections for better UX
- Each section shows completion status with checkmark indicator
- Sections: Contact Information, Shipping Address, Shipping Method
- Smooth expand/collapse animations
- Visual feedback for completed sections

**Voucher/Promo System**
- Added voucher code input in order summary
- Three sample vouchers implemented:
  - WELCOME10: 10% discount
  - SAVE20K: Rp20,000 flat discount
  - FREESHIP: Free shipping
- Real-time discount calculation
- Visual feedback for applied vouchers
- Safe calculation prevents negative totals
- Discount display in order summary

### Second Wave of UI/UX Improvements (November 2025)

**Toast Notification Redesign**
- Redesigned toast component with minimalist, elegant aesthetic
- Updated to softer slate color palette (white bg, slate-200 border for default)
- Added new "success" variant with emerald colors for positive feedback
- Improved destructive variant with softer red colors
- Reduced shadow from shadow-lg to shadow-sm for cleaner appearance
- Better padding and spacing (p-4 instead of p-6)
- Enhanced typography with font-medium and tracking-tight
- Improved close button styling with better hover states

**Product Schema Enhancements**
- Created complete product schema in `shared/schema.ts`
- Added required fields: id, name, price, category, brand, imageUrl, stock, isActive
- Added optional fields: bpom (BPOM certification number), certificates (array of certifications)
- Generated insert schema and TypeScript types for type safety
- All products now include brand information for consistency

**Admin Product Management**
- Extended admin product form with new fields
- Added Brand input (required) for all products
- Added BPOM input (optional) with example placeholder
- Added Certificates input (optional, comma-separated values)
- Form automatically parses certificates from comma-separated string to array
- Proper validation and serialization for all new fields
- Updated mock products to include brand "SkinLite"

**Order Summary & Item Display**
- Replaced text-based layout with clean borderless tables
- Checkout page order summary now uses table structure
- Check order page items list now uses table structure
- Three-column layout: Product name (left), Quantity (center), Price (right)
- Subtle borders between rows (border-slate-100)
- Consistent spacing with py-3 padding
- Minimalist design with proper alignment and typography
- No border on last row for cleaner appearance