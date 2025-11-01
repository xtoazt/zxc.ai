import React, { useState } from 'react';
import { Sparkles, Loader2, Zap, Brain, Wand2, Video } from 'lucide-react';

interface GeminiVideoGeneratorProps {
  onVideoGenerated: (result: any) => void;
  onGenerationStart: () => void;
  isGenerating: boolean;
}

const GeminiVideoGenerator: React.FC<GeminiVideoGeneratorProps> = ({
  onVideoGenerated,
  onGenerationStart,
  isGenerating,
}) => {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(5);
  const [style, setStyle] = useState('realistic');
  const [resolution, setResolution] = useState('1080p');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    onGenerationStart();
    setProgress(0);
    setStatusMessage('Enhancing prompt with Gemini AI...');

    try {
      setProgress(25);
      setStatusMessage('Analyzing your prompt with Gemini...');

      const response = await fetch('/api/generate-video-gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, duration, style, resolution }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to enhance prompt');
      }

      setProgress(75);
      setStatusMessage('Generating video with enhanced prompt...');

      // Use the enhanced prompt with Hugging Face or Replicate
      const enhancedPromptText = result.data?.enhancedPrompt || prompt;
      setEnhancedPrompt(enhancedPromptText);

      // Try Hugging Face first with enhanced prompt
      setProgress(85);
      setStatusMessage('Generating video with Hugging Face...');

      try {
        const videoResponse = await fetch('/api/generate-video-huggingface', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            prompt: enhancedPromptText,
            duration, 
            style, 
            resolution,
            fps: 24
          }),
        });

        const videoResult = await videoResponse.json();

        if (videoResult.success) {
          setProgress(100);
          setStatusMessage('Video generated successfully!');
          
          onVideoGenerated({
            ...videoResult,
            geminiEnhanced: true,
            originalPrompt: prompt,
            enhancedPrompt: enhancedPromptText
          });
          return;
        }
      } catch (videoError) {
        console.log('Hugging Face failed, trying Replicate...');
      }

      // Fallback to Replicate
      setProgress(90);
      setStatusMessage('Trying Replicate with enhanced prompt...');

      const replicateResponse = await fetch('/api/generate-video-replicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: enhancedPromptText,
          duration, 
          style, 
          resolution
        }),
      });

      const replicateResult = await replicateResponse.json();

      if (replicateResult.success) {
        setProgress(100);
        setStatusMessage('Video generated successfully!');
        
        onVideoGenerated({
          ...replicateResult,
          geminiEnhanced: true,
          originalPrompt: prompt,
          enhancedPrompt: enhancedPromptText
        });
      } else {
        throw new Error('Video generation failed');
      }

    } catch (error: any) {
      console.error('Error generating video:', error);
      onVideoGenerated({
        success: false,
        error: error.message || 'Failed to generate video. Please try again.',
      });
    } finally {
      setTimeout(() => {
        setProgress(0);
        setStatusMessage('');
      }, 2000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Wand2 className="w-8 h-8 text-purple-400 mr-3" />
          <h2 className="text-3xl font-bold text-white">Gemini AI Video Generator</h2>
        </div>
        <p className="text-blue-100">
          Powered by Google Gemini AI - Enhanced prompt generation for better video results
        </p>
        <div className="mt-4 inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full px-4 py-2">
          <Brain className="w-5 h-5 text-purple-400" />
          <span className="text-purple-300 text-sm font-medium">Gemini Pro Enhanced</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Prompt Input */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Video Description
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the video you want to generate (e.g., A serene mountain landscape at sunset with flying birds)"
            className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
            rows={4}
            disabled={isGenerating}
          />
          <p className="text-gray-400 text-xs mt-2">
            💡 Gemini AI will enhance your prompt for better video generation results
          </p>
        </div>

        {/* Enhanced Prompt Display */}
        {enhancedPrompt && (
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Wand2 className="w-5 h-5 text-purple-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-2">Gemini Enhanced Prompt:</h4>
                <p className="text-gray-200 text-sm">{enhancedPrompt}</p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Duration */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Duration (seconds)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 5)}
              min="1"
              max="60"
              className="w-full p-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              disabled={isGenerating}
            />
          </div>

          {/* Style */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Style
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              disabled={isGenerating}
            >
              <option value="realistic" className="bg-gray-800">Realistic</option>
              <option value="cinematic" className="bg-gray-800">Cinematic</option>
              <option value="artistic" className="bg-gray-800">Artistic</option>
              <option value="abstract" className="bg-gray-800">Abstract</option>
              <option value="anime" className="bg-gray-800">Anime</option>
              <option value="cartoon" className="bg-gray-800">Cartoon</option>
            </select>
          </div>

          {/* Resolution */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Resolution
            </label>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              disabled={isGenerating}
            >
              <option value="720p" className="bg-gray-800">720p HD</option>
              <option value="1080p" className="bg-gray-800">1080p Full HD</option>
              <option value="4k" className="bg-gray-800">4K Ultra HD</option>
            </select>
          </div>
        </div>

        {/* Progress Bar */}
        {isGenerating && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white">{statusMessage}</span>
              <span className="text-gray-400">{progress}%</span>
            </div>
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Generate Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className="btn-primary px-8 py-4 rounded-xl text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-3" />
                Generate with Gemini AI
              </>
            )}
          </button>
        </div>
      </form>

      {/* Info Card */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-3 flex items-center">
          <Brain className="w-5 h-5 text-purple-400 mr-2" />
          How Gemini AI Enhancement Works
        </h3>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li className="flex items-start">
            <span className="text-purple-400 mr-2">1.</span>
            <span>Gemini AI analyzes your prompt and enhances it with detailed scene descriptions</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-400 mr-2">2.</span>
            <span>The enhanced prompt is then used with Hugging Face or Replicate for video generation</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-400 mr-2">3.</span>
            <span>Result: Better video quality and more accurate scene generation</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default GeminiVideoGenerator;
