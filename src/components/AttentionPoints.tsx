import React from 'react';
import { AttentionPoint } from '../types';
import { formatDate } from '../utils/formatters';
import { AlertTriangle, AlertCircle, Info, Edit2, Plus, Trash2 } from 'lucide-react';

interface AttentionPointsProps {
  points: AttentionPoint[];
  onEdit: (pointId: number) => void;
  onAdd: () => void;
  onDelete: (pointId: number) => void;
}

const AttentionPoints: React.FC<AttentionPointsProps> = ({ points, onEdit, onAdd, onDelete }) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0 mt-0.5" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />;
      case 'low':
        return <Info className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />;
      default:
        return <Info className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />;
    }
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-200';
      case 'medium':
        return 'bg-amber-50 border-amber-200';
      case 'low':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 print:shadow-none print:p-2 print:border print:border-gray-200">
      <div className="flex justify-between items-center mb-3 print:mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Points d'attention</h2>
        <button 
          onClick={onAdd}
          className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 print:hidden"
          title="Ajouter un point d'attention"
        >
          <Plus size={16} />
        </button>
      </div>
      
      {points.length === 0 ? (
        <p className="text-gray-500 italic text-sm">Aucun point d'attention</p>
      ) : (
        <div className="space-y-2">
          {points.map((point) => (
            <div 
              key={point.id} 
              className={`border rounded-lg p-2 ${getSeverityClass(point.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  {getSeverityIcon(point.severity)}
                  <div>
                    <div className="flex items-center">
                      <p className="font-medium text-gray-800 text-sm">{point.description}</p>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">{point.details}</p>
                    <p className="text-xs text-gray-500 mt-1">Signalé le: {formatDate(point.date)}</p>
                  </div>
                </div>
                <div className="flex space-x-1 print:hidden">
                  <button 
                    onClick={() => onEdit(point.id)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Modifier"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => onDelete(point.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Supprimer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttentionPoints;
