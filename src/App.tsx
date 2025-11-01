import React, { useState, useEffect } from 'react';
import { Video, Upload, Download, Sparkles, Image as ImageIcon, Loader2, Brain, Wand2, Camera, MessageCircle, Zap, Infinity, Clock, CheckCircle, Rocket, Code } from 'lucide-react';
import VideoGenerator from './components/VideoGenerator';
import ImageUpload from './components/ImageUpload';
import VideoDisplay from './components/VideoDisplay';
import AISuggestions from './components/AISuggestions';
import TransitionVideo from './components/TransitionVideo';
import HFSpace from './components/HFSpace';
import ImageGenerator from './components/ImageGenerator';
import Sora2Video from './components/Sora2Video';
import ZeroScopeVideo from './components/ZeroScopeVideo';
import CogVideoXVideo from './components/CogVideoXVideo';
import WANTransitionVideo from './components/WANTransitionVideo';
import AdvancedVideoGenerator from './components/AdvancedVideoGenerator';
import GeminiVideoGenerator from './components/GeminiVideoGenerator';
import LLMOptions from './components/LLMOptions';
import AIChatWidget from './components/AIChatWidget';
import DeveloperSection from './components/DeveloperSection';
import { MagicCard } from './components/ui/magic-card';
import { BorderBeam } from './components/ui/border-beam';
import { AnimatedGradientText } from './components/ui/animated-gradient-text';
import { GridPattern } from './components/ui/grid-pattern';
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
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'suggestions' | 'transition' | 'hfspace' | 'imagegen' | 'sora2' | 'zeroscope' | 'cogvideox' | 'wan-transition' | 'advanced' | 'gemini'>('text');
  const [videoResult, setVideoResult] = useState<VideoResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [options, setOptions] = useState<Options>({
    baseModels: ['zxc-1'],
    motionOptions: [''],
    inferenceSteps: ['4-Step']
  });
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [selectedLLM, setSelectedLLM] = useState('chatglm'); // Default to ChatGLM

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Grid Pattern Background */}
      <GridPattern
        squares={[
          [4, 4],
          [5, 1],
          [8, 3],
          [2, 6],
        ]}
        className="[mask-image:linear-gradient(to_bottom,white,transparent)] opacity-40"
      />
      
      {/* Enhanced Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="relative border-b border-gray-800/50 backdrop-blur-sm">
          <div className="max-w-8xl mx-auto px-8 py-16">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <Video className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full animate-pulse border-2 border-gray-900"></div>
                </div>
                <div>
                  <AnimatedGradientText className="text-5xl font-extrabold tracking-tight">
                    zxc.ai
                  </AnimatedGradientText>
                  <p className="text-base text-gray-300 mt-3 font-medium tracking-wide">The Media Generations of the Future.</p>
                </div>
              </div>
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3 bg-green-500/20 border border-green-500/50 rounded-full px-6 py-3 backdrop-blur-sm">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-300 font-semibold text-sm">Free</span>
                </div>
                <div className="flex items-center space-x-3 bg-blue-500/20 border border-blue-500/50 rounded-full px-6 py-3 backdrop-blur-sm">
                  <Infinity className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300 font-semibold text-sm">Unlimited</span>
                </div>
                <div className="flex items-center space-x-3 bg-purple-500/20 border border-purple-500/50 rounded-full px-6 py-3 backdrop-blur-sm">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-300 font-semibold text-sm">20s Videos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-8 py-24">

        {/* Enhanced Tab Navigation */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <AnimatedGradientText className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
              Choose Your Generation Method
            </AnimatedGradientText>
            <p className="text-gray-400 text-xl font-light">Select from our comprehensive suite of 15+ AI models</p>
            <div className="mt-6 flex items-center justify-center space-x-6">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent w-40"></div>
              <Sparkles className="w-6 h-6 text-purple-400" />
              <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent w-40"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 max-w-7xl mx-auto">
            <MagicCard
              className={`relative rounded-2xl overflow-hidden ${
                activeTab === 'advanced' ? 'ring-2 ring-yellow-500/50' : ''
              }`}
              gradientFrom="#FFD700"
              gradientTo="#FF6B35"
            >
              <button
                onClick={() => setActiveTab('advanced')}
                className={`group relative w-full p-8 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center space-y-4 ${
                  activeTab === 'advanced'
                    ? 'bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20 border-yellow-500/50 shadow-lg shadow-yellow-500/25'
                    : 'bg-gray-800/50 border-gray-700 hover:border-yellow-500/50 hover:bg-gray-800/70'
                }`}
              >
                {activeTab === 'advanced' && <BorderBeam size={150} duration={12} colorFrom="#FFD700" colorTo="#FF6B35" />}
                <div className={`p-4 rounded-xl ${activeTab === 'advanced' ? 'bg-yellow-500/20' : 'bg-gray-700/50 group-hover:bg-yellow-500/10'}`}>
                  <Rocket className={`w-7 h-7 ${activeTab === 'advanced' ? 'text-yellow-400' : 'text-gray-400 group-hover:text-yellow-400'}`} />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-base text-white">zxc-nex</h3>
                  <p className="text-xs text-gray-400 mt-2">Multi-Provider</p>
                  <span className="inline-block mt-2 px-2 py-0.5 text-xs bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full border border-yellow-500/30">NEW</span>
                </div>
              </button>
            </MagicCard>

            <button
              onClick={() => setActiveTab('gemini')}
              className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center space-y-3 ${
                activeTab === 'gemini'
                  ? 'bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-rose-500/20 border-purple-500/50 shadow-lg shadow-purple-500/25 ring-2 ring-purple-500/30'
                  : 'bg-gray-800/50 border-gray-700 hover:border-purple-500/50 hover:bg-gray-800/70'
              }`}
            >
              <div className={`p-3 rounded-xl ${activeTab === 'gemini' ? 'bg-purple-500/20' : 'bg-gray-700/50 group-hover:bg-purple-500/10'}`}>
                <Wand2 className={`w-6 h-6 ${activeTab === 'gemini' ? 'text-purple-400' : 'text-gray-400 group-hover:text-purple-400'}`} />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-sm text-white">zxc-moon</h3>
                <p className="text-xs text-gray-400 mt-1">Prompt Enhancement</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30">NEW</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('text')}
              className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center space-y-3 ${
                activeTab === 'text'
                  ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/50 shadow-lg shadow-blue-500/25'
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800/70'
              }`}
            >
              <div className={`p-3 rounded-xl ${activeTab === 'text' ? 'bg-blue-500/20' : 'bg-gray-700/50 group-hover:bg-gray-600/50'}`}>
                <Sparkles className={`w-6 h-6 ${activeTab === 'text' ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'}`} />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-sm text-white">zxc-1</h3>
                <p className="text-xs text-gray-400 mt-1">Instant Video</p>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('sora2')}
              className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center space-y-3 ${
                activeTab === 'sora2'
                  ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50 shadow-lg shadow-yellow-500/25'
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800/70'
              }`}
            >
              <div className={`p-3 rounded-xl ${activeTab === 'sora2' ? 'bg-yellow-500/20' : 'bg-gray-700/50 group-hover:bg-gray-600/50'}`}>
                <Video className={`w-6 h-6 ${activeTab === 'sora2' ? 'text-yellow-400' : 'text-gray-400 group-hover:text-white'}`} />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-sm text-white">zxc-star</h3>
                <p className="text-xs text-gray-400 mt-1">Premium Model</p>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('zeroscope')}
              className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center space-y-3 ${
                activeTab === 'zeroscope'
                  ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/50 shadow-lg shadow-blue-500/25'
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800/70'
              }`}
            >
              <div className={`p-3 rounded-xl ${activeTab === 'zeroscope' ? 'bg-blue-500/20' : 'bg-gray-700/50 group-hover:bg-gray-600/50'}`}>
                <Video className={`w-6 h-6 ${activeTab === 'zeroscope' ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'}`} />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-sm text-white">zxc-pear</h3>
                <p className="text-xs text-gray-400 mt-1">Fast Generation</p>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('cogvideox')}
              className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center space-y-3 ${
                activeTab === 'cogvideox'
                  ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/50 shadow-lg shadow-purple-500/25'
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800/70'
              }`}
            >
              <div className={`p-3 rounded-xl ${activeTab === 'cogvideox' ? 'bg-purple-500/20' : 'bg-gray-700/50 group-hover:bg-gray-600/50'}`}>
                <Video className={`w-6 h-6 ${activeTab === 'cogvideox' ? 'text-purple-400' : 'text-gray-400 group-hover:text-white'}`} />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-sm text-white">zxc-turtle</h3>
                <p className="text-xs text-gray-400 mt-1">High Quality</p>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('image')}
              className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center space-y-3 ${
                activeTab === 'image'
                  ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/50 shadow-lg shadow-green-500/25'
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800/70'
              }`}
            >
              <div className={`p-3 rounded-xl ${activeTab === 'image' ? 'bg-green-500/20' : 'bg-gray-700/50 group-hover:bg-gray-600/50'}`}>
                <ImageIcon className={`w-6 h-6 ${activeTab === 'image' ? 'text-green-400' : 'text-gray-400 group-hover:text-white'}`} />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-sm text-white">zxc-pear5</h3>
                <p className="text-xs text-gray-400 mt-1">Image to Video</p>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('imagegen')}
              className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center space-y-3 ${
                activeTab === 'imagegen'
                  ? 'bg-gradient-to-br from-pink-500/20 to-rose-500/20 border-pink-500/50 shadow-lg shadow-pink-500/25'
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800/70'
              }`}
            >
              <div className={`p-3 rounded-xl ${activeTab === 'imagegen' ? 'bg-pink-500/20' : 'bg-gray-700/50 group-hover:bg-gray-600/50'}`}>
                <ImageIcon className={`w-6 h-6 ${activeTab === 'imagegen' ? 'text-pink-400' : 'text-gray-400 group-hover:text-white'}`} />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-sm text-white">zxc-cloud</h3>
                <p className="text-xs text-gray-400 mt-1">Image Generator</p>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('hfspace')}
              className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center space-y-3 ${
                activeTab === 'hfspace'
                  ? 'bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border-indigo-500/50 shadow-lg shadow-indigo-500/25'
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800/70'
              }`}
            >
              <div className={`p-3 rounded-xl ${activeTab === 'hfspace' ? 'bg-indigo-500/20' : 'bg-gray-700/50 group-hover:bg-gray-600/50'}`}>
                <Video className={`w-6 h-6 ${activeTab === 'hfspace' ? 'text-indigo-400' : 'text-gray-400 group-hover:text-white'}`} />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-sm text-white">zxc-vox</h3>
                <p className="text-xs text-gray-400 mt-1">Embedded Space</p>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('suggestions')}
              className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center space-y-3 ${
                activeTab === 'suggestions'
                  ? 'bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border-cyan-500/50 shadow-lg shadow-cyan-500/25'
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800/70'
              }`}
            >
              <div className={`p-3 rounded-xl ${activeTab === 'suggestions' ? 'bg-cyan-500/20' : 'bg-gray-700/50 group-hover:bg-gray-600/50'}`}>
                <Brain className={`w-6 h-6 ${activeTab === 'suggestions' ? 'text-cyan-400' : 'text-gray-400 group-hover:text-white'}`} />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-sm text-white">zxc-sun</h3>
                <p className="text-xs text-gray-400 mt-1">AI Suggestions</p>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('transition')}
              className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center space-y-3 ${
                activeTab === 'transition'
                  ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/50 shadow-lg shadow-orange-500/25'
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800/70'
              }`}
            >
              <div className={`p-3 rounded-xl ${activeTab === 'transition' ? 'bg-orange-500/20' : 'bg-gray-700/50 group-hover:bg-gray-600/50'}`}>
                <Camera className={`w-6 h-6 ${activeTab === 'transition' ? 'text-orange-400' : 'text-gray-400 group-hover:text-white'}`} />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-sm text-white">zxc-flash</h3>
                <p className="text-xs text-gray-400 mt-1">TikTok Style</p>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('wan-transition')}
              className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center space-y-3 ${
                activeTab === 'wan-transition'
                  ? 'bg-gradient-to-br from-violet-500/20 to-purple-500/20 border-violet-500/50 shadow-lg shadow-violet-500/25'
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800/70'
              }`}
            >
              <div className={`p-3 rounded-xl ${activeTab === 'wan-transition' ? 'bg-violet-500/20' : 'bg-gray-700/50 group-hover:bg-gray-600/50'}`}>
                <Video className={`w-6 h-6 ${activeTab === 'wan-transition' ? 'text-violet-400' : 'text-gray-400 group-hover:text-white'}`} />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-sm text-white">zxc-wave</h3>
                <p className="text-xs text-gray-400 mt-1">Frame-to-Frame</p>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('developer')}
              className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center space-y-3 ${
                activeTab === 'developer'
                  ? 'bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-teal-500/20 border-blue-500/50 shadow-lg shadow-blue-500/25 ring-2 ring-blue-500/30'
                  : 'bg-gray-800/50 border-gray-700 hover:border-blue-500/50 hover:bg-gray-800/70'
              }`}
            >
              <div className={`p-3 rounded-xl ${activeTab === 'developer' ? 'bg-blue-500/20' : 'bg-gray-700/50 group-hover:bg-blue-500/10'}`}>
                <Code className={`w-6 h-6 ${activeTab === 'developer' ? 'text-blue-400' : 'text-gray-400 group-hover:text-blue-400'}`} />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-sm text-white">Developer</h3>
                <p className="text-xs text-gray-400 mt-1">API & Docs</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full border border-blue-500/30">NEW</span>
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced LLM Selection - Only show for non-developer tabs */}
        {activeTab !== 'developer' && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-white mb-3">Choose Your AI Assistant</h3>
              <p className="text-gray-400 font-light">Select the AI model for text generation and suggestions</p>
            </div>
            <div className="flex justify-center">
              <LLMOptions 
                onLLMSelect={setSelectedLLM}
                selectedLLM={selectedLLM}
              />
            </div>
          </div>
        )}

        {/* Enhanced Main Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab !== 'developer' ? (
            <MagicCard className="relative rounded-3xl overflow-hidden" gradientFrom="#3B82F6" gradientTo="#8B5CF6">
              <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl border border-gray-700/50 p-16 shadow-2xl relative">
                <BorderBeam size={250} duration={12} />
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
            ) : activeTab === 'hfspace' ? (
              <HFSpace />
            ) : activeTab === 'imagegen' ? (
              <ImageGenerator
                onImageGenerated={handleVideoGenerated}
                onGenerationStart={handleGenerationStart}
                isGenerating={isGenerating}
              />
            ) : activeTab === 'sora2' ? (
              <Sora2Video />
            ) : activeTab === 'zeroscope' ? (
              <ZeroScopeVideo />
            ) : activeTab === 'cogvideox' ? (
              <CogVideoXVideo />
            ) : activeTab === 'wan-transition' ? (
              <WANTransitionVideo />
            ) : activeTab === 'advanced' ? (
              <AdvancedVideoGenerator
                onVideoGenerated={handleVideoGenerated}
                onGenerationStart={handleGenerationStart}
                isGenerating={isGenerating}
              />
            ) : activeTab === 'gemini' ? (
              <GeminiVideoGenerator
                onVideoGenerated={handleVideoGenerated}
                onGenerationStart={handleGenerationStart}
                isGenerating={isGenerating}
              />
            ) : activeTab === 'developer' ? null : (
              <TransitionVideo
                onVideoGenerated={handleVideoGenerated}
                onGenerationStart={handleGenerationStart}
                isGenerating={isGenerating}
                options={options}
              />
            )}

            {/* Enhanced Video Display */}
            {videoResult && (
              <div className="mt-16">
                <MagicCard className="relative rounded-2xl overflow-hidden" gradientFrom="#10B981" gradientTo="#3B82F6">
                  <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-2xl p-8 relative">
                    <BorderBeam size={200} duration={10} colorFrom="#10B981" colorTo="#3B82F6" />
                    <div className="flex items-center mb-6">
                      <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse mr-4"></div>
                      <h3 className="text-xl font-semibold text-white">Generated Content</h3>
                    </div>
                    <VideoDisplay result={videoResult} />
                  </div>
                </MagicCard>
              </div>
            )}

            {/* Enhanced Loading State */}
            {isGenerating && (
              <div className="mt-16 text-center">
                <div className="inline-flex items-center justify-center p-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-3xl border border-blue-500/30">
                  <Loader2 className="w-12 h-12 text-blue-400 animate-spin mr-6" />
                  <div>
                    <span className="text-white font-semibold text-xl">Generating your amazing content...</span>
                    <p className="text-gray-400 mt-2">This may take a few moments. Please don't close this page.</p>
                  </div>
                </div>
              </div>
            )}
            </div>
          </MagicCard>
          ) : (
            <DeveloperSection />
          )}
        </div>

        {/* Enhanced Footer */}
        <div className="mt-32 border-t border-gray-800/50">
          <div className="max-w-8xl mx-auto px-8 py-16">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mr-3">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  zxc.ai
                </span>
              </div>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto text-lg">
                The Media Generations of the Future. Create stunning videos with multiple cutting-edge models, 
                all in one place. Free, unlimited, and always evolving.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-12">
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8 backdrop-blur-sm">
                  <Brain className="w-10 h-10 text-blue-400 mb-4 mx-auto" />
                  <h4 className="font-bold text-white mb-3 text-lg">15 ZXC Models</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">zxc-1, zxc-pear, zxc-star, zxc-turtle, zxc-nex, zxc-bolt, zxc-zen, zxc-flash, zxc-moon, zxc-cloud, zxc-vox, zxc-sun, zxc-flash-transition, zxc-wave, and more</p>
                </div>
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-8 backdrop-blur-sm">
                  <Zap className="w-10 h-10 text-green-400 mb-4 mx-auto" />
                  <h4 className="font-bold text-white mb-3 text-lg">Lightning Fast</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">Generate videos in seconds, not minutes. Optimized for speed and efficiency.</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8 backdrop-blur-sm">
                  <Video className="w-10 h-10 text-purple-400 mb-4 mx-auto" />
                  <h4 className="font-bold text-white mb-3 text-lg">4K Quality</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">Up to 4K resolution support with professional-grade output quality.</p>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-8 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Free Forever</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Infinity className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">Unlimited Usage</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-300">20-Second Videos</span>
                </div>
              </div>
              
              {/* Provider Information - Hidden at bottom */}
              <div className="mt-20 pt-8 border-t border-gray-800/30">
                <p className="text-xs text-gray-500 mb-4">Powered by:</p>
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600">
                  <span>zxc-star (Sora-2 via InoculateMedia)</span>
                  <span>•</span>
                  <span>zxc-pear (ZeroScope v2 via Hysts)</span>
                  <span>•</span>
                  <span>zxc-turtle (CogVideoX 2B via Zai-Org)</span>
                  <span>•</span>
                  <span>zxc-bolt (Hugging Face)</span>
                  <span>•</span>
                  <span>zxc-zen (Replicate)</span>
                  <span>•</span>
                  <span>zxc-flash (Pexels)</span>
                  <span>•</span>
                  <span>zxc-star (ChatGLM)</span>
                  <span>•</span>
                  <span>zxc-bolt (Mistral Small via LLM7)</span>
                  <span>•</span>
                  <span>zxc-nova (Mistral Large via LLM7)</span>
                  <span>•</span>
                  <span>zxc-zen (GPT-4 via LLM7)</span>
                  <span>•</span>
                  <span>zxc-ace (Claude via LLM7)</span>
                  <span>•</span>
                  <span>zxc-flash (Gemini via LLM7)</span>
                  <span>•</span>
                  <span>zxc-moon (Gemini Video via Google)</span>
                  <span>•</span>
                  <span>zxc-nex (Multi-Provider System)</span>
                </div>
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