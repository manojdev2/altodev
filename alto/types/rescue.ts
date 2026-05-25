export type IssueType =
  | 'battery_dead'
  | 'charging_failed'
  | 'motor_issue'
  | 'overheating'
  | 'accident'
  | 'flat_tyre'
  | 'other';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export type RescueStatus =
  | 'idle'
  | 'listening'
  | 'submitting'
  | 'dispatched'
  | 'en_route'
  | 'arrived'
  | 'resolved'
  | 'cancelled';

export type TechnicianType = 'technician' | 'towing' | 'charging_agent';

export interface TechnicianLocation {
  latitude: number;
  longitude: number;
}

export interface RescueData {
  rescueId: string;
  status: Exclude<RescueStatus, 'idle' | 'listening' | 'submitting'>;
  issueType: IssueType;
  severity: Severity;
  severityLabel: string;
  guidanceText: string;
  technicianName: string;
  technicianType: TechnicianType;
  technicianRating: number;
  etaMinutes: number;
  distanceKm: number;
  progress?: number;
  techLocation: TechnicianLocation;
  userLocation: TechnicianLocation;
}

export const ISSUE_LABELS: Record<IssueType, string> = {
  battery_dead: 'Battery Dead',
  charging_failed: 'Charging Failed',
  motor_issue: 'Motor Issue',
  overheating: 'Overheating',
  accident: 'Accident',
  flat_tyre: 'Flat Tyre',
  other: 'Other Issue',
};

export const ISSUE_ICONS: Record<IssueType, string> = {
  battery_dead: '🔋',
  charging_failed: '⚡',
  motor_issue: '⚙️',
  overheating: '🌡️',
  accident: '🚨',
  flat_tyre: '🛞',
  other: '🔧',
};

export const SEVERITY_COLORS: Record<Severity, string> = {
  low: '#22C55E',
  medium: '#F59E0B',
  high: '#EF4444',
  critical: '#7C3AED',
};

export const TECHNICIAN_TYPE_LABELS: Record<TechnicianType, string> = {
  technician: 'EV Technician',
  towing: 'Towing Partner',
  charging_agent: 'Charging Agent',
};
