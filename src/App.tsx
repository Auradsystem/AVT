import React, { useState, useEffect } from 'react';
import ProjectOverview from './components/ProjectOverview';
import CombinedLevelProgress from './components/CombinedLevelProgress';
import CentralSystemProgress from './components/CentralSystemProgress';
import NextSteps from './components/NextSteps';
import AttentionPoints from './components/AttentionPoints';
import EditModal from './components/EditModal';
import EditLevelForm from './components/EditLevelForm';
import EditCentralSystemForm from './components/EditCentralSystemForm';
import AddStepForm from './components/forms/AddStepForm';
import EditStepForm from './components/forms/EditStepForm';
import AddAttentionPointForm from './components/forms/AddAttentionPointForm';
import EditAttentionPointForm from './components/forms/EditAttentionPointForm';

import { 
  projectInfo as initialProjectInfo, 
  parkingLevels as initialParkingLevels, 
  systemTypes as initialSystemTypes,
  centralSystems as initialCentralSystems,
  nextSteps as initialNextSteps, 
  attentionPoints as initialAttentionPoints,
  calculateOverallProgress
} from './data/mockData';
import { Activity, Settings, Printer, RefreshCw } from 'lucide-react';
import { ParkingLevel, CentralSystem, SystemType, ProjectInfo, NextStep, AttentionPoint } from './types';
import { saveData, loadData } from './utils/storage';

function App() {
  // État initial
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>(initialProjectInfo);
  const [parkingLevels, setParkingLevels] = useState(initialParkingLevels);
  const [centralSystems, setCentralSystems] = useState(initialCentralSystems);
  const [nextSteps, setNextSteps] = useState(initialNextSteps);
  const [attentionPoints, setAttentionPoints] = useState(initialAttentionPoints);
  const [activeSystemTypes, setActiveSystemTypes] = useState<SystemType[]>(initialSystemTypes);
  const [overallProgress, setOverallProgress] = useState(0);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalSaveAction, setModalSaveAction] = useState<() => void>(() => {});

  // États pour l'édition
  const [editingSystemTypes, setEditingSystemTypes] = useState<SystemType[]>([]);

  // Charger les données depuis le localStorage au démarrage
  useEffect(() => {
    const savedData = loadData();
    if (savedData) {
      setProjectInfo(savedData.projectInfo);
      setParkingLevels(savedData.parkingLevels);
      setCentralSystems(savedData.centralSystems);
      setNextSteps(savedData.nextSteps);
      setAttentionPoints(savedData.attentionPoints);
      setActiveSystemTypes(savedData.systemTypes);
    }
  }, []);

  // Recalculate overall progress when data changes
  useEffect(() => {
    const newOverallProgress = calculateOverallProgress(parkingLevels, centralSystems, activeSystemTypes);
    setOverallProgress(newOverallProgress);
  }, [parkingLevels, centralSystems, activeSystemTypes]);

  // Sauvegarder les données quand elles changent
  useEffect(() => {
    saveData({
      projectInfo,
      parkingLevels,
      centralSystems,
      nextSteps,
      attentionPoints,
      systemTypes: activeSystemTypes
    });
  }, [projectInfo, parkingLevels, centralSystems, nextSteps, attentionPoints, activeSystemTypes]);

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Réinitialiser les données
  const handleReset = () => {
    setModalTitle('Réinitialiser les données');
    setModalContent(
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action est irréversible.
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
              setProjectInfo(initialProjectInfo);
              setParkingLevels(initialParkingLevels);
              setCentralSystems(initialCentralSystems);
              setNextSteps(initialNextSteps);
              setAttentionPoints(initialAttentionPoints);
              setActiveSystemTypes(initialSystemTypes);
              setIsModalOpen(false);
            }}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    );
    setModalSaveAction(() => () => {
      // This is handled by the buttons
    });
    setIsModalOpen(true);
  };

  // Edit system types
  const handleEditSystemTypes = () => {
    setEditingSystemTypes([...activeSystemTypes]);
    setModalTitle('Gérer les types de systèmes');
    setModalContent(
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Ajoutez, modifiez ou supprimez les types de systèmes. La suppression d'un type affectera le calcul global.
        </p>
        {editingSystemTypes.map((type, index) => (
          <div key={type.id} className="flex items-center space-x-2 pb-3 border-b border-gray-200">
            <div className="flex-grow">
              <input
                type="text"
                value={type.name}
                onChange={(e) => {
                  const updated = [...editingSystemTypes];
                  updated[index] = { ...type, name: e.target.value };
                  setEditingSystemTypes(updated);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="w-24">
              <input
                type="number"
                min="1"
                max="100"
                value={Math.round(type.weight * 100)}
                onChange={(e) => {
                  const updated = [...editingSystemTypes];
                  updated[index] = { ...type, weight: parseInt(e.target.value) / 100 };
                  setEditingSystemTypes(updated);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => {
                const updated = editingSystemTypes.filter((_, i) => i !== index);
                setEditingSystemTypes(updated);
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
            setEditingSystemTypes([
              ...editingSystemTypes,
              { id: newId, name: 'Nouveau système', weight: 0.1 }
            ]);
          }}
          className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
        >
          + Ajouter un type de système
        </button>
      </div>
    );
    setModalSaveAction(() => () => {
      // Normalize weights to ensure they sum to 1
      const totalWeight = editingSystemTypes.reduce((sum, type) => sum + type.weight, 0);
      if (totalWeight > 0) {
        const normalizedTypes = editingSystemTypes.map(type => ({
          ...type,
          weight: type.weight / totalWeight
        }));
        setActiveSystemTypes(normalizedTypes);
        
        // Update all levels to add/remove system types
        const updatedLevels = parkingLevels.map(level => {
          // Keep existing systems that are still in the types list
          const existingSystems = level.systems.filter(sys => 
            normalizedTypes.some(type => type.id === sys.systemId)
          );
          
          // Add new systems that aren't already in this level
          const newSystems = normalizedTypes
            .filter(type => !existingSystems.some(sys => sys.systemId === type.id))
            .map(type => ({
              systemId: type.id,
              progress: 0,
              status: 'not-started' as const
            }));
          
          return {
            ...level,
            systems: [...existingSystems, ...newSystems]
          };
        });
        
        setParkingLevels(updatedLevels);
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
      <EditStepForm
        step={step}
        onSubmit={(updatedStep) => {
          setNextSteps(nextSteps.map(s => 
            s.id === stepId ? updatedStep : s
          ));
          setIsModalOpen(false);
        }}
        onCancel={() => setIsModalOpen(false)}
      />
    );
    setIsModalOpen(true);
  };

  // Add next step
  const handleAddNextStep = () => {
    setModalTitle('Ajouter une étape');
    setModalContent(
      <AddStepForm
        onSubmit={(stepData) => {
          const newId = nextSteps.length > 0 ? Math.max(...nextSteps.map(s => s.id)) + 1 : 1;
          setNextSteps([...nextSteps, {
            id: newId,
            ...stepData
          }]);
          setIsModalOpen(false);
        }}
        onCancel={() => setIsModalOpen(false)}
      />
    );
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
      <EditAttentionPointForm
        point={point}
        onSubmit={(updatedPoint) => {
          setAttentionPoints(attentionPoints.map(p => 
            p.id === pointId ? updatedPoint : p
          ));
          setIsModalOpen(false);
        }}
        onCancel={() => setIsModalOpen(false)}
      />
    );
    setIsModalOpen(true);
  };

  // Add attention point
  const handleAddAttentionPoint = () => {
    setModalTitle('Ajouter un point d\'attention');
    setModalContent(
      <AddAttentionPointForm
        onSubmit={(pointData) => {
          const newId = attentionPoints.length > 0 ? Math.max(...attentionPoints.map(p => p.id)) + 1 : 1;
          setAttentionPoints([...attentionPoints, {
            id: newId,
            date: new Date().toISOString().split('T')[0],
            ...pointData
          }]);
          setIsModalOpen(false);
        }}
        onCancel={() => setIsModalOpen(false)}
      />
    );
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
                onClick={handleReset}
                className="p-2 rounded-full hover:bg-gray-100"
                title="Réinitialiser"
              >
                <RefreshCw className="h-5 w-5 text-gray-600" />
              </button>
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
            onUpdate={setProjectInfo}
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
