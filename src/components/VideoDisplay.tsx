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
      <div className="bg-gradient-to-br from-red-500/20 via-orange-500/10 to-red-500/20 border border-red-500/50 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mr-4">
            <AlertCircle className="w-7 h-7 text-red-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-red-400">Generation Failed</h3>
            <p className="text-gray-400 text-sm mt-1">Please try again or contact support</p>
          </div>
        </div>
        <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-200 font-medium">
            {result.error || 'An error occurred while generating the video. Please try again.'}
          </p>
        </div>
        {result.error && result.error.length > 100 && (
          <details className="mt-4">
            <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">Show technical details</summary>
            <pre className="mt-2 text-xs text-gray-500 bg-black/50 p-3 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        )}
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
    
    // Handle Hugging Face results
    if (result.provider === 'huggingface' && result.data) {
      console.log('Hugging Face result detected:', result.data);
      return [{ segment: 1, url: result.data, prompt: 'AI-generated video with Hugging Face' }];
    }
    
    // Handle Replicate results
    if (result.provider === 'replicate' && result.data) {
      console.log('Replicate result detected:', result.data);
      return [{ segment: 1, url: result.data, prompt: 'AI-generated video with Replicate' }];
    }
    
    // Handle Pexels results
    if (result.provider === 'pexels' && result.data) {
      console.log('Pexels result detected:', result.data);
      return [{ segment: 1, url: result.data, prompt: 'Video from Pexels library' }];
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
      <div className="bg-gradient-to-br from-yellow-500/20 via-orange-500/10 to-yellow-500/20 border border-yellow-500/50 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mr-4">
            <AlertCircle className="w-7 h-7 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-yellow-400">No Video Generated</h3>
            <p className="text-gray-400 text-sm mt-1">Generation completed but no video returned</p>
          </div>
        </div>
        <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-xl p-4 mb-4">
          <p className="text-yellow-200">
            The generation completed but no video was returned. Please try again with different parameters.
          </p>
        </div>
        <details className="bg-black/50 rounded-lg p-4">
          <summary className="text-white font-semibold mb-2 cursor-pointer hover:text-gray-300">Show Debug Info</summary>
          <pre className="text-xs text-gray-300 overflow-auto mt-2 max-h-60">
            {JSON.stringify(result, null, 2)}
          </pre>
        </details>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-500/20 via-blue-500/20 to-purple-500/20 border border-green-500/50 rounded-2xl p-8 shadow-xl">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mr-4">
          <CheckCircle className="w-7 h-7 text-green-400" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-green-400">Video Generated Successfully!</h3>
          <p className="text-gray-400 text-sm mt-1">Ready to view and download</p>
        </div>
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
                <div className="video-container bg-black/50 rounded-xl overflow-hidden border border-gray-700/50">
                  <video
                    src={video.url}
                    controls
                    className="w-full h-auto max-h-[500px]"
                    poster=""
                    preload="metadata"
                    onLoadStart={() => console.log('Video loading started:', video.url)}
                    onLoadedData={() => console.log('Video data loaded:', video.url)}
                    onError={(e) => {
                      console.error('Video load error:', e, video.url);
                      // Show user-friendly error
                      const target = e.target as HTMLVideoElement;
                      if (target) {
                        target.style.display = 'none';
                      }
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="video-container bg-black/50 rounded-xl overflow-hidden border border-gray-700/50 shadow-2xl">
            <video
              src={videoUrls[0]?.url}
              controls
              className="w-full h-auto max-h-[600px]"
              poster=""
              preload="metadata"
              onLoadStart={() => console.log('Video loading started:', videoUrls[0]?.url)}
              onLoadedData={() => console.log('Video data loaded:', videoUrls[0]?.url)}
              onError={(e) => {
                console.error('Video load error:', e, videoUrls[0]?.url);
                const target = e.target as HTMLVideoElement;
                if (target) {
                  target.style.display = 'none';
                }
              }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {/* Video Info */}
        <div className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-lg">
          <h4 className="text-white font-bold mb-3 text-lg">Generated Video</h4>
          <p className="text-blue-100 text-sm mb-6">
            {result.message || 'Your video has been generated successfully!'}
          </p>
          
          {/* Provider Info */}
          {(result.provider || result.model) && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30 shadow-md">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Provider:</span>
                <span className="text-white font-semibold">
                  {result.provider === 'huggingface' && '🤗 Hugging Face'}
                  {result.provider === 'replicate' && '🔄 Replicate'}
                  {result.provider === 'pexels' && '📹 Pexels'}
                  {result.provider === 'vider-ai' && '🎬 Vider.ai'}
                  {!result.provider && result.model}
                </span>
              </div>
              {result.model && result.provider && (
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-300">Model:</span>
                  <span className="text-white font-medium">{result.model}</span>
                </div>
              )}
              {result.resolution && (
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-300">Resolution:</span>
                  <span className="text-white font-medium">{result.resolution}</span>
                </div>
              )}
              {result.duration && (
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-300">Duration:</span>
                  <span className="text-white font-medium">{result.duration}s</span>
                </div>
              )}
              {result.attribution && (
                <div className="mt-2 pt-2 border-t border-blue-500/20">
                  <p className="text-xs text-gray-400 italic">{result.attribution}</p>
                </div>
              )}
            </div>
          )}
          
          {/* Download Buttons */}
          <div className="flex gap-3">
            {isMultiSegment ? (
              <button
                onClick={() => {
                  videoUrls.forEach((video: any, index: number) => {
                    setTimeout(() => {
                      handleDownload(video.url, `segment-${video.segment}-${Date.now()}.mp4`);
                    }, index * 1000);
                  });
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl text-white font-semibold flex items-center transition-all shadow-lg"
              >
                <Download className="w-5 h-5 mr-2" />
                Download All Segments
              </button>
            ) : (
              <button
                onClick={() => handleDownload(videoUrls[0]?.url, `generated-video-${Date.now()}.mp4`)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl text-white font-semibold flex items-center transition-all shadow-lg"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Video
              </button>
            )}
          </div>
        </div>

        {/* Additional Actions */}
        <div className="flex flex-wrap gap-3 mt-4">
          <button
            onClick={() => {
              const videos = document.querySelectorAll('video');
              videos.forEach(video => {
                if (video) {
                  video.play();
                }
              });
            }}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-white font-medium flex items-center transition-colors"
          >
            <Play className="w-4 h-4 mr-2" />
            Play All
          </button>
          
          <button
            onClick={async () => {
              const urls = videoUrls.map((v: any) => v.url).join('\n');
              try {
                await navigator.clipboard.writeText(urls);
                alert('Video URL(s) copied to clipboard!');
              } catch (err) {
                console.error('Failed to copy:', err);
              }
            }}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-white font-medium transition-colors"
          >
            Copy URLs
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoDisplay;
