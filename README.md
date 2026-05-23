# TrackWise 💳

A smart subscription management platform that helps you track all your recurring subscriptions, avoid surprise renewals, and understand your spending patterns — powered by AI.

**Live Demo:** [trackwise.vercel.app](https://trackwise.vercel.app)

---

## ✨ Features

### 🤖 AI Email Parsing
Paste any subscription confirmation email and Claude AI automatically extracts the service name, amount, billing cycle, and renewal date — zero manual typing.

### 🔔 Renewal Reminders
Color-coded banner alerts on the dashboard:
- 🔴 Red — renewing in 0–3 days
- 🟡 Yellow — renewing in 4–7 days
- No clutter for anything beyond 7 days

### 📊 Analytics Dashboard
- Monthly & yearly spend totals
- Spending trend chart (last 6 months)
- Category breakdown donut chart
- Top 5 most expensive subscriptions
- Savings opportunity insights
- Month-over-month change indicator
  

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Charts | Recharts |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) |
| AI | Anthropic Claude API |
| Routing | React Router DOM |
| HTTP Client | Axios |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 📁 Folder Structure

```
Trackwise/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── subscriptionController.js
│   │   ├── parseEmailController.js
│   │   └── analyticsController.js
│   ├── models/
│   │   ├── User.js
│   │   └── Subscription.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── subscriptionRoutes.js
│   │   ├── parseEmailRoutes.js
│   │   └── analyticsRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── config/
│   │   └── db.js
│   ├── .env
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Card.jsx
    │   │   ├── Button.jsx
    │   │   ├── StatCard.jsx
    │   │   └── RemindersBanner.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── AddSubscription.jsx
    │   │   ├── AddFromEmail.jsx
    │   │   ├── EditSubscription.jsx
    │   │   ├── SubscriptionsList.jsx
    │   │   └── Analytics.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── tailwind.config.js
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Anthropic API key — [console.anthropic.com](https://console.anthropic.com)

### 1. Clone the repo

```bash
git clone https://github.com/harpreetkaur7879/Trackwise.git
cd Trackwise
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ANTHROPIC_API_KEY=your_anthropic_api_key
CLIENT_URL=http://localhost:5173
```

Start backend:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

Start frontend:

```bash
npm run dev
```

App will be live at `http://localhost:5173`

---

## 🌐 Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | [trackwise.vercel.app](https://trackwise.vercel.app) |
| Backend | Render | [trackwise-lju8.onrender.com](https://trackwise-lju8.onrender.com) |

---

## 📌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Subscriptions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subscriptions` | Get all subscriptions |
| POST | `/api/subscriptions` | Add subscription |
| PUT | `/api/subscriptions/:id` | Update subscription |
| DELETE | `/api/subscriptions/:id` | Delete subscription |
| GET | `/api/subscriptions/upcoming` | Get upcoming renewals |
| POST | `/api/subscriptions/parse-email` | AI email parsing |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics` | Get full analytics data |

---

## 💡 How AI Email Parsing Works

1. User pastes a subscription confirmation email into the textarea
2. Frontend sends it to `POST /api/subscriptions/parse-email`
3. Backend sends it to Claude API with a strict JSON prompt
4. Claude extracts: service name, amount, currency, billing cycle, renewal date, category
5. Frontend pre-fills the Add Subscription form
6. User reviews and saves — one click done

---

## 🔒 Environment Variables

| Variable | Where | Description |
|----------|-------|-------------|
| `MONGODB_URI` | backend | MongoDB Atlas connection string |
| `JWT_SECRET` | backend | Secret key for JWT tokens |
| `ANTHROPIC_API_KEY` | backend | Claude API key |
| `PORT` | backend | Server port (default 8000) |
| `CLIENT_URL` | backend | Frontend URL for CORS |
| `VITE_API_URL` | frontend | Backend API base URL |

> ⚠️ Never commit `.env` files to GitHub. They are in `.gitignore`.

---

## 👩‍💻 Author

**Harpreet Kaur**
- GitHub: [@harpreetkaur7879](https://github.com/harpreetkaur7879)

---
