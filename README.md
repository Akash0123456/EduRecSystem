# EduRec - Educational AI Assistant

EduRec is an AI-powered educational assistant designed exclusively for academic purposes. It provides educational responses with credible sources and detailed analysis methodology.

## Project Structure

The project is organized into the following directories:

```
EduRecSystem/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── screens/    # Page components
│   │   ├── services/   # API services
│   │   ├── models/     # Data models
│   │   └── utils/      # Utility functions
│   └── public/         # Static assets
│
├── backend/            # Node.js backend API
│   ├── src/
│   │   ├── controllers/ # API controllers
│   │   ├── routes/      # API routes
│   │   └── utils/       # Utility functions
│   └── config/          # Configuration files
│
└── extra/              # Additional files and resources
```

## Features

- **Educational Focus**: Strictly designed for academic and learning purposes
- **Credible Sources**: Every response includes references to academic sources
- **Analysis Methodology**: Transparent explanation of how answers are formulated
- **User-Friendly Interface**: Clean, modern UI with dark theme

## Getting Started

### Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal)

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

## Usage

1. Sign in from the landing page (no actual authentication required in the current version)
2. Ask educational questions in the chat interface
3. Receive responses with:
   - Clear, educational answers
   - Credible sources with links
   - Analysis methodology explaining the approach

## Technologies Used

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Radix UI components
- React Router for navigation
- OpenAI API for generating educational responses

### Backend
- Node.js
- Express
- OpenAI API integration
- Web scraping for additional educational content

