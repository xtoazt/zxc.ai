import React, { useState, useEffect } from 'react';
import { VideoCamera, Upload, Download, Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react';
import VideoGenerator from './components/VideoGenerator';
import ImageUpload from './components/ImageUpload';
import VideoDisplay from './components/VideoDisplay';
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
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const [videoResult, setVideoResult] = useState<VideoResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [options, setOptions] = useState<Options>({
    baseModels: ['Realistic'],
    motionOptions: [''],
    inferenceSteps: ['4-Step']
  });

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

  const handleGenerationStart = () => {
    setIsGenerating(true);
    setVideoResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <VideoCamera className="w-12 h-12 text-white mr-3 animate-float" />
            <h1 className="text-5xl font-bold text-white">
              Instant⚡ <span className="gradient-text">Video Generator</span>
            </h1>
          </div>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Create stunning AI-generated videos from text prompts and images using the latest Instant Video technology
          </p>
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
              />
            ) : (
              <ImageUpload
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
            Example Prompts
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Focus: Eiffel Tower (Animate: Clouds moving)",
              "Focus: Trees In forest (Animate: Lion running)",
              "Focus: Astronaut in Space",
              "Focus: Group of Birds in sky (Animate: Birds Moving) (Shot From distance)",
              "Focus: Statue of liberty (Shot from Drone) (Animate: Drone coming toward statue)",
              "Focus: Panda in Forest (Animate: Drinking Tea)"
            ].map((example, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-4 hover:bg-white/20 transition-all duration-300 cursor-pointer"
                onClick={() => {
                  // You could implement auto-fill functionality here
                  console.log('Example clicked:', example);
                }}
              >
                <p className="text-white text-sm font-medium">{example}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
