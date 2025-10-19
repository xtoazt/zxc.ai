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
    const { prompt, videoLength = 2, hasImage = false, baseModel = 'Realistic' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('Enhancing prompt with LLM7 AI...');

    // Create enhancement prompt based on context
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
      messages: [
        {
          role: "user",
          content: enhancementPrompt
        }
      ],
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
    res.status(500).json({ 
      error: 'Failed to enhance prompt',
      details: error.message 
    });
  }
}
