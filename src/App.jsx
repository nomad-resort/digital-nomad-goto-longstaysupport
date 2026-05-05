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
  const planColors = ['#0ea5e9', '#6366f1', '#f43f5e', '#f59e0b'];

  const budget = dashboardData.budget;
  const progress = dashboardData.progress;

  return (
    <div className="dashboard-container">
      <header className="header animate-fade-in">
        <div>
          <div className="badge" style={{ background: 'rgba(14, 165, 233, 0.1)', color: 'var(--primary)' }}>GOTO NOMAD RESORT • OFFICIAL</div>
          <h1 style={{ color: 'var(--text-main)', background: 'none', WebkitTextFillColor: 'initial' }}>Nomad Resort Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>来島予定者および運営進捗状況レポート</p>
        </div>
        <div className="card" style={{ padding: '0.75rem 1.5rem', display: 'flex', gap: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#10b981' }}>● Active</div>
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
          color="#0ea5e9"
        />
        <StatCard 
          icon={Calendar} 
          label="いつでも来島可能" 
          value={dashboardData.flexible} 
          subValue="柔軟な日程の応募者数"
          color="#f59e0b"
        />
        <StatCard 
          icon={CheckCircle} 
          label="来島確定者" 
          value={progress.finalized} 
          subValue="4月：1名利用中"
          color="#10b981"
        />
        <StatCard 
          icon={ShieldCheck} 
          label="残り予算" 
          value={`${(budget.remaining / 10000).toLocaleString()}万円`} 
          subValue={`予算総額: 60万円`}
          color="#f43f5e"
        />
      </section>

      {/* Monthly Status Cards */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>月別来島ステータス</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>各月の予約枠（スロット）の空き状況と、選考待ち人数</p>
          </div>
          <div className="badge">Project Capacity: 20 Slots</div>
        </div>
        
        <div className="monthly-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {progress.monthly.map((m, i) => (
            <div key={i} className="card animate-fade-in" style={{ padding: '1.25rem', border: m.finalized > 0 ? '1px solid #10b981' : '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{m.month}</span>
                {m.finalized > 0 && <span className="badge" style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}>Occupied</span>}
              </div>
              
              {/* Slot Indicators */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
                {[...Array(m.capacity)].map((_, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%', 
                      background: idx < m.finalized ? '#10b981' : '#e2e8f0',
                      boxShadow: idx < m.finalized ? '0 0 8px #10b981' : 'none'
                    }} 
                  />
                ))}
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>確定済み</span>
                  <span style={{ color: m.finalized > 0 ? 'var(--text-main)' : 'inherit', fontWeight: 600 }}>{m.finalized} 名</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>空席待ち</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{m.waitlist} 名</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="charts-grid" style={{ marginBottom: '2rem' }}>
        <div className="card animate-fade-in" style={{ gridColumn: 'span 2', minHeight: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 className="chart-title" style={{ marginBottom: 0 }}>月別 応募トレンド（母数）</h3>
            <div className="badge">Demand Trends</div>
          </div>
          
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={progress.monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="waitlist" name="応募者数" fill="#94a3b8" radius={[4, 4, 0, 0]} opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="charts-grid">
        <div className="card animate-fade-in">
          <h3 className="chart-title">国籍・居住地域別（Top 10）</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={dashboardData.countryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="value" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
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
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', paddingBottom: '2rem' }}>
        © 2024 Goto City & Nomad Resort Partnership | Operational Report Dashboard
      </footer>
    </div>
  );
}

export default App;
