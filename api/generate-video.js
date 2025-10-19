const axios = require('axios');

// Smart prompting system for longer videos
function createSequentialPrompts(basePrompt, videoLength = 20) {
  const segments = Math.ceil(videoLength / 2); // Each segment is ~2 seconds
  const prompts = [];
  
  // Parse the base prompt to extract key elements
  const focusMatch = basePrompt.match(/Focus:\s*([^(]+)/);
  const animateMatch = basePrompt.match(/Animate:\s*([^)]+)/);
  const shotMatch = basePrompt.match(/Shot\s+([^)]+)/);
  const seasonMatch = basePrompt.match(/Season:\s*([^)]+)/);
  
  const focus = focusMatch ? focusMatch[1].trim() : 'scene';
  const animation = animateMatch ? animateMatch[1].trim() : 'subtle movement';
  const shot = shotMatch ? shotMatch[1].trim() : '';
  const season = seasonMatch ? seasonMatch[1].trim() : '';
  
  // Create progressive prompts for smooth transitions
  for (let i = 0; i < segments; i++) {
    const progress = i / (segments - 1);
    let segmentPrompt = `Focus: ${focus}`;
    
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
    
    // Add continuity markers for smooth transitions
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
      videoLength = 20,
      generateLongVideo = false
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('Generating video with prompt:', prompt);
    console.log('Video length requested:', videoLength, 'seconds');
    
    if (generateLongVideo && videoLength > 2) {
      // Generate multiple segments for longer videos
      const segmentPrompts = createSequentialPrompts(prompt, videoLength);
      const videoSegments = [];
      
      console.log(`Generating ${segmentPrompts.length} video segments...`);
      
      for (let i = 0; i < segmentPrompts.length; i++) {
        console.log(`Generating segment ${i + 1}/${segmentPrompts.length}: ${segmentPrompts[i]}`);
        
        const response = await axios.post('https://sahaniji-instant-video.hf.space/api/predict', {
          data: [
            segmentPrompts[i],
            baseModel,
            motion,
            inferenceSteps
          ]
        }, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 300000 // 5 minutes timeout per segment
        });
        
        videoSegments.push({
          segment: i + 1,
          prompt: segmentPrompts[i],
          data: response.data
        });
        
        // Small delay between segments to avoid rate limiting
        if (i < segmentPrompts.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      res.status(200).json({
        success: true,
        data: videoSegments,
        message: `Generated ${videoSegments.length} video segments for ${videoLength}s total duration`,
        segments: videoSegments.length,
        totalDuration: videoLength
      });
    } else {
      // Generate single 2-second video
      const response = await axios.post('https://sahaniji-instant-video.hf.space/api/predict', {
        data: [
          prompt,
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
        message: 'Video generated successfully'
      });
    }
  } catch (error) {
    console.error('Error generating video:', error);
    res.status(500).json({ 
      error: 'Failed to generate video',
      details: error.message 
    });
  }
}
