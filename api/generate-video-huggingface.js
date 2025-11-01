// api/generate-video-huggingface.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { prompt, duration, style, resolution, fps } = req.body;

  if (!prompt) {
    return res.status(400).json({ success: false, message: 'Prompt is required.' });
  }

  const HF_TOKEN = process.env.HUGGING_FACE_TOKEN || '';
  const MODEL_ID = 'damo-vilab/text-to-video-ms-1.7b';

  if (!HF_TOKEN) {
    return res.status(500).json({ 
      success: false, 
      error: 'Hugging Face API token not configured. Please set HUGGING_FACE_TOKEN environment variable.',
      provider: 'huggingface'
    });
  }

  const getResolutionDimensions = (res) => {
    const resolutions = {
      '720p': { width: 1280, height: 720 },
      '1080p': { width: 1920, height: 1080 },
      '4k': { width: 3840, height: 2160 }
    };
    return resolutions[res] || resolutions['1080p'];
  };

  try {
    const { width, height } = getResolutionDimensions(resolution);
    const numFrames = Math.min(duration * 8, 64);

    console.log('Hugging Face API Request:', { prompt, duration, resolution, width, height, numFrames });

    const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL_ID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `${prompt}, ${style || 'realistic'} style, high quality, ${resolution}`,
        parameters: {
          num_frames: numFrames,
          height: height,
          width: width,
          num_inference_steps: 25,
          guidance_scale: 7.5
        },
        options: {
          wait_for_model: true,
          use_cache: false
        }
      })
    });

    if (!response.ok) {
      if (response.status === 503) {
        return res.status(503).json({ 
          success: false, 
          error: 'Hugging Face model is loading, please try again in a moment.',
          provider: 'huggingface'
        });
      }
      const errorText = await response.text();
      console.error('Hugging Face API error:', response.status, errorText);
      return res.status(response.status).json({ 
        success: false, 
        error: `Hugging Face API error: ${response.status}`,
        provider: 'huggingface'
      });
    }

    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const result = await response.json();
      if (result.error) {
        return res.status(500).json({ 
          success: false, 
          error: result.error,
          provider: 'huggingface'
        });
      }
    }

    // Video blob response
    const videoBuffer = await response.arrayBuffer();
    const videoBase64 = Buffer.from(videoBuffer).toString('base64');
    const videoDataUrl = `data:video/mp4;base64,${videoBase64}`;

    return res.status(200).json({
      success: true,
      data: videoDataUrl,
      message: 'Video generated successfully with Hugging Face',
      provider: 'huggingface',
      model: 'Text-to-Video MS 1.7B',
      duration: duration,
      resolution: resolution
    });

  } catch (error) {
    console.error('Error generating video with Hugging Face:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to generate video with Hugging Face',
      provider: 'huggingface'
    });
  }
}
