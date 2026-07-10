# Freelance Marketplace Platform

A full-stack freelance marketplace where clients post projects, freelancers bid on them, and accepted bids turn into contracts.

- **Backend:** Django REST (function-based views) + SQLite
- **Frontend:** HTML / CSS / JavaScript (Fetch API)

---

## Table of Contents

- [Folder Structure](#folder-structure)
- [How to Run](#how-to-run)
  - [1. Backend](#1-backend-django-rest-api)
  - [2. Frontend](#2-frontend)
- [Login / Session Model](#login--session-model)
- [API Reference](#api-reference-20-required--bonus)
- [Bonus Features](#bonus-features-implemented)
- [Core User Flow](#core-user-flow)
- [Postman Testing](#postman-testing)
- [Screenshots](#screenshots)
- [Notes for Submission](#notes-for-submission)

---

## Folder Structure

```
FreelanceMarketplace/
├── Backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── db.sqlite3            (created after migrate)
│   ├── core/                 Django project (settings, root urls)
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── api/                  Django app — the three required files
│       ├── db.py             ← database schema (models) for all 5 modules
│       ├── views.py          ← function-based views / 20 CRUD APIs + bonus
│       ├── urls.py           ← API routing
│       ├── models.py         (re-exports db.py so Django migrations work)
│       └── admin.py
│
└── Frontend/
    ├── index.html
    ├── login.html
    ├── register.html
    ├── dashboard.html
    ├── projects.html
    ├── bids.html
    ├── contracts.html
    ├── style.css
    └── script.js
```

---

## How to Run

### 1. Backend (Django REST API)

```bash
cd Backend
pip install -r requirements.txt
python manage.py makemigrations api
python manage.py migrate
python manage.py runserver
```

The API will be live at `http://127.0.0.1:8000/`.

**(Optional)** create an admin user to browse data at `/admin/`:

```bash
python manage.py createsuperuser
```

### 2. Frontend

Just open `Frontend/index.html` directly in your browser (double-click it, or use VS Code's **Live Server** extension).

It talks to the backend via `fetch()` calls to `http://127.0.0.1:8000`, so keep the Django server running while you use the site.

> **Note:** CORS is fully open (`CORS_ALLOW_ALL_ORIGINS = True`) in `core/settings.py`, specifically so the frontend can be opened from a different origin (`file://` or a different port) during development/grading.

---

## Login / Session Model

There's no separate auth table in the schema, so login is a lightweight, practical simulation:

- Registering creates a `Freelancer` or `Client` record.
- Logging in looks up that email in the corresponding table and stores the matched profile in `localStorage` as the active session.

This is enough to drive role-based dashboards and to auto-attach `freelancer_name` / `client_name` on bids and projects, without inventing an extra module outside the given schema.

---

## API Reference (20 required + bonus)

All responses follow: `{"success": true/false, "data": ...}`

| Module | Method | Endpoint |
|---|---|---|
| Freelancer | POST | `/freelancers/add/` |
| Freelancer | GET | `/freelancers/` |
| Freelancer | PUT | `/freelancers/update/<id>/` |
| Freelancer | DELETE | `/freelancers/delete/<id>/` |
| Client | POST | `/clients/add/` |
| Client | GET | `/clients/` |
| Client | PUT | `/clients/update/<id>/` |
| Client | DELETE | `/clients/delete/<id>/` |
| Project | POST | `/projects/add/` |
| Project | GET | `/projects/` (supports `?search=&category=&status=`) |
| Project | PUT | `/projects/update/<id>/` |
| Project | DELETE | `/projects/delete/<id>/` |
| Bid | POST | `/bids/add/` |
| Bid | GET | `/bids/` (supports `?project_title=&freelancer_name=&status=`) |
| Bid | PUT | `/bids/update/<id>/` (also used to Accept/Reject) |
| Bid | DELETE | `/bids/delete/<id>/` |
| Contract | POST | `/contracts/add/` |
| Contract | GET | `/contracts/` (supports `?freelancer_name=&client_name=`) |
| Contract | PUT | `/contracts/update/<id>/` |
| Contract | DELETE | `/contracts/delete/<id>/` |
| Bonus | GET | `/freelancers/search/?skill=Django` |
| Bonus | GET | `/dashboard/stats/` |

---

## Bonus Features Implemented

- ✅ Project Search & Filter (title, category, status)
- ✅ Freelancer Skill Search
- ✅ Dashboard Statistics (projects, bids, contracts)
- ✅ Project Status Tracking (Open → In Progress → Completed, auto-updates when a bid is accepted)
- ✅ Profile Image Upload field on the Freelancer model (`profile_image`, accepts `multipart/form-data` on `/freelancers/add/`)

---

## Core User Flow

*(matches Sample Testing Data in the brief)*

1. A **client** registers → posts an "E-Commerce Website" project.
2. A **freelancer** registers → browses `/projects.html` → submits a bid.
3. The client opens `/bids.html`, sees the pending bid, clicks **Accept**.
4. Accepting a bid automatically:
   - creates a Contract (`/contracts/add/`)
   - flips the project's status to **In Progress**
5. Both dashboards (`/dashboard.html`) reflect the new contract, which can then be marked **Completed** or **Cancelled** from `/contracts.html`.

---

## Postman Testing

Import the endpoints above into Postman (or use the curl examples in this README) to generate the required API testing screenshots. Every endpoint was manually verified with curl during development — create, list, update, filter/search, and delete all confirmed working end-to-end.

---

## Screenshots

| Page | Preview |
|---|---|
| Register page | 
<img width="1116" height="700" alt="image" src="https://github.com/user-attachments/assets/7844ed1c-60c9-4650-b01f-8ad96886f9e8" />
|
| Login page | 
<img width="1913" height="1023" alt="image" src="https://github.com/user-attachments/assets/eb14cb12-79c9-4d7e-97af-ff171fadbe05" />
|
| Home page | 
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/457cb800-809d-4ca9-8559-f81b1ffef310" />
|
| Bids page | 
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/895af228-d94f-4e8e-acf1-7b1fdee4f74c" />
|
| Dashboard page |
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/0af5ed5e-4049-4894-9529-bc3d7f4964df" />
|

---

