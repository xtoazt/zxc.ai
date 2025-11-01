import React, { useState, useEffect } from 'react';
import { Video, Sparkles, Brain, Wand2, Loader2, CheckCircle } from 'lucide-react';
import { ShimmerButton } from './ui/shimmer-button';
import { MagicCard } from './ui/magic-card';
import { BorderBeam } from './ui/border-beam';

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
  const [baseModel, setBaseModel] = useState('zxc-1');
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
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">zxc-1 Video Generator</h2>
        <p className="text-gray-400 text-lg font-light">Create videos from text descriptions with professional quality</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Prompt Input */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-base font-medium text-gray-300">Prompt</label>
            <button
              type="button"
              onClick={enhancePrompt}
              disabled={isEnhancing || isGenerating || !prompt.trim()}
              className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 text-white text-sm rounded-lg transition-colors border border-gray-700"
            >
              {isEnhancing ? (
                <>
                  <Brain className="w-4 h-4 mr-2 animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Enhance
                </>
              )}
            </button>
          </div>
          <MagicCard className="rounded-xl" gradientFrom="#3B82F6" gradientTo="#8B5CF6">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Focus: Eiffel Tower (Animate: Clouds moving) (Shot from distance)"
              className="w-full p-5 bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none rounded-xl relative z-10"
              rows={5}
              disabled={isGenerating}
            />
          </MagicCard>
          {enhancedPrompt && enhancedPrompt !== prompt && (
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
              <p className="text-gray-300 text-sm flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
                <span>Enhanced: {enhancedPrompt}</span>
              </p>
            </div>
          )}
        </div>

        {/* Video Length Control */}
        <div>
          <label className="text-sm font-medium text-gray-300 mb-3 block">Duration</label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="2"
              max="20"
              value={videoLength}
              onChange={(e) => setVideoLength(parseInt(e.target.value))}
              className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              disabled={isGenerating}
            />
            <span className="text-white font-medium min-w-[40px] text-sm">
              {videoLength}s
            </span>
          </div>
          {videoLength > 2 && (
            <div className="mt-3">
              <label className="flex items-center text-gray-300">
                <input
                  type="checkbox"
                  checked={generateLongVideo}
                  onChange={(e) => setGenerateLongVideo(e.target.checked)}
                  className="mr-2 rounded border-gray-600 bg-gray-800"
                  disabled={isGenerating}
                />
                <span className="text-sm">
                  Smart prompting for {videoLength}s video
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Options Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Base Model */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Model</label>
            <select
              value={baseModel}
              onChange={(e) => setBaseModel(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-white rounded-lg"
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
            <label className="text-sm font-medium text-gray-300 mb-2 block">Motion</label>
            <select
              value={motion}
              onChange={(e) => setMotion(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-white rounded-lg"
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
            <label className="text-sm font-medium text-gray-300 mb-2 block">Steps</label>
            <select
              value={inferenceSteps}
              onChange={(e) => setInferenceSteps(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-white rounded-lg"
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
        <ShimmerButton
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          className="w-full font-semibold py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          background="rgba(59, 130, 246, 0.1)"
          shimmerColor="#ffffff"
          borderRadius="12px"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Video className="w-5 h-5 mr-3" />
              Generate Video
            </>
          )}
        </ShimmerButton>
      </form>
    </div>
  );
};

export default VideoGenerator;
