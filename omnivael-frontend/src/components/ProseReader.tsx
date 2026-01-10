"use client";

import { useState, useRef, useEffect } from "react";
import { X, Type, Settings, Sun, Moon, ArrowLeft } from "lucide-react";
import styles from "./ProseReader.module.css";

interface ProseReaderProps {
  title: string;
  content: string; // HTML or Markdown string
  onExit: () => void;
}

type Theme = "dark" | "light" | "sepia";

export function ProseReader({ title, content, onExit }: ProseReaderProps) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [fontSize, setFontSize] = useState(18);
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close settings when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getThemeClass = () => {
    switch (theme) {
      case "light": return styles.themeLight;
      case "sepia": return styles.themeSepia;
      default: return styles.themeDark;
    }
  };

  // Save/Restore scroll position
  const contentAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Restore position on mount
    const savedPosition = localStorage.getItem(`prose_progress_${title}`);
    if (savedPosition && contentAreaRef.current) {
      contentAreaRef.current.scrollTop = parseInt(savedPosition, 10);
    }

    // Save position on scroll
    const handleScroll = () => {
      if (contentAreaRef.current) {
        localStorage.setItem(`prose_progress_${title}`, contentAreaRef.current.scrollTop.toString());
      }
    };

    const currentRef = contentAreaRef.current;
    currentRef?.addEventListener("scroll", handleScroll);
    return () => currentRef?.removeEventListener("scroll", handleScroll);
  }, [title]);

  return (
    <div className={`${styles.container} ${getThemeClass()}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.controls}>
             <button onClick={onExit} className={styles.iconButton} aria-label="Back">
                <ArrowLeft size={24} />
            </button>
            <h1 className={styles.title}>{title}</h1>
        </div>
        
        <div className={styles.controls}>
          <button 
            onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }} 
            className={styles.iconButton}
            aria-label="Appearance Settings"
          >
            <Type size={24} />
          </button>
          <button onClick={onExit} className={styles.iconButton} aria-label="Exit Reader">
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Settings Dropdown */}
      {showSettings && (
        <div className={styles.settingsMenu} ref={settingsRef}>
          <div className={styles.settingsRow}>
            <span className={styles.settingsLabel}>Theme</span>
            <div className={styles.themeToggles}>
              <button 
                className={`${styles.themeOption} ${theme === 'light' ? styles.active : ''}`}
                style={{ backgroundColor: '#f9f9f9' }}
                onClick={() => setTheme("light")}
                aria-label="Light Theme"
              />
               <button 
                className={`${styles.themeOption} ${theme === 'sepia' ? styles.active : ''}`}
                style={{ backgroundColor: '#f4ecd8' }}
                onClick={() => setTheme("sepia")}
                aria-label="Sepia Theme"
              />
               <button 
                className={`${styles.themeOption} ${theme === 'dark' ? styles.active : ''}`}
                style={{ backgroundColor: '#0a0a0a', borderColor: '#fff' }}
                onClick={() => setTheme("dark")}
                aria-label="Dark Theme"
              />
            </div>
          </div>
          
          <div className={styles.settingsRow}>
            <span className={styles.settingsLabel}>Size</span>
            <div className={styles.fontSizeControls}>
                <button 
                    className={styles.iconButton} 
                    onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                    disabled={fontSize <= 14}
                >
                    <span style={{ fontSize: '14px' }}>A</span>
                </button>
                <span style={{ minWidth: '24px', textAlign: 'center' }}>{fontSize}</span>
                <button 
                    className={styles.iconButton} 
                    onClick={() => setFontSize(Math.min(32, fontSize + 2))}
                    disabled={fontSize >= 32}
                >
                    <span style={{ fontSize: '20px' }}>A</span>
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={styles.contentArea} ref={contentAreaRef}>
        <article 
            className={styles.proseContainer} 
            style={{ fontSize: `${fontSize}px` }}
        >
             {/* Simple whitespace rendering for now, could be replaced with a markdown parser later */}
            {content.split('\n').map((paragraph, idx) => (
                paragraph.trim() ? <p key={idx}>{paragraph}</p> : <br key={idx} />
            ))}
        </article>
      </div>
    </div>
  );
}
