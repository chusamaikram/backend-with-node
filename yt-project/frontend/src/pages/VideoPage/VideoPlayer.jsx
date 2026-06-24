/**
 * VideoPlayer — wraps a native HTML5 video element.
 * Will use a real video URL in Sprint 3.
 */
function VideoPlayer({ video }) {
  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
      {video?.videoFile?.url ? (
        <video
          src={video.videoFile.url}
          controls
          className="size-full"
          aria-label={video.title}
        />
      ) : (
        /* Placeholder when no real video URL yet */
        <div className="size-full flex items-center justify-center">
          <img
            src={video?.thumbnail?.url}
            alt={video?.title}
            className="size-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <div className="w-0 h-0 border-t-8 border-b-8 border-l-14 border-transparent border-l-white ml-1" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
