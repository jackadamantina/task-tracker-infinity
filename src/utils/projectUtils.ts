
import { Card } from '@/types/kanban';
import { getCardsByProject } from './cardUtils';

export const getProjectProgress = (projectId: string, cards: Card[]): number => {
  const projectCards = getCardsByProject(cards, projectId);
  if (projectCards.length === 0) return 0;
  
  const completedCards = projectCards.filter(card => card.column === 'done');
  return Math.round((completedCards.length / projectCards.length) * 100);
};

export const getProjectTimeline = (projectId: string, cards: Card[]) => {
  const projectCards = getCardsByProject(cards, projectId);
  
  const timeline = projectCards.map(card => ({
    id: card.id,
    title: card.title,
    startDate: card.startTime || new Date(),
    estimatedEndDate: card.estimatedCompletionDate || new Date(),
    actualEndDate: card.completedTime,
    progress: card.column === 'done' ? 100 : 
              card.column === 'review' ? 75 : 
              card.column === 'in-progress' ? 50 : 0,
    status: card.column,
    assignee: card.assignee.name,
    isOverdue: card.estimatedCompletionDate ? new Date() > card.estimatedCompletionDate && card.column !== 'done' : false,
    timeSpent: card.timeSpent,
    executionTime: card.executionTime || 0
  }));

  return timeline.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
};
