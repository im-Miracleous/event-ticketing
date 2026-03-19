<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

# Team Onboarding Guide - Event Ticketing Application

Hello Team! 👋
This document contains a brief explanation of the application we are building, how to run the application locally, and our task division plan.

## 📌 Brief Application Description
This application is an **Event Ticketing System**.
The main technologies we use in this project are:
- **Backend:** Laravel (PHP)
- **Frontend:** React.js with TypeScript (.tsx)
- **Bridge:** Inertia.js (connects Laravel & React without a separate API)
- **Styling:** Tailwind CSS

This application uses a **Role-Based Access Control (RBAC)** system where layouts and access rights are differentiated for 3 main roles:
1. **Admin / Root**
2. **Organizer** (Event Creator)
3. **User** (Participant / Ticket Buyer)

---

## 🚀 How to Run the Application Locally

Because this project uses Laravel and a JavaScript framework (React/Vite), we need to run two servers (*backend* and *frontend*) simultaneously. Here are the initial setup steps:

### 1. System Requirements (Prerequisites)
Make sure your laptop/computer has the following installed:
- PHP (minimum v8.1+) & Composer
- Node.js & NPM
- Database (MySQL/MariaDB) - You can use **Laragon** or **XAMPP**

### 2. Initial Installation Steps (First Time Setup)
Run these commands in the terminal (VS Code / Git Bash) at the project root folder:

```bash
# 1. Install PHP dependencies
composer install

# 2. Install JavaScript/Node dependencies
npm install

# 3. Copy the environment file
cp .env.example .env

# 4. Generate Application Key
php artisan key:generate
```

### 3. Database Configuration
Open the **Laragon / XAMPP** application and run MySQL.
1. Create a new database (e.g., name it `event_ticketing`).
2. Open the `.env` file in VS Code, then adjust this section to match your database:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=event_ticketing
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Running Database Migration & Seeder
To create tables in the database along with initial (dummy) data:
```bash
php artisan migrate --seed
```

*(Optional)* If at any point during **development** you need to completely reset the database from scratch and re-run all seeders, you can run:
```bash
php artisan migrate:fresh --seed
```

### 5. Updating an Existing Clone (Syncing with the Cloud)
If you have previously cloned the repository and want to get the latest updates from the cloud, run these commands:
```bash
# Fetch & pull the latest repository changes
git fetch
git pull

# Update dependencies (in case new packages were added)
composer install
npm install

# Migrate changes to the database (if there are new tables/columns)
php artisan migrate
```

### 6. How to Run the Application (Every time you code)
Open **2 different Terminals** in VS Code, then run:

**Terminal 1 (Backend - PHP):**
```bash
php artisan serve
```

**Terminal 2 (Frontend - Vite/React):**
```bash
npm run dev
```
The application can now be accessed in the browser via the link: `http://localhost:8000`