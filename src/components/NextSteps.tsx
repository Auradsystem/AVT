import React from 'react';
import { NextStep } from '../types';
import { formatDate } from '../utils/formatters';
import { Calendar, Edit2, Plus } from 'lucide-react';

interface NextStepsProps {
  steps: NextStep[];
  onEdit: (stepId: number) => void;
  onAdd: () => void;
}

const NextSteps: React.FC<NextStepsProps> = ({ steps, onEdit, onAdd }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Prochaines étapes</h2>
        <button 
          onClick={onAdd}
          className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"
          title="Ajouter une étape"
        >
          <Plus size={18} />
        </button>
      </div>
      
      {steps.length === 0 ? (
        <p className="text-gray-500 italic">Aucune étape à venir</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {steps.map((step) => (
            <li key={step.id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">{step.description}</p>
                    <p className="text-sm text-gray-500">{formatDate(step.dueDate)}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onEdit(step.id)}
                  className="text-blue-500 hover:text-blue-700 ml-2"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NextSteps;
