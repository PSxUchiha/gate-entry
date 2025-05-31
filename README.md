# Gate Entry Management System

A secure and efficient gate entry management system built with Next.js 14, designed for managing visitor access and security protocols.

## Features

### 🔐 Security Features
- Secure login system for security personnel
- Department-specific access controls
- Unique visit codes generation
- Real-time visit status tracking
- Comprehensive visit logging

### 👥 Multi-User Support
- Security dashboard for gate management
- Department-specific dashboards
- Visitor registration portal
- Role-based access control

### 📱 Visitor Management
- Easy-to-use visitor registration form
- Company/Individual visitor types
- Visit purpose tracking
- Duration management
- Department and employee selection
- Automatic notifications

### 🔄 Real-time Updates
- Live visit status updates
- Dynamic employee lists by department
- Instant notification system
- Real-time dashboard updates

## Getting Started

### Prerequisites
- Node.js 18.0 or later
- npm or yarn package manager
- A modern web browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gate-entry.git
cd gate-entry
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with:
```env
DATABASE_URL="your-database-url"
NEXTAUTH_SECRET="your-auth-secret"
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see the application.

## Usage Guide

### 🚪 Security Login
1. Access the login page
2. Select "Security" role
3. Enter credentials (default: security123)
4. Access security dashboard

### 🏢 Department Login
1. Access the login page
2. Select "Employee" role
3. Choose department
4. Enter department credentials
5. Access department dashboard

### 📝 Visitor Registration
1. Click "Register Visit" on homepage
2. Fill in visitor details
3. Select department and employee
4. Choose visit duration
5. Submit request
6. Receive confirmation

### 👮 Security Dashboard Features
- View all visits
- Approve/Reject visits
- Check-in visitors
- Complete visits
- View visit history
- Search and filter visits

### 👥 Department Dashboard Features
- View department visits
- Manage visit requests
- View visitor history
- Update visit status
- Employee management

## Tech Stack

- **Framework**: Next.js 14
- **Database**: Prisma
- **Authentication**: Next Auth

## Project Structure

```
gate-entry/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # Reusable components
│   ├── lib/             # Utility functions
│   └── types/           # TypeScript types
├── prisma/              # Database schema
└── package.json        # Project dependencies
```

## Default Credentials

### Security Login
- Username: security
- Password: security123

### Department Logins
- R&D: rd123
- Steel Production: steel123
- Quality: quality123
- HR: hr123
- Automation: automation123

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Next Auth](https://next-auth.js.org/)

## Deployment

### Deploying to Vercel (Free Tier)

1. Create a Vercel Account:
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account

2. Install Vercel CLI (Optional):
```bash
npm install -g vercel
```

3. Configure Environment Variables:
   - Create a new project in Vercel
   - Go to Project Settings > Environment Variables
   - Add the following variables:
     ```
     DATABASE_URL="your-production-database-url"
     NEXTAUTH_SECRET="your-production-auth-secret"
     NEXTAUTH_URL="https://your-domain.vercel.app"
     ```

4. Deploy:
   
   **Option 1: Using Vercel Dashboard (Recommended)**
   - Connect your GitHub repository to Vercel
   - Select the repository
   - Configure project settings:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: `next build`
   - Click Deploy

   **Option 2: Using Vercel CLI**
   ```bash
   # Login to Vercel
   vercel login

   # Deploy to Vercel
   vercel
   ```

5. After Deployment:
   - Run database migrations:
     ```bash
     # Using Vercel CLI
     vercel env pull .env.production.local
     npx prisma db push
     ```
   - Your app will be live at: `https://your-project-name.vercel.app`

### Important Notes:
- Set up a production database (e.g., using PlanetScale's free tier)
- Update NEXTAUTH_URL to match your Vercel deployment URL
- Ensure all environment variables are properly configured
- Vercel's free tier includes:
  - HTTPS enabled
  - Automatic deployments on push
  - Preview deployments for pull requests
  - Basic analytics
  - Up to 100GB bandwidth per month
