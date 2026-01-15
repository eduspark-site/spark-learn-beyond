import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, UserCheck, Calendar, TrendingUp, BookOpen, 
  ChevronRight, BarChart3, Activity, Play, Target,
  Key, ToggleLeft, ToggleRight, CheckCircle, XCircle, Clock
} from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth, UserProfile, KeyGenerationLog } from '@/contexts/AuthContext';
import { fetchBatches } from '@/components/StudyApp/api';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

const Admin = () => {
  const { isAdmin, appSettings, toggleKeyGeneration, getKeyGenerationLogs } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [totalBatches, setTotalBatches] = useState(0);
  const [loading, setLoading] = useState(true);
  const [keyLogs, setKeyLogs] = useState<KeyGenerationLog[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'keys'>('users');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch users from Firestore
        const usersSnap = await getDocs(collection(db, 'users'));
        const usersData = usersSnap.docs.map(doc => {
          const data = doc.data();
          return {
            uid: data.uid || doc.id,
            email: data.email || '',
            displayName: data.displayName || 'User',
            photoURL: data.photoURL,
            enrolledBatches: data.enrolledBatches || [],
            lectureProgress: (data.lectureProgress || []).map((p: any) => ({
              ...p,
              lastWatchedAt: p.lastWatchedAt?.toDate?.() || new Date(),
              completedAt: p.completedAt?.toDate?.(),
            })),
            lastActive: data.lastActive?.toDate?.() || new Date(),
            createdAt: data.createdAt?.toDate?.() || new Date(),
          } as UserProfile;
        });
        setUsers(usersData);

        // Fetch batches count
        const batches = await fetchBatches();
        setTotalBatches(batches.length);

        // Fetch key generation logs
        const logs = await getKeyGenerationLogs();
        setKeyLogs(logs);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin, navigate, getKeyGenerationLogs]);

  // Calculate statistics
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const liveUsers = users.filter(u => u.lastActive > oneHourAgo).length;
  const weeklyUsers = users.filter(u => u.lastActive > oneWeekAgo).length;
  const monthlyUsers = users.filter(u => u.lastActive > oneMonthAgo).length;
  const totalEnrollments = users.reduce((acc, u) => acc + (u.enrolledBatches?.length || 0), 0);
  
  // Progress stats
  const allProgress = users.flatMap(u => u.lectureProgress || []);
  const completedLectures = allProgress.filter(p => p.progress >= 90).length;
  const avgProgress = allProgress.length > 0 
    ? Math.round(allProgress.reduce((acc, p) => acc + p.progress, 0) / allProgress.length)
    : 0;

  // Key generation stats
  const totalKeyGenerated = keyLogs.filter(k => k.status === 'success').length;
  const totalKeyFailed = keyLogs.filter(k => k.status === 'failed').length;
  const totalKeyPending = keyLogs.filter(k => k.status === 'pending').length;
  const todayKeys = keyLogs.filter(k => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return k.generatedAt >= today && k.status === 'success';
  }).length;

  // Weekly signup data
  const getWeeklyData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = days.map((day, index) => {
      const dayStart = new Date(now);
      dayStart.setDate(now.getDate() - (6 - index));
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);
      
      const count = users.filter(u => u.createdAt >= dayStart && u.createdAt < dayEnd).length;
      return { name: day, users: count };
    });
    return data;
  };

  // Monthly data
  const getMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.slice(0, now.getMonth() + 1).map((month, index) => {
      const count = users.filter(u => u.createdAt.getMonth() === index && u.createdAt.getFullYear() === now.getFullYear()).length;
      return { name: month, users: count };
    });
  };

  // Progress distribution data
  const getProgressDistribution = () => {
    const ranges = [
      { name: '0-25%', min: 0, max: 25 },
      { name: '26-50%', min: 26, max: 50 },
      { name: '51-75%', min: 51, max: 75 },
      { name: '76-100%', min: 76, max: 100 },
    ];
    return ranges.map(range => ({
      name: range.name,
      value: allProgress.filter(p => p.progress >= range.min && p.progress <= range.max).length,
    }));
  };

  // Key generation chart data
  const getKeyGenerationData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map((day, index) => {
      const dayStart = new Date(now);
      dayStart.setDate(now.getDate() - (6 - index));
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);
      
      const success = keyLogs.filter(k => 
        k.generatedAt >= dayStart && k.generatedAt < dayEnd && k.status === 'success'
      ).length;
      const failed = keyLogs.filter(k => 
        k.generatedAt >= dayStart && k.generatedAt < dayEnd && (k.status === 'failed' || k.status === 'pending')
      ).length;
      
      return { name: day, success, failed };
    });
  };

  const COLORS = ['#fbbf24', '#f59e0b', '#d97706', '#b45309'];

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'text-primary' },
    { label: 'Live Users', value: liveUsers, icon: Activity, color: 'text-green-500' },
    { label: 'Weekly Active', value: weeklyUsers, icon: Calendar, color: 'text-blue-500' },
    { label: 'Monthly Active', value: monthlyUsers, icon: TrendingUp, color: 'text-purple-500' },
    { label: 'Total Batches', value: totalBatches, icon: BookOpen, color: 'text-orange-500' },
    { label: 'Total Enrollments', value: totalEnrollments, icon: UserCheck, color: 'text-pink-500' },
    { label: 'Completed Lectures', value: completedLectures, icon: Play, color: 'text-emerald-500' },
    { label: 'Avg Progress', value: `${avgProgress}%`, icon: Target, color: 'text-cyan-500' },
  ];

  const keyStats = [
    { label: 'Keys Generated Today', value: todayKeys, icon: Key, color: 'text-primary' },
    { label: 'Total Successful', value: totalKeyGenerated, icon: CheckCircle, color: 'text-green-500' },
    { label: 'Total Failed', value: totalKeyFailed, icon: XCircle, color: 'text-red-500' },
    { label: 'Pending', value: totalKeyPending, icon: Clock, color: 'text-yellow-500' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/profile" className="btn-back inline-flex mb-6">
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Profile
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gradient">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">Analytics and user management</p>
        </motion.div>

        {/* Key Generation Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Key className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Key Generation System</h3>
                <p className="text-sm text-muted-foreground">
                  {appSettings.keyGenerationEnabled 
                    ? 'Users must generate key to access content' 
                    : 'Key generation is disabled - users can access content freely'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium ${appSettings.keyGenerationEnabled ? 'text-green-500' : 'text-muted-foreground'}`}>
                {appSettings.keyGenerationEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <Switch
                checked={appSettings.keyGenerationEnabled}
                onCheckedChange={(checked) => toggleKeyGeneration(checked)}
              />
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'users' ? 'default' : 'outline'}
            onClick={() => setActiveTab('users')}
            className={activeTab === 'users' ? 'btn-primary' : ''}
          >
            <Users className="w-4 h-4 mr-2" />
            Users & Analytics
          </Button>
          <Button
            variant={activeTab === 'keys' ? 'default' : 'outline'}
            onClick={() => setActiveTab('keys')}
            className={activeTab === 'keys' ? 'btn-primary' : ''}
          >
            <Key className="w-4 h-4 mr-2" />
            Key Generation
          </Button>
        </div>

        {activeTab === 'users' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card p-4"
                >
                  <stat.icon className={`w-6 h-6 mb-2 ${stat.color}`} />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Weekly Signups
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={getWeeklyData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Monthly Signups
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={getMonthlyData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Progress Distribution Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="glass-card p-6 mb-8"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                User Progress Distribution
              </h3>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={getProgressDistribution()}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {getProgressDistribution().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        background: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Recent Users Table */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                All Users ({users.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Enrolled</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Progress</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Last Active</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-muted-foreground">
                          No users found. Users will appear here after they sign up.
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => {
                        const isOnline = u.lastActive > oneHourAgo;
                        const userProgress = u.lectureProgress || [];
                        const avgUserProgress = userProgress.length > 0
                          ? Math.round(userProgress.reduce((acc, p) => acc + p.progress, 0) / userProgress.length)
                          : 0;
                        return (
                          <tr key={u.uid} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                {u.photoURL ? (
                                  <img src={u.photoURL} alt="" className="w-8 h-8 rounded-full" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Users className="w-4 h-4 text-primary" />
                                  </div>
                                )}
                                <span className="text-sm font-medium">{u.displayName}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">{u.email}</td>
                            <td className="py-3 px-4 text-sm">{u.enrolledBatches?.length || 0}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary transition-all"
                                    style={{ width: `${avgUserProgress}%` }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground">{avgUserProgress}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {u.lastActive.toLocaleDateString()} {u.lastActive.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                                isOnline ? 'bg-green-500/20 text-green-500' : 'bg-muted text-muted-foreground'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`} />
                                {isOnline ? 'Online' : 'Offline'}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}

        {activeTab === 'keys' && (
          <>
            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {keyStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card p-4"
                >
                  <stat.icon className={`w-6 h-6 mb-2 ${stat.color}`} />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Key Generation Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 mb-8"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" />
                Weekly Key Generation
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={getKeyGenerationData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="success" fill="#22c55e" radius={[4, 4, 0, 0]} name="Success" />
                  <Bar dataKey="failed" fill="#ef4444" radius={[4, 4, 0, 0]} name="Failed/Pending" />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Key Generation Logs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" />
                Key Generation Logs ({keyLogs.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Generated At</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Expires At</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keyLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          No key generation logs yet.
                        </td>
                      </tr>
                    ) : (
                      keyLogs.map((log) => (
                        <tr key={log.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4 text-sm font-medium">{log.userName}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{log.userEmail}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {log.generatedAt.toLocaleDateString()} {log.generatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {log.expiresAt.toLocaleDateString()} {log.expiresAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                              log.status === 'success' 
                                ? 'bg-green-500/20 text-green-500' 
                                : log.status === 'pending'
                                ? 'bg-yellow-500/20 text-yellow-500'
                                : 'bg-red-500/20 text-red-500'
                            }`}>
                              {log.status === 'success' ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : log.status === 'pending' ? (
                                <Clock className="w-3 h-3" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                              {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
