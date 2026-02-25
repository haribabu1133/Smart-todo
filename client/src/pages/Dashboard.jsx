import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FiCheckCircle, FiClock, FiList, FiTrendingUp } from 'react-icons/fi';
import { taskService } from '../services/taskService';

const StatCard = ({ icon, label, value, color, index }) => (
    <motion.div
        className="stat-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
        <div className="stat-icon" style={{ background: `${color}18` }}>
            <span style={{ color }}>{icon}</span>
        </div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
    </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13
            }}>
                <p style={{ fontWeight: 600, marginBottom: 6, color: 'var(--text-primary)' }}>{label}</p>
                {payload.map(p => (
                    <p key={p.name} style={{ color: p.color }}>
                        {p.name}: <strong>{p.value}</strong>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        try {
            const { data } = await taskService.getStats();
            setStats(data);
        } catch (err) {
            console.error('Failed to load stats:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, [fetchStats]);

    if (loading) return <div className="spinner" />;

    const total = stats?.total || 0;
    const completed = stats?.completed || 0;
    const pending = stats?.pending || 0;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const weekly = stats?.weekly || [];

    const statCards = [
        { icon: <FiList size={20} />, label: 'Total Tasks', value: total, color: '#6366f1' },
        { icon: <FiCheckCircle size={20} />, label: 'Completed', value: completed, color: '#22c55e' },
        { icon: <FiClock size={20} />, label: 'Pending', value: pending, color: '#f59e0b' },
        { icon: <FiTrendingUp size={20} />, label: 'Progress', value: `${percent}%`, color: '#8b5cf6' },
    ];

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Your productivity overview at a glance</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {statCards.map((card, i) => (
                    <StatCard key={card.label} {...card} index={i} />
                ))}
            </div>

            {/* Progress + Chart row */}
            <div className="dashboard-row">
                {/* Circular Progress */}
                <motion.div
                    className="card progress-ring-container"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                    style={{ padding: '28px 20px', justifyContent: 'center' }}
                >
                    <p className="section-title" style={{ textAlign: 'center', marginBottom: 20 }}>
                        Overall Progress
                    </p>
                    <div style={{ width: 160, height: 160 }}>
                        <CircularProgressbar
                            value={percent}
                            text={`${percent}%`}
                            styles={buildStyles({
                                textSize: '18px',
                                pathColor: '#6366f1',
                                textColor: 'var(--text-primary)',
                                trailColor: 'var(--border-color)',
                                pathTransitionDuration: 1,
                            })}
                        />
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                            <strong style={{ color: 'var(--accent-primary)' }}>{completed}</strong> of{' '}
                            <strong>{total}</strong> tasks completed
                        </p>
                    </div>

                    {/* Priority breakdown */}
                    {stats?.priorityBreakdown && (
                        <div style={{ width: '100%', marginTop: 20, borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
                            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, textAlign: 'center' }}>
                                PRIORITY BREAKDOWN
                            </p>
                            {[
                                { label: 'High', count: stats.priorityBreakdown.high, color: '#ef4444' },
                                { label: 'Medium', count: stats.priorityBreakdown.medium, color: '#f59e0b' },
                                { label: 'Low', count: stats.priorityBreakdown.low, color: '#22c55e' },
                            ].map(({ label, count, color }) => (
                                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1 }}>{label}</span>
                                    <span style={{ fontSize: 12, fontWeight: 700, color }}>{count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Weekly Chart */}
                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                >
                    <p className="section-title">Weekly Activity</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={weekly} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                            <defs>
                                <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 12 }} />
                            <Area type="monotone" dataKey="created" stroke="#6366f1" strokeWidth={2} fill="url(#colorCreated)" name="Created" />
                            <Area type="monotone" dataKey="completed" stroke="#22c55e" strokeWidth={2} fill="url(#colorCompleted)" name="Completed" />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Category Stats */}
            {stats?.categoryStats && stats.categoryStats.some(c => c.count > 0) && (
                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                >
                    <p className="section-title">Tasks by Category</p>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={stats.categoryStats} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} name="Tasks" />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            )}
        </div>
    );
};

export default Dashboard;
