# FFA Intervener App

A modern, full-featured web application for managing projects and applications within the FFA (Forum for the Future of Agriculture) ecosystem. The platform allows interveners to create projects, submit applications, and track their progress.

## Overview

The FFA Intervener App is a React-based web application designed for interveners to manage project proposals and applications. Users can create projects, submit applications for existing projects, and track the status of their submissions.

## Key Features

### Authentication & Authorization

- User registration and login with email/password
- Session management with automatic logout on inactivity (5 minutes)
- Secure token-based authentication with JWT
- Organization-based user grouping

### Project Management

- **Create & Edit Projects**: Create new projects with details like scope, budget, timeline
- **Project Listing**: View all created projects with filtering and search capabilities
- **Project Details**: Access comprehensive project information and submitted applications

### Application Management

- **Submit Applications**: Submit applications for FFA projects
- **Multi-step Workflow**: Applications progress through defined steps
- **Status Tracking**: Monitor application status (Draft, Approved, Rejected)
- **Application Details**: View full application history and details

### Dashboard & Analytics

- **Overview Statistics**: Quick view of projects and applications
- **Recent Activity**: Display latest projects and applications
- **Quick Actions**: Fast access to create new projects or view submissions

### Internationalization (i18n)

- Multi-language support (English, French, Arabic)
- Context-based language switching
- Localized UI components and messages
- Persistent language preference

### Theme & UI

- Light/Dark theme support with context management
- Responsive design that works on desktop and mobile
- Component library built on Radix UI and shadcn/ui
- Modern, accessible UI components
- Toast notifications for user feedback

## Technology Stack

### Frontend Framework & Build

- **React 19**: Modern React with latest features
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool with hot module replacement
- **React Router**: Client-side routing
- **Bun**: Package manager and runtime

### UI & Styling

- **Radix UI**: Unstyled, accessible component primitives
- **shadcn/ui**: High-quality React components built on Radix
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Clean icon library
- **Sonner**: Toast notification library

### State Management & Data Fetching

- **TanStack React Query**: Server state management and caching
- **Axios**: HTTP client with interceptors
- **React Hook Form**: Efficient form state management
- **Zod**: TypeScript-first schema validation

### Context APIs

- **AuthContext**: User authentication and authorization
- **LanguageContext**: Multi-language support
- **ThemeContext**: Theme switching (light/dark)

### Development Tools

- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **TypeScript Config**: Strict type checking

## Project Structure

```
ffa-intervener-app/
├── src/
│   ├── api/                 # API integration layer
│   │   ├── auth.ts         # Authentication endpoints
│   │   ├── applications.ts # Application management endpoints
│   │   ├── projects.ts     # Project management endpoints
│   │   ├── cities.ts       # Location/city endpoints
│   │   ├── config.ts       # Axios configuration & interceptors
│   │   └── urls.ts         # API endpoint URLs
│   │
│   ├── components/         # React components
│   │   ├── layout/         # Layout components
│   │   │   ├── AppLayout.tsx      # Main app wrapper with sidebar/header
│   │   │   ├── Header.tsx         # Top navigation header
│   │   │   └── Sidebar.tsx        # Navigation sidebar
│   │   │
│   │   └── ui/            # Reusable UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── form.tsx
│   │       ├── dialog.tsx
│   │       ├── select.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── badge.tsx
│   │       ├── status-badge.tsx
│   │       ├── stat-card.tsx
│   │       ├── toaster.tsx / sonner.tsx
│   │       └── [other UI components...]
│   │
│   ├── contexts/           # React Context providers
│   │   ├── AuthContext.tsx      # User authentication state
│   │   ├── LanguageContext.tsx  # Multi-language support
│   │   └── ThemeContext.tsx     # Theme management
│   │
│   ├── hooks/             # Custom React hooks
│   │   ├── use-toast.ts
│   │   └── use-mobile.tsx
│   │
│   ├── interfaces/        # TypeScript interfaces & types
│   │   ├── project.ts     # Project and Application types
│   │   ├── institution.ts # Institution types
│   │   ├── city.ts        # Location types
│   │   └── index.ts       # Barrel exports
│   │
│   ├── lib/              # Utility functions & libraries
│   │   ├── i18n.ts       # Translation strings (EN, FR, AR)
│   │   └── utils.ts      # Helper functions
│   │
│   ├── pages/            # Page components (routes)
│   │   ├── Dashboard.tsx           # Home dashboard
│   │   ├── Projects.tsx            # Projects listing
│   │   ├── NewProject.tsx          # Create new project
│   │   ├── EditProject.tsx         # Edit existing project
│   │   ├── ProjectDetails.tsx      # Project detail view
│   │   ├── Applications.tsx        # Applications listing
│   │   ├── ApplicationDetail.tsx   # Application detail view
│   │   ├── Login.tsx               # Login page
│   │   ├── Register.tsx            # Registration page
│   │   └── NotFound.tsx            # 404 page
│   │
│   ├── App.tsx            # Main app component with routing
│   ├── App.css            # App styles
│   ├── main.tsx           # React entry point
│   ├── index.css          # Global styles
│   └── vite-env.d.ts      # Vite environment types
│
├── public/                # Static assets
│   └── robots.txt
│
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tailwind.config.ts     # PostCSS configuration
├── eslint.config.js       # ESLint configuration
└── components.json        # Component metadata

```

## Getting Started

### Prerequisites

- Node.js or Bun runtime
- npm, yarn, or bun package manager
- Git for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Habib-Ahmad/project-ffa.git
   cd ffa-intervener-hub
   ```

2. **Install dependencies**

   ```bash
   bun install
   # or
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. **Start the development server**

   ```bash
   bun dev
   # or
   npm run dev
   # or
   yarn dev
   ```

   The application will be available at `http://localhost:8080`

5. **Build for production**

   ```bash
   bun run build
   # or
   npm run build
   # or
   yarn build
   ```

6. **Preview production build**
   ```bash
   bun run preview
   # or
   npm run preview
   # or
   yarn preview
   ```

## Available Scripts

| Script      | Description                          |
| ----------- | ------------------------------------ |
| `dev`       | Start Vite development server        |
| `build`     | Build for production                 |
| `build:dev` | Build with development mode settings |
| `lint`      | Run ESLint to check code quality     |
| `preview`   | Preview production build locally     |

## Authentication Flow

1. **User Registration**: New users can register with email and password
2. **User Login**: Existing users log in with credentials
3. **Token Storage**: JWT token is stored in localStorage
4. **API Authorization**: Token is automatically sent with each request via Axios interceptor
5. **Session Management**: User is automatically logged out after 5 minutes of inactivity
6. **Token Refresh**: Expired tokens trigger automatic logout and redirect to login page

## API Integration

The application communicates with a REST API backend. All API calls are configured in the `src/api/` directory:

### API Endpoints Used

- `/auth/*` - Authentication (login, register)
- `/projects/*` - Project CRUD operations
- `/applications/*` - Application CRUD operations
- `/cities` - Location data
- `/users` - User management (admin)

### Axios Configuration

- **Base URL**: Configured via `VITE_API_BASE_URL` environment variable
- **Timeout**: 30 seconds
- **Request Interceptor**: Adds JWT token to Authorization header
- **Response Interceptor**: Handles errors (401, 403, 500)

## Internationalization (i18n)

The application supports multiple languages through the `LanguageContext`:

### Supported Languages

- **English** (en)
- **French** (fr)
- **Arabic** (ar)

### Usage

```tsx
import { useLanguage } from "@/contexts/LanguageContext";

function MyComponent() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div>
      <p>{t("common.welcome")}</p>
      <button onClick={() => setLanguage("fr")}>Français</button>
    </div>
  );
}
```

## Theme Support

The application includes light and dark theme support:

```tsx
import { useTheme } from "@/contexts/ThemeContext";

function MyComponent() {
  const { theme, toggleTheme } = useTheme();

  return <button onClick={toggleTheme}>Toggle Theme</button>;
}
```

## Type Safety

All major features are fully typed with TypeScript:

### Core Interfaces

- **User**: User account information
- **Project**: Project with scope, budget, timeline
- **Application**: Project application with status
- **Location/City**: Geographic locations

## Security Features

- **JWT Authentication**: Token-based security
- **Authorization Headers**: Automatic token injection
- **Inactivity Timeout**: 5-minute session timeout for security
- **Secure Token Storage**: Stored in localStorage (consider upgrade for production)
- **Error Handling**: Proper handling of 401/403 errors
- **CORS**: Handled by backend API

## Component Library

The application uses shadcn/ui components built on Radix UI:

### Key Components

- **Form Components**: Input, Select, Checkbox, Radio, Textarea
- **Layout**: Card, Tabs, Accordion, Collapsible
- **Navigation**: Sidebar, Header, Navigation Menu, Breadcrumb
- **Dialogs**: Dialog, AlertDialog, Sheet, Drawer
- **Data Display**: Table, Badge, Avatar, StatCard
- **Feedback**: Toast, Toaster, Sonner

All components are:

- Accessible (WCAG compliant)
- Unstyled and themeable
- Composable and reusable
- TypeScript typed

## Code Quality

### Linting

Run ESLint to check code quality:

```bash
bun run lint
```

### Best Practices

- Type-safe TypeScript throughout
- Proper error handling
- Component composition
- Custom hooks for reusable logic
- Context for global state
- React Query for server state

## Deployment

### Build Optimization

- Vite provides fast builds with code splitting
- Tree-shaking removes unused code
- CSS minification with PostCSS
- Production-ready configuration

### Environment Configuration

Configure API base URL for different environments:

```env
# Development
VITE_API_BASE_URL=http://localhost:3000/api

# Production
VITE_API_BASE_URL=https://api.production.com/api
```

## Troubleshooting

### Common Issues

**Issue**: API calls failing with 401

- **Solution**: Check that `VITE_API_BASE_URL` is correct and backend is running

**Issue**: Components not styling properly

- **Solution**: Ensure Tailwind CSS is processing correctly in `tailwind.config.ts`

**Issue**: Language not changing

- **Solution**: Verify `LanguageContext` provider wraps the app and language is supported

**Issue**: Page not found after navigation

- **Solution**: Check that all page components are imported and routes are defined in `App.tsx`
