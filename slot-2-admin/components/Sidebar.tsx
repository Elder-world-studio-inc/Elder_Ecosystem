"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Upload, ShieldCheck, DollarSign, Settings, LayoutGrid, Box, Users, BookOpen, Activity, LogOut, Feather, Image as ImageIcon, Eye, Briefcase } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const isAdmin = user.role === 'admin';
  const divisionId = user.divisionId;

  // Determine current division context based on URL
  const isCreativePath = pathname?.startsWith('/divisions/creative');
  const isInteractivePath = pathname?.startsWith('/divisions/interactive');
  const isOperationsPath = pathname?.startsWith('/divisions/operations');

  // Determine visibility based on role AND context
  // If in a specific division path, hide other divisions
  const showCreative = (isAdmin || divisionId === 'creative') && !isInteractivePath && !isOperationsPath;
  const showInteractive = (isAdmin || divisionId === 'interactive') && !isCreativePath && !isOperationsPath;
  const showOperations = (isAdmin || divisionId === 'operations') && !isCreativePath && !isInteractivePath;

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col fixed left-0 top-0 border-r border-gray-800 overflow-y-auto z-50">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-wider text-purple-500">ADMIN ENGINE</h1>
        <p className="text-xs text-gray-400 mt-1">Elder World Studio</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-6 mt-2">
        
        {/* Executive Suite - Admin Only */}
        {isAdmin && (
          <div>
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Executive Suite</h3>
            <div className="space-y-1">
              <SidebarItem href="/command-center" icon={<LayoutGrid size={18} />} label="Command Center" />
              <SidebarItem href="/command-center/employees" icon={<Users size={18} />} label="Employees" />
              <SidebarItem href="/command-center/organization" icon={<Briefcase size={18} />} label="Organization" />
              <SidebarItem href="/financials" icon={<DollarSign size={18} />} label="Financials & Ledger" />
            </div>
          </div>
        )}

        {/* Divisions */}
        <div>
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {isInteractivePath ? 'Interactive Division' : isCreativePath ? 'Creative Division' : isOperationsPath ? 'Operations' : 'Divisions'}
          </h3>
          <div className="space-y-1">
            {showCreative && (
              <>
                <SidebarItem 
                  href="/divisions/creative/stories" 
                  icon={<Feather size={18} />} 
                  label="Stories Workflow" 
                />
                <SidebarItem 
                  href="/divisions/creative/comics" 
                  icon={<ImageIcon size={18} />} 
                  label="Comics Workflow" 
                />
                <SidebarItem 
                  href="/divisions/creative/reader" 
                  icon={<Eye size={18} />} 
                  label="Reader" 
                />
              </>
            )}
            {showInteractive && (
              <>
                <SidebarItem 
                  href="/divisions/interactive" 
                  icon={<Box size={18} />} 
                  label={isInteractivePath && pathname === '/divisions/interactive' ? "Dashboard" : "Interactive Division"} 
                />
                {isInteractivePath && (
                  <div className="ml-4 pl-4 border-l border-gray-800 space-y-1 mt-1">
                    <SidebarItem 
                      href="/divisions/interactive/unity-bridge" 
                      icon={<Activity size={16} />} 
                      label="Unity Bridge" 
                    />
                    <SidebarItem 
                      href="/divisions/interactive/vault" 
                      icon={<BookOpen size={16} />} 
                      label="The Vault" 
                    />
                    <SidebarItem 
                      href="/divisions/interactive/level-design" 
                      icon={<LayoutGrid size={16} />} 
                      label="Level Design" 
                    />
                  </div>
                )}
              </>
            )}
            {showOperations && (
              <SidebarItem 
                href="/divisions/operations" 
                icon={<Activity size={18} />} 
                label={isOperationsPath ? "Dashboard" : "Operations"} 
              />
            )}
          </div>
        </div>

        {/* Governance & Legacy - Admin Only */}
        {isAdmin && (
          <div>
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Governance</h3>
            <div className="space-y-1">
              <SidebarItem href="/minting" icon={<ShieldCheck size={18} />} label="Minting / Verify" />
              <SidebarItem href="/settings" icon={<Settings size={18} />} label="Settings" />
            </div>
          </div>
        )}

      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-4 mb-3">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-xs uppercase">
            {user.username ? user.username.slice(0, 2) : '??'}
          </div>
          <div>
            <p className="text-sm font-medium text-white capitalize">{user.username || 'User'}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role} Access</p>
          </div>
        </div>
        <button onClick={logout} className="w-full flex items-center gap-2 text-gray-400 hover:text-white px-4 py-2 text-sm transition-colors">
            <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );
};

const SidebarItem = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => {
  return (
    <Link href={href} className="flex items-center space-x-3 px-4 py-2.5 text-gray-400 hover:bg-white/10 hover:text-white rounded-lg transition-colors">
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
};

export default Sidebar;
