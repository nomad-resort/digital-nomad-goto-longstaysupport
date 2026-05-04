import { 
  Users, 
  Target, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Zap,
  ArrowUpRight,
  Clock,
  CheckCircle,
  ClipboardCheck,
  ShieldCheck
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

// 集計データの読み込み
import dashboardData from './data.json';

const StatCard = ({ icon: Icon, label, value, subValue, color }) => (
  <div className="card animate-fade-in" style={{ borderLeft: `4px solid ${color}` }}>
    <div className="stat-label">
      <Icon size={18} style={{ color }} />
      {label}
    </div>
    <div className="stat-value">{value}</div>
    {subValue && <div className="stat-sub">{subValue}</div>}
  </div>
);

function App() {
  const planColors = ['#38bdf8', '#818cf8', '#f472b6', '#fbbf24'];

  // 進捗データのシミュレーション（実際は別データソースから取得を推奨）
  const progressData = {
    screening: 42,
    finalized: 12,
    budgetTotal: 5000000,
    budgetUsed: 1200000
  };

  return (
    <div className="dashboard-container">
      <header className="header animate-fade-in">
        <div>
          <div className="badge" style={{ background: '#10b981' }}>CONFIDENTIAL REPORT</div>
          <h1>Nomad Resort Goto Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>運営・選考進捗状況レポート（管理者・市役所向け）</p>
        </div>
        <div className="card" style={{ padding: '0.75rem 1.5rem', display: 'flex', gap: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Export Status</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#38bdf8' }}>Ready to Print</div>
          </div>
          <div style={{ borderLeft: '1px solid var(--border)' }}></div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Last Update</div>
            <div style={{ fontSize: '1rem', fontWeight: 600 }}>{new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </header>

      <section className="stats-grid">
        <StatCard 
          icon={Users} 
          label="応募総数" 
          value={dashboardData.total.toLocaleString()} 
          subValue="全チャネル累計"
          color="#38bdf8"
        />
        <StatCard 
          icon={ClipboardCheck} 
          label="選考中フェーズ" 
          value={progressData.screening} 
          subValue="書類・面談実施数"
          color="#fbbf24"
        />
        <StatCard 
          icon={CheckCircle} 
          label="最終決定者" 
          value={progressData.finalized} 
          subValue={`目標枠: 10名 (達成率 ${(progressData.finalized/10*100).toFixed(0)}%)`}
          color="#4ade80"
        />
        <StatCard 
          icon={ShieldCheck} 
          label="補助金執行状況" 
          value={`${(progressData.budgetUsed / 10000).toLocaleString()}万円`} 
          subValue={`予算比 ${(progressData.budgetUsed/progressData.budgetTotal*100).toFixed(1)}%`}
          color="#818cf8"
        />
      </section>

      <section className="charts-grid" style={{ marginBottom: '2rem' }}>
        <div className="card animate-fade-in" style={{ gridColumn: 'span 2', minHeight: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 className="chart-title" style={{ marginBottom: 0 }}>応募推移と選考ファネル</h3>
            <div className="badge">Selection Progress</div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '3rem' }}>
            {/* Trend Chart */}
            <div style={{ width: '100%', height: 300 }}>
              <AreaChart width={600} height={300} data={dashboardData.dailyData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="count" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </div>

            {/* Selection Funnel Visualization */}
            <div className="funnel-viz" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '15px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginBottom: '4px' }}>APPLICATIONS</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{dashboardData.total}</div>
              </div>
              <div style={{ textAlign: 'center', color: '#475569' }}>▼</div>
              <div style={{ padding: '15px', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px', border: '1px solid rgba(251, 191, 36, 0.2)', width: '90%', margin: '0 auto' }}>
                <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginBottom: '4px' }}>SELECTION</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{progressData.screening}</div>
              </div>
              <div style={{ textAlign: 'center', color: '#475569' }}>▼</div>
              <div style={{ padding: '15px', background: 'rgba(74, 222, 128, 0.1)', borderRadius: '8px', border: '1px solid rgba(74, 222, 128, 0.2)', width: '80%', margin: '0 auto' }}>
                <div style={{ fontSize: '0.75rem', color: '#4ade80', marginBottom: '4px' }}>FINALIZED</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{progressData.finalized}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="charts-grid">
        <div className="card animate-fade-in">
          <h3 className="chart-title">希望滞在時期（月別・重複込）</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={dashboardData.periodData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Bar dataKey="value" fill="#818cf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card animate-fade-in">
          <h3 className="chart-title">プラン別人気度</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={dashboardData.planData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {dashboardData.planData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={planColors[index % planColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', paddingBottom: '2rem' }}>
        © 2024 Goto City & Nomad Resort Partnership | Confidential Progress Report
      </footer>
    </div>
  );
}

export default App;
