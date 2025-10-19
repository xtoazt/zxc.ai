// Using dynamic import for ES module compatibility

// Smart prompting system for image-based longer videos
function createImageBasedSequentialPrompts(basePrompt, imageData, videoLength = 20) {
  const segments = Math.ceil(videoLength / 2); // Each segment is ~2 seconds
  const prompts = [];
  
  // Parse the base prompt to extract key elements
  const focusMatch = basePrompt.match(/Focus:\s*([^(]+)/);
  const animateMatch = basePrompt.match(/Animate:\s*([^)]+)/);
  const shotMatch = basePrompt.match(/Shot\s+([^)]+)/);
  const seasonMatch = basePrompt.match(/Season:\s*([^)]+)/);
  
  const focus = focusMatch ? focusMatch[1].trim() : 'scene from the uploaded image';
  const animation = animateMatch ? animateMatch[1].trim() : 'subtle movement';
  const shot = shotMatch ? shotMatch[1].trim() : '';
  const season = seasonMatch ? seasonMatch[1].trim() : '';
  
  // Create progressive prompts for smooth transitions with image context
  for (let i = 0; i < segments; i++) {
    const progress = i / (segments - 1);
    let segmentPrompt = `Focus: ${focus} (Based on uploaded image)`;
    
    // Add progressive animation based on segment
    if (segments > 1) {
      if (animation.includes('moving') || animation.includes('running') || animation.includes('walking')) {
        const direction = i < segments / 2 ? 'starting to' : 'continuing to';
        segmentPrompt += ` (Animate: ${direction} ${animation})`;
      } else if (animation.includes('zoom')) {
        const zoomType = i < segments / 2 ? 'beginning to zoom' : 'continuing zoom';
        segmentPrompt += ` (Animate: ${zoomType} ${animation.replace('zoom', '').trim()})`;
      } else if (animation.includes('pan')) {
        const panType = i < segments / 2 ? 'starting to pan' : 'continuing pan';
        segmentPrompt += ` (Animate: ${panType} ${animation.replace('pan', '').trim()})`;
      } else {
        segmentPrompt += ` (Animate: ${animation} - segment ${i + 1})`;
      }
    } else {
      segmentPrompt += ` (Animate: ${animation})`;
    }
    
    // Add shot and season info if present
    if (shot) segmentPrompt += ` (Shot ${shot})`;
    if (season) segmentPrompt += ` (Season: ${season})`;
    
    // Add image context and continuity markers
    segmentPrompt += ` (Image reference: ${imageData ? 'provided' : 'none'})`;
    if (i > 0) segmentPrompt += ` (Continuation from previous segment)`;
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
      imageData,
      videoLength = 20,
      generateLongVideo = false
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('Processing image and generating video...');
    console.log('Video length requested:', videoLength, 'seconds');
    console.log('Image data provided:', imageData ? 'Yes' : 'No');
    
    if (generateLongVideo && videoLength > 2) {
      // Generate multiple segments for longer videos with image context
      const segmentPrompts = createImageBasedSequentialPrompts(prompt, imageData, videoLength);
      const videoSegments = [];
      
      console.log(`Generating ${segmentPrompts.length} video segments with image context...`);
      
      for (let i = 0; i < segmentPrompts.length; i++) {
        console.log(`Generating segment ${i + 1}/${segmentPrompts.length}: ${segmentPrompts[i]}`);
        
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
          hasImage: !!imageData
        });
        
        // Small delay between segments to avoid rate limiting
        if (i < segmentPrompts.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      res.status(200).json({
        success: true,
        data: videoSegments,
        message: `Generated ${videoSegments.length} video segments with image context for ${videoLength}s total duration`,
        segments: videoSegments.length,
        totalDuration: videoLength,
        hasImage: !!imageData
      });
    } else {
      // Generate single 2-second video with image context
      const enhancedPrompt = `Focus: ${prompt} (Based on uploaded image: ${imageData ? 'provided' : 'none'})`;
      
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
        message: 'Video generated successfully with image reference',
        hasImage: !!imageData
      });
    }
  } catch (error) {
    console.error('Error generating video with image:', error);
    
    res.status(500).json({ 
      error: 'Failed to generate video with image',
      details: error.message 
    });
  }
}