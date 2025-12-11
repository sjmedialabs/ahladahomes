# Propmediate - Premium Real Estate Platform

A full-stack MERN application built with Next.js and MongoDB for showcasing premium real estate properties with advanced search, filtering, and admin management.

## Architecture

This is a Next.js full-stack application with:
- **Frontend**: Next.js App Router with React Server Components
- **Backend**: Next.js API Routes with MongoDB
- **Database**: MongoDB with comprehensive data models
- **Authentication**: JWT-based auth with bcrypt password hashing

## Quick Start

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   \`\`\`bash
   MONGODB_URI=mongodb://localhost:27017/propmediate
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=3000
   \`\`\`

3. **Start development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Seed the database (optional):**
   \`\`\`bash
   npm run seed
   \`\`\`

5. **Create admin user:**
   \`\`\`bash
   npm run create-admin
   \`\`\`

The application will be available at http://localhost:3000

## Features

- 🏠 Property listings with advanced search and filtering
- 👥 User management and agent profiles
- 🔍 Property comparison and detailed views
- 📱 Responsive design with modern UI
- 🔐 Complete admin dashboard for content management
- 🚀 Performance optimized with Next.js
- 🔒 Security best practices with JWT auth
- 📊 Analytics and reporting dashboard
- 💬 Inquiry management system

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB Native Driver
- **Authentication**: JWT with bcryptjs
- **UI Components**: shadcn/ui, Lucide React
- **Database**: MongoDB with comprehensive indexing
- **Security**: JWT tokens, password hashing, input validation

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Properties
- `GET /api/properties` - Get properties with filtering
- `POST /api/properties` - Create new property
- `GET /api/properties/[id]` - Get single property
- `PUT /api/properties/[id]` - Update property
- `DELETE /api/properties/[id]` - Delete property
- `GET /api/properties/search` - Advanced property search
- `GET /api/properties/stats` - Property statistics

### Admin (Admin only)
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `GET /api/admin/users/[id]` - Get single user
- `PUT /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user
- `GET /api/admin/users/stats` - User statistics
- `GET /api/admin/inquiries` - Get all inquiries
- `GET /api/admin/dashboard` - Dashboard statistics

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data
- `npm run create-admin` - Create admin user
- `npm run reset-db` - Reset database (clear all data)

## Project Structure

\`\`\`
propmediate-app/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── properties/    # Property endpoints
│   │   └── admin/         # Admin endpoints
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility libraries
│   ├── auth/             # Authentication utilities
│   ├── database/         # Database utilities
│   ├── models/           # Data models
│   └── mongodb.ts        # MongoDB connection
├── public/               # Static assets
├── scripts/              # Database scripts
│   ├── seed-database.ts  # Seed sample data
│   ├── create-admin.ts   # Create admin user
│   └── reset-database.ts # Reset database
└── README.md
\`\`\`

## Database Models

### User
- Authentication and profile information
- Role-based access (user, agent, admin)
- Agent-specific information and ratings

### Property
- Complete property details and media
- Location and pricing information
- Status tracking and featured properties

### Inquiry
- User inquiries for properties
- Contact information and status tracking
- Agent assignment and scheduling

## Development

### Environment Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Set up environment variables in `.env.local`
3. Run `npm run seed` to populate with sample data
4. Use `npm run create-admin` to create an admin account

### Default Admin Credentials
After running `npm run create-admin`:
- **Email**: admin@propmediate.com
- **Password**: Admin@123

### Sample Data
The seed script creates:
- 1 admin user and 3 agent users
- 2 regular users with preferences
- 8 sample properties across different cities
- Sample inquiries with different statuses

## Production Deployment

1. **Build the application:**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Set production environment variables:**
   - `MONGODB_URI` - Production MongoDB connection string
   - `JWT_SECRET` - Strong secret key for JWT tokens
   - `NODE_ENV=production`

3. **Start production server:**
   \`\`\`bash
   npm start
   \`\`\`

## Security Features

- JWT-based authentication with secure token handling
- Password hashing with bcryptjs (12 salt rounds)
- Input validation and sanitization
- Role-based access control
- Protected admin routes
- Secure MongoDB queries with proper indexing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
