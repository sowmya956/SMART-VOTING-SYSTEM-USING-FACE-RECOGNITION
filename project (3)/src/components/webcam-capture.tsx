"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Camera, RefreshCw, ShieldCheck, Video, Lock as LockIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface WebcamCaptureProps {
  onCapture: (imageUri: string) => void;
  buttonText?: string;
  isProcessing?: boolean;
}

export function WebcamCapture({ onCapture, buttonText = "Capture Face", isProcessing = false }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isInitializing = useRef<boolean>(false);
  
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'BUSY' | 'DENIED' | 'NOT_FOUND' | null>(null);
  const { toast } = useToast();

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    if (isInitializing.current) return;
    
    isInitializing.current = true;
    stopCamera();
    setErrorType(null);
    setHasCameraPermission(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (!videoRef.current) {
        stream.getTracks().forEach(t => t.stop());
        return;
      }

      streamRef.current = stream;
      setHasCameraPermission(true);
      videoRef.current.srcObject = stream;
      
      try {
        await videoRef.current.play();
      } catch (playError) {
        // Handle potential autoplay block or race
      }
    } catch (error: any) {
      setHasCameraPermission(false);
      
      if (error.name === 'NotReadableError' || error.name === 'TrackStartError' || error.name === 'AbortError') {
        setErrorType('BUSY');
      } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setErrorType('DENIED');
      } else {
        setErrorType('NOT_FOUND');
      }

      toast({
        variant: 'destructive',
        title: 'Hardware Error',
        description: error.name === 'NotReadableError' 
          ? 'Camera is busy. Please close other apps using the camera and try again.'
          : 'Could not access camera. Please check your system settings.',
      });
    } finally {
      isInitializing.current = false;
    }
  }, [stopCamera, toast]);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        const width = videoRef.current.videoWidth || 640;
        const height = videoRef.current.videoHeight || 480;
        
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        
        context.translate(width, 0);
        context.scale(-1, 1);
        
        context.drawImage(videoRef.current, 0, 0, width, height);
        const dataUri = canvasRef.current.toDataURL("image/jpeg", 0.9);
        setCapturedImage(dataUri);
        onCapture(dataUri);
      }
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    startCamera();
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="relative w-full aspect-video bg-slate-950 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/10 ring-1 ring-black/5">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted
          className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-300 ${capturedImage ? 'opacity-0' : 'opacity-100'}`}
        />
        
        {capturedImage && (
          <img 
            src={capturedImage} 
            alt="Captured face" 
            className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-300"
          />
        )}
        
        <div className="absolute inset-0 border-[2px] border-white/20 rounded-[2.5rem] pointer-events-none flex items-center justify-center">
            <div className="w-1/2 h-2/3 border-2 border-dashed border-white/30 rounded-full opacity-50" />
        </div>

        {isProcessing && (
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-xl flex flex-col items-center justify-center text-white z-20">
            <RefreshCw className="w-16 h-16 animate-spin mb-4" />
            <h3 className="font-black text-2xl tracking-tighter uppercase">Biometric Verification</h3>
            <p className="text-sm opacity-90 font-bold uppercase tracking-widest">Ensuring Liveness & Uniqueness...</p>
          </div>
        )}

        {hasCameraPermission === false && (
          <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-8 text-center z-10">
            <div className="w-20 h-20 bg-red-500/20 rounded-[2rem] flex items-center justify-center mb-6 border border-red-500/50">
              <LockIcon className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-white font-black text-3xl mb-2 tracking-tight uppercase">Access Blocked</h3>
            <p className="text-slate-400 text-sm max-w-xs mb-8 font-medium">
              {errorType === 'BUSY' 
                ? 'Your camera is busy in another application. Please close other tabs and try again.'
                : 'Camera access is required for biometric authentication. Please check your browser\'s permission settings.'}
            </p>
            <Button onClick={startCamera} variant="secondary" className="rounded-2xl px-10 h-14 font-black text-lg shadow-xl hover:scale-105 transition-transform">
              <RefreshCw className="mr-2 h-5 w-5" />
              Try Enabling Camera
            </Button>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {hasCameraPermission === false && (
        <Alert variant="destructive" className="rounded-[2rem] border-none bg-red-50 text-red-800 p-6 shadow-lg">
          <AlertTitle className="font-black text-lg flex items-center gap-3 uppercase tracking-tight">
            <Video size={24} /> Hardware Failure
          </AlertTitle>
          <AlertDescription className="font-bold text-sm mt-2 opacity-80">
            {errorType === 'BUSY' 
              ? 'Multiple applications are attempting to use the camera simultaneously.' 
              : 'Could not start video source. Ensure no other applications are using the camera.'}
          </AlertDescription>
        </Alert>
      )}

      <div className="w-full flex flex-col gap-4">
        {!capturedImage ? (
          <Button 
            onClick={handleCapture} 
            className="w-full h-18 text-2xl font-black rounded-3xl shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all" 
            disabled={isProcessing || hasCameraPermission !== true}
          >
            <Camera className="mr-3 w-7 h-7" />
            {buttonText}
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={resetCapture} 
            className="w-full h-18 text-xl font-black rounded-3xl bg-white border-4 border-slate-100 hover:bg-slate-50 shadow-xl transition-all"
            disabled={isProcessing}
          >
            <RefreshCw className="mr-3 w-6 h-6" />
            Retake Photo
          </Button>
        )}
      </div>
    </div>
  );
}