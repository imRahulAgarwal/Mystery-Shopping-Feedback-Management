# InsightHub

### Mystery Shopping & Feedback Management

InsightHub is a reference implementation of a **Mystery Shopping & Feedback Management**, built to demonstrate full-stack architecture, role-based workflows, and scalable backend design using modern TypeScript tooling.

This project is **not client work**. It is a clean, feature-reduced demo inspired by real-world systems, created solely for portfolio and recruiter review purposes.

---

## UI Name

**InsightHub**

## Long Project Name

**Mystery Shopping & Feedback Management**

---

## Project Description

InsightHub models the core workflow of a mystery shopping platform where organizations can:

-   Create audit or mystery shopping campaigns
-   Define structured questionnaires
-   Assign field users (mystery shoppers)
-   Collect feedback securely
-   View aggregated results and completion metrics

The application focuses on **architecture clarity, backend correctness, and role-based access control**, rather than external integrations or client-specific logic.

---

## Tech Stack

### Frontend

-   Next.js (App Router)
-   TypeScript
-   Tailwind CSS

### Backend

-   Node.js
-   Express.js
-   TypeScript
-   REST API architecture

### Database

-   MongoDB
-   Mongoose ODM
-   Aggregation pipelines for reporting

### Tooling

-   Prettier
-   GitHub Actions (CI)
-   Environment-based configuration

---

## Project Structure (High Level)

```
/client        → Next.js frontend
/server        → Express backend
```

This structure is designed to support clear separation of concerns and future scalability.

---

## GitHub Commit Message Convention

This repository follows **Conventional Commits** to maintain a clean and readable git history.

### Commit Format

```

<type>(scope): <short description>

```

### Common Types

-   `feat` – New feature
-   `fix` – Bug fix
-   `refactor` – Code refactor (no behavior change)
-   `chore` – Tooling, config, or maintenance
-   `docs` – Documentation updates
-   `test` – Adding or updating tests

### Examples

```

feat(auth): add role-based access middleware
fix(api): handle empty submission edge case
refactor(db): simplify campaign aggregation pipeline
docs(readme): update local setup instructions

```

---

## Local Setup Instructions

### Prerequisites

-   Node.js (v21 or later)
-   MongoDB (local or cloud)
-   Git

---

### 1. Clone the Repository

```
git clone [https://github.com/imRahulAgarwal/Mystery-Shopping-Feedback-Management](https://github.com/imRahulAgarwal/Mystery-Shopping-Feedback-Management)
cd Mystery-Shopping-Feedback-Management

```

---

### 2. Install Dependencies

Frontend:

```
cd client/
npm install
```

Backend:

```
cd server/
npm install
```

---

### 3. Environment Variables

Create a `.env` file inside `server/`:

```
PORT=3001
```

Create a `.env.local` file inside `client/`:

```

```

---

### 4. Run the Application

Start backend:

```
cd server/
npm run dev:build
npm run dev
```

Start frontend:

```
cd client/
npm run dev
```

---

### 5. Access the Application

-   Frontend: `http://localhost:3000`
-   Backend API: `http://localhost:3001`

---

## Disclaimer

This project is a **demo implementation** created for learning and portfolio purposes.  
It does not contain client data, proprietary business logic, or production credentials.
