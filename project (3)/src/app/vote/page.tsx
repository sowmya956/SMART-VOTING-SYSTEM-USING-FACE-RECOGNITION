
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVotingStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { ShieldAlert, CheckCircle2, ChevronRight, Info, Award, UserCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PARTIES = [
  { id: "TDP", name: "Telugu Desam Party", color: "bg-yellow-400", symbol: "🚲", slogan: "Service & Progress" },
  { id: "YSRCP", name: "Yuvajana Sramika Rythu Congress Party", color: "bg-blue-600", symbol: "🏠", slogan: "Welfare First" },
  { id: "BJP", name: "Bharatiya Janata Party", color: "bg-orange-500", symbol: "🪷", slogan: "National Growth" },
  { id: "Congress", name: "Indian National Congress", color: "bg-green-600", symbol: "✋", slogan: "Inclusive India" },
  { id: "NOTA", name: "None Of The Above", color: "bg-slate-400", symbol: "❌", slogan: "Reject All" }
];

export default function VotePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { getUserByAadhaar, markAsVoted } = useVotingStore();
  
  const [mounted, setMounted] = useState(false);
  const [voter, setVoter] = useState<any>(null);
  const [selectedParty, setSelectedParty] = useState<string | null>(null);
  const [isCasting, setIsCasting] = useState(false);
  const [hasVotedNow, setHasVotedNow] = useState(false);

  useEffect(() => {
    setMounted(true);
    const aadhaar = sessionStorage.getItem("current_voter_id");
    if (!aadhaar) {
      router.push("/login");
      return;
    }
    const user = getUserByAadhaar(aadhaar);
    if (!user || user.hasVoted) {
      router.push("/login");
      return;
    }
    setVoter(user);
  }, [getUserByAadhaar, router]);

  if (!mounted || !voter) return null;

  const handleCastVote = () => {
    if (!selectedParty || !voter) return;
    
    setIsCasting(true);
    // Simulate encryption and recording delay
    setTimeout(() => {
      markAsVoted(voter.aadhaar, selectedParty);
      setIsCasting(false);
      setHasVotedNow(true);
      sessionStorage.removeItem("current_voter_id");
      toast({ title: "Ballot Cast", description: "Your choice has been securely recorded." });
    }, 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar />
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-14">
        {!hasVotedNow ? (
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-white p-8 rounded-[3rem] shadow-xl border border-slate-200/50">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24 rounded-[2rem] border-4 border-white shadow-2xl">
                  <AvatarImage src={voter.photo} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-primary font-black text-2xl">{voter.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-md">Live Session</span>
                    <UserCheck className="text-green-500" size={16} />
                  </div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight">{voter.name}</h1>
                  <p className="text-slate-400 font-bold text-sm">Aadhaar: {voter.aadhaar.slice(0,4)} {voter.aadhaar.slice(4,8)} {voter.aadhaar.slice(8,12)}</p>
                </div>
              </div>
              <div className="bg-primary/5 px-8 py-4 rounded-[2rem] border border-primary/10 flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status</span>
                  <span className="text-sm font-black text-primary uppercase">Secure & Anonymized</span>
                </div>
              </div>
            </div>

            <Alert className="bg-white border-none shadow-xl rounded-[2rem] p-8">
              <Info className="h-6 w-6 text-primary" />
              <div className="ml-4">
                <AlertTitle className="text-xl font-black text-slate-900 mb-2">Instructions for Voting</AlertTitle>
                <AlertDescription className="text-slate-500 font-medium leading-relaxed">
                  Below is your electronic ballot. Please select your preferred party. Your choice is linked to your ID for audit transparency but kept secure. **Once submitted, your vote is final.**
                </AlertDescription>
              </div>
            </Alert>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
              {PARTIES.map((party) => (
                <button
                  key={party.id}
                  onClick={() => setSelectedParty(party.id)}
                  disabled={isCasting}
                  className={`
                    group relative p-8 rounded-[3rem] border-4 transition-all text-left flex flex-col items-center gap-6
                    ${selectedParty === party.id 
                      ? 'border-primary bg-primary shadow-[0_40px_80px_-20px_rgba(79,70,229,0.3)] scale-[1.05] z-10' 
                      : 'border-white bg-white hover:border-slate-200 hover:shadow-2xl hover:-translate-y-1'
                    }
                  `}
                >
                  <div className={`w-24 h-24 ${party.color} rounded-[2rem] flex items-center justify-center text-5xl shadow-2xl transform transition-transform group-hover:rotate-6 ${selectedParty === party.id ? 'scale-110 border-4 border-white/20' : ''}`}>
                    {party.symbol}
                  </div>
                  <div className="text-center">
                    <h3 className={`text-2xl font-black mb-1 tracking-tight ${selectedParty === party.id ? 'text-white' : 'text-slate-900'}`}>{party.name}</h3>
                    <p className={`text-sm font-bold uppercase tracking-widest ${selectedParty === party.id ? 'text-white/60' : 'text-slate-400'}`}>{party.slogan}</p>
                  </div>
                  
                  {selectedParty === party.id && (
                    <div className="absolute top-6 right-6 text-white bg-white/20 p-2 rounded-full backdrop-blur-md">
                      <CheckCircle2 size={24} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 z-50">
              <div className="bg-white/90 backdrop-blur-2xl border border-white/50 p-6 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] flex flex-col sm:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center text-red-600 shadow-inner">
                    <ShieldAlert size={32} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-lg leading-tight uppercase tracking-tight">One Person, One Vote</h4>
                    <p className="text-sm font-bold text-slate-400">Your democratic duty ends after this click.</p>
                  </div>
                </div>
                
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto px-16 h-20 text-2xl font-black rounded-3xl shadow-2xl shadow-primary/30 active:scale-95 transition-all"
                  disabled={!selectedParty || isCasting}
                  onClick={handleCastVote}
                >
                  {isCasting ? (
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      Encrypting...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      Cast Final Vote
                      <Award className="w-6 h-6" />
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto py-20 text-center space-y-12 bg-white p-20 rounded-[4rem] shadow-3xl border border-slate-100">
            <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 shadow-2xl shadow-green-100 border-4 border-white">
              <CheckCircle2 size={80} />
            </div>
            <div className="space-y-6">
              <h2 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">TQ FOR VOTING!</h2>
              <p className="text-2xl text-slate-500 font-medium max-w-sm mx-auto">
                Your democratic right has been securely exercised and anonymously recorded in the system.
              </p>
            </div>
            <Button onClick={() => router.push("/")} size="lg" className="w-full h-16 rounded-2xl text-xl font-black shadow-2xl shadow-primary/20">
              Return to Landing Page
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
