import React, { useState } from 'react';
import { Code, Book, Terminal, Copy, CheckCircle, ExternalLink, Key, Zap, Video, Brain, Sparkles } from 'lucide-react';

const DeveloperSection: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const codeExample = `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://zxc.ai/v1',
  apiKey: 'your-api-key-here', // Optional for public API
});

const response = await client.chat.completions.create({
  model: 'zxc-1',
  messages: [
    {
      role: 'user',
      content: 'A serene sunset over mountains with birds flying'
    }
  ]
});

console.log(response.video); // Video generation result`;

  const curlExample = `curl https://zxc.ai/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "zxc-1",
    "messages": [
      {
        "role": "user",
        "content": "A serene sunset over mountains"
      }
    ]
  }'`;

  const pythonExample = `import requests

response = requests.post(
    'https://zxc.ai/v1/chat/completions',
    json={
        'model': 'zxc-1',
        'messages': [
            {'role': 'user', 'content': 'A serene sunset over mountains'}
        ]
    }
)

data = response.json()
print(data['video'])  # Video generation result`;

  const allModels = [
    { id: 'zxc-1', description: 'Primary text-to-video model', type: 'video', speed: 'Fast' },
    { id: 'zxc-star', description: 'Premium video generation model', type: 'video', speed: 'Standard' },
    { id: 'zxc-pear', description: 'Fast video generation model', type: 'video', speed: 'Very Fast' },
    { id: 'zxc-turtle', description: 'High quality video generation', type: 'video', speed: 'Standard' },
    { id: 'zxc-pear5', description: 'Image-to-video conversion', type: 'video', speed: 'Fast' },
    { id: 'zxc-nex', description: 'Advanced multi-provider system', type: 'video', speed: 'Variable' },
    { id: 'zxc-bolt', description: 'Efficient video generation', type: 'video', speed: 'Fast' },
    { id: 'zxc-zen', description: 'Stable video diffusion', type: 'video', speed: 'Standard' },
    { id: 'zxc-flash', description: 'Real video library search', type: 'video', speed: 'Fast' },
    { id: 'zxc-moon', description: 'Enhanced prompt generation', type: 'video', speed: 'Standard' },
    { id: 'zxc-cloud', description: 'Image generation model', type: 'image', speed: 'Fast' },
    { id: 'zxc-vox', description: 'Embedded space model', type: 'video', speed: 'Variable' },
    { id: 'zxc-sun', description: 'AI suggestions and ideas', type: 'text', speed: 'Instant' },
    { id: 'zxc-flash-transition', description: 'TikTok-style transitions', type: 'video', speed: 'Fast' },
    { id: 'zxc-wave', description: 'Frame-to-frame transitions', type: 'video', speed: 'Fast' }
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <Code className="w-12 h-12 text-blue-400 mr-4" />
          <h2 className="text-4xl md:text-5xl font-bold text-white">Developer API</h2>
        </div>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto">
          OpenAI-compatible API for seamless integration. Build the next generation of media applications.
        </p>
      </div>

      {/* Quick Start */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 p-8">
        <div className="flex items-center mb-6">
          <Zap className="w-6 h-6 text-yellow-400 mr-3" />
          <h3 className="text-2xl font-bold text-white">Quick Start</h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <Terminal className="w-5 h-5 mr-2 text-blue-400" />
              JavaScript/TypeScript
            </h4>
            <div className="relative">
              <pre className="bg-gray-950 border border-gray-700 rounded-lg p-5 overflow-x-auto text-sm text-gray-300 font-mono">
                <code>{codeExample}</code>
              </pre>
              <button
                onClick={() => copyToClipboard(codeExample, 'js')}
                className="absolute top-3 right-3 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                {copied === 'js' ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <Terminal className="w-5 h-5 mr-2 text-green-400" />
              cURL
            </h4>
            <div className="relative">
              <pre className="bg-gray-950 border border-gray-700 rounded-lg p-5 overflow-x-auto text-sm text-gray-300 font-mono">
                <code>{curlExample}</code>
              </pre>
              <button
                onClick={() => copyToClipboard(curlExample, 'curl')}
                className="absolute top-3 right-3 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                {copied === 'curl' ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <Terminal className="w-5 h-5 mr-2 text-purple-400" />
              Python
            </h4>
            <div className="relative">
              <pre className="bg-gray-950 border border-gray-700 rounded-lg p-5 overflow-x-auto text-sm text-gray-300 font-mono">
                <code>{pythonExample}</code>
              </pre>
              <button
                onClick={() => copyToClipboard(pythonExample, 'python')}
                className="absolute top-3 right-3 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                {copied === 'python' ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* API Endpoints */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 p-8">
        <div className="flex items-center mb-6">
          <Book className="w-6 h-6 text-purple-400 mr-3" />
          <h3 className="text-2xl font-bold text-white">API Endpoints</h3>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-md text-xs font-semibold">POST</span>
                  <code className="text-blue-400 font-mono">/v1/chat/completions</code>
                </div>
                <p className="text-gray-400 text-sm">Generate videos using OpenAI-compatible API</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex">
                <span className="text-gray-500 w-24">Request:</span>
                <code className="text-gray-300">{"{ model: 'zxc-1', messages: [{ role: 'user', content: '...' }] }"}</code>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-24">Response:</span>
                <code className="text-gray-300">{"{ choices: [{ message: {...} }], video: {...} }"}</code>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-md text-xs font-semibold">GET</span>
                  <code className="text-blue-400 font-mono">/v1/models</code>
                </div>
                <p className="text-gray-400 text-sm">List all available ZXC models</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex">
                <span className="text-gray-500 w-24">Response:</span>
                <code className="text-gray-300">{"{ object: 'list', data: [{ id: 'zxc-1', ... }] }"}</code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Models */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 p-8">
        <div className="flex items-center mb-6">
          <Video className="w-6 h-6 text-pink-400 mr-3" />
          <h3 className="text-2xl font-bold text-white">Available Models</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allModels.map((model) => (
            <div
              key={model.id}
              className="bg-gray-900/50 rounded-xl p-5 border border-gray-700/50 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <code className="text-blue-400 font-mono font-semibold text-lg">{model.id}</code>
                {model.type === 'video' && <Video className="w-4 h-4 text-purple-400" />}
                {model.type === 'image' && <Sparkles className="w-4 h-4 text-pink-400" />}
                {model.type === 'text' && <Brain className="w-4 h-4 text-cyan-400" />}
              </div>
              <p className="text-gray-400 text-sm mb-3">{model.description}</p>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Speed:</span>
                <span className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-300">{model.speed}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
          <Key className="w-8 h-8 text-blue-400 mb-4" />
          <h4 className="text-white font-semibold mb-2">OpenAI-Compatible</h4>
          <p className="text-gray-400 text-sm">
            Drop-in replacement for OpenAI API. Use existing OpenAI SDKs and code.
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
          <Zap className="w-8 h-8 text-green-400 mb-4" />
          <h4 className="text-white font-semibold mb-2">Free & Unlimited</h4>
          <p className="text-gray-400 text-sm">
            No API keys required for public access. Free forever with unlimited usage.
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
          <Video className="w-8 h-8 text-purple-400 mb-4" />
          <h4 className="text-white font-semibold mb-2">15 Video Models</h4>
          <p className="text-gray-400 text-sm">
            Choose from multiple specialized models for different use cases and quality levels.
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-6">
          <Code className="w-8 h-8 text-orange-400 mb-4" />
          <h4 className="text-white font-semibold mb-2">Easy Integration</h4>
          <p className="text-gray-400 text-sm">
            Simple REST API with comprehensive documentation and code examples.
          </p>
        </div>
      </div>

      {/* Documentation Link */}
      <div className="text-center">
        <a
          href="https://docs.zxc.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
        >
          <Book className="w-5 h-5" />
          <span>View Full Documentation</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export default DeveloperSection;

