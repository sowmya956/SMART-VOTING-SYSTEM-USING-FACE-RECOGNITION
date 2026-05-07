"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { WebcamCapture } from "@/components/webcam-capture";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { secureFaceEnrollment } from "@/ai/flows/secure-face-enrollment";
import { useVotingStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, ArrowLeft, CheckCircle2, AlertTriangle, ScanEye } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function FaceEnrollmentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { users, addUser, updateUserBiometrics } = useVotingStore();
  const [userData, setUserData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [enrollmentComplete, setEnrollmentComplete] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("pending_reg");
    if (!stored) {
      router.push("/register");
    } else {
      setUserData(JSON.parse(stored));
    }
  }, [router]);

  const handleCapture = async (imageUri: string) => {
    if (!userData) return;
    
    setErrorMsg(null);
    setIsProcessing(true);
    
    try {
      const existingEncodings = users
        .map(u => u.faceEncoding)
        .filter((e): e is string => !!e);

      const result = await secureFaceEnrollment({
        aadhaarNumber: userData.aadhaar,
        faceImageDataUri: imageUri,
        existingEncodings
      });

      if (result.enrollmentStatus === "success" && result.isLive && !result.isDuplicate) {
        addUser({
          name: userData.name,
          mobile: userData.mobile,
          aadhaar: userData.aadhaar
        });
        
        if (result.faceEncodingDescription) {
          updateUserBiometrics(userData.aadhaar, imageUri, result.faceEncodingDescription);
        }
        
        setEnrollmentComplete(true);
        toast({ title: "Enrollment Successful", description: "Biometric profile generated and stored." });
        sessionStorage.removeItem("pending_reg");
      } else {
        const msg = result.isDuplicate 
          ? "Duplicate face detected. This person is already registered under a different ID." 
          : result.message || "Liveness check failed. Please ensure you are a real person.";
        
        setErrorMsg(msg);
        toast({ 
          title: "Registration Denied", 
          description: msg,
          variant: "destructive" 
        });
      }
    } catch (err: any) {
      setErrorMsg("An unexpected system error occurred during AI processing.");
      toast({ title: "Error", description: "Biometric analysis failed.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl shadow-3xl rounded-[3rem] border-none overflow-hidden bg-white">
          {!enrollmentComplete ? (
            <>
              <CardHeader className="text-center pt-14">
                <div className="w-20 h-20 bg-accent/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <ScanEye className="text-accent" size={40} />
                </div>
                <CardTitle className="text-4xl font-black text-slate-900 tracking-tight">Biometric Mapping</CardTitle>
                <CardDescription className="text-lg font-medium">
                  Scanning your unique facial features for ID generation.
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-16 px-12 space-y-10">
                {errorMsg && (
                  <Alert variant="destructive" className="rounded-2xl border-none bg-red-50 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    <AlertTitle className="font-black text-xs uppercase tracking-widest">Enrollment Issue</AlertTitle>
                    <AlertDescription className="font-bold text-sm">{errorMsg}</AlertDescription>
                  </Alert>
                )}

                <WebcamCapture onCapture={handleCapture} isProcessing={isProcessing} buttonText="Enroll My Face" />
                
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <p className="text-xs text-slate-400 text-center leading-relaxed font-bold uppercase tracking-widest">
                    Privacy Policy: We generate a textual signature of your face. One face can only be registered once.
                  </p>
                </div>

                <Button 
                  variant="ghost" 
                  onClick={() => router.push("/register")} 
                  className="w-full rounded-2xl h-14 font-bold"
                  disabled={isProcessing}
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Modify Registration Details
                </Button>
              </CardContent>
            </>
          ) : (
            <div className="p-20 text-center space-y-10">
              <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 shadow-xl shadow-green-100">
                <CheckCircle2 size={72} />
              </div>
              <div className="space-y-4">
                <h2 className="text-5xl font-black text-slate-900 tracking-tight">Identity Secured!</h2>
                <p className="text-xl text-slate-500 font-medium max-w-sm mx-auto">
                  <b>{userData.name}</b>, you are now an authorized voter in our system.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <Button onClick={() => router.push("/login")} size="lg" className="h-16 text-xl font-black rounded-2xl shadow-2xl shadow-primary/30">
                  Enter Voting Booth
                </Button>
                <Button variant="outline" onClick={() => router.push("/")} className="rounded-2xl h-16 font-bold text-lg">
                  Back to Home
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}