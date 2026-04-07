---
name: guidelines
description: Reference guidelines for this project
type: reference
tools:
    read: true
---

# Agent Guidelines for Event Ticketing Project

This is a Laravel 12 + React 18 + TypeScript + Inertia.js project with Vite and Tailwind CSS.

## Build Commands

### Frontend (Node.js)

```bash
# Install dependencies
npm install

# Development server (with hot reload)
npm run dev

# Production build
npm run build

# Run TypeScript type checking
npx tsc --noEmit
```

### Backend (PHP/Laravel)

```bash
# Install PHP dependencies
composer install

# Run development server (with queue, logs, vite)
composer run dev

# Run tests (Pest)
composer test
# or
php artisan test

# Run a single test
php artisan test --filter=TestName
# or with Pest
./vendor/bin/pest --filter=TestName

# Format PHP code (Laravel Pint)
./vendor/bin/pint

# Check code style
./vendor/bin/pint --test
```

## Project Structure

```
/app              - Laravel application (Controllers, Models, etc.)
/resources/js     - React frontend
  /Components     - Reusable UI components
  /Layouts        - Page layouts (Authenticated, Guest, Dashboard)
  /Pages          - Inertia pages (Admin/, Auth/, Organizer/, etc.)
  /config         - Configuration files
  /hooks          - Custom React hooks
  /types          - TypeScript type definitions
/database         - Migrations, seeders, factories
/tests            - Pest tests (Feature/, Unit/)
```

## Code Style Guidelines

### PHP (Laravel)

- Follow PSR-12 coding standards
- Use Laravel conventions: controllers in `app/Http/Controllers`, models in `app/Models`
- Use type hints for function parameters and return types
- Use docblocks for complex methods
- Use snake_case for variables and methods, PascalCase for classes
- Use dependency injection via constructor
- Use Eloquent ORM for database operations

```php
// Good example
public function index(Request $request): Response
{
    $validated = $request->validated();
    $items = Model::where('status', 'active')->get();
    
    return Inertia::render('Page/Index', [
        'items' => $items
    ]);
}
```

### React/TypeScript

- Use functional components with hooks
- Use TypeScript strict mode (enabled in tsconfig.json)
- Use path aliases: `@/*` maps to `resources/js/*`
- Use forwardRef for components that need ref forwarding
- Use Inertia.js for routing and data loading
- Use Ziggy for Laravel route access

```tsx
// Component pattern
import { forwardRef } from 'react';
import { InputHTMLAttributes } from 'react';

export default forwardRef(function ComponentName(
    { className = '', ...props }: InputHTMLAttributes<HTMLInputElement>,
    ref: Ref<HTMLInputElement>
) {
    return <input ref={ref} className={className} {...props} />;
});
```

### Tailwind CSS

- Use dark mode classes: `dark:bg-navy-900`
- Use primary color scale: `primary-500`, `primary-600`
- Use custom colors defined in tailwind.config.js: `primary`, `secondary`, `navy`, `dark`
- Use `rounded-xl` for cards, `rounded-lg` for buttons
- Use semantic class names

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| PHP Classes | PascalCase | `EventController` |
| PHP Methods | snake_case | `getEvents()` |
| PHP Variables | snake_case | `$eventList` |
| React Components | PascalCase | `DashboardLayout` |
| TypeScript Functions | camelCase | `getUserData()` |
| CSS Classes | kebab-case | `bg-primary-500` |

### Error Handling

- PHP: Use try-catch blocks, return proper HTTP responses
- React: Handle errors with Error Boundaries, use proper TypeScript types
- Use Inertia's error handling for form validation

### Imports

```tsx
// React - organize imports
import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Component from '@/components/Component';
import type { Props } from '@/types';
import styles from './styles.module.css';
```

### Database

- Use Eloquent for all database operations
- Use migrations for schema changes
- Use factories and seeders for test data
- Models use UUIDs (HasUuids trait)

### Testing

- Use Pest PHP testing framework
- Feature tests go in `tests/Feature/`
- Unit tests go in `tests/Unit/`
- Tests use RefreshDatabase trait

```php
// Pest test example
it('can authenticate user', function () {
    $user = User::factory()->create();
    
    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);
    
    $this->assertAuthenticated();
});
```

### General Guidelines

1. **Never commit secrets** - Use `.env` for sensitive data
2. **Use enums** for fixed sets of values (e.g., user roles, statuses)
3. **Keep components small** and focused on single responsibility
4. **Use TypeScript types** - Avoid `any`, use proper interfaces
5. **Use async/await** for asynchronous operations
6. **Validate input** - Both frontend and backend
7. **Use proper HTTP status codes** - 200, 201, 400, 401, 403, 404, 500

## Key Technologies

- Laravel 12 (PHP 8.2+)
- React 18 with TypeScript
- Inertia.js for SSR
- Vite 7 for bundling
- Tailwind CSS 3 with custom theme
- Pest for testing
- Laravel Pint for code formatting
