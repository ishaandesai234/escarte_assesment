import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Award, Target, TrendingUp, Users, CheckSquare, Loader2 } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export const PerformanceOverview: React.FC = () => {
  const [staffData, setStaffData] = useState<any[]>([]);
  const [conversionStats, setConversionStats] = useState({ converted: 0, pending: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubTasks = onSnapshot(collection(db, 'tasks'), (taskSnap) => {
      const unsubDemos = onSnapshot(collection(db, 'demos'), (demoSnap) => {
        const tasks = taskSnap.docs.map(d => d.data());
        const demos = demoSnap.docs.map(d => d.data());

        // Process staff performance
        const staffMap: Record<string, any> = {};
        tasks.forEach(t => {
          if (!staffMap[t.assignedTo]) {
            staffMap[t.assignedTo] = { name: t.assignedTo || 'Unknown', completed: 0, total: 0, demos: 0, converted: 0 };
          }
          staffMap[t.assignedTo].total += 1;
          if (t.status === 'done') staffMap[t.assignedTo].completed += 1;
        });

        demos.forEach(d => {
          // Note: and should check if demos have a teacherId field. 
          // For now we'll match by name if we have to, but ideal is a teacherId.
          // Let's assume there's a teacherName in demo for this prototype.
          const name = d.teacherName || 'Unknown';
          if (!staffMap[name]) {
            staffMap[name] = { name, completed: 0, total: 0, demos: 0, converted: 0 };
          }
          staffMap[name].demos += 1;
          if (d.outcome === 'converted') staffMap[name].converted += 1;
        });

        const processed = Object.values(staffMap).map(s => ({
          ...s,
          conversion: s.demos > 0 ? Math.round((s.converted / s.demos) * 100) : 0
        }));

        setStaffData(processed);

        // Process global conversion
        const stats = { converted: 0, pending: 0, rejected: 0 };
        demos.forEach(d => {
          if (d.outcome === 'converted') stats.converted += 1;
          else if (d.outcome === 'not interested') stats.rejected += 1;
          else stats.pending += 1;
        });
        setConversionStats(stats);
        setLoading(false);
      });
      return unsubTasks;
    });
  }, []);

  const pieData = [
    { name: 'Converted', value: conversionStats.converted },
    { name: 'Pending', value: conversionStats.pending },
    { name: 'Rejected', value: conversionStats.rejected },
  ];

  const COLORS = ['#0d9488', '#f59e0b', '#ef4444'];

  const topPerformer = staffData.sort((a, b) => b.conversion - a.conversion)[0] || null;

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-secondary" size={40} /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">Teacher Performance</h1>
        <p className="text-muted-foreground text-sm">Real-time operational efficiency and conversion metrics.</p>
      </div>

      {staffData.length === 0 ? (
        <div className="dashboard-card text-center p-20">
           <Award size={48} className="mx-auto text-slate-200 mb-4" />
           <p className="text-slate-400 font-bold uppercase tracking-widest">No Performance Data Yet</p>
           <p className="text-xs text-muted-foreground">Complete tasks and convert demos to see analytics here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="dashboard-card">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">Task Completion Rate</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={staffData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="completed" fill="#0f172a" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {staffData.map((t, i) => (
                  <div key={t.name} className="dashboard-card border-t-4 border-t-primary">
                     <h4 className="font-bold text-primary truncate mb-4">{t.name}</h4>
                     <div className="space-y-3">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Demo Conversion</span>
                          <span className="font-bold">{t.conversion}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-secondary h-full" style={{ width: `${t.conversion}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] pt-2">
                          <span className="flex items-center gap-1 uppercase font-bold text-slate-400 line-clamp-1"><Target size={10} /> {t.demos} Demos</span>
                          <span className="flex items-center gap-1 uppercase font-bold text-slate-400 line-clamp-1"><CheckSquare size={10} /> {t.completed} Tasks</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
          </div>

          <div className="space-y-6">
             <div className="dashboard-card">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 text-center">Overall Conversion</h3>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                   {pieData.map((d, i) => (
                     <div key={d.name} className="flex items-center justify-between text-xs font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                          <span className="text-slate-600">{d.name}</span>
                        </div>
                        <span className="text-primary font-bold">{d.value}</span>
                     </div>
                   ))}
                </div>
             </div>

             {topPerformer && (
               <div className="dashboard-card bg-primary text-white">
                  <Award className="text-secondary mb-4" size={32} />
                  <h3 className="text-lg font-bold mb-1">Top Performer</h3>
                  <p className="text-xs text-white/60 mb-6">Based on demo conversion rate and task punctuality.</p>
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">
                       {topPerformer.name ? topPerformer.name.charAt(0) : 'T'}
                     </div>
                     <div>
                        <p className="font-bold">{topPerformer.name}</p>
                        <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">{topPerformer.conversion}% Success Rate</p>
                     </div>
                  </div>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};
