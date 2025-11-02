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