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
    <div className="bg-white rounded-lg shadow-md p-4 print:shadow-none print:p-2 print:border print:border-gray-200">
      <div className="flex justify-between items-start mb-3 print:mb-2">
        <div className="flex-grow">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800 mr-2">{projectInfo.name}</h1>
            <button 
              onClick={onEdit}
              className="text-blue-500 hover:text-blue-700 print:hidden"
              title="Modifier les informations du projet"
            >
              <Edit2 size={16} />
            </button>
          </div>
          <div className="flex flex-wrap items-center mt-1 text-sm text-gray-600">
            <span className="mr-4">Client: <span className="font-medium">{projectInfo.client}</span></span>
            <span>Période: <span className="font-medium">{formatDate(projectInfo.startDate)} - {formatDate(projectInfo.endDate)}</span></span>
          </div>
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
