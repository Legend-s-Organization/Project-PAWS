# Project PAWS: Permit & Activity Workflow System

## 📋 Application Overview

Project PAWS is a comprehensive, full-stack web portal developed for National University (NU East Ortigas) to modernize the student permit submission process. It replaces traditional paper-based workflows with a secure, real-time digital system that connects students directly with university administrators.

### Key Features

#### 👨‍🎓 Student Features

- **Secure Account Creation:** Real-time registration with password encryption.
- **Permit Submission:** User-friendly interface to request Event and Activity permits.
- **Document Management:** Securely upload required proofs (IDs, endorsement letters) as PDFs or images.
- **Responsive Design:** Fully optimized for mobile devices, allowing students to submit requests on the go.

#### 👮 Admin Features

- **Centralized Dashboard:** Real-time tracking of all pending, approved, and rejected permit requests.
- **Request Details View:** Complete access to student purpose, event dates, and all uploaded documents.
- **Status Management:** One-click approval or rejection of student requests.
- **Record Management:** Ability to securely delete old or invalid permit records and their associated files from the server.

---

## 🛠️ Technical Architecture

- **Frontend:** Built using modern HTML5, CSS3, and Vanilla JavaScript (No heavy frameworks required).
- **Backend (API):** A secure PHP-based API layer that handles data validation, authentication, and file storage.
- **Database:** A relational MySQL database using PDO for advanced protection against SQL Injection attacks.

## 📂 Project Structure

- `/Project-BFFS/`: The main web application folder.
  - `/backend/`: Contains the PHP API logic and database configuration.
  - `/css/`: Modular stylesheets for layout and page-specific designs.
  - `/html/`: All web pages for students and administrators.
  - `/javascript/`: Frontend logic for handling API calls and UI interactivity.
  - `/uploads/`: Secure server-side storage for submitted documents.

---

_Created for NU East Ortigas - 2026_
