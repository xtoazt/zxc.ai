// Consolidated API router for utility endpoints
// Handles: /api/health, /api/options, /api/enhance-prompt, /api/ai-suggestions, /api/ai-chat, /api/chatglm-chat
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
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Better routing detection for Vercel serverless functions
  // Check multiple sources for the original path
  const path = req.url || req.path || '';
  const originalUrl = req.headers['x-vercel-original-url'] || req.headers['x-vercel-rewrite-url'] || path;
  const referer = req.headers.referer || '';
  const routeHint = req.query.route || req.query.path;
  
  // For rewrites, Vercel sets x-vercel-original-url with the original path
  const fullPath = originalUrl || path;
  
  // Handle /api/health
  if (fullPath.includes('/health') || routeHint === 'health' || (req.method === 'GET' && fullPath === '/api/health')) {
    return res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  }

  // Handle /api/options - default GET request
  // Options is the most common, so make it the default for GET requests without body
  if (req.method === 'GET') {
    const isOptionsRequest = fullPath.includes('/options') || routeHint === 'options' || 
                             (fullPath === '/api/options' || fullPath === '/api/api-router');
    
    // If it's clearly not health and is GET, assume options
    if (isOptionsRequest || (!fullPath.includes('/health') && !fullPath.includes('/enhance') && 
        !fullPath.includes('/ai-suggestions') && !fullPath.includes('/ai-chat') && !fullPath.includes('/chatglm'))) {
    return res.status(200).json({
      baseModels: [
        'zxc-1',
        'zxc-pear',
        'zxc-pear5',
        'zxc-turtle',
        'zxc-wave'
      ],
      motionOptions: [
        '',
        'Zoom in',
        'Zoom out',
        'Pan left',
        'Pan right',
        'Tilt up',
        'Tilt down',
        'Rotate clockwise',
        'Rotate counterclockwise'
      ],
      inferenceSteps: [
        '1-Step',
        '2-Step',
        '4-Step',
        '8-Step',
        '12-Step'
      ]
    });
  }

  // Handle /api/enhance-prompt - POST with prompt in body
  if (fullPath.includes('/enhance-prompt') || routeHint === 'enhance-prompt' || 
      (req.method === 'POST' && req.body && req.body.prompt && !req.body.message && !req.body.category)) {
    return handleEnhancePrompt(req, res);
  }

  // Handle /api/ai-suggestions - POST with category/mood
  if (fullPath.includes('/ai-suggestions') || routeHint === 'ai-suggestions' || 
      (req.method === 'POST' && req.body && (req.body.category || req.body.mood))) {
    return handleAISuggestions(req, res);
  }

  // Handle /api/ai-chat - POST with message
  if (fullPath.includes('/ai-chat') || routeHint === 'ai-chat' || 
      (req.method === 'POST' && req.body && req.body.message && req.body.context)) {
    return handleAIChat(req, res);
  }

  // Handle /api/chatglm-chat - POST with message and model
  if (fullPath.includes('/chatglm-chat') || routeHint === 'chatglm-chat' || 
      (req.method === 'POST' && req.body && req.body.message && req.body.model)) {
    return handleChatGLMChat(req, res);
  }

  // Default to options if GET, or 404
  if (req.method === 'GET') {
    return res.status(200).json({
      baseModels: ['zxc-1', 'zxc-pear', 'zxc-pear5', 'zxc-turtle', 'zxc-wave'],
      motionOptions: ['', 'Zoom in', 'Zoom out', 'Pan left', 'Pan right', 'Tilt up', 'Tilt down', 'Rotate clockwise', 'Rotate counterclockwise'],
      inferenceSteps: ['1-Step', '2-Step', '4-Step', '8-Step', '12-Step']
    });
  }

  // If POST but no handler matched, return helpful error
  return res.status(404).json({ 
    error: 'Endpoint not found',
    available: ['/api/health', '/api/options', '/api/enhance-prompt', '/api/ai-suggestions', '/api/ai-chat', '/api/chatglm-chat'],
    path: fullPath,
    method: req.method
  });
};

// Enhance prompt handler
async function handleEnhancePrompt(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, videoLength = 2, hasImage = false, baseModel = 'Realistic' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('Enhancing prompt with LLM7 AI...');

    let enhancementPrompt = `You are an expert video prompt engineer for AI video generation. Your task is to enhance the user's prompt to create the most compelling and detailed video possible.

User's original prompt: "${prompt}"

Context:
- Video length: ${videoLength} seconds
- Has uploaded image: ${hasImage ? 'Yes' : 'No'}
- Base model: ${baseModel}

Please enhance this prompt following these guidelines:

1. Use the "Focus:" format to specify the main subject
2. Add "Animate:" to describe the movement/action
3. Include "Shot:" for camera angles (e.g., "Shot from distance", "Shot from drone", "Close-up shot")
4. Add "Season:" if relevant (e.g., "Season: Winter", "Season: Rain, Daytime")
5. Make it cinematic and visually appealing
6. Ensure smooth transitions for ${videoLength}s video
7. ${hasImage ? 'Reference the uploaded image in the prompt' : 'Create a vivid scene description'}

Return ONLY the enhanced prompt, no explanations.`;

    const response = await client.chat.completions.create({
      model: "mistral-small-3.1-24b-instruct-2503",
      messages: [{ role: "user", content: enhancementPrompt }],
      max_tokens: 300,
      temperature: 0.7
    });

    const enhancedPrompt = response.choices[0].message.content.trim();

    res.status(200).json({
      success: true,
      originalPrompt: prompt,
      enhancedPrompt: enhancedPrompt,
      message: 'Prompt enhanced successfully with AI'
    });

  } catch (error) {
    console.error('Error enhancing prompt:', error);
    res.status(500).json({ error: 'Failed to enhance prompt', details: error.message });
  }
}

// AI suggestions handler
async function handleAISuggestions(req, res) {
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
      messages: [{ role: "user", content: suggestionPrompt }],
      max_tokens: 800,
      temperature: 0.9
    });

    const suggestionsText = response.choices[0].message.content.trim();
    
    let suggestions;
    try {
      suggestions = JSON.parse(suggestionsText);
    } catch (e) {
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

// AI chat handler
async function handleAIChat(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, context = 'viral-video-creation' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('Processing AI chat request...');

    const systemPrompt = `You are an expert AI assistant for zxc.ai, a FREE and UNLIMITED AI video generation platform. Your role is to help users create viral videos using:

Key Features of zxc.ai:
- 100% FREE and UNLIMITED video generation
- Up to 20-second videos with smart prompting
- TikTok-style transitions
- AI-powered prompt enhancement
- Consecutive video creation
- Image-to-video generation

Your expertise areas:
1. Viral video trends and what makes content go viral
2. Creative video ideas for TikTok, Instagram, YouTube Shorts
3. Storytelling techniques for short-form content
4. Prompt engineering for AI video generation
5. Transition ideas and effects
6. Engagement strategies and hooks
7. Trending topics and challenges

Always emphasize that zxc.ai is FREE and UNLIMITED. Provide specific, actionable advice for creating viral content. When suggesting video ideas, format them as proper prompts that can be used directly in the platform.

Be enthusiastic, creative, and focus on helping users create content that will get maximum engagement.`;

    const response = await client.chat.completions.create({
      model: "mistral-small-3.1-24b-instruct-2503",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.8
    });

    const aiResponse = response.choices[0].message.content.trim();

    res.status(200).json({
      success: true,
      response: aiResponse,
      context: context
    });

  } catch (error) {
    console.error('Error processing chat message:', error);
    
    const fallbackResponse = `I'm here to help you create amazing viral videos with zxc.ai! 🚀 

Since I'm having a small technical hiccup, here are some quick viral video ideas:

🔥 Trending Concepts:
• "Focus: Person doing a dance move (Animate: Smooth transition to different locations) (Shot from multiple angles)"
• "Focus: Food preparation (Animate: Time-lapse cooking) (Shot: Close-up to wide)"
• "Focus: Nature scene (Animate: Weather change) (Season: Transition from sunny to rainy)"

💡 Pro Tips:
• Use the AI Enhancement button to improve your prompts
• Try TikTok Transitions for seamless effects
• Create 20-second consecutive videos for maximum impact
• Experiment with different base models for unique styles

Remember: zxc.ai is completely FREE and UNLIMITED! Create as many videos as you want! 🎬`;

    res.status(200).json({
      success: true,
      response: fallbackResponse,
      context: context
    });
  }
}

// ChatGLM chat handler
async function handleChatGLMChat(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, conversationId, model = 'chatglm' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('ChatGLM request:', { message, conversationId, model });

    const chatglmBaseUrl = 'https://chatglm.cn/chatglm';
    const streamUrl = `${chatglmBaseUrl}/backend-api/v1/stream_context`;
    
    const payload = {
      message: message,
      conversation_id: conversationId || null,
      model: model,
      stream: true
    };

    const response = await fetch(streamUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; zxc.ai)'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`ChatGLM API error: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';
    let newConversationId = null;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.conversation_id) {
                newConversationId = data.conversation_id;
              }
              if (data.content) {
                fullResponse += data.content;
              }
            } catch (e) {
              // Skip invalid JSON lines
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    return res.status(200).json({
      success: true,
      response: fullResponse,
      conversationId: newConversationId,
      provider: 'chatglm',
      model: model
    });

  } catch (error) {
    console.error('ChatGLM error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'ChatGLM request failed'
    });
  }
}
