// OpenAI-compatible models endpoint
module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: { message: 'Method not allowed', type: 'invalid_request_error' } });
  }

  const models = {
    object: 'list',
    data: [
      {
        id: 'zxc-1',
        object: 'model',
        created: 1704067200,
        owned_by: 'zxc-ai',
        description: 'Primary text-to-video model - Fast and reliable',
        capabilities: ['video_generation', 'text_to_video']
      },
      {
        id: 'zxc-star',
        object: 'model',
        created: 1704067200,
        owned_by: 'zxc-ai',
        description: 'Premium video generation model - Highest quality',
        capabilities: ['video_generation', 'premium']
      },
      {
        id: 'zxc-pear',
        object: 'model',
        created: 1704067200,
        owned_by: 'zxc-ai',
        description: 'Fast video generation model',
        capabilities: ['video_generation', 'fast']
      },
      {
        id: 'zxc-turtle',
        object: 'model',
        created: 1704067200,
        owned_by: 'zxc-ai',
        description: 'High quality video generation model',
        capabilities: ['video_generation', 'high_quality']
      },
      {
        id: 'zxc-pear5',
        object: 'model',
        created: 1704067200,
        owned_by: 'zxc-ai',
        description: 'Image-to-video conversion model',
        capabilities: ['video_generation', 'image_to_video']
      },
      {
        id: 'zxc-nex',
        object: 'model',
        created: 1704067200,
        owned_by: 'zxc-ai',
        description: 'Advanced multi-provider video generation',
        capabilities: ['video_generation', 'multi_provider']
      },
      {
        id: 'zxc-bolt',
        object: 'model',
        created: 1704067200,
        owned_by: 'zxc-ai',
        description: 'Efficient and fast video generation',
        capabilities: ['video_generation', 'fast']
      },
      {
        id: 'zxc-zen',
        object: 'model',
        created: 1704067200,
        owned_by: 'zxc-ai',
        description: 'Stable video diffusion model',
        capabilities: ['video_generation', 'stable']
      },
      {
        id: 'zxc-flash',
        object: 'model',
        created: 1704067200,
        owned_by: 'zxc-ai',
        description: 'Real video library search',
        capabilities: ['video_generation', 'real_video']
      },
      {
        id: 'zxc-moon',
        object: 'model',
        created: 1704067200,
        owned_by: 'zxc-ai',
        description: 'Enhanced prompt video generation',
        capabilities: ['video_generation', 'enhanced_prompts']
      },
      {
        id: 'zxc-cloud',
        object: 'model',
        created: 1704067200,
        owned_by: 'zxc-ai',
        description: 'Image generation model',
        capabilities: ['image_generation']
      },
      {
        id: 'zxc-vox',
        object: 'model',
        created: 1704067200,
        owned_by: 'zxc-ai',
        description: 'Embedded space model',
        capabilities: ['video_generation', 'embedded']
      },
      {
        id: 'zxc-sun',
        object: 'model',
        created: 1704067200,
        owned_by: 'zxc-ai',
        description: 'AI suggestions and ideas model',
        capabilities: ['suggestions', 'ideas']
      },
      {
        id: 'zxc-flash-transition',
        object: 'model',
        created: 1704067200,
        owned_by: 'zxc-ai',
        description: 'TikTok-style transition video model',
        capabilities: ['video_generation', 'transition']
      },
      {
        id: 'zxc-wave',
        object: 'model',
        created: 1704067200,
        owned_by: 'zxc-ai',
        description: 'Frame-to-frame transition model',
        capabilities: ['video_generation', 'frame_transition']
      }
    ]
  };

  return res.status(200).json(models);
};

