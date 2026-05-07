# SMART-VOTING-SYSTEM-USING-FACE-RECOGNITION
A secure and intelligent voting platform that uses facial recognition technology to authenticate voters and prevent duplicate or fraudulent voting. This project combines computer vision, machine learning, AI , LLMs and database management to create a modern digital voting solution.
# Project Overview
The Smart Voting System with Face Recognition is designed to improve the transparency, security, and efficiency of elections. Instead of traditional voter identification methods, the system verifies voters using real-time face recognition before allowing them to cast a vote.

The application captures a voter’s facial image through a webcam, compares it with registered voter data, and grants access only if the identity matches successfully. Each voter is allowed to vote only once, ensuring fairness and eliminating impersonation.
# Key Features
Face detection and recognition for voter authentication
Secure voter registration system
One-person one-vote mechanism
Real-time webcam integration
Admin dashboard for managing voters and candidates
Vote counting and result generation
Database storage for voter information and voting records
Fraud prevention through biometric verification
User-friendly interface
# Technologies Used
FRONTEND - next.js 
LANGUAGE - Typescript 5/python
UI LIBRARY - shadcn/ui + Radix UI primitives
STYLING - Tailwind CSS v3 + tailwindcss-animate
AI/ML - Google Gemini 2.5 Flash + Genkit v1
DATABASE - Firebase Auth + Firestore
FACE AI - MediaDevices API + HTML Canvas
STATE - Zustand v5 + React Hook Form v7
# How It Works
# Voter Registration
New voters register by entering personal details and capturing facial images.
Facial data is stored securely in the database.
# Face Authentication
During voting, the webcam captures the voter’s face.
The system compares the live image with stored facial encodings.
# Vote Casting
If authentication is successful and the voter has not voted before, access to voting is granted.
The voter selects a candidate and submits the vote.
# Vote Storage
Votes are securely stored in the database.
Duplicate voting attempts are automatically blocked.
# Result Generation
Admin can view real-time vote counts and final election results.
# Advantages
Reduces election fraud
Eliminates duplicate voting
Faster and more secure voter verification
Minimizes manual errors
Enhances election transparency
Cost-effective digital voting approach
# Applications
College elections
Organizational voting systems
Small-scale government elections
Secure online polling systems
Digital identity verification systems
# Future Enhancements
Integration with Aadhaar or national ID systems
Cloud database deployment
Blockchain-based vote security
Multi-factor authentication
Mobile application support
Online remote voting capabilities
