'use server';
/**
 * @fileOverview This file defines the Genkit flow for biometric voter authentication.
 * It enforces liveness detection to prevent spoofing.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const BiometricVoterAuthenticationInputSchema = z.object({
  aadhaarNumber: z.string().describe("The 12-digit Aadhaar number."),
  liveFaceDataUri: z.string().describe("Real-time capture of the voter."),
  storedFaceDescription: z.string().describe("Registered biometric profile from enrollment."),
});
export type BiometricVoterAuthenticationInput = z.infer<typeof BiometricVoterAuthenticationInputSchema>;

const BiometricVoterAuthenticationOutputSchema = z.object({
  isAuthenticated: z.boolean().describe("True if verified live and matches stored profile."),
  message: z.string().describe("Result explanation."),
});
export type BiometricVoterAuthenticationOutput = z.infer<typeof BiometricVoterAuthenticationOutputSchema>;

const biometricMatchPrompt = ai.definePrompt({
  name: 'biometricMatchPrompt',
  input: {
    schema: z.object({
      liveFaceDataUri: z.string(),
      storedFaceDescription: z.string(),
    }),
  },
  output: {
    schema: z.object({
      isLive: z.boolean().describe("False if it's a photo of a screen or print."),
      isMatch: z.boolean().describe("True if the live face matches the stored signature."),
      reason: z.string(),
    }),
  },
  model: googleAI.model('gemini-2.5-flash'),
  prompt: `You are a high-security biometric authentication agent.

CRITICAL PROTOCOLS:
1. **Liveness**: Detect if the input is a live human. Reject mobile screens, digital photos, or printouts. Look for screen glare or lack of parallax.
2. **Biometric Comparison**: Compare the person in the current image to this registered signature: "{{storedFaceDescription}}".

Live Capture: {{media url=liveFaceDataUri}}`,
});

export async function biometricVoterAuthentication(
  input: BiometricVoterAuthenticationInput
): Promise<BiometricVoterAuthenticationOutput> {
  try {
    const { output } = await biometricMatchPrompt({ 
      liveFaceDataUri: input.liveFaceDataUri,
      storedFaceDescription: input.storedFaceDescription
    });

    if (!output) {
      return { isAuthenticated: false, message: "Authentication service unavailable. Retry shortly." };
    }

    if (!output.isLive) {
      return { 
        isAuthenticated: false, 
        message: "Liveness detection failed. Please present yourself to the camera, not a photograph." 
      };
    }

    if (!output.isMatch) {
      return { 
        isAuthenticated: false, 
        message: "Biometric identity mismatch. You are not the registered voter for this ID." 
      };
    }

    return { isAuthenticated: true, message: "Identity confirmed. Access to ballot granted." };
  } catch (error: any) {
    const errorMsg = error.message || '';
    if (errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED')) {
      return { isAuthenticated: false, message: "System capacity reached. Please wait 10 seconds and retry." };
    }
    return { isAuthenticated: false, message: "Verification failed. Ensure your face is clearly visible." };
  }
}
