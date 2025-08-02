# SpeakIt Backend

This is the backend server for the SpeakIt AI-powered public speaking training application.

## Features

- **Speech Analysis**: Upload audio files for comprehensive analysis
- **AI Feedback**: GPT-4 powered personalized coaching suggestions
- **Debate Mode**: Real-time AI opponent responses
- **Topic Generation**: AI-generated practice topics
- **Progress Tracking**: User session storage and analytics
- **Real-time Features**: WebSocket support for live analysis

## Setup

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Production Start**
   ```bash
   npm start
   ```

## API Endpoints

### Health Check
- `GET /api/health` - Server status

### Speech Analysis
- `POST /api/speech/analyze` - Upload audio file for analysis
  - Body: FormData with 'audio' file
  - Returns: Analysis results with scores and feedback

### AI Services
- `POST /api/ai/feedback` - Generate personalized feedback
  - Body: `{ transcript, analysisData, context }`
  - Returns: AI-generated coaching suggestions

- `POST /api/ai/debate` - Get AI debate response
  - Body: `{ topic, userArgument, debateHistory, position }`
  - Returns: AI counterargument

### Topic Generation
- `POST /api/topics/generate` - Generate practice topics
  - Body: `{ category, difficulty, count }`
  - Returns: Array of generated topics

### User Progress
- `GET /api/user/:userId/progress` - Get user progress data
- `POST /api/user/:userId/session` - Save practice session

## WebSocket Events

Connect to `ws://localhost:3001` for real-time features:

- Send: `{ type: 'audio_chunk', audioData: ... }`
- Receive: `{ type: 'live_feedback', data: { volume, clarity, timestamp } }`

## Production Considerations

1. **Database**: Replace in-memory storage with PostgreSQL/MongoDB
2. **Authentication**: Add JWT-based user authentication
3. **File Storage**: Use AWS S3 for audio file storage
4. **Speech Processing**: Integrate Whisper API for real speech-to-text
5. **Rate Limiting**: Add API rate limiting
6. **Monitoring**: Add logging and error tracking
7. **Security**: Add input validation and sanitization

## Technology Stack

- **Express.js** - Web framework
- **OpenAI GPT-4** - AI feedback generation
- **WebSocket** - Real-time communication
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing