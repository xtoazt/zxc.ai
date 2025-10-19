import React, { useState } from 'react';
import { Brain, Sparkles, Lightbulb } from 'lucide-react';

interface AISuggestionsProps {
  onSuggestionSelect: (suggestion: string) => void;
}

const AISuggestions: React.FC<AISuggestionsProps> = ({ onSuggestionSelect }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState('general');
  const [mood, setMood] = useState('cinematic');

  const generateSuggestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          mood
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSuggestions(result.suggestions);
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <div className="flex items-center mb-4">
        <Brain className="w-6 h-6 text-purple-400 mr-3" />
        <h3 className="text-xl font-semibold text-white">AI-Powered Suggestions</h3>
      </div>

      <div className="space-y-4">
        {/* Category and Mood Selection */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white font-semibold mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="general">General</option>
              <option value="nature">Nature</option>
              <option value="urban">Urban</option>
              <option value="abstract">Abstract</option>
              <option value="people">People</option>
              <option value="animals">Animals</option>
            </select>
          </div>
          <div>
            <label className="block text-white font-semibold mb-2">
              Mood
            </label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="cinematic">Cinematic</option>
              <option value="dramatic">Dramatic</option>
              <option value="peaceful">Peaceful</option>
              <option value="energetic">Energetic</option>
              <option value="mysterious">Mysterious</option>
              <option value="romantic">Romantic</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateSuggestions}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Brain className="w-5 h-5 mr-2 animate-spin" />
              Generating AI Suggestions...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate AI Suggestions
            </>
          )}
        </button>

        {/* Suggestions Display */}
        {suggestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-white font-semibold flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
              AI Suggestions ({category} • {mood})
            </h4>
            <div className="grid gap-3">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestionSelect(suggestion)}
                  className="text-left p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-200 group"
                >
                  <p className="text-blue-100 group-hover:text-white text-sm leading-relaxed">
                    {suggestion}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISuggestions;
