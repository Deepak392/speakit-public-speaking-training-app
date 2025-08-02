import React, { useState } from 'react';
import { Mic, BarChart3, MessageSquare, Settings, Trophy, BookOpen } from 'lucide-react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import SpeechAnalyzer from './components/SpeechAnalyzer';
import DebateMode from './components/DebateMode';
import ProgressTracker from './components/ProgressTracker';
import TopicGenerator from './components/TopicGenerator';
import UserProfile from './components/UserProfile';

type ActiveTab = 'dashboard' | 'practice' | 'debate' | 'progress' | 'topics' | 'profile';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'practice':
        return <SpeechAnalyzer />;
      case 'debate':
        return <DebateMode />;
      case 'progress':
        return <ProgressTracker />;
      case 'topics':
        return <TopicGenerator onStartPractice={() => setActiveTab('practice')} />;
      case 'profile':
        return <UserProfile />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white shadow-lg border-r border-slate-200 min-h-screen">
          <div className="p-6">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <BarChart3 size={20} />
                <span className="font-medium">Dashboard</span>
              </button>
              
              <button
                onClick={() => setActiveTab('practice')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === 'practice'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Mic size={20} />
                <span className="font-medium">Speech Practice</span>
              </button>
              
              <button
                onClick={() => setActiveTab('debate')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === 'debate'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <MessageSquare size={20} />
                <span className="font-medium">Debate Mode</span>
              </button>
              
              <button
                onClick={() => setActiveTab('topics')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === 'topics'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <BookOpen size={20} />
                <span className="font-medium">Practice Topics</span>
              </button>
              
              <button
                onClick={() => setActiveTab('progress')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === 'progress'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Trophy size={20} />
                <span className="font-medium">Progress</span>
              </button>
              
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === 'profile'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Settings size={20} />
                <span className="font-medium">Profile</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;