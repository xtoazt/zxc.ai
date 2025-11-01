// api/generate-video-pexels.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { prompt, duration, resolution } = req.body;

  if (!prompt) {
    return res.status(400).json({ success: false, message: 'Prompt is required.' });
  }

  const PEXELS_API_KEY = 'Ird8rfJTw92IdWaBmGrSqqm8yBd87iGOzHqmEZLdFNWAdhQjbBVCxiQX';

  const extractKeyTerms = (promptText) => {
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'shall'];
    
    const words = promptText.toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.includes(word));
    
    return words.slice(0, 3);
  };

  try {
    console.log('Pexels API Request:', { prompt, duration, resolution });

    // Try direct search first
    let response = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(prompt)}&per_page=5&orientation=landscape&size=large`, {
      headers: {
        'Authorization': PEXELS_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }

    let data = await response.json();

    // If no videos found, try generic search with key terms
    if (!data.videos || data.videos.length === 0) {
      const keyTerms = extractKeyTerms(prompt);
      const searchTerm = keyTerms.length > 0 ? keyTerms[0] : 'abstract';
      
      console.log('Pexels generic search:', searchTerm);
      
      response = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(searchTerm)}&per_page=10&orientation=landscape&size=large`, {
        headers: {
          'Authorization': PEXELS_API_KEY
        }
      });

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.status}`);
      }

      data = await response.json();
    }

    if (!data.videos || data.videos.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'No videos found matching your description',
        provider: 'pexels'
      });
    }

    // Get a random video from results
    const randomIndex = Math.floor(Math.random() * data.videos.length);
    const video = data.videos[randomIndex];

    // Find the best quality video file based on resolution preference
    let videoFile;

    if (resolution === '4k') {
      videoFile = video.video_files.find(file => 
        file.quality === 'uhd' || file.quality === 'hd'
      );
    } else if (resolution === '1080p') {
      videoFile = video.video_files.find(file => 
        file.quality === 'hd' || file.quality === 'sd'
      );
    } else {
      videoFile = video.video_files.find(file => 
        file.quality === 'sd' || file.quality === 'hd'
      );
    }

    // Fallback to first available video file
    if (!videoFile) {
      videoFile = video.video_files[0];
    }

    return res.status(200).json({
      success: true,
      data: videoFile.link,
      message: 'Video found successfully from Pexels',
      provider: 'pexels',
      model: 'Pexels Video Library',
      duration: Math.min(video.duration || duration, duration),
      resolution: resolution,
      attribution: `Video by ${video.user.name} from Pexels`,
      videoId: video.id,
      photographer: video.user.name,
      pexelsUrl: video.url
    });

  } catch (error) {
    console.error('Error searching Pexels videos:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to search videos from Pexels',
      provider: 'pexels'
    });
  }
}
