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
    const { message, context = 'viral-video-creation' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('Processing AI chat request...');

    // Create specialized prompt for viral video creation
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
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
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
    
    // Fallback response
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
