"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Maximize, Minimize, X } from "lucide-react";
import styles from "./ComicReader.module.css";

interface ComicReaderProps {
  pages: string[];
  title: string;
  onExit: () => void;
}

export function ComicReader({ pages, title, onExit }: ComicReaderProps) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`comic_progress_${title}`);
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`comic_progress_${title}`, currentIndex.toString());
    }
  }, [currentIndex, title]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const prevPage = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const nextPage = useCallback(() => {
    setCurrentIndex((prev) => (prev < pages.length - 1 ? prev + 1 : prev));
  }, [pages.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevPage();
      if (e.key === "ArrowRight") nextPage();
      if (e.key === "Escape") {
          if (document.fullscreenElement) {
              // Browser handles escape for fullscreen exit, we just sync state
              setIsFullscreen(false);
          } else {
              onExit();
          }
      }
    };
    
    const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    
    return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [prevPage, nextPage, onExit]);

  // Scroll active thumb into view
  const activeThumbRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (activeThumbRef.current) {
        activeThumbRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentIndex]);

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Header / Controls */}
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.controls}>
          <button onClick={toggleFullscreen} className={styles.iconButton} aria-label="Toggle Fullscreen">
            {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
          </button>
          <button onClick={onExit} className={styles.iconButton} aria-label="Exit Reader">
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Main Image */}
      <div className={styles.mainArea}>
        <button 
            onClick={prevPage} 
            disabled={currentIndex === 0}
            className={`${styles.navButton} ${styles.prevButton}`}
            aria-label="Previous Page"
        >
            <ChevronLeft size={48} />
        </button>

        <div className={styles.imageContainer}>
            {pages[currentIndex] && (
                 /* eslint-disable-next-line @next/next/no-img-element */
                 <img 
                    src={pages[currentIndex]} 
                    alt={`Page ${currentIndex + 1}`} 
                    className={styles.pageImage}
                 />
            )}
        </div>

        <button 
            onClick={nextPage} 
            disabled={currentIndex === pages.length - 1}
            className={`${styles.navButton} ${styles.nextButton}`}
            aria-label="Next Page"
        >
            <ChevronRight size={48} />
        </button>
      </div>

      {/* Scrubber */}
      <div className={styles.scrubber}>
        {pages.map((page, idx) => (
            <button
                key={idx}
                ref={idx === currentIndex ? activeThumbRef : null}
                onClick={() => setCurrentIndex(idx)}
                className={`${styles.thumbButton} ${idx === currentIndex ? styles.thumbActive : ""}`}
                aria-label={`Go to page ${idx + 1}`}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={page} alt={`Thumb ${idx + 1}`} className={styles.thumbImage} />
            </button>
        ))}
      </div>
    </div>
  );
}
