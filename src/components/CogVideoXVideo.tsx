import React, { useEffect, useRef } from 'react';
import { Video, Brain } from 'lucide-react';

const CogVideoXVideo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Ensure the custom element is attached when component mounts
    if (containerRef.current && !containerRef.current.querySelector('gradio-app')) {
      const el = document.createElement('gradio-app');
      el.setAttribute('src', 'https://zai-org-cogvideox-2b-space.hf.space');
      // Minimal styling to fit dark UI
      el.style.width = '100%';
      el.style.minHeight = '70vh';
      containerRef.current.appendChild(el);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Video className="w-8 h-8 text-white mr-3" />
          <h2 className="text-3xl font-bold text-white">CogVideoX 2B</h2>
        </div>
        <p className="text-blue-100">
          High-quality video generation with CogVideoX 2B model
        </p>
        <div className="flex items-center justify-center mt-4">
          <Brain className="w-5 h-5 text-purple-400 mr-2" />
          <span className="text-purple-300 text-sm font-medium">High Quality</span>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
        <div className="text-sm text-gray-300 mb-3">
          Powered by: Zai-Org CogVideoX 2B
        </div>
        <div ref={containerRef} />
      </div>
    </div>
  );
};

export default CogVideoXVideo;
