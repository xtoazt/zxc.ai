import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Sparkles } from 'lucide-react';

interface ImageUploadProps {
  onVideoGenerated: (result: any) => void;
  onGenerationStart: () => void;
  isGenerating: boolean;
  options: {
    baseModels: string[];
    motionOptions: string[];
    inferenceSteps: string[];
  };
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onVideoGenerated,
  onGenerationStart,
  isGenerating,
  options
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [baseModel, setBaseModel] = useState('Realistic');
  const [motion, setMotion] = useState('');
  const [inferenceSteps, setInferenceSteps] = useState('4-Step');
  const [videoLength, setVideoLength] = useState(2);
  const [generateLongVideo, setGenerateLongVideo] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageSelect(file);
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

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    if (!selectedImage) {
      alert('Please select an image');
      return;
    }

    onGenerationStart();

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageData = e.target?.result as string;
        
        const response = await fetch('/api/generate-video-with-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            baseModel,
            motion,
            inferenceSteps,
            imageData,
            videoLength,
            generateLongVideo
          }),
        });

        const result = await response.json();
        onVideoGenerated(result);
      };
      reader.readAsDataURL(selectedImage);
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
          <ImageIcon className="w-8 h-8 text-white mr-3" />
          <h2 className="text-3xl font-bold text-white">Image + Text to Video</h2>
        </div>
        <p className="text-blue-100">
          Upload an image and describe what you want to animate
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Area */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Upload Image
          </label>
          {!imagePreview ? (
            <div
              className={`upload-area ${isDragOver ? 'dragover' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-blue-300 mx-auto mb-4" />
              <p className="text-white text-lg font-semibold mb-2">
                Drop an image here or click to browse
              </p>
              <p className="text-blue-200 text-sm">
                Supports JPG, PNG, GIF (max 10MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isGenerating}
              />
            </div>
          ) : (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="preview-image mx-auto"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                disabled={isGenerating}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Prompt Input */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to animate in the image... (e.g., Focus: The person in the image (Animate: Walking through a forest))"
            className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
            rows={4}
            disabled={isGenerating}
          />
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
            disabled={isGenerating || !prompt.trim() || !selectedImage}
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

export default ImageUpload;
