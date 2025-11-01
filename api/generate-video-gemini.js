// api/generate-video-gemini.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { prompt, duration, style, resolution } = req.body;

  if (!prompt) {
    return res.status(400).json({ success: false, message: 'Prompt is required.' });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ 
      success: false, 
      error: 'Gemini API key not configured. Please set GEMINI_API_KEY environment variable.',
      provider: 'gemini'
    });
  }

  try {
    console.log('Gemini API Request:', { prompt, duration, resolution });

    // Gemini API for video generation
    // Note: Gemini primarily supports image generation, but we can use it for video prompts
    // For actual video generation, we'll use Gemini to enhance prompts and guide generation
    
    const enhancedPrompt = `${prompt}, ${style || 'realistic'} style, high quality, ${resolution} resolution, cinematic video`;

    // Call Gemini API to get video generation guidance
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Generate a detailed video generation prompt for: "${enhancedPrompt}". The video should be ${duration} seconds long. Provide a structured prompt that includes scene description, camera movements, and visual effects.`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', geminiResponse.status, errorText);
      return res.status(geminiResponse.status).json({ 
        success: false, 
        error: `Gemini API error: ${geminiResponse.status}`,
        provider: 'gemini'
      });
    }

    const geminiData = await geminiResponse.json();
    const enhancedVideoPrompt = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || enhancedPrompt;

    console.log('Gemini enhanced prompt:', enhancedVideoPrompt);

    // For actual video generation, we'll use a fallback to Hugging Face or Replicate
    // But return the enhanced prompt for now, or integrate with video generation API
    
    // Option: Use Gemini Vision API for image-to-video workflow
    // Or use Gemini to generate image frames that can be animated
    
    return res.status(200).json({
      success: true,
      data: {
        enhancedPrompt: enhancedVideoPrompt,
        originalPrompt: prompt,
        type: 'prompt-enhancement'
      },
      message: 'Video generation prompt enhanced with Gemini AI',
      provider: 'gemini',
      model: 'Gemini Pro',
      duration: duration,
      resolution: resolution,
      note: 'Gemini enhanced your prompt. Use this with other video generation providers for best results.'
    });

  } catch (error) {
    console.error('Error with Gemini API:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to process with Gemini API',
      provider: 'gemini'
    });
  }
}
