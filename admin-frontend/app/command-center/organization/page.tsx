"use client";

import { useEffect, useState } from 'react';
import { organizationApi } from '@/lib/api';
import { Briefcase, Users, FileText, Activity } from 'lucide-react';

interface Role {
  id: string;
  title: string;
  responsibilities: string;
  kpi_metrics: string;
  reporting_to_role_id?: string;
}

interface Division {
  id: string;
  name: string;
  description: string;
  roles: Role[];
}

export default function OrganizationPage() {
  const [structure, setStructure] = useState<Division[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStructure();
  }, []);

  const fetchStructure = async () => {
    try {
      setIsLoading(true);
      const res = await organizationApi.getStructure();
      setStructure(res.data);
    } catch (error) {
      console.error('Failed to fetch organization structure:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Organization Structure</h1>
        <p className="text-gray-400 mt-1">Divisions, roles, and responsibilities</p>
      </div>

      {isLoading ? (
        <div className="text-gray-500">Loading structure...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {structure.map((division) => (
              <div key={division.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-800 bg-gray-800/30">
                  <h2 className="text-xl font-semibold text-white mb-2">{division.name}</h2>
                  <p className="text-sm text-gray-400">{division.description}</p>
                </div>
                
                <div className="p-6 flex-1">
                  <div className="space-y-6">
                    {division.roles.map((role) => (
                      <div key={role.id} className="relative pl-4 border-l-2 border-purple-500/30">
                        <h3 className="text-lg font-medium text-purple-400">{role.title}</h3>
                        
                        <div className="mt-2 space-y-3">
                          <div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                              <FileText size={12} /> Responsibilities
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed">
                              {role.responsibilities}
                            </p>
                          </div>

                          {role.kpi_metrics && (
                            <div>
                              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                <Activity size={12} /> Key Metrics
                              </div>
                              <p className="text-sm text-gray-400">
                                {role.kpi_metrics}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Collaboration Protocols</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Executive Strategy Sync",
                  participants: ["CEO", "COO", "CFO", "CMO", "CTO"],
                  frequency: "Weekly",
                  description: "Review strategic goals, company performance, and high-level blockers."
                },
                {
                  title: "Creative & Interactive Alignment",
                  participants: ["Game Director", "Creative Director", "Art Director"],
                  frequency: "Bi-Weekly",
                  description: "Ensure game narrative and visuals align with the broader Omnivael universe lore."
                },
                {
                  title: "Production Pipeline Review",
                  participants: ["Producer", "Lead Developer", "QA Manager"],
                  frequency: "Weekly",
                  description: "Review sprint progress, resource allocation, and technical blockers."
                },
                {
                  title: "Legal & Compliance Check",
                  participants: ["General Counsel", "Compliance Officer", "Department Heads"],
                  frequency: "Monthly",
                  description: "Review upcoming releases and contracts for regulatory compliance and IP protection."
                }
              ].map((protocol, index) => (
                <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">{protocol.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {protocol.participants.map((p, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-gray-800 text-xs text-gray-300 border border-gray-700">
                        {p}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-purple-400 mb-2 font-medium">
                    <Activity size={14} /> {protocol.frequency}
                  </div>
                  <p className="text-sm text-gray-400">{protocol.description}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
