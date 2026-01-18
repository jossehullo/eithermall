# Copilot Instructions for Eithermall

## Overview
Eithermall is a full-stack e-commerce platform with a Next.js/React client (`client/`) and a Node.js/Express/MongoDB backend (`server/`). The client and server communicate via RESTful APIs. Authentication is JWT-based, and user state is managed in localStorage on the client.

## Architecture
- **Client (`client/`)**: Next.js 15+ app using the `/src/app` directory structure. Context providers (e.g., `AuthContext`) wrap the app for global state. Components are organized by feature (e.g., `components/admin/`, `components/products/`).
- **Server (`server/`)**: Express app with modular routing (`routes/`), controllers (`controllers/`), and models (`models/`). MongoDB is used for persistence. Auth, product, user, and admin routes are separated for clarity.
- **Data Flow**: Client fetches data from server endpoints (e.g., `/api/auth`, `/api/products`). Auth tokens are stored in localStorage and sent with requests.

## Key Workflows
- **Client Dev**: Run `npm run dev` in `client/` for hot-reloading Next.js server (default: port 3000).
- **Server Dev**: Run `npm start` in `server/` to start Express backend (default: port 5000).
- **Linting**: Use `npm run lint` in `client/` for ESLint checks.
- **Build**: Use `npm run build` in `client/` for production build (Turbopack enabled).

## Project-Specific Patterns
- **Auth**: Use `AuthContext` (`src/context/AuthContext.tsx`) for login/register/logout. Admin-only routes/components use `AdminRoute` for access control.
- **Routing**: Next.js app router is used (`src/app/`). Route folders (e.g., `admin/`, `cart/`, `products/`) map to pages and layouts. Dynamic routes use `[id]` syntax.
- **Styling**: Tailwind CSS and custom CSS modules (e.g., `admin.css`). Font is set via Next.js font loader.
- **API Calls**: Use `fetch` or `axios` for REST calls. Endpoints are hardcoded to `http://localhost:5000/api/...` in context and utils.
- **State**: User state is persisted in localStorage. On login/register, update localStorage and context state.

## Integration Points
- **External Libraries**: Uses Radix UI, Lucide, Framer Motion, Tailwind Variants, Axios.
- **Uploads**: Server exposes `/uploads` as static. Use `multer` for file uploads.
- **Environment**: Server expects `.env` with `MONGO_URI` and `JWT_SECRET`.

## Examples
- **Admin Route Protection**: See `src/components/AdminRoute.tsx` for redirect logic.
- **Auth Flow**: See `src/context/AuthContext.tsx` for login/register/logout implementation.
- **API Endpoint Example**: See `server/controllers/authController.js` for user registration/login.

## Conventions
- Use feature-based folder structure for both client and server.
- Prefer context providers for global state.
- Use RESTful naming for API endpoints.
- Store JWT and user info in localStorage on client.
- Use `.env` for sensitive server config.

---
For questions or unclear patterns, review `README.md` in `client/` and key files referenced above. Update this file as new conventions emerge.