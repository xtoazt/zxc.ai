import React, { useState, useEffect } from 'react';
import { Video, Upload, Download, Sparkles, Image as ImageIcon, Loader2, Brain, Wand2, Camera, MessageCircle, Zap, Infinity, Clock, CheckCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-black text-white">
      {/* Minimal Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                <Video className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-medium">zxc.ai</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Free</span>
              </div>
              <div className="flex items-center space-x-2">
                <Infinity className="w-4 h-4 text-blue-500" />
                <span>Unlimited</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-purple-500" />
                <span>20s Videos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Minimal Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-1 bg-gray-900 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('text')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center ${
                activeTab === 'text'
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Text
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center ${
                activeTab === 'image'
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Image
            </button>
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center ${
                activeTab === 'suggestions'
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Brain className="w-4 h-4 mr-2" />
              Ideas
            </button>
            <button
              onClick={() => setActiveTab('transition')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center ${
                activeTab === 'transition'
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Camera className="w-4 h-4 mr-2" />
              Transition
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
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

      </div>

      {/* AI Chat Widget */}
      <AIChatWidget onSuggestionSelect={handleSuggestionSelect} />
    </div>
  );
};

export default App;