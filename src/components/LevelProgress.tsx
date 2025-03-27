import React from 'react';
import { ParkingLevel } from '../types';
import ProgressBar from './ProgressBar';
import { AlertTriangle } from 'lucide-react';

interface LevelProgressProps {
  levels: ParkingLevel[];
}

const LevelProgress: React.FC<LevelProgressProps> = ({ levels }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Avancement par niveau</h2>
      
      <div className="space-y-4">
        {levels.map((level) => (
          <div key={level.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <h3 className="text-lg font-medium text-gray-800">{level.name}</h3>
                {level.hasCollector && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    Collectrice
                  </span>
                )}
              </div>
              <span className="font-semibold">{level.progress}%</span>
            </div>
            
            <ProgressBar progress={level.progress} showLabel={false} />
            
            {level.attentionPoints.length > 0 && (
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded p-2">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Points d'attention:</p>
                    <ul className="list-disc list-inside text-sm text-amber-700 ml-1">
                      {level.attentionPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LevelProgress;
