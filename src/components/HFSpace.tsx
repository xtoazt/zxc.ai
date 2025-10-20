import React, { useEffect, useRef } from 'react';

const HFSpace: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Ensure the custom element is attached when component mounts
    if (containerRef.current && !containerRef.current.querySelector('gradio-app')) {
      const el = document.createElement('gradio-app');
      el.setAttribute('src', 'https://akhaliq-ovi.hf.space');
      // Minimal styling to fit dark UI
      el.style.width = '100%';
      el.style.minHeight = '70vh';
      containerRef.current.appendChild(el);
    }
  }, []);

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
      <div className="text-sm text-gray-300 mb-3">
        Embedded Hugging Face Space: akhaliq-ovi
      </div>
      <div ref={containerRef} />
    </div>
  );
};

export default HFSpace;


