import React, { useState, useRef } from 'react';
import { Video, Upload, Download, Sparkles, Brain, Wand2, Camera, Play } from 'lucide-react';

interface TransitionVideoProps {
  onVideoGenerated: (result: any) => void;
  onGenerationStart: () => void;
  isGenerating: boolean;
  options: {
    baseModels: string[];
    motionOptions: string[];
    inferenceSteps: string[];
  };
}

const TransitionVideo: React.FC<TransitionVideoProps> = ({
  onVideoGenerated,
  onGenerationStart,
  isGenerating,
  options
}) => {
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [lastFrame, setLastFrame] = useState<string | null>(null);
  const [transitionPrompt, setTransitionPrompt] = useState('');
  const [baseModel, setBaseModel] = useState('Realistic');
  const [motion, setMotion] = useState('');
  const [inferenceSteps, setInferenceSteps] = useState('4-Step');
  const [videoLength, setVideoLength] = useState(2);
  const [generateLongVideo, setGenerateLongVideo] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoSelect = (file: File) => {
    if (file && file.type.startsWith('video/')) {
      setUploadedVideo(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      
      // Extract last frame when video loads
      const video = document.createElement('video');
      video.src = url;
      video.onloadedmetadata = () => {
        video.currentTime = video.duration - 0.1; // Get frame near the end
        video.onseeked = () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0);
            const lastFrameDataUrl = canvas.toDataURL('image/jpeg');
            setLastFrame(lastFrameDataUrl);
          }
        };
      };
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleVideoSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const enhancePrompt = async () => {
    if (!transitionPrompt.trim()) {
      alert('Please enter a transition prompt first');
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
          prompt: transitionPrompt,
          videoLength,
          hasImage: true,
          baseModel
        }),
      });

      const result = await response.json();
      if (result.success) {
        setEnhancedPrompt(result.enhancedPrompt);
        setTransitionPrompt(result.enhancedPrompt);
      }
    } catch (error) {
      console.error('Error enhancing prompt:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadedVideo || !transitionPrompt.trim()) {
      alert('Please upload a video and enter a transition prompt');
      return;
    }

    onGenerationStart();
    
    try {
      // Convert video to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const videoData = e.target?.result as string;
        
        const response = await fetch('/api/generate-transition-video', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: transitionPrompt,
            baseModel,
            motion,
            inferenceSteps,
            videoData,
            lastFrame,
            videoLength,
            generateLongVideo
          }),
        });

        const result = await response.json();
        onVideoGenerated(result);
      };
      reader.readAsDataURL(uploadedVideo);
    } catch (error) {
      console.error('Error generating transition video:', error);
      onVideoGenerated({ success: false, error: 'Failed to generate transition video' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Camera className="w-8 h-8 text-white mr-3" />
          <h2 className="text-3xl font-bold text-white">TikTok Transition</h2>
        </div>
        <p className="text-blue-100">
          Upload your video and create a smooth transition to a new environment
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Video Upload */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Upload Your Video
          </label>
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragOver
                ? 'border-blue-400 bg-blue-500/20'
                : 'border-white/30 hover:border-white/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {videoPreview ? (
              <div className="space-y-4">
                <video
                  ref={videoRef}
                  src={videoPreview}
                  controls
                  className="w-full max-w-md mx-auto rounded-lg"
                />
                <p className="text-green-200 text-sm">
                  ✅ Video uploaded successfully
                </p>
                {lastFrame && (
                  <div className="mt-4">
                    <p className="text-blue-200 text-sm mb-2">Last Frame Preview:</p>
                    <img
                      src={lastFrame}
                      alt="Last frame"
                      className="w-32 h-24 object-cover rounded-lg mx-auto"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-12 h-12 text-white/50 mx-auto" />
                <div>
                  <p className="text-white font-semibold mb-2">
                    Drop your video here or click to browse
                  </p>
                  <p className="text-blue-200 text-sm">
                    Supports MP4, MOV, AVI files
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Choose Video
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleVideoSelect(file);
              }}
              className="hidden"
            />
          </div>
        </div>

        {/* Transition Prompt */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-white font-semibold">
              Transition Prompt
            </label>
            <button
              type="button"
              onClick={enhancePrompt}
              disabled={isEnhancing || isGenerating || !transitionPrompt.trim()}
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
            value={transitionPrompt}
            onChange={(e) => setTransitionPrompt(e.target.value)}
            placeholder="Focus: Forest scene (Animate: Camera moving forward) (Shot: Smooth transition from uploaded video)"
            className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
            rows={4}
            disabled={isGenerating}
          />
          {enhancedPrompt && enhancedPrompt !== transitionPrompt && (
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
            Transition Video Length
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
            <span>2s (Quick)</span>
            <span>20s (Extended)</span>
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
                  Generate {videoLength}s transition using smart prompting
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
                <option key={model} value={model}>
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
              <option value="">No specific motion</option>
              {options.motionOptions.map((motionOption) => (
                <option key={motionOption} value={motionOption}>
                  {motionOption}
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
              {options.inferenceSteps.map((steps) => (
                <option key={steps} value={steps}>
                  {steps}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={isGenerating || !uploadedVideo || !transitionPrompt.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center"
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-6 h-6 mr-3 animate-spin" />
              Creating Transition Video...
            </>
          ) : (
            <>
              <Play className="w-6 h-6 mr-3" />
              Generate Transition Video
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TransitionVideo;
