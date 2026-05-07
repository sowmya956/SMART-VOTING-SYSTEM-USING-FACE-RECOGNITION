
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVotingStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Fingerprint, CreditCard, Lock, ShieldAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { getUserByAadhaar } = useVotingStore();
  const [aadhaar, setAadhaar] = useState("");
  const [mounted, setMounted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    
    const user = getUserByAadhaar(aadhaar);
    if (!user) {
      setErrorMsg("Aadhaar record not found. Please register first.");
      return;
    }

    if (user.hasVoted) {
      setErrorMsg("UR VOTE ALREDY CASTED. Duplicate voting is strictly prohibited.");
      toast({ 
        title: "Access Denied", 
        description: "One person can only vote once.", 
        variant: "destructive" 
      });
      return;
    }

    // Proceed to biometric verification
    sessionStorage.setItem("auth_aadhaar", aadhaar);
    router.push("/login/biometric");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-3xl rounded-[3rem] border-none overflow-hidden bg-white">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
          
          <CardHeader className="text-center pt-14 pb-8">
            <div className="w-20 h-20 bg-primary/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Lock className="text-primary" size={36} />
            </div>
            <CardTitle className="text-4xl font-black text-slate-900 tracking-tight">Identity Booth</CardTitle>
            <CardDescription className="text-base font-medium px-4">
              Enter your Aadhaar to begin secure AI face authentication.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-16 px-10 space-y-8">
            {errorMsg && (
              <Alert variant="destructive" className="rounded-2xl border-none bg-red-50 text-red-700 animate-in fade-in slide-in-from-top-2">
                <ShieldAlert className="h-5 w-5" />
                <AlertTitle className="font-black text-xs uppercase tracking-widest">Election Error</AlertTitle>
                <AlertDescription className="font-bold text-sm">{errorMsg}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="aadhaar" className="text-xs font-black uppercase tracking-widest text-slate-400">Aadhaar (12-Digit)</Label>
                <div className="relative">
                  <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input 
                    id="aadhaar" 
                    placeholder="Enter UID number" 
                    className="h-16 pl-14 rounded-2xl bg-slate-50 border-none shadow-inner font-black text-lg tracking-wider" 
                    maxLength={12}
                    required 
                    value={aadhaar}
                    onChange={e => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))}
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full h-16 text-xl font-black rounded-2xl shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-transform">
                Verify My Face
                <Fingerprint className="ml-2" />
              </Button>
              
              <div className="text-center pt-4">
                <p className="text-sm font-bold text-slate-400">
                  Not registered? <a href="/register" className="text-accent hover:underline">Register Now</a>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
