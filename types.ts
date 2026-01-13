
export type Page = 'home' | 'meds' | 'track' | 'alarm' | 'edu' | 'settings' | 'ai-chat' | 'profile';

export interface PatientInfo {
  name: string;
  birthDate: string;
  medicalId: string;
  address: string;
  phone: string;
  profilePic?: string; // Base64 string of the profile picture
}

export interface Medication {
  id: string;
  name: string;
  frequency: string;
  times: string[]; // e.g., ["08:00", "20:00"]
  duration: number; // in days
  startDate: string;
  notes?: string;
  alarmSound: 'male' | 'female' | 'device';
}

export interface AdherenceLog {
  date: string;
  medId: string;
  timeSlot: string;
  taken: boolean;
  notifiedAt?: number; // timestamp to prevent duplicate alarms
}

export interface EducationContent {
  id: string;
  title: string;
  icon: string;
  content: string;
  image?: string;
}

export interface VideoContent {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  duration: string;
}
