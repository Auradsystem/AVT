import React from 'react';
import { ProjectInfo } from '../types';
import ProgressBar from './ProgressBar';
import { formatDate } from '../utils/formatters';
import { Edit2 } from 'lucide-react';

interface ProjectOverviewProps {
  projectInfo: ProjectInfo;
  overallProgress: number;
  onEdit: () => void;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ 
  projectInfo, 
  overallProgress,
  onEdit
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{projectInfo.name}</h1>
        </div>
        <div className="flex items-center bg-blue-50 px-3 py-1 rounded-md">
          <span className="text-sm text-blue-700">Dernière mise à jour: {formatDate(projectInfo.lastUpdated)}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between">
            <p className="text-sm text-gray-500 mb-1">Client</p>
            <button 
              onClick={onEdit}
              className="text-blue-500 hover:text-blue-700"
              title="Modifier les informations du projet"
            >
              <Edit2 size={16} />
            </button>
          </div>
          <p className="font-semibold">{projectInfo.client}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg col-span-2">
          <p className="text-sm text-gray-500 mb-1">Période</p>
          <p className="font-semibold">
            {formatDate(projectInfo.startDate)} - {formatDate(projectInfo.endDate)}
          </p>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-800">Avancement global</h2>
          <span className="text-2xl font-bold text-blue-600">{overallProgress}%</span>
        </div>
        <ProgressBar progress={overallProgress} height="h-6" />
      </div>
    </div>
  );
};

export default ProjectOverview;
