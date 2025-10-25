# Blog Platform 🚀# Blog Platform 🚀# Blog Platform 🚀

A modern, full-featured blogging platform built with **Next.js**, **TypeScript**, **tRPC**, **Drizzle ORM**, and **PostgreSQL**. Share your stories and inspire the world!A modern, full-featured blogging platform built with **Next.js**, **TypeScript**, **tRPC**, **Drizzle ORM**, and **PostgreSQL**. Share your stories and inspire the world!A modern, full-featured blogging platform built with **Next.js**, **TypeScript**, **tRPC**, **Drizzle ORM**, and **PostgreSQL**. Share your stories and inspire the world!

## Table of Contents## Table of Contents## Table of Contents

- [Features Implemented](#features-implemented-)- [Features Implemented](#features-implemented-)- [Features](#features-)

- [Tech Stack](#tech-stack-)

- [Setup Steps](#setup-steps)- [Tech Stack](#tech-stack-)- [Tech Stack](#tech-stack-)

- [Project Workflow](#project-workflow-)

- [Trade-offs & Decisions](#trade-offs--decisions-)- [Setup Steps](#setup-steps)- [Project Structure](#project-structure-)

- [Project Structure](#project-structure-)

- [API Documentation](#api-documentation-)- [Trade-offs & Decisions](#trade-offs--decisions-)- [Getting Started](#getting-started-)

- [Database Schema](#database-schema-)

- [Authentication Flow](#authentication-flow-)- [Project Structure](#project-structure-)- [Setup Steps](#setup-steps)

- [Validation Rules](#validation-rules-)

- [Troubleshooting](#troubleshooting-)- [API Documentation](#api-documentation-)- [API Documentation](#api-documentation-)

- [Learning Resources](#learning-resources)

- [Database Schema](#database-schema-)- [Database Schema](#database-schema-)

---

- [Authentication Flow](#authentication-flow-)- [Authentication Flow](#authentication-flow-)

## Features Implemented ✅

- [Troubleshooting](#troubleshooting-)- [User Guide](#user-guide-)

### Priority 1: Core Functionality

- [Learning Resources](#learning-resources)- [Validation](#validation-)

- [x] **User Authentication & Profiles**

  - ✅ User registration with email and password- [Troubleshooting](#troubleshooting-)

  - ✅ Secure login with JWT tokens

  - ✅ User profile pages with post management dashboard---- [Contributing](#contributing-)

  - ✅ Author names displayed on all posts

  - ✅ Profile picture/avatar support with initials- [Learning Resources](#learning-resources)

  - ✅ Profile page shows only user's own posts

## Features Implemented ✅

- [x] **Post Management (CRUD)**

  - ✅ Create new blog posts with rich markdown editor## Features ✨

  - ✅ Edit existing posts (only by creator)

  - ✅ Delete posts with confirmation dialog### Priority 1: Core Functionality

  - ✅ View complete post details

  - ✅ Auto-generated SEO-friendly slugs### User Management

  - ✅ Optional cover images with URL validation

  - ✅ Draft and published status system- [x] **User Authentication & Profiles**- 🔐 **JWT Authentication** - Sign up and login with email/password

- [x] **Categories System** - ✅ User registration with email and password- 👤 **User Profiles** - Create and manage user profiles with avatars

  - ✅ Browse 100+ pre-seeded categories

  - ✅ Assign multiple categories to posts - ✅ Secure login with JWT tokens- 📊 **Profile Dashboard** - View all posts created by the logged-in user only

  - ✅ Filter posts by category

  - ✅ Category-based navigation and discovery - ✅ User profile pages with post management dashboard- 🔑 **Secure Token Storage** - JWT tokens stored in localStorage

  - ✅ Real-time category search in forms

  - ✅ Author names displayed on all posts- ✅ **Protected Routes** - Authentication required for sensitive operations

- [x] **Blog Display & Navigation**

  - ✅ Home page with grid view of all posts - ✅ Profile picture/avatar support with initials

  - ✅ Blog detail page with full post content

  - ✅ Post cards with elegant styling - ✅ Profile page shows only user's own posts### Blog Management

  - ✅ Author information display on posts

  - ✅ Related posts recommendations- ✍️ **Create Posts** - Write blog posts with rich markdown editor

  - ✅ Responsive design (mobile, tablet, desktop)

- [x] **Post Management (CRUD)**- 📝 **Edit Posts** - Modify existing blog posts anytime

### Priority 2: Enhanced User Experience

- ✅ Create new blog posts with rich markdown editor- 🗑️ **Delete Posts** - Remove posts with confirmation

- [x] **Rich Text Editing**

  - ✅ Markdown support with live preview - ✅ Edit existing posts (only by creator)- 🏷️ **Categories** - Organize posts with multiple categories

  - ✅ MDEditor integration with formatting toolbar

  - ✅ Content syntax highlighting - ✅ Delete posts with confirmation dialog- 🖼️ **Cover Images** - Add cover images from URLs (optional)

  - ✅ Easy content formatting for users

  - ✅ View complete post details- 📄 **Pagination & Filtering** - Browse posts by category

- [x] **Advanced Filtering & Search**

  - ✅ Filter posts by category with real-time search - ✅ Auto-generated SEO-friendly slugs- 👀 **Draft System** - Save posts as unpublished drafts

  - ✅ Browse all posts organized by category

  - ✅ Category slug-based URL routing - ✅ Optional cover images with URL validation

  - ✅ Smart category recommendations

  - ✅ Draft and published status system### Content Display

- [x] **User Experience Enhancements**

  - ✅ Loading states with spinners- 🏠 **Home Page** - Grid view of all published blog posts

  - ✅ Error messages and validation feedback

  - ✅ Success notifications on actions- [x] **Categories System**- 📖 **Blog Detail Page** - Read full blog posts with author information

  - ✅ Responsive navigation bar

  - ✅ Consistent color scheme and typography - ✅ Browse 100+ pre-seeded categories- 🔗 **Related Posts** - Discover similar posts in the same category

  - ✅ Smooth transitions and hover effects

  - ✅ Assign multiple categories to posts- 🎨 **Responsive Design** - Mobile-friendly interface

- [x] **Form Validation**

  - ✅ Client-side validation with detailed errors - ✅ Filter posts by category- 👁️ **Footer Management** - Hidden from auth pages (login/signup)

  - ✅ Server-side validation with Zod schemas

  - ✅ Field-level validation feedback - ✅ Category-based navigation and discovery

  - ✅ Character limits with visual indicators

  - ✅ Required field indicators - ✅ Real-time category search in forms## Setup Steps

- [x] **Image & Content Management**- [x] **Blog Display & Navigation**### Prerequisites

  - ✅ Cover image URL validation

  - ✅ Optional cover images for posts - ✅ Home page with grid view of all posts- **Node.js** 18+

  - ✅ Responsive image handling

  - ✅ Image form with URL input - ✅ Blog detail page with full post content- **PostgreSQL** 12+

### Priority 3: Polish & Optimization - ✅ Post cards with elegant styling- **npm** or **yarn**

- [x] **UI/UX Polish** - ✅ Author information display on posts

  - ✅ Consistent color scheme (#3B82F6 primary, #1F3A51 dark navy)

  - ✅ Smooth transitions and hover effects - ✅ Related posts recommendations### 1. Clone the Repository

  - ✅ Professional typography and spacing

  - ✅ Rounded corners and shadows for depth - ✅ Responsive design (mobile, tablet, desktop)

  - ✅ Gradient backgrounds for visual appeal

`````bash

- [x] **Layout & Navigation**

  - ✅ Header with navigation menu### Priority 2: Enhanced User Experiencegit clone https://github.com/yourusername/blog-platform.git

  - ✅ Footer with platform information

  - ✅ Footer hidden on login/signup pagescd blog-platform

  - ✅ Proper spacing and margins throughout

  - ✅ Clean, minimalist design- [x] **Rich Text Editing**```

  - ✅ Mobile-first responsive approach

  - ✅ Markdown support with live preview

- [x] **Author Management**

  - ✅ Automatic author creation on post submission  - ✅ MDEditor integration with formatting toolbar### 2. Install Dependencies

  - ✅ Author lookup by name

  - ✅ User-specific post filtering on profile  - ✅ Content syntax highlighting

  - ✅ Author information on all posts

  - ✅ Atomic operations prevent user orphaning  - ✅ Easy content formatting for users```bash



- [x] **Error Handling & Recovery**npm install

  - ✅ Comprehensive error messages

  - ✅ Validation error extraction and display- [x] **Advanced Filtering & Search**```

  - ✅ Network error handling

  - ✅ User-friendly error recovery guidance  - ✅ Filter posts by category with real-time search



- [x] **Performance Optimizations**  - ✅ Browse all posts organized by category### 3. Setup Environment Variables

  - ✅ Server-side post filtering by author

  - ✅ Conditional tRPC queries  - ✅ Category slug-based URL routing

  - ✅ Database indexing on important fields

  - ✅ Responsive image handling  - ✅ Smart category recommendationsCreate a `.env` file in the root directory:

  - ✅ Type-safe API calls with tRPC



---

- [x] **User Experience Enhancements**```env

## Tech Stack 🛠️

  - ✅ Loading states with spinners# Database Configuration

### Frontend

- **Next.js 15.5.6** - React framework with App Router  - ✅ Error messages and validation feedbackDATABASE_URL=postgresql://user:password@localhost:5432/blog_platform

- **React 19.1.0** - UI library

- **TypeScript** - Type-safe development  - ✅ Success notifications on actions

- **Tailwind CSS v4** - Utility-first CSS framework

- **Lucide React** - Icon library  - ✅ Responsive navigation bar# JWT Configuration

- **@uiw/react-md-editor** - Markdown editor for blog content

- **Zod** - Runtime schema validation  - ✅ Consistent color scheme and typographyJWT_SECRET=your_super_secret_jwt_key_here



### Backend  - ✅ Smooth transitions and hover effects

- **tRPC** - Type-safe RPC framework (replaces REST API)

- **Drizzle ORM** - SQL database ORM with TypeScript support# Optional: Cloudinary (for future image uploads)

- **PostgreSQL** - Relational database

- **Node.js** - JavaScript runtime- [x] **Form Validation**NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

- **bcrypt** - Password hashing library

  - ✅ Client-side validation with detailed errors```

### Authentication & Security

- **JWT (JSON Web Tokens)** - Secure token-based authentication  - ✅ Server-side validation with Zod schemas

- **bcrypt** - Password hashing with salt

- **localStorage** - Client-side token storage  - ✅ Field-level validation feedback### 4. Setup Database

- **Protected Routes** - Authentication middleware

  - ✅ Character limits with visual indicators

### Development Tools

- **ESLint** - Code linting  - ✅ Required field indicators```bash

- **PostCSS** - CSS processing

- **TypeScript** - Static type checking# Push schema changes to your database



---- [x] **Image & Content Management**npm run db:push



## Setup Steps  - ✅ Cover image URL validation



### Prerequisites  - ✅ Optional cover images for posts# Seed database with sample data (optional)

- **Node.js** 18+

- **PostgreSQL** 12+  - ✅ Responsive image handlingnpm run db:seed

- **npm** or **yarn**

  - ✅ Image form with URL input```

### 1. Clone Repository



```bash

git clone https://github.com/yourusername/blog-platform.git### Priority 3: Polish & Optimization### 5. Run Development Server

cd blog-platform

```



### 2. Install Dependencies- [x] **UI/UX Polish**```bash



```bash  - ✅ Consistent color scheme (#3B82F6 primary, #1F3A51 dark navy)npm run dev

npm install

```  - ✅ Smooth transitions and hover effects```



### 3. Setup Environment Variables  - ✅ Professional typography and spacing



Create `.env` file in root directory:  - ✅ Rounded corners and shadows for depthOpen [http://localhost:3000](http://localhost:3000) in your browser.



```env  - ✅ Gradient backgrounds for visual appeal

# Database

DATABASE_URL=postgresql://user:password@localhost:5432/blog_platform### Available Scripts



# JWT Secret (for token generation)- [x] **Layout & Navigation**

JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars

```  - ✅ Header with navigation menu```bash



### 4. Initialize Database  - ✅ Footer with platform information# Development



```bash  - ✅ Footer hidden on login/signup pagesnpm run dev              # Start development server with hot reload

# Push schema to database

npm run db:push  - ✅ Proper spacing and margins throughout



# Seed with sample data (optional)  - ✅ Clean, minimalist design# Database

npm run db:seed

```  - ✅ Mobile-first responsive approachnpm run db:push        # Push schema changes to database



### 5. Run Development Servernpm run db:seed        # Seed database with sample data



```bash- [x] **Author Management**npm run db:studio      # Open Drizzle Studio for database management

npm run dev

```  - ✅ Automatic author creation on post submission



Open [http://localhost:3000](http://localhost:3000) in browser.  - ✅ Author lookup by name# Build & Production



### Available Scripts  - ✅ User-specific post filtering on profilenpm run build           # Build for production



```bash  - ✅ Author information on all postsnpm start              # Start production server

# Development

npm run dev              # Start dev server with hot reload  - ✅ Atomic operations prevent user orphaning



# Database# Linting

npm run db:push        # Push schema changes

npm run db:seed        # Seed database with samples- [x] **Error Handling & Recovery**npm run lint           # Run ESLint

npm run db:studio      # Open Drizzle Studio

  - ✅ Comprehensive error messages```

# Build & Production

npm run build           # Build for production  - ✅ Validation error extraction and display

npm start              # Start production server

  - ✅ Network error handling## Tech Stack 🛠️

# Linting

npm run lint           # Run ESLint  - ✅ User-friendly error recovery guidance

```

### Frontend

---

- [x] **Performance Optimizations**- **Next.js 15.5.6** - React framework with App Router

## Project Workflow 🔄

  - ✅ Server-side post filtering by author- **React 19.1.0** - UI library

### User Registration & Login Flow

  - ✅ Conditional tRPC queries- **TypeScript** - Type-safe development

```

┌─────────────────────────────────────────────────────────────────────┐  - ✅ Database indexing on important fields- **Tailwind CSS v4** - Utility-first CSS framework

│                    USER AUTHENTICATION WORKFLOW                     │

└─────────────────────────────────────────────────────────────────────┘  - ✅ Responsive image handling- **Lucide React** - Icon library



1. USER SIGNUP  - ✅ Type-safe API calls with tRPC- **@uiw/react-md-editor** - Markdown editor

   ├─ User navigates to /signup

   ├─ Enters: Email, Password, Name- **Zod** - Schema validation

   ├─ Frontend validates input (Zod schemas)

   ├─ Sends request to tRPC auth.signup mutation---

   ├─ Backend:

   │  ├─ Validates email uniqueness### Backend

   │  ├─ Hashes password with bcrypt

   │  ├─ Creates user in database## Tech Stack 🛠️- **tRPC** - Type-safe backend API

   │  └─ Generates JWT token

   ├─ Token stored in localStorage- **Drizzle ORM** - SQL database ORM with type safety

   └─ Redirects to /profile

### Frontend- **PostgreSQL** - Relational database

2. USER LOGIN

   ├─ User navigates to /login- **Next.js 15.5.6** - React framework with App Router- **Node.js** - JavaScript runtime

   ├─ Enters: Email, Password

   ├─ Frontend validates input- **React 19.1.0** - UI library

   ├─ Sends credentials to tRPC auth.login mutation

   ├─ Backend:- **TypeScript** - Type-safe development### Authentication

   │  ├─ Finds user by email

   │  ├─ Verifies password with bcrypt.compare()- **Tailwind CSS v4** - Utility-first CSS framework- **JWT (JSON Web Tokens)** - Secure token-based authentication

   │  ├─ Generates JWT token

   │  └─ Returns token- **Lucide React** - Icon library- **bcrypt** - Password hashing

   ├─ Token stored in localStorage

   └─ Redirects to /profile- **@uiw/react-md-editor** - Markdown editor for blog content- **localStorage** - Client-side token storage



3. PROTECTED ROUTES- **Zod** - Runtime schema validation- **Create Post**: [http://localhost:3000/create-post](http://localhost:3000/create-post)

   ├─ Request includes JWT token in header

   ├─ Server validates token signature- **Edit Post**: [http://localhost:3000/edit-post/[slug]](http://localhost:3000/edit-post/[slug])

   ├─ User context extracted from token

   └─ Request authorized or denied### Backend



4. LOGOUT- **tRPC** - Type-safe RPC framework (replaces REST API)## Features Implemented

   ├─ User clicks logout button

   ├─ localStorage token cleared- **Drizzle ORM** - SQL database ORM with TypeScript support

   └─ Redirects to /login

```- **PostgreSQL** - Relational database### ✅ Priority 1 Features (Core Functionality)



### Blog Post Creation Workflow- **Node.js** - JavaScript runtime



```- **bcrypt** - Password hashing library- [x] **User Authentication & Profiles**

┌─────────────────────────────────────────────────────────────────────┐

│                    POST CREATION WORKFLOW                           │

└─────────────────────────────────────────────────────────────────────┘

### Authentication & Security  - User registration and login

1. USER NAVIGATES TO CREATE POST

   ├─ Access /create-post page- **JWT (JSON Web Tokens)** - Secure token-based authentication  - User profile pages with post management

   ├─ Frontend checks auth (redirects if not logged in)

   └─ Form loads with empty fields- **bcrypt** - Password hashing with salt  - Author names display on posts



2. FORM FILLING- **localStorage** - Client-side token storage  - Profile picture/avatar support

   ├─ Enter Title (3-100 chars)

   ├─ Enter Content (markdown, min 10 chars)- **Protected Routes** - Authentication middleware

   ├─ Enter Excerpt (1-200 chars)

   ├─ (Optional) Upload Cover Image URL- [x] **Post Management**

   ├─ Select Author Name

   ├─ Select Categories (min 1)### Development Tools

   └─ Slug auto-generated from title

- **ESLint** - Code linting  - Create new blog posts with rich text editor (MDEditor)

3. CLIENT-SIDE VALIDATION

   ├─ Validates all required fields- **PostCSS** - CSS processing  - Edit existing posts

   ├─ Checks title length (3-100)

   ├─ Checks slug format (lowercase, hyphens only)- **TypeScript** - Static type checking  - Delete posts

   ├─ Validates excerpt length (1-200)

   ├─ Validates content length (min 10)  - View post details

   ├─ If cover image provided:

   │  └─ Validates URL format---  - Auto-generated slugs for SEO-friendly URLs

   └─ Shows errors if validation fails

  - Cover image upload (Cloudinary integration)

4. USER SUBMITS FORM

   ├─ Frontend sends mutation to tRPC.posts.create## Setup Steps

   ├─ Payload includes:

   │  ├─ title, content, excerpt, slug- [x] **Categories System**

   │  ├─ coverImage (or undefined)

   │  ├─ authorId, categoryIds### Prerequisites

   │  └─ published status

   └─ Request sent with JWT token- **Node.js** 18+  - Create and manage categories



5. SERVER-SIDE VALIDATION- **PostgreSQL** 12+  - Assign multiple categories to posts

   ├─ Validates JWT token

   ├─ Validates input with Zod schema- **npm** or **yarn**  - Filter posts by category

   ├─ Checks slug uniqueness

   ├─ Validates author exists  - Category-based navigation

   ├─ Validates categories exist

   └─ Returns validation errors or proceeds### 1. Clone Repository



6. DATABASE OPERATIONS- [x] **Blog Display**

   ├─ Insert post into posts table

   │  └─ Returns post ID```bash  - Blog listing page with all posts

   ├─ Insert relationships into postsToCategories

   │  └─ Links post to selected categoriesgit clone https://github.com/yourusername/blog-platform.git  - Post cards with elegant styling

   └─ Atomic transaction ensures data consistency

cd blog-platform  - Post filtering and search capabilities

7. SUCCESS RESPONSE

   ├─ Server returns created post data```  - Pagination support

   ├─ Frontend shows success message

   ├─ Redirects to blog detail page: /blog/[slug]  - Responsive design (mobile, tablet, desktop)

   └─ Post now visible to all users

### 2. Install Dependencies

8. ERROR HANDLING

   ├─ Validation error → Display field-specific errors### ✅ Priority 2 Features (Enhanced UX)

   ├─ Database error → Show user-friendly message

   ├─ Network error → Show retry option```bash

   └─ Auth error → Redirect to login

```npm install- [x] **Rich Text Editor**



### Blog Post Editing Workflow````



```- Markdown support with live preview

┌─────────────────────────────────────────────────────────────────────┐

│                    POST EDITING WORKFLOW                            │### 3. Setup Environment Variables - MDEditor integration with toolbar

└─────────────────────────────────────────────────────────────────────┘

- Automatic content formatting

1. USER NAVIGATES TO EDIT PAGE

   ├─ Access /edit-post/[slug]Create `.env` file in root directory:

   ├─ Frontend fetches post by slug

   ├─ Checks if current user is author- [x] **Advanced Search & Filter**

   ├─ Shows 403 if not author

   └─ Pre-fills form with existing data````env



2. LOAD EXISTING POST DATA# Database  - Filter posts by category

   ├─ Fetch post details via tRPC.posts.getBySlug

   ├─ Fetch author informationDATABASE_URL=postgresql://user:password@localhost:5432/blog_platform  - Search functionality

   ├─ Fetch associated categories

   ├─ Display in form fields  - Real-time category search in dropdown

   └─ Show markdown preview

# JWT Secret (for token generation)

3. USER MODIFIES POST

   ├─ Edit any field:JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars- [x] **User Experience Enhancements**

   │  ├─ Title, Content, Excerpt

   │  ├─ Cover Image URL

   │  └─ Categories

   ├─ Slug can be regenerated if title changed# Optional: Cloudinary (for future image uploads)  - Loading states with spinners

   └─ Real-time preview for markdown

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name  - Error messages and validation

4. VALIDATION & SUBMISSION

   ├─ Same client-side validation as create```  - Success notifications

   ├─ Send mutation to tRPC.posts.update

   ├─ Include post ID in payload  - Responsive navigation

   └─ Include updated fields

### 4. Initialize Database  - Elegant color scheme and typography

5. SERVER-SIDE PROCESSING

   ├─ Verify user is post author

   ├─ Validate all input fields

   ├─ Check slug uniqueness (excluding current post)```bash- [x] **Form Validation**

   ├─ Update post table

   ├─ Update categories (delete old, insert new)# Push schema to database

   └─ Return updated post

npm run db:push  - Client-side validation with error messages

6. POST-UPDATE

   ├─ Success message displayed  - Required field indicators (\*)

   ├─ Redirects to updated post: /blog/[new-slug]

   └─ Changes visible immediately# Seed with sample data (optional)  - Character counters (excerpt: 150 char max)



7. AUTHORIZATION CHECKnpm run db:seed  - Dynamic form feedback

   ├─ Only post creator can edit

   ├─ Server verifies ownership````

   ├─ Non-authors get 403 Forbidden

   └─ Frontend hides edit button for non-authors- [x] **Image Management**

```

### 5. Run Development Server - Cover image upload with preview

### Blog Post Display & Reading Workflow

- Image removal functionality

```

┌─────────────────────────────────────────────────────────────────────┐```bash - Cloudinary integration for optimization

│                    POST READING WORKFLOW                            │

└─────────────────────────────────────────────────────────────────────┘npm run dev  - File size validation (up to 5MB)



1. HOME PAGE LOAD```

   ├─ User visits / (home)

   ├─ Frontend fetches all published posts### ✅ Priority 3 Features (Polish & Optimization)

   ├─ tRPC.posts.list query executed

   ├─ Server returns posts with:Open [http://localhost:3000](http://localhost:3000) in browser.

   │  ├─ title, excerpt, coverImage

   │  ├─ author information- [x] **UI/UX Polish**

   │  ├─ createdAt, updatedAt

   │  └─ slug for routing### Available Scripts

   └─ Posts displayed in grid layout

- Consistent color scheme (#3B82F6 primary, #1F3A51 dark navy)

2. POST CARDS DISPLAY

   ├─ Show cover image (if available)````bash - Smooth transitions and hover effects

   ├─ Display post title

   ├─ Show excerpt (1-200 chars)# Development  - Professional typography and spacing

   ├─ Display author name

   ├─ Show creation datenpm run dev              # Start dev server with hot reload  - Rounded corners and shadows for depth

   ├─ Hover effects for UX

   └─ Click to view full post



3. VIEW FULL POST# Database- [x] **Form Optimization**

   ├─ Click on post card or title

   ├─ Navigate to /blog/[slug]npm run db:push        # Push schema changes

   ├─ Frontend fetches full post via tRPC.posts.getBySlug

   ├─ Display:npm run db:seed        # Seed database with samples  - 2-column grid layout for efficient space usage

   │  ├─ Full title

   │  ├─ Cover image (if available)npm run db:studio      # Open Drizzle Studio  - Compact cover image and buttons

   │  ├─ Author name with profile

   │  ├─ Publication date  - Selected categories display inside search bar

   │  ├─ Full markdown content (rendered)

   │  ├─ Categories as tags# Build & Production  - Category dropdown appears only when searching

   │  └─ Related posts section

   └─ Show edit/delete buttons if user is authornpm run build           # Build for production  - Smaller, right-aligned buttons



4. RELATED POSTSnpm start              # Start production server

   ├─ Query posts from same categories

   ├─ Exclude current post- [x] **Layout Refinement**

   ├─ Limit to 3-4 posts

   ├─ Display in grid at bottom# Linting

   ├─ Each card shows:

   │  ├─ Cover imagenpm run lint           # Run ESLint  - Header and footer with consistent styling

   │  ├─ Title

   │  ├─ Author```  - Proper spacing and margins

   │  └─ Category tags

   └─ Click to navigate to related post  - Responsive layout for all screen sizes



5. CATEGORY FILTERING### Quick Test Accounts  - Clean, minimalist design

   ├─ User clicks on category tag

   ├─ Navigate to /categories/[slug]

   ├─ Fetch all posts in category

   ├─ Display filtered post gridAfter seeding, use these credentials:- [x] **Author Management**

   ├─ Show category name & description

   └─ Users can browse by interest



6. POST DELETION```  - Manual author name input (no database lookup)

   ├─ Only post author sees delete button

   ├─ Click delete → confirmation dialogEmail: theodore@example.com  - Automatic author creation on post submission

   ├─ Confirm → tRPC.posts.delete mutation

   ├─ Server:Password: (check seed.js for password)  - Auto-generated email format: `firstname.lastname@blog.local`

   │  ├─ Verifies user is author

   │  ├─ Deletes post relationships````

   │  ├─ Deletes post record

   │  └─ Returns success- [x] **Error Handling**

   ├─ Frontend clears cache

   └─ Redirects to profile or home--- - Hydration mismatch fixes

```

- Proper error messages and recovery

### User Profile & Dashboard Workflow

## Trade-offs & Decisions 🎯 - Validation error display

```

┌─────────────────────────────────────────────────────────────────────┐### 1. **tRPC vs REST API**## Trade-offs & Decisions

│                    PROFILE DASHBOARD WORKFLOW                       │

└─────────────────────────────────────────────────────────────────────┘- **Decision**: Migrated to tRPC from REST API



1. ACCESS PROFILE PAGE- **Rationale**: Full type-safety across frontend/backend, auto documentation, smaller payload### 1. **REST API vs tRPC**

   ├─ User clicks profile link in navbar

   ├─ Navigate to /profile- **Trade-off**: Steeper learning curve, less familiar for REST developers

   ├─ Frontend verifies JWT exists

   ├─ Redirects to /login if not authenticated- **Decision**: Kept REST API with plain TypeScript

   └─ Load user data from localStorage

### 2. **JWT Authentication vs Session-based**- **Rationale**: Simpler to understand and maintain; API routes are more flexible for Cloudinary integration

2. PROFILE DATA DISPLAY

   ├─ Fetch user info:- **Decision**: JWT tokens in localStorage- **Trade-off**: Lost some type safety benefits of tRPC but gained simplicity

   │  ├─ Name, Email, Bio

   │  ├─ Profile image/avatar- **Rationale**: Simpler implementation, stateless server, works well for SPAs

   │  └─ Member since date

   ├─ Display user stats:- **Trade-off**: No built-in token invalidation, token compromise requires manual logout### 2. **Inline Styles vs Tailwind CSS**

   │  ├─ Total posts created

   │  ├─ Total categories used### 3. **Drizzle ORM vs Prisma**- **Decision**: Mix of Tailwind classes and inline styles

   │  └─ Member duration

   └─ Show edit profile button- **Decision**: Drizzle ORM- **Rationale**: Inline styles used for dynamic colors and theme consistency; Tailwind for layout and responsive design



3. USER'S POSTS SECTION- **Rationale**: Better type safety, SQL-first approach, smaller bundle size, better for tRPC- **Trade-off**: Slightly larger bundle size but more maintainable color system

   ├─ Fetch posts filtered by author ID

   ├─ tRPC.posts.listByAuthor(authorId) query- **Trade-off**: Less mature ecosystem, fewer high-level helpers

   ├─ Server returns only user's posts

   ├─ Display in grid/list format### 3. **Author Creation Strategy**

   ├─ Each post card shows:

   │  ├─ Title, excerpt, cover### 4. **Optional Cover Images**

   │  ├─ Publication status

   │  ├─ Creation date- **Decision**: Cover images optional with URL validation- **Decision**: Manual input with automatic database creation

   │  ├─ Edit button

   │  └─ Delete button- **Rationale**: Reduces required fields, validates URLs before storage- **Rationale**: More flexible for users; allows custom author names

   └─ Show "No posts yet" if empty

- **Trade-off**: Empty strings must be converted to undefined in validation- **Trade-off**: Potential for duplicate author entries if not careful (mitigated by email-based lookup)

4. EDIT POST FROM PROFILE

   ├─ Click edit button on post card### 5. **Post Author Filtering**### 4. **MDEditor for Content**

   ├─ Navigate to /edit-post/[slug]

   ├─ Follow edit workflow (see above)- **Decision**: Posts filtered at database level with `listByAuthor` query

   └─ Return to profile after save

- **Rationale**: Better performance, security, data isolation- **Decision**: Use @uiw/react-md-editor instead of plain textarea

5. DELETE POST FROM PROFILE

   ├─ Click delete button- **Trade-off**: Requires separate query implementation for user-specific posts- **Rationale**: Better user experience with markdown preview and toolbar

   ├─ Show confirmation dialog

   ├─ Confirm deletion- **Trade-off**: Additional dependency, slight increase in bundle size

   ├─ Post removed from database

   ├─ Grid refreshes automatically### 6. **Footer Visibility Management**

   └─ "Post deleted" message shown

- **Decision**: Conditional footer using client-side component wrapper### 5. **Category Search UX**

6. EDIT PROFILE

   ├─ Click edit profile button- **Rationale**: Clean solution without file restructuring, minimal overhead

   ├─ Navigate to /edit-profile

   ├─ Display editable form with:- **Trade-off**: Slight client-side computation for route detection- **Decision**: Dropdown only appears when user types

   │  ├─ Name field

   │  ├─ Bio textarea- **Rationale**: Reduces visual clutter, cleaner interface

   │  ├─ Profile image URL

   │  └─ Email (read-only)### 7. **Dual Validation Strategy**- **Trade-off**: Users must remember to type to see categories (mitigated by label and placeholder)

   ├─ User updates fields

   ├─ Submit mutation tRPC.users.updateProfile- **Decision**: Client-side + Server-side validation with Zod

   ├─ Server validates and updates

   ├─ Success message shown- **Rationale**: Fast UX feedback + security against tampering### 6. **Image Upload Provider**

   └─ Redirect back to /profile

- **Trade-off**: Validation logic duplicated in schemas

7. LOGOUT

   ├─ Click logout button- **Decision**: Cloudinary for image hosting

   ├─ JWT cleared from localStorage

   ├─ User context reset### 8. **Category Search Implementation**- **Rationale**: Free tier, easy integration, automatic optimization

   └─ Redirect to /login

```- **Decision**: Real-time search in dropdown during post creation- **Trade-off**: Dependency on external service; data privacy considerations



### Data Flow Architecture- **Rationale**: Better UX for 100+ categories, filters on client



```- **Trade-off**: Requires client-side filtering logic### 7. **Excerpt Character Limit**

┌────────────────────────────────────────────────────────────────────┐

│                    DATA FLOW ARCHITECTURE                           │---- **Decision**: 150 characters with color-coded feedback

└────────────────────────────────────────────────────────────────────┘

- **Rationale**: Encourages concise summaries; visual feedback helps users

FRONTEND (Next.js + React)

├─ Page Components (/app)## Project Structure 📁- **Trade-off**: Restrictive for longer excerpts (can be adjusted if needed)

├─ React Hooks for state management

├─ tRPC Client hooks (useQuery, useMutation)````## Time Spent

├─ Zod schemas for validation

└─ localStorage for token persistencesrc/



        ↕ tRPC Binary Protocol├── app/### Development Timeline



tRPC SERVER (Node.js)│   ├── api/                     # Legacy API routes (unused)

├─ Router & Procedures

├─ Middleware (validation, logging)│   ├── blog/| Phase             | Task                                  | Time Estimated | Time Actual  | Status |

├─ Input validation with Zod

├─ Authorization checks│   │   ├── [slug]/page.tsx      # Blog post detail page| ----------------- | ------------------------------------- | -------------- | ------------ | ------ |

└─ Calls Drizzle ORM

│   │   └── page.tsx             # Blog listing/search| Setup             | Project initialization & dependencies | 30 min         | 25 min       | ✅     |

        ↕ SQL Queries

        │   ├── categories/| Authentication    | User registration & login             | 2 hours        | 2.5 hours    | ✅     |

DATABASE (PostgreSQL)

├─ users table (auth & profiles)│   │   └── [slug]/page.tsx      # Category filtered posts| Post Management   | Create, edit, delete posts            | 3 hours        | 3.5 hours    | ✅     |

├─ posts table (blog content)

├─ categories table (post organization)│   ├── create-post/| Categories        | Category CRUD & post association      | 1.5 hours      | 2 hours      | ✅     |

└─ postsToCategories table (relationships)

│   │   └── page.tsx             # Create new post| Blog Display      | Listing, filtering, search            | 2 hours        | 2.5 hours    | ✅     |

AUTHENTICATION FLOW:

User Login → JWT Generated → Stored in localStorage│   ├── edit-post/| Rich Text Editor  | MDEditor integration                  | 1 hour         | 1.5 hours    | ✅     |

           → Sent in every tRPC request header

           → Validated by server middleware│   │   └── [slug]/page.tsx      # Edit existing post| Image Upload      | Cloudinary integration                | 1 hour         | 1.5 hours    | ✅     |

           → User context available in procedures

```│   ├── edit-profile/| UI/UX Design      | Styling, responsive design            | 3 hours        | 4 hours      | ✅     |



---│   │   └── page.tsx             # Edit user profile| Form Optimization | Layout refinement, validation         | 2 hours        | 2.5 hours    | ✅     |



## Trade-offs & Decisions 🎯│   ├── login/| Bug Fixes         | Hydration errors, edge cases          | 1.5 hours      | 2 hours      | ✅     |



### 1. **tRPC vs REST API**│   │   ├── page.tsx             # Login form| Testing           | Manual testing, edge cases            | 1 hour         | 1.5 hours    | ✅     |

- **Decision**: Migrated to tRPC from REST API

- **Rationale**: Full type-safety across frontend/backend, auto documentation, smaller payload│   │   └── layout.tsx           # Login layout (no footer)| **TOTAL**         |                                       | **18.5 hours** | **23 hours** | ✅     |

- **Trade-off**: Steeper learning curve, less familiar for REST developers

│   ├── profile/

### 2. **JWT Authentication vs Session-based**

- **Decision**: JWT tokens in localStorage│   │   └── page.tsx             # User profile dashboard### Key Time Investments

- **Rationale**: Simpler implementation, stateless server, works well for SPAs

- **Trade-off**: No built-in token invalidation, token compromise requires manual logout│   ├── signup/



### 3. **Drizzle ORM vs Prisma**│   │   ├── page.tsx             # Signup form- **UI/UX Polish**: 4 hours - Creating cohesive design system

- **Decision**: Drizzle ORM

- **Rationale**: Better type safety, SQL-first approach, smaller bundle size, better for tRPC│   │   └── layout.tsx           # Signup layout (no footer)- **Form Optimization**: 2.5 hours - Perfecting layout and user interactions

- **Trade-off**: Less mature ecosystem, fewer high-level helpers

│   ├── layout.tsx               # Root layout- **Post Management**: 3.5 hours - Core functionality implementation

### 4. **Optional Cover Images**

- **Decision**: Cover images optional with URL validation│   ├── page.tsx                 # Home page- **Debugging**: 2 hours - Fixing hydration and edge cases

- **Rationale**: Reduces required fields, validates URLs before storage

- **Trade-off**: Empty strings must be converted to undefined in validation│   └── globals.css              # Global styles



### 5. **Post Author Filtering**├── components/## Project Structure

- **Decision**: Posts filtered at database level with `listByAuthor` query

- **Rationale**: Better performance, security, data isolation│   ├── Navbar.tsx               # Navigation component

- **Trade-off**: Requires separate query implementation for user-specific posts

│   ├── Footer.tsx               # Footer component```

### 6. **Footer Visibility Management**

- **Decision**: Conditional footer using client-side component wrapper│   ├── BlogCard.tsx             # Blog post cardsrc/

- **Rationale**: Clean solution without file restructuring, minimal overhead

- **Trade-off**: Slight client-side computation for route detection│   ├── FooterWrapper.tsx        # Conditional footer wrapper├── app/



### 7. **Dual Validation Strategy**│   └── layout/                  # Layout components│   ├── api/

- **Decision**: Client-side + Server-side validation with Zod

- **Rationale**: Fast UX feedback + security against tampering├── lib/│   │   ├── posts/          # Post API endpoints

- **Trade-off**: Validation logic duplicated in schemas

│   ├── trpc/│   │   ├── categories/     # Category API endpoints

### 8. **Category Search Implementation**

- **Decision**: Real-time search in dropdown during post creation│   │   ├── client.ts            # tRPC client config│   │   ├── users/          # User API endpoints

- **Rationale**: Better UX for 100+ categories, filters on client

- **Trade-off**: Requires client-side filtering logic│   │   └── provider.tsx         # tRPC provider│   │   └── auth/           # Authentication endpoints



---│   ├── db/│   ├── blog/               # Blog listing page



## Project Structure 📁│   │   ├── schema.ts            # Database schema│   ├── create-post/        # Create post page



```│   │   └── index.ts             # Database client│   ├── edit-post/          # Edit post page

src/

├── app/│   ├── validation/│   ├── profile/            # User profile page

│   ├── blog/

│   │   ├── [slug]/page.tsx      # Blog post detail page│   │   ├── posts.ts             # Post schemas│   ├── layout.tsx          # Root layout

│   │   └── page.tsx             # Blog listing/search

│   ├── categories/│   │   ├── auth.ts              # Auth schemas│   ├── page.tsx            # Homepage

│   │   └── [slug]/page.tsx      # Category filtered posts

│   ├── create-post/│   │   └── categories.ts        # Category schemas│   └── globals.css         # Global styles

│   │   └── page.tsx             # Create new post

│   ├── edit-post/│   ├── errors.ts                # Error utilities├── components/

│   │   └── [slug]/page.tsx      # Edit existing post

│   ├── edit-profile/│   ├── theme/│   ├── layout/

│   │   └── page.tsx             # Edit user profile

│   ├── login/│   │   └── ThemeProvider.tsx    # Theme provider│   │   ├── Navbar.tsx      # Navigation component

│   │   ├── page.tsx             # Login form

│   │   └── layout.tsx           # Login layout (no footer)│   └── utils/│   │   └── Footer.tsx      # Footer component

│   ├── profile/

│   │   └── page.tsx             # User profile dashboard│       └── slug.ts              # Slug utilities│   ├── blog/

│   ├── signup/

│   │   ├── page.tsx             # Signup form├── server/│   │   ├── PostCard.tsx    # Post card component

│   │   └── layout.tsx           # Signup layout (no footer)

│   ├── layout.tsx               # Root layout│   ├── trpc/│   │   └── PostFilters.tsx # Filtering component

│   ├── page.tsx                 # Home page

│   └── globals.css              # Global styles│   │   ├── routers/│   ├── BlogLayout.tsx      # Blog wrapper layout

├── components/

│   ├── Navbar.tsx               # Navigation component│   │   │   ├── auth.ts          # Auth endpoints│   └── Navbar.tsx          # Alternative navbar

│   ├── Footer.tsx               # Footer component

│   ├── BlogCard.tsx             # Blog post card│   │   │   ├── posts.ts         # Post endpoints├── lib/

│   ├── FooterWrapper.tsx        # Conditional footer wrapper

│   └── layout/                  # Layout components│   │   │   ├── categories.ts    # Category endpoints│   ├── db/                 # Database client setup

├── lib/

│   ├── trpc/│   │   │   └── users.ts         # User endpoints│   └── utils/              # Utility functions

│   │   ├── client.ts            # tRPC client config

│   │   └── provider.tsx         # tRPC provider│   │   ├── middlewares/├── db/

│   ├── db/

│   │   ├── schema.ts            # Database schema│   │   │   ├── validation.ts    # Validation MW│   ├── schema.ts           # Database schema (Drizzle)

│   │   └── index.ts             # Database client

│   ├── validation/│   │   │   └── logger.ts        # Logging MW│   ├── migrations/         # Database migrations

│   │   ├── posts.ts             # Post schemas

│   │   ├── auth.ts              # Auth schemas│   │   ├── trpc.ts              # tRPC config│   └── seed.ts             # Database seeding

│   │   └── categories.ts        # Category schemas

│   ├── errors.ts                # Error utilities│   │   └── index.ts             # Router export└── types/

│   ├── theme/

│   │   └── ThemeProvider.tsx    # Theme provider│   └── context.ts               # tRPC context    └── index.ts            # TypeScript type definitions

│   └── utils/

│       └── slug.ts              # Slug utilities├── scripts/```

├── server/

│   ├── trpc/│   └── seed.js                  # Database seeding

│   │   ├── routers/

│   │   │   ├── auth.ts          # Auth endpoints└── env.ts                       # Environment config## Learning Resources

│   │   │   ├── posts.ts         # Post endpoints

│   │   │   ├── categories.ts    # Category endpoints````

│   │   │   └── users.ts         # User endpoints

│   │   ├── middlewares/- [Next.js Documentation](https://nextjs.org/docs)

│   │   │   ├── validation.ts    # Validation MW

│   │   │   └── logger.ts        # Logging MW---- [React Documentation](https://react.dev)

│   │   ├── trpc.ts              # tRPC config

│   │   └── index.ts             # Router export- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

│   └── context.ts               # tRPC context

├── scripts/## API Documentation 📚- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)

│   └── seed.js                  # Database seeding

└── env.ts                       # Environment config- [MDEditor Documentation](https://uiwjs.github.io/react-md-editor/)

```

### tRPC Routes- [Cloudinary API Documentation](https://cloudinary.com/documentation)

---

**Authentication (`trpc.auth`)**## Deploy on Vercel

## API Documentation 📚

- `signup` - Register new user

### tRPC Routes

- `login` - Login with JWT tokenThe easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

**Authentication (`trpc.auth`)**

- `signup` - Register new user**Posts (`trpc.posts`)**Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

- `login` - Login with JWT token

- `list` - Get all published posts

**Posts (`trpc.posts`)**

- `list` - Get all published posts- `listByAuthor(authorId)` - Get posts by author## Future Enhancements

- `listByAuthor(authorId)` - Get posts by author

- `getById(id)` - Get post by ID- `getById(id)` - Get post by ID

- `getBySlug(slug)` - Get post by slug

- `create` - Create new post (public, no auth)- `getBySlug(slug)` - Get post by slug- [ ] Comments system on posts

- `update` - Update post (owner only)

- `delete(id)` - Delete post (owner only)- `create` - Create new post (public, no auth)- [ ] Social sharing capabilities



**Categories (`trpc.categories`)**- `update` - Update post (owner only)- [ ] Post scheduling

- `list` - Get all categories

- `getBySlug(slug)` - Get category- `delete(id)` - Delete post (owner only)- [ ] Advanced analytics

- `filterByCategory(slug)` - Get posts in category

- [ ] Dark mode toggle

**Users (`trpc.users`)**

- `createOrGetAuthor(name)` - Create/get author**Categories (`trpc.categories`)**- [ ] Export posts to PDF

- `getProfile` - Get current user

- `updateProfile` - Update user info- `list` - Get all categories- [ ] Email notifications for followers



---- `getBySlug(slug)` - Get category- [ ] SEO optimization improvements



## Database Schema 📊- `filterByCategory(slug)` - Get posts in category



### Users Table---

```sql

id (int) - Primary key**Users (`trpc.users`)**

name (string) - Display name

email (string, UNIQUE) - Email address- `createOrGetAuthor(name)` - Create/get author**Last Updated**: October 26, 2025

password (string) - Hashed with bcrypt

bio (string, nullable) - User biography- `getProfile` - Get current user

profileImage (string, nullable) - Avatar URL- `updateProfile` - Update user info

role (enum: 'user'|'admin') - User role

createdAt (timestamp) - Account creation---

```

## Database Schema 📊

### Posts Table

```sql### Users Table

id (int) - Primary key

title (string) - Post title```sql

slug (string, UNIQUE) - URL slugid (int) - Primary key

content (text) - Markdown contentname (string) - Display name

excerpt (string) - Summary (1-200 chars)email (string, UNIQUE) - Email address

coverImage (string, nullable) - Image URLpassword (string) - Hashed with bcrypt

published (boolean) - Statusbio (string, nullable) - User biography

authorId (int, FK) - Author referenceprofileImage (string, nullable) - Avatar URL

createdAt (timestamp) - Createdrole (enum: 'user'|'admin') - User role

updatedAt (timestamp) - Last modifiedcreatedAt (timestamp) - Account creation

`````

### Categories Table### Posts Table

````sql

id (int) - Primary key```sql

name (string, UNIQUE) - Category nameid (int) - Primary key

slug (string, UNIQUE) - URL slugtitle (string) - Post title

description (string, nullable) - Descriptionslug (string, UNIQUE) - URL slug

```content (text) - Markdown content

excerpt (string) - Summary (1-200 chars)

### PostsToCategories Table (Many-to-Many)coverImage (string, nullable) - Image URL

```sqlpublished (boolean) - Status

postId (int, FK) - Post referenceauthorId (int, FK) - Author reference

categoryId (int, FK) - Category referencecreatedAt (timestamp) - Created

```updatedAt (timestamp) - Last modified

````

---

### Categories Table

## Authentication Flow 🔐

````sql

1. **Signup** → User creates account → Password hashed with bcryptid (int) - Primary key

2. **JWT Generation** → Server generates JWT tokenname (string, UNIQUE) - Category name

3. **Token Storage** → Token stored in localStorageslug (string, UNIQUE) - URL slug

4. **API Requests** → Token sent in Authorization headerdescription (string, nullable) - Description

5. **Token Validation** → Server validates token```

6. **User Context** → User data available in component

### PostsToCategories Table (Many-to-Many)

**Protected Routes:**

- `/profile` - User dashboard```sql

- `/edit-profile` - Edit profilepostId (int, FK) - Post reference

- `/create-post` - Create postcategoryId (int, FK) - Category reference

- `/edit-post/[slug]` - Edit post```



**Public Routes:**---

- `/` - Home

- `/blog/[slug]` - Post detail## Authentication Flow 🔐

- `/categories/[slug]` - Category posts

- `/login`, `/signup` - Auth pages1. **Signup** → User creates account → Password hashed with bcrypt

2. **JWT Generation** → Server generates JWT token

---3. **Token Storage** → Token stored in localStorage

4. **API Requests** → Token sent in Authorization header

## Validation Rules 🔍5. **Token Validation** → Server validates token

6. **User Context** → User data available in component

### Post Validation

- **Title**: 3-100 chars, required**Protected Routes:**

- **Slug**: 3-100 chars, lowercase, hyphens/numbers, unique, required

- **Excerpt**: 1-200 chars, required- `/profile` - User dashboard

- **Content**: Min 10 chars, required- `/edit-profile` - Edit profile

- **Cover Image**: Valid URL, optional- `/create-post` - Create post

- **Author ID**: Positive integer, required- `/edit-post/[slug]` - Edit post

- **Categories**: Min 1 category, required

**Public Routes:**

### User Validation

- **Name**: Non-empty string, required- `/` - Home

- **Email**: Valid email, unique, required- `/blog/[slug]` - Post detail

- **Password**: Non-empty, required- `/categories/[slug]` - Category posts

- `/login`, `/signup` - Auth pages

---

---

## Troubleshooting 🔧

## Validation Rules 🔍

### Database Connection Error

```### Post Validation

Error: connect ECONNREFUSED 127.0.0.1:5432

✅ Solution:- **Title**: 3-100 chars, required

1. Start PostgreSQL: sudo service postgresql start- **Slug**: 3-100 chars, lowercase, hyphens/numbers, unique, required

2. Check DATABASE_URL in .env- **Excerpt**: 1-200 chars, required

3. Verify PostgreSQL is running- **Content**: Min 10 chars, required

```- **Cover Image**: Valid URL, optional

- **Author ID**: Positive integer, required

### JWT Token Issues- **Categories**: Min 1 category, required

````

Error: Invalid or expired token### User Validation

✅ Solution:

1. Clear localStorage and cache- **Name**: Non-empty string, required

2. Login again- **Email**: Valid email, unique, required

3. Check JWT_SECRET is set in .env- **Password**: Non-empty, required

````

---

### Post Creation Fails

```## Troubleshooting 🔧

Error: Validation failed

✅ Solution:### Database Connection Error

1. Slug must be lowercase with hyphens only

2. All required fields must be filled```

3. Select at least one categoryError: connect ECONNREFUSED 127.0.0.1:5432

4. If cover image provided, verify it's valid URL✅ Solution:

```1. Start PostgreSQL: sudo service postgresql start

2. Check DATABASE_URL in .env

---3. Verify PostgreSQL is running

````

## Learning Resources 📚

### JWT Token Issues

- [Next.js Docs](https://nextjs.org/docs) - React framework

- [tRPC Docs](https://trpc.io/docs) - Type-safe APIs```

- [Drizzle ORM](https://orm.drizzle.team/docs) - Database ORMError: Invalid or expired token

- [PostgreSQL](https://www.postgresql.org/docs/) - Database✅ Solution:

- [Tailwind CSS](https://tailwindcss.com/docs) - Styling1. Clear localStorage and cache

- [TypeScript](https://www.typescriptlang.org/docs/) - Type safety2. Login again

- [JWT.io](https://jwt.io/) - JWT authentication3. Check JWT_SECRET is set in .env

```

---

### Post Creation Fails

## Future Roadmap 🗺️

```

- [ ] Comments system on postsError: Validation failed

- [ ] Likes and bookmarks✅ Solution:

- [ ] Social sharing1. Slug must be lowercase with hyphens only

- [ ] Email notifications2. All required fields must be filled

- [ ] Full-text search3. Select at least one category

- [ ] User followers4. If cover image provided, verify it's valid URL

- [ ] Post scheduling```

- [ ] Analytics dashboard

- [ ] Multi-language support---

- [ ] Dark mode

## Learning Resources 📚

---

- [Next.js Docs](https://nextjs.org/docs) - React framework

## License 📄- [tRPC Docs](https://trpc.io/docs) - Type-safe APIs

- [Drizzle ORM](https://orm.drizzle.team/docs) - Database ORM

MIT License - see LICENSE file- [PostgreSQL](https://www.postgresql.org/docs/) - Database

- [Tailwind CSS](https://tailwindcss.com/docs) - Styling

## Support 💬- [TypeScript](https://www.typescriptlang.org/docs/) - Type safety

- [JWT.io](https://jwt.io/) - JWT authentication

- Issues: Open on GitHub

- Questions: Start a discussion---

- Email: contact@blogplatform.com

## Future Roadmap 🗺️

---

- [ ] Comments system on posts

<div align="center">- [ ] Likes and bookmarks

- [ ] Social sharing

**Made with ❤️ by the Blog Platform Team**- [ ] Email notifications

- [ ] Full-text search

Give us a ⭐ if you like this project!- [ ] User followers

- [ ] Post scheduling

</div>- [ ] Analytics dashboard

- [ ] Multi-language support
- [ ] Dark mode

---

## License 📄

MIT License - see LICENSE file

## Support 💬

- Issues: Open on GitHub
- Questions: Start a discussion
- Email: contact@blogplatform.com

---

<div align="center">

**Made with ❤️ by the Blog Platform Team**

Give us a ⭐ if you like this project!

</div>
