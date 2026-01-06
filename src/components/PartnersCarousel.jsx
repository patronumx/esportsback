import { useState, useEffect } from 'react';

const PartnersCarousel = ({ partners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % partners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlay, partners.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 5000);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % partners.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 5000);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + partners.length) % partners.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 5000);
  };

  return (
    <div className="relative">
      {/* Main Carousel */}
      <div className="relative overflow-hidden rounded-2xl bg-brand-card backdrop-blur-xl border border-slate-800/50">
        {/* Slides Container */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {partners.map((partner, index) => (
            <div key={index} className="min-w-full p-12">
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Partner Logo/Info */}
                  <div className="text-center md:text-left space-y-4">
                    <div className="inline-block px-4 py-1.5 text-xs font-semibold rounded-full bg-violet-600/20 text-violet-400 border border-violet-600/30">
                      {partner.type}
                    </div>
                    <h3 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                      {partner.name}
                    </h3>
                    <p className="text-slate-400">
                      {partner.description}
                    </p>
                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-violet-500/50 transition-all duration-300 hover:-translate-y-0.5"
                      >
                        Visit Partner
                      </a>
                    )}
                  </div>

                  {/* Partner Visual */}
                  <div className="relative">
                    <div className="aspect-square rounded-2xl bg-gradient-to-br from-violet-600/20 to-purple-600/20 flex items-center justify-center text-6xl font-bold text-white/10 border border-slate-800/50">
                      {partner.logo || partner.name.charAt(0)}
                    </div>
                    {/* Stats Overlay */}
                    {partner.stats && (
                      <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-sm rounded-xl p-4 border border-slate-800/50">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          {Object.entries(partner.stats).map(([key, value], idx) => (
                            <div key={idx}>
                              <div className="text-xl font-bold text-violet-400">{value}</div>
                              <div className="text-xs text-slate-400 capitalize">{key}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/80 backdrop-blur-sm border border-slate-800/50 flex items-center justify-center text-slate-400 hover:text-violet-400 hover:border-violet-500/50 transition-all duration-300 hover:scale-110"
        >
          ←
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/80 backdrop-blur-sm border border-slate-800/50 flex items-center justify-center text-slate-400 hover:text-violet-400 hover:border-violet-500/50 transition-all duration-300 hover:scale-110"
        >
          →
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center gap-2 mt-6">
        {partners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-8 bg-gradient-to-r from-violet-600 to-purple-600'
                : 'w-2 bg-slate-700 hover:bg-slate-600'
            }`}
          />
        ))}
      </div>

      {/* Partner Grid Below */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {partners.map((partner, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`p-6 rounded-xl border transition-all duration-300 ${
              index === currentIndex
                ? 'bg-violet-600/10 border-violet-500/50 shadow-lg shadow-violet-500/20'
                : 'bg-brand-card border-slate-800/50 hover:border-violet-500/30'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">{partner.logo || partner.name.charAt(0)}</div>
              <div className="text-sm font-medium text-slate-300">{partner.name}</div>
              <div className="text-xs text-slate-500 mt-1">{partner.type}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PartnersCarousel;
