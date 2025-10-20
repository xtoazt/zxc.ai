import React, { useEffect, useRef } from 'react';
import { Video, Zap, Sparkles } from 'lucide-react';

const WANTransitionVideo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Ensure the custom element is attached when component mounts
    if (containerRef.current && !containerRef.current.querySelector('gradio-app')) {
      const el = document.createElement('gradio-app');
      el.setAttribute('src', 'https://multimodalart-wan-2-2-first-last-frame.hf.space');
      // Enhanced styling for better UI
      el.style.width = '100%';
      el.style.minHeight = '80vh';
      el.style.borderRadius = '16px';
      containerRef.current.appendChild(el);
    }
  }, []);

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <Video className="w-12 h-12 text-white mr-4" />
            <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">WAN 2.2 First-Last Frame</h2>
            <p className="text-xl text-blue-100">Advanced transition video generation</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-6">
          <div className="flex items-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-full px-6 py-3">
            <Zap className="w-5 h-5 text-purple-400 mr-2" />
            <span className="text-purple-300 font-medium">Advanced Transitions</span>
          </div>
          <div className="flex items-center bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/50 rounded-full px-6 py-3">
            <Video className="w-5 h-5 text-blue-400 mr-2" />
            <span className="text-blue-300 font-medium">Frame-to-Frame</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white text-lg font-semibold">WAN 2.2 Transition Generator</h3>
            <p className="text-gray-400 text-sm">Powered by MultiModalArt</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">Ready</span>
          </div>
        </div>
        
        <div ref={containerRef} className="min-h-[600px]" />
      </div>
    </div>
  );
};

export default WANTransitionVideo;
