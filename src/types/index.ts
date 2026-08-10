export type Role = 'ADMIN' | 'MANAGER' | 'ANALYST' | 'FIELD_STAFF';
export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: Role;
  phone?: string;
  status: UserStatus;
  createdAt?: string;
  updatedAt?: string;
}

export type ResidentStatus = 'ACTIVE' | 'INACTIVE' | 'DISCHARGED';
export type Gender = 'Male' | 'Female' | 'Other';

export interface Resident {
  _id: string;
  residentId: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  age: number;
  dateOfBirth?: string;
  phone?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  address?: string;
  bloodGroup?: string;
  medicalConditions?: string[];
  allergies?: string[];
  roomNumber?: string;
  admissionDate?: string;
  status: ResidentStatus;
  createdBy?: User | string;
  createdAt?: string;
  updatedAt?: string;
}

export type CarePlanStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD';
export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface CarePlan {
  _id: string;
  resident: Resident | string;
  title: string;
  description: string;
  goals?: string[];
  interventions?: string[];
  startDate: string;
  endDate?: string;
  reviewDate?: string;
  status: CarePlanStatus;
  priority: PriorityLevel;
  assignedCaregiver?: User | string;
  createdBy?: User | string;
  createdAt?: string;
  updatedAt?: string;
}

export type MedicationRoute =
  | 'ORAL'
  | 'TOPICAL'
  | 'INJECTION'
  | 'INHALATION'
  | 'OPHTHALMIC'
  | 'OTIC'
  | 'NASAL'
  | 'OTHER';

export type MedicationStatus = 'ACTIVE' | 'COMPLETED' | 'DISCONTINUED' | 'ON_HOLD';

export interface Medication {
  _id: string;
  resident: Resident | string;
  medicationName: string;
  dosage: string;
  frequency: string;
  route: MedicationRoute;
  instructions?: string;
  schedule?: string[];
  startDate: string;
  endDate?: string;
  prescribedBy?: User | string;
  status: MedicationStatus;
  notes?: string;
  createdBy?: User | string;
  createdAt?: string;
  updatedAt?: string;
}

export type ActivityType =
  | 'EXERCISE'
  | 'SOCIAL'
  | 'RECREATIONAL'
  | 'THERAPY'
  | 'MEAL'
  | 'MEDICAL'
  | 'PERSONAL_CARE'
  | 'OTHER';

export type ActivityStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Activity {
  _id: string;
  resident: Resident | string;
  activityName: string;
  description?: string;
  activityType: ActivityType;
  scheduledDate: string;
  duration?: number;
  assignedCaregiver?: User | string;
  status: ActivityStatus;
  notes?: string;
  createdBy?: User | string;
  createdAt?: string;
  updatedAt?: string;
}

export type TaskType =
  | 'MEDICATION'
  | 'CARE'
  | 'MEAL'
  | 'ACTIVITY'
  | 'HYGIENE'
  | 'MONITORING'
  | 'OTHER';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Task {
  _id: string;
  resident: Resident | string;
  title: string;
  description?: string;
  taskType: TaskType;
  assignedTo?: User | string;
  priority: TaskPriority;
  dueDate: string;
  status: TaskStatus;
  completedAt?: string;
  notes?: string;
  createdBy?: User | string;
  createdAt?: string;
  updatedAt?: string;
}

export type IncidentType =
  | 'FALL'
  | 'MEDICATION_ERROR'
  | 'INJURY'
  | 'BEHAVIORAL'
  | 'MEDICAL'
  | 'MISSING_PERSON'
  | 'OTHER';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';

export interface Incident {
  _id: string;
  resident: Resident | string;
  incidentType: IncidentType;
  title: string;
  description: string;
  incidentDate: string;
  severity: IncidentSeverity;
  location?: string;
  reportedBy: User | string;
  assignedTo?: User | string;
  status: IncidentStatus;
  actionTaken?: string;
  notes?: string;
  resolvedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ShiftType = 'MORNING' | 'AFTERNOON' | 'NIGHT' | 'CUSTOM';
export type ShiftStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Shift {
  _id: string;
  caregiver: User | string;
  shiftDate: string;
  shiftType: ShiftType;
  startTime: string;
  endTime: string;
  assignedResidents?: (Resident | string)[];
  status: ShiftStatus;
  notes?: string;
  createdBy?: User | string;
  createdAt?: string;
  updatedAt?: string;
}

export type AlertType =
  | 'FALL_RISK'
  | 'MEDICATION'
  | 'HEALTH'
  | 'MISSED_TASK'
  | 'INCIDENT'
  | 'EMERGENCY'
  | 'OTHER';

export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED' | 'DISMISSED';

export interface Alert {
  _id: string;
  resident: Resident | string;
  alertType: AlertType;
  title: string;
  message: string;
  severity: AlertSeverity;
  status: AlertStatus;
  source?: 'SYSTEM' | 'USER' | 'AI' | 'PREDICTION';
  assignedTo?: User | string;
  acknowledgedBy?: User | string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  metadata?: any;
  createdBy?: User | string;
  createdAt?: string;
  updatedAt?: string;
}

export type NotificationType =
  | 'ALERT'
  | 'TASK'
  | 'MEDICATION'
  | 'INCIDENT'
  | 'SHIFT'
  | 'SYSTEM'
  | 'OTHER';

export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface NotificationItem {
  _id: string;
  recipient: User | string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  readAt?: string;
  relatedId?: string;
  relatedModel?: string;
  createdBy?: User | string;
  createdAt?: string;
  updatedAt?: string;
}

export type PredictionType =
  | 'FALL_RISK'
  | 'HEALTH_RISK'
  | 'MEDICATION_RISK'
  | 'HOSPITALIZATION'
  | 'OTHER';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type PredictionStatus = 'ACTIVE' | 'REVIEWED' | 'DISMISSED';

export interface Prediction {
  _id: string;
  resident: Resident | string;
  predictionType: PredictionType;
  riskLevel: RiskLevel;
  probability?: number;
  score?: number;
  explanation?: string;
  recommendations?: string[];
  inputData?: any;
  modelVersion?: string;
  status: PredictionStatus;
  reviewedBy?: User | string;
  reviewedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type AICategory = 'GENERAL' | 'HEALTH' | 'CARE_PLAN' | 'MEDICATION' | 'INCIDENT' | 'RISK';

export interface AIReview {
  _id: string;
  resident: Resident | string;
  input: string;
  response: string;
  category: AICategory;
  model?: string;
  createdBy: User | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuditLog {
  _id: string;
  user: User | string;
  action: string;
  module: string;
  description?: string;
  resourceId?: string;
  resourceType?: string;
  method?: string;
  endpoint?: string;
  ipAddress?: string;
  metadata?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  residents: number;
  users: number;
  tasks: number;
  activeAlerts: number;
  incidents: number;
  activeMedications: number;
}

export interface SummaryReport {
  generatedAt: string;
  totalResidents: number;
  totalTasks: number;
  totalIncidents: number;
  activeMedications: number;
  activeAlerts: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  token?: string;
  user?: User;
}
