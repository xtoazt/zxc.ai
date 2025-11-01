// OpenAI-compatible API endpoint for zxc.ai
// This endpoint provides OpenAI-compatible chat completions that generate videos
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
};

