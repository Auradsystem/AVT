import React from 'react';
import { NextStep } from '../types';
import { formatDate } from '../utils/formatters';
import { Calendar, Edit2, Plus, Trash2 } from 'lucide-react';

interface NextStepsProps {
  steps: NextStep[];
  onEdit: (stepId: number) => void;
  onAdd: () => void;
  onDelete: (stepId: number) => void;
}

const NextSteps: React.FC<NextStepsProps> = ({ steps, onEdit, onAdd, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 print:shadow-none print:p-2 print:border print:border-gray-200">
      <div className="flex justify-between items-center mb-3 print:mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Prochaines étapes</h2>
        <button 
          onClick={onAdd}
          className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 print:hidden"
          title="Ajouter une étape"
        >
          <Plus size={16} />
        </button>
      </div>
      
      {steps.length === 0 ? (
        <p className="text-gray-500 italic text-sm">Aucune étape à venir</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {steps.map((step) => (
            <li key={step.id} className="py-2 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <Calendar className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{step.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(step.dueDate)}</p>
                  </div>
                </div>
                <div className="flex space-x-1 print:hidden">
                  <button 
                    onClick={() => onEdit(step.id)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Modifier"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => onDelete(step.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Supprimer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NextSteps;
