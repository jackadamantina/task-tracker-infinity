
import { Card } from './kanbanUtils';

export const STORAGE_KEYS = {
  CARDS: 'kanban_cards',
  USERS: 'system_users',
  PROJECTS: 'system_projects',
  WORK_HOURS: 'work_hours_config',
  INTEGRATIONS: 'integrations_config'
};

export const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error);
  }
};

export const getFromStorage = (key: string, defaultValue: any = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Erro ao ler do localStorage:', error);
    return defaultValue;
  }
};

export const saveCards = (cards: Card[]) => {
  saveToStorage(STORAGE_KEYS.CARDS, cards);
};

export const getCards = (): Card[] => {
  return getFromStorage(STORAGE_KEYS.CARDS, []);
};

export const saveWorkHours = (config: any) => {
  saveToStorage(STORAGE_KEYS.WORK_HOURS, config);
};

export const getWorkHours = () => {
  return getFromStorage(STORAGE_KEYS.WORK_HOURS, {
    workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    startTime: '09:00',
    endTime: '18:00'
  });
};
