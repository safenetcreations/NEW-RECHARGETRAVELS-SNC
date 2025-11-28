# Vendor Registration Platform Implementation Plan

## Overview
A comprehensive platform for small business owners (vendors) to register, manage services, and receive bookings from international tourists.

## 1. Database Schema (Firebase Firestore)

### Collections
- `vendors`
  - `id`: string
  - `personalInfo`: { name, email, phone, whatsapp }
  - `businessInfo`: { type, category, registrationNumber, taxId }
  - `serviceDetails`: { name, description, languages, groupSize, location, cancellationPolicy }
  - `pricing`: { basePrice, peakPrice, discounts }
  - `availability`: { dates, timeSlots, blackoutDates }
  - `documents`: { insuranceUrl, safetyCertUrl, etc. }
  - `media`: { images: [] }
  - `status`: 'incomplete' | 'pending_verification' | 'in_progress' | 'pending_admin_review' | 'active' | 'rejected'
  - `commissionRate`: number
  - `rating`: number
  - `reviewCount`: number
  - `createdAt`: timestamp
  - `updatedAt`: timestamp

- `vendor_bookings`
  - `id`: string
  - `vendorId`: string
  - `touristId`: string
  - `serviceId`: string
  - `date`: timestamp
  - `status`: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  - `amount`: number
  - `commission`: number
  - `payoutStatus`: 'pending' | 'paid_50' | 'paid_full'

## 2. Frontend Pages

### Public
- `/vendor/register`: Multi-step registration wizard.
  - Step 1: Initial Registration
  - Step 2: Identity Verification
  - Step 3: Business Verification
  - Step 4: Service Details
  - Step 5: Pricing
  - Step 6: Availability
  - Step 7: Documentation
  - Step 8: Photos & Media
  - Step 9: Review & Submit

### Vendor Portal (Protected)
- `/vendor/dashboard`: Main overview (Earnings, Pending Bookings).
- `/vendor/bookings`: Manage bookings (Accept/Decline).
- `/vendor/calendar`: Availability management.
- `/vendor/profile`: Edit service details.
- `/vendor/earnings`: Payout history.

### Admin Panel (Existing)
- Add "Vendor Approvals" section.

## 3. Implementation Steps

### Phase 1: Registration Flow
1.  Create `src/pages/vendor/VendorRegistration.tsx`.
2.  Implement the 9-step wizard using `react-hook-form` and `zod`.
3.  Integrate Firebase Storage for document/image uploads.
4.  Save draft progress to Firestore.

### Phase 2: Vendor Dashboard
1.  Create `src/pages/vendor/VendorDashboard.tsx`.
2.  Implement real-time booking listeners (Firestore `onSnapshot`).
3.  Implement "Accept/Decline" logic.

### Phase 3: Admin Integration
1.  Update Admin Panel to list pending vendors.
2.  Implement "Approve/Reject" logic.

### Phase 4: Navigation & SEO
1.  Add "Vendor Registration" to the main website "About" menu.
2.  Create a landing page for potential vendors (`/partner-with-us`) explaining the benefits (SEO optimized).

## 4. Tech Stack
- React + TypeScript
- Tailwind CSS + Shadcn UI
- Firebase (Auth, Firestore, Storage)
- React Hook Form
