import React from 'react';
import { Download, Play, AlertCircle, CheckCircle } from 'lucide-react';

interface VideoDisplayProps {
  result: {
    success: boolean;
    data?: any;
    message?: string;
    error?: string;
  };
}

const VideoDisplay: React.FC<VideoDisplayProps> = ({ result }) => {
  // Debug logging
  console.log('VideoDisplay received result:', result);

  const handleDownload = (videoUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!result.success) {
    return (
      <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <AlertCircle className="w-6 h-6 text-red-400 mr-3" />
          <h3 className="text-xl font-semibold text-red-400">Generation Failed</h3>
        </div>
        <p className="text-red-300">
          {result.error || 'An error occurred while generating the video. Please try again.'}
        </p>
      </div>
    );
  }

  // Extract video URL(s) from the result
  const getVideoUrls = () => {
    console.log('Extracting video URLs from result:', result);
    
    // Handle Vider.ai results (single video URL)
    if (result.provider === 'vider-ai' && result.data) {
      console.log('Vider.ai result detected:', result.data);
      return [{ segment: 1, url: result.data, prompt: 'Image-to-video generated with Vider.ai' }];
    }
    
    // Handle Instant Video results (multiple segments or single video)
    if (result.data) {
      console.log('Processing Instant Video result data:', result.data);
      
      // Check if result.data is an array
      if (Array.isArray(result.data) && result.data.length > 0) {
        // Check if it's multiple segments (long video)
        if (result.data[0].segment) {
          // Multiple segments
          const segments = result.data.map((segment: any) => ({
            segment: segment.segment,
            url: segment.data && segment.data[0] ? segment.data[0].video : null,
            prompt: segment.prompt
          })).filter((item: any) => item.url);
          console.log('Multiple segments found:', segments);
          return segments;
        } else {
          // Single video in array format
          const videoData = result.data[0];
          if (videoData && videoData.video) {
            console.log('Single video in array format:', videoData.video);
            return [{ segment: 1, url: videoData.video, prompt: 'Single video' }];
          }
        }
      } else if (typeof result.data === 'string') {
        // Direct video URL string
        console.log('Direct video URL string:', result.data);
        return [{ segment: 1, url: result.data, prompt: 'Single video' }];
      } else if (result.data && result.data.video) {
        // Single video object
        console.log('Single video object:', result.data.video);
        return [{ segment: 1, url: result.data.video, prompt: 'Single video' }];
      }
    }
    
    console.log('No video URLs found in result');
    return [];
  };

  const videoUrls = getVideoUrls();
  const isMultiSegment = videoUrls.length > 1;

  if (videoUrls.length === 0) {
    return (
      <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <AlertCircle className="w-6 h-6 text-yellow-400 mr-3" />
          <h3 className="text-xl font-semibold text-yellow-400">No Video Generated</h3>
        </div>
        <p className="text-yellow-300 mb-4">
          The generation completed but no video was returned. Please try again with different parameters.
        </p>
        <div className="bg-black/50 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2">Debug Info:</h4>
          <pre className="text-xs text-gray-300 overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-6">
      <div className="flex items-center mb-6">
        <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
        <h3 className="text-xl font-semibold text-green-400">Video Generated Successfully!</h3>
      </div>

      <div className="space-y-4">
        {/* Video Player(s) */}
        {isMultiSegment ? (
          <div className="space-y-4">
            <h4 className="text-white font-semibold">
              {result.isTransition ? 'TikTok Transition' : 'Consecutive Video'} - {videoUrls.length} Segments ({result.totalDuration || videoUrls.length * 2}s total)
            </h4>
            {result.isTransition && (
              <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3">
                <p className="text-blue-200 text-sm">
                  🎬 This is a TikTok-style transition video. Each segment flows seamlessly into the next!
                </p>
              </div>
            )}
            {!result.isTransition && videoUrls.length > 1 && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
                <p className="text-green-200 text-sm">
                  🔗 This is a consecutive video. Each segment continues the story from the previous frame!
                </p>
              </div>
            )}
            {videoUrls.map((video: any, index: number) => (
              <div key={index} className="space-y-2">
                <h5 className="text-blue-200 text-sm font-medium">
                  Segment {video.segment}: {video.prompt.substring(0, 60)}...
                </h5>
                <div className="video-container">
                  <video
                    src={video.url}
                    controls
                    className="w-full h-full"
                    poster=""
                    onLoadStart={() => console.log('Video loading started:', video.url)}
                    onLoadedData={() => console.log('Video data loaded:', video.url)}
                    onError={(e) => console.error('Video load error:', e, video.url)}
                  >
                    Your browser does not support the video tag.
                  </video>
                  <div className="mt-2 text-xs text-gray-400">
                    Video URL: {video.url}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="video-container">
            <video
              src={videoUrls[0]?.url}
              controls
              className="w-full h-full"
              poster=""
              onLoadStart={() => console.log('Video loading started:', videoUrls[0]?.url)}
              onLoadedData={() => console.log('Video data loaded:', videoUrls[0]?.url)}
              onError={(e) => console.error('Video load error:', e, videoUrls[0]?.url)}
            >
              Your browser does not support the video tag.
            </video>
            <div className="mt-2 text-xs text-gray-400">
              Video URL: {videoUrls[0]?.url}
            </div>
          </div>
        )}

        {/* Video Info */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
          <h4 className="text-white font-semibold mb-2">Generated Video</h4>
          <p className="text-blue-100 text-sm mb-4">
            {result.message || 'Your video has been generated successfully!'}
          </p>
          
          {/* Download Buttons */}
          {isMultiSegment ? (
            <div className="space-y-2">
              <button
                onClick={() => {
                  videoUrls.forEach((video: any, index: number) => {
                    setTimeout(() => {
                      handleDownload(video.url, `segment-${video.segment}-${Date.now()}.mp4`);
                    }, index * 1000);
                  });
                }}
                className="btn-secondary px-6 py-3 rounded-xl text-white font-semibold flex items-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Download All Segments
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleDownload(videoUrls[0]?.url, `generated-video-${Date.now()}.mp4`)}
              className="btn-secondary px-6 py-3 rounded-xl text-white font-semibold flex items-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Video
            </button>
          )}
        </div>

        {/* Additional Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              const videos = document.querySelectorAll('video');
              videos.forEach(video => {
                if (video) {
                  video.play();
                }
              });
            }}
            className="btn-secondary px-4 py-2 rounded-lg text-white font-medium flex items-center"
          >
            <Play className="w-4 h-4 mr-2" />
            Play All
          </button>
          
          <button
            onClick={() => {
              const urls = videoUrls.map((v: any) => v.url).join('\n');
              navigator.clipboard.writeText(urls);
              alert('Video URL(s) copied to clipboard!');
            }}
            className="btn-secondary px-4 py-2 rounded-lg text-white font-medium"
          >
            Copy URLs
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoDisplay;
