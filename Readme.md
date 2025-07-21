# Dboard

A full-stack dashboard application for visualizing insights data, built with React (Vite) on the frontend and Express/MongoDB on the backend. The dashboard provides interactive charts and filtering capabilities for exploring various data dimensions.


## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Running with Docker](#running-with-docker)
- [API Endpoints](#api-endpoints)
- [Data Model](#data-model)
- [Environment Variables](#environment-variables)
- [License](#license)

---

## Features

- Interactive dashboard with bar, pie, line charts, and heatmaps
- Filter data by year, topic, sector, region, and more
- Data fetched from a MongoDB database via REST API
- Modern React frontend styled with Tailwind CSS
- Docker support for easy deployment

---

## Project Structure

```
Dboard/
  backend/         # Express backend, MongoDB models, API routes
  frontend/        # React frontend (Vite), components, services
  Dockerfile       # Docker setup for full-stack deployment
  vercel.json      # (Optional) Vercel deployment config
```

---

## Getting Started

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Create a `.env` file in `backend/` with:**
   ```
   MONGO_URL=your_mongodb_connection_string
   PORT=4000
   ```

3. **Start the backend server:**
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:4000` by default.

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the frontend dev server:**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` by default (Vite).

> **Note:** In production, the backend serves the built frontend from `frontend/dist`.

### Running with Docker

1. **Build and run the container:**
   ```bash
   docker build -t dboard-app .
   docker run -p 4000:4000 --env-file backend/.env dboard-app
   ```
   This will serve both backend and frontend on port 4000.

---

## API Endpoints

- **GET `/api/v1/get_data`**
  - Returns all insight data from the database.
  - **Response:**
    ```json
    {
      "data": [ ... ],
      "message": "Data successfully Fetched",
      "success": true
    }
    ```

---

## Data Model

The backend uses a MongoDB collection with the following schema:

| Field       | Type   | Description                |
|-------------|--------|----------------------------|
| end_year    | String | End year                   |
| intensity   | Number | Intensity value            |
| sector      | String | Sector name                |
| topic       | String | Topic                      |
| insight     | String | Insight description        |
| url         | String | Source URL                 |
| region      | String | Region                     |
| start_year  | String | Start year                 |
| impact      | String | Impact description         |
| added       | String | Date added                 |
| published   | String | Date published             |
| country     | String | Country                    |
| relevance   | Number | Relevance score            |
| pestle      | String | PESTLE category            |
| source      | String | Data source                |
| title       | String | Title                      |
| likelihood  | Number | Likelihood score           |
| createdAt   | Date   | Auto-generated             |
| updatedAt   | Date   | Auto-generated             |

---

## Environment Variables

- **Backend (`backend/.env`):**
  - `MONGO_URL` – MongoDB connection string
  - `PORT` – Port for backend server (default: 4000)

- **Frontend (`frontend/.env`):**
  - (Add any frontend-specific environment variables if needed)

