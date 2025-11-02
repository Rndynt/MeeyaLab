# Design Guidelines: Minimalist Skincare Online Shop

## Design Approach
**Reference-Based Approach**: Drawing inspiration from minimalist e-commerce leaders like Aesop, The Ordinary, and modern beauty brands that emphasize clean, product-focused design with strong typographic hierarchy.

## Core Design Principles
1. **Radical Minimalism**: Strip away all unnecessary elements
2. **Product-First**: Let product imagery breathe with generous whitespace
3. **Functional Clarity**: Every element serves a clear purpose
4. **Restrained Color Palette**: Black, white, and cyan as the only accent

---

## Typography
- **Primary Font**: Inter or Manrope (Google Fonts)
- **Secondary Font**: Same family, different weights
- **Hierarchy**:
  - Hero Headlines: text-4xl md:text-6xl, font-bold, tracking-tight
  - Section Titles: text-2xl md:text-3xl, font-semibold
  - Product Names: text-base, font-medium
  - Body Text: text-sm md:text-base, font-normal
  - Prices: text-lg, font-semibold
  - Small Text/Labels: text-xs, uppercase, tracking-wide

## Color System
- **Background**: Pure white (#FFFFFF)
- **Text Primary**: Slate-900 (#0F172A)
- **Text Secondary**: Slate-600 (#475569)
- **Borders**: Slate-200 (#E2E8F0) - 1px thin strokes
- **CTA Primary**: Cyan-500 (#06B6D4) / Teal-500 (#14B8A6)
- **CTA Hover**: Cyan-600 / Teal-600
- **Category Active**: Cyan-100 background

## Layout System
**Spacing Units**: Consistent use of Tailwind spacing scale
- **Sections**: py-16 md:py-24 (vertical rhythm)
- **Component Gaps**: gap-4, gap-6, gap-8
- **Grid Gutters**: gap-4 md:gap-6
- **Card Padding**: p-4 md:p-6
- **Container**: max-w-7xl mx-auto px-4 md:px-6

---

## Component Library

### Header (Sticky Navigation)
- White background, border-bottom slate-200 (1px)
- Height: h-16 md:h-20
- Layout: flex justify-between items-center
- Left: Brand "SkinLite." (text-xl font-bold)
- Center: Desktop menu links (hidden on mobile)
- Right: Cart icon with badge count
- Mobile: Hamburger menu (sheet/drawer)
- All text black, links with hover:text-cyan-500

### Hero Section
- Full-width section, white background
- Layout: Two-column grid (text left, image right) on desktop, stacked mobile
- Text Content:
  - Headline: "Daily skincare, delivered." (text-5xl md:text-6xl, font-bold)
  - Subtitle: One-line description (text-lg, text-slate-600)
  - CTA Group: flex gap-4
    - Primary: "Shop products" (bg-cyan-500, white text, px-8 py-3, rounded-md)
    - Secondary: "Check your order" (border border-slate-200, px-8 py-3, rounded-md)
- Image: Clean product photography on white background (right side, rounded-lg)
- Spacing: py-16 md:py-24

### Category Pills
- Horizontal scroll container (overflow-x-auto scrollbar-hide)
- Pills: px-4 py-2, rounded-full, border border-slate-900, text-sm
- Active state: bg-cyan-100, border-transparent
- Gap: gap-2

### Product Grid
- Grid layout:
  - Mobile: grid-cols-2
  - Desktop: grid-cols-4
  - Gap: gap-4 md:gap-6

### Product Card
- White background, border border-slate-200, rounded-lg
- Image: aspect-square, object-cover, rounded-t-lg
- Content: p-4
- Product name: text-base font-medium, line-clamp-2
- Price: text-lg font-semibold, mt-2 (format: "Rp120.000")
- Button: "Add to cart" - full width, bg-cyan-500, text-white, py-2, rounded-md, mt-4

### Cart Drawer (Sheet)
- Slide from right, white background
- Header: "Your Cart" (text-xl font-semibold), close button
- Items: List with image thumbnail, name, qty controls, price
- Footer: Total + "Go to checkout" button (cyan-500, sticky bottom)

### Checkout Form
- Two-column layout (form left, summary right on desktop)
- Form fields: 
  - Full width inputs with labels
  - Border slate-200, focus:border-cyan-500, rounded-md, px-4 py-3
  - Required fields marked with asterisk
- Order Summary Card: Sticky on desktop, border slate-200, p-6
- Payment button: Full width, bg-cyan-500, py-4, text-lg font-semibold

### Check Order Page
- Centered card: max-w-md
- Input for order code or phone
- Search button: cyan-500
- Results: Timeline component showing order status with dots and lines

### Contact Page
- Centered content: max-w-2xl
- WhatsApp button: Large, green (#25D366), with WhatsApp icon
- Address/info in simple text blocks

### Admin Dashboard
- Sidebar navigation: bg-slate-50, border-right
- Main content: white background, p-6
- Tables: Minimal borders, hover:bg-slate-50 on rows
- Action buttons: Small, outline style
- Forms: Same as public but in modal/dialog

---

## Animations
**Minimal approach** - only essential feedback:
- Button hover: Subtle brightness change (no transform)
- Cart drawer: Slide-in transition (300ms)
- Product image hover: Slight opacity change to 0.9
- No scroll animations, no complex transitions

---

## Images
### Hero Section
- **Type**: Clean product photography (skincare bottles/jars on pure white background)
- **Placement**: Right side of hero on desktop (50% width), below text on mobile
- **Treatment**: Rounded corners (rounded-lg), subtle shadow optional
- **Aspect**: Natural product photography, not forced square

### Product Images
- **Type**: Square product shots on white background
- **Placement**: Top of each product card
- **Treatment**: Clean, no borders, rounded-t-lg
- **Consistency**: All products should have similar lighting/styling

### Category Visuals
- Optional small icon/illustration per category
- Simple line icons in black, 24x24px

**Image Strategy**: Product-focused photography with clinical, minimalist aesthetic. No lifestyle imagery, no busy backgrounds. Every image reinforces the "clean skincare" positioning.