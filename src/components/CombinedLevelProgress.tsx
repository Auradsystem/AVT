import React, { useState } from 'react';
import { ParkingLevel, SystemType } from '../types';
import ProgressBar from './ProgressBar';
import { AlertTriangle, CheckCircle, Edit2, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { calculateLevelProgress } from '../data/mockData';

interface CombinedLevelProgressProps {
  levels: ParkingLevel[];
  systemTypes: SystemType[];
  onEditLevel: (levelId: number) => void;
  onDeleteLevel: (levelId: number) => void;
  onAddLevel: () => void;
}

const CombinedLevelProgress: React.FC<CombinedLevelProgressProps> = ({ 
  levels, 
  systemTypes,
  onEditLevel,
  onDeleteLevel,
  onAddLevel
}) => {
  // Utiliser un objet pour suivre l'état d'expansion de chaque niveau
  const [expandedLevels, setExpandedLevels] = useState<Record<number, boolean>>({});

  const toggleExpand = (levelId: number) => {
    setExpandedLevels(prev => ({
      ...prev,
      [levelId]: !prev[levelId]
    }));
  };

  // Fonction pour développer tous les niveaux
  const expandAll = () => {
    const allExpanded: Record<number, boolean> = {};
    levels.forEach(level => {
      allExpanded[level.id] = true;
    });
    setExpandedLevels(allExpanded);
  };

  // Fonction pour réduire tous les niveaux
  const collapseAll = () => {
    setExpandedLevels({});
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 print:shadow-none print:p-2 print:border print:border-gray-200">
      <div className="flex justify-between items-center mb-3 print:mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Avancement par niveau</h2>
        <div className="flex items-center space-x-2">
          <button 
            onClick={expandAll}
            className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 print:hidden"
          >
            Tout développer
          </button>
          <button 
            onClick={collapseAll}
            className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 print:hidden"
          >
            Tout réduire
          </button>
          <button 
            onClick={onAddLevel}
            className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 print:hidden"
            title="Ajouter un niveau"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 print:bg-transparent">
            <tr>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Zone
              </th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Collectrice
              </th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avancement
              </th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Points d'attention
              </th>
              <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider print:hidden">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {levels.map((level) => {
              const levelProgress = calculateLevelProgress(level, systemTypes);
              const isExpanded = expandedLevels[level.id] || false;
              
              return (
                <React.Fragment key={level.id}>
                  <tr 
                    className={`hover:bg-gray-50 ${isExpanded ? 'bg-blue-50 print:bg-blue-50' : ''}`}
                  >
                    <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900">
                      <button 
                        className="flex items-center focus:outline-none"
                        onClick={() => toggleExpand(level.id)}
                      >
                        {isExpanded ? (
                          <ChevronUp size={16} className="mr-1 text-blue-500" />
                        ) : (
                          <ChevronDown size={16} className="mr-1 text-gray-500" />
                        )}
                        {level.name}
                      </button>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${level.isCollector ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {level.isCollector ? 'Oui' : 'Non'}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap w-64">
                      <div className="flex items-center">
                        <ProgressBar progress={levelProgress} showLabel={false} />
                        <span className="ml-2 text-sm font-medium">{levelProgress}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {level.attentionPoints.length > 0 ? (
                        <div className="flex items-center text-amber-500">
                          <AlertTriangle size={14} className="mr-1" />
                          <span className="text-sm">{level.attentionPoints.length} point(s)</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-green-500">
                          <CheckCircle size={14} className="mr-1" />
                          <span className="text-sm">Aucun</span>
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium print:hidden">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => onEditLevel(level.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Modifier"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => onDeleteLevel(level.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {isExpanded && (
                    <tr className="bg-gray-50 print:bg-gray-50">
                      <td colSpan={5} className="px-3 py-2">
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-700 text-sm">Détail des systèmes</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                            {level.systems.map((system) => {
                              const systemType = systemTypes.find(type => type.id === system.systemId);
                              if (!systemType) return null;
                              return (
                                <div key={system.systemId} className="bg-white p-2 rounded border border-gray-200">
                                  <div className="flex justify-between items-center mb-1">
                                    <h5 className="font-medium text-gray-800 text-xs">{systemType.name}</h5>
                                    <span className="font-semibold text-xs">{system.progress}%</span>
                                  </div>
                                  <ProgressBar 
                                    progress={system.progress} 
                                    status={system.status}
                                    showLabel={false}
                                    height="h-2"
                                  />
                                </div>
                              );
                            })}
                          </div>
                          
                          {level.attentionPoints.length > 0 && (
                            <div className="mt-2 bg-amber-50 border border-amber-200 rounded p-2">
                              <div className="flex items-start">
                                <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs font-medium text-amber-800">Points d'attention:</p>
                                  <ul className="list-disc list-inside text-xs text-amber-700 ml-1">
                                    {level.attentionPoints.map((point, index) => (
                                      <li key={index}>{point}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CombinedLevelProgress;
