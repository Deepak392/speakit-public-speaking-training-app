import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Bell, 
  Target, 
  Award,
  Mic,
  Volume2,
  Languages,
  BookOpen,
  Save,
  Edit3
} from 'lucide-react';

const UserProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    level: 'Intermediate Speaker',
    goals: 'Improve public speaking confidence and reduce filler words',
    preferredLanguage: 'english',
    practiceReminders: true,
    weeklyGoal: 5,
    focusAreas: ['Filler Words', 'Speaking Pace', 'Confidence']
  });

  const achievements = [
    { title: 'First Steps', description: 'Completed your first practice session', date: '2 weeks ago', icon: '🎯' },
    { title: 'Week Warrior', description: 'Practiced 7 days in a row', date: '1 week ago', icon: '🔥' },
    { title: 'Clarity Champion', description: 'Achieved 90%+ clarity score', date: '3 days ago', icon: '✨' },
    { title: 'Debate Master', description: 'Won your first AI debate', date: '2 days ago', icon: '🏆' }
  ];

  const stats = [
    { label: 'Total Sessions', value: '47', change: '+12 this week' },
    { label: 'Practice Hours', value: '18.5', change: '+3.2 this week' },
    { label: 'Avg Score', value: '85%', change: '+6% improvement' },
    { label: 'Current Streak', value: '12 days', change: 'Personal best!' }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Save logic would go here
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="text-2xl font-bold text-slate-900 bg-transparent border-b border-slate-300 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="text-slate-600 bg-transparent border-b border-slate-300 focus:outline-none focus:border-blue-500"
                  />
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{profileData.name}</h1>
                  <p className="text-slate-600">{profileData.email}</p>
                </div>
              )}
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm text-slate-500">{profileData.level}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
            <span>{isEditing ? 'Save' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-4 bg-slate-50 rounded-xl">
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-600">{stat.label}</p>
              <p className="text-xs text-green-600 mt-1">{stat.change}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Preferences</span>
          </h3>
          
          <div className="space-y-6">
            {/* Goals */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Target className="w-4 h-4 inline mr-2" />
                Speaking Goals
              </label>
              {isEditing ? (
                <textarea
                  value={profileData.goals}
                  onChange={(e) => setProfileData({...profileData, goals: e.target.value})}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              ) : (
                <p className="text-slate-600 p-3 bg-slate-50 rounded-lg">{profileData.goals}</p>
              )}
            </div>

            {/* Weekly Goal */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <BookOpen className="w-4 h-4 inline mr-2" />
                Weekly Practice Goal
              </label>
              <div className="flex items-center space-x-3">
                {isEditing ? (
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={profileData.weeklyGoal}
                    onChange={(e) => setProfileData({...profileData, weeklyGoal: parseInt(e.target.value)})}
                    className="w-20 p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <span className="text-lg font-semibold text-slate-900">{profileData.weeklyGoal}</span>
                )}
                <span className="text-slate-600">sessions per week</span>
              </div>
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Languages className="w-4 h-4 inline mr-2" />
                Preferred Language
              </label>
              {isEditing ? (
                <select
                  value={profileData.preferredLanguage}
                  onChange={(e) => setProfileData({...profileData, preferredLanguage: e.target.value})}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                </select>
              ) : (
                <p className="text-slate-600 capitalize">{profileData.preferredLanguage}</p>
              )}
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Practice Reminders</span>
              </div>
              <button
                onClick={() => setProfileData({...profileData, practiceReminders: !profileData.practiceReminders})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  profileData.practiceReminders ? 'bg-blue-600' : 'bg-slate-300'
                }`}
                disabled={!isEditing}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    profileData.practiceReminders ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Focus Areas */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Mic className="w-4 h-4 inline mr-2" />
                Focus Areas
              </label>
              <div className="flex flex-wrap gap-2">
                {profileData.focusAreas.map((area, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Achievements</span>
          </h3>
          
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">{achievement.title}</h4>
                  <p className="text-sm text-slate-600">{achievement.description}</p>
                  <p className="text-xs text-slate-500 mt-1">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-slate-50 rounded-xl text-center">
            <p className="text-sm text-slate-600">Keep practicing to unlock more achievements!</p>
            <div className="flex items-center justify-center space-x-1 mt-2">
              <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
              <div className="w-6 h-2 bg-blue-500 rounded-full"></div>
              <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
              <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
              <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
            </div>
            <p className="text-xs text-slate-500 mt-1">2 of 6 achievements unlocked</p>
          </div>
        </div>
      </div>

      {/* Audio Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center space-x-2">
          <Volume2 className="w-5 h-5" />
          <span>Audio Settings</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Microphone Sensitivity</label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="75"
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Playback Volume</label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="85"
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Quiet</span>
              <span>Loud</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <div className="flex items-center space-x-2 text-blue-700 mb-2">
            <Mic className="w-4 h-4" />
            <span className="text-sm font-medium">Audio Test</span>
          </div>
          <p className="text-sm text-blue-600 mb-3">Test your microphone and audio settings</p>
          <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            Start Audio Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;