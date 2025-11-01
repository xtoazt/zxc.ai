import React, { useEffect, useRef } from 'react';
import { Video, Zap } from 'lucide-react';

const ZeroScopeVideo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Ensure the custom element is attached when component mounts
    if (containerRef.current && !containerRef.current.querySelector('gradio-app')) {
      const el = document.createElement('gradio-app');
      el.setAttribute('src', 'https://hysts-zeroscope-v2.hf.space');
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
          <h2 className="text-3xl font-bold text-white">zxc-pear</h2>
        </div>
        <p className="text-blue-100">
          Fast and efficient video generation with zxc-pear model
        </p>
        <div className="flex items-center justify-center mt-4">
          <Zap className="w-5 h-5 text-blue-400 mr-2" />
          <span className="text-blue-300 text-sm font-medium">Fast Generation</span>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
        <div ref={containerRef} />
      </div>
    </div>
  );
};

export default ZeroScopeVideo;
