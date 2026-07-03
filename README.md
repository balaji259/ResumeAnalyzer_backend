# 🖥️ ResumeHub (Backend) — AI-Powered Resume Processing & Assessment API

This is the backend server for **ResumeHub**, an AI-powered ATS resume builder, job description matcher, and assessment platform.

It is built using **Node.js**, **Express**, and **MongoDB (Mongoose)**, and integrates with the **Google Gemini Pro AI model** to parse, analyze, and grade candidate profiles.

* 🔗 **Live URL:** [https://resumehub-rbt.vercel.app](https://resumehub-rbt.vercel.app)
* 💻 **Frontend Repository:** [https://github.com/balaji259/resumehub-frontend](https://github.com/balaji259/resumehub-frontend)

---

## 🌟 Key Features

* 📁 **In-Memory Resume Parser**: Parses binary uploads of **PDF** (via `pdf-parse`) and **DOCX** (via `mammoth`) documents in RAM (via `multer`) without persisting files to disk.
* 🤖 **Google Gemini AI Integration**: Custom prompt engineering to parse resumes, output structured JSON analysis, calculate ATS score, readability score, grammar issue tracking, and section scores.
* 🎯 **Job Matching Engine**: Performs skill-gap analysis comparing uploaded resumes with job descriptions, identifying missing skills and suggesting alternative roles.
* 📝 **Custom Assessments**: Dynamically generates tailored assessments consisting of MCQs, descriptive questions, and soft-skill questions based on a user's resume, and automatically evaluates candidate answers.
* 🔒 **Secure Session & Authentication**: 
  * Password salting and hashing (using `bcrypt`).
  * JWT (JSON Web Tokens) generated for authorization.
  * Local credential authentication alongside OAuth support for **Google Login**.
  * Cookie-parser and custom middleware verification.
* 📊 **Advanced Aggregated Insights**: Custom MongoDB aggregate pipelines computing platform statistics, score distribution, readability distribution, top missing keywords, and common grammar issues.

---

## 🛠️ Technology Stack

* **Runtime**: Node.js (v18+)
* **Web Framework**: Express
* **Database**: MongoDB (using Mongoose ODM)
* **AI Model Engine**: Google Gemini API (`@google/generative-ai`)
* **Security & Auth**: `jsonwebtoken`, `bcrypt`, `passport`, `passport-google-oauth20`
* **File Upload & Parsing**: `multer` (multipart/form-data), `pdf-parse` (PDF files), `mammoth` (DOCX files)

---

## 📂 Repository Structure

```text
ResumeAnalyzer_backend/
├── src/
│   ├── config/             # Database & Client configurations (database.js, geminiClient.js)
│   ├── middleware/         # Custom authentication validation middlewares
│   ├── models/             # Mongoose Database Schemas (User.js, Resume.js)
│   ├── routes/             # Express Route handlers
│   │   ├── auth.js           # Signup, login, logout, googlelogin
│   │   ├── resume.js         # Analyze, jobMatcher, stats, taketest, submit-answers
│   │   └── user.js           # Get profile, update-profile
│   └── utils/              # Helper functions (validation, resumeAnalyzer AI prompt scripts)
├── .env                    # Secret environment variables (ignored by Git)
├── app.js                  # Main server setup, CORS, Express middleware & DB connection
└── package.json            # Scripts & project dependencies
```

---

## 🚀 Getting Started

### 1. Installation
Clone the repository:
```bash
git clone https://github.com/your-username/resumehub-backend.git
cd resumehub-backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root of the project:
```env
# MongoDB Connection String (Atlas or Local instance)
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/resumehub

# Google Gemini API Key from Google AI Studio
GEMINI_API_KEY=your-gemini-api-key
```

### 3. Launching Server
* For development (with hot-reloading):
  ```bash
  npm run dev
  ```
* For production:
  ```bash
  npm start
  ```
The server will boot up by default on port `7777` (`http://localhost:7777`).

---

## 🔌 API Documentation

### 🔒 Authentication Endpoints (`/`)

#### 1. User Sign Up
* **Route**: `POST /signup`
* **Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "emailId": "john@example.com",
    "password": "SecurePassword123"
  }
  ```
* **Response**: Sets a HTTP-Only `token` cookie. Returns registered user payload.

#### 2. User Login
* **Route**: `POST /login`
* **Body**:
  ```json
  {
    "emailId": "john@example.com",
    "password": "SecurePassword123"
  }
  ```
* **Response**: Sets a HTTP-Only `token` cookie. Returns `{ user, token }`.

#### 3. Google Sign In
* **Route**: `POST /googlelogin`
* **Body**:
  ```json
  {
    "emailId": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```
* **Response**: Registers or retrieves Google user, sets a HTTP-Only `token` cookie, and returns payload.

---

### 📄 Resume Endpoints (`/resume`)

#### 1. Analyze Resume (ATS Checker)
* **Route**: `POST /resume/analyze`
* **Headers**: `Authorization: Bearer <token>`
* **Body**: `multipart/form-data`
  * `resume`: File (PDF or DOCX)
  * `jobDescription`: String *(Optional)*
* **Response**: Returns ATS analysis report, grammatical checklist, overall score, and section-by-section breakdown.

#### 2. Job Matching
* **Route**: `POST /resume/jobMatcher`
* **Headers**: `Authorization: Bearer <token>`
* **Body**: `multipart/form-data`
  * `resume`: File (PDF or DOCX)
  * `jobDescription`: String *(Required)*
* **Response**: Highlights missing skills required for the job role, suggests alternative jobs, and returns detailed matching evaluation text.

#### 3. Take custom mock test
* **Route**: `POST /resume/taketest`
* **Headers**: `Authorization: Bearer <token>`
* **Body**: `multipart/form-data`
  * `resume`: File
  * `mcqCount`: Number *(Default: 10)*
  * `descriptiveCount`: Number *(Default: 3)*
  * `softSkillsCount`: Number *(Default: 2)*
* **Response**: Generates dynamic MCQs, descriptive questions, and soft-skill questions based on the candidate profile.

#### 4. Evaluate mock test answers
* **Route**: `POST /resume/submit-answers`
* **Body**:
  ```json
  {
    "mcq": [ { "question": "...", "selectedAnswer": "...", "correctAnswer": "..." } ],
    "descriptive": [ { "question": "...", "answer": "..." } ],
    "softSkills": [ { "question": "...", "answer": "..." } ]
  }
  ```
* **Response**: Evaluates questions using AI and outputs comprehensive grading reports.

#### 5. Platform Aggregate Stats
* **Route**: `GET /resume/stats`
* **Response**: Custom statistics including overall counts, score/readability classifications, top missing keywords, and popular grammatical errors.

---

### 👤 User Profile Endpoints (`/user`)

#### 1. Get Profile
* **Route**: `GET /user/profile`
* **Headers**: `Authorization: Bearer <token>`
* **Response**: Returns profile metadata and stats from the last analyzed resume.

#### 2. Update Profile
* **Route**: `PUT /user/update-profile`
* **Headers**: `Authorization: Bearer <token>`
* **Body**: `{ "firstName": "John", "lastName": "Smith" }`
* **Response**: Returns successfully updated message.

---

## 🤝 Contribution
Contributions are welcome. Feel free to open a Pull Request.
