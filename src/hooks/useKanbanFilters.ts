
import { Card } from "@/utils/kanbanUtils";

export function useKanbanFilters(
  cards: Card[],
  selectedProject: string,
  filterOverdue: boolean,
  filterPerson: string,
  filterTeam: string,
  filterStatus: string
) {
  console.log('=== FILTROS KANBAN DEBUG ===');
  console.log('Cards recebidos:', cards.length);
  console.log('Projeto selecionado:', selectedProject);
  
  // Primeiro, vamos mostrar todos os cards sem filtros para debug
  console.log('Todos os cards disponíveis:');
  cards.forEach((card, index) => {
    console.log(`Card ${index + 1}: "${card.title}" - Projeto: "${card.projectId}" - Coluna: "${card.column}"`);
  });

  const getCardsByProject = (cards: Card[], projectId: string): Card[] => {
    console.log(`Filtrando por projeto: "${projectId}"`);
    
    const filteredByProject = cards.filter(card => {
      // Verificar se o projectId do card existe e corresponde
      const cardProjectId = card.projectId || '';
      const match = cardProjectId === projectId;
      
      console.log(`Card "${card.title}": projectId="${cardProjectId}" vs selectedProject="${projectId}" - Match: ${match}`);
      return match;
    });
    
    console.log(`Resultado: ${filteredByProject.length} cards encontrados para projeto "${projectId}"`);
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

  // Aplicar filtros
  let filteredCards = cards;

  // Se não há projeto selecionado, mostrar todos os cards
  if (selectedProject && selectedProject !== '') {
    filteredCards = getCardsByProject(filteredCards, selectedProject);
  }

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

  console.log('=== RESULTADO FINAL DOS FILTROS ===');
  console.log(`Cards finais: ${filteredCards.length}`);
  filteredCards.forEach((card, index) => {
    console.log(`Card final ${index + 1}: "${card.title}" (coluna: ${card.column}, projeto: ${card.projectId})`);
  });

  return filteredCards;
}
