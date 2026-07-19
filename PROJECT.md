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

### Admin access

Admin claims are managed only through the Firebase Admin SDK. Authenticate locally
with Application Default Credentials, then grant or revoke access with:

```sh
export GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json
npm run admin:claim -- grant reader@example.com
npm run admin:claim -- revoke reader@example.com
```

The command preserves unrelated custom claims and revokes refresh tokens. The user
must sign in again before the updated claim is available to the application. A
previously issued token can remain valid for up to one hour after revocation. Never
commit a service-account credential file.

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
9. **A catalog that feels browsed, not queried.** Filters use familiar bookstore language, results retain an editorial pace, and book details prioritize story and bookseller context before technical metadata.
10. **Local typed seed data before Firebase wiring.** The catalog currently uses a realistic typed development collection so UI behavior can be completed and evaluated without credentials. Its shape directly mirrors the planned Firestore documents and will move behind the catalog service later.
11. **Honest pre-configuration authentication.** Account screens remain polished before Firebase credentials exist, but clearly explain that real account actions require a configured project. There is no fake successful login state.
12. **Guest-first shopping bag.** Visitors can build a persistent device-local bag immediately. After authentication, guest quantities merge into the user-owned Firestore cart and subsequent mutations are stored remotely.
13. **Security is part of the feature.** Firestore rules restrict customer profiles, carts, and wishlists to their owner; privileged catalog writes require an admin custom claim.
14. **Wishlist intent survives authentication.** If a signed-out reader taps a heart, the pending book is remembered only for the current browser session, the reader signs in, and the book is then saved to their Firestore wishlist.
15. **Reader preferences stay modest and useful.** Profiles collect only a display name, favorite shelves, and an optional newsletter preference—enough to personalize future recommendations without turning the bookstore into a data form.
16. **Admin access is proven twice.** The interface checks the Firebase `admin` ID-token claim before rendering, while Firestore rules independently enforce every privileged write. An unconfigured project exposes only a clearly labeled, non-writing preview.
17. **One catalog source after configuration.** Public pages load active Firestore books and fall back to typed development data only when Firebase is unavailable. Admin publication changes therefore affect the real storefront.
18. **Archiving over deletion.** Books leave public shelves without losing their record, protecting future cart, wishlist, and order references.
19. **Two valid cover paths.** Books may use an uploaded photographic/illustrated cover or the cohesive generated bookshop treatment. This keeps development content beautiful while supporting real catalog assets later.
20. **Storage validates twice.** The form rejects unsupported types and oversized files immediately; Firebase Storage rules independently require an admin claim, image MIME type, and a size below 5 MB.
21. **Inventory belongs near the list.** Frequent shelf counts can be adjusted from the management table without opening the full editorial form, while `inStock` remains derived from the saved count.
22. **Business logic stays testable outside React.** Cart transitions and guest/user merges live in a pure reducer module, while catalog and upload validation remain deterministic utilities. Fast tests can therefore cover the important edge cases without rendering the application.
23. **Security rules are executable requirements.** Firestore and Storage permissions are tested against Firebase's local emulators for public catalog visibility, owner-only customer data, admin-only catalog writes, and safe cover uploads.
24. **Navigation and dialogs manage focus deliberately.** Route changes move keyboard focus to the new main content; admin dialogs trap focus, close with Escape, restore the prior focus target, and prevent background scrolling.

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
- [x] Typed book model and realistic development catalog
- [x] Searchable, sortable, filterable catalog
- [x] URL-synchronized catalog state and pagination
- [x] Responsive desktop sidebar and mobile filter drawer
- [x] Editorial book-detail pages
- [x] Related-book recommendations and missing-book state
- [x] Firebase email/password authentication service and session provider
- [x] Registration, login, password reset, and protected account route
- [x] Guest shopping bag with device persistence
- [x] Authenticated Firestore cart and guest-cart merge
- [x] Working add-to-bag actions across homepage, catalog, and book details
- [x] Responsive cart, delivery threshold, quantities, and empty state
- [x] Customer account overview and sign-out flow
- [x] Firestore ownership and admin security rules
- [x] Firestore-backed wishlist with optimistic heart interactions
- [x] Wishlist intent restoration after sign-in
- [x] Responsive wishlist page with loading and empty states
- [x] Editable display name and reader preferences
- [x] Profile success, error, and loading feedback
- [x] Custom-claim protected admin routes
- [x] Dedicated responsive bookseller workspace
- [x] Admin dashboard and catalog health metrics
- [x] Searchable, status-aware book management table
- [x] Archive confirmation and soft-archive workflow
- [x] Shared create/edit book form and publication controls
- [x] Firestore-backed public catalog with development fallback
- [x] Starter-catalog import for an empty Firestore project
- [x] Firebase Storage cover upload and progress feedback
- [x] Uploaded-cover rendering throughout the storefront
- [x] Admin-only Storage rules with MIME and size validation
- [x] Quick inventory adjustment dialog
- [x] One-click restoration of archived books
- [x] Cart reducer, catalog utility, and cover-validation tests (9 tests)
- [x] Firestore and Storage emulator rules tests (7 tests)
- [x] Route-change focus management and live cart-count announcements
- [x] Keyboard-safe admin dialogs with focus trapping and Escape dismissal

## Pending roadmap

### Phase 2 — Catalog

- [x] Define typed book and genre models
- [x] Add development seed data
- [x] Build browse page and responsive filters
- [x] Add search, sort, genre, format, price, and stock filters
- [x] Synchronize filters with URL parameters
- [x] Build book detail pages and related-book recommendations

### Phase 3 — Authentication and customer features

- [x] Firebase email/password authentication
- [x] Registration, login, password recovery, and protected routes
- [x] Guest and authenticated shopping carts
- [x] Guest-cart merge after sign-in
- [x] Wishlist and profile pages

### Phase 4 — Admin

- [x] Admin custom claims and route guard
- [x] Firestore and Storage security rules
- [x] Book list, create, edit, archive, and restore-ready workflows
- [x] Cover upload and inventory management

### Phase 5 — Quality

- [x] Automated reducer and utility tests
- [ ] End-to-end tests for major customer journeys
- [ ] Full keyboard and screen-reader review
- [ ] Responsive and performance pass
- [x] Firebase Emulator validation

## Recommended next feature

Add browser-level tests for the browse-to-bag, authentication, wishlist, and admin publication journeys. Pair that work with a full keyboard/screen-reader audit and a measured mobile performance pass before introducing checkout or further catalog features.
