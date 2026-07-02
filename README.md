# School ERP Frontend

Complete frontend structure for School ERP system built with Next.js, TypeScript, and Tailwind CSS.

## Structure

This frontend follows a modular, role-based architecture with clear separation of concerns:

- **Pages**: Organized by role (auth, super-admin, admin, teacher, student, parent, public)
- **Components**: Reusable UI components and layouts
- **Services**: API service layer for all backend communication
- **Utils**: Types, constants, mappers, and API client
- **Hooks**: Custom React hooks (e.g., useAuth)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Features

- Role-based routing and access control
- Centralized API service layer
- Data transformation via mappers
- Auth guards and role guards
- Responsive dashboard layouts
- Clean, modular architecture

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Project Structure

```
frontend/
├── pages/          # Next.js pages (by role)
├── components/     # Reusable components, layouts, guards
├── services/       # API service layer
├── hooks/          # Custom React hooks
├── utils/          # Types, constants, mappers, API client
└── app/            # Global styles and config
```
