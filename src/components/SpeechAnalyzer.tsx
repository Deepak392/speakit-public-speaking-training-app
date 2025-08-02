import React, { useState, useRef, useEffect } from 'react';
import { apiService } from '../services/api';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  Upload,
  Volume2,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Clock
} from 'lucide-react';

const SpeechAnalyzer: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const recordingInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isRecording) {
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
        // Simulate live waveform data
        setWaveformData(prev => [...prev.slice(-50), Math.random() * 100]);
      }, 100);
    } else {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    }

    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        setAudioChunks([]);
        await analyzeRecording(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      recorder.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
      return;
    }
    
    setIsRecording(true);
    setRecordingTime(0);
    setWaveformData([]);
    setShowAnalysis(false);
    setAnalysisResults(null);
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
    setIsRecording(false);
    setIsAnalyzing(true);
  };

  const analyzeRecording = async (audioBlob: Blob) => {
    try {
      setIsAnalyzing(true);
      const result = await apiService.analyzeSpeech(audioBlob);
      setAnalysisResults(result.analysis);
      setHasRecording(true);
      setShowAnalysis(true);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Speech analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Show loading state during analysis
  if (isAnalyzing) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Analyzing Your Speech</h2>
          <p className="text-slate-600">Please wait while our AI analyzes your recording...</p>
        </div>
        
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-slate-600">Analyzing speech patterns, pace, clarity, and providing personalized feedback...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Speech Analysis</h2>
        <p className="text-slate-600">Record your speech and get AI-powered feedback</p>
      </div>

      {/* Recording Interface */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
        <div className="text-center space-y-6">
          {/* Waveform Visualization */}
          <div className="h-32 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden">
            {isRecording || hasRecording ? (
              <div className="flex items-end space-x-1 h-24">
                {waveformData.map((height, index) => (
                  <div
                    key={index}
                    className={`w-1 bg-gradient-to-t transition-all duration-150 ${
                      isRecording 
                        ? 'from-red-400 to-red-600' 
                        : isPlaying 
                        ? 'from-blue-400 to-blue-600'
                        : 'from-slate-300 to-slate-400'
                    }`}
                    style={{ height: `${Math.max(height * 0.8, 8)}px` }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-slate-400">
                <Volume2 size={32} />
                <p className="mt-2 text-sm">Audio waveform will appear here</p>
              </div>
            )}
          </div>

          {/* Recording Controls */}
          <div className="flex items-center justify-center space-x-4">
            {!isRecording && !hasRecording && (
              <button
                onClick={startRecording}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-medium transition-colors"
              >
                <Mic size={20} />
                <span>Start Recording</span>
              </button>
            )}

            {isRecording && (
              <>
                <div className="flex items-center space-x-2 text-red-600">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                  <span className="font-mono text-lg">{formatTime(Math.floor(recordingTime / 10))}</span>
                </div>
                <button
                  onClick={stopRecording}
                  className="flex items-center space-x-2 bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  <Square size={16} />
                  <span>Stop</span>
                </button>
              </>
            )}

            {hasRecording && !isRecording && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={togglePlayback}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
                <button
                  onClick={startRecording}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  <Mic size={16} />
                  <span>Record Again</span>
                </button>
              </div>
            )}
          </div>

          {/* Upload Option */}
          <div className="border-t border-slate-200 pt-6">
            <p className="text-slate-500 mb-4">Or upload an audio file</p>
            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
              <Upload size={16} />
              <span>Choose File</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      {showAnalysis && analysisResults && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Analysis Complete</h3>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{Math.round(analysisResults.overallScore)}</span>
                </div>
                <div className="text-left">
                  <p className="text-lg font-semibold text-slate-900">Overall Score</p>
                  <p className="text-slate-600">Great job! Keep practicing to improve further.</p>
                </div>
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Speaking Pace</span>
                  </div>
                  <span className="text-lg font-bold text-slate-900">{Math.round(analysisResults.pace.score)}%</span>
                </div>
                <p className="text-sm text-slate-600 ml-8">{analysisResults.pace.feedback}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Clarity</span>
                  </div>
                  <span className="text-lg font-bold text-slate-900">{Math.round(analysisResults.clarity.score)}%</span>
                </div>
                <p className="text-sm text-slate-600 ml-8">{analysisResults.clarity.feedback}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <span className="font-medium">Filler Words</span>
                  </div>
                  <span className="text-lg font-bold text-slate-900">{Math.round(analysisResults.fillerWords.score)}%</span>
                </div>
                <p className="text-sm text-slate-600 ml-8">{analysisResults.fillerWords.feedback}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Volume2 className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">Volume</span>
                  </div>
                  <span className="text-lg font-bold text-slate-900">{Math.round(analysisResults.volume.score)}%</span>
                </div>
                <p className="text-sm text-slate-600 ml-8">{analysisResults.volume.feedback}</p>
              </div>
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Personalized Suggestions</span>
            </h3>
            <div className="space-y-3">
              {(analysisResults.suggestions || []).map((suggestion: string, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-slate-700">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeechAnalyzer;