import React, { useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Award, 
  Target,
  BarChart3,
  Clock,
  Mic,
  MessageSquare,
  ChevronDown,
  Filter
} from 'lucide-react';

const ProgressTracker: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('overall');

  const progressData = {
    overall: {
      current: 85,
      previous: 79,
      change: '+6',
      trend: 'up'
    },
    clarity: {
      current: 92,
      previous: 88,
      change: '+4',
      trend: 'up'
    },
    pace: {
      current: 78,
      previous: 75,
      change: '+3',
      trend: 'up'
    },
    confidence: {
      current: 88,
      previous: 82,
      change: '+6',
      trend: 'up'
    },
    fillerWords: {
      current: 73,
      previous: 69,
      change: '+4',
      trend: 'up'
    }
  };

  const weeklyStats = [
    { day: 'Mon', sessions: 2, score: 82 },
    { day: 'Tue', sessions: 1, score: 78 },
    { day: 'Wed', sessions: 3, score: 85 },
    { day: 'Thu', sessions: 2, score: 88 },
    { day: 'Fri', sessions: 1, score: 84 },
    { day: 'Sat', sessions: 2, score: 90 },
    { day: 'Sun', sessions: 1, score: 87 }
  ];

  const recentAchievements = [
    { title: 'Week Warrior', description: 'Completed 7 practice sessions this week', icon: '🔥', date: '2 days ago' },
    { title: 'Clarity Champion', description: 'Achieved 90%+ clarity score', icon: '🎯', date: '3 days ago' },
    { title: 'Debate Master', description: 'Won your first AI debate challenge', icon: '🏆', date: '5 days ago' },
    { title: 'Consistent Speaker', description: '10-day practice streak!', icon: '⚡', date: '1 week ago' }
  ];

  const practiceHistory = [
    { 
      date: '2024-01-15', 
      type: 'Presentation', 
      topic: 'Climate Change Solutions', 
      duration: '3:45', 
      score: 87,
      improvements: ['Reduced filler words by 40%', 'Improved pace consistency']
    },
    { 
      date: '2024-01-14', 
      type: 'Debate', 
      topic: 'Remote Work Benefits', 
      duration: '5:00', 
      score: 92,
      improvements: ['Strong argument structure', 'Excellent rebuttal timing']
    },
    { 
      date: '2024-01-13', 
      type: 'Interview', 
      topic: 'Tell me about yourself', 
      duration: '2:30', 
      score: 78,
      improvements: ['Good content', 'Work on confidence']
    }
  ];

  const maxScore = Math.max(...weeklyStats.map(stat => stat.score));

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Progress Tracker</h2>
          <p className="text-slate-600 mt-1">Monitor your speaking improvement over time</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50">
            <Filter size={16} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-green-600 text-sm font-medium">+6 pts</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">85%</h3>
          <p className="text-slate-600 text-sm">Overall Score</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-green-600 text-sm font-medium">+15m</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">2.5h</h3>
          <p className="text-slate-600 text-sm">Practice Time</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-green-600 text-sm font-medium">+2</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">12</h3>
          <p className="text-slate-600 text-sm">Sessions</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-green-600 text-sm font-medium">On track</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">83%</h3>
          <p className="text-slate-600 text-sm">Goal Progress</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-900">Weekly Performance</h3>
            <select 
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="overall">Overall Score</option>
              <option value="clarity">Clarity</option>
              <option value="pace">Pace</option>
              <option value="confidence">Confidence</option>
            </select>
          </div>
          
          <div className="space-y-4">
            {weeklyStats.map((stat, index) => (
              <div key={index} className="flex items-center space-x-4">
                <span className="text-sm font-medium text-slate-600 w-10">{stat.day}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-6 relative">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${(stat.score / maxScore) * 100}%` }}
                  >
                    <span className="text-white text-xs font-medium">{stat.score}%</span>
                  </div>
                </div>
                <span className="text-xs text-slate-500 w-12">{stat.sessions} sessions</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Skill Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(progressData).map(([key, data]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-medium ${
                      data.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {data.change}%
                    </span>
                    <span className="text-sm text-slate-900">{data.current}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${data.current}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-xl font-semibold text-slate-900 mb-6">Recent Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentAchievements.map((achievement, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-100">
              <div className="text-3xl">{achievement.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900">{achievement.title}</h4>
                <p className="text-sm text-slate-600">{achievement.description}</p>
                <p className="text-xs text-slate-500 mt-1">{achievement.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Practice History */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-900">Practice History</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
        </div>
        <div className="space-y-4">
          {practiceHistory.map((session, index) => (
            <div key={index} className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    session.type === 'Presentation' 
                      ? 'bg-blue-100 text-blue-600' 
                      : session.type === 'Debate' 
                      ? 'bg-green-100 text-green-600'
                      : 'bg-purple-100 text-purple-600'
                  }`}>
                    {session.type === 'Presentation' ? <Mic size={16} /> : <MessageSquare size={16} />}
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">{session.topic}</h4>
                    <p className="text-sm text-slate-500">{session.type} • {session.duration}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{session.score}%</p>
                  <p className="text-xs text-slate-500">{session.date}</p>
                </div>
              </div>
              <div className="pl-13">
                <div className="flex flex-wrap gap-2">
                  {session.improvements.map((improvement, i) => (
                    <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {improvement}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;