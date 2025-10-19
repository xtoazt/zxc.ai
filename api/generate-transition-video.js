// Using dynamic import for ES module compatibility

// Enhanced prompting system for TikTok-style transitions
function createTransitionPrompts(basePrompt, videoLength = 2) {
  const segments = Math.ceil(videoLength / 2);
  const prompts = [];
  
  // Parse the base prompt to extract key elements
  const focusMatch = basePrompt.match(/Focus:\s*([^(]+)/);
  const animateMatch = basePrompt.match(/Animate:\s*([^)]+)/);
  const shotMatch = basePrompt.match(/Shot\s+([^)]+)/);
  const seasonMatch = basePrompt.match(/Season:\s*([^)]+)/);
  
  const focus = focusMatch ? focusMatch[1].trim() : 'transition scene';
  const animation = animateMatch ? animateMatch[1].trim() : 'smooth transition';
  const shot = shotMatch ? shotMatch[1].trim() : '';
  const season = seasonMatch ? seasonMatch[1].trim() : '';
  
  // Create progressive prompts for smooth transitions
  for (let i = 0; i < segments; i++) {
    const progress = i / (segments - 1);
    let segmentPrompt = `Focus: ${focus} (TikTok transition from uploaded video)`;
    
    // Add progressive animation based on segment
    if (segments > 1) {
      if (animation.includes('moving') || animation.includes('forward') || animation.includes('backward')) {
        const direction = i < segments / 2 ? 'beginning to' : 'continuing to';
        segmentPrompt += ` (Animate: ${direction} ${animation})`;
      } else if (animation.includes('zoom')) {
        const zoomType = i < segments / 2 ? 'starting to zoom' : 'continuing zoom';
        segmentPrompt += ` (Animate: ${zoomType} ${animation.replace('zoom', '').trim()})`;
      } else if (animation.includes('pan')) {
        const panType = i < segments / 2 ? 'beginning to pan' : 'continuing pan';
        segmentPrompt += ` (Animate: ${panType} ${animation.replace('pan', '').trim()})`;
      } else {
        segmentPrompt += ` (Animate: ${animation} - transition segment ${i + 1})`;
      }
    } else {
      segmentPrompt += ` (Animate: ${animation})`;
    }
    
    // Add shot and season info if present
    if (shot) segmentPrompt += ` (Shot ${shot})`;
    if (season) segmentPrompt += ` (Season: ${season})`;
    
    // Add transition continuity markers
    if (i === 0) segmentPrompt += ` (Smooth transition from uploaded video's last frame)`;
    if (i > 0) segmentPrompt += ` (Continuation from previous transition segment)`;
    if (i < segments - 1) segmentPrompt += ` (Smooth transition to next segment)`;
    
    prompts.push(segmentPrompt);
  }
  
  return prompts;
}

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
    const { 
      prompt, 
      baseModel = 'Realistic', 
      motion = '', 
      inferenceSteps = '4-Step', 
      videoData,
      lastFrame,
      videoLength = 2,
      generateLongVideo = false
    } = req.body;

    if (!prompt || !videoData) {
      return res.status(400).json({ error: 'Prompt and video data are required' });
    }

    console.log('Generating TikTok transition video...');
    console.log('Video length requested:', videoLength, 'seconds');
    console.log('Has uploaded video:', !!videoData);
    console.log('Has last frame:', !!lastFrame);
    
    if (generateLongVideo && videoLength > 2) {
      // Generate multiple segments for longer transition videos
      const segmentPrompts = createTransitionPrompts(prompt, videoLength);
      const videoSegments = [];
      
      console.log(`Generating ${segmentPrompts.length} transition video segments...`);
      
      for (let i = 0; i < segmentPrompts.length; i++) {
        console.log(`Generating transition segment ${i + 1}/${segmentPrompts.length}: ${segmentPrompts[i]}`);
        
        const { client } = await import('@gradio/client');
        const app = await client("SahaniJi/Instant-Video");
        const result = await app.predict("/instant_video", [
          segmentPrompts[i],
          baseModel,
          motion,
          inferenceSteps
        ]);
        
        const response = { data: result.data };
        
        videoSegments.push({
          segment: i + 1,
          prompt: segmentPrompts[i],
          data: response.data,
          isTransition: true,
          hasUploadedVideo: !!videoData
        });
        
        // Small delay between segments to avoid rate limiting
        if (i < segmentPrompts.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      res.status(200).json({
        success: true,
        data: videoSegments,
        message: `Generated ${videoSegments.length} transition video segments for ${videoLength}s total duration`,
        segments: videoSegments.length,
        totalDuration: videoLength,
        isTransition: true,
        hasUploadedVideo: !!videoData
      });
    } else {
      // Generate single 2-second transition video
      const enhancedPrompt = `Focus: ${prompt} (TikTok transition from uploaded video) (Smooth transition from last frame)`;
      
      const { client } = await import('@gradio/client');
      const app = await client("SahaniJi/Instant-Video");
      const result = await app.predict("/instant_video", [
        enhancedPrompt,
        baseModel,
        motion,
        inferenceSteps
      ]);
      
      const response = { data: result.data };
      
      res.status(200).json({
        success: true,
        data: response.data,
        message: 'TikTok transition video generated successfully',
        isTransition: true,
        hasUploadedVideo: !!videoData
      });
    }
  } catch (error) {
    console.error('Error generating transition video:', error);
    
    res.status(500).json({ 
      error: 'Failed to generate transition video',
      details: error.message 
    });
  }
}
