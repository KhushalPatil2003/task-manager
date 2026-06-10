Task Manager Application - Setup Guide

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
<img width="1920" height="1011" alt="{697B9810-5E5A-46FA-99C6-9E7457C56BC7}" src="https://github.com/user-attachments/assets/5bf2fa71-c9bd-4de5-8bcb-a0f319208b40" />

