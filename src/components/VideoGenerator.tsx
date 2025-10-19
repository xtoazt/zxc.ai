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
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white mb-2">Text to Video</h2>
        <p className="text-gray-400">Create videos from text descriptions</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Prompt Input */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-300">Prompt</label>
            <button
              type="button"
              onClick={enhancePrompt}
              disabled={isEnhancing || isGenerating || !prompt.trim()}
              className="flex items-center px-3 py-1 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 text-white text-xs rounded-md transition-colors border border-gray-700"
            >
              {isEnhancing ? (
                <>
                  <Brain className="w-3 h-3 mr-1 animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <Wand2 className="w-3 h-3 mr-1" />
                  Enhance
                </>
              )}
            </button>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Focus: Eiffel Tower (Animate: Clouds moving) (Shot from distance)"
            className="w-full p-4 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none rounded-lg"
            rows={4}
            disabled={isGenerating}
          />
          {enhancedPrompt && enhancedPrompt !== prompt && (
            <div className="mt-3 p-3 bg-gray-800 border border-gray-700 rounded-lg">
              <p className="text-gray-300 text-sm">
                <CheckCircle className="w-4 h-4 inline mr-2 text-green-500" />
                Enhanced: {enhancedPrompt}
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
        <button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          className="w-full bg-white hover:bg-gray-100 disabled:bg-gray-800 disabled:text-gray-500 text-black font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Video className="w-5 h-5 mr-2" />
              Generate Video
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default VideoGenerator;
