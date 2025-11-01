// OpenAI-compatible API endpoint for zxc.ai
// Consolidated v1 API router - handles both /v1/chat/completions and /v1/models
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

  // Route based on the path and query
  const path = req.url || req.path || '';
  const originalUrl = req.headers['x-vercel-original-url'] || req.headers['x-vercel-rewrite-url'] || path;
  const routeHint = req.query.route || req.query.path;
  
  // Handle /v1/models endpoint
  if (routeHint === 'models' || originalUrl.includes('/models') || path.includes('/models') || (req.method === 'GET' && !req.body && routeHint !== 'chat-completions')) {
    return handleModels(req, res);
  }
  
  // Handle /v1/chat/completions endpoint
  if (routeHint === 'chat-completions' || originalUrl.includes('/chat/completions') || path.includes('/chat/completions') || (req.method === 'POST' && routeHint !== 'models')) {
    return handleChatCompletions(req, res);
  }

  // Default to models if path is unclear
  return handleModels(req, res);
}

// Models endpoint handler
function handleModels(req, res) {
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
}

// Chat completions endpoint handler
async function handleChatCompletions(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed', type: 'invalid_request_error' } });
  }

  try {
    const { model, messages, stream, ...otherParams } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: {
          message: 'messages is required and must be a non-empty array',
          type: 'invalid_request_error'
        }
      });
    }

    // Extract the last user message
    const userMessages = messages.filter(m => m.role === 'user');
    if (userMessages.length === 0) {
      return res.status(400).json({
        error: {
          message: 'At least one user message is required',
          type: 'invalid_request_error'
        }
      });
    }

    const lastUserMessage = userMessages[userMessages.length - 1];
    const prompt = lastUserMessage.content;

    // Map ZXC models to internal endpoints
    const modelMap = {
      'zxc-1': 'generate-video',
      'zxc-star': 'sora2',
      'zxc-pear': 'zeroscope',
      'zxc-turtle': 'cogvideox',
      'zxc-pear5': 'generate-video-vider',
      'zxc-nex': 'generate-video-huggingface',
      'zxc-bolt': 'generate-video-huggingface',
      'zxc-zen': 'generate-video-replicate',
      'zxc-flash': 'generate-video-pexels',
      'zxc-moon': 'generate-video-gemini',
      'zxc-flash-transition': 'generate-transition-video',
      'zxc-wave': 'wan-transition',
      // Default to text-to-video
      'gpt-3.5-turbo': 'generate-video',
      'gpt-4': 'generate-video',
    };

    const selectedModel = model || 'zxc-1';
    const apiEndpoint = modelMap[selectedModel] || 'generate-video';

    // Generate video based on model
    let videoResult;
    
    try {
      // Directly require and call the appropriate handler
      if (apiEndpoint === 'generate-video') {
        const generateVideo = require('../generate-video');
        const mockReq = { method: 'POST', body: { prompt, baseModel: 'zxc-1', videoLength: 20, generateLongVideo: false } };
        const mockRes = {
          status: (code) => ({
            json: (data) => {
              videoResult = data;
              return mockRes;
            }
          }),
          setHeader: () => {},
          end: () => {}
        };
        await generateVideo(mockReq, mockRes);
      } else if (apiEndpoint === 'generate-video-huggingface') {
        const generateVideoHF = require('../generate-video-huggingface');
        const mockReq = { method: 'POST', body: { prompt, duration: 5, style: 'realistic', resolution: '1080p' } };
        const mockRes = {
          status: (code) => ({
            json: (data) => {
              videoResult = data;
              return mockRes;
            }
          }),
          setHeader: () => {},
          end: () => {}
        };
        await generateVideoHF.default(mockReq, mockRes);
      } else if (apiEndpoint === 'generate-video-replicate') {
        const generateVideoReplicate = require('../generate-video-replicate');
        const mockReq = { method: 'POST', body: { prompt, duration: 5 } };
        const mockRes = {
          status: (code) => ({
            json: (data) => {
              videoResult = data;
              return mockRes;
            }
          }),
          setHeader: () => {},
          end: () => {}
        };
        await generateVideoReplicate.default(mockReq, mockRes);
      } else if (apiEndpoint === 'generate-video-gemini') {
        const generateVideoGemini = require('../generate-video-gemini');
        const mockReq = { method: 'POST', body: { prompt, duration: 5, style: 'realistic', resolution: '1080p' } };
        const mockRes = {
          status: (code) => ({
            json: (data) => {
              videoResult = data;
              return mockRes;
            }
          }),
          setHeader: () => {},
          end: () => {}
        };
        await generateVideoGemini.default(mockReq, mockRes);
      } else {
        // Fallback to basic video generation
        const generateVideo = require('../generate-video');
        const mockReq = { method: 'POST', body: { prompt } };
        const mockRes = {
          status: (code) => ({
            json: (data) => {
              videoResult = data;
              return mockRes;
            }
          }),
          setHeader: () => {},
          end: () => {}
        };
        await generateVideo(mockReq, mockRes);
      }

      if (!videoResult.success) {
        throw new Error(videoResult.error || 'Video generation failed');
      }

      // Format response in OpenAI-compatible format
      const completionResponse = {
        id: `chatcmpl-${Date.now()}`,
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model: selectedModel,
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: `Video generated successfully. Video URL: ${videoResult.videoUrl || videoResult.data?.video || 'Available in response data'}\n\nModel: ${selectedModel}\nPrompt: ${prompt}\n\nVideo metadata:\n${JSON.stringify(videoResult, null, 2)}`
            },
            finish_reason: 'stop'
          }
        ],
        usage: {
          prompt_tokens: prompt.length / 4, // Rough estimate
          completion_tokens: 100,
          total_tokens: prompt.length / 4 + 100
        },
        video: videoResult // Include full video data
      };

      return res.status(200).json(completionResponse);

    } catch (videoError) {
      console.error('Video generation error:', videoError);
      
      // Return error in OpenAI format
      return res.status(500).json({
        error: {
          message: videoError.message || 'Video generation failed',
          type: 'server_error',
          video_error: videoError.message
        }
      });
    }

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({
      error: {
        message: error.message || 'Internal server error',
        type: 'server_error'
      }
    });
  }
}

