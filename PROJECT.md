# The Lantern & Leaf — Project Guide

Last updated: 15 July 2026

## Product vision

The Lantern & Leaf is a fictional independent bookstore application for a university project. It should feel like entering a quiet, welcoming neighborhood bookshop: editorial rather than commercial, tactile rather than glossy, and memorable without sacrificing accessibility or ease of use.

The project prioritizes a small number of deeply polished customer journeys over a large collection of shallow features.

## Technical architecture

- React 19, Vite, and TypeScript
- Tailwind CSS 4 with the design tokens and site-wide component styles established in `src/styles/globals.css`
- React Router with nested storefront, authentication, account, and admin layouts
- Firebase Authentication, Cloud Firestore, and Firebase Storage
- Feature-oriented source organization under `src/features`
- Typed Firebase access isolated behind feature service modules
- Context and reducers for genuinely global client state; URL parameters for catalog search and filters

### Planned source organization

```text
src/
├── app/                 Application composition and routing
├── components/          Shared UI, feedback, and layout components
├── features/            Auth, catalog, cart, wishlist, account, and admin
├── hooks/               Cross-feature React hooks
├── lib/firebase/        Firebase initialization and shared clients
├── styles/              Design tokens and global styles
└── types/               Cross-feature TypeScript types
```

## Route map

- `/` — homepage
- `/books` — searchable and filterable catalog
- `/books/:slug` — book detail
- `/staff-picks` — bookseller recommendations
- `/new-arrivals` — recent additions
- `/about` — shop story and visit information
- `/cart` — shopping cart
- `/login`, `/register`, `/forgot-password` — authentication
- `/account/profile`, `/account/wishlist` — protected customer pages
- `/admin`, `/admin/books`, `/admin/books/new`, `/admin/books/:bookId/edit` — admin-only routes

## Firebase model

- `books/{bookId}` — catalog, inventory, merchandising, and search metadata
- `genres/{genreId}` — controlled genre taxonomy
- `users/{uid}` — public profile preferences and a read-only role mirror
- `users/{uid}/cart/{bookId}` — authenticated cart entries
- `users/{uid}/wishlist/{bookId}` — wishlist entries
- `orders/{orderId}` — optional immutable order snapshots

Book and genre imagery will live in Firebase Storage. Admin authorization will use custom claims and be enforced by Firestore and Storage rules, never only by route visibility.

## State management decisions

- Authentication: application-level context subscribing to Firebase Auth
- Cart: context plus reducer; local storage for guests, Firestore for signed-in users, merge on sign-in
- Wishlist: focused Firestore-backed hook for signed-in users
- Catalog: Firestore data in a feature service; search, sort, filter, and pagination in the URL
- Form state: local to each form, with shared validation rules

Redux is intentionally deferred because the current state domains are small and well bounded.

## Design system

### Visual language

Warm paper, walnut wood, oxblood red, moss green, muted ochre, editorial serif typography, and occasional handwritten notes. Physical-book cues should feel subtle and convincing rather than themed or theatrical.

### Core tokens

- Paper: `#F3ECDF`
- Light paper: `#FFFAF1`
- Ink: `#2A211B`
- Muted ink: `#776B5E`
- Walnut: `#624537`
- Burgundy: `#7D343E`
- Moss: `#627055`
- Ochre: `#C18A42`
- Border: `#D8CCBA`

### Typography

- Fraunces: display headings and editorial statements
- DM Sans: navigation, controls, prices, and forms
- Caveat: short human notes only

### Interaction principles

- Motion should resemble gently handling a book: short, soft, and purposeful.
- Touch targets should be at least 44px where practical.
- Every interactive surface needs a visible keyboard focus state.
- Reduced-motion preferences are always respected.
- Color is never the only status indicator.

## Design decisions

1. **A fictional brand with a clear identity.** “The Lantern & Leaf” gives the interface a voice and avoids generic bookstore copy.
2. **An immersive photographic hero.** The opening viewport establishes atmosphere immediately, with intentional negative space for legible copy.
3. **Illustrated book covers for initial data.** Purpose-built covers make the sample catalog cohesive and avoid dependence on mismatched copyrighted cover art.
4. **Editorial pacing.** Dense book grids alternate with quiet quotation and visit sections, creating the rhythm of wandering through a real shop.
5. **Restrained handwriting.** The handwritten face appears only on staff notes and small human touches, preserving readability.
6. **Useful placeholder routes.** Homepage navigation already works while future features are developed one at a time.
7. **URL-owned catalog state.** Future search/filter results will be shareable and behave correctly with browser history.
8. **Optimized atmospheric imagery.** The original hero is delivered as a 112 KB WebP while its full-quality source remains available, preserving the opening mood without an excessive page-weight penalty.

## Completed

- [x] Architecture and product direction
- [x] React, Vite, and TypeScript project foundation
- [x] Tailwind CSS integration and global design tokens
- [x] React Router foundation and storefront layout
- [x] Firebase configuration boundary and environment template
- [x] Responsive header, mobile navigation, and footer
- [x] Polished responsive homepage
- [x] Original bookstore hero artwork
- [x] Staff-pick cards and initial fictional book content
- [x] Category exploration, visit, and newsletter sections
- [x] Baseline keyboard focus and reduced-motion support

## Pending roadmap

### Phase 2 — Catalog

- [ ] Define typed book and genre models
- [ ] Add development seed data
- [ ] Build browse page and responsive filters
- [ ] Add search, sort, genre, format, price, and stock filters
- [ ] Synchronize filters with URL parameters
- [ ] Build book detail pages and related-book recommendations

### Phase 3 — Authentication and customer features

- [ ] Firebase email/password authentication
- [ ] Registration, login, password recovery, and protected routes
- [ ] Guest and authenticated shopping carts
- [ ] Guest-cart merge after sign-in
- [ ] Wishlist and profile pages

### Phase 4 — Admin

- [ ] Admin custom claims and route guard
- [ ] Firestore and Storage security rules
- [ ] Book list, create, edit, archive, and restore workflows
- [ ] Cover upload and inventory management

### Phase 5 — Quality

- [ ] Automated reducer and utility tests
- [ ] End-to-end tests for major customer journeys
- [ ] Full keyboard and screen-reader review
- [ ] Responsive and performance pass
- [ ] Firebase Emulator validation

## Recommended next feature

Build the catalog and book-detail experience next. It establishes the central data model and reusable book components before authentication, cart, wishlist, and admin features depend on them.
