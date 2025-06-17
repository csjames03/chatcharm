# 📱 ChatCharm — Fan Engagement Dashboard

**ChatCharm** is a full-stack fan engagement dashboard prototype built to help  chatters manage fan interactions more efficiently. The app features real-time messaging, fan profiles, priority tagging, quick reply templates, and basic conversion analytics.

---

## 🚀 Features

- ✅ Responsive chat dashboard (mobile + desktop)
- 🌓 Dark mode support
- 💬 Real-time messaging with Socket.IO
- 🧠 Quick reply templates
- 🧍 Fan profile with spending history
- 📈 Basic analytics panel
- 🔄 Simulated AI typing + reply behavior

---

## 🛠 Tech Stack

| Frontend       | Backend          | Database       | Realtime   | Styling        |
|----------------|------------------|----------------|------------|----------------|
| React + Vite   | Node.js + Express| Prisma + SQLite| Socket.IO  | Tailwind CSS   |

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/csjames03/chatcharm.git
cd chatcharm

```
### 2. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 3. Push the dev database

# ⚠️ Important: prisma/dev.db is included in the repository because the frontend code relies on seeded data (e.g. fan IDs, agent ID, and template IDs). You must use this database to avoid errors.
```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

### 4. Start backend

```bash
cd backend
npm run dev
```

### 5. Start frontend

```bash
cd backend
npm run dev
```

