import { DashboardData } from '../types';

const STORAGE_KEY = 'dashboard_data';

export const saveData = (data: DashboardData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des données:', error);
  }
};

export const loadData = (): DashboardData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    return null;
  }
};

export const clearData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Erreur lors de la suppression des données:', error);
  }
};
