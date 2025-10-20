// Vider.ai Image-to-Video Generation API
// This endpoint handles image-to-video generation using Vider.ai service

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
    const { imageUrl, prompt, aspectRatio = 1, videoLength = 2 } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    console.log('Generating video with Vider.ai:', { imageUrl, prompt, aspectRatio, videoLength });

    // Vider.ai API configuration
    const viderApiUrl = 'https://api.vider.ai/api/freev1';
    const taskType = 'free-ai-image-to-video-generator';

    // Step 1: Create task
    const createTaskResponse = await fetch(`${viderApiUrl}/task_create/${taskType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        params: {
          image_url: imageUrl,
          prompt: prompt || 'Generate a video from this image',
          aspect_ratio: aspectRatio,
          duration: videoLength
        }
      })
    });

    const createTaskData = await createTaskResponse.json();
    console.log('Vider.ai task creation response:', createTaskData);

    if (createTaskData.code !== 0) {
      throw new Error(createTaskData.msg || 'Failed to create video generation task');
    }

    const taskId = createTaskData.data.taskId;
    console.log('Created Vider.ai task:', taskId);

    // Step 2: Poll for completion (with timeout)
    const maxPollingTime = 300000; // 5 minutes
    const pollingInterval = 5000; // 5 seconds
    const startTime = Date.now();

    while (Date.now() - startTime < maxPollingTime) {
      await new Promise(resolve => setTimeout(resolve, pollingInterval));

      try {
        const statusResponse = await fetch(`${viderApiUrl}/task_get/${taskId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const statusData = await statusResponse.json();
        console.log('Vider.ai task status:', statusData);

        if (statusData.code === 0 && statusData.data) {
          const taskState = statusData.data.state;
          
          if (taskState === 3) {
            // Task completed successfully
            const resultVideo = statusData.data.result?.file_url;
            if (resultVideo) {
              return res.status(200).json({
                success: true,
                data: resultVideo,
                taskId: taskId,
                message: 'Video generated successfully with Vider.ai',
                provider: 'vider-ai'
              });
            } else {
              throw new Error('Video generation completed but no result URL found');
            }
          } else if (taskState === 1) {
            // Task is processing
            console.log('Task is processing...');
            continue;
          } else if (taskState === 0) {
            // Task is pending
            console.log('Task is pending...');
            continue;
          } else {
            throw new Error(`Unexpected task state: ${taskState}`);
          }
        } else {
          throw new Error(statusData.msg || 'Failed to check task status');
        }
      } catch (pollingError) {
        console.error('Error polling task status:', pollingError);
        // Continue polling unless it's a critical error
        if (pollingError.message.includes('Unexpected task state')) {
          throw pollingError;
        }
      }
    }

    // Timeout reached
    throw new Error('Video generation timed out. Please try again.');

  } catch (error) {
    console.error('Error generating video with Vider.ai:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate video with Vider.ai'
    });
  }
}
