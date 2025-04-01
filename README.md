# EduRec - Your Educational AI Companion

Hey there! Welcome to EduRec, a smart educational assistant we built to help with academic learning. It's designed to give you educational answers backed by real sources and clear explanations of how it reached those conclusions.

## What's in the Box

Here's how our project is organized:

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

## Cool Stuff It Does

- **Learning Focus**: We built this purely for helping you learn and study
- **Trustworthy Sources**: Every answer comes with academic references so you know where the info comes from
- **See the Thinking**: We show you how answers are put together, no black boxes here
- **Nice Looking Interface**: Clean design with a sleek dark theme that's easy on the eyes

## How to Use It

Just hop on the landing page, ask your educational questions in the chat, and you'll get:
- Clear, helpful answers
- Links to credible sources
- An explanation of how the answer was figured out

## Tech We Used

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
