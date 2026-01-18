export type Priority = 'low' | 'medium' | 'high';
export type ChoreStatus = 'pending' | 'done';
export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'none';

export interface TeamMember {
  id: string;
  name: string;
  email?: string;
  avatarColor: string;
}

export interface RecurrencePattern {
  type: RecurrenceType;
  interval: number; // every N days/weeks/months
  startDate: string;
  endDate?: string;
  daysOfWeek?: number[]; // 0-6 for weekly recurrence
  dayOfMonth?: number; // 1-31 for monthly recurrence
}

export interface ChoreTemplate {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // team member id
  priority: Priority;
  estimatedTime?: number; // in minutes
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  createdAt: string;
}

export interface ChoreInstance {
  id: string;
  templateId?: string; // null if one-time chore
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: ChoreStatus;
  priority: Priority;
  estimatedTime?: number;
  completedAt?: string;
  completedBy?: string;
  createdAt: string;
}

export interface AppData {
  teamMembers: TeamMember[];
  choreTemplates: ChoreTemplate[];
  choreInstances: ChoreInstance[];
}
