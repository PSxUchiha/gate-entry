# Gate Entry System

A modern web application for managing visitor access and security in organizations. Built with Next.js, Prisma, and TypeScript.

## Features

- **Visitor Registration**
  - Support for both internal employees and external visitors
  - Automated unique code generation
  - Email and SMS notifications
  - Real-time status updates

- **Security Dashboard**
  - Real-time visitor monitoring
  - Check-in/check-out management
  - Security alerts and protocols
  - Visit time tracking
  - Daily activity reports

- **Department Portal**
  - Visit approval workflow
  - Meeting status management
  - Department-specific reports
  - Employee visit history

## Development Authentication

For development and testing purposes, the following credentials are available:

### Security Team
- Username: sailsecurity
- Password: sail
- Role: Security Team Member

### Department Access

#### Research & Development
- Username: rd_admin
- Password: rd123
- Role: Department Admin

#### Steel Production
- Username: steel_admin
- Password: steel123
- Role: Department Admin

#### Quality Control
- Username: quality_admin
- Password: quality123
- Role: Department Admin

#### Human Resources
- Username: hr_admin
- Password: hr123
- Role: Department Admin

#### Process Automation
- Username: automation_admin
- Password: automation123
- Role: Department Admin

**Note**: These are development credentials only. In production, proper authentication with secure password hashing and user management should be implemented.

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Notifications**: Twilio (SMS), Nodemailer (Email)
- **UI Components**: shadcn/ui

## Prerequisites

- Node.js 18.x or later
- PostgreSQL database
- Twilio account for SMS notifications
- SMTP server for email notifications

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/gate_entry_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Email (Replace with your SMTP settings)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-specific-password"

# Twilio (Replace with your Twilio credentials)
TWILIO_ACCOUNT_SID="your-account-sid"
TWILIO_AUTH_TOKEN="your-auth-token"
TWILIO_PHONE_NUMBER="your-twilio-phone-number"
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/gate-entry.git
   cd gate-entry
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## Deployment

This application is configured for deployment on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

## License

MIT
