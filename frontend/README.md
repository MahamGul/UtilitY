Utility – Service Provider Platform

Utility is a full‑stack platform that connects customers with service providers (plumber, electrician, mechanic, etc.).

This repository contains:

Frontend: React.js

Backend: FastAPI (Python)

Database: MongoDB

This README is written so that any team member can clone the repo and run the backend, frontend, and database locally without confusion.

1️⃣ Prerequisites

Make sure the following are installed on your system:

Git

Node.js (v18 or later recommended)

npm (comes with Node)

Python (3.9 or later)

pip (comes with Python)

MongoDB (local OR MongoDB Atlas)

Check versions:
node -v
npm -v
python --version
3️⃣ Backend Setup (FastAPI)
Step 1: Go to backend folder
cd backend
cd backend
Step 2: Create virtual environment (recommended)
python -m venv venv
Step 3: Install dependencies
pip install -r requirements.txt
Step 4: Environment variables
Create a .env file in backend
paste the URI sent
Step 5: Run backend server
python main.py

4️⃣ Frontend Setup
Step 1: Go to frontend folder
cd frontend
Step 2: Install dependencies
npm install
Step 4: Start frontend
npm start
