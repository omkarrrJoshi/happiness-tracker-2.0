# Happiness Tracker 2.0 - Backend

This is the backend for the **Happiness Tracker 2.0** application. It's built with **Express.js** and interacts with a PostgreSQL database.

This repository is for the backend only. The frontend for this project is developed separately.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Repo Setup](#repo-setup)
3. [Setup Environment Variables](#setup-environment-variables)
4. [Running the Project](#running-the-project)
5. [Verify the Setup](#verify-the-setup)

---

## Prerequisites

Before setting up this project, ensure you have the following installed:

- **[Node.js](https://nodejs.org/en/download/)** (version 14.x or higher)
- **[npm](https://www.npmjs.com/get-npm)** (Node Package Manager)
- **[PostgreSQL](https://www.postgresql.org/download/)** (for local development, or you can configure a hosted database in the cloud like Railway)

---

## Repo Setup
```bash
git clone https://github.com/omkarrrJoshi/happiness-tracker-2.0.git
cd happiness-tracker-2.0
npm install
```

## Setup Environment Variables
Copy dotenv file to .env and modify .env as per your usecase
```bash
cp dotenv .env
```

## Running the Project
```bash
npm run dev
```

## Verify the Setup

After starting the application, you can verify that the setup is complete by checking the health endpoint:

1. Open your web browser (or **Chrome**).
2. Navigate to `http://localhost:5000/api/health`.
3. If you receive a **success response**, the setup is complete, and the backend is running correctly.

This API is designed to confirm that the server is running and is healthy. A successful response indicates that everything is configured properly and ready for further development or usage.