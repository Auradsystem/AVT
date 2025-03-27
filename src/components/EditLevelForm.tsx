import React, { useState } from 'react';
import { ParkingLevel, SystemType } from '../types';

interface EditLevelFormProps {
  level: ParkingLevel;
  systemTypes: SystemType[];
  onUpdate: (updatedLevel: ParkingLevel) => void;
}

const EditLevelForm: React.FC<EditLevelFormProps> = ({ level, systemTypes, onUpdate }) => {
  const [formData, setFormData] = useState<ParkingLevel>({...level});
  const [newAttentionPoint, setNewAttentionPoint] = useState('');

  const handleSystemChange = (systemId: string, progress: number) => {
    const updatedSystems = formData.systems.map(system => {
      if (system.systemId === systemId) {
        return { ...system, progress };
      }
      return system;
    });
    
    setFormData({ ...formData, systems: updatedSystems });
  };

  const handleCollectorChange = (isCollector: boolean) => {
    setFormData({ ...formData, isCollector });
  };

  const addAttentionPoint = () => {
    if (newAttentionPoint.trim()) {
      setFormData({
        ...formData,
        attentionPoints: [...formData.attentionPoints, newAttentionPoint.trim()]
      });
      setNewAttentionPoint('');
    }
  };

  const removeAttentionPoint = (index: number) => {
    const updatedPoints = [...formData.attentionPoints];
    updatedPoints.splice(index, 1);
    setFormData({ ...formData, attentionPoints: updatedPoints });
  };

  const handleSubmit = () => {
    onUpdate(formData);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nom du niveau
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Collectrice
        </label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={formData.isCollector}
              onChange={() => handleCollectorChange(true)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-gray-700">Oui</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={!formData.isCollector}
              onChange={() => handleCollectorChange(false)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-gray-700">Non</span>
          </label>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Poids dans le calcul global ({Math.round(formData.weight * 100)}%)
        </label>
        <input
          type="range"
          min="1"
          max="100"
          value={formData.weight * 100}
          onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) / 100 })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Avancement des systèmes</h4>
        <div className="space-y-3">
          {formData.systems.map((system) => {
            const systemType = systemTypes.find(type => type.id === system.systemId);
            if (!systemType) return null;
            return (
              <div key={system.systemId}>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium text-gray-700">
                    {systemType.name}
                  </label>
                  <span className="text-sm text-gray-500">{system.progress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={system.progress}
                  onChange={(e) => handleSystemChange(system.systemId, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            );
          })}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Points d'attention
        </label>
        <div className="space-y-2">
          {formData.attentionPoints.map((point, index) => (
            <div key={index} className="flex items-center">
              <input
                type="text"
                value={point}
                onChange={(e) => {
                  const updatedPoints = [...formData.attentionPoints];
                  updatedPoints[index] = e.target.value;
                  setFormData({ ...formData, attentionPoints: updatedPoints });
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => removeAttentionPoint(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                Supprimer
              </button>
            </div>
          ))}
          <div className="flex items-center">
            <input
              type="text"
              value={newAttentionPoint}
              onChange={(e) => setNewAttentionPoint(e.target.value)}
              placeholder="Ajouter un point d'attention"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={addAttentionPoint}
              className="ml-2 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Ajouter
            </button>
          </div>
        </div>
      </div>
      
      <div className="pt-3">
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Mettre à jour
        </button>
      </div>
    </div>
  );
};

export default EditLevelForm;
