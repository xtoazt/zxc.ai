// api/generate-video-replicate.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { prompt, duration, style, resolution } = req.body;

  if (!prompt) {
    return res.status(400).json({ success: false, message: 'Prompt is required.' });
  }

  const REPLICATE_TOKEN = process.env.REPLICATE_TOKEN || '';
  const MODEL_VERSION = '9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351';

  if (!REPLICATE_TOKEN) {
    return res.status(500).json({ 
      success: false, 
      error: 'Replicate API token not configured. Please set REPLICATE_TOKEN environment variable.',
      provider: 'replicate'
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
    const numFrames = Math.min(duration * 8, 120);

    console.log('Replicate API Request:', { prompt, duration, resolution, width, height });

    // Start prediction
    const startResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: MODEL_VERSION,
        input: {
          prompt: `${prompt}, ${style || 'realistic'} style, high quality, cinematic`,
          num_frames: numFrames,
          num_inference_steps: 25,
          guidance_scale: 7.5,
          width: width,
          height: height
        }
      })
    });

    if (!startResponse.ok) {
      const errorText = await startResponse.text();
      console.error('Replicate API error:', startResponse.status, errorText);
      return res.status(startResponse.status).json({ 
        success: false, 
        error: `Replicate API error: ${startResponse.status}`,
        provider: 'replicate'
      });
    }

    const prediction = await startResponse.json();
    console.log('Replicate prediction started:', prediction.id);

    // Poll for result
    const maxAttempts = 60; // 5 minutes max
    let videoUrl = null;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds

      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_TOKEN || ''}`,
        }
      });

      if (!statusResponse.ok) {
        throw new Error(`Replicate polling error: ${statusResponse.status}`);
      }

      const status = await statusResponse.json();
      const elapsed = (attempt + 1) * 5;

      if (status.status === 'succeeded') {
        if (status.output && status.output.length > 0) {
          videoUrl = status.output[0];
          break;
        } else {
          throw new Error('No video output received');
        }
      } else if (status.status === 'failed') {
        throw new Error(`Video generation failed: ${status.error || 'Unknown error'}`);
      } else if (status.status === 'canceled') {
        throw new Error('Video generation was canceled');
      }

      // Send progress update (optional - can be removed if not needed)
      if (attempt % 3 === 0) { // Every 15 seconds
        console.log(`Replicate progress: ${elapsed}s elapsed`);
      }
    }

    if (!videoUrl) {
      throw new Error('Video generation timeout (5 minutes)');
    }

    return res.status(200).json({
      success: true,
      data: videoUrl,
      message: 'Video generated successfully with Replicate',
      provider: 'replicate',
      model: 'Stable Video Diffusion',
      duration: duration,
      resolution: resolution
    });

  } catch (error) {
    console.error('Error generating video with Replicate:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to generate video with Replicate',
      provider: 'replicate'
    });
  }
}
