import React, { useState } from 'react';
import { CentralSystem } from '../types';

interface EditCentralSystemFormProps {
  system: CentralSystem;
  onUpdate: (updatedSystem: CentralSystem) => void;
}

const EditCentralSystemForm: React.FC<EditCentralSystemFormProps> = ({ system, onUpdate }) => {
  const [formData, setFormData] = useState<CentralSystem>({...system});

  const handleStatusChange = (status: 'not-started' | 'in-progress' | 'delayed' | 'completed' | 'testing') => {
    setFormData({ ...formData, status });
  };

  const handleSubmit = () => {
    onUpdate(formData);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nom du système
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
          Avancement ({formData.progress}%)
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={formData.progress}
          onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Statut
        </label>
        <select
          value={formData.status}
          onChange={(e) => handleStatusChange(e.target.value as any)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="not-started">Non démarré</option>
          <option value="in-progress">En cours</option>
          <option value="delayed">Retard</option>
          <option value="testing">En test</option>
          <option value="completed">Terminé</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes (optionnel)
        </label>
        <textarea
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
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

export default EditCentralSystemForm;
