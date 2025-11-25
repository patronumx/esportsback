import { useState } from 'react';

const VideoGallery = ({ videos }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...new Set(videos.map(v => v.category))];
  const filteredVideos = filter === 'All' ? videos : videos.filter(v => v.category === filter);

  return (
    <div className="space-y-8">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
              filter === category
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/50'
                : 'bg-brand-card text-slate-400 border border-slate-800/50 hover:border-violet-500/50 hover:text-violet-400'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video, index) => (
          <div
            key={index}
            onClick={() => setSelectedVideo(video)}
            className="group cursor-pointer relative overflow-hidden rounded-xl bg-brand-card backdrop-blur-xl border border-slate-800/50 hover:border-violet-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/20 hover:-translate-y-2"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gradient-to-br from-violet-900/30 to-purple-900/30 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-violet-600/80 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xl shadow-violet-500/50">
                  <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              </div>
              {/* Duration Badge */}
              {video.duration && (
                <div className="absolute bottom-3 right-3 px-2 py-1 text-xs font-semibold rounded bg-black/70 text-white">
                  {video.duration}
                </div>
              )}
              {/* Category Badge */}
              <div className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold rounded-full bg-violet-600/80 backdrop-blur-sm text-white">
                {video.category}
              </div>
            </div>

            {/* Info */}
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-slate-100 line-clamp-2 group-hover:text-violet-400 transition-colors">
                {video.title}
              </h3>
              <p className="text-sm text-slate-400 line-clamp-2">
                {video.description}
              </p>
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                <span>{video.date}</span>
                {video.views && <span>{video.views} views</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-violet-500/50 shadow-2xl shadow-violet-500/30"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-violet-600 transition-colors"
            >
              ✕
            </button>

            {/* Video Player Placeholder */}
            <div className="aspect-video bg-gradient-to-br from-violet-900/30 to-purple-900/30 flex items-center justify-center">
              <div className="text-center text-white space-y-4">
                <div className="text-6xl">🎬</div>
                <p className="text-sm text-slate-400">Video player placeholder</p>
                {selectedVideo.url && (
                  <a
                    href={selectedVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg font-medium hover:shadow-lg hover:shadow-violet-500/50 transition-all"
                  >
                    Watch on Platform
                  </a>
                )}
              </div>
            </div>

            {/* Video Info */}
            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-white">{selectedVideo.title}</h2>
              <p className="text-slate-300">{selectedVideo.description}</p>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span>{selectedVideo.date}</span>
                {selectedVideo.views && <span>{selectedVideo.views} views</span>}
                <span className="px-3 py-1 rounded-full bg-violet-600/20 text-violet-400 border border-violet-600/30">
                  {selectedVideo.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGallery;
