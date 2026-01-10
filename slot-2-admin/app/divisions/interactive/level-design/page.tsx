"use client";

import React, { useState, useEffect } from 'react';
import { Map, Flag, PlusCircle, Gamepad2, ChevronDown, X } from 'lucide-react';
import RouteGuard from '@/components/RouteGuard';
import { interactiveApi } from '@/lib/api';
import { useAuth } from '@/app/context/AuthContext';

// --- Types ---
interface Zone {
  id: number;
  name: string;
  status: 'live' | 'progress' | 'draft';
  x: number;
  y: number;
}

interface Request {
  id: number;
  title: string;
  desc: string;
  priority: 'high' | 'medium' | 'low';
}

interface Project {
  id: string;
  name: string;
  description: string;
  zones: Zone[];
  requests: Request[];
}

export default function LevelDesignPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRequest, setNewRequest] = useState<{ title: string; desc: string; priority: 'high' | 'medium' | 'low' }>({
    title: '',
    desc: '',
    priority: 'medium'
  });

  const fetchProjects = async () => {
    try {
      const response = await interactiveApi.getProjects();
      setProjects(response.data);
      if (response.data.length > 0 && !selectedProjectId) {
        setSelectedProjectId(response.data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  useEffect(() => {
    if (authLoading || !user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects();
  }, [authLoading, user]);

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const handleAddRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequest.title || !newRequest.desc) return;

    const newReq: Request = {
      id: Date.now(),
      ...newRequest
    };

    try {
      await interactiveApi.requestAsset({
        projectId: selectedProjectId,
        request: newReq
      });
      fetchProjects();
      setIsModalOpen(false);
      setNewRequest({ title: '', desc: '', priority: 'medium' });
    } catch (error) {
      console.error('Failed to add request:', error);
      alert('Failed to add request');
    }
  };

  const getZoneColor = (status: string) => {
    switch(status) {
        case 'live': return 'bg-green-500 border-green-400';
        case 'progress': return 'bg-yellow-500 border-yellow-400 animate-pulse';
        default: return 'bg-red-500 border-red-400';
    }
  };

  if (projects.length === 0) {
    return (
      <RouteGuard allowedDivision="interactive">
        <div className="p-8 text-white">Loading projects...</div>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard allowedDivision="interactive">
      <div className="space-y-8">
        
        {/* Header & Project Selection */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Level Design Task Board</h1>
            <p className="text-gray-400 mt-1">World Map Progress & Asset Requests</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Project Selector */}
            <div className="relative group">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white cursor-pointer hover:border-gray-500 transition-colors">
                <Gamepad2 size={18} className="text-purple-400" />
                <span className="font-medium min-w-[140px]">{selectedProject.name}</span>
                <ChevronDown size={16} className="text-gray-400" />
              </div>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden hidden group-hover:block z-50">
                {projects.map(project => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProjectId(project.id)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-800 transition-colors flex flex-col ${selectedProjectId === project.id ? 'bg-gray-800 border-l-2 border-purple-500' : ''}`}
                  >
                    <span className="text-white font-medium text-sm">{project.name}</span>
                    <span className="text-gray-500 text-xs mt-0.5 truncate">{project.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors">
              <PlusCircle size={16} />
              New Zone
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Zone Status Map */}
          <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-900/30 rounded-lg text-blue-400">
                  <Map size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">World Map Tracker</h3>
                  <p className="text-xs text-gray-500">Project: <span className="text-blue-400">{selectedProject.name}</span></p>
                </div>
              </div>
            </div>

            <div className="aspect-video bg-gray-950 border border-gray-800 rounded-lg relative overflow-hidden group">
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-10" style={{ 
                    backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}></div>

                {/* Zones */}
                {selectedProject.zones.map((zone) => (
                    <div 
                        key={zone.id}
                        className={`absolute w-16 h-16 rounded-full border-4 opacity-80 hover:opacity-100 cursor-pointer transition-all transform hover:scale-110 flex items-center justify-center ${getZoneColor(zone.status)}`}
                        style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                    >
                        <span className="text-[10px] font-bold text-black bg-white/80 px-1 rounded truncate max-w-full">
                            {zone.name.split('_')[0]}
                        </span>
                    </div>
                ))}

                {/* Legend */}
                <div className="absolute bottom-4 right-4 bg-gray-900/90 border border-gray-800 p-3 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-1 text-xs text-gray-300">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div> Finalized / Live
                    </div>
                    <div className="flex items-center gap-2 mb-1 text-xs text-gray-300">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div> In-Progress
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div> Empty / Draft
                    </div>
                </div>
            </div>
          </div>

          {/* Asset Requirement List */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
             <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-900/30 rounded-lg text-orange-400">
                <Flag size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-white">Asset Requests</h3>
                <p className="text-xs text-gray-500">{selectedProject.requests.length} active requests</p>
              </div>
            </div>

            <div className="space-y-4">
                {selectedProject.requests.map((req) => (
                    <div key={req.id} className="bg-gray-950 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="text-white font-medium text-sm">{req.title}</h4>
                            <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                                req.priority === 'high' ? 'bg-red-900/30 text-red-400' :
                                req.priority === 'medium' ? 'bg-yellow-900/30 text-yellow-400' :
                                'bg-blue-900/30 text-blue-400'
                            }`}>
                                {req.priority}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                            {req.desc}
                        </p>
                        <div className="flex gap-2">
                             <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-1.5 rounded text-xs transition-colors">
                                View
                             </button>
                             <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-1.5 rounded text-xs transition-colors">
                                Assign
                             </button>
                        </div>
                    </div>
                ))}

                {selectedProject.requests.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        No pending requests for this project.
                    </div>
                )}

                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-3 border border-dashed border-gray-700 rounded-lg text-gray-500 hover:text-white hover:border-gray-500 text-sm transition-colors flex items-center justify-center gap-2"
                >
                    <PlusCircle size={16} />
                    Request New Asset
                </button>
            </div>
          </div>

        </div>

        {/* New Asset Request Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-gray-800">
                <h3 className="text-lg font-bold text-white">New Asset Request</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleAddRequest} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Asset Title</label>
                  <input 
                    type="text"
                    value={newRequest.title}
                    onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                    placeholder="e.g., Ancient Stone Pillar"
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 text-sm"
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Description</label>
                  <textarea 
                    value={newRequest.desc}
                    onChange={(e) => setNewRequest({...newRequest, desc: e.target.value})}
                    placeholder="Describe the asset requirements, style, and usage..."
                    rows={4}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 text-sm resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Priority</label>
                  <div className="flex gap-2">
                    {(['low', 'medium', 'high'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewRequest({...newRequest, priority: p})}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize border transition-colors ${
                          newRequest.priority === p
                            ? p === 'high' ? 'bg-red-900/30 border-red-500 text-red-400'
                            : p === 'medium' ? 'bg-yellow-900/30 border-yellow-500 text-yellow-400'
                            : 'bg-blue-900/30 border-blue-500 text-blue-400'
                            : 'bg-gray-950 border-gray-800 text-gray-500 hover:border-gray-700'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Create Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </RouteGuard>
  );
}
