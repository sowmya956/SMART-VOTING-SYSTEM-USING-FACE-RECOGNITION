# **App Name**: SecureVote AI

## Core Features:

- Secure Voter Registration: Allow users to register with full name, mobile number, and a unique Aadhaar number. Mobile numbers are verified via a one-time password (OTP) before account creation.
- AI-Powered Face Enrollment: After OTP verification, capture the user's face via webcam and store encoded facial features. An AI tool for liveness detection (e.g., eye blink or head movement) is integrated during capture to prevent spoofing and ensure one Aadhaar per unique face.
- Biometric Voter Authentication: Voters log in using their Aadhaar number and real-time face recognition. The system verifies that the live face matches the registered facial encoding for the given Aadhaar, incorporating anti-spoofing measures.
- Secure Ballot Submission: Enable authenticated users to cast a single vote for one of the available parties (TDP, YSRCP, BJP, Congress, NOTA). The system marks the user as 'voted' to prevent re-voting.
- Admin Portal & Voting Analytics: Provide a secure administrator interface to view system metrics, including total registered users, total votes cast, and a breakdown of votes per party.

## Style Guidelines:

- Primary brand color: A deep, professional blue (#2D5986), symbolizing trust and authority. This will be used for key interactive elements like buttons and primary headlines.
- Background color: A very light, desaturated blue-gray (#EAEDF0), providing a clean, spacious, and neutral canvas for content, maintaining readability and calm.
- Accent color: A vibrant purple (#573CE5) used sparingly for highlights, important alerts, and to draw attention to call-to-action elements, offering a modern and dynamic contrast to the primary blue.
- Body and headline font: 'Inter' (sans-serif) for its modern, highly readable, and neutral aesthetic, suitable for clear presentation of functional content and user guidance.
- Utilize clean, recognizable vector-based icons that clearly communicate their purpose. Focus on icons for registration, security (lock/shield), voting (ballot box/check), and analytics (charts).
- Implement a structured and responsive layout, prioritizing clarity and ease of navigation. Use ample whitespace, multi-step forms for sequential processes (registration, voting), and clear calls-to-action. Content should be centrally aligned on larger screens.
- Incorporate subtle animations for feedback, such as loading spinners during face recognition or OTP verification, and discreet transitions for successful form submissions or error messages, ensuring a smooth and responsive user experience.