# NU Project PAWS - University Permit System

## Overview

Project PAWS (Permit & Activity Workflow System) is a full-stack web application designed for National University to streamline the submission, tracking, and management of student permit requests.

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** PHP 8.0+
- **Database:** MySQL / MariaDB
- **Security:** PDO (Prepared Statements), Password Hashing (Bcrypt)

---

## 🚀 Deployment Guide for IT Department

### 1. Server Requirements

- Web Server: Apache 2.4+ or Nginx
- PHP: Version 8.0 or higher
- MySQL: Version 5.7+ or MariaDB 10.4+

### 2. Database Setup

1. Create a new database named `university_paws`.
2. Import the SQL schema located at:
   `backend/database/schema.sql`
   _This will create the necessary tables for users, permits, and file associations._

### 3. Environment Configuration

Database credentials should be configured in:
`backend/config/config.php`

```php
// Example configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'university_paws');
define('DB_USER', 'your_db_username');
define('DB_PASS', 'your_db_password');
```

### 4. File Permissions

Ensure the web server has **Write Access** to the following directory for student document uploads:
`uploads/`

---

## 🔒 Security Features

- **Data Integrity:** All database interactions use **PDO with Prepared Statements** to prevent SQL Injection.
- **Credential Safety:** User passwords are encrypted using `PASSWORD_DEFAULT` (Bcrypt) algorithm. No plain-text passwords are stored.
- **Role-Based Access Control (RBAC):** Admin pages are protected by server-side checks to ensure only authorized personnel can approve or reject permits.

## 🛠️ Maintenance & Scaling

- **Adding New Features:** The project follows a modular API-based structure. To add a new service, create a new PHP script in `backend/api/` and a corresponding JavaScript handler.
- **Integrations:** The login system can be easily refactored to support Single Sign-On (SSO) such as Google Workspace or Microsoft Azure AD by modifying `backend/api/login.php`.

---

_Developed for NU East Ortigas - 2026_
