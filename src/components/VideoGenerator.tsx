import React, { useState, useEffect } from 'react';
import { Video, Sparkles, Brain, Wand2 } from 'lucide-react';

interface VideoGeneratorProps {
  onVideoGenerated: (result: any) => void;
  onGenerationStart: () => void;
  isGenerating: boolean;
  options: {
    baseModels: string[];
    motionOptions: string[];
    inferenceSteps: string[];
  };
  initialPrompt?: string;
}

const VideoGenerator: React.FC<VideoGeneratorProps> = ({
  onVideoGenerated,
  onGenerationStart,
  isGenerating,
  options,
  initialPrompt = ''
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [baseModel, setBaseModel] = useState('Realistic');
  const [motion, setMotion] = useState('');
  const [inferenceSteps, setInferenceSteps] = useState('4-Step');
  const [videoLength, setVideoLength] = useState(2);
  const [generateLongVideo, setGenerateLongVideo] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState('');

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const enhancePrompt = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt first');
      return;
    }

    setIsEnhancing(true);
    try {
      const response = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          videoLength,
          hasImage: false,
          baseModel
        }),
      });

      const result = await response.json();
      if (result.success) {
        setEnhancedPrompt(result.enhancedPrompt);
        setPrompt(result.enhancedPrompt);
      }
    } catch (error) {
      console.error('Error enhancing prompt:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    onGenerationStart();

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          baseModel,
          motion,
          inferenceSteps,
          videoLength,
          generateLongVideo,
        }),
      });

      const result = await response.json();
      onVideoGenerated(result);
    } catch (error) {
      console.error('Error generating video:', error);
      onVideoGenerated({
        success: false,
        error: 'Failed to generate video. Please try again.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Video className="w-8 h-8 text-white mr-3" />
          <h2 className="text-3xl font-bold text-white">Text to Video</h2>
        </div>
        <p className="text-blue-100">
          Enter a detailed prompt to generate an amazing video
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Prompt Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-white font-semibold">
              Prompt
            </label>
            <button
              type="button"
              onClick={enhancePrompt}
              disabled={isEnhancing || isGenerating || !prompt.trim()}
              className="flex items-center px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white text-sm rounded-lg transition-colors"
            >
              {isEnhancing ? (
                <>
                  <Brain className="w-4 h-4 mr-1 animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-1" />
                  AI Enhance
                </>
              )}
            </button>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter text to generate video... (e.g., Focus: Eiffel Tower (Animate: Clouds moving))"
            className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
            rows={4}
            disabled={isGenerating}
          />
          {enhancedPrompt && enhancedPrompt !== prompt && (
            <div className="mt-2 p-2 bg-green-500/20 border border-green-500/50 rounded-lg">
              <p className="text-green-200 text-sm">
                ✨ AI Enhanced: {enhancedPrompt}
              </p>
            </div>
          )}
        </div>

        {/* Video Length Control */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Video Length
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="2"
              max="20"
              value={videoLength}
              onChange={(e) => setVideoLength(parseInt(e.target.value))}
              className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              disabled={isGenerating}
            />
            <span className="text-white font-semibold min-w-[60px]">
              {videoLength}s
            </span>
          </div>
          <div className="flex justify-between text-xs text-blue-200 mt-1">
            <span>2s (Fast)</span>
            <span>20s (Long)</span>
          </div>
          {videoLength > 2 && (
            <div className="mt-2">
              <label className="flex items-center text-white">
                <input
                  type="checkbox"
                  checked={generateLongVideo}
                  onChange={(e) => setGenerateLongVideo(e.target.checked)}
                  className="mr-2 rounded"
                  disabled={isGenerating}
                />
                <span className="text-sm">
                  Generate {videoLength}s video using smart prompting (takes longer)
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Options Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Base Model */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Base Model
            </label>
            <select
              value={baseModel}
              onChange={(e) => setBaseModel(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              disabled={isGenerating}
            >
              {options.baseModels.map((model) => (
                <option key={model} value={model} className="bg-gray-800">
                  {model}
                </option>
              ))}
            </select>
          </div>

          {/* Motion */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Motion
            </label>
            <select
              value={motion}
              onChange={(e) => setMotion(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              disabled={isGenerating}
            >
              {options.motionOptions.map((option) => (
                <option key={option} value={option} className="bg-gray-800">
                  {option || 'No Motion'}
                </option>
              ))}
            </select>
          </div>

          {/* Inference Steps */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Inference Steps
            </label>
            <select
              value={inferenceSteps}
              onChange={(e) => setInferenceSteps(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              disabled={isGenerating}
            >
              {options.inferenceSteps.map((step) => (
                <option key={step} value={step} className="bg-gray-800">
                  {step}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className="btn-primary px-8 py-4 rounded-xl text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-3" />
                Generate Video
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VideoGenerator;
