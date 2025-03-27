import React, { useState } from 'react';
import { ProjectInfo } from '../types';
import ProgressBar from './ProgressBar';
import { formatDate } from '../utils/formatters';
import { Edit2, Check, X } from 'lucide-react';

interface ProjectOverviewProps {
  projectInfo: ProjectInfo;
  overallProgress: number;
  onUpdate: (updatedInfo: ProjectInfo) => void;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ 
  projectInfo, 
  overallProgress,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState(projectInfo);

  const handleEdit = () => {
    setEditedInfo(projectInfo);
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate({
      ...editedInfo,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 print:shadow-none print:p-2 print:border print:border-gray-200">
      <div className="flex justify-between items-start mb-3 print:mb-2">
        <div className="flex-grow">
          {isEditing ? (
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Nom du projet</label>
                <input
                  type="text"
                  value={editedInfo.name}
                  onChange={(e) => setEditedInfo({...editedInfo, name: e.target.value})}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Client</label>
                  <input
                    type="text"
                    value={editedInfo.client}
                    onChange={(e) => setEditedInfo({...editedInfo, client: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Entreprise</label>
                  <input
                    type="text"
                    value={editedInfo.company}
                    onChange={(e) => setEditedInfo({...editedInfo, company: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Date de début</label>
                  <input
                    type="date"
                    value={editedInfo.startDate}
                    onChange={(e) => setEditedInfo({...editedInfo, startDate: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Date de fin</label>
                  <input
                    type="date"
                    value={editedInfo.endDate}
                    onChange={(e) => setEditedInfo({...editedInfo, endDate: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-2">
                <button 
                  onClick={handleCancel}
                  className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                >
                  <X size={16} className="text-gray-600" />
                </button>
                <button 
                  onClick={handleSave}
                  className="p-1 rounded bg-blue-100 hover:bg-blue-200"
                >
                  <Check size={16} className="text-blue-600" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-800 mr-2">{projectInfo.name}</h1>
                <button 
                  onClick={handleEdit}
                  className="text-blue-500 hover:text-blue-700 print:hidden"
                  title="Modifier les informations du projet"
                >
                  <Edit2 size={16} />
                </button>
              </div>
              <div className="flex flex-wrap items-center mt-1 text-sm text-gray-600">
                <span className="mr-4">Client: <span className="font-medium">{projectInfo.client}</span></span>
                <span className="mr-4">Entreprise: <span className="font-medium">{projectInfo.company}</span></span>
                <span>Période: <span className="font-medium">{formatDate(projectInfo.startDate)} - {formatDate(projectInfo.endDate)}</span></span>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center bg-blue-50 px-3 py-1 rounded-md print:bg-transparent print:px-0">
          <span className="text-sm text-blue-700 print:text-gray-600">Dernière mise à jour: {formatDate(projectInfo.lastUpdated)}</span>
        </div>
      </div>
      
      <div className="mb-1">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-base font-semibold text-gray-800">Avancement global</h2>
          <span className="text-xl font-bold text-blue-600">{overallProgress}%</span>
        </div>
        <ProgressBar progress={overallProgress} height="h-5" />
      </div>
    </div>
  );
};

export default ProjectOverview;
