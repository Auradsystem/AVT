import React from 'react';
import { AttentionPoint } from '../types';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { formatDate } from '../utils/formatters';

interface AttentionPointsProps {
  points: AttentionPoint[];
  onEdit: (id: number) => void;
  onAdd: () => void;
  onDelete: (id: number) => void;
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'low':
      return 'bg-yellow-100 text-yellow-800';
    case 'medium':
      return 'bg-orange-100 text-orange-800';
    case 'high':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getSeverityLabel = (severity: string) => {
  switch (severity) {
    case 'low':
      return 'Faible';
    case 'medium':
      return 'Moyenne';
    case 'high':
      return 'Élevée';
    default:
      return 'Inconnue';
  }
};

const AttentionPoints: React.FC<AttentionPointsProps> = ({ points, onEdit, onAdd, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Points d'attention</h2>
        <button
          onClick={onAdd}
          className="p-1 rounded-full hover:bg-gray-100 print:hidden"
          title="Ajouter un point d'attention"
        >
          <Plus className="h-5 w-5 text-blue-600" />
        </button>
      </div>
      
      <div className="px-6 py-4">
        {points.length > 0 ? (
          <ul className="space-y-4">
            {points.map((point) => (
              <li key={point.id} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{point.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(point.severity)}`}>
                        {getSeverityLabel(point.severity)}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(point.date)}</span>
                    </div>
                  </div>
                  <div className="flex space-x-1 print:hidden">
                    <button
                      onClick={() => onEdit(point.id)}
                      className="p-1 rounded-full hover:bg-gray-100"
                      title="Modifier"
                    >
                      <Edit2 className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => onDelete(point.id)}
                      className="p-1 rounded-full hover:bg-gray-100"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
                {point.details && (
                  <p className="text-xs text-gray-600 mt-1">{point.details}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">Aucun point d'attention</p>
        )}
      </div>
    </div>
  );
};

export default AttentionPoints;
