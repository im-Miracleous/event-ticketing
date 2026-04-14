<div align="center">

# 🐝 EventHive
### Event Ticketing Platform

*A modern, full-stack platform for discovering, organizing, and attending events — with integrated payment and QR-code ticketing.*

[![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-2.x-9553E9?style=for-the-badge&logo=inertia&logoColor=white)](https://inertiajs.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## 📋 Table of Contents

1. [Project Information](#1-project-information)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Role-Based Access Control (RBAC)](#3-role-based-access-control-rbac)
4. [Workflow & Environment](#4-workflow--environment)
   - [a. Quick-Start Guide](#a-quick-start-guide)
   - [b. Development vs. Production](#b-development-vs-production)
   - [c. How It Works](#c-how-it-works)
   - [d. Troubleshooting & FAQ](#d-troubleshooting--faq)
5. [Team Information](#5-team-information)

---

## 1. Project Information

**EventHive** is a full-stack, web-based Event Ticketing Platform designed to connect event organizers with their audience. The platform provides a seamless experience for discovering, registering, and attending a wide variety of events — from small workshops to large-scale concerts.

### ✨ Key Features

| Feature | Description |
|---|---|
| 🎫 **Event Discovery** | Browse and explore public events from various organizers through a rich, filterable catalog. |
| 🛒 **Checkout & Payment** | Secure, multi-step checkout flow integrated with the **DOKU** hosted payment gateway. |
| 📱 **QR Code Ticketing** | Upon successful payment, a unique QR-code ticket is issued and can be printed or saved. |
| 🎤 **Organizer Dashboard** | Full event lifecycle management — create events, manage attendees, monitor transactions, and scan tickets at the door. |
| 🔐 **Admin Panel** | Platform-wide management including user accounts, system settings, application branding, and more. |
| ⏳ **Waiting List** | Support for event waiting lists when ticket capacity is reached. |
| 💾 **Saved Events** | Users can bookmark events they are interested in for later access. |
| 📊 **Analytics** | Organizers have access to sales and attendance analytics with interactive charts. |
| 🏷️ **Promotions** | Organizers can create and schedule discount promo codes for their events. |
| 🔔 **Notifications** | Real-time push notifications and global stacked toasts for live feedback. |

---

## 2. Tech Stack & Dependencies

### 🔧 Core Framework

| Layer | Technology | Version |
|---|---|---|
| **Backend** | [Laravel](https://laravel.com) (PHP) | `^12.0` |
| **Frontend** | [React](https://reactjs.org) (TypeScript) | `^18.2.0` |
| **Bridge** | [Inertia.js](https://inertiajs.com) | `^2.0` |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) | `^3.2.1` |
| **Database** | MySQL / MariaDB | — |
| **Build Tool** | [Vite](https://vitejs.dev) | `^7.0` |
| **Runtime** | PHP `^8.2`, Node.js `^20` | — |

### 📦 PHP Dependencies (Composer)

| Package | Purpose |
|---|---|
| `inertiajs/inertia-laravel` | Connects Laravel backend to the React frontend without a separate API layer. |
| `laravel/sanctum` | API authentication and session management. |
| `maatwebsite/excel` | Export attendee and transaction data to Excel/CSV. |
| `tightenco/ziggy` | Makes Laravel named routes available in JavaScript/TypeScript. |
| `laravel/breeze` | Scaffolding for authentication (login, register, etc.). |
| `pestphp/pest` | Modern, expressive PHP testing framework. |
| `laravel/reverb` | Real-time WebSocket server for Laravel. |

### 📦 JavaScript/Node Dependencies (NPM)

| Package | Purpose |
|---|---|
| `@inertiajs/react` | React adapter for Inertia.js. |
| `@headlessui/react` | Unstyled, accessible UI components used for modals, dropdowns, etc. |
| `lucide-react` | Clean, consistent icon library. |
| `sweetalert2` | Beautiful, responsive popup/modal dialogs. |
| `recharts` | Composable charting library used in analytics dashboards. |
| `html5-qrcode` | QR code scanning via device camera for ticket validation. |
| `lodash` | Utility functions for data manipulation. |
| `axios` | Promise-based HTTP client for API requests. |
| `concurrently` | Runs multiple commands simultaneously (e.g., dev server + queue worker). |
| `laravel-echo` | JavaScript library for subscribing to channels and listening for events. |
| `pusher-js` | Pusher specialized library for WebSocket communication. |

### 💳 Payment Gateway

| Service | Purpose |
|---|---|
| **DOKU** | Indonesian payment gateway used for processing ticket purchases. Supports virtual accounts, e-wallets, and credit/debit cards. |

---

## 3. Role-Based Access Control (RBAC)

EventHive uses a **Role-Based Access Control (RBAC)** system with three main roles. Each role has its own dedicated layout, navigation, and set of permissions.

### 👥 User Roles

| Role | Description |
|---|---|
| 🛡️ **Admin** | Manages all platform users, views system-wide transactions, oversees event listings, and configures application-level settings (name, logo, etc.). |
| 🎤 **Organizer** | Creates and manages their own events, handles attendees, scans QR code tickets, monitors transactions, and creates promotions. |
| 🙋 **User** | Browses the event catalog, purchases tickets, manages their bookings and saved events, and accesses their digital tickets. |

### 🔑 Test Accounts

After running the database seeder (`php artisan migrate --seed`), the following test accounts will be available:

| Role | Username | Password | Email |
|---|---|---|---|
| **Admin** | `testadmin` | `SecurePassword123!` | Configured via `.env` |
| **Organizer** | `testorganizer` | `SecurePassword123!` | Configured via `.env` |
| **User** | `testuser` | `password123` | `user@test.com` |

> [!NOTE]
> The Admin and Organizer test account emails are configured through the `.env` file using the `DEFAULT_ADMIN_EMAIL` and `DEFAULT_ORGANIZER_EMAIL` keys. See the [Quick-Start Guide](#a-quick-start-guide) for configuration details.

### 🔒 Root Account (Hidden)

In addition to the three public roles, there is a **hidden Root account** accessible only to authorized system administrators. The Root account has elevated privileges beyond the regular Admin role and is used for:

- Managing and creating Admin accounts.
- Configuring global application settings (application name, logo, theme, etc.).
- Overseeing platform-level operations.

> [!CAUTION]
> The Root account credentials are **never stored in the repository** and should be kept strictly confidential. Access is granted only to authorized system administrators on a need-to-know basis.

---

## 4. Workflow & Environment

### a. Quick-Start Guide

Follow these steps to get EventHive running on your local machine for the first time.

#### ✅ Prerequisites

Make sure the following software is installed on your machine:

| Software | Version | Download |
|---|---|---|
| **PHP** | `^8.2` | [php.net](https://www.php.net/downloads) or via [Laragon](https://laragon.org/download) |
| **Composer** | Latest | [getcomposer.org](https://getcomposer.org/download) |
| **Node.js & NPM** | `^20` | [nodejs.org](https://nodejs.org) |
| **MySQL / MariaDB** | — | Via [Laragon](https://laragon.org) (recommended) or [XAMPP](https://www.apachefriends.org) |
| **Git** | Latest | [git-scm.com](https://git-scm.com/downloads) |

> [!TIP]
> **Laragon** is the recommended local development environment for Windows users. It bundles PHP, MySQL/MariaDB, and other tools in a single, easy-to-use package.

---

#### Step 1 — Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/im-Miracleous/event-ticketing.git
cd event-ticketing
```

---

#### Step 2 — Install Dependencies

Install both PHP (Composer) and JavaScript (NPM) dependencies:

```bash
# Install PHP dependencies
composer install

# Install JavaScript/Node dependencies
npm install
```

---

#### Step 3 — Environment Setup

Copy the example environment file and generate the application key:

```bash
# Copy the example .env file
cp .env.example .env

# Generate the Laravel application key
php artisan key:generate
```

Now, open the `.env` file in your editor and configure the following sections:

**Application Settings:**
```env
APP_NAME="EventHive"
APP_ENV=local
APP_URL=http://localhost:8000
```

**Database Connection** (switch from SQLite to MySQL):
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=event_ticketing
DB_USERNAME=root
DB_PASSWORD=         # Leave blank for Laragon's default; set your password if applicable
```

**Default Test Account Emails:**
```env
DEFAULT_ADMIN_EMAIL="admin@example.com"
DEFAULT_ADMIN_PASSWORD="SecurePassword123!"

DEFAULT_ORGANIZER_EMAIL="organizer@example.com"
DEFAULT_ORGANIZER_PASSWORD="SecurePassword123!"
```

**DOKU Payment Gateway** (see [Payment Integration](#-payment-integration-setup--testing) below):
```env
DOKU_CLIENT_ID=your_doku_client_id
DOKU_SECRET_KEY=your_doku_secret_key
DOKU_BASE_URL=https://api-sandbox.doku.com
DOKU_NOTIFICATION_URL=http://your-public-url.com/doku/notification
DOKU_EXPIRY_MINUTES=60
```

---

#### Step 4 — Database Setup

Ensure your MySQL/MariaDB server is running (start Laragon or XAMPP), then create the database and run migrations:

```bash
# Run all migrations and seed initial data (users, sample events, etc.)
php artisan migrate --seed
```

> [!TIP]
> During development, if you need to reset your database completely and start fresh, run:
> ```bash
> php artisan migrate:fresh --seed
> ```
> ⚠️ This will **delete all data** and re-run everything from scratch.

---

#### Step 5 — Run the Application

Open **two separate terminal windows** in the project root and run:

**Terminal 1 — Backend (Laravel):**
```bash
php artisan serve
```

**Terminal 2 — Frontend (Vite/React):**
```bash
npm run dev
```

**Terminal 3 — WebSockets (Laravel Reverb):**
```bash
php artisan reverb:start
```

The application is now accessible at: **[http://localhost:8000](http://localhost:8000)**

> [!NOTE]
> **Shortcut:** You can also run everything at once using the Composer `dev` script, which starts the Laravel server, Reverb (Broadcasting), queue worker, and Vite all simultaneously:
> ```bash
> composer run dev
> ```

---

#### Step 6 — Pulling Updates (For Existing Clones)

If you already have the project and need to sync with the latest changes from the repository:

```bash
# Pull the latest changes from the remote
git fetch
git pull

# Re-install dependencies (in case new packages were added by teammates)
composer install
npm install

# Apply any new database migrations
php artisan migrate
```

---

### b. Development vs. Production

| Aspect | Development | Production |
|---|---|---|
| **Frontend Server** | `npm run dev` (Vite HMR — Hot Module Replacement) | `npm run build` (pre-compiled static assets) |
| **Backend Server** | `php artisan serve` | Web server (Apache/Nginx via Laragon/cPanel) |
| **APP_ENV** | `local` | `production` |
| **APP_DEBUG** | `true` | `false` ⚠️ (must be false in production) |
| **DOKU Base URL** | `https://api-sandbox.doku.com` | `https://api.doku.com` |
| **Cache** | No cache needed | Run `php artisan optimize` |

#### Building for Production

```bash
# Compile and minify all frontend assets
npm run build

# Optimize Laravel for production
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

> [!WARNING]
> Never set `APP_DEBUG=true` in a production environment. This can expose sensitive application internals, environment variables, and stack traces to end users.

---

### c. How It Works

#### 🏗️ Application Architecture

EventHive is a **monolithic** application built on the **Laravel + Inertia.js + React** stack. There is no separate API; Inertia.js acts as the "glue" between the Laravel backend and the React frontend, passing data as page props without requiring full-page reloads.

```
Browser ──► Laravel Router ──► Controller ──► Inertia Response
         ◄── React Component (rendered via Inertia) ──────────
```

#### 🎟️ Event Purchase Flow

```
1. User browses Event Catalog
       │
       ▼
2. User opens Event Details page
       │
       ▼
3. User clicks "Buy Ticket" → Checkout Page (enter personal info)
       │
       ▼
4. User confirms order → Laravel creates a pending Order record
       │
       ▼
5. Laravel calls DOKU API → Receives a payment URL
       │
       ▼
6. User is redirected to DOKU Hosted Payment Page
       │
       ▼
7a. Payment SUCCESS → DOKU sends a webhook to our notification URL
       │               Laravel validates the signature, updates Order
       │               status to "Paid", and issues a QR-code Ticket.
       │
7b. Payment FAILED / Expired → Order is marked "Failed"; user is
                                notified and may retry.
       │
       ▼
8. User views their ticket in "My Tickets" → can print or save the QR code.
       │
       ▼
9. At the venue, Organizer uses the built-in QR Scanner to scan
   and validate the ticket → Ticket status changes to "Scanned".
```

---

#### 💳 Payment Integration Setup & Testing

The payment system uses the **DOKU** hosted payment gateway. Credentials are **never stored in the repository** and must be obtained individually by each developer.

##### Getting Your DOKU Credentials

**For Testing / Development (Sandbox):**
1. Visit **[https://sandbox.doku.com](https://sandbox.doku.com)** and create a free sandbox account.
2. Log in and navigate to **API Keys** (or Integration Settings).
3. Copy your **Client ID** and **Secret Key**.
4. Set `DOKU_BASE_URL=https://api-sandbox.doku.com` in your `.env`.

**For Production (Live Money):**
1. Visit **[https://dashboard.doku.com](https://dashboard.doku.com)** and register/log in with a business account.
2. Complete the required business verification process.
3. Navigate to **API Keys** and copy your **Client ID** and **Secret Key**.
4. Set `DOKU_BASE_URL=https://api.doku.com` in your `.env`.

Once you have your keys, update your `.env` file:

```env
DOKU_CLIENT_ID=your_client_id_here
DOKU_SECRET_KEY=your_secret_key_here
DOKU_BASE_URL=https://api-sandbox.doku.com   # Use sandbox for local testing
DOKU_EXPIRY_MINUTES=60
```

---

##### Testing the Payment Flow Locally

Because DOKU's payment gateway needs to send a **webhook (HTTP callback)** back to your application, your local `localhost` URL is **not reachable** by DOKU's servers. You must expose your local server to the internet using a tunneling tool.

**Step 1 — Install a tunneling tool**

Use one of the following options:

```bash
# Option A: ngrok (recommended)
# Download from https://ngrok.com/download, then:
ngrok http 8000

# Option B: Expose (Laravel-friendly)
expose share http://localhost:8000
```

**Step 2 — Update your `.env` with the tunnel URL**

After running above, you'll get a public URL (e.g., `https://a1b2c3d4.ngrok.io`). Set it in your `.env`:

```env
DOKU_NOTIFICATION_URL=https://a1b2c3d4.ngrok.io/doku/notification
APP_URL=https://a1b2c3d4.ngrok.io
```

**Step 3 — Restart the Laravel server** to pick up the new `.env` values:

```bash
php artisan config:clear
php artisan serve
```

**Step 4 — Test a purchase**

1. Log in as the test **User** (`testuser` / `password123`).
2. Browse the event catalog and select an event.
3. Click **Buy Ticket** and complete the checkout form.
4. You will be redirected to the DOKU sandbox payment page.
5. Use the sandbox's **test payment method** (DOKU sandbox provides virtual simulation — simply follow the on-screen instructions to simulate a successful or failed payment).
6. After completing payment, you should be redirected back to the confirmation page.
7. Check your **My Tickets** page — your ticket with a QR code should appear.

> [!NOTE]
> In the DOKU Sandbox environment, no real money is charged. All transactions are simulated. You can test both successful and failed payment scenarios.

> [!IMPORTANT]
> The **DOKU_NOTIFICATION_URL** must be a **publicly accessible** URL for the webhook to work. The tunnel URL changes every time you restart the tunnel tool — remember to update your `.env` whenever the tunnel URL changes.

---

### d. Troubleshooting & FAQ

#### ❓ Common Issues

---

**Q: `Class "App\Models\User" not found` or similar class-not-found errors**

```bash
composer dump-autoload
```

---

**Q: I get a blank white page or a Vite error**

Make sure both your backend AND frontend servers are running simultaneously:
- Terminal 1: `php artisan serve`
- Terminal 2: `npm run dev`

---

**Q: Database connection refused or `SQLSTATE[HY000] [2002]`**

- Make sure MySQL/MariaDB is **running** (check Laragon or XAMPP status).
- Verify your `DB_*` values in `.env` are correct.
- Ensure the database (`event_ticketing`) actually **exists** — create it manually via phpMyAdmin or the Laragon MySQL console if needed.

---

**Q: `php artisan migrate` fails with "Unknown column" or migration errors**

Your database may be out of sync. During development, you can safely reset:
```bash
php artisan migrate:fresh --seed
```

---

**Q: `npm run dev` crashes with JavaScript heap out of memory**

Increase Node.js memory:
```bash
# Windows PowerShell
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run dev
```

---

**Q: Changes to `.env` are not taking effect**

Laravel caches its configuration. Clear the cache:
```bash
php artisan config:clear
php artisan cache:clear
```

---

**Q: The QR code payment webhook is not being received**

- Check that your tunnel (ngrok/expose) is running and the URL in `DOKU_NOTIFICATION_URL` is up-to-date.
- Remember to run `php artisan config:clear` after updating `.env`.
- Check your Laravel logs at `storage/logs/laravel.log` for any error output from the notification handler.

---

**Q: Seeder creates duplicate users or errors out**

The seeders use `firstOrCreate`, so they are safe to re-run. However, if you suspect corrupt data:
```bash
php artisan migrate:fresh --seed
```

---

**Q: How do I clear all Laravel caches at once?**

```bash
php artisan optimize:clear
```

This clears the config, route, view, and event caches in one command.

---

## 5. Team Information

This project was developed as a team-based academic project. Below is the list of team members and their respective student IDs.

| Student ID | Full Name | Role |
|:---:|---|:---:|
| **2472019** | Miracle Steven Gerrald | Project Manager |
| **2472030** | Felicia Ivanna Widian | Team Member |
| **2472039** | Febrian Timotius Sugiarto | Team Member |

---

### 📬 Repository

**GitHub:** [https://github.com/im-Miracleous/event-ticketing](https://github.com/im-Miracleous/event-ticketing)

---

<div align="center">

*Built with ❤️ using Laravel, React, and Inertia.js*

</div>