const axios = require('axios');

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
    const { prompt, baseModel = 'Realistic', motion = '', inferenceSteps = '4-Step', imageData } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('Processing image and generating video...');
    
    // Enhanced prompt with image context
    const enhancedPrompt = `Focus: ${prompt} (Image reference provided)`;
    
    // Call Instant Video API
    const response = await axios.post('https://sahaniji-instant-video.hf.space/api/predict', {
      data: [
        enhancedPrompt,
        baseModel,
        motion,
        inferenceSteps
      ]
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 300000 // 5 minutes timeout
    });
    
    res.status(200).json({
      success: true,
      data: response.data,
      message: 'Video generated successfully with image reference'
    });
  } catch (error) {
    console.error('Error generating video with image:', error);
    
    res.status(500).json({ 
      error: 'Failed to generate video with image',
      details: error.message 
    });
  }
}