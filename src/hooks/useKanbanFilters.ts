
import { Card } from "@/utils/kanbanUtils";

export function useKanbanFilters(
  cards: Card[],
  selectedProject: string,
  filterOverdue: boolean,
  filterPerson: string,
  filterTeam: string,
  filterStatus: string
) {
  console.log('=== FILTROS KANBAN ===');
  console.log('Cards recebidos para filtrar:', cards.length);
  console.log('Projeto selecionado:', selectedProject);
  console.log('Outros filtros:', { filterOverdue, filterPerson, filterTeam, filterStatus });

  const getCardsByProject = (cards: Card[], projectId: string): Card[] => {
    const filteredByProject = cards.filter(card => {
      const match = card.projectId === projectId;
      console.log(`Card "${card.title}" - Projeto: ${card.projectId} - Match com ${projectId}: ${match}`);
      return match;
    });
    console.log(`Cards filtrados por projeto (${projectId}):`, filteredByProject.length);
    return filteredByProject;
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
  let filteredCards = getCardsByProject(cards, selectedProject);
  console.log('Cards após filtro de projeto:', filteredCards.length);

  // Aplicar filtros adicionais
  if (filterOverdue) {
    filteredCards = getOverdueCards(filteredCards);
    console.log('Cards após filtro de atraso:', filteredCards.length);
  }

  if (filterPerson) {
    filteredCards = filteredCards.filter(card => 
      card.assignee.name === filterPerson
    );
    console.log('Cards após filtro de pessoa:', filteredCards.length);
  }

  if (filterTeam) {
    filteredCards = filteredCards.filter(card => 
      card.tags?.includes(filterTeam)
    );
    console.log('Cards após filtro de equipe:', filteredCards.length);
  }

  if (filterStatus) {
    filteredCards = filteredCards.filter(card => 
      card.column === filterStatus
    );
    console.log('Cards após filtro de status:', filteredCards.length);
  }

  console.log('=== RESULTADO FINAL DOS FILTROS ===');
  console.log('Cards finais:', filteredCards.length);
  filteredCards.forEach((card, index) => {
    console.log(`Card final ${index + 1}: ${card.title} (coluna: ${card.column})`);
  });

  return filteredCards;
}
