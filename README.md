# PingMe

A simple real-time text messaging application built using **React**, **Spring Boot (WebSockets)**, and **PostgreSQL**.

This project focuses on implementing real-time communication with persistent storage in a clean full-stack setup.

---

## Project Structure

```
pingme/
│
├── client/        → React frontend
├── server/        → Spring Boot backend (WebSocket + JPA)
├── .gitignore
└── README.md
```

---

## Tech Stack

**Frontend (client/)**

* React
* WebSocket client

**Backend (server/)**

* Spring Boot
* Spring WebSocket
* Spring Data JPA
* Redis (configured)
* PostgreSQL

---

## How It Works

1. User sends a message from the React app.
2. Spring Boot receives the message via WebSocket.
3. The message is stored in PostgreSQL.
4. Backend broadcasts the message to all connected clients in real time.

The system is text-only to keep the architecture focused and lightweight.

---

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/vanamuthuV/pingme.git
cd pingme
```

---

### 2. Start Backend

Make sure PostgreSQL is running and database credentials are configured in `server/src/main/resources/application.properties`.

```bash
cd server
mvn spring-boot:run
```

---

### 3. Start Frontend

```bash
cd client
npm install
npm start
```

Are you actually using Redis for caching WebSocket sessions or just configured it and not actively using it?

Because if you are using it for pub/sub or scaling WebSockets, we can upgrade the README to sound way more serious.
