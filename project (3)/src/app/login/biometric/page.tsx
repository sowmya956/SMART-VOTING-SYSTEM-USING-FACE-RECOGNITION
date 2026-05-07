"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { WebcamCapture } from "@/components/webcam-capture";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { biometricVoterAuthentication } from "@/ai/flows/biometric-voter-authentication";
import { useVotingStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { Fingerprint, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BiometricAuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { getUserByAadhaar } = useVotingStore();
  const [aadhaar, setAadhaar] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("auth_aadhaar");
    if (!stored) {
      router.push("/login");
    } else {
      setAadhaar(stored);
    }
  }, [router]);

  const handleCapture = async (imageUri: string) => {
    if (!aadhaar) return;
    
    const voterRecord = getUserByAadhaar(aadhaar);
    if (!voterRecord || !voterRecord.faceEncoding) {
      toast({ 
        title: "Record Incomplete", 
        description: "Your biometric profile was not found. Please contact support.",
        variant: "destructive" 
      });
      return;
    }
    
    setIsProcessing(true);
    try {
      const result = await biometricVoterAuthentication({
        aadhaarNumber: aadhaar,
        liveFaceDataUri: imageUri,
        storedFaceDescription: voterRecord.faceEncoding
      });

      if (result.isAuthenticated) {
        toast({ title: "Authenticated", description: `Welcome back, ${voterRecord.name || "Voter"}.` });
        sessionStorage.setItem("current_voter_id", aadhaar);
        router.push("/vote");
      } else {
        toast({ 
          title: "Authentication Failed", 
          description: result.message || "Biometric data did not match our records.",
          variant: "destructive" 
        });
      }
    } catch (err) {
      toast({ title: "Error", description: "Biometric verification failed. Please try again.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!aadhaar) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg shadow-2xl rounded-[2rem] border-none overflow-hidden">
          <CardHeader className="text-center pt-10">
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Fingerprint className="text-accent" size={32} />
            </div>
            <CardTitle className="text-3xl font-bold text-primary">Biometric Login</CardTitle>
            <CardDescription className="text-lg">
              Place your face in the frame for identity verification
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-12 px-8">
            <WebcamCapture onCapture={handleCapture} isProcessing={isProcessing} buttonText="Verify Identity" />
            
            <p className="mt-6 text-sm text-muted-foreground text-center">
              Our AI is checking for liveness and matching against your registered biometric profile.
            </p>
            
            <Button 
              variant="ghost" 
              onClick={() => router.push("/login")} 
              className="w-full mt-4"
              disabled={isProcessing}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Use different Aadhaar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}