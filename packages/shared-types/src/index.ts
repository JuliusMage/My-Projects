export type UserRole = 'AGENT' | 'ADMIN' | 'SUPERVISOR';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedTo?: string; // User ID
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  ticketId: string;
  senderId: string; // User ID or 'CUSTOMER'
  content: string;
  timestamp: Date;
  isPrivateNote?: boolean; // For internal agent notes
}

// More types will be added here
console.log('shared-types loaded');
