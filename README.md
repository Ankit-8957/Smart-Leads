# GigFlow – Smart Leads Dashboard

![GigFlow Banner](https://via.placeholder.com/1200x400?text=GigFlow+-+Smart+Leads+Dashboard)

> A modern, full-stack lead management platform built to streamline the process of tracking, managing, and converting sales prospects. Developed as part of a technical assignment for a Full Stack Development Internship.

---

## 📖 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Project Setup Instructions](#-project-setup-instructions)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Future Improvements](#-future-improvements)

---

## ✨ Features

### Frontend
- **Interactive Dashboard**: Modern and responsive UI for real-time lead tracking.
- **State Management**: Robust and efficient local and global state handling.
- **Client-side Routing**: Smooth, SPA navigation with protected routes.
- **Form Validation**: Comprehensive validations for user inputs (login, registration, lead creation).

### Backend
- **Secure Authentication**: JWT-based user authentication and authorization (Role-Based Access Control).
- **CRUD Operations**: Complete Create, Read, Update, and Delete endpoints for Leads.
- **Data Validation**: Strict server-side validation for all incoming API requests.
- **CSV Export**: Ability to export leads data to CSV format.

### Key Functionalities
- **User Roles**: Differentiated access levels for `admin` and `sales` roles.
- **Lead Filtering & Search**: Easily sort and filter leads by status and other criteria.
- **Security**: Implementation of best practices like password hashing, Helmet, and CORS.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React.js (with Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Routing**: React Router DOM

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs

---

## 📂 Folder Structure

The project follows a clean, modular monolith architecture split into `frontend` and `backend` directories.

```text
smart-leads/
├── backend/                  # Server-side code (Node.js/Express)
│   ├── src/
│   │   ├── controllers/      # Route logic handlers
│   │   ├── middleware/       # Custom middleware (Auth, Validation)
│   │   ├── models/           # Mongoose schemas (User, Lead)
│   │   ├── routes/           # API route definitions
│   │   ├── types/            # TypeScript interfaces/types
│   │   ├── utils/            # Helper functions
│   │   ├── index.ts          # Express app configuration
│   │   └── server.ts         # Server entry point
│   ├── .env                  # Environment variables
│   └── package.json
│
└── frontend/                 # Client-side code (React/Vite)
    ├── src/
    │   ├── assets/           # Static assets
    │   ├── components/       # Reusable UI components
    │   ├── pages/            # Application views/pages
    │   ├── services/         # API integration services
    │   ├── App.tsx           # Main application component
    │   └── main.tsx          # React DOM render entry
    ├── index.html
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 Project Setup Instructions

Follow these steps to get the project up and running on your local machine.

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URL)
- Git

### 2. Clone the Repository
```bash
git clone <your-repo-url>
cd smart-leads
```

### 3. Backend Setup
Navigate to the backend directory, install dependencies, and configure your environment.

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` root and add the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

Start the backend development server:
```bash
npm run dev
```
*The server should now be running on `http://localhost:5000`.*

### 4. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and install dependencies.

```bash
cd frontend
npm install
```

*(Optional)* Create a `.env` file in the `frontend` root to define your API base URL:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```
*The application should now be accessible at `http://localhost:5173` (or the port specified by Vite).*

---

## 🔗 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register a new user | Public |
| `POST` | `/login` | Authenticate user & get token | Public |
| `GET` | `/me` | Get current logged-in user profile | Private |

### Leads (`/api/leads`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get all leads (with filters) | Private |
| `POST` | `/` | Create a new lead | Private |
| `GET` | `/:id` | Get lead details by ID | Private |
| `PUT` | `/:id` | Update a lead | Private |
| `DELETE`| `/:id` | Delete a lead | Private (`admin` or `sales`) |
| `GET` | `/export` | Export leads data to CSV | Private |

---

## 📸 Screenshots

*(Replace the placeholders below with actual project screenshots)*

### Dashboard View
![Dashboard Placeholder](https://via.placeholder.com/800x450?text=Dashboard+View)
> *The main dashboard where users can monitor and filter active leads.*

### Add/Edit Lead Modal
![Form Placeholder](https://via.placeholder.com/800x450?text=Lead+Form)
> *Clean, validated forms for seamless data entry.*

---

## 🔮 Future Improvements
While the project is fully functional, here are some planned enhancements for future iterations:
- **Real-time Notifications**: Implement WebSockets (Socket.io) to notify users of lead status changes instantly.
- **Advanced Analytics**: Add comprehensive charts and data visualization for sales performance metrics.
- **Third-party Integrations**: Sync leads with external CRM tools like Salesforce or HubSpot.
- **Dockerization**: Containerize both frontend and backend for one-click deployment.

---

## 👨‍💻 Author

**Yash Pandey**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [Your LinkedIn Profile](https://linkedin.com/in/your-profile)

---
*Built with ❤️ for a Full Stack Development Internship Assignment.*
