
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  mobile: string;
  aadhaar: string;
  photo?: string; // Storing the data URI for admin display
  faceEncoding?: string; // AI-generated textual description of facial features
  isVerified: boolean;
  hasVoted: boolean;
  votedFor?: string; // The party ID they voted for
  votedAt?: string;
}

export interface Vote {
  id: string;
  userId: string;
  aadhaar: string;
  party: string;
  timestamp: string;
}

interface VotingStore {
  users: User[];
  votes: Vote[];
  addUser: (user: Omit<User, 'id' | 'isVerified' | 'hasVoted'>) => void;
  updateUserBiometrics: (aadhaar: string, photo: string, encoding: string) => void;
  markAsVoted: (aadhaar: string, party: string) => void;
  getUserByAadhaar: (aadhaar: string) => User | undefined;
  getUserById: (id: string) => User | undefined;
}

export const useVotingStore = create<VotingStore>()(
  persist(
    (set, get) => ({
      users: [],
      votes: [],
      addUser: (userData) => {
        const newUser: User = {
          ...userData,
          id: Math.random().toString(36).substring(7),
          isVerified: true,
          hasVoted: false,
        };
        set((state) => ({ users: [...state.users, newUser] }));
      },
      updateUserBiometrics: (aadhaar, photo, encoding) => {
        set((state) => ({
          users: state.users.map((u) =>
            u.aadhaar === aadhaar ? { ...u, photo, faceEncoding: encoding } : u
          ),
        }));
      },
      markAsVoted: (aadhaar, party) => {
        const timestamp = new Date().toISOString();
        set((state) => {
          const user = state.users.find(u => u.aadhaar === aadhaar);
          if (!user) return state;

          const newVote: Vote = {
            id: Math.random().toString(36).substring(7),
            userId: user.id,
            aadhaar: user.aadhaar,
            party,
            timestamp,
          };

          return {
            users: state.users.map((u) =>
              u.aadhaar === aadhaar ? { ...u, hasVoted: true, votedFor: party, votedAt: timestamp } : u
            ),
            votes: [...state.votes, newVote]
          };
        });
      },
      getUserByAadhaar: (aadhaar) => {
        return get().users.find((u) => u.aadhaar === aadhaar);
      },
      getUserById: (id) => {
        return get().users.find((u) => u.id === id);
      },
    }),
    {
      name: 'smart-vote-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
