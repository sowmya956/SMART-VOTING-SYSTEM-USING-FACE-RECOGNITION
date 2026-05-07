
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Vote, Users, BarChart3, Fingerprint, ScanEye, ShieldAlert } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 overflow-hidden bg-white">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-10 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-bold border border-accent/20">
                  <ScanEye size={18} />
                  AI-Powered Liveness Detection
                </div>
                <h1 className="text-6xl lg:text-8xl font-black tracking-tight text-primary leading-[0.9]">
                  Smart <br />
                  <span className="text-accent">Voting</span> <br />
                  System
                </h1>
                <p className="text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                  Eliminate electoral fraud with <b>Face Recognition</b> technology. Secure Aadhaar verification, real-time anti-spoofing, and transparent digital auditing.
                </p>
                <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                  <Link href="/register">
                    <Button size="lg" className="w-full sm:w-auto px-10 h-16 text-xl font-bold rounded-2xl shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all">
                      Register to Vote
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto px-10 h-16 text-xl font-bold rounded-2xl border-2 hover:bg-slate-50 shadow-xl shadow-slate-200 transition-all">
                      Go to Voting Booth
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="relative group perspective-1000">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary via-accent to-primary rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-30 transition duration-1000 animate-pulse"></div>
                <div className="relative bg-white p-3 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100">
                   <img 
                    src="https://picsum.photos/seed/smartvote/800/600" 
                    alt="Facial Recognition Voting" 
                    className="rounded-[2.5rem] w-full object-cover"
                    data-ai-hint="facial recognition"
                  />
                  <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                        <ShieldCheck size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status</p>
                        <p className="font-bold text-slate-800">Identity Verified</p>
                      </div>
                    </div>
                    <div className="h-12 w-px bg-slate-200" />
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Encryption</p>
                      <p className="font-bold text-accent">AES-256</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-24">
              <h2 className="text-5xl font-black text-primary mb-6 tracking-tight">Security Protocols</h2>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">Multi-layered verification ensuring the integrity of every single ballot.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10">
              <ProtocolCard 
                icon={<Fingerprint size={32} />}
                title="Aadhaar Auth"
                description="Secure 12-digit UIDAI validation coupled with mobile OTP verification for ironclad entry."
              />
              <ProtocolCard 
                icon={<ScanEye size={32} />}
                title="Biometric Face ID"
                description="AI-driven facial feature mapping that ensures 'one face, one vote' across the entire nation."
              />
              <ProtocolCard 
                icon={<ShieldAlert size={32} />}
                title="Anti-Spoofing"
                description="Advanced liveness detection blocks photos of screens or printed images to prevent fraud."
              />
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section className="py-32 bg-primary overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent" />
          </div>
          <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-20 items-center">
            <div className="text-white space-y-8">
              <h2 className="text-5xl font-black tracking-tight leading-none">Complete Transparency <br /><span className="text-accent">Admin Dashboard</span></h2>
              <p className="text-xl text-primary-foreground/80 leading-relaxed font-medium">
                Election officials get a real-time feed of the registry, including voter photos, Aadhaar details, and verified party selections to ensure an audited process.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/10 p-6 rounded-3xl border border-white/10">
                  <div className="text-3xl font-black mb-1">100%</div>
                  <div className="text-sm font-bold text-white/60">Anonymized Audit</div>
                </div>
                <div className="bg-white/10 p-6 rounded-3xl border border-white/10">
                  <div className="text-3xl font-black mb-1">REAL</div>
                  <div className="text-sm font-bold text-white/60">Time Tracking</div>
                </div>
              </div>
              <Link href="/admin">
                <Button variant="secondary" size="lg" className="h-16 px-10 text-lg font-bold rounded-2xl hover:scale-105 transition-transform">
                  Access Dashboard
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="bg-white/5 p-4 rounded-[3rem] border border-white/10 shadow-3xl">
                <img 
                  src="https://picsum.photos/seed/adminview/800/600" 
                  alt="Admin Dashboard Preview" 
                  className="rounded-[2.5rem] opacity-90 grayscale"
                  data-ai-hint="dashboard UI"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t py-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-primary" size={28} />
              <span className="font-black text-2xl tracking-tighter text-primary">SmartVote AI</span>
            </div>
            <p className="text-sm font-bold text-slate-400">© 2024 Advanced Biometric Democracy.</p>
          </div>
          <div className="flex gap-12">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Portal</span>
              <Link href="/admin" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">Admin Dashboard</Link>
              <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">Voter Booth</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Support</span>
              <Link href="#" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">Technical Docs</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProtocolCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group p-10 rounded-[3rem] bg-white border border-slate-100 hover:border-primary/20 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2">
      <div className="w-20 h-20 bg-primary/5 text-primary rounded-[2rem] flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-500 shadow-sm">
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4 text-primary tracking-tight">{title}</h3>
      <p className="text-slate-500 leading-relaxed font-medium">{description}</p>
    </div>
  );
}
