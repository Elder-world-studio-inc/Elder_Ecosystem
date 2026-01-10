"use client";

import React, { useState, useEffect } from 'react';
import { Upload, FileText, DollarSign, CheckCircle, Edit } from 'lucide-react';
import ContractSigningModal from '@/components/legal/ContractSigningModal';
import RouteGuard from '@/components/RouteGuard';
import { useAuth } from '@/app/context/AuthContext';
import { assetApi } from '@/lib/api';

interface Asset {
  assetId: string;
  contentMetadata: {
    title: string;
    type: string;
    genre: string;
  };
  financialTag: {
    shardPrice: number;
    releaseDate: string;
  };
  status: string;
  estimatedValue: number;
}

export default function ComicsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeAsset, setActiveAsset] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'library'>('upload');
  const [libraryAssets, setLibraryAssets] = useState<Asset[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);

  const [content, setContent] = useState(''); // Maybe description or script for comics
  const [title, setTitle] = useState('');
  const [chapter, setChapter] = useState('Issue #1');
  const [isMature, setIsMature] = useState(false);
  const [price, setPrice] = useState(200);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeTab === 'library') {
      fetchLibraryAssets();
    }
  }, [activeTab]);

  const fetchLibraryAssets = async () => {
    setIsLoadingLibrary(true);
    try {
      const response = await assetApi.getAll({ divisionId: 'creative' });
      // Filter for 'Comic' type
      const comics = response.data.filter((asset: Asset) => asset.contentMetadata.type === 'Comic');
      setLibraryAssets(comics);
    } catch (error) {
      console.error("Failed to fetch library assets:", error);
    } finally {
      setIsLoadingLibrary(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleSubmit = () => {
    if (selectedFiles.length === 0) {
        alert("Please select at least one file to upload.");
        return;
    }

    const displayTitle = selectedFiles.length > 1 
        ? `${title || 'Bulk Upload'} (${selectedFiles.length} files)` 
        : (title || selectedFiles[0]?.name);
    
    const totalValue = price * selectedFiles.length;

    setActiveAsset({
      name: displayTitle,
      value: totalValue,
      financialTag: {
        shardPrice: price,
        releaseDate: new Date().toISOString().split('T')[0]
      },
      estimatedValue: totalValue,
      ipStatus: 'Work_for_Hire'
    });
    setIsModalOpen(true);
  };

  const handleSigningSuccess = async (signerName: string) => {
    try {
        if (selectedFiles.length === 0) return;

        let successCount = 0;
        
        for (const file of selectedFiles) {
            const formData = new FormData();
            formData.append('creatorId', user?.id || 'unknown');
            formData.append('divisionId', 'creative');
            // Use provided title or fallback to filename (without extension)
            const assetTitle = title || file.name.replace(/\.[^/.]+$/, "");
            
            formData.append('contentMetadata', JSON.stringify({
                title: assetTitle,
                chapter,
                type: 'Comic',
                genre: 'Fantasy',
                content,
                mature: isMature
            }));
            formData.append('financialTag', JSON.stringify({
                shardPrice: price,
                releaseDate: new Date().toISOString().split('T')[0]
            }));
            formData.append('estimatedValue', String(price));
            formData.append('ipStatus', 'Work_for_Hire');

            formData.append('file', file);

            await assetApi.create(formData);
            successCount++;
        }

        alert(`Successfully published ${successCount} comic(s) to Omnivael Reader!`);
        // Reset form
        setTitle('');
        setContent('');
        setSelectedFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    } catch (err) {
        console.error("Failed to publish asset:", err);
        alert("Failed to publish one or more assets. Please check console for details.");
    }
  };

  if (authLoading || !user) {
    return <div className="min-h-screen bg-black text-white p-8">Loading...</div>;
  }

  return (
    <RouteGuard allowedDivision="creative">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-2xl font-bold text-white tracking-widest uppercase">Comics Workflow</h1>
          
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'upload' 
                  ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                  : 'bg-gray-900 text-gray-400 border border-gray-800 hover:bg-gray-800'
              }`}
            >
              UPLOAD COMIC
            </button>
            <button 
              onClick={() => setActiveTab('library')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'library' 
                  ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-500/50' 
                  : 'bg-gray-900 text-gray-400 border border-gray-800 hover:bg-gray-800'
              }`}
            >
              MANAGE COMICS
            </button>
          </div>
        </div>

        {activeTab === 'upload' ? (
          <>
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Upload */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Upload Area */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 h-[300px]">
                  <h3 className="text-xs font-bold text-gray-400 uppercase mb-4">Upload Comic Pages (PDF/CBZ)</h3>
                  <div 
                    onClick={handleUploadClick}
                    className="h-[220px] border-2 border-dashed border-cyan-900/30 bg-gray-950/50 rounded-lg flex flex-col items-center justify-center text-center p-6 group hover:border-cyan-500/30 transition-colors cursor-pointer relative overflow-hidden"
                  >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileSelect} 
                        className="hidden" 
                        accept=".pdf,.cbz,.jpg,.png"
                        multiple 
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-900/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Upload className="text-gray-600 group-hover:text-cyan-400 mb-4 transition-colors" size={48} />
                    {selectedFiles.length > 0 ? (
                        <div className="z-10 w-full max-h-[160px] overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                            {selectedFiles.map((file, idx) => (
                                <div key={idx} className="mb-2 last:mb-0 p-2 bg-gray-900/80 rounded border border-gray-800/50 flex justify-between items-center">
                                    <div className="text-left overflow-hidden">
                                        <p className="text-cyan-400 font-bold text-xs truncate max-w-[180px]">{file.name}</p>
                                        <p className="text-gray-500 text-[10px]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <CheckCircle size={14} className="text-cyan-500/50" />
                                </div>
                            ))}
                            <p className="text-gray-400 text-xs mt-2 font-medium sticky bottom-0 bg-gray-950/80 py-1 backdrop-blur-sm border-t border-gray-800">
                                {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-400 font-medium z-10">Drag & Drop or Click to Upload (Bulk Supported)</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Comic Details/Script */}
              <div className="lg:col-span-8">
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 h-full flex flex-col">
                  <h3 className="text-xs font-bold text-gray-400 uppercase mb-4">Comic Description / Script</h3>
                  
                  {/* Editor Toolbar */}
                  <div className="flex items-center gap-2 mb-2 p-2 bg-gray-950 rounded-t-lg border border-gray-800 border-b-0">
                    <div className="flex gap-1 border-r border-gray-800 pr-2">
                      <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded"><FileText size={14} /></button>
                      <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded font-bold">B</button>
                      <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded italic">I</button>
                    </div>
                    <div className="flex-1" />
                    <button className="flex items-center gap-1.5 px-3 py-1 bg-cyan-900/20 text-cyan-400 border border-cyan-500/30 rounded text-xs font-bold hover:bg-cyan-900/30 transition-colors">
                      <span className="text-lg leading-none">∞</span> ADD LORE TAG
                    </button>
                  </div>

                  {/* Editor Content */}
                  <div className="flex-1 bg-white rounded-b-lg p-0 text-gray-900 font-serif relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-50 z-10" />
                    <textarea
                        className="w-full h-full p-8 resize-none outline-none text-lg leading-relaxed bg-transparent z-0"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Enter comic description or script details here..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer: Metadata & Monetization */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-6">Metadata & Monetization</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                <div className="md:col-span-5 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Comic Title</label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm focus:border-gray-600 outline-none" 
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-1">
                      <label className="text-xs text-gray-500">Issue Number</label>
                      <select 
                        value={chapter}
                        onChange={(e) => setChapter(e.target.value)}
                        className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm focus:border-gray-600 outline-none appearance-none"
                      >
                        <option>Issue #1</option>
                        <option>Issue #2</option>
                        <option>Issue #3</option>
                        <option>Graphic Novel</option>
                      </select>
                    </div>
                    <div className="flex-1 flex items-center gap-3">
                      <span className="text-sm text-gray-400 whitespace-nowrap">Mature (18+)</span>
                      <div 
                        onClick={() => setIsMature(!isMature)}
                        className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${isMature ? 'bg-red-900' : 'bg-gray-800'}`}
                      >
                        <div className={`w-3 h-3 rounded-full absolute top-1 transition-all ${isMature ? 'bg-red-500 left-6' : 'bg-gray-500 left-1'}`} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-3 space-y-1">
                   <label className="text-xs text-gray-500">Price (Shards)</label>
                   <div className="relative">
                     <DollarSign size={14} className="absolute left-3 top-3 text-gray-500" />
                     <select 
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm focus:border-gray-600 outline-none appearance-none"
                     >
                        <option value={200}>200 Shards ($1.99)</option>
                        <option value={300}>300 Shards ($2.99)</option>
                     </select>
                     <div className="absolute right-3 top-3 pointer-events-none text-gray-500">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                     </div>
                   </div>
                </div>

                <div className="md:col-span-4 flex items-center justify-end gap-4">
                  <button className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                    SAVE DRAFT
                  </button>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-colors">
                    <CheckCircle size={16} /> PREVIEW
                  </button>
                  <button 
                    onClick={handleSubmit}
                    className="bg-cyan-900/80 hover:bg-cyan-800 text-cyan-100 border border-cyan-500/30 px-6 py-2.5 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all"
                  >
                    {selectedFiles.length > 1 ? `PUBLISH ${selectedFiles.length} COMICS` : 'PUBLISH COMIC'}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
               {/* Table Header */}
               <div className="grid grid-cols-12 gap-4 p-4 bg-gray-950/50 border-b border-gray-800 text-xs font-bold text-gray-400 uppercase tracking-wider">
                 <div className="col-span-5">Title</div>
                 <div className="col-span-2">Type</div>
                 <div className="col-span-2">Status</div>
                 <div className="col-span-2">Price</div>
                 <div className="col-span-1 text-right">Actions</div>
               </div>

               {/* Table Body */}
               <div className="divide-y divide-gray-800">
                 {isLoadingLibrary ? (
                    <div className="p-8 text-center text-gray-500">Loading comics...</div>
                 ) : libraryAssets.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No comics found.</div>
                 ) : (
                    libraryAssets.map((asset) => (
                      <div key={asset.assetId} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-800/50 transition-colors">
                        <div className="col-span-5">
                          <div className="font-medium text-white">{asset.contentMetadata.title}</div>
                          <div className="text-xs text-gray-500">{asset.assetId}</div>
                        </div>
                        <div className="col-span-2">
                          <span className="px-2 py-1 rounded text-xs bg-gray-800 text-gray-300 border border-gray-700">
                            {asset.contentMetadata.type}
                          </span>
                        </div>
                        <div className="col-span-2">
                           <span className={`px-2 py-1 rounded text-xs font-bold ${
                             asset.status === 'SIGNED' ? 'bg-green-900/30 text-green-400 border border-green-500/30' :
                             asset.status === 'IN-REVIEW' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30' :
                             'bg-gray-800 text-gray-400 border border-gray-700'
                           }`}>
                             {asset.status}
                           </span>
                        </div>
                        <div className="col-span-2 text-sm text-gray-300">
                          {asset.financialTag.shardPrice} Shards
                        </div>
                        <div className="col-span-1 flex justify-end gap-2">
                          <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
                            <Edit size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                 )}
               </div>
            </div>
          </div>
        )}

        {activeAsset && (
          <ContractSigningModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            assetName={activeAsset.name}
            assetValue={activeAsset.value}
            onSuccess={handleSigningSuccess}
          />
        )}
      </div>
    </RouteGuard>
  );
}
