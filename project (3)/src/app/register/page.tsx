
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
import { ArrowRight, UserPlus, Phone, CreditCard, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { getUserByAadhaar } = useVotingStore();
  
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    aadhaar: ""
  });
  
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 12);
    setFormData({ ...formData, aadhaar: value });
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData({ ...formData, mobile: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.aadhaar.length !== 12) {
      toast({ title: "Invalid Aadhaar", description: "Aadhaar number must be exactly 12 digits.", variant: "destructive" });
      return;
    }

    if (formData.mobile.length !== 10) {
      toast({ title: "Invalid Mobile", description: "Mobile number must be exactly 10 digits.", variant: "destructive" });
      return;
    }
    
    if (getUserByAadhaar(formData.aadhaar)) {
      toast({ title: "Already Registered", description: "This Aadhaar number is already in our system.", variant: "destructive" });
      return;
    }

    // Simulate sending OTP
    setStep(2);
    toast({ title: "OTP Sent", description: "Verification code sent to your mobile. Use 123456." });
  };

  const handleVerifyOtp = () => {
    setIsVerifying(true);
    setTimeout(() => {
      if (otp === "123456") {
        try {
          sessionStorage.setItem("pending_reg", JSON.stringify(formData));
          router.push("/register/face");
        } catch (error) {
          console.error("Storage error:", error);
          toast({ title: "Error", description: "Failed to save registration data.", variant: "destructive" });
        }
      } else {
        toast({ title: "Invalid OTP", description: "The OTP entered is incorrect. Please try again.", variant: "destructive" });
      }
      setIsVerifying(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-3xl rounded-[3rem] border-none overflow-hidden bg-white relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary" />
          
          <CardHeader className="text-center pt-14 pb-8">
            <div className="w-20 h-20 bg-primary/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
              {step === 1 ? <UserPlus className="text-primary" size={36} /> : <ShieldCheck className="text-accent" size={36} />}
            </div>
            <CardTitle className="text-4xl font-black text-slate-900 tracking-tight">
              {step === 1 ? "Registration" : "Identity Check"}
            </CardTitle>
            <CardDescription className="text-base font-medium px-4">
              {step === 1 
                ? "Official enrollment for Smart Voting. Provide your UIDAI details." 
                : "A 6-digit code has been dispatched to your registered mobile."}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-16 px-10">
            {step === 1 ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="As per Aadhaar Card" 
                    className="h-14 rounded-2xl bg-slate-50 border-none shadow-inner px-6 font-bold" 
                    required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="mobile" className="text-xs font-black uppercase tracking-widest text-slate-400">Mobile Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input 
                      id="mobile" 
                      type="tel" 
                      placeholder="10-digit mobile" 
                      className="h-14 pl-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold" 
                      required 
                      value={formData.mobile}
                      onChange={handleMobileChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="aadhaar" className="text-xs font-black uppercase tracking-widest text-slate-400">Aadhaar (UID)</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input 
                      id="aadhaar" 
                      placeholder="12-digit number" 
                      className="h-14 pl-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold" 
                      required 
                      value={formData.aadhaar}
                      onChange={handleAadhaarChange}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full h-16 text-lg font-black rounded-2xl shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-transform">
                  Request OTP
                  <ArrowRight className="ml-2" />
                </Button>
              </form>
            ) : (
              <div className="space-y-8 text-center">
                <div className="space-y-4">
                  <Label htmlFor="otp" className="text-xs font-black uppercase tracking-widest text-slate-400">Enter Verification Code</Label>
                  <Input 
                    id="otp" 
                    placeholder="• • • • • •" 
                    className="h-20 text-center text-4xl tracking-[0.5em] font-black rounded-2xl bg-slate-50 border-none shadow-inner" 
                    maxLength={6}
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                  />
                  <p className="text-xs font-bold text-slate-400">Sent to +91 {formData.mobile.slice(0,3)}*****{formData.mobile.slice(-2)}</p>
                </div>
                
                <div className="flex flex-col gap-4">
                  <Button onClick={handleVerifyOtp} disabled={isVerifying} className="w-full h-16 text-lg font-black rounded-2xl shadow-2xl shadow-accent/20">
                    {isVerifying ? "Verifying..." : "Confirm & Proceed"}
                    {!isVerifying && <CheckCircle2 className="ml-2" />}
                  </Button>
                  <Button variant="ghost" onClick={() => setStep(1)} disabled={isVerifying} className="w-full h-14 rounded-2xl font-bold">
                    Edit Details
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
