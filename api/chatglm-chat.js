// ChatGLM API Integration
// This endpoint handles ChatGLM streaming chat functionality

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, conversationId, model = 'chatglm' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('ChatGLM request:', { message, conversationId, model });

    // ChatGLM API configuration
    const chatglmBaseUrl = 'https://chatglm.cn/chatglm';
    const streamUrl = `${chatglmBaseUrl}/backend-api/v1/stream_context`;
    
    // Create request payload for ChatGLM
    const payload = {
      message: message,
      conversation_id: conversationId || null,
      model: model,
      stream: true
    };

    // Make request to ChatGLM streaming endpoint
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

    // Handle streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';
    let conversationId = null;

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
                conversationId = data.conversation_id;
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
      conversationId: conversationId,
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
