import React, { useState } from 'react';
import { ParkingLevel, SystemType } from '../types';
import ProgressBar from './ProgressBar';
import { AlertTriangle, CheckCircle, Edit2 } from 'lucide-react';
import { calculateLevelProgress } from '../data/mockData';

interface CombinedLevelProgressProps {
  levels: ParkingLevel[];
  systemTypes: SystemType[];
  onEditLevel: (levelId: number) => void;
}

const CombinedLevelProgress: React.FC<CombinedLevelProgressProps> = ({ 
  levels, 
  systemTypes,
  onEditLevel
}) => {
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);

  const toggleExpand = (levelId: number) => {
    setExpandedLevel(expandedLevel === levelId ? null : levelId);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Avancement par niveau</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Zone
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Collectrice
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avancement
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Points d'attention
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {levels.map((level) => {
              const levelProgress = calculateLevelProgress(level);
              const isExpanded = expandedLevel === level.id;
              
              return (
                <React.Fragment key={level.id}>
                  <tr 
                    className={`hover:bg-gray-50 cursor-pointer ${isExpanded ? 'bg-blue-50' : ''}`}
                    onClick={() => toggleExpand(level.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {level.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${level.isCollector ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {level.isCollector ? 'Oui' : 'Non'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap w-64">
                      <div className="flex items-center">
                        <ProgressBar progress={levelProgress} showLabel={false} />
                        <span className="ml-2 text-sm font-medium">{levelProgress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        En cours
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {level.attentionPoints.length > 0 ? (
                        <div className="flex items-center text-amber-500">
                          <AlertTriangle size={16} className="mr-1" />
                          <span>{level.attentionPoints.length} point(s)</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-green-500">
                          <CheckCircle size={16} className="mr-1" />
                          <span>Aucun</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditLevel(level.id);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                  
                  {isExpanded && (
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="px-6 py-4">
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-700">Détail des systèmes</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {level.systems.map((system) => {
                              const systemType = systemTypes.find(type => type.id === system.systemId);
                              return (
                                <div key={system.systemId} className="bg-white p-3 rounded border border-gray-200">
                                  <div className="flex justify-between items-center mb-1">
                                    <h5 className="font-medium text-gray-800">{systemType?.name}</h5>
                                    <span className="font-semibold">{system.progress}%</span>
                                  </div>
                                  <ProgressBar 
                                    progress={system.progress} 
                                    status={system.status}
                                    showLabel={false}
                                  />
                                </div>
                              );
                            })}
                          </div>
                          
                          {level.attentionPoints.length > 0 && (
                            <div className="mt-3 bg-amber-50 border border-amber-200 rounded p-3">
                              <div className="flex items-start">
                                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-amber-800">Points d'attention:</p>
                                  <ul className="list-disc list-inside text-sm text-amber-700 ml-1">
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
