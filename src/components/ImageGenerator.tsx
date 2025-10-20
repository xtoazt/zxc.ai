import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Download, Sparkles, Wand2, Loader2 } from 'lucide-react';

interface ImageGeneratorProps {
  onImageGenerated: (result: any) => void;
  onGenerationStart: () => void;
  isGenerating: boolean;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({
  onImageGenerated,
  onGenerationStart,
  isGenerating
}) => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState('512x512');
  const [style, setStyle] = useState('realistic');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const styles = [
    'realistic', 'anime', 'cartoon', 'oil painting', 'watercolor', 
    'digital art', 'sketch', 'photorealistic', 'fantasy', 'sci-fi'
  ];

  const sizes = [
    '256x256', '512x512', '768x768', '1024x1024', '512x768', '768x512'
  ];

  const generateImage = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    onGenerationStart();

    try {
      // For now, we'll create a canvas-based image generation
      // In production, you'd call an actual image generation API
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      const [width, height] = imageSize.split('x').map(Number);
      canvas.width = width;
      canvas.height = height;

      // Create a gradient background based on prompt
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      const colors = generateColorsFromPrompt(prompt);
      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(1, colors[1]);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Add some abstract shapes based on prompt
      drawAbstractShapes(ctx, width, height, prompt, style);

      // Add text overlay
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(prompt.substring(0, 30), width / 2, height / 2);

      // Convert to image
      const imageDataUrl = canvas.toDataURL('image/png');
      setGeneratedImage(imageDataUrl);

      onImageGenerated({
        success: true,
        data: imageDataUrl,
        prompt: prompt,
        style: style,
        size: imageSize,
        provider: 'canvas-generated'
      });

    } catch (error) {
      console.error('Error generating image:', error);
      onImageGenerated({
        success: false,
        error: 'Failed to generate image. Please try again.'
      });
    }
  };

  const generateColorsFromPrompt = (prompt: string): string[] => {
    const colorMap: { [key: string]: string[] } = {
      'sky': ['#87CEEB', '#4682B4'],
      'sunset': ['#FF6B6B', '#4ECDC4'],
      'forest': ['#228B22', '#006400'],
      'ocean': ['#006994', '#87CEEB'],
      'fire': ['#FF4500', '#FFD700'],
      'night': ['#191970', '#000080'],
      'space': ['#000000', '#4B0082'],
      'flower': ['#FF69B4', '#FFB6C1'],
      'mountain': ['#8B7355', '#A0522D'],
      'desert': ['#F4A460', '#DEB887']
    };

    const lowerPrompt = prompt.toLowerCase();
    for (const [keyword, colors] of Object.entries(colorMap)) {
      if (lowerPrompt.includes(keyword)) {
        return colors;
      }
    }

    // Default colors
    return ['#FF6B6B', '#4ECDC4'];
  };

  const drawAbstractShapes = (ctx: CanvasRenderingContext2D, width: number, height: number, prompt: string, style: string) => {
    const shapes = Math.floor(Math.random() * 5) + 3;
    
    for (let i = 0; i < shapes; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 100 + 20;
      
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
      
      if (style === 'anime' || style === 'cartoon') {
        // Draw circles
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      } else if (style === 'sketch') {
        // Draw lines
        ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y + size);
        ctx.stroke();
      } else {
        // Draw rectangles
        ctx.fillRect(x, y, size, size);
      }
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <ImageIcon className="w-8 h-8 text-white mr-3" />
          <h2 className="text-3xl font-bold text-white">AI Image Generator</h2>
        </div>
        <p className="text-blue-100">
          Generate images using AI with canvas-based rendering
        </p>
      </div>

      <div className="space-y-6">
        {/* Prompt Input */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Image Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate... (e.g., 'A beautiful sunset over mountains', 'Anime character in a forest')"
            className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
            rows={4}
            disabled={isGenerating}
          />
        </div>

        {/* Options Grid */}
        <div className="grid md:grid-cols-2 gap-4">
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
              {styles.map((s) => (
                <option key={s} value={s} className="bg-gray-800">
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Size */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Size
            </label>
            <select
              value={imageSize}
              onChange={(e) => setImageSize(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              disabled={isGenerating}
            >
              {sizes.map((s) => (
                <option key={s} value={s} className="bg-gray-800">
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <button
            onClick={generateImage}
            disabled={isGenerating || !prompt.trim()}
            className="btn-primary px-8 py-4 rounded-xl text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-3" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-3" />
                Generate Image
              </>
            )}
          </button>
        </div>

        {/* Generated Image */}
        {generatedImage && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <Wand2 className="w-6 h-6 text-green-400 mr-3" />
              <h3 className="text-xl font-semibold text-green-400">Image Generated!</h3>
            </div>
            
            <div className="space-y-4">
              <img
                src={generatedImage}
                alt="Generated"
                className="w-full max-w-md mx-auto rounded-lg"
              />
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={downloadImage}
                  className="btn-secondary px-6 py-3 rounded-xl text-white font-semibold flex items-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hidden Canvas for Generation */}
        <canvas
          ref={canvasRef}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ImageGenerator;
