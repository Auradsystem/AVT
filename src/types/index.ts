export interface ProjectInfo {
  name: string;
  client: string;
  startDate: string;
  endDate: string;
  lastUpdated: string;
}

export interface SystemType {
  id: string;
  name: string;
  weight: number; // Poids pour le calcul du pourcentage global
}

export interface LevelSystem {
  systemId: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'delayed' | 'completed' | 'testing';
  notes?: string;
}

export interface ParkingLevel {
  id: number;
  name: string;
  isCollector: boolean;
  systems: LevelSystem[];
  attentionPoints: string[];
  weight: number; // Poids pour le calcul du pourcentage global
}

export interface CentralSystem {
  id: string;
  name: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'delayed' | 'completed' | 'testing';
  notes?: string;
  weight: number; // Poids pour le calcul du pourcentage global
}

export interface NextStep {
  id: number;
  description: string;
  dueDate: string;
}

export interface AttentionPoint {
  id: number;
  description: string;
  details: string;
  severity: 'low' | 'medium' | 'high';
  date: string;
}
