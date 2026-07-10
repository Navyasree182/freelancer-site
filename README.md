# ⚡ FreelanceHub – Freelance Marketplace Platform

A full-stack **Freelance Marketplace Platform** built with Django REST APIs and MongoDB (PyMongo) on the backend, and a premium dark-mode HTML/CSS/JS frontend using the Fetch API.

---

## 📁 Folder Structure

```
FreelanceMarketplace/
│── manage.py           ← Django entry point
│── settings.py         ← Django configuration
│── wsgi.py
│── urls.py             ← Root URL conf
│── marketplace.db      ← (Not used – MongoDB is used)
│
│── Backend/
│   ├── __init__.py
│   ├── db.py           ← PyMongo connection & helpers
│   ├── views.py        ← All 20 Function-Based View APIs
│   └── urls.py         ← All API URL patterns
│
└── Frontend/
    ├── index.html      ← Home page
    ├── login.html      ← Login
    ├── register.html   ← Freelancer & Client registration
    ├── dashboard.html  ← Admin / User dashboard
    ├── projects.html   ← Browse & post projects
    ├── bids.html       ← Submit & manage bids
    ├── contracts.html  ← Contract management
    ├── style.css       ← Premium dark-mode CSS
    └── script.js       ← All Fetch API calls & DOM logic
```

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
pip install django pymongo
```

### 2. Configure MongoDB

Open `Backend/db.py` and set your **MongoDB Atlas** connection string:

```python
MONGO_URI = "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority"
```

Or leave the default `mongodb://localhost:27017/` for a local MongoDB instance.

### 3. Start the Django server

```bash
cd FreelanceMarketplace
python manage.py runserver
```

Server runs at **http://127.0.0.1:8000**

### 4. Open the frontend

Open `Frontend/index.html` directly in your browser, or serve via VS Code Live Server.

---

## 🔌 API Endpoints (20 total)

| Module       | Method | Endpoint                        |
|--------------|--------|---------------------------------|
| Freelancers  | GET    | `/freelancers/`                 |
| Freelancers  | POST   | `/freelancers/add/`             |
| Freelancers  | PUT    | `/freelancers/update/<id>/`     |
| Freelancers  | DELETE | `/freelancers/delete/<id>/`     |
| Clients      | GET    | `/clients/`                     |
| Clients      | POST   | `/clients/add/`                 |
| Clients      | PUT    | `/clients/update/<id>/`         |
| Clients      | DELETE | `/clients/delete/<id>/`         |
| Projects     | GET    | `/projects/`                    |
| Projects     | POST   | `/projects/add/`                |
| Projects     | PUT    | `/projects/update/<id>/`        |
| Projects     | DELETE | `/projects/delete/<id>/`        |
| Bids         | GET    | `/bids/`                        |
| Bids         | POST   | `/bids/add/`                    |
| Bids         | PUT    | `/bids/update/<id>/`            |
| Bids         | DELETE | `/bids/delete/<id>/`            |
| Contracts    | GET    | `/contracts/`                   |
| Contracts    | POST   | `/contracts/add/`               |
| Contracts    | PUT    | `/contracts/update/<id>/`       |
| Contracts    | DELETE | `/contracts/delete/<id>/`       |
| **Stats**    | GET    | `/stats/` *(bonus)*             |

---

## 📊 Database Schema (MongoDB Collections)

### freelancers
| Field          | Type   |
|----------------|--------|
| freelancer_id  | Number |
| full_name      | String |
| email          | String |
| phone          | String |
| skills         | String |
| experience     | Number |
| hourly_rate    | Number |
| profile_image  | String |

### clients
| Field          | Type   |
|----------------|--------|
| client_id      | Number |
| company_name   | String |
| contact_person | String |
| email          | String |
| phone          | String |
| location       | String |

### projects
| Field         | Type   |
|---------------|--------|
| project_id    | Number |
| project_title | String |
| description   | String |
| category      | String |
| budget        | Number |
| deadline      | Date   |
| client_name   | String |
| status        | String |

### bids
| Field           | Type   |
|-----------------|--------|
| bid_id          | Number |
| project_title   | String |
| freelancer_name | String |
| bid_amount      | Number |
| proposal        | String |
| status          | String |

### contracts
| Field           | Type   |
|-----------------|--------|
| contract_id     | Number |
| project_title   | String |
| freelancer_name | String |
| client_name     | String |
| agreed_budget   | Number |
| start_date      | Date   |
| end_date        | Date   |
| contract_status | String |

---

## ⭐ Bonus Features Implemented

| Feature                           | Marks |
|-----------------------------------|-------|
| Project Search & Filter           | ✅ 4  |
| Freelancer Skill Search           | ✅ 4  |
| Dashboard Statistics              | ✅ 4  |
| Profile Image Upload (base64)     | ✅ 4  |
| Project Status Tracking           | ✅ 4  |
| **Bonus Total**                   | **20**|

---

## 🧪 Sample Test Data (Postman)

### Add Freelancer
```
POST http://127.0.0.1:8000/freelancers/add/
Content-Type: application/json

{
  "full_name": "Rahul Sharma",
  "email": "rahul@gmail.com",
  "phone": "9876543210",
  "skills": "MERN Stack, Django",
  "experience": 3,
  "hourly_rate": 20
}
```

### Add Client
```
POST http://127.0.0.1:8000/clients/add/
Content-Type: application/json

{
  "company_name": "Tech Solutions Pvt Ltd",
  "contact_person": "Anjali Verma",
  "email": "client@techsolutions.com",
  "phone": "9988776655",
  "location": "Bangalore"
}
```

### Post Project
```
POST http://127.0.0.1:8000/projects/add/
Content-Type: application/json

{
  "project_title": "E-Commerce Website",
  "description": "Develop a responsive e-commerce platform.",
  "category": "Web Development",
  "budget": 50000,
  "deadline": "2026-08-30",
  "client_name": "Tech Solutions Pvt Ltd",
  "status": "Open"
}
```

### Submit Bid
```
POST http://127.0.0.1:8000/bids/add/
Content-Type: application/json

{
  "project_title": "E-Commerce Website",
  "freelancer_name": "Rahul Sharma",
  "bid_amount": 45000,
  "proposal": "I can complete the project in 25 days.",
  "status": "Pending"
}
```

### Create Contract
```
POST http://127.0.0.1:8000/contracts/add/
Content-Type: application/json

{
  "project_title": "E-Commerce Website",
  "freelancer_name": "Rahul Sharma",
  "client_name": "Tech Solutions Pvt Ltd",
  "agreed_budget": 45000,
  "start_date": "2026-08-05",
  "end_date": "2026-08-30",
  "contract_status": "Active"
}
```

---

## 🛠 Technology Stack

| Layer     | Technology               |
|-----------|--------------------------|
| Frontend  | HTML5, CSS3, JavaScript  |
| API Calls | Fetch API                |
| Backend   | Django (FBV)             |
| Database  | MongoDB Atlas (PyMongo)  |

---

*Built for Major Project Examination – Freelance Marketplace Platform*
