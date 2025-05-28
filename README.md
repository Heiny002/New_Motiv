# Motiv.ai

A revolutionary personal goal achievement platform combining distinct AI coaching personalities with authentic social support and health tracking integration.

## Features

- AI Coaching Personalities (Sarge, Dr. Joy, Vector)
- Goal Management System
- Check-in System
- Authentic Social Feed
- Health Tracking Integration
- Content Recommendation System

## Tech Stack

- Frontend: React.js with TypeScript
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: Firebase Authentication
- AI Integration: Anthropic API
- Styling: Styled Components

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- MongoDB account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/motiv-ai.git
cd motiv-ai
```

2. Install dependencies:
```bash
cd frontend
npm install
```

3. Create a `.env` file in the frontend directory with your Firebase configuration:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm start
```

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts
│   ├── pages/         # Page components
│   ├── services/      # API and service integrations
│   ├── App.tsx        # Main app component
│   └── index.tsx      # Entry point
├── public/            # Static files
└── package.json       # Dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 