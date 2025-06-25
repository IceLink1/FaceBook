# Facebook Clone API

A comprehensive social media API built with NestJS, MongoDB, and Mongoose. This application provides Facebook-like functionality including user authentication, posts, comments, likes, and friend management.

## 🚀 Features

- **User Authentication**: JWT-based authentication with registration and login
- **User Management**: Profile creation, updates, and user search
- **Posts**: Create, read, update, delete posts with image support
- **Comments**: Comment on posts with like functionality
- **Likes**: Like/unlike posts and comments
- **Friends**: Send friend requests, accept/decline requests, manage friendships
- **API Documentation**: Comprehensive Swagger documentation

## 🛠️ Tech Stack

- **Backend**: NestJS (Node.js framework)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with Passport
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator and class-transformer

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd facebook-clone-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and update the values:
   ```env
   MONGODB_URI=mongodb://localhost:27017/facebook-clone
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=3000
   NODE_ENV=development
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run start:prod
   ```

6. **Access the application**
   - API: http://localhost:3000
   - Swagger Documentation: http://localhost:3000/api/docs

## 📚 API Documentation

### Authentication Endpoints

#### Register User
- **POST** `/auth/register`
- **Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "StrongPassword123!",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "Software developer",
    "location": "New York, NY",
    "website": "https://johndoe.dev",
    "dateOfBirth": "1990-01-01"
  }
  ```

#### Login User
- **POST** `/auth/login`
- **Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "StrongPassword123!"
  }
  ```

### User Endpoints

#### Get Current User Profile
- **GET** `/users/profile`
- **Headers**: `Authorization: Bearer <jwt_token>`

#### Get All Users
- **GET** `/users`
- **Headers**: `Authorization: Bearer <jwt_token>`

#### Search Users
- **GET** `/users/search?q=john`
- **Headers**: `Authorization: Bearer <jwt_token>`

#### Get User by ID
- **GET** `/users/:id`
- **Headers**: `Authorization: Bearer <jwt_token>`

#### Update User
- **PATCH** `/users/:id`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "bio": "Updated bio",
    "location": "San Francisco, CA"
  }
  ```

### Post Endpoints

#### Create Post
- **POST** `/posts`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Body**:
  ```json
  {
    "content": "This is my first post!",
    "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
  }
  ```

#### Get All Posts (Feed)
- **GET** `/posts?page=1&limit=10`
- **Headers**: `Authorization: Bearer <jwt_token>`

#### Get Posts by User
- **GET** `/posts/user/:userId?page=1&limit=10`
- **Headers**: `Authorization: Bearer <jwt_token>`

#### Get Post by ID
- **GET** `/posts/:id`
- **Headers**: `Authorization: Bearer <jwt_token>`

#### Update Post
- **PATCH** `/posts/:id`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Body**:
  ```json
  {
    "content": "Updated post content",
    "images": ["https://example.com/new-image.jpg"]
  }
  ```

#### Delete Post
- **DELETE** `/posts/:id`
- **Headers**: `Authorization: Bearer <jwt_token>`

#### Like/Unlike Post
- **POST** `/posts/:id/like`
- **Headers**: `Authorization: Bearer <jwt_token>`

### Comment Endpoints

#### Create Comment
- **POST** `/comments`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Body**:
  ```json
  {
    "post": "507f1f77bcf86cd799439011",
    "content": "Great post!"
  }
  ```

#### Get Comments for Post
- **GET** `/comments/post/:postId?page=1&limit=10`
- **Headers**: `Authorization: Bearer <jwt_token>`

#### Update Comment
- **PATCH** `/comments/:id`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Body**:
  ```json
  {
    "content": "Updated comment content"
  }
  ```

#### Delete Comment
- **DELETE** `/comments/:id`
- **Headers**: `Authorization: Bearer <jwt_token>`

#### Like/Unlike Comment
- **POST** `/comments/:id/like`
- **Headers**: `Authorization: Bearer <jwt_token>`

### Friend Endpoints

#### Send Friend Request
- **POST** `/friends/request`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Body**:
  ```json
  {
    "recipient": "507f1f77bcf86cd799439011"
  }
  ```

#### Accept/Decline Friend Request
- **PATCH** `/friends/request/:id`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Body**:
  ```json
  {
    "status": "accepted"
  }
  ```
  *Possible statuses: `accepted`, `declined`*

#### Get Friends List
- **GET** `/friends`
- **Headers**: `Authorization: Bearer <jwt_token>`

#### Get Pending Friend Requests
- **GET** `/friends/requests/pending`
- **Headers**: `Authorization: Bearer <jwt_token>`

#### Get Sent Friend Requests
- **GET** `/friends/requests/sent`
- **Headers**: `Authorization: Bearer <jwt_token>`

#### Get Friendship Status
- **GET** `/friends/status/:userId`
- **Headers**: `Authorization: Bearer <jwt_token>`

#### Remove Friend
- **DELETE** `/friends/:friendshipId`
- **Headers**: `Authorization: Bearer <jwt_token>`

## 🔐 Authentication

All endpoints (except registration and login) require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

After successful login/registration, you'll receive a response like:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

## 📊 Database Schema

### User Schema
- `email`: Unique email address
- `password`: Encrypted password
- `firstName`: User's first name
- `lastName`: User's last name
- `avatar`: Profile picture URL
- `bio`: User biography
- `location`: User location
- `website`: User website
- `dateOfBirth`: Date of birth
- `isActive`: Account status
- `lastSeen`: Last activity timestamp

### Post Schema
- `author`: Reference to User
- `content`: Post content
- `images`: Array of image URLs
- `likes`: Array of User references who liked
- `likesCount`: Number of likes
- `commentsCount`: Number of comments
- `isActive`: Post status

### Comment Schema
- `post`: Reference to Post
- `author`: Reference to User
- `content`: Comment content
- `likes`: Array of User references who liked
- `likesCount`: Number of likes
- `isActive`: Comment status

### Friend Schema
- `requester`: User who sent the request
- `recipient`: User who received the request
- `status`: `pending`, `accepted`, `declined`, `blocked`

## 🧪 Testing

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**

3. **Start the application**
   ```bash
   npm run start:prod
   ```

## 📁 Project Structure

```
src/
├── auth/              # Authentication module
│   ├── dto/           # Data transfer objects
│   ├── guards/        # Auth guards
│   ├── strategies/    # Passport strategies
│   └── ...
├── users/             # User management module
├── posts/             # Posts module
├── comments/          # Comments module
├── friends/           # Friends module
└── main.ts           # Application entry point
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🐛 Common Issues

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check the `MONGODB_URI` in your `.env` file
- Verify network connectivity

### JWT Token Issues
- Ensure the `JWT_SECRET` is set in your `.env` file
- Check token expiration (default: 7 days)
- Verify the Authorization header format: `Bearer <token>`

### Validation Errors
- Check request body format against the API documentation
- Ensure required fields are included
- Verify data types match the schema requirements

## 📞 Support

For support and questions, please create an issue in the repository or contact the development team.