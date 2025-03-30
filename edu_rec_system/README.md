# EduRec - Educational AI Assistant

EduRec is an AI-powered educational assistant designed exclusively for academic purposes. It provides educational responses with credible sources and detailed analysis methodology.

## Features

- **Educational Focus**: Strictly designed for academic and learning purposes
- **Credible Sources**: Every response includes references to academic sources
- **Analysis Methodology**: Transparent explanation of how answers are formulated
- **User-Friendly Interface**: Clean, modern UI with dark theme

## Project Structure

The project consists of two main parts:

1. **Frontend (edu_rec_system)**: React application with TypeScript and Tailwind CSS
2. **Backend API (edu_rec_api)**: Node.js API server (not fully implemented yet)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository
   ```
   git clone https://github.com/kchabra/EduRecSystem.git
   cd EduRecSystem
   ```

2. Install dependencies for the frontend
   ```
   cd edu_rec_system
   npm install
   ```

3. Create a `.env` file in the `edu_rec_system` directory with your OpenAI API key
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development server
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal)

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

### Backend (planned)
- Node.js
- Express
- OpenAI API integration
- Web scraping for additional educational content

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
