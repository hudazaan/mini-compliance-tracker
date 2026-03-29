# Compliance Tracker | LedgerCFO Assignment

A high-performance, dark-themed dashboard built to manage regulatory compliance tasks across a global portfolio of clients. Developed with **Next.js**, **Tailwind CSS**, and **Supabase**.

## 🚀 Core Features
- **Portfolio Overview:** Searchable home dashboard with real-time stats (Active Clients vs. Critical Alerts).
- **Relational Task Management:** Deep-link into specific client entities (e.g., Acme Corp, Global Tech).
- **Dynamic Overdue Logic:** Automated flagging of "Pending" tasks that have passed their due date with high-visibility warnings.
- **Filtering:** Filter tasks by **Status** (Pending/Completed/All). 
- **Soft-Dark UI:** A professional "Zinc" color palette designed for low-eye-strain financial monitoring.

## 🛠️ Tech Stack
- **Framework:** Next.js (App Router)
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **Containerization:** Docker

## 📦 Installation & Setup

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd https://github.com/hudazaan/mini-compliance-tracker.git
npm install
```

### 2. Environment Variables
Create a .env.local file in the root directory:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Development Server
```bash
npm run dev
```

## 🐳 Docker Support

To run the application in a isolated container:

### 1. Build the image:
```bash
docker build -t compliance-app .
```

### 2. Run the container:
```bash
docker run -p 3000:3000 compliance-app
```

## ⚖️ Compliance Business Logic

* **Overdue Detection:** A task is visually flagged with a warning if:
    * `status === 'Pending'`
    * `due_date` is earlier than the current date (`new Date()`).
* **Relational Integrity:** * Tasks are strictly linked to Clients via a `client_id` (UUID).
    * This ensures data isolation and prevents cross-client task leakage.
* **Persistent State:** All task updates (Status) are synced in real-time to the Supabase PostgreSQL layer.

