'use server';
/**
 * @fileOverview Secure face enrollment with biometric uniqueness logic.
 * Handles Resource Exhausted (429) errors gracefully.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const SecureFaceEnrollmentInputSchema = z.object({
  aadhaarNumber: z.string().describe('The Aadhaar number.'),
  faceImageDataUri: z.string().describe("Photo data URI."),
  existingEncodings: z.array(z.string()).optional().describe('Textual descriptions of already registered faces.'),
});
export type SecureFaceEnrollmentInput = z.infer<typeof SecureFaceEnrollmentInputSchema>;

const SecureFaceEnrollmentOutputSchema = z.object({
  isLive: z.boolean().describe("Whether the person is live."),
  isDuplicate: z.boolean().describe("Whether this face matches another person in the provided existing list."),
  faceEncodingDescription: z.string().optional().describe("Unique textual signature of the face."),
  enrollmentStatus: z.enum(['success', 'failure']),
  message: z.string(),
});
export type SecureFaceEnrollmentOutput = z.infer<typeof SecureFaceEnrollmentOutputSchema>;

const secureFaceEnrollmentPrompt = ai.definePrompt({
  name: 'secureFaceEnrollmentPrompt',
  input: { schema: SecureFaceEnrollmentInputSchema },
  output: { schema: SecureFaceEnrollmentOutputSchema },
  model: googleAI.model('gemini-2.5-flash'), 
  prompt: `You are a biometric security agent for a high-integrity election system. 

TASKS:
1. **Liveness Detection**: Analyze the image. Ensure it is a real, 3D person and not a photo of a screen, a mobile device, or a high-res print.
2. **Feature Encoding**: Generate a highly detailed textual signature of unique facial features (e.g., eye shape, nasal bridge profile, jaw curvature).
3. **Uniqueness Check**: Compare the person in the current image to the following existing profiles. If they match any profile, set 'isDuplicate' to true.

Existing Registered Profiles:
{{#each existingEncodings}}
- Profile {{this}}
{{else}}
(No existing profiles yet)
{{/each}}

User Aadhaar: {{{aadhaarNumber}}}
Image to Enroll: {{media url=faceImageDataUri}}`,
});

export async function secureFaceEnrollment(
  input: SecureFaceEnrollmentInput
): Promise<SecureFaceEnrollmentOutput> {
  try {
    const { output } = await secureFaceEnrollmentPrompt(input);
    
    if (!output) {
      return { isLive: false, isDuplicate: false, enrollmentStatus: 'failure', message: 'Biometric analysis engine timed out.' };
    }
    
    if (output.isDuplicate) {
      return { ...output, enrollmentStatus: 'failure', message: 'Duplicate biometric detected. This face is already registered under another ID.' };
    }

    if (!output.isLive) {
      return { ...output, enrollmentStatus: 'failure', message: 'Liveness check failed. Please look directly at the camera. Digital photos of faces are not allowed.' };
    }

    return {
      ...output,
      enrollmentStatus: 'success',
      message: 'Identity securely enrolled and unique signature stored.',
    };
  } catch (error: any) {
    const errorMsg = error.message || '';
    if (errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED')) {
      return { isLive: false, isDuplicate: false, enrollmentStatus: 'failure', message: "AI Quota limit reached. Please wait 10 seconds and try again." };
    }
    return { isLive: false, isDuplicate: false, enrollmentStatus: 'failure', message: "Verification system busy. Ensure your face is well-lit and clearly visible." };
  }
}