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
          subValue="累計エントリー数"
          color="#0ea5e9"
        />
        <StatCard 
          icon={CheckCircle} 
          label="来島確定者" 
          value={progress.finalized} 
          subValue="4月利用中：1名"
          color="#10b981"
        />
        <StatCard 
          icon={ShieldCheck} 
          label="残り予算" 
          value={`${(budget.remaining / 10000).toLocaleString()}万円`} 
          subValue={`予算総額: ${(budget.total / 10000).toLocaleString()}万円`}
          color="#f43f5e"
        />
        <StatCard 
          icon={TrendingUp} 
          label="予算執行率" 
          value={`${((budget.used / budget.total) * 100).toFixed(1)}%`} 
          subValue={`累計執行額: ${(budget.used / 10000).toLocaleString()}万円`}
          color="#6366f1"
        />
      </section>

      <section className="charts-grid" style={{ marginBottom: '2rem' }}>
        <div className="card animate-fade-in" style={{ gridColumn: 'span 2', minHeight: '450px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h3 className="chart-title" style={{ marginBottom: '0.25rem' }}>月別来島予定と空席待ち</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>確定済み人数 vs キャンセル待ち・検討中人数</p>
            </div>
            <div className="badge">Monthly Schedule</div>
          </div>
          
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <BarChart data={progress.monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="finalized" name="来島確定" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                <Bar dataKey="waitlist" name="空席待ち" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={40} />
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
