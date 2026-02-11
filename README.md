# 🔐 LinkVault — Secure File & Text Sharing with Expiry

LinkVault is a **secure, ephemeral sharing platform** that allows users to share **text snippets or files** via a generated link with **automatic expiry**, **optional password protection**, and **one-time view support**.

The project is built using a **clean client–server architecture**, with **React (frontend)** and **Node.js + Express (backend)**, and uses **Supabase** for storage and database management.

---

## ✨ Features

### 🔒 Security-First Design

* Optional **password protection**
* **One-time view** (content is destroyed after first access)
* Automatic **expiry-based deletion**
* Files never exposed directly to the client storage API

### 📁 Content Support

* Share **plain text**
* Share **any file type**
* Files stored securely in Supabase Storage
* Metadata stored in Supabase PostgreSQL

### 🔗 Smart Links

* Each upload generates a **unique shareable link**
* Supports direct browser access
* Clean REST API structure

---

## 🧱 Architecture Overview

```
linkvault/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── UploadSection.tsx
│   │   │   └── VaultView.tsx
│   │   ├── pages/
│   │   │   └── Vault.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── App.tsx
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/
│   │   │   └── vault.ts
│   │   ├── middleware/
│   │   │   └── upload.ts
│   │   ├── supabase.ts
│   │   └── index.ts
│
└── README.md
```

---

## 🛠 Tech Stack

### Frontend

* **React + TypeScript**
* React Router
* Tailwind CSS
* Fetch API

### Backend

* **Node.js**
* **Express**
* TypeScript
* Multer (in-memory uploads)

### Database & Storage

* **Supabase PostgreSQL**
* **Supabase Storage**
* Service Role Key (server-side only)

---

## 🔄 Application Flow

### Upload

1. User selects **text or file**
2. Sets expiry / password / one-time option
3. Frontend sends `FormData` to backend
4. Backend:

   * Uploads file to Supabase Storage (if any)
   * Stores metadata in `items` table
5. Backend returns a **vault ID**
6. Frontend generates a shareable link

### Access

1. User opens the link
2. Backend validates:

   * Vault existence
   * Expiry
   * Password (if required)
3. Content is returned
4. If **one-time view**:

   * File is deleted
   * Database row is deleted

---

## 🗃 Database Schema (items table)

```sql
id            uuid (primary key)
type          text ('text' | 'file')
content       text (nullable)
file_path     text (nullable)
file_name     text (nullable)
mime_type     text (nullable)
password      text (nullable)
expires_at    timestamptz
is_one_time   boolean
view_count    integer
created_at    timestamptz
```

---

## 🚀 Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/linkvault.git
cd linkvault
```

---

### 2️⃣ Supabase Setup

1. Create a project on **Supabase**
2. Create a **storage bucket** named:

```
vault
```

3. Create the `items` table using the schema above
4. Copy:

   * `SUPABASE_URL`
   * `SERVICE_ROLE_KEY` ⚠️ (never expose to frontend)

---

### 3️⃣ Backend Setup

```bash
cd server
npm install
```

Create `.env`:

```env
SUPABASE_URL=your_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=4000
```

Run server:

```bash
npm run dev
```

Server will start at:

```
http://localhost:4000
```

---

### 4️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 🔌 API Endpoints

### Create Vault

```http
POST /api/vault/create
```

**FormData**

* `type` → `text | file`
* `content` → string (for text)
* `file` → file (for file upload)
* `password` → optional
* `expires_at` → ISO string
* `is_one_time` → `"true" | "false"`

---

### Get Vault Metadata

```http
GET /api/vault/:id
```

---

### Download File

```http
GET /api/vault/:id/download
```

Automatically deletes file if one-time enabled.

---

## 🔐 One-Time View Logic (Important)

* Vault data is returned **first**
* Cleanup happens **after response**
* Ensures download works correctly
* Prevents premature deletion

---

## ⚠️ Security Notes

* Supabase **Service Role Key is server-only**
* Client never directly accesses Supabase
* All file downloads go through backend
* Storage bucket rules can be private

---

## 🛣 Future Enhancements

* 🔑 Password hashing (bcrypt)
* 🧹 Scheduled cleanup jobs
* 📊 Analytics dashboard
* 📎 Multiple file uploads
* 📦 Zip downloads
* 🔐 Signed URLs

---

## 👨‍💻 Author

**Harsh Jain**
Built with a focus on **security, architecture clarity, and real-world practices**.

