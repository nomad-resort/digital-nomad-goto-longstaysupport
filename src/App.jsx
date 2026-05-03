import React from 'react';
import { 
  Users, 
  Target, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Zap,
  ArrowUpRight,
  Clock
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

const StatCard = ({ icon: Icon, label, value, subValue, trend }) => (
  <div className="card animate-fade-in">
    <div className="stat-label">
      <Icon size={18} />
      {label}
    </div>
    <div className="stat-value">{value}</div>
    {subValue && <div className="stat-sub">{subValue}</div>}
    {trend && (
      <div className="stat-sub" style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <ArrowUpRight size={14} /> {trend}
      </div>
    )}
  </div>
);

function App() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const planColors = ['#38bdf8', '#818cf8', '#f472b6', '#fbbf24'];

  const filteredApplicants = dashboardData.applicants.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.handle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <header className="header animate-fade-in">
        <div>
          <div className="badge">GOTO NOMAD TOUR 2026</div>
          <h1>Recruitment Dashboard</h1>
        </div>
        <div className="card" style={{ padding: '0.75rem 1.5rem', display: 'flex', gap: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#4ade80' }}>● Recruitment Open</div>
          </div>
          <div style={{ borderLeft: '1px solid var(--border)' }}></div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Last Update</div>
            <div style={{ fontSize: '1rem', fontWeight: 600 }}>Just Now</div>
          </div>
        </div>
      </header>

      <section className="stats-grid">
        <StatCard 
          icon={Users} 
          label="Total Applicants" 
          value={dashboardData.total.toLocaleString()} 
          trend="Real-time Data"
        />
        <StatCard 
          icon={Target} 
          label="Target Slots" 
          value="10" 
          subValue={`Selection Rate: ${(10 / dashboardData.total * 100).toFixed(2)}%`}
        />
        <StatCard 
          icon={TrendingUp} 
          label="Peak Activity" 
          value={Math.max(...dashboardData.dailyData.map(d => d.count))}
          subValue="Applications on peak day"
        />
        <StatCard 
          icon={Zap} 
          label="Avg. Demand" 
          value="High" 
          subValue="Multi-period requests"
        />
      </section>

      <section className="charts-grid" style={{ marginBottom: '2rem' }}>
        <div className="card animate-fade-in" style={{ gridColumn: 'span 2', minHeight: '400px' }}>
          <h3 className="chart-title">Applicant Growth Trend (Daily)</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={dashboardData.dailyData}>
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
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="charts-grid">
        <div className="card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h3 className="chart-title">Desired Stay Period (Month)</h3>
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
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
            * Note: Many applicants mentioned multiple months or flexibility.
          </p>
        </div>

        <div className="card animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h3 className="chart-title">Popularity by Plan</h3>
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

      <section style={{ marginTop: '3rem' }} className="animate-fade-in">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 className="chart-title" style={{ marginBottom: 0 }}>Applicant List & Search</h3>
            <div style={{ position: 'relative', width: '300px' }}>
              <input 
                type="text" 
                placeholder="Search by name or Instagram..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  paddingLeft: '2.5rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  color: 'white',
                  outline: 'none'
                }}
              />
              <Users size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="applicant-list">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Name</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Instagram / SNS</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Plan</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.slice(0, 50).map((app, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>{app.name}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>@{app.handle}</span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{app.plan}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      {app.sns && (
                        <a href={app.sns} target="_blank" rel="noopener noreferrer" className="btn-small">
                          View Profile <ArrowUpRight size={14} />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredApplicants.length > 50 && (
              <p style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Showing first 50 of {filteredApplicants.length} matches...
              </p>
            )}
            {filteredApplicants.length === 0 && (
              <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No applicants found matching "{searchTerm}"
              </p>
            )}
          </div>
        </div>
      </section>

      <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        Built for Goto Island Digital Nomad Project • 2026
      </footer>
    </div>
  );
}

export default App;
