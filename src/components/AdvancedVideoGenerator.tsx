import React, { useState } from 'react';
import { Video, Sparkles, Loader2, Zap, Brain, Film, Settings, Download, Share2, RefreshCw } from 'lucide-react';

interface AdvancedVideoGeneratorProps {
  onVideoGenerated: (result: any) => void;
  onGenerationStart: () => void;
  isGenerating: boolean;
}

const AdvancedVideoGenerator: React.FC<AdvancedVideoGeneratorProps> = ({
  onVideoGenerated,
  onGenerationStart,
  isGenerating,
}) => {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(5);
  const [style, setStyle] = useState('realistic');
  const [resolution, setResolution] = useState('1080p');
  const [fps, setFps] = useState(24);
  const [selectedProvider, setSelectedProvider] = useState<'huggingface' | 'replicate' | 'pexels'>('huggingface');
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    onGenerationStart();
    setProgress(0);
    setStatusMessage('Initializing video generation...');

    try {
      let apiEndpoint = '';
      let requestBody: any = { prompt, duration, style, resolution };

      switch (selectedProvider) {
        case 'huggingface':
          apiEndpoint = '/api/generate-video-huggingface';
          requestBody.fps = fps;
          break;
        case 'replicate':
          apiEndpoint = '/api/generate-video-replicate';
          break;
        case 'pexels':
          apiEndpoint = '/api/generate-video-pexels';
          break;
      }

      // Update progress stages
      const stages = [
        { message: 'Analyzing your prompt...', progress: 10 },
        { message: 'Generating keyframes...', progress: 25 },
        { message: 'Creating video sequences...', progress: 50 },
        { message: 'Applying style and effects...', progress: 70 },
        { message: 'Enhancing quality...', progress: 85 },
        { message: 'Finalizing video...', progress: 95 },
      ];

      for (const stage of stages) {
        setStatusMessage(stage.message);
        setProgress(stage.progress);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      setStatusMessage(`Generating with ${selectedProvider === 'huggingface' ? 'zxc-bolt' : selectedProvider === 'replicate' ? 'zxc-zen' : 'zxc-flash'}...`);
      setProgress(95);

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate video');
      }

      setProgress(100);
      setStatusMessage('Video generated successfully!');
      
      onVideoGenerated({
        success: true,
        data: result.data,
        message: result.message,
        provider: result.provider,
        model: result.model,
        duration: result.duration,
        resolution: result.resolution,
        attribution: result.attribution
      });

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
          <Zap className="w-8 h-8 text-yellow-400 mr-3" />
          <h2 className="text-3xl font-bold text-white">zxc-nex Video Generator</h2>
        </div>
        <p className="text-blue-100">
          Generate videos using cutting-edge ZXC models: zxc-bolt, zxc-zen, or zxc-flash
        </p>
      </div>

      {/* Provider Selection */}
      <div className="mb-6">
        <label className="block text-white font-semibold mb-3">Select AI Provider</label>
        <div className="grid grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setSelectedProvider('huggingface')}
            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              selectedProvider === 'huggingface'
                ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/50 shadow-lg shadow-blue-500/25'
                : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
            }`}
          >
            <Brain className={`w-6 h-6 mx-auto mb-2 ${selectedProvider === 'huggingface' ? 'text-blue-400' : 'text-gray-400'}`} />
            <h3 className="font-semibold text-sm text-white">zxc-bolt</h3>
            <p className="text-xs text-gray-400 mt-1">Text-to-Video AI</p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedProvider('replicate')}
            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              selectedProvider === 'replicate'
                ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/50 shadow-lg shadow-green-500/25'
                : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
            }`}
          >
            <Film className={`w-6 h-6 mx-auto mb-2 ${selectedProvider === 'replicate' ? 'text-green-400' : 'text-gray-400'}`} />
            <h3 className="font-semibold text-sm text-white">zxc-zen</h3>
            <p className="text-xs text-gray-400 mt-1">Stable Video Diffusion</p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedProvider('pexels')}
            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              selectedProvider === 'pexels'
                ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/50 shadow-lg shadow-orange-500/25'
                : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
            }`}
          >
            <Video className={`w-6 h-6 mx-auto mb-2 ${selectedProvider === 'pexels' ? 'text-orange-400' : 'text-gray-400'}`} />
            <h3 className="font-semibold text-sm text-white">zxc-flash</h3>
            <p className="text-xs text-gray-400 mt-1">Real Video Library</p>
          </button>
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
        </div>

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

          {/* FPS (only for zxc-bolt) */}
          {selectedProvider === 'huggingface' && (
            <div>
              <label className="block text-white font-semibold mb-2">
                FPS
              </label>
              <select
                value={fps}
                onChange={(e) => setFps(parseInt(e.target.value))}
                className="w-full p-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                disabled={isGenerating}
              >
                <option value={24} className="bg-gray-800">24 FPS</option>
                <option value={30} className="bg-gray-800">30 FPS</option>
                <option value={60} className="bg-gray-800">60 FPS</option>
              </select>
            </div>
          )}
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
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
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
            className="btn-primary px-8 py-4 rounded-xl text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
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

export default AdvancedVideoGenerator;
