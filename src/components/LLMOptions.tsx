import React, { useState } from 'react';
import { Brain, Zap, MessageCircle, Settings } from 'lucide-react';

interface LLMOptionsProps {
  onLLMSelect: (llm: string) => void;
  selectedLLM: string;
}

const LLMOptions: React.FC<LLMOptionsProps> = ({ onLLMSelect, selectedLLM }) => {
  const [isOpen, setIsOpen] = useState(false);

  const llmOptions = [
    {
      id: 'chatglm',
      name: 'ChatGLM (Default)',
      description: 'Fast, reliable Chinese LLM with streaming',
      provider: 'ChatGLM',
      icon: <Brain className="w-5 h-5" />,
      color: 'text-blue-400'
    },
    {
      id: 'llm7-mistral-small',
      name: 'Mistral Small',
      description: 'Efficient and fast model via LLM7',
      provider: 'LLM7',
      icon: <Zap className="w-5 h-5" />,
      color: 'text-purple-400'
    },
    {
      id: 'llm7-mistral-large',
      name: 'Mistral Large',
      description: 'Advanced reasoning and coding',
      provider: 'LLM7',
      icon: <Brain className="w-5 h-5" />,
      color: 'text-purple-400'
    },
    {
      id: 'llm7-gpt-4',
      name: 'GPT-4',
      description: 'OpenAI GPT-4 via LLM7',
      provider: 'LLM7',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'text-green-400'
    },
    {
      id: 'llm7-claude',
      name: 'Claude',
      description: 'Anthropic Claude via LLM7',
      provider: 'LLM7',
      icon: <Brain className="w-5 h-5" />,
      color: 'text-orange-400'
    },
    {
      id: 'llm7-gemini',
      name: 'Gemini',
      description: 'Google Gemini via LLM7',
      provider: 'LLM7',
      icon: <Zap className="w-5 h-5" />,
      color: 'text-yellow-400'
    }
  ];

  const selectedOption = llmOptions.find(option => option.id === selectedLLM);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 transition-colors"
      >
        <Settings className="w-4 h-4 text-gray-300" />
        <span className="text-white text-sm">
          {selectedOption ? selectedOption.name : 'Select LLM'}
        </span>
        <span className={`text-xs px-2 py-1 rounded ${selectedOption?.color} bg-gray-700`}>
          {selectedOption?.provider}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-50">
          <div className="p-4">
            <h3 className="text-white font-semibold mb-3">Choose Language Model</h3>
            <div className="space-y-2">
              {llmOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    onLLMSelect(option.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedLLM === option.id
                      ? 'bg-blue-500/20 border border-blue-500/50'
                      : 'hover:bg-gray-800 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={option.color}>
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">{option.name}</span>
                        <span className={`text-xs px-2 py-1 rounded ${option.color} bg-gray-700`}>
                          {option.provider}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{option.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LLMOptions;
