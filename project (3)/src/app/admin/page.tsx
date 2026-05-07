"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useVotingStore } from "@/lib/store";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { Users, Vote as VoteIcon, ShieldCheck, Database, Search, Fingerprint, MapPin, Eye, Clock, Phone, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminDashboard() {
  const { users, votes } = useVotingStore();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const partyVotes = [
    { name: "TDP", value: votes.filter(v => v.party === "TDP").length, color: "#facc15" },
    { name: "YSRCP", value: votes.filter(v => v.party === "YSRCP").length, color: "#2563eb" },
    { name: "BJP", value: votes.filter(v => v.party === "BJP").length, color: "#f97316" },
    { name: "Congress", value: votes.filter(v => v.party === "Congress").length, color: "#16a34a" },
    { name: "NOTA", value: votes.filter(v => v.party === "NOTA").length, color: "#94a3b8" },
  ];

  const totalVotes = votes.length;
  const totalRegistered = users.length;
  const turnout = totalRegistered > 0 ? (totalVotes / totalRegistered) * 100 : 0;

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.aadhaar.includes(searchQuery)
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10 space-y-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">System Administrator</span>
              <div className="flex items-center gap-2 text-[10px] font-bold text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                Live Network Active
              </div>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">Election Dashboard</h1>
            <p className="text-slate-500 font-medium text-lg">Comprehensive audit trail of registrations and ballot integrity.</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-slate-100 flex items-center gap-8 min-w-[300px] shadow-inner">
             <div className="flex flex-col">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Server Clock</span>
               <span className="text-3xl font-mono font-black text-primary tracking-tighter">{currentTime}</span>
             </div>
             <div className="w-px h-12 bg-slate-200" />
             <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center text-slate-400">
               <Clock size={28} />
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Registered" value={totalRegistered} icon={<Users size={24} />} trend="Voter List" color="blue" />
          <StatCard title="Ballots Cast" value={totalVotes} icon={<VoteIcon size={24} />} trend={`${turnout.toFixed(1)}% Turnout`} color="amber" />
          <StatCard title="Verified Faces" value={users.filter(u => !!u.faceEncoding).length} icon={<Fingerprint size={24} />} trend="Biometric ID" color="emerald" />
          <StatCard title="System Integrity" value="MAX" icon={<ShieldCheck size={24} />} trend="Encrypted" color="indigo" />
        </div>

        <Tabs defaultValue="registry" className="space-y-8">
          <TabsList className="bg-white border-2 border-slate-100 p-2 rounded-[2.5rem] h-20 inline-flex shadow-2xl">
            <TabsTrigger value="registry" className="rounded-[1.8rem] px-12 font-black text-base data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Registry</TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-[1.8rem] px-12 font-black text-base data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Analytics</TabsTrigger>
            <TabsTrigger value="ledger" className="rounded-[1.8rem] px-12 font-black text-base data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Voting Ledger</TabsTrigger>
          </TabsList>

          <TabsContent value="registry">
            <Card className="rounded-[3rem] border-none shadow-2xl bg-white overflow-hidden">
              <div className="p-10 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-8">
                <div>
                  <CardTitle className="text-3xl font-black text-slate-900">Official Voter Registry</CardTitle>
                  <CardDescription className="font-bold text-slate-400 text-base mt-2">Verified individuals in the biometric database.</CardDescription>
                </div>
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
                  <Input 
                    placeholder="Search Name or Aadhaar..." 
                    className="h-16 pl-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold text-lg" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableHead className="py-6 pl-10 font-black text-slate-400 uppercase tracking-widest text-[10px]">Voter Identity</TableHead>
                      <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Aadhaar (UID)</TableHead>
                      <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Mobile Contact</TableHead>
                      <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Registry Status</TableHead>
                      <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[10px] text-right pr-10">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                      <TableRow key={user.id} className="border-slate-50 group hover:bg-slate-50/80 transition-all">
                        <TableCell className="py-6 pl-10">
                          <div className="flex items-center gap-5">
                            <div className="relative group-hover:scale-110 transition-transform">
                              <Avatar className="w-16 h-16 rounded-2xl border-4 border-white shadow-xl ring-1 ring-slate-100">
                                <AvatarImage src={user.photo} className="object-cover" />
                                <AvatarFallback className="bg-primary/10 text-primary font-black text-xl">{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className={cn(
                                "absolute -bottom-1 -right-1 w-5 h-5 border-2 border-white rounded-full",
                                user.hasVoted ? "bg-green-500" : "bg-blue-500"
                              )} />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-black text-slate-900 text-lg leading-tight">{user.name}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {user.id.toUpperCase()}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm font-black text-slate-600 tracking-tighter">
                          {user.aadhaar.slice(0,4)} {user.aadhaar.slice(4,8)} {user.aadhaar.slice(8,12)}
                        </TableCell>
                        <TableCell className="font-black text-slate-600 flex items-center gap-2">
                           <Phone size={14} className="text-slate-300" />
                           +91 {user.mobile}
                        </TableCell>
                        <TableCell>
                          <div className={cn(
                            "inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest",
                            user.hasVoted ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                          )}>
                            {user.hasVoted ? "Ballot Cast ✅" : "Active Voter ⚡"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-10">
                          <button className="p-3 rounded-2xl text-slate-400 hover:bg-white hover:text-primary hover:shadow-xl transition-all">
                            <Eye size={24} />
                          </button>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-60 text-center text-slate-400 font-black text-xl">No matching voters found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid lg:grid-cols-3 gap-10">
              <Card className="lg:col-span-2 rounded-[3.5rem] border-none shadow-2xl bg-white p-12">
                <CardHeader className="p-0 mb-12">
                  <CardTitle className="text-3xl font-black">Live Ballot Distribution</CardTitle>
                  <CardDescription className="font-bold text-slate-400 mt-2">Distribution of votes across registered political parties.</CardDescription>
                </CardHeader>
                <div className="h-[450px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={partyVotes}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 900, fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 900, fill: '#64748b' }} dx={-10} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(0,0,0,0.02)' }} 
                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '20px' }} 
                        labelStyle={{ fontWeight: 900, color: '#0f172a', marginBottom: '8px', fontSize: '16px' }}
                      />
                      <Bar dataKey="value" radius={[16, 16, 0, 0]} barSize={80}>
                        {partyVotes.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="rounded-[3.5rem] border-none shadow-2xl bg-white p-12 flex flex-col items-center justify-center">
                <CardHeader className="p-0 text-center w-full mb-12">
                  <CardTitle className="text-2xl font-black">Election Turnout</CardTitle>
                  <CardDescription className="font-bold text-slate-400">Total participation vs registration.</CardDescription>
                </CardHeader>
                <div className="h-[320px] w-full relative flex items-center justify-center scale-110">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Voted', value: totalVotes, color: '#4f46e5' },
                          { name: 'Remaining', value: Math.max(0, totalRegistered - totalVotes), color: '#f8fafc' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={90}
                        outerRadius={120}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                      >
                        <Cell fill="#4f46e5" />
                        <Cell fill="#f1f5f9" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-5xl font-black text-slate-900 tracking-tighter">{turnout.toFixed(1)}%</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Participation</span>
                  </div>
                </div>
                <div className="mt-12 space-y-4 w-full">
                  <div className="flex justify-between items-center bg-slate-50 p-5 rounded-2xl">
                    <span className="text-xs font-black text-slate-400 uppercase">Registry Total</span>
                    <span className="text-xl font-black text-slate-900">{totalRegistered}</span>
                  </div>
                  <div className="flex justify-between items-center bg-primary/5 p-5 rounded-2xl border border-primary/10">
                    <span className="text-xs font-black text-primary uppercase">Ballots Received</span>
                    <span className="text-xl font-black text-primary">{totalVotes}</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ledger">
             <Card className="rounded-[3rem] border-none shadow-2xl bg-white overflow-hidden">
              <div className="p-10 border-b border-slate-50">
                <CardTitle className="text-3xl font-black text-slate-900">Election Audit Ledger</CardTitle>
                <CardDescription className="font-bold text-slate-400 text-base mt-2">Transparent record showing exactly who voted for which party.</CardDescription>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableHead className="py-6 pl-10 font-black text-slate-400 uppercase tracking-widest text-[10px]">Voter Photo</TableHead>
                      <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Name & Aadhaar</TableHead>
                      <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Timestamp</TableHead>
                      <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Party Selected</TableHead>
                      <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[10px] text-right pr-10">Security Hash</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.filter(u => u.hasVoted).length > 0 ? users.filter(u => u.hasVoted).map((user) => (
                      <TableRow key={user.id} className="border-slate-50 hover:bg-slate-50/50 transition-all">
                        <TableCell className="py-6 pl-10">
                          <Avatar className="w-14 h-14 rounded-2xl border-2 border-white shadow-lg">
                            <AvatarImage src={user.photo} className="object-cover" />
                            <AvatarFallback className="bg-slate-100 text-slate-400 font-bold">{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-black text-slate-900 text-base">{user.name}</span>
                            <span className="text-[10px] font-mono font-bold text-slate-400">UID: {user.aadhaar}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-black text-slate-600 text-xs">
                          {user.votedAt ? new Date(user.votedAt).toLocaleString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                             <div className={cn(
                                "w-3 h-3 rounded-full",
                                user.votedFor === "TDP" && "bg-yellow-400",
                                user.votedFor === "YSRCP" && "bg-blue-600",
                                user.votedFor === "BJP" && "bg-orange-500",
                                user.votedFor === "Congress" && "bg-green-600",
                                user.votedFor === "NOTA" && "bg-slate-400"
                             )} />
                             <span className="font-black text-slate-900 text-sm tracking-tight">{user.votedFor}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-10">
                          <span className="text-[10px] font-mono font-bold text-slate-300 bg-slate-50 px-3 py-1 rounded-md">SHA256_{user.id.slice(0,10).toUpperCase()}</span>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-60 text-center text-slate-400 font-black text-xl">Waiting for first ballot to be cast.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color }: any) {
  const themes: any = { 
    blue: "bg-blue-600 text-white shadow-blue-200", 
    amber: "bg-amber-500 text-white shadow-amber-200", 
    emerald: "bg-emerald-600 text-white shadow-emerald-200", 
    indigo: "bg-indigo-600 text-white shadow-indigo-200" 
  };
  return (
    <Card className={cn("rounded-[3rem] border-none shadow-2xl p-10 transition-all hover:scale-[1.03] hover:-translate-y-1 cursor-default", themes[color])}>
      <div className="flex items-start justify-between mb-8">
        <div className="p-4 bg-white/20 rounded-[1.5rem] backdrop-blur-md shadow-inner">{icon}</div>
        <div className="text-[10px] font-black px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md uppercase tracking-widest">{trend}</div>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-black text-white/70 uppercase tracking-widest">{title}</p>
        <p className="text-5xl font-black tracking-tighter">{value}</p>
      </div>
    </Card>
  );
}
