
# Modern Editorial Blog Platform

A production-ready, highly scalable, and SEO-optimized blog website built with **Next.js (App Router)**, **Firebase/Firestore**, and **Tailwind CSS**. It features a robust Admin panel with a rich text editor (Tiptap) and a highly polished, "Editorial Aesthetic" public-facing interface.

![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-yellow?style=for-the-badge&logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

##  Features

###  Admin Panel (Secured via NextAuth)
* **Advanced Rich Text Editor:** Powered by Tiptap (Supports H1-H3, Bold, Italic, Code Blocks, Quotes, Images, YouTube embeds, and more).
* **Comprehensive Blog Management:** Create, edit, delete, draft, and publish articles.
* **Auto-generated SEO & Metadata:** Auto-slug generation, dynamic SEO titles, and descriptions.
* **Taxonomy Management:** Assign categories and multiple tags to posts.
* **Clean Dashboard:** Editorial aesthetic admin UI built with `shadcn/ui`.

###  Public Interface (No Auth Required)
* **Editorial Aesthetic:** High-contrast, beautiful typography (Playfair Display & Inter), and minimalistic paper-like design.
* **Smart Search:** Global search functionality to find blogs by title, tags, or categories.
* **Engaging Reading Experience:** Auto-generated Table of Contents (TOC), Reading Progress Bar, and Estimated Reading Time.
* **User Interactions:** Rate-limited and spam-protected Like (❤️), Comment (💬), and Share/Bookmark features.
* **Advanced SEO Integration:** Fully optimized with Dynamic Metadata, Open Graph, Twitter Cards, `sitemap.xml`, and JSON-LD Structured Data.
* **Personal Branding:** Tightly integrated with the author's portfolio for advanced entity SEO.

## Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS + shadcn/ui
* **Database & Backend:** Firebase / Firestore (NoSQL)
* **Authentication:** NextAuth.js (Admin Only)
* **Editor:** Tiptap
* **Deployment:** Vercel

## Getting Started

### Prerequisites
Make sure you have Node.js installed (v18 or higher) and a Firebase project set up.

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name

```

### 2. Install dependencies

```bash
npm install
# or
yarn install

```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add the following variables based on your Firebase and NextAuth setup:

```env
# NextAuth Settings
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-nextauth-key

# Admin Credentials (For NextAuth Login)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password

# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin Configuration (For Server-Side validation)
FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"

```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev

```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result. The admin panel is accessible at `/login` or `/admin`.

##  Project Structure

```text
├── app/
│   ├── (admin)/        # Protected Admin routes (Dashboard, Editor, Settings)
│   ├── (public)/       # Public routes (Home, Blog, Search, Categories)
│   └── api/            # Next.js API Routes (NextAuth, Firebase logic)
├── components/
│   ├── admin/          # Admin UI & Tiptap Editor extensions
│   ├── public/         # Public UI (Cards, TOC, Comments, Interactions)
│   └── shared/         # Reusable components (Navbar, Footer)
├── lib/                # Firebase SDKs, SEO utilities, and helper functions
└── styles/             # Global CSS and Tailwind configs

```

##  Author

**Abir Abdullah**

* Website: [abirabdullah.me](https://abirabdullah.me)
* GitHub: [@abirabdullahs](https://github.com/abirabdullahs)



