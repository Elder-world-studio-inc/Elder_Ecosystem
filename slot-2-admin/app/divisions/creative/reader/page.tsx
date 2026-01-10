"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import RouteGuard from '@/components/RouteGuard';
import ComicReader from '@/components/ComicReader';
import { useAuth } from '@/app/context/AuthContext';
import { assetApi } from '@/lib/api';

interface Asset {
  assetId: string;
  contentMetadata: {
    title: string;
    type: string;
    genre: string;
    content: string;
    chapter?: string;
    pages?: string[];
  };
  status: string;
}

export default function ReaderPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [libraryAssets, setLibraryAssets] = useState<Asset[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  useEffect(() => {
    fetchLibraryAssets();
  }, []);

  const fetchLibraryAssets = async () => {
    setIsLoadingLibrary(true);
    try {
      const response = await assetApi.getAll({ divisionId: 'creative' });
      setLibraryAssets(response.data);
    } catch (error) {
      console.error("Failed to fetch library assets:", error);
    } finally {
      setIsLoadingLibrary(false);
    }
  };

  if (authLoading || !user) {
    return <div className="min-h-screen bg-black text-white p-8">Loading...</div>;
  }

  const getComicPages = (asset: Asset): string[] => {
    if (asset.contentMetadata.pages && asset.contentMetadata.pages.length > 0) {
      return asset.contentMetadata.pages;
    }
    
    // Try parsing content as JSON array
    if (asset.contentMetadata.content) {
      try {
        const parsed = JSON.parse(asset.contentMetadata.content);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        // Not JSON
      }
    }
    
    return [];
  };

  return (
    <RouteGuard allowedDivision="creative">
      <div className="h-[calc(100vh-6rem)] max-w-7xl mx-auto flex gap-6">
        
        {/* Sidebar: Library List */}
        <div className="w-1/3 bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-800 bg-gray-950/50">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <BookOpen size={16} /> Library
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {isLoadingLibrary ? (
              <div className="p-8 text-center text-gray-500 text-sm">Loading library...</div>
            ) : libraryAssets.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">No assets found.</div>
            ) : (
              libraryAssets.map((asset) => (
                <div 
                  key={asset.assetId}
                  onClick={() => setSelectedAsset(asset)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                    selectedAsset?.assetId === asset.assetId 
                      ? 'bg-cyan-900/20 border-cyan-500/30' 
                      : 'bg-gray-950 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`font-medium text-sm ${selectedAsset?.assetId === asset.assetId ? 'text-cyan-400' : 'text-white'}`}>
                        {asset.contentMetadata.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {asset.contentMetadata.chapter || 'One Shot'} • {asset.contentMetadata.type}
                      </p>
                    </div>
                    {asset.contentMetadata.type === 'Comic' ? (
                        <ImageIcon size={14} className="text-gray-600" />
                    ) : (
                        <BookOpen size={14} className="text-gray-600" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Content: Reader */}
        <div className="flex-1 bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden flex flex-col">
          {selectedAsset ? (
            <>
              <div className="p-4 border-b border-gray-800 bg-gray-950/50 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-white tracking-wide">{selectedAsset.contentMetadata.title}</h2>
                    <p className="text-xs text-gray-400">{selectedAsset.contentMetadata.chapter}</p>
                </div>
                <button 
                    onClick={() => setSelectedAsset(null)}
                    className="md:hidden p-2 text-gray-400 hover:text-white"
                >
                    <ArrowLeft size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto bg-white/5 p-8 relative">
                 {/* Reader Content Container */}
                 <div className="max-w-4xl mx-auto min-h-full">
                    {selectedAsset.contentMetadata.type === 'Comic' ? (
                        <ComicReader 
                          pages={getComicPages(selectedAsset)} 
                          title={selectedAsset.contentMetadata.title} 
                        />
                    ) : (
                        <div className="bg-white text-gray-900 shadow-2xl p-12 font-serif text-lg leading-relaxed whitespace-pre-wrap min-h-[600px]">
                            <h1 className="text-3xl font-bold mb-8 text-center">{selectedAsset.contentMetadata.title}</h1>
                            {selectedAsset.contentMetadata.content || (
                                <p className="text-gray-400 italic text-center">No content available.</p>
                            )}
                        </div>
                    )}
                 </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 space-y-4">
              <BookOpen size={48} className="opacity-20" />
              <p>Select a story or comic from the library to start reading</p>
            </div>
          )}
        </div>
      </div>
    </RouteGuard>
  );
}
