# BlogVerse — MEAN Stack Blog Application

A full-stack blog website built with **AngularJS 1.8**, **Node.js**, **Express.js**, and **MongoDB Atlas**.

## Features

- User registration and login (JWT authentication)
- Create, read, update, and delete blog posts
- Comment system on posts
- Category filtering and search
- Responsive dark-mode UI with glassmorphism design
- MVC architecture on both frontend and backend

## Tech Stack

| Layer      | Technology               |
|------------|--------------------------|
| Frontend   | AngularJS 1.8 (CDN)     |
| Backend    | Node.js + Express.js     |
| Database   | MongoDB Atlas (Mongoose) |
| Auth       | JSON Web Tokens (JWT)    |

## Setup

### 1. Configure MongoDB Atlas

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster and get the connection string
3. Edit `.env` and replace `MONGODB_URI` with your connection string

### 2. Install Dependencies

```bash
npm install
```

### 3. Seed the Database (Optional)

```bash
npm run seed
```

This creates sample users, posts, and comments. Login credentials:
- `alice@example.com` / `password123`
- `bob@example.com` / `password123`
- `charlie@example.com` / `password123`

### 4. Start the Server

```bash
npm start
```

Visit `http://localhost:3000` in your browser.

## API Endpoints

| Method   | Endpoint                              | Description               | Auth |
|----------|---------------------------------------|---------------------------|------|
| POST     | `/api/auth/register`                  | Register a new user       | No   |
| POST     | `/api/auth/login`                     | Login, receive JWT        | No   |
| GET      | `/api/auth/me`                        | Get current user profile  | Yes  |
| GET      | `/api/posts`                          | List all posts            | No   |
| GET      | `/api/posts/:id`                      | Get single post + comments| No   |
| POST     | `/api/posts`                          | Create a new post         | Yes  |
| PUT      | `/api/posts/:id`                      | Update a post             | Yes  |
| DELETE   | `/api/posts/:id`                      | Delete a post             | Yes  |
| GET      | `/api/posts/my/posts`                 | Get user's own posts      | Yes  |
| POST     | `/api/posts/:id/comments`             | Add a comment             | Yes  |
| DELETE   | `/api/posts/:id/comments/:commentId`  | Delete a comment          | Yes  |

## Project Structure

```
blog-app/
├── server/
│   ├── server.js
│   ├── seed.js
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/
│   ├── routes/
│   └── controllers/
├── client/
│   ├── index.html
│   ├── app.js
│   ├── css/style.css
│   ├── services/
│   ├── controllers/
│   └── views/
├── .env
└── package.json
```

## License

MIT
