Task Manager Application - Setup Guide

Live Application Link : task-manager-two-rho-84.vercel.app


Prerequisites

Node.js (v18 or later), 
MongoDB Community Server, 
Git

cd task-manager

Backend Setup

Navigate to the backend folder:
Create a .env file inside the basicNode directory:

PORT=3000

NODE_ENV=development

MONGODB_URI=YOUR_MONGODB_URI

JWT_SECRET=your_random_jwt_secret

JWT_EXPIRES_IN=1d


cd basicNode 

npm install

Start the backend : 
node app.js

The API will run on : 
http://localhost:3000


Frontend Setup

Navigate to the frontend folder:

cd frontend

npm install

npm run dev

The frontend will run on : 
http://localhost:5173

Features : 

User Registration

User Login with JWT Authentication

Protected Routes

Task Creation

Task Update

Task Completion Tracking

Task Deletion

MongoDB Persistence

User-specific Task Ownership

Task Filtering

Task Sorting

Pagination Support

Tech Stack


Frontend : 

React

Vite

Axios

React Router DOM


Backend : 

Node.js

Express.js

MongoDB

Mongoose

JWT

bcryptjs

CORS

dotenv

Create User : 

<img width="1920" height="1004" alt="{5E426137-AAA1-465E-85FD-C29E6F270C87}" src="https://github.com/user-attachments/assets/a3ee8fea-f82c-4bcf-812e-919d3e936128" />

Login User: 

<img width="1920" height="1011" alt="{697B9810-5E5A-46FA-99C6-9E7457C56BC7}" src="https://github.com/user-attachments/assets/5bf2fa71-c9bd-4de5-8bcb-a0f319208b40" />
Create Task : 

<img width="1920" height="1017" alt="{2FA145B2-CEED-4433-AE29-39C759BC6CD0}" src="https://github.com/user-attachments/assets/87f1c674-b2c7-4b0d-891b-17c8d3aec497" />

Task Created : 

<img width="1920" height="1004" alt="{B7FB1D77-8E99-486A-9A8E-F61457694526}" src="https://github.com/user-attachments/assets/590794f6-8cd1-477d-bb67-308c7c7beb52" />

