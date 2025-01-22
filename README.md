# sinc(i) website

The sinc(i) web application aims to facilitate research collaboration, streamline project management, and support various academic activities within the Research Institute for Signals, Systems, and Computational Intelligence. It plans to integrate essential features such as secure authentication, comprehensive user and research management, and robust course handling to enhance productivity and collaboration within the academic community.

## Features

- **Authentication System**: Secure login through Google OAuth
- **User Management**: Complete profile system for researchers and staff
- **Research Management**: Track research lines, projects, and publications
- **Course Management**: Handle academic courses and materials
- **Dark Mode Support**: Full dark mode implementation for better user experience

## Tech Stack

- **Frontend**: Next.js 15, React 19
- **Styling**: Tailwind CSS, next-themes
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- PostgreSQL database
- Google OAuth credentials

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sinc-website.git
cd sinc-website
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sinc_db"

# Authentication
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. Initialize the database:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # Reusable React components
├── lib/             # Utility functions and configurations
└── types/           # TypeScript type definitions
```

## Database Schema

The database is designed to handle:
- User profiles and roles
- Research lines and projects
- Academic publications
- Course management
- Staff verification system
- User relationships (advisor-advisee)

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build production version
- `npm start`: Start production server
- `npm run lint`: Run ESLint

## Development Workflow

1. Create a new branch for your feature:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit them:
```bash
git add .
git commit -m "Description of your changes"
```

3. Push to your branch and create a pull request:
```bash
git push origin feature/your-feature-name
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request


## Deployment

The application can be deployed to any platform that supports Next.js applications. We recommend using Vercel for the best integration experience.

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

- Project Maintainer: Franco Matzkin
- Email: fmatzkin [at] sinc.unl.edu.ar

## Acknowledgments

- [sinc(i) Research Institute](https://sinc.unl.edu.ar/)
