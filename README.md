# Voting Hub Application

A secure and user-friendly voting application that enables organizations to conduct elections with features for both administrators and voters.

## Features

### For Administrators
- Create and manage voting rooms
- Add, update, and delete candidates
- Monitor vote counts in real-time
- Release voting results
- Secure room management with unique Room IDs

### For Voters
- Join voting rooms using Room ID
- View candidate profiles
- Cast secure, one-time votes
- View election results after release

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **API**: RESTful architecture

## Project Structure

```
voting-app/
├── models/
│   ├── candidate.js    # Candidate data model
│   ├── room.js         # Voting room model
│   └── user.js         # User authentication model
├── public/
│   ├── css/           # Stylesheets
│   ├── about.html     # About page
│   ├── Add.html       # Add candidates
│   ├── Admin.html     # Admin dashboard
│   ├── adminRoom.html # Room management
│   ├── CastVote.html  # Voting interface
│   ├── Delete.html    # Delete candidates
│   ├── index.html     # Landing page
│   ├── login.html     # User login
│   ├── profile.html   # User profile
│   ├── Result.html    # View results
│   ├── signup.html    # User registration
│   └── Update.html    # Update candidates
├── routes/
│   ├── authRoutes.js   # Authentication routes
│   ├── candidateRoutes.js # Candidate management
│   └── userRoutes.js   # User operations
├── .env               # Environment variables
├── db.js             # Database configuration
├── frontend.js       # Frontend server
├── jwt.js           # JWT authentication
├── package.json     # Project dependencies
└── server.js        # Main application server
```

## Setup and Installation

1. Clone the repository:
```bash
git clone https://github.com/Gograj-choudhary/voting-app
cd voting-app
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with required environment variables:
```env
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

4. Start the application:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /user/signup` - Register new user
- `POST /user/login` - User login
- `GET /user/profile` - Get user profile

### Room Management
- `POST /condidate/room` - Create voting room
- `POST /condidate/room/login` - Join voting room
- `GET /condidate/room/candidates` - Get room candidates

### Voting Operations
- `POST /user/room/vote` - Cast vote
- `GET /condidate/room/votes` - Get vote counts
- `POST /condidate/room/release-results` - Release voting results

## Security Features

- Password encryption using bcrypt
- JWT-based authentication
- Secure session management
- One-time voting verification
- Admin role verification

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
