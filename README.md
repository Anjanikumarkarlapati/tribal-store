# Tribal

A full-stack marketplace connecting tribal artisans with global buyers.

## Tech Stack
- **Frontend:** React 19, React Router v7, Context API
- **Backend:** Node.js, Express.js, JWT auth, bcryptjs
- **Database:** MySQL (via mysql2)

---

## Quick Setup

### 1. Database
1. Open **MySQL Workbench** and connect with password `12345`
2. Open `database/tribal_db.sql`
3. Run the entire file (Ctrl+Shift+Enter)
4. This creates the `tribal_db` database with sample data

### 2. Backend
```bash
cd backend
npm install
node server.js
# Server starts on http://localhost:5000
```

### 3. Frontend
```bash
# From project root
npm install
npm start
# App opens on http://localhost:3000
```

---

## Demo Accounts
All passwords: **password123**

| Email | Role |
|---|---|
| admin@tribal.com | Admin |
| sunita@example.com | Artisan |
| ramesh@example.com | Artisan |
| kamla@example.com | Artisan |
| priya@example.com | Customer |

---

## Project Structure
```
tribal/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT authenticate + requireRole
│   ├── routes/
│   │   ├── users.js         # Register, login, profile
│   │   ├── products.js      # CRUD + approve
│   │   ├── artisans.js      # CRUD + approve
│   │   ├── cart.js          # Cart management
│   │   ├── orders.js        # Place and track orders
│   │   └── reviews.js       # Product reviews
│   ├── db.js                # MySQL connection pool
│   ├── server.js            # Express app entry
│   ├── .env                 # DB credentials and JWT secret
│   └── package.json
│
├── database/
│   └── tribal_db.sql   # Full schema + sample data
│
├── src/
│   ├── api/
│   │   └── api.js           # All frontend API calls
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── ToastContext.jsx
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── CartSidebar.jsx
│   │   ├── ProductCard.jsx
│   │   └── ArtisanCard.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Shop.jsx
│   │   ├── Artisans.jsx
│   │   ├── Login.jsx
│   │   ├── Roles.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Checkout.jsx
│   │   └── dashboards/
│   │       ├── AdminDashboard.jsx
│   │       ├── ArtisanDashboard.jsx
│   │       ├── CustomerDashboard.jsx
│   │       └── ConsultantDashboard.jsx
│   ├── App.jsx
│   ├── index.js
│   └── index.css
│
├── public/
│   └── index.html
└── package.json
```

---

## API Routes

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/users/register | open | Register any role |
| POST | /api/users/login | open | Email + password login |
| GET | /api/users/profile | user | Current user profile |
| GET | /api/products | open | All approved products |
| GET | /api/products/:id | open | Single product |
| POST | /api/products | artisan | Submit product |
| PUT | /api/products/:id/approve | admin | Approve product |
| GET | /api/artisans | open | All approved artisans |
| GET | /api/artisans/:id | open | Artisan + their products |
| PUT | /api/artisans/:id/approve | admin | Approve artisan |
| GET | /api/cart | user | User cart |
| POST | /api/cart | user | Add to cart |
| PUT | /api/cart/:product_id | user | Update quantity |
| DELETE | /api/cart | user | Clear cart |
| GET | /api/orders | user | User orders |
| POST | /api/orders | user | Place order |
| GET | /api/reviews/:product_id | open | Product reviews |
| POST | /api/reviews | user | Add review |
