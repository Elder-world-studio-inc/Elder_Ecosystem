"use client";
import { useState } from 'react';
import { FileText, Image as ImageIcon, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function StagingPage() {
  const [activeTab, setActiveTab] = useState('Drafts');

  const assets = [
    { id: 1, name: "Chapter 5 Draft.docx", type: "Text", size: "2.4 MB", status: "Draft", uploader: "Sara Siron", date: "Jan 8, 2026" },
    { id: 2, name: "Vrog_Mesh_v2.obj", type: "3D Model", size: "45 MB", status: "Draft", uploader: "3D Modeller", date: "Jan 8, 2026" },
    { id: 3, name: "Hero_Concept_Art.png", type: "Image", size: "5.1 MB", status: "Approved", uploader: "Art Team", date: "Jan 7, 2026" },
    { id: 4, name: "Legal_Contracts_Q1.pdf", type: "PDF", size: "1.2 MB", status: "Live", uploader: "Legal", date: "Jan 5, 2026" },
  ];

  const filteredAssets = activeTab === 'All' ? assets : assets.filter(a => a.status === activeTab || (activeTab === 'Drafts' && a.status === 'Draft'));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Staging Area</h1>
        <div className="flex gap-2">
           <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors border border-gray-700">
            Batch Action
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            + Upload New Asset
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-900 p-1 rounded-lg w-fit border border-gray-800">
        {['Drafts', 'Approved', 'Live'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Asset List */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-950 text-gray-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Asset Name</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Uploader</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredAssets.map((asset) => (
              <tr key={asset.id} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-800 rounded text-gray-400">
                      {asset.type === 'Text' || asset.type === 'PDF' ? <FileText size={18} /> : <ImageIcon size={18} />}
                    </div>
                    <span className="font-medium text-gray-200">{asset.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm">{asset.type}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                    ${asset.status === 'Live' ? 'bg-green-900/30 text-green-400 border-green-900' : 
                      asset.status === 'Approved' ? 'bg-blue-900/30 text-blue-400 border-blue-900' : 
                      'bg-gray-800 text-gray-400 border-gray-700'}`}>
                    {asset.status === 'Live' ? <CheckCircle size={12} /> : 
                     asset.status === 'Approved' ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {asset.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-300 text-sm">{asset.uploader}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{asset.date}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
