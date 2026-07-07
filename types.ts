export type Designation = 'Operational Head' | 'Social Media Manager' | 'General Manager' | 'Teacher' | 'Admin' | 'Owner';

export interface User {
  id: string;
  name: string;
  designation: Designation;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in progress' | 'done' | 'flagged';
  assignedTo: string;
  teacherName?: string;
  date: string;
  notes?: string;
}

export interface Enquiry {
  id: string;
  studentName: string;
  parentName: string;
  contact: string;
  course: string;
  source: string;
  date: string;
  assignedTo: string;
  status: 'new' | 'demo_scheduled' | 'converted' | 'rejected';
}

export interface Demo {
  id: string;
  enquiryId: string;
  studentName: string;
  date: string;
  assignedTo: string;
  outcome: 'pending' | 'converted' | 'not interested' | 'follow-up' | 'rescheduled';
  feedback?: string;
}

export interface Batch {
  id: string;
  name: string;
  subject: string;
  schedule: string;
  teacherId: string;
  teacherName?: string;
}

export interface Student {
  id: string;
  name: string;
  parentName: string;
  contact: string;
  batchId: string;
  course?: string;
  feeStatus: 'paid' | 'pending' | 'overdue';
  feeAmount: number;
  feeDueDate: string;
}

export interface Attendance {
  id: string;
  batchId: string;
  date: string;
  presentStudentIds: string[];
  teacherId: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  targetRole?: string;
  targetTeacherId?: string;
  createdAt: any; // Firestore Timestamp
  readBy: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  imageUrl?: string;
  createdAt: any; // Firestore Timestamp
}
