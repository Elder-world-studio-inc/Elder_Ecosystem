import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react';

interface ComicReaderProps {
  pages: string[];
  title: string;
}

export default function ComicReader({ pages, title }: ComicReaderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Reset page when comic changes
  useEffect(() => {
    if (currentPage !== 0) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentPage(0);
    }
  }, [pages]);

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(curr => curr + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(curr => curr - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === 'ArrowLeft') prevPage();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, pages.length]);

  if (!pages || pages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <p>No pages available for this comic.</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center bg-gray-950 rounded-lg overflow-hidden ${isZoomed ? 'fixed inset-0 z-50' : 'relative min-h-[600px]'}`}>
      
      {/* Controls Header */}
      <div className={`w-full flex justify-between items-center p-4 bg-gray-900 text-gray-400 z-20 ${isZoomed ? 'fixed top-0' : 'relative'}`}>
        <div className="font-bold text-white truncate max-w-md">{title}</div>
        <div className="flex items-center gap-4">
          <span className="text-sm">Page {currentPage + 1} / {pages.length}</span>
          <button 
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-2 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
            title={isZoomed ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isZoomed ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </div>

      {/* Main Image Area */}
      <div className={`flex-1 flex items-center justify-center w-full relative overflow-hidden ${isZoomed ? 'h-screen pt-16 pb-24' : 'h-[800px] bg-gray-900/30'}`}>
        
        {/* Navigation Buttons (Overlay) */}
        <button 
          onClick={prevPage}
          disabled={currentPage === 0}
          className={`absolute left-4 p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all z-10 backdrop-blur-sm
            ${currentPage === 0 ? 'opacity-0 cursor-default pointer-events-none' : 'opacity-100 hover:scale-110'}`}
        >
          <ChevronLeft size={32} />
        </button>

        <div className="w-full h-full flex items-center justify-center p-4">
            <img 
              src={pages[currentPage]} 
              alt={`Page ${currentPage + 1}`} 
              className={`object-contain transition-all duration-300 ${isZoomed ? 'max-h-full max-w-full' : 'max-h-full max-w-full shadow-2xl'}`}
            />
        </div>

        <button 
          onClick={nextPage}
          disabled={currentPage === pages.length - 1}
          className={`absolute right-4 p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all z-10 backdrop-blur-sm
            ${currentPage === pages.length - 1 ? 'opacity-0 cursor-default pointer-events-none' : 'opacity-100 hover:scale-110'}`}
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* Thumbnails / Scrubber */}
      <div className={`w-full bg-gray-900 p-4 border-t border-gray-800 z-20 ${isZoomed ? 'fixed bottom-0' : 'relative'}`}>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700 px-4 justify-center">
          {pages.map((page, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`flex-shrink-0 w-12 h-16 rounded overflow-hidden border-2 transition-all relative ${
                currentPage === idx 
                  ? 'border-cyan-500 opacity-100 scale-110 z-10' 
                  : 'border-transparent opacity-40 hover:opacity-80'
              }`}
            >
              <img src={page} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
