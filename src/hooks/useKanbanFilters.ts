
import { Card } from "@/utils/kanbanUtils";

export function useKanbanFilters(
  cards: Card[],
  selectedProject: string,
  filterOverdue: boolean,
  filterPerson: string,
  filterTeam: string,
  filterStatus: string
) {
  const getCardsByProject = (cards: Card[], projectId: string): Card[] => {
    return cards.filter(card => card.projectId === projectId);
  };

  const getOverdueCards = (cards: Card[]): Card[] => {
    return cards.filter(card => {
      if (!card.estimatedCompletionDate) return false;
      const currentDate = new Date();
      const estimatedDate = new Date(card.estimatedCompletionDate);
      return currentDate > estimatedDate && card.column !== 'done';
    });
  };

  // Filtrar cards por projeto
  const projectCards = getCardsByProject(cards, selectedProject);
  
  // Aplicar filtros
  let filteredCards = projectCards;

  if (filterOverdue) {
    filteredCards = getOverdueCards(filteredCards);
  }

  if (filterPerson) {
    filteredCards = filteredCards.filter(card => 
      card.assignee.name === filterPerson
    );
  }

  if (filterTeam) {
    filteredCards = filteredCards.filter(card => 
      card.tags?.includes(filterTeam)
    );
  }

  if (filterStatus) {
    filteredCards = filteredCards.filter(card => 
      card.column === filterStatus
    );
  }

  return filteredCards;
}
