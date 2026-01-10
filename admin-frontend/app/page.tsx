
export default function Home() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          + New Asset Upload
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard title="Total Assets" value="1,248" change="+12% this month" />
        <KPICard title="Pending Verification" value="42" change="Requires Action" urgent />
        <KPICard title="Intangible Assets Value" value="$4.2M" change="+$350k this quarter" />
        <KPICard title="Active Creators" value="18" change="All systems normal" />
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Recent System Activity</h2>
        <div className="space-y-4">
          <ActivityItem 
            action="Upload" 
            user="Sara Siron" 
            detail="uploaded 'Chapter 4 Manuscript'" 
            time="2 mins ago" 
          />
          <ActivityItem 
            action="Mint" 
            user="Admin (Rockey)" 
            detail="verified 'Character Mesh - Vrog'" 
            time="15 mins ago" 
          />
          <ActivityItem 
            action="Finance" 
            user="System" 
            detail="processed Royalty Payout #4421" 
            time="1 hour ago" 
          />
        </div>
      </div>
    </div>
  );
}

const KPICard = ({ title, value, change, urgent }: { title: string; value: string; change: string; urgent?: boolean }) => (
  <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-purple-500/50 transition-colors">
    <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
    <p className="text-3xl font-bold text-white mt-2">{value}</p>
    <p className={`text-xs mt-2 ${urgent ? 'text-red-400 font-semibold' : 'text-green-400'}`}>{change}</p>
  </div>
);

const ActivityItem = ({ action, user, detail, time }: { action: string; user: string; detail: string; time: string }) => (
  <div className="flex items-center justify-between border-b border-gray-800 pb-3 last:border-0 last:pb-0">
    <div className="flex items-center gap-4">
      <span className={`px-2 py-1 rounded text-xs font-medium w-16 text-center
        ${action === 'Upload' ? 'bg-blue-900/50 text-blue-300' : 
          action === 'Mint' ? 'bg-green-900/50 text-green-300' : 'bg-yellow-900/50 text-yellow-300'}`}>
        {action}
      </span>
      <div>
        <span className="font-medium text-gray-200">{user}</span>
        <span className="text-gray-400 text-sm"> {detail}</span>
      </div>
    </div>
    <span className="text-gray-500 text-sm">{time}</span>
  </div>
);
