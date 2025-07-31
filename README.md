# Hotel Booking Management System (Next.js)

## Introduction
This project is a full-featured hotel booking management web application built with Next.js, React, and TypeScript. It is designed for both hotel owners and guests, providing a seamless experience for managing hotel rooms, bookings, and user interactions. The application features a modern, responsive UI using Tailwind CSS and a modular component architecture for scalability and maintainability.

---

## Features

- **Hotel Listings:**
  - Browse a list of available hotels with images, descriptions, and amenities.
  - Search and filter hotels by name, location, or features.
- **Booking Management:**
  - Owners can view all bookings in a sortable, searchable table.
  - Update booking status (confirmed, pending, cancelled) directly from the UI.
  - View detailed booking information in a modal dialog.
- **Favorites:**
  - Users can add hotels to their favorites for quick access.
- **Owner Dashboard:**
  - Manage rooms, bookings, and view statistics (total, confirmed, pending, cancelled bookings).
- **Authentication:**
  - Modal-based login and registration for secure access.
- **Responsive Design:**
  - Optimized for both desktop and mobile devices.
- **Reusable UI Components:**
  - Includes cards, dialogs, tables, badges, forms, and more for a consistent look and feel.

---

## Technologies Used

- **Next.js** (App Router, SSR/SSG)
- **React** (with hooks and functional components)
- **TypeScript** (type safety)
- **Tailwind CSS** (utility-first styling)
- **Lucide React** (icon library)
- **PNPM** (fast package manager)

---

## Setup & Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd hotel-booking-nextjs
   ```
2. **Install dependencies:**
   ```sh
   pnpm install
   ```
3. **Run the development server:**
   ```sh
   pnpm dev
   ```
4. **Open the app:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

- **For Owners:**
  - Log in to access the owner dashboard.
  - View and manage all bookings, update statuses, and see booking statistics.
  - Add or edit hotel and room details (extendable for backend integration).
- **For Guests:**
  - Browse hotels, view details, and make bookings (demo data only).
  - Mark favorite hotels for easy access.

---

## Project Structure

- `src/app/` - Application pages and routing (Next.js App Router)
- `src/components/` - Reusable UI and feature components
- `src/components/owner/booking-management.tsx` - Main booking management logic and UI
- `src/hooks/` - Custom React hooks (e.g., authentication, favorites)
- `src/lib/` - Utility functions, types, and mock data
- `public/` - Static assets (images, logos)
- `styles/` - Global styles (Tailwind CSS)

### Example Folder Structure
```
components.json
next-env.d.ts
next.config.mjs
package.json
pnpm-lock.yaml
postcss.config.mjs
tailwind.config.ts
tsconfig.json
public/
src/
  app/
  components/
    owner/
      booking-management.tsx
    hotels/
    ui/
    ...
  hooks/
  lib/
  styles/
```

---

## Component Details

### Booking Management (`src/components/owner/booking-management.tsx`)
- Displays all bookings in a table with search and filter functionality.
- Shows booking statistics (total, confirmed, pending, cancelled).
- Allows owners to view booking details in a dialog and update booking status.
- Uses sample/mock data for demonstration; ready for backend integration.

### UI Components
- Custom components for buttons, cards, dialogs, tables, badges, forms, and more.
- Located in `src/components/ui/` for easy reuse and extension.

### Hooks
- `use-auth.ts`: Handles authentication logic.
- `use-favorites.ts`: Manages user favorite hotels.
- `use-toast.ts`: Provides toast notifications for user feedback.

---

## Customization & Extending

- **Backend Integration:**
  - Replace mock data with API calls to connect to a real backend.
  - Integrate authentication and booking endpoints as needed.
- **UI/UX Enhancements:**
  - Add more filters, sorting, and pagination to hotel and booking lists.
  - Improve mobile experience and accessibility.
- **Feature Expansion:**
  - Add user profile management, reviews, payment integration, etc.

---

## Future Improvements

- Connect to a real database and backend API for persistent data.
- Implement user registration, login, and role-based access control.
- Add hotel/room creation and editing for owners.
- Enable real booking and payment processing.
- Add automated tests and CI/CD pipeline.

---

## Credits
- UI icons by [Lucide](https://lucide.dev/)
- Built with [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/)

## License
This project is for educational purposes.
