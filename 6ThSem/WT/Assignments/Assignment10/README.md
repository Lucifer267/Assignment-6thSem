<div align="center">
<img width="1200" height="475" alt="VIT Registry Local" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# VIT Registry - Local Edition

This is a completely local student management system with JWT-based authentication. No external APIs or cloud services required.

## Features

- ✅ **Local Authentication** - JWT-based login system
- ✅ **No External Dependencies** - Runs entirely on your machine
- ✅ **Student Management** - Create, Read, Update, Delete students
- ✅ **Responsive Design** - Works on desktop and mobile
- ✅ **Real-time Search** - Filter students by name, email, or course
- ✅ **Table & Grid View** - Switch between different layouts

## Prerequisites

- Node.js (v16+)
- npm or yarn

## Installation & Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

3. **Default Credentials:**
   - Username: `admin` / Password: `admin123`
   - Username: `user` / Password: `user123`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run TypeScript linter

## API Endpoints

All endpoints require JWT authentication (Bearer token in Authorization header)

### Authentication
- `POST /api/auth/login` - Login with credentials
- `GET /api/auth/verify` - Verify current token

### Students (Protected)
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get single student
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

## Project Structure

```
├── src/
│   ├── main.tsx - Entry point
│   ├── App.tsx - Main application component
│   └── index.css - Global styles
├── server.ts - Express backend with JWT auth
├── package.json - Dependencies
└── tsconfig.json - TypeScript configuration
```

## Customization

### Change Demo Credentials

Edit `server.ts`:
```typescript
let users: User[] = [
  { id: 1, username: "your_username", password: "your_password", role: "admin" },
];
```

### Change JWT Secret

Edit `.env`:
```
JWT_SECRET="your_new_secret_key"
```

⚠️ **Important**: Change the JWT_SECRET in production!

## Deployment

To run in production mode:

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   NODE_ENV=production npm run start
   ```

The app will serve the built frontend along with the API.

## Troubleshooting

### Port already in use
If port 3000 is already in use, you can modify it in `server.ts`:
```typescript
const PORT = 3001; // Change to any available port
```

### CORS Issues
CORS is enabled for all origins in development. Modify in `server.ts` if needed.

## License

MIT

## Notes

- All data is stored in memory and will be lost on server restart
- No database setup required
- Perfect for learning and prototyping
- Add a database (MongoDB, PostgreSQL, etc.) for production use
