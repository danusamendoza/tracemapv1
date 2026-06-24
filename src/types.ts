export type IncidentCategory = 'retraso' | 'congestion' | 'seguridad' | 'accidente' | 'obras';

export interface PermissionsConfig {
  geolocation: boolean;
  liveNotifications: boolean;
  criticalNotifications: boolean;
}

export interface Comment {
  id: string;
  user: string;
  avatarUrl?: string;
  timeAgo: string;
  text: string;
  verified?: boolean;
  level?: string;
}

export interface Incident {
  id: string;
  category: IncidentCategory;
  title: string;
  line: string;
  location: string;
  timeAgo: string;
  timestamp: Date;
  status: 'critical' | 'warning' | 'info' | 'secondary';
  verified: boolean;
  votes: number;
  voted: 'up' | 'down' | null;
  comments: Comment[];
  description: string;
  lat: number; // WGS84 latitude (decimal degrees)
  lng: number; // WGS84 longitude (decimal degrees)
  imageUrl?: string;
}
