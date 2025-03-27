import React from 'react';
import { NextStep } from '../types';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { formatDate } from '../utils/formatters';

interface NextStepsProps {
  steps: NextStep[];
  onEdit: (id: number) => void;
  onAdd: () => void;
  onDelete: (id: number) => void;
}

const NextSteps: React.FC<NextStepsProps> = ({ steps, onEdit, onAdd, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Prochaines étapes</h2>
        <button
          onClick={onAdd}
          className="p-1 rounded-full hover:bg-gray-100 print:hidden"
          title="Ajouter une étape"
        >
          <Plus className="h-5 w-5 text-blue-600" />
        </button>
      </div>
      
      <div className="px-6 py-4">
        {steps.length > 0 ? (
          <ul className="space-y-3">
            {steps.map((step) => (
              <li key={step.id} className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900">{step.description}</p>
                  <p className="text-xs text-gray-500">Échéance: {formatDate(step.dueDate)}</p>
                </div>
                <div className="flex space-x-1 print:hidden">
                  <button
                    onClick={() => onEdit(step.id)}
                    className="p-1 rounded-full hover:bg-gray-100"
                    title="Modifier"
                  >
                    <Edit2 className="h-4 w-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => onDelete(step.id)}
                    className="p-1 rounded-full hover:bg-gray-100"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">Aucune étape à venir</p>
        )}
      </div>
    </div>
  );
};

export default NextSteps;
