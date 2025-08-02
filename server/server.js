const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { OpenAI } = require('openai');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// In-memory storage (replace with database in production)
const sessions = new Map();
const userProfiles = new Map();

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SpeakIt Backend is running' });
});

// Speech Analysis Endpoint
app.post('/api/speech/analyze', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const sessionId = uuidv4();
    const audioBuffer = req.file.buffer;
    
    // Simulate speech analysis (replace with real speech processing)
    const analysisResult = await analyzeAudio(audioBuffer);
    
    // Store session
    sessions.set(sessionId, {
      id: sessionId,
      timestamp: new Date(),
      analysis: analysisResult,
      audioSize: audioBuffer.length
    });

    res.json({
      sessionId,
      analysis: analysisResult
    });
  } catch (error) {
    console.error('Speech analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze speech' });
  }
});

// AI Feedback Generation
app.post('/api/ai/feedback', async (req, res) => {
  try {
    const { transcript, analysisData, context } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: 'Transcript is required' });
    }

    const prompt = `
      As an AI speaking coach, analyze this speech transcript and provide personalized feedback:
      
      Transcript: "${transcript}"
      
      Analysis Data:
      - Pace: ${analysisData?.pace || 'Unknown'}
      - Clarity: ${analysisData?.clarity || 'Unknown'}
      - Filler Words: ${analysisData?.fillerWords || 'Unknown'}
      - Context: ${context || 'General speaking practice'}
      
      Provide:
      1. Overall assessment (score out of 100)
      2. Specific strengths
      3. Areas for improvement
      4. 3-4 actionable suggestions
      
      Format as JSON with fields: overallScore, strengths, improvements, suggestions
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500
    });

    const feedback = JSON.parse(completion.choices[0].message.content);
    
    res.json({ feedback });
  } catch (error) {
    console.error('AI feedback error:', error);
    res.status(500).json({ error: 'Failed to generate feedback' });
  }
});

// Debate Mode - Generate AI Response
app.post('/api/ai/debate', async (req, res) => {
  try {
    const { topic, userArgument, debateHistory, position } = req.body;

    const prompt = `
      You are an AI debate opponent. The topic is: "${topic}"
      Your position: Argue against the user's stance.
      User's latest argument: "${userArgument}"
      
      Previous debate context: ${JSON.stringify(debateHistory?.slice(-3) || [])}
      
      Provide a challenging but fair counterargument that:
      1. Addresses their specific points
      2. Introduces new evidence or perspectives
      3. Maintains respectful debate tone
      4. Is 2-3 sentences long
      
      Respond only with the counterargument text.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 200
    });

    const response = completion.choices[0].message.content.trim();
    
    res.json({ response });
  } catch (error) {
    console.error('Debate AI error:', error);
    res.status(500).json({ error: 'Failed to generate debate response' });
  }
});

// Topic Generation
app.post('/api/topics/generate', async (req, res) => {
  try {
    const { category, difficulty, count = 4 } = req.body;

    const prompt = `
      Generate ${count} unique speaking practice topics for:
      Category: ${category || 'general'}
      Difficulty: ${difficulty || 'intermediate'}
      
      For each topic, provide:
      - title: Engaging topic title
      - description: Brief description of what to discuss
      - type: One of [Presentation, Debate, Interview, Storytelling]
      - duration: Suggested time (e.g., "3-5 minutes")
      - tips: Array of 3 helpful tips
      
      Format as JSON array.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
      max_tokens: 800
    });

    const topics = JSON.parse(completion.choices[0].message.content);
    
    res.json({ topics });
  } catch (error) {
    console.error('Topic generation error:', error);
    res.status(500).json({ error: 'Failed to generate topics' });
  }
});

// User Progress
app.get('/api/user/:userId/progress', (req, res) => {
  const { userId } = req.params;
  
  // Get user sessions
  const userSessions = Array.from(sessions.values())
    .filter(session => session.userId === userId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  // Calculate progress metrics
  const progressData = calculateProgress(userSessions);
  
  res.json({ progress: progressData });
});

// Save User Session
app.post('/api/user/:userId/session', (req, res) => {
  const { userId } = req.params;
  const sessionData = req.body;
  
  const sessionId = uuidv4();
  sessions.set(sessionId, {
    id: sessionId,
    userId,
    timestamp: new Date(),
    ...sessionData
  });
  
  res.json({ sessionId, message: 'Session saved successfully' });
});

// Helper Functions

async function analyzeAudio(audioBuffer) {
  // Simulate audio analysis (replace with real speech processing)
  // In production, use libraries like:
  // - Whisper for speech-to-text
  // - librosa equivalent for audio feature extraction
  // - Custom algorithms for pace, clarity analysis
  
  const mockAnalysis = {
    overallScore: Math.floor(Math.random() * 20) + 75, // 75-95
    pace: {
      score: Math.floor(Math.random() * 25) + 70,
      wordsPerMinute: Math.floor(Math.random() * 50) + 140,
      feedback: "Good speaking pace, consider varying speed for emphasis"
    },
    clarity: {
      score: Math.floor(Math.random() * 15) + 80,
      feedback: "Clear articulation, excellent pronunciation"
    },
    fillerWords: {
      score: Math.floor(Math.random() * 30) + 65,
      count: Math.floor(Math.random() * 8) + 2,
      types: ["um", "uh", "like"],
      feedback: "Try pausing instead of using filler words"
    },
    volume: {
      score: Math.floor(Math.random() * 20) + 75,
      consistency: "Good",
      feedback: "Maintain consistent volume throughout"
    },
    duration: Math.floor(Math.random() * 180) + 60, // 1-4 minutes
    transcript: "This is a simulated transcript of the analyzed speech..."
  };
  
  return mockAnalysis;
}

function calculateProgress(sessions) {
  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      averageScore: 0,
      improvement: 0,
      strengths: [],
      weaknesses: []
    };
  }
  
  const scores = sessions.map(s => s.analysis?.overallScore || 0);
  const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  
  // Calculate improvement (last 5 vs previous 5)
  const recent = scores.slice(0, 5);
  const previous = scores.slice(5, 10);
  const improvement = recent.length > 0 && previous.length > 0 
    ? (recent.reduce((a, b) => a + b, 0) / recent.length) - 
      (previous.reduce((a, b) => a + b, 0) / previous.length)
    : 0;
  
  return {
    totalSessions: sessions.length,
    averageScore: Math.round(averageScore),
    improvement: Math.round(improvement),
    recentSessions: sessions.slice(0, 10),
    trends: {
      pace: calculateTrend(sessions, 'pace'),
      clarity: calculateTrend(sessions, 'clarity'),
      fillerWords: calculateTrend(sessions, 'fillerWords')
    }
  };
}

function calculateTrend(sessions, metric) {
  const values = sessions
    .map(s => s.analysis?.[metric]?.score)
    .filter(v => v !== undefined)
    .slice(0, 10);
  
  if (values.length < 2) return 0;
  
  const recent = values.slice(0, 5).reduce((a, b) => a + b, 0) / Math.min(5, values.length);
  const older = values.slice(5).reduce((a, b) => a + b, 0) / Math.max(1, values.length - 5);
  
  return Math.round(recent - older);
}

// WebSocket for real-time features
const server = app.listen(PORT, () => {
  console.log(`SpeakIt Backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

// WebSocket server for real-time speech analysis
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected for real-time analysis');
  
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'audio_chunk') {
        // Process audio chunk in real-time
        const quickAnalysis = await processAudioChunk(data.audioData);
        ws.send(JSON.stringify({
          type: 'live_feedback',
          data: quickAnalysis
        }));
      }
    } catch (error) {
      console.error('WebSocket error:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

async function processAudioChunk(audioData) {
  // Quick analysis for real-time feedback
  return {
    volume: Math.random() * 100,
    clarity: Math.random() * 100,
    timestamp: Date.now()
  };
}