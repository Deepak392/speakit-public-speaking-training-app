import React, { useState } from 'react';
import { apiService } from '../services/api';
import { 
  Lightbulb, 
  RefreshCw, 
  BookOpen, 
  Mic, 
  MessageSquare,
  Users,
  Briefcase,
  Heart,
  Shuffle,
  Play
} from 'lucide-react';

interface TopicGeneratorProps {
  onStartPractice: () => void;
}

const TopicGenerator: React.FC<TopicGeneratorProps> = ({ onStartPractice }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('intermediate');
  const [generatedTopics, setGeneratedTopics] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Topics', icon: BookOpen, color: 'blue' },
    { id: 'business', name: 'Business', icon: Briefcase, color: 'green' },
    { id: 'social', name: 'Social Issues', icon: Users, color: 'purple' },
    { id: 'personal', name: 'Personal Growth', icon: Heart, color: 'pink' },
    { id: 'debate', name: 'Debate Topics', icon: MessageSquare, color: 'red' }
  ];

  const topicBank = {
    business: [
      {
        title: "Elevator Pitch: Revolutionary App Idea",
        description: "You have 60 seconds to pitch a mobile app that solves a daily problem. Convince investors to fund your idea.",
        type: "Presentation",
        duration: "1-2 minutes",
        difficulty: "beginner",
        tips: ["Start with the problem", "Explain your solution clearly", "End with the ask"]
      },
      {
        title: "Leading Through Crisis",
        description: "Your company faces a major setback. Address your team about navigating the challenges ahead.",
        type: "Leadership",
        duration: "3-5 minutes", 
        difficulty: "advanced",
        tips: ["Acknowledge the situation", "Show confidence", "Provide clear next steps"]
      }
    ],
    social: [
      {
        title: "Climate Change: Individual vs Systemic Action",
        description: "Argue whether individual lifestyle changes or systemic policy changes are more effective in fighting climate change.",
        type: "Debate",
        duration: "5 minutes",
        difficulty: "intermediate",
        tips: ["Use specific examples", "Address counterarguments", "Back up with data"]
      },
      {
        title: "The Future of Work",
        description: "Present your vision of how work will evolve in the next decade. Discuss remote work, AI, and changing career patterns.",
        type: "Presentation",
        duration: "4-6 minutes",
        difficulty: "intermediate", 
        tips: ["Paint a clear picture", "Address concerns", "Be forward-thinking"]
      }
    ],
    personal: [
      {
        title: "Overcoming Your Greatest Fear",
        description: "Share a personal story about facing and conquering a significant fear or challenge in your life.",
        type: "Storytelling",
        duration: "3-4 minutes",
        difficulty: "beginner",
        tips: ["Make it personal", "Include emotions", "Share the lesson learned"]
      },
      {
        title: "The Skill That Changed My Life",
        description: "Discuss a skill you've learned that had a transformative impact on your personal or professional life.",
        type: "Presentation", 
        duration: "2-3 minutes",
        difficulty: "beginner",
        tips: ["Be specific about the change", "Include before/after", "Inspire others"]
      }
    ],
    debate: [
      {
        title: "AI Should Replace Human Customer Service",
        description: "Take a position on whether artificial intelligence should completely replace human customer service representatives.",
        type: "Debate",
        duration: "5 minutes",
        difficulty: "intermediate",
        tips: ["Consider both efficiency and empathy", "Use real examples", "Address job displacement concerns"]
      },
      {
        title: "Social Media: Harmful or Helpful for Democracy",
        description: "Argue whether social media platforms strengthen or weaken democratic processes and civic engagement.",
        type: "Debate",
        duration: "5-7 minutes",
        difficulty: "advanced",
        tips: ["Examine multiple aspects", "Consider global perspectives", "Address misinformation"]
      }
    ]
  };

  const generateTopics = () => {
    setIsGenerating(true);
    setError(null);
    
    // Use real AI generation
    apiService.generateTopics(selectedCategory, selectedDifficulty, 4)
      .then(response => {
        setGeneratedTopics(response.topics);
      })
      .catch(error => {
        console.error('Failed to generate topics:', error);
        setError('Failed to generate topics. Please try again.');
        
        // Fallback to local topics
        let topics: any[] = [];
        
        if (selectedCategory === 'all') {
          topics = Object.values(topicBank).flat();
        } else {
          topics = topicBank[selectedCategory as keyof typeof topicBank] || [];
        }

        // Filter by difficulty
        topics = topics.filter(topic => 
          selectedDifficulty === 'all' || topic.difficulty === selectedDifficulty
        );

        // Shuffle and take 4 topics
        const shuffled = topics.sort(() => Math.random() - 0.5);
        setGeneratedTopics(shuffled.slice(0, 4));
      })
      .finally(() => {
        setIsGenerating(false);
      });
  };

  const generateTopicsWithFallback = () => {
    setIsGenerating(true);
    setError(null);
    
    // Try AI generation first, fallback to local topics
    apiService.generateTopics(selectedCategory, selectedDifficulty, 4)
      .then(response => {
        setGeneratedTopics(response.topics);
      })
      .catch(error => {
        console.error('AI generation failed, using fallback:', error);
        
        // Fallback to predefined topics
        let topics: any[] = [];
        
        if (selectedCategory === 'all') {
          topics = Object.values(topicBank).flat();
        } else {
          topics = topicBank[selectedCategory as keyof typeof topicBank] || [];
        }

        topics = topics.filter(topic => 
          selectedDifficulty === 'all' || topic.difficulty === selectedDifficulty
        );

        const shuffled = topics.sort(() => Math.random() - 0.5);
        setGeneratedTopics(shuffled.slice(0, 4));
        
        setError('Using offline topics. Connect to backend for AI-generated content.');
      })
      .finally(() => {
      setIsGenerating(false);
      });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Presentation': return <Mic size={16} />;
      case 'Debate': return <MessageSquare size={16} />;
      case 'Leadership': return <Users size={16} />;
      case 'Storytelling': return <BookOpen size={16} />;
      default: return <Mic size={16} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">AI Topic Generator</h2>
        <p className="text-slate-600">Get personalized practice topics tailored to your skill level and interests</p>
      </div>

      {/* Category Selection */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Choose Your Focus</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedCategory === category.id
                    ? `border-${category.color}-300 bg-${category.color}-50`
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className={`w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center ${
                  selectedCategory === category.id
                    ? `bg-${category.color}-200`
                    : 'bg-slate-100'
                }`}>
                  <IconComponent className={`w-6 h-6 ${
                    selectedCategory === category.id
                      ? `text-${category.color}-600`
                      : 'text-slate-600'
                  }`} />
                </div>
                <p className={`text-sm font-medium ${
                  selectedCategory === category.id
                    ? `text-${category.color}-700`
                    : 'text-slate-700'
                }`}>
                  {category.name}
                </p>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-slate-700">Difficulty:</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="all">All Levels</option>
            </select>
          </div>

          <button
            onClick={generateTopicsWithFallback}
            disabled={isGenerating}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            {isGenerating ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Lightbulb size={16} />
                <span>Generate Topics</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 text-amber-700">
            <AlertCircle size={16} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Generated Topics */}
      {generatedTopics.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-900">Your Practice Topics</h3>
            <button
              onClick={generateTopicsWithFallback}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Shuffle size={16} />
              <span>Generate New Set</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {generatedTopics.map((topic, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      {getTypeIcon(topic.type)}
                    </div>
                    <div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(topic.difficulty)}`}>
                        {topic.difficulty}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                    {topic.duration}
                  </span>
                </div>

                <h4 className="text-lg font-semibold text-slate-900 mb-2">{topic.title}</h4>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">{topic.description}</p>

                <div className="mb-4">
                  <h5 className="text-sm font-medium text-slate-700 mb-2">Quick Tips:</h5>
                  <ul className="space-y-1">
                    {topic.tips.map((tip: string, tipIndex: number) => (
                      <li key={tipIndex} className="text-xs text-slate-600 flex items-center space-x-2">
                        <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={onStartPractice}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors"
                >
                  <Play size={16} />
                  <span>Start Practice</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Getting Started */}
      {generatedTopics.length === 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Ready to Practice?</h3>
          <p className="text-slate-600 mb-6">Select your preferences above and generate personalized topics to start improving your speaking skills!</p>
          <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>AI-generated topics</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Skill-level matched</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Practice tips included</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicGenerator;