# LinkedIn Mini (Clone)

A **mini LinkedIn clone** built with **MERN Stack (MongoDB, Express.js, React.js, Node.js)**.  
It allows users to register, log in, create posts, like, and comment—simulating core social media features.  

---

## 🌐 Live Demo

[https://minilinkedin-six.vercel.app/](https://minilinkedin-six.vercel.app/)

---

## 🚀 Tech Stack

- **Frontend**: React.js, TailwindCSS (if used)  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB (Mongoose)  
- **Authentication**: JWT (JSON Web Tokens)  
- **Other Tools**: bcrypt, dotenv, nodemon  

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
git clone <your-repo-url>  
cd linkedin_min  

### 2. Backend Setup
cd backend  
npm install  

Create a `.env` file inside `backend/` (already included in project). Example:  
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mini-linkedin
JWT_SECRET=your_jwt_secret_key
PORT=5000


Start backend server:  


Server will run on **http://localhost:5000**

---

### 3. Frontend Setup
cd frontend  
npm install  
npm start  

Frontend will run on **http://localhost:3000**

---

## 👤 Admin / Demo User

  #### Email: david@example.com
  #### Password: 123456

---

## ✨ Features
- 🔑 User authentication (register/login with JWT)  
- 📝 Create, edit, and delete posts  
- ❤️ Like and comment on posts  
- 🔒 Secure password hashing with bcrypt  
- 🛡️ Protected routes with JWT middleware  
- 🎨 Modern UI (React + TailwindCSS)  

---

## 📌 Future Enhancements (Optional)
- Profile pages (bio, education, skills)  
- Connections (follow/unfollow users)  
- Real-time notifications  
- Image uploads for posts  
