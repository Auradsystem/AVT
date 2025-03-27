import { ProjectInfo, ParkingLevel, CentralSystem, NextStep, AttentionPoint, SystemType } from '../types';

export const projectInfo: ProjectInfo = {
  name: "Installation Système SSI - Parkings",
  client: "Nom du Client",
  company: "Nom de l'Entreprise",
  startDate: "2025-04-01",
  endDate: "2025-07-30",
  lastUpdated: "2025-03-23"
};

export const systemTypes: SystemType[] = [
  { id: "detection", name: "Détection incendie", weight: 0.25 },
  { id: "sirens", name: "Sirènes", weight: 0.15 },
  { id: "wiring", name: "Câblage", weight: 0.2 },
  { id: "modules", name: "Modules déportés", weight: 0.2 },
  { id: "pcf", name: "Asservissements PCF", weight: 0.2 }
];

export const parkingLevels: ParkingLevel[] = [
  {
    id: 1,
    name: "Niveau -1",
    isCollector: true,
    weight: 0.3,
    systems: [
      { systemId: "detection", progress: 0, status: "not-started" },
      { systemId: "sirens", progress: 0, status: "not-started" },
      { systemId: "wiring", progress: 0, status: "not-started" },
      { systemId: "modules", progress: 0, status: "not-started" },
      { systemId: "pcf", progress: 0, status: "not-started" }
    ],
    attentionPoints: []
  },
  {
    id: 2,
    name: "Niveau -2",
    isCollector: false,
    weight: 0.25,
    systems: [
      { systemId: "detection", progress: 0, status: "not-started" },
      { systemId: "sirens", progress: 0, status: "not-started" },
      { systemId: "wiring", progress: 0, status: "not-started" },
      { systemId: "modules", progress: 0, status: "not-started" },
      { systemId: "pcf", progress: 0, status: "not-started" }
    ],
    attentionPoints: []
  },
  {
    id: 3,
    name: "Niveau -3",
    isCollector: true,
    weight: 0.25,
    systems: [
      { systemId: "detection", progress: 0, status: "not-started" },
      { systemId: "sirens", progress: 0, status: "not-started" },
      { systemId: "wiring", progress: 0, status: "not-started" },
      { systemId: "modules", progress: 0, status: "not-started" },
      { systemId: "pcf", progress: 0, status: "not-started" }
    ],
    attentionPoints: []
  },
  {
    id: 4,
    name: "Niveau -4",
    isCollector: false,
    weight: 0.2,
    systems: [
      { systemId: "detection", progress: 0, status: "not-started" },
      { systemId: "sirens", progress: 0, status: "not-started" },
      { systemId: "wiring", progress: 0, status: "not-started" },
      { systemId: "modules", progress: 0, status: "not-started" },
      { systemId: "pcf", progress: 0, status: "not-started" }
    ],
    attentionPoints: []
  }
];

export const centralSystems: CentralSystem[] = [
  {
    id: "central",
    name: "Centrale SSI",
    progress: 0,
    status: "not-started",
    weight: 0.5
  },
  {
    id: "programming",
    name: "Programmation",
    progress: 0,
    status: "not-started",
    weight: 0.3
  },
  {
    id: "interface",
    name: "Interfaces externes",
    progress: 0,
    status: "not-started",
    weight: 0.2
  }
];

export const nextSteps: NextStep[] = [
  {
    id: 1,
    description: "Raccordement Collectrice -1",
    dueDate: "2025-04-05"
  },
  {
    id: 2,
    description: "Tests Détecteurs N-2",
    dueDate: "2025-04-12"
  },
  {
    id: 3,
    description: "Formation Exploitant",
    dueDate: "2025-04-25"
  }
];

export const attentionPoints: AttentionPoint[] = [
  {
    id: 1,
    description: "Retard approvisionnement câbles CR1",
    details: "Délai de livraison supplémentaire de 2 semaines annoncé par le fournisseur. Alternative en cours d'étude.",
    severity: "medium",
    date: "2025-03-18"
  },
  {
    id: 2,
    description: "Modification emplacement centrale",
    details: "Suite à la réunion du 20/03, modification de l'emplacement de la centrale au niveau -1. Plans mis à jour.",
    severity: "low",
    date: "2025-03-20"
  }
];

// Calculate level progress based on systems
export const calculateLevelProgress = (level: ParkingLevel, activeSystemTypes: SystemType[]): number => {
  if (level.systems.length === 0) return 0;
  
  let totalProgress = 0;
  let totalWeight = 0;
  
  level.systems.forEach(system => {
    const systemType = activeSystemTypes.find(type => type.id === system.systemId);
    if (systemType) {
      totalProgress += system.progress * systemType.weight;
      totalWeight += systemType.weight;
    }
  });
  
  return totalWeight > 0 ? Math.round(totalProgress / totalWeight) : 0;
};

// Calculate overall project progress
export const calculateOverallProgress = (
  levels: ParkingLevel[] = parkingLevels, 
  systems: CentralSystem[] = centralSystems,
  activeSystemTypes: SystemType[] = systemTypes
): number => {
  // Calculate levels contribution
  let levelsProgress = 0;
  let levelsTotalWeight = 0;
  
  levels.forEach(level => {
    levelsProgress += calculateLevelProgress(level, activeSystemTypes) * level.weight;
    levelsTotalWeight += level.weight;
  });
  
  const normalizedLevelsProgress = levelsTotalWeight > 0 ? levelsProgress / levelsTotalWeight : 0;
  
  // Calculate central systems contribution
  let centralProgress = 0;
  let centralTotalWeight = 0;
  
  systems.forEach(system => {
    centralProgress += system.progress * system.weight;
    centralTotalWeight += system.weight;
  });
  
  const normalizedCentralProgress = centralTotalWeight > 0 ? centralProgress / centralTotalWeight : 0;
  
  // Combine with 70% weight for levels and 30% for central systems
  const overallProgress = (normalizedLevelsProgress * 0.7) + (normalizedCentralProgress * 0.3);
  
  return Math.round(overallProgress);
};
