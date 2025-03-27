import React, { useState, useEffect } from 'react';
import ProjectOverview from './components/ProjectOverview';
import CombinedLevelProgress from './components/CombinedLevelProgress';
import CentralSystemProgress from './components/CentralSystemProgress';
import NextSteps from './components/NextSteps';
import AttentionPoints from './components/AttentionPoints';
import EditModal from './components/EditModal';
import EditLevelForm from './components/EditLevelForm';
import EditCentralSystemForm from './components/EditCentralSystemForm';
import { 
  projectInfo as initialProjectInfo, 
  parkingLevels as initialParkingLevels, 
  systemTypes,
  centralSystems as initialCentralSystems,
  nextSteps as initialNextSteps, 
  attentionPoints as initialAttentionPoints,
  calculateOverallProgress
} from './data/mockData';
import { Activity, Settings, Printer } from 'lucide-react';
import { ParkingLevel, CentralSystem, SystemType, ProjectInfo } from './types';

function App() {
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>(initialProjectInfo);
  const [parkingLevels, setParkingLevels] = useState(initialParkingLevels);
  const [centralSystems, setCentralSystems] = useState(initialCentralSystems);
  const [nextSteps, setNextSteps] = useState(initialNextSteps);
  const [attentionPoints, setAttentionPoints] = useState(initialAttentionPoints);
  const [overallProgress, setOverallProgress] = useState(calculateOverallProgress());
  const [activeSystemTypes, setActiveSystemTypes] = useState<SystemType[]>(systemTypes);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalSaveAction, setModalSaveAction] = useState<() => void>(() => {});

  // Recalculate overall progress when data changes
  useEffect(() => {
    const newOverallProgress = calculateOverallProgress(parkingLevels, centralSystems, activeSystemTypes);
    setOverallProgress(newOverallProgress);
  }, [parkingLevels, centralSystems, activeSystemTypes]);

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Edit project info
  const handleEditProject = () => {
    // Créer une copie locale pour l'édition
    const editingProjectInfo = { ...projectInfo };
    
    setModalTitle('Modifier les informations du projet');
    setModalContent(
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom du projet
          </label>
          <input
            type="text"
            value={editingProjectInfo.name}
            onChange={(e) => {
              editingProjectInfo.name = e.target.value;
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client
          </label>
          <input
            type="text"
            value={editingProjectInfo.client}
            onChange={(e) => {
              editingProjectInfo.client = e.target.value;
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de début
            </label>
            <input
              type="date"
              value={editingProjectInfo.startDate}
              onChange={(e) => {
                editingProjectInfo.startDate = e.target.value;
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de fin
            </label>
            <input
              type="date"
              value={editingProjectInfo.endDate}
              onChange={(e) => {
                editingProjectInfo.endDate = e.target.value;
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    );
    setModalSaveAction(() => () => {
      // Update project info with the edited values and update last updated date
      setProjectInfo({
        ...editingProjectInfo,
        lastUpdated: new Date().toISOString().split('T')[0]
      });
      setIsModalOpen(false);
    });
    setIsModalOpen(true);
  };

  // Edit system types
  const handleEditSystemTypes = () => {
    setModalTitle('Gérer les types de systèmes');
    setModalContent(
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Ajoutez, modifiez ou supprimez les types de systèmes. La suppression d'un type affectera le calcul global.
        </p>
        {activeSystemTypes.map((type, index) => (
          <div key={type.id} className="flex items-center space-x-2 pb-3 border-b border-gray-200">
            <div className="flex-grow">
              <input
                type="text"
                value={type.name}
                onChange={(e) => {
                  const updated = [...activeSystemTypes];
                  updated[index] = { ...type, name: e.target.value };
                  setActiveSystemTypes(updated);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="w-24">
              <input
                type="number"
                min="1"
                max="100"
                value={type.weight * 100}
                onChange={(e) => {
                  const updated = [...activeSystemTypes];
                  updated[index] = { ...type, weight: parseInt(e.target.value) / 100 };
                  setActiveSystemTypes(updated);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => {
                const updated = activeSystemTypes.filter((_, i) => i !== index);
                setActiveSystemTypes(updated);
                
                // Also update all levels to remove this system type
                const updatedLevels = parkingLevels.map(level => ({
                  ...level,
                  systems: level.systems.filter(sys => sys.systemId !== type.id)
                }));
                setParkingLevels(updatedLevels);
              }}
              className="p-2 text-red-500 hover:text-red-700"
            >
              Supprimer
            </button>
          </div>
        ))}
        <button
          onClick={() => {
            const newId = `system-${Date.now()}`;
            setActiveSystemTypes([
              ...activeSystemTypes,
              { id: newId, name: 'Nouveau système', weight: 0.1 }
            ]);
            
            // Add this system to all levels with 0% progress
            const updatedLevels = parkingLevels.map(level => ({
              ...level,
              systems: [
                ...level.systems,
                { systemId: newId, progress: 0, status: 'not-started' as const }
              ]
            }));
            setParkingLevels(updatedLevels);
          }}
          className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
        >
          + Ajouter un type de système
        </button>
      </div>
    );
    setModalSaveAction(() => () => {
      // Normalize weights to ensure they sum to 1
      const totalWeight = activeSystemTypes.reduce((sum, type) => sum + type.weight, 0);
      if (totalWeight > 0) {
        const normalizedTypes = activeSystemTypes.map(type => ({
          ...type,
          weight: type.weight / totalWeight
        }));
        setActiveSystemTypes(normalizedTypes);
      }
      setIsModalOpen(false);
    });
    setIsModalOpen(true);
  };

  // Edit level
  const handleEditLevel = (levelId: number) => {
    const level = parkingLevels.find(level => level.id === levelId);
    if (!level) return;

    setModalTitle(`Modifier ${level.name}`);
    setModalContent(
      <EditLevelForm 
        level={level} 
        systemTypes={activeSystemTypes}
        onUpdate={(updatedLevel) => {
          setParkingLevels(parkingLevels.map(l => 
            l.id === levelId ? updatedLevel : l
          ));
          setIsModalOpen(false);
        }}
      />
    );
    setModalSaveAction(() => () => {
      // This is handled by the form's onUpdate
    });
    setIsModalOpen(true);
  };

  // Add new level
  const handleAddLevel = () => {
    setModalTitle('Ajouter un nouveau niveau');
    
    const newLevelId = parkingLevels.length > 0 
      ? Math.max(...parkingLevels.map(l => l.id)) + 1 
      : 1;
    
    const newLevel: ParkingLevel = {
      id: newLevelId,
      name: `Niveau -${newLevelId}`,
      isCollector: false,
      weight: 0.2,
      systems: activeSystemTypes.map(type => ({
        systemId: type.id,
        progress: 0,
        status: 'not-started'
      })),
      attentionPoints: []
    };

    setModalContent(
      <EditLevelForm 
        level={newLevel} 
        systemTypes={activeSystemTypes}
        onUpdate={(updatedLevel) => {
          setParkingLevels([...parkingLevels, updatedLevel]);
          setIsModalOpen(false);
        }}
      />
    );
    setModalSaveAction(() => () => {
      // This is handled by the form's onUpdate
    });
    setIsModalOpen(true);
  };

  // Delete level
  const handleDeleteLevel = (levelId: number) => {
    setModalTitle('Supprimer le niveau');
    setModalContent(
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Êtes-vous sûr de vouloir supprimer ce niveau ? Cette action est irréversible.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              const updatedLevels = parkingLevels.filter(level => level.id !== levelId);
              
              // Recalculate weights to ensure they sum to 1
              const totalWeight = updatedLevels.reduce((sum, level) => sum + level.weight, 0);
              if (totalWeight > 0) {
                const normalizedLevels = updatedLevels.map(level => ({
                  ...level,
                  weight: level.weight / totalWeight
                }));
                setParkingLevels(normalizedLevels);
              } else {
                setParkingLevels(updatedLevels);
              }
              
              setIsModalOpen(false);
            }}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Supprimer
          </button>
        </div>
      </div>
    );
    setModalSaveAction(() => () => {
      // This is handled by the buttons
    });
    setIsModalOpen(true);
  };

  // Edit central system
  const handleEditCentralSystem = (systemId: string) => {
    const system = centralSystems.find(system => system.id === systemId);
    if (!system) return;

    setModalTitle(`Modifier ${system.name}`);
    setModalContent(
      <EditCentralSystemForm 
        system={system}
        onUpdate={(updatedSystem) => {
          setCentralSystems(centralSystems.map(s => 
            s.id === systemId ? updatedSystem : s
          ));
          setIsModalOpen(false);
        }}
      />
    );
    setModalSaveAction(() => () => {
      // This is handled by the form's onUpdate
    });
    setIsModalOpen(true);
  };

  // Add central system
  const handleAddCentralSystem = () => {
    setModalTitle('Ajouter un système central');
    
    const newSystem: CentralSystem = {
      id: `central-${Date.now()}`,
      name: 'Nouveau système',
      progress: 0,
      status: 'not-started',
      weight: 0.2
    };

    setModalContent(
      <EditCentralSystemForm 
        system={newSystem}
        onUpdate={(updatedSystem) => {
          setCentralSystems([...centralSystems, updatedSystem]);
          setIsModalOpen(false);
        }}
      />
    );
    setModalSaveAction(() => () => {
      // This is handled by the form's onUpdate
    });
    setIsModalOpen(true);
  };

  // Delete central system
  const handleDeleteCentralSystem = (systemId: string) => {
    setModalTitle('Supprimer le système central');
    setModalContent(
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Êtes-vous sûr de vouloir supprimer ce système ? Cette action est irréversible.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              const updatedSystems = centralSystems.filter(system => system.id !== systemId);
              
              // Recalculate weights to ensure they sum to 1
              const totalWeight = updatedSystems.reduce((sum, system) => sum + system.weight, 0);
              if (totalWeight > 0) {
                const normalizedSystems = updatedSystems.map(system => ({
                  ...system,
                  weight: system.weight / totalWeight
                }));
                setCentralSystems(normalizedSystems);
              } else {
                setCentralSystems(updatedSystems);
              }
              
              setIsModalOpen(false);
            }}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Supprimer
          </button>
        </div>
      </div>
    );
    setModalSaveAction(() => () => {
      // This is handled by the buttons
    });
    setIsModalOpen(true);
  };

  // Edit next step
  const handleEditNextStep = (stepId: number) => {
    const step = nextSteps.find(step => step.id === stepId);
    if (!step) return;

    setModalTitle('Modifier l\'étape');
    setModalContent(
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            value={step.description}
            onChange={(e) => {
              setNextSteps(nextSteps.map(s => 
                s.id === stepId ? { ...s, description: e.target.value } : s
              ));
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date d'échéance
          </label>
          <input
            type="date"
            value={step.dueDate}
            onChange={(e) => {
              setNextSteps(nextSteps.map(s => 
                s.id === stepId ? { ...s, dueDate: e.target.value } : s
              ));
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    );
    setModalSaveAction(() => () => {
      setIsModalOpen(false);
    });
    setIsModalOpen(true);
  };

  // Add next step
  const handleAddNextStep = () => {
    setModalTitle('Ajouter une étape');
    const newStep = {
      id: nextSteps.length > 0 ? Math.max(...nextSteps.map(s => s.id)) + 1 : 1,
      description: '',
      dueDate: new Date().toISOString().split('T')[0]
    };

    setModalContent(
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            value={newStep.description}
            onChange={(e) => {
              newStep.description = e.target.value;
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date d'échéance
          </label>
          <input
            type="date"
            value={newStep.dueDate}
            onChange={(e) => {
              newStep.dueDate = e.target.value;
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    );
    setModalSaveAction(() => () => {
      if (newStep.description.trim()) {
        setNextSteps([...nextSteps, newStep]);
      }
      setIsModalOpen(false);
    });
    setIsModalOpen(true);
  };

  // Delete next step
  const handleDeleteNextStep = (stepId: number) => {
    setNextSteps(nextSteps.filter(step => step.id !== stepId));
  };

  // Edit attention point
  const handleEditAttentionPoint = (pointId: number) => {
    const point = attentionPoints.find(point => point.id === pointId);
    if (!point) return;

    setModalTitle('Modifier le point d\'attention');
    setModalContent(
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            value={point.description}
            onChange={(e) => {
              setAttentionPoints(attentionPoints.map(p => 
                p.id === pointId ? { ...p, description: e.target.value } : p
              ));
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Détails
          </label>
          <textarea
            value={point.details}
            onChange={(e) => {
              setAttentionPoints(attentionPoints.map(p => 
                p.id === pointId ? { ...p, details: e.target.value } : p
              ));
            }}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sévérité
          </label>
          <select
            value={point.severity}
            onChange={(e) => {
              setAttentionPoints(attentionPoints.map(p => 
                p.id === pointId ? { ...p, severity: e.target.value as any } : p
              ));
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="low">Faible</option>
            <option value="medium">Moyenne</option>
            <option value="high">Élevée</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={point.date}
            onChange={(e) => {
              setAttentionPoints(attentionPoints.map(p => 
                p.id === pointId ? { ...p, date: e.target.value } : p
              ));
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    );
    setModalSaveAction(() => () => {
      setIsModalOpen(false);
    });
    setIsModalOpen(true);
  };

  // Add attention point
  const handleAddAttentionPoint = () => {
    setModalTitle('Ajouter un point d\'attention');
    const newPoint = {
      id: attentionPoints.length > 0 ? Math.max(...attentionPoints.map(p => p.id)) + 1 : 1,
      description: '',
      details: '',
      severity: 'medium' as const,
      date: new Date().toISOString().split('T')[0]
    };

    setModalContent(
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            value={newPoint.description}
            onChange={(e) => {
              newPoint.description = e.target.value;
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Détails
          </label>
          <textarea
            value={newPoint.details}
            onChange={(e) => {
              newPoint.details = e.target.value;
            }}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sévérité
          </label>
          <select
            value={newPoint.severity}
            onChange={(e) => {
              newPoint.severity = e.target.value as any;
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="low">Faible</option>
            <option value="medium">Moyenne</option>
            <option value="high">Élevée</option>
          </select>
        </div>
      </div>
    );
    setModalSaveAction(() => () => {
      if (newPoint.description.trim()) {
        setAttentionPoints([...attentionPoints, newPoint]);
      }
      setIsModalOpen(false);
    });
    setIsModalOpen(true);
  };

  // Delete attention point
  const handleDeleteAttentionPoint = (pointId: number) => {
    setAttentionPoints(attentionPoints.filter(point => point.id !== pointId));
  };

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      <header className="bg-white shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Tableau de Bord SSI</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handlePrint}
                className="p-2 rounded-full hover:bg-gray-100"
                title="Imprimer"
              >
                <Printer className="h-5 w-5 text-gray-600" />
              </button>
              <button 
                onClick={handleEditSystemTypes}
                className="p-2 rounded-full hover:bg-gray-100"
                title="Paramètres"
              >
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 print:py-2 print:px-0">
        <div className="space-y-4 print:space-y-2">
          <ProjectOverview 
            projectInfo={projectInfo} 
            overallProgress={overallProgress}
            onEdit={handleEditProject}
          />
          
          <div className="space-y-4 print:space-y-2">
            <CombinedLevelProgress 
              levels={parkingLevels} 
              systemTypes={activeSystemTypes}
              onEditLevel={handleEditLevel}
              onDeleteLevel={handleDeleteLevel}
              onAddLevel={handleAddLevel}
            />
            
            <CentralSystemProgress 
              systems={centralSystems}
              onEdit={handleEditCentralSystem}
              onDelete={handleDeleteCentralSystem}
              onAdd={handleAddCentralSystem}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 print:gap-2">
              <NextSteps 
                steps={nextSteps}
                onEdit={handleEditNextStep}
                onAdd={handleAddNextStep}
                onDelete={handleDeleteNextStep}
              />
              
              <AttentionPoints 
                points={attentionPoints}
                onEdit={handleEditAttentionPoint}
                onAdd={handleAddAttentionPoint}
                onDelete={handleDeleteAttentionPoint}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-8 print:mt-2 print:border-t-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 print:py-1">
          <p className="text-sm text-gray-500 text-center">
            Dashboard de suivi d'avancement de projet © {new Date().getFullYear()}
          </p>
        </div>
      </footer>

      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        onSave={modalSaveAction}
      >
        {modalContent}
      </EditModal>
    </div>
  );
}

export default App;
