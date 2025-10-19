const OpenAI = require('openai');

const client = new OpenAI({
  baseURL: "https://api.llm7.io/v1",
  apiKey: "DTe4u9Lb7WEFIiWdS438u+ON5FoFGfdRc+nowTF/uuMflDPVqnrnHU7Bs7q31RhSTf6uiO+FGliTwj6To39hUS2wsSg9t6GpNX4e1UXKCufyDJLi7LPzPb7PbZiQPa9VBVv332R8M3prPZJOvXQR59sxSUpFQQ=="
});

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category = 'general', mood = 'cinematic' } = req.body;

    console.log('Generating AI suggestions...');

    const suggestionPrompt = `You are a creative video prompt generator for zxc.ai, an AI video generation platform. Generate 6 diverse, creative video prompt suggestions.

Category: ${category}
Mood: ${mood}

Requirements:
1. Each prompt must follow the format: "Focus: [subject] (Animate: [action]) (Shot: [camera angle]) (Season: [weather/time] if relevant)"
2. Make them cinematic and visually stunning
3. Include diverse subjects: nature, people, objects, abstract concepts
4. Vary the camera angles and movements
5. Make them suitable for 2-20 second videos
6. Be creative and unique

Return as a JSON array of 6 prompt strings.`;

    const response = await client.chat.completions.create({
      model: "mistral-small-3.1-24b-instruct-2503",
      messages: [
        {
          role: "user",
          content: suggestionPrompt
        }
      ],
      max_tokens: 800,
      temperature: 0.9
    });

    const suggestionsText = response.choices[0].message.content.trim();
    
    // Try to parse as JSON, fallback to extracting prompts
    let suggestions;
    try {
      suggestions = JSON.parse(suggestionsText);
    } catch (e) {
      // Fallback: extract prompts from text
      const promptMatches = suggestionsText.match(/Focus:[^"]+/g);
      suggestions = promptMatches ? promptMatches.slice(0, 6) : [
        "Focus: Eiffel Tower (Animate: Clouds moving) (Shot from distance)",
        "Focus: Forest path (Animate: Leaves falling) (Shot: Walking through)",
        "Focus: Ocean waves (Animate: Crashing on rocks) (Shot: Close-up)",
        "Focus: City skyline (Animate: Sunset colors) (Shot from drone)",
        "Focus: Flower garden (Animate: Butterfly landing) (Shot: Macro)",
        "Focus: Mountain peak (Animate: Snow falling) (Season: Winter)"
      ];
    }

    res.status(200).json({
      success: true,
      suggestions: suggestions,
      category: category,
      mood: mood,
      message: 'AI suggestions generated successfully'
    });

  } catch (error) {
    console.error('Error generating suggestions:', error);
    
    // Fallback suggestions
    const fallbackSuggestions = [
      "Focus: Eiffel Tower (Animate: Clouds moving) (Shot from distance)",
      "Focus: Forest path (Animate: Leaves falling) (Shot: Walking through)",
      "Focus: Ocean waves (Animate: Crashing on rocks) (Shot: Close-up)",
      "Focus: City skyline (Animate: Sunset colors) (Shot from drone)",
      "Focus: Flower garden (Animate: Butterfly landing) (Shot: Macro)",
      "Focus: Mountain peak (Animate: Snow falling) (Season: Winter)"
    ];

    res.status(200).json({
      success: true,
      suggestions: fallbackSuggestions,
      category: req.body.category || 'general',
      mood: req.body.mood || 'cinematic',
      message: 'Fallback suggestions provided'
    });
  }
}
