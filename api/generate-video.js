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
  
  // Create progressive prompts for truly consecutive videos
  for (let i = 0; i < segments; i++) {
    const progress = i / (segments - 1);
    let segmentPrompt = `Focus: ${focus}`;
    
    // Create truly consecutive story progression
    if (segments > 1) {
      if (animation.includes('jumping') || animation.includes('leaping')) {
        if (i === 0) segmentPrompt += ` (Animate: ${animation} - beginning phase)`;
        else if (i === segments - 1) segmentPrompt += ` (Animate: ${animation} - landing phase)`;
        else segmentPrompt += ` (Animate: ${animation} - mid-air phase)`;
      } else if (animation.includes('running') || animation.includes('walking')) {
        if (i === 0) segmentPrompt += ` (Animate: ${animation} - starting to move)`;
        else if (i === segments - 1) segmentPrompt += ` (Animate: ${animation} - reaching destination)`;
        else segmentPrompt += ` (Animate: ${animation} - mid-movement)`;
      } else if (animation.includes('zoom')) {
        const zoomDirection = animation.includes('out') ? 'out' : 'in';
        if (i === 0) segmentPrompt += ` (Animate: beginning to zoom ${zoomDirection})`;
        else if (i === segments - 1) segmentPrompt += ` (Animate: completing zoom ${zoomDirection})`;
        else segmentPrompt += ` (Animate: continuing zoom ${zoomDirection})`;
      } else if (animation.includes('pan')) {
        const panDirection = animation.includes('left') ? 'left' : animation.includes('right') ? 'right' : 'sideways';
        if (i === 0) segmentPrompt += ` (Animate: starting to pan ${panDirection})`;
        else if (i === segments - 1) segmentPrompt += ` (Animate: completing pan ${panDirection})`;
        else segmentPrompt += ` (Animate: continuing pan ${panDirection})`;
      } else {
        // Generic progression
        if (i === 0) segmentPrompt += ` (Animate: ${animation} - beginning)`;
        else if (i === segments - 1) segmentPrompt += ` (Animate: ${animation} - conclusion)`;
        else segmentPrompt += ` (Animate: ${animation} - progression)`;
      }
    } else {
      segmentPrompt += ` (Animate: ${animation})`;
    }
    
    // Add shot and season info if present
    if (shot) segmentPrompt += ` (Shot ${shot})`;
    if (season) segmentPrompt += ` (Season: ${season})`;
    
    // Add frame continuity for truly consecutive videos
    if (i === 0) segmentPrompt += ` (First frame of consecutive video)`;
    else if (i === segments - 1) segmentPrompt += ` (Final frame of consecutive video)`;
    else segmentPrompt += ` (Middle frame ${i} of consecutive video)`;
    
    // Add continuity markers for smooth transitions
    if (i > 0) segmentPrompt += ` (Last frame matches previous segment's end)`;
    if (i < segments - 1) segmentPrompt += ` (First frame matches next segment's start)`;
    
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
