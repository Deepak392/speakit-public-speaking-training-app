import React from 'react';
import { 
  Mic, 
  MessageSquare, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Target,
  Award,
  BarChart3,
  PlayCircle
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const recentSessions = [
    { type: 'Presentation', topic: 'Climate Change Solutions', score: 87, date: '2 hours ago' },
    { type: 'Debate', topic: 'Remote Work Benefits', score: 92, date: '1 day ago' },
    { type: 'Interview', topic: 'Tell me about yourself', score: 78, date: '3 days ago' },
  ];

  const practiceAreas = [
    { name: 'Filler Words', current: 85, target: 90, improvement: '+12%' },
    { name: 'Speaking Pace', current: 78, target: 85, improvement: '+8%' },
    { name: 'Vocal Clarity', current: 92, target: 95, improvement: '+5%' },
    { name: 'Confidence', current: 88, target: 90, improvement: '+15%' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Welcome back, Alex!</h2>
        <p className="text-blue-100 mb-6">Ready to improve your speaking skills today?</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8" />
              <div>
                <p className="text-sm text-blue-100">Practice Time</p>
                <p className="text-2xl font-bold">45 min</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Target className="w-8 h-8" />
              <div>
                <p className="text-sm text-blue-100">Weekly Goal</p>
                <p className="text-2xl font-bold">67%</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Award className="w-8 h-8" />
              <div>
                <p className="text-sm text-blue-100">Current Streak</p>
                <p className="text-2xl font-bold">12 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => onNavigate('practice')}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 hover:scale-105 group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Mic className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-slate-900">Start Practice</h3>
              <p className="text-sm text-slate-500">Record and analyze your speech</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('debate')}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 hover:scale-105 group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-slate-900">Debate Mode</h3>
              <p className="text-sm text-slate-500">Practice with AI opponent</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('topics')}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 hover:scale-105 group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-slate-900">Get Topics</h3>
              <p className="text-sm text-slate-500">AI-generated practice topics</p>
            </div>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Sessions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-900">Recent Sessions</h3>
            <button
              onClick={() => onNavigate('progress')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View all
            </button>
          </div>
          <div className="space-y-4">
            {recentSessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <PlayCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{session.topic}</p>
                    <p className="text-sm text-slate-500">{session.type} • {session.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">{session.score}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Areas */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-900">Focus Areas</h3>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-4">
            {practiceAreas.map((area, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">{area.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-green-600 font-medium">{area.improvement}</span>
                    <span className="text-sm text-slate-900">{area.current}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${area.current}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;