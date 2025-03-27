import React from 'react';

interface ProgressBarProps {
  progress: number;
  status?: 'not-started' | 'in-progress' | 'delayed' | 'completed' | 'testing';
  height?: string;
  showLabel?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  status = 'in-progress', 
  height = 'h-4',
  showLabel = true
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'not-started':
        return 'bg-gray-300';
      case 'in-progress':
        return 'bg-blue-500';
      case 'delayed':
        return 'bg-amber-500';
      case 'completed':
        return 'bg-green-500';
      case 'testing':
        return 'bg-purple-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'not-started':
        return 'Non démarré';
      case 'in-progress':
        return 'En cours';
      case 'delayed':
        return 'Retard';
      case 'completed':
        return 'Terminé';
      case 'testing':
        return 'En test';
      default:
        return 'En cours';
    }
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full ${height}`}>
        <div
          className={`${getStatusColor()} ${height} rounded-full transition-all duration-500 ease-in-out`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-gray-600">
          <span>{progress}%</span>
          <span className={`font-medium ${status === 'delayed' ? 'text-amber-600' : ''}`}>
            {getStatusText()}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
