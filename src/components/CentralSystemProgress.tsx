import React from 'react';
import { CentralSystem } from '../types';
import ProgressBar from './ProgressBar';
import { Edit2, Trash2, Plus } from 'lucide-react';

interface CentralSystemProgressProps {
  systems: CentralSystem[];
  onEdit: (systemId: string) => void;
  onDelete: (systemId: string) => void;
  onAdd: () => void;
}

const CentralSystemProgress: React.FC<CentralSystemProgressProps> = ({ 
  systems, 
  onEdit, 
  onDelete,
  onAdd
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 print:shadow-none print:p-2 print:border print:border-gray-200">
      <div className="flex justify-between items-center mb-3 print:mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Programmation / Centrale (PCL)</h2>
        <button 
          onClick={onAdd}
          className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 print:hidden"
          title="Ajouter un système central"
        >
          <Plus size={16} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 print:gap-2">
        {systems.map((system) => (
          <div key={system.id} className="border border-gray-200 rounded-lg p-3 print:p-2">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-base font-medium text-gray-800">{system.name}</h3>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm">{system.progress}%</span>
                <div className="flex space-x-1 print:hidden">
                  <button 
                    onClick={() => onEdit(system.id)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Modifier"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => onDelete(system.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Supprimer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
            
            <ProgressBar 
              progress={system.progress} 
              status={system.status}
              height="h-3"
              showLabel={false}
            />
            
            {system.notes && (
              <div className="mt-1 text-xs text-gray-600">
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
