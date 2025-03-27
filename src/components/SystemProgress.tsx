import React from 'react';
import { SystemProgress as SystemProgressType } from '../types';
import ProgressBar from './ProgressBar';

interface SystemProgressProps {
  systems: SystemProgressType[];
}

const SystemProgress: React.FC<SystemProgressProps> = ({ systems }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Avancement par système</h2>
      
      <div className="space-y-4">
        {systems.map((system) => (
          <div key={system.id} className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-medium text-gray-800">{system.name}</h3>
              <span className="font-semibold">{system.progress}%</span>
            </div>
            <ProgressBar 
              progress={system.progress} 
              status={system.status}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemProgress;
