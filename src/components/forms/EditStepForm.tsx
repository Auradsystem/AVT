import React, { useState, useEffect } from 'react';
import { NextStep } from '../../types';

interface EditStepFormProps {
  step: NextStep;
  onSubmit: (updatedStep: NextStep) => void;
  onCancel: () => void;
}

const EditStepForm: React.FC<EditStepFormProps> = ({ step, onSubmit, onCancel }) => {
  const [description, setDescription] = useState(step.description);
  const [dueDate, setDueDate] = useState(step.dueDate);

  useEffect(() => {
    // Update form state when prop changes
    setDescription(step.description);
    setDueDate(step.dueDate);
  }, [step]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onSubmit({
        ...step,
        description,
        dueDate
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
          Date d'échéance
        </label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
};

export default EditStepForm;
