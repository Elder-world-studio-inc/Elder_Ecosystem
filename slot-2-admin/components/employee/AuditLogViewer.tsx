"use client";
import { useEffect, useState } from 'react';
import { usersApi } from '@/lib/api';
import { Clock, Shield } from 'lucide-react';

export default function AuditLogViewer({ onClose }: { onClose: () => void }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await usersApi.getAuditLogs();
        setLogs(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg border border-gray-800 w-full max-w-3xl h-[80vh] flex flex-col">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield className="text-purple-500" /> System Audit Logs
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">Close</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {isLoading ? (
                <div className="text-center text-gray-500">Loading logs...</div>
            ) : logs.length === 0 ? (
                <div className="text-center text-gray-500">No logs found.</div>
            ) : (
                logs.map((log) => (
                    <div key={log.id} className="bg-gray-800/50 rounded p-4 border border-gray-700">
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-mono text-xs text-purple-400 bg-purple-900/20 px-2 py-1 rounded border border-purple-500/20">
                                {log.action}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock size={12} />
                                {new Date(log.timestamp).toLocaleString()}
                            </span>
                        </div>
                        <p className="text-sm text-gray-300">{log.details}</p>
                        <div className="mt-2 text-xs text-gray-500">
                            Performed by: <span className="text-white font-medium">{log.performedBy}</span>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
}