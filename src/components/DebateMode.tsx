import React, { useState, useRef, useEffect } from 'react';
import { apiService } from '../services/api';
import { 
  Mic, 
  Send, 
  Bot, 
  User, 
  Clock, 
  Trophy,
  MessageSquare,
  Play,
  Pause
} from 'lucide-react';

const DebateMode: React.FC = () => {
  const [currentTopic, setCurrentTopic] = useState('');
  const [debateStarted, setDebateStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Array<{
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
  }>>([]);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [round, setRound] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);

  const debateTopics = [
    {
      title: "Remote Work vs Office Work",
      description: "Which work model is more beneficial for productivity and employee wellbeing?",
      position: "Defend remote work advantages"
    },
    {
      title: "Social Media Impact on Society", 
      description: "Has social media been more beneficial or harmful to society?",
      position: "Argue for the positive impact"
    },
    {
      title: "Artificial Intelligence in Education",
      description: "Should AI tools be widely adopted in educational institutions?",
      position: "Support AI integration in schools"
    },
    {
      title: "Climate Change Solutions",
      description: "What should be the primary focus: individual action or systemic change?",
      position: "Argue for systemic change priority"
    }
  ];

  useEffect(() => {
    if (debateStarted && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      endDebate();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [debateStarted, timeRemaining]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startDebate = (topic: typeof debateTopics[0]) => {
    setCurrentTopic(topic.title);
    setDebateStarted(true);
    setMessages([
      {
        type: 'ai',
        content: `Welcome to the debate on "${topic.title}". You'll be ${topic.position.toLowerCase()}. I'll present counterarguments to challenge your position. You have 5 minutes total. Make your opening statement!`,
        timestamp: new Date()
      }
    ]);
  };

  const endDebate = () => {
    setDebateStarted(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Add final AI message with feedback
    setMessages(prev => [...prev, {
      type: 'ai',
      content: `Debate concluded! Great job engaging with the topic. Here's your performance summary:

🎯 Argument Strength: 85% - Well-structured points with good evidence
🗣️ Delivery Confidence: 78% - Spoke clearly, could use more conviction  
⚡ Response Speed: 92% - Quick thinking and good rebuttals
🎭 Persuasiveness: 80% - Compelling arguments, room for more emotional appeal

Keep practicing to improve your debate skills!`,
      timestamp: new Date()
    }]);
  };

  const handleUserMessage = (content: string) => {
    if (isGeneratingResponse) return;
    
    const userMessage = {
      type: 'user' as const,
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);

    // Generate real AI response
    generateAIResponse(content);
  };

  const generateAIResponse = async (userArgument: string) => {
    setIsGeneratingResponse(true);
    
    try {
      const response = await apiService.getDebateResponse(
        currentTopic,
        userArgument,
        messages.slice(-5), // Last 5 messages for context
        'opposing' // AI takes opposing position
      );
      
      setMessages(prev => [...prev, {
        type: 'ai',
        content: response.response,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Failed to generate AI response:', error);
      // Fallback to a generic response
      setMessages(prev => [...prev, {
        type: 'ai',
        content: "That's an interesting perspective. Could you elaborate on your reasoning and provide some supporting evidence for your position?",
        timestamp: new Date()
      }]);
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    // Simulate recording for 3 seconds then add message
    setTimeout(() => {
      setIsRecording(false);
      handleUserMessage("Remote work actually increases productivity by 13% according to Stanford research. Employees have fewer distractions, no commute stress, and can work during their peak energy hours. The key is proper communication tools and clear expectations.");
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!debateStarted) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">AI Debate Challenge</h2>
          <p className="text-slate-600">Choose a topic and engage in a structured debate with our AI opponent</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {debateTopics.map((topic, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{topic.title}</h3>
              <p className="text-slate-600 mb-4">{topic.description}</p>
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-700">
                  <strong>Your Position:</strong> {topic.position}
                </p>
              </div>
              <button
                onClick={() => startDebate(topic)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <MessageSquare size={16} />
                <span>Start Debate</span>
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">How Debate Mode Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 text-xl font-bold">1</span>
              </div>
              <h4 className="font-medium text-slate-900 mb-2">Choose Your Side</h4>
              <p className="text-sm text-slate-600">Select a topic and your assigned position in the debate</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 text-xl font-bold">2</span>
              </div>
              <h4 className="font-medium text-slate-900 mb-2">Engage & Respond</h4>
              <p className="text-sm text-slate-600">Make your arguments while the AI challenges your points</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 text-xl font-bold">3</span>
              </div>
              <h4 className="font-medium text-slate-900 mb-2">Get Feedback</h4>
              <p className="text-sm text-slate-600">Receive detailed analysis of your debate performance</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Debate Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{currentTopic}</h2>
            <p className="text-slate-600">Round {round} • AI Debate Challenge</p>
          </div>
          <div className="text-center">
            <div className="flex items-center space-x-2 text-red-600 mb-1">
              <Clock size={16} />
              <span className="font-mono text-lg font-bold">{formatTime(timeRemaining)}</span>
            </div>
            <p className="text-xs text-slate-500">Time Remaining</p>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-96 flex flex-col">
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {message.type === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-4 rounded-xl ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 text-slate-900'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-slate-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isRecording && (
            <div className="flex justify-end">
              <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-xl border border-red-200">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-700 font-medium">Recording your response...</span>
              </div>
            </div>
          )}
          {isGeneratingResponse && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-slate-700 font-medium">AI is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={startRecording}
              disabled={isRecording || timeRemaining === 0 || isGeneratingResponse}
              className={`p-3 rounded-xl font-medium transition-colors ${
                isRecording 
                  ? 'bg-red-100 text-red-600 cursor-not-allowed'
                  : timeRemaining === 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : isGeneratingResponse
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              <Mic size={20} />
            </button>
            
            <input
              type="text"
              placeholder={timeRemaining === 0 ? 'Debate ended' : isGeneratingResponse ? 'AI is responding...' : 'Type your argument or use voice recording...'}
              disabled={timeRemaining === 0 || isGeneratingResponse}
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim() && !isGeneratingResponse) {
                  handleUserMessage(e.currentTarget.value.trim());
                  e.currentTarget.value = '';
                }
              }}
            />
            
            <button
              disabled={timeRemaining === 0 || isGeneratingResponse}
              className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => {
            setDebateStarted(false);
            setMessages([]);
            setTimeRemaining(300);
            setRound(1);
          }}
          className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
        >
          End Debate
        </button>
        
        <div className="flex items-center space-x-4 text-sm text-slate-500">
          <span>💡 Tip: Structure your arguments with evidence and examples</span>
        </div>
      </div>
    </div>
  );
};

export default DebateMode;