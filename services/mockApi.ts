import { User, Registration, DonationStatus, Registration as RegistrationType } from '../types';

// Mock Data Storage Keys
const USERS_KEY = 'nss_users';
const REGS_KEY = 'nss_registrations';
const CURRENT_USER_KEY = 'nss_current_user';

// Helper to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Seed Admin if not exists
const initialize = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    const admin: User = { id: 'admin-1', username: 'admin', role: 'admin', name: 'System Admin' };
    const demoUser: User = { id: 'user-1', username: 'user', role: 'user', name: 'Demo Volunteer' };
    localStorage.setItem(USERS_KEY, JSON.stringify([admin, demoUser]));
  }
  if (!localStorage.getItem(REGS_KEY)) {
    localStorage.setItem(REGS_KEY, JSON.stringify([]));
  }
};

initialize();

export const authService = {
  login: async (username: string): Promise<User | null> => {
    await delay(500);
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: User) => u.username === username);
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }
};

export const dataService = {
  // Save registration independently of donation (Critical Requirement)
  createRegistration: async (userId: string, data: { fullName: string; phone: string; campaignName: string }) => {
    await delay(400);
    const regs = JSON.parse(localStorage.getItem(REGS_KEY) || '[]');
    
    const newReg: RegistrationType = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      fullName: data.fullName,
      phone: data.phone,
      campaignName: data.campaignName,
      timestamp: new Date().toISOString(),
      donation: {
        id: Math.random().toString(36).substr(2, 9),
        amount: 0,
        status: 'PENDING',
        timestamp: new Date().toISOString()
      }
    };

    regs.push(newReg);
    localStorage.setItem(REGS_KEY, JSON.stringify(regs));
    return newReg;
  },

  getRegistrationById: async (id: string): Promise<RegistrationType | undefined> => {
    const regs = JSON.parse(localStorage.getItem(REGS_KEY) || '[]');
    return regs.find((r: RegistrationType) => r.id === id);
  },

  // Update donation status
  processDonation: async (regId: string, amount: number, status: DonationStatus) => {
    await delay(600);
    const regs = JSON.parse(localStorage.getItem(REGS_KEY) || '[]');
    const regIndex = regs.findIndex((r: RegistrationType) => r.id === regId);
    
    if (regIndex !== -1) {
      regs[regIndex].donation = {
        ...regs[regIndex].donation,
        amount,
        status,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(REGS_KEY, JSON.stringify(regs));
      return true;
    }
    return false;
  },

  // For User Dashboard
  getUserRegistrations: async (userId: string): Promise<RegistrationType[]> => {
    await delay(300);
    const regs = JSON.parse(localStorage.getItem(REGS_KEY) || '[]');
    return regs.filter((r: RegistrationType) => r.userId === userId).reverse();
  },

  // For Admin Dashboard
  getAllRegistrations: async (): Promise<RegistrationType[]> => {
    await delay(300);
    const regs = JSON.parse(localStorage.getItem(REGS_KEY) || '[]');
    return regs.reverse();
  }
};
