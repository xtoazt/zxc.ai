import React, { useState, useEffect } from 'react';
import { Video, Upload, Download, Sparkles, Image as ImageIcon, Loader2, Brain, Wand2, Camera } from 'lucide-react';
import VideoGenerator from './components/VideoGenerator';
import ImageUpload from './components/ImageUpload';
import VideoDisplay from './components/VideoDisplay';
import AISuggestions from './components/AISuggestions';
import TransitionVideo from './components/TransitionVideo';
import AIChatWidget from './components/AIChatWidget';
import './App.css';

interface VideoResult {
  success: boolean;
  data: any;
  message: string;
}

interface Options {
  baseModels: string[];
  motionOptions: string[];
  inferenceSteps: string[];
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'suggestions' | 'transition'>('text');
  const [videoResult, setVideoResult] = useState<VideoResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [options, setOptions] = useState<Options>({
    baseModels: ['Realistic'],
    motionOptions: [''],
    inferenceSteps: ['4-Step']
  });
  const [selectedPrompt, setSelectedPrompt] = useState('');

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const response = await fetch('/api/options');
      const data = await response.json();
      setOptions(data);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  const handleVideoGenerated = (result: VideoResult) => {
    setVideoResult(result);
    setIsGenerating(false);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setSelectedPrompt(suggestion);
    setActiveTab('text');
  };

  const handleGenerationStart = () => {
    setIsGenerating(true);
    setVideoResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800">
      {/* Free Banner */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 text-center">
        <div className="container mx-auto flex items-center justify-center space-x-2">
          <span className="text-lg font-bold">🆓 100% FREE & UNLIMITED</span>
          <span className="text-sm">•</span>
          <span className="text-sm">No signup required</span>
          <span className="text-sm">•</span>
          <span className="text-sm">20-second videos</span>
          <span className="text-sm">•</span>
          <span className="text-sm">AI-powered</span>
        </div>
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Video className="w-12 h-12 text-white mr-3 animate-float" />
            <h1 className="text-5xl font-bold text-white">
              <span className="gradient-text">zxc.ai</span>
            </h1>
          </div>
          <p className="text-xl text-blue-100 max-w-4xl mx-auto">
            🚀 <strong>100% FREE & UNLIMITED</strong> AI Video Generation Platform - Create viral 20-second videos from text, images, and TikTok-style transitions
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <span className="bg-green-500/20 text-green-200 px-4 py-2 rounded-full text-sm font-semibold">🆓 FREE & UNLIMITED</span>
            <span className="bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm">✨ AI Enhancement</span>
            <span className="bg-blue-500/20 text-blue-200 px-3 py-1 rounded-full text-sm">🎬 TikTok Transitions</span>
            <span className="bg-green-500/20 text-green-200 px-3 py-1 rounded-full text-sm">🔗 20-Second Videos</span>
            <span className="bg-yellow-500/20 text-yellow-200 px-3 py-1 rounded-full text-sm">🧠 AI Chat Assistant</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 flex">
            <button
              onClick={() => setActiveTab('text')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                activeTab === 'text'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Text to Video
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                activeTab === 'image'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <ImageIcon className="w-5 h-5 mr-2" />
              Image + Text to Video
            </button>
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                activeTab === 'suggestions'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <Brain className="w-5 h-5 mr-2" />
              AI Suggestions
            </button>
            <button
              onClick={() => setActiveTab('transition')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                activeTab === 'transition'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <Camera className="w-5 h-5 mr-2" />
              TikTok Transition
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
            {activeTab === 'text' ? (
              <VideoGenerator
                onVideoGenerated={handleVideoGenerated}
                onGenerationStart={handleGenerationStart}
                isGenerating={isGenerating}
                options={options}
                initialPrompt={selectedPrompt}
              />
            ) : activeTab === 'image' ? (
              <ImageUpload
                onVideoGenerated={handleVideoGenerated}
                onGenerationStart={handleGenerationStart}
                isGenerating={isGenerating}
                options={options}
              />
            ) : activeTab === 'suggestions' ? (
              <AISuggestions onSuggestionSelect={handleSuggestionSelect} />
            ) : (
              <TransitionVideo
                onVideoGenerated={handleVideoGenerated}
                onGenerationStart={handleGenerationStart}
                isGenerating={isGenerating}
                options={options}
              />
            )}

            {/* Video Display */}
            {videoResult && (
              <div className="mt-8">
                <VideoDisplay result={videoResult} />
              </div>
            )}

            {/* Loading State */}
            {isGenerating && (
              <div className="mt-8 text-center">
                <div className="inline-flex items-center justify-center p-6 bg-white/10 backdrop-blur-lg rounded-2xl">
                  <Loader2 className="w-8 h-8 text-white animate-spin mr-3" />
                  <span className="text-white text-lg font-semibold">
                    Generating your amazing video...
                  </span>
                </div>
                <p className="text-blue-100 mt-4">
                  This may take a few minutes. Please don't close this page.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Examples Section */}
        <div className="mt-12 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            🚀 Viral Video Examples (100% FREE & UNLIMITED)
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Focus: Person doing viral dance (Animate: Smooth transition to different locations) (Shot: Multiple angles)",
              "Focus: Food preparation (Animate: Time-lapse cooking) (Shot: Close-up to wide)",
              "Focus: Nature transformation (Animate: Season change) (Season: Summer to Winter)",
              "Focus: City skyline (Animate: Day to night transition) (Shot from drone)",
              "Focus: Person jumping (Animate: Slow motion leap) (Shot: Low angle)",
              "Focus: Ocean waves (Animate: Crashing dramatically) (Shot: Close-up)"
            ].map((example, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-4 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                onClick={() => {
                  setSelectedPrompt(example);
                  setActiveTab('text');
                }}
              >
                <div className="flex items-start justify-between">
                  <p className="text-white text-sm font-medium group-hover:text-purple-200 transition-colors">{example}</p>
                  <span className="text-green-400 text-xs font-bold">FREE</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Viral Tips */}
          <div className="mt-8 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl p-6 border border-white/20">
            <h4 className="text-white font-bold text-lg mb-4 text-center">🔥 Viral Video Tips (100% FREE on zxc.ai)</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p className="text-blue-200">• <strong>Hook in first 3 seconds</strong> - Start with action</p>
                <p className="text-blue-200">• <strong>Use trending sounds</strong> - Match popular audio</p>
                <p className="text-blue-200">• <strong>Create transitions</strong> - Smooth scene changes</p>
              </div>
              <div className="space-y-2">
                <p className="text-blue-200">• <strong>Tell a story</strong> - Beginning, middle, end</p>
                <p className="text-blue-200">• <strong>Keep it short</strong> - 15-20 seconds max</p>
                <p className="text-blue-200">• <strong>Use AI Enhancement</strong> - Better prompts = better videos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Widget */}
      <AIChatWidget onSuggestionSelect={handleSuggestionSelect} />
    </div>
  );
};

export default App;