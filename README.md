# 🌍 Traveloop


**Traveloop** is a premium, full-stack travel planning and itinerary management application. It empowers users to meticulously plan their trips, track expenses, manage packing checklists, and share their itineraries with the world. Built with a modern, responsive "neo-brutalist" glassmorphism aesthetic, Traveloop delivers a beautiful and intuitive user experience.

---

## ✨ Features

- **🗺️ Comprehensive Dashboard**: Get a birds-eye view of your upcoming trips, popular destinations, and budget overviews.
- **📅 Interactive Itinerary Builder**: Plan day-by-day activities, track estimated costs, and visualize your trip timeline.
- **💸 Expense & Budget Tracking**: A dedicated billing screen to monitor total budgets, sub-totals, taxes, and granular expenses with visual pie chart insights.
- **🎒 Packing Checklists**: Never forget an item again. Categorized packing lists (Documents, Clothing, Electronics) with progress tracking.
- **📝 Trip Journal & Notes**: Jot down essential details like hotel check-in times or local contacts directly tied to specific trips or stops.
- **🌐 Public Shared Itineraries**: Share your curated trips with friends or the public. Let others view, get inspired, and "Copy Trip" directly to their account.
- **👤 User Profiles**: Manage personal settings, profile photos, and view your complete trip history.

---

## 🎨 UI/UX Design

Traveloop features a bespoke UI design that combines:
- **Neo-brutalism**: Distinctive thick borders (`2px solid #2f2a28`), bold typography, and flat background elements.
- **Glassmorphism**: Beautiful frosted-glass panels (`backdrop-filter: blur(14px)`) layered over a dynamic, subtly animated background pattern.

---

## 🚀 Tech Stack

### Frontend
- **React.js** (Functional components, Hooks)
- **React Router DOM** for seamless SPA navigation
- **Vanilla CSS3** tailored for absolute layout control and custom animations
- **React Toastify** for elegant notification alerts

### Backend & Database
- **Node.js & Express** for robust API endpoints
- **PostgreSQL** relational database for complex data modeling (Trips, Stops, Activities, Notes, Packing Items)
- **JWT** (JSON Web Tokens) for secure authentication

---

## 📂 Project Structure

```
Traveloop/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route logic
│   ├── models/          # PostgreSQL database models (tripModel, noteModel, etc.)
│   ├── routes/          # Express API routes
│   └── server.js        # Entry point
│
└── frontend/
    ├── public/
    └── src/
        ├── assets/      # Images, icons, backgrounds
        ├── components/  # React components (Dashboard, Trips, Profile, etc.)
        ├── context/     # React Context (AuthContext)
        ├── services/    # API interaction services (authService, tripService)
        ├── App.js       # Main application router
        └── index.js     # React DOM render
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16+ recommended)
- PostgreSQL

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/Traveloop.git
cd Traveloop
```

### 2. Backend Setup
```bash
cd backend
npm install
```
- Create a `.env` file in the `backend` directory based on `.env.example`.
- Add your PostgreSQL credentials and JWT secret:
  ```env
  DB_USER=postgres
  DB_PASSWORD=yourpassword
  DB_HOST=localhost
  DB_PORT=5432
  DB_NAME=traveloop_db
  JWT_SECRET=your_jwt_secret
  ```
- Start the backend server:
  ```bash
  npm run dev
  ```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
- Start the React development server:
  ```bash
  npm start
  ```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check out the [issues page](https://github.com/yourusername/Traveloop/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---
