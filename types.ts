export type Role = 'admin' | 'user';

export type DonationStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface User {
  id: string;
  username: string;
  role: Role;
  name: string;
}

export interface Donation {
  id: string;
  amount: number;
  status: DonationStatus;
  timestamp: string;
}

export interface Registration {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  campaignName: string;
  timestamp: string;
  donation?: Donation; // Optional linkage, enforced via ID in a real DB, nested here for frontend ease
}

export interface Stats {
  totalRegistrations: number;
  totalDonations: number;
}
