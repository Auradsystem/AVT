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
import { Activity, Settings } from 'lucide-react';
import { ParkingLevel, CentralSystem } from './types';

function App() {
  const [projectInfo, setProjectInfo] = useState(initialProjectInfo);
  const [parkingLevels, setParkingLevels] = useState(initialParkingLevels);
  const [centralSystems, setCentralSystems] = useState(initialCentralSystems);
  const [nextSteps, setNextSteps] = useState(initialNextSteps);
  const [attentionPoints, setAttentionPoints] = useState(initialAttentionPoints);
  const [overallProgress, setOverallProgress] = useState(calculateOverallProgress());
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalSaveAction, setModalSaveAction] = useState<() => void>(() => {});

  // Recalculate overall progress when data changes
  useEffect(() => {
    setOverallProgress(calculateOverallProgress());
  }, [parkingLevels, centralSystems]);

  // Edit project info
  const handleEditProject = () => {
    setModalTitle('Modifier les informations du projet');
    setModalContent(
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom du projet
          </label>
          <input
            type="text"
            value={projectInfo.name}
            onChange={(e) => setProjectInfo({ ...projectInfo, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client
          </label>
          <input
            type="text"
            value={projectInfo.client}
            onChange={(e) => setProjectInfo({ ...projectInfo, client: e.target.value })}
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
              value={projectInfo.startDate}
              onChange={(e) => setProjectInfo({ ...projectInfo, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de fin
            </label>
            <input
              type="date"
              value={projectInfo.endDate}
              onChange={(e) => setProjectInfo({ ...projectInfo, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    );
    setModalSaveAction(() => () => {
      // Update last updated date
      setProjectInfo({
        ...projectInfo,
        lastUpdated: new Date().toISOString().split('T')[0]
      });
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
        systemTypes={systemTypes}
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

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Tableau de Bord SSI</h1>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <ProjectOverview 
            projectInfo={projectInfo} 
            overallProgress={overallProgress}
            onEdit={handleEditProject}
          />
          
          <div className="space-y-6">
            <CombinedLevelProgress 
              levels={parkingLevels} 
              systemTypes={systemTypes}
              onEditLevel={handleEditLevel}
            />
            
            <CentralSystemProgress 
              systems={centralSystems}
              onEdit={handleEditCentralSystem}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <NextSteps 
                steps={nextSteps}
                onEdit={handleEditNextStep}
                onAdd={handleAddNextStep}
              />
              
              <AttentionPoints 
                points={attentionPoints}
                onEdit={handleEditAttentionPoint}
                onAdd={handleAddAttentionPoint}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
