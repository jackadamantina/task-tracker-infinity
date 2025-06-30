
import { Card } from '@/types/kanban';

export const getCardsByColumn = (cards: Card[], columnId: string): Card[] => {
  return cards.filter(card => card.column === columnId);
};

export const getCardsByProject = (cards: Card[], projectId: string): Card[] => {
  return cards.filter(card => card.projectId === projectId);
};

export const isCardOverdue = (card: Card): boolean => {
  if (!card.estimatedCompletionDate) return false;
  const currentDate = new Date();
  const estimatedDate = new Date(card.estimatedCompletionDate);
  
  // Only consider overdue if current date is AFTER estimated completion date AND card is not done
  return currentDate > estimatedDate && card.column !== 'done';
};

export const getOverdueCards = (cards: Card[]): Card[] => {
  return cards.filter(card => isCardOverdue(card));
};

export const getExecutionTime = (startTime?: Date, completedTime?: Date): number => {
  if (!startTime || !completedTime) return 0;
  const diffMs = completedTime.getTime() - startTime.getTime();
  return Math.round(diffMs / (1000 * 60 * 60)); // converter para horas
};

export const shouldAutoProgress = (card: Card): boolean => {
  return card.subtasks.total > 0 && card.subtasks.completed === card.subtasks.total;
};

export const getNextColumn = (currentColumn: string): string => {
  const columnOrder = ["todo", "in-progress", "review", "done"];
  const currentIndex = columnOrder.indexOf(currentColumn);
  return currentIndex < columnOrder.length - 1 ? columnOrder[currentIndex + 1] : currentColumn;
};
