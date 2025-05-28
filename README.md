# Motiv - AI-Powered Goal Achievement Platform

Motiv is a full-stack application that helps users achieve their goals through AI-powered coaching and personalized support.

## Project Structure

This is a monorepo containing both the backend and frontend applications:

```
motiv/
├── backend/           # Node.js/Express backend
│   ├── src/          # Source code
│   ├── config/       # Configuration files
│   └── tests/        # Backend tests
├── frontend/         # React frontend
│   ├── src/         # Source code
│   ├── public/      # Static files
│   └── tests/       # Frontend tests
└── package.json     # Root package.json for managing the monorepo
```

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB >= 6.0
- Redis (for caching)

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Heiny002/New_Motiv.git
   cd New_Motiv
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env` in both backend and frontend directories
   - Update the variables with your configuration

4. **Start the development servers:**
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start both backend and frontend in development mode
- `npm run build` - Build both backend and frontend
- `npm run test` - Run tests for both backend and frontend
- `npm run lint` - Run linting for both backend and frontend
- `npm run format` - Format code using Prettier

## Development Workflow

1. **Backend Development:**
   - Located in the `backend` directory
   - Built with Node.js, Express, and TypeScript
   - Uses MongoDB for data storage
   - Implements RESTful API endpoints

2. **Frontend Development:**
   - Located in the `frontend` directory
   - Built with React and TypeScript
   - Uses modern React features and hooks
   - Implements responsive design

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests and ensure they pass
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 