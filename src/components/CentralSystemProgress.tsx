import React from 'react';
import { CentralSystem } from '../types';
import ProgressBar from './ProgressBar';
import { Edit2 } from 'lucide-react';

interface CentralSystemProgressProps {
  systems: CentralSystem[];
  onEdit: (systemId: string) => void;
}

const CentralSystemProgress: React.FC<CentralSystemProgressProps> = ({ systems, onEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Programmation / Centrale (PCL)</h2>
      
      <div className="space-y-6">
        {systems.map((system) => (
          <div key={system.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-gray-800">{system.name}</h3>
              <div className="flex items-center space-x-3">
                <span className="font-semibold">{system.progress}%</span>
                <button 
                  onClick={() => onEdit(system.id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            </div>
            
            <ProgressBar 
              progress={system.progress} 
              status={system.status}
            />
            
            {system.notes && (
              <div className="mt-2 text-sm text-gray-600">
                <p>{system.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CentralSystemProgress;
