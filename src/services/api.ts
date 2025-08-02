// API service for communicating with the backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface AnalysisResult {
  overallScore: number;
  pace: {
    score: number;
    wordsPerMinute: number;
    feedback: string;
  };
  clarity: {
    score: number;
    feedback: string;
  };
  fillerWords: {
    score: number;
    count: number;
    types: string[];
    feedback: string;
  };
  volume: {
    score: number;
    consistency: string;
    feedback: string;
  };
  duration: number;
  transcript: string;
}

export interface Topic {
  title: string;
  description: string;
  type: string;
  duration: string;
  tips: string[];
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${this.baseUrl}/health`);
    if (!response.ok) {
      throw new Error('Backend is not available');
    }
    return response.json();
  }

  // Speech analysis
  async analyzeSpeech(audioBlob: Blob): Promise<{ sessionId: string; analysis: AnalysisResult }> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');

    const response = await fetch(`${this.baseUrl}/speech/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to analyze speech');
    }

    return response.json();
  }

  // AI feedback generation
  async generateFeedback(
    transcript: string,
    analysisData: Partial<AnalysisResult>,
    context?: string
  ): Promise<{ feedback: any }> {
    const response = await fetch(`${this.baseUrl}/ai/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transcript,
        analysisData,
        context,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate feedback');
    }

    return response.json();
  }

  // Debate AI response
  async getDebateResponse(
    topic: string,
    userArgument: string,
    debateHistory: any[],
    position: string
  ): Promise<{ response: string }> {
    const response = await fetch(`${this.baseUrl}/ai/debate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic,
        userArgument,
        debateHistory,
        position,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get debate response');
    }

    return response.json();
  }

  // Generate topics
  async generateTopics(
    category: string,
    difficulty: string,
    count: number = 4
  ): Promise<{ topics: Topic[] }> {
    const response = await fetch(`${this.baseUrl}/topics/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category,
        difficulty,
        count,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate topics');
    }

    return response.json();
  }

  // User progress
  async getUserProgress(userId: string): Promise<{ progress: any }> {
    const response = await fetch(`${this.baseUrl}/user/${userId}/progress`);

    if (!response.ok) {
      throw new Error('Failed to get user progress');
    }

    return response.json();
  }

  // Save session
  async saveSession(userId: string, sessionData: any): Promise<{ sessionId: string }> {
    const response = await fetch(`${this.baseUrl}/user/${userId}/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      throw new Error('Failed to save session');
    }

    return response.json();
  }
}

// WebSocket service for real-time features
export class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;

  constructor() {
    this.url = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        resolve();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
      };
    });
  }

  sendAudioChunk(audioData: ArrayBuffer): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'audio_chunk',
        audioData: Array.from(new Uint8Array(audioData))
      }));
    }
  }

  onLiveFeedback(callback: (data: any) => void): void {
    if (this.ws) {
      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'live_feedback') {
          callback(message.data);
        }
      };
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const apiService = new ApiService();
export const wsService = new WebSocketService();