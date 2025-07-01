
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
  console.log('📥 Parâmetros de filtro recebidos:', {
    totalCards: cards.length,
    selectedProject,
    filterOverdue,
    filterPerson,
    filterTeam,
    filterStatus
  });

  // Log detalhado de cada card
  console.log('📋 Cards disponíveis para filtrar:');
  cards.forEach((card, index) => {
    console.log(`  Card ${index + 1}: "${card.title}" - Projeto: "${card.projectId}" - Coluna: "${card.column}"`);
  });

  const getCardsByProject = (cards: Card[], projectId: string): Card[] => {
    console.log(`🔍 Filtrando por projeto: "${projectId}"`);
    
    if (!projectId || projectId === '') {
      console.log('⚠️ Projeto vazio, retornando todos os cards');
      return cards;
    }
    
    const filteredByProject = cards.filter(card => {
      const cardProjectId = card.projectId || '';
      const match = cardProjectId === projectId;
      
      console.log(`  Card "${card.title}": projectId="${cardProjectId}" vs selectedProject="${projectId}" - Match: ${match}`);
      return match;
    });
    
    console.log(`✅ Resultado da filtragem por projeto: ${filteredByProject.length} cards`);
    return filteredByProject;
  };

  const getOverdueCards = (cards: Card[]): Card[] => {
    console.log('🔍 Filtrando cards em atraso...');
    const overdueCards = cards.filter(card => {
      if (!card.estimatedCompletionDate) return false;
      const currentDate = new Date();
      const estimatedDate = new Date(card.estimatedCompletionDate);
      const isOverdue = currentDate > estimatedDate && card.column !== 'done';
      
      if (isOverdue) {
        console.log(`  Card em atraso: "${card.title}"`);
      }
      
      return isOverdue;
    });
    
    console.log(`✅ Cards em atraso encontrados: ${overdueCards.length}`);
    return overdueCards;
  };

  // Aplicar filtros passo a passo
  let filteredCards = cards;
  console.log(`🎯 Iniciando filtragem com ${filteredCards.length} cards`);

  // Filtro por projeto
  if (selectedProject && selectedProject !== '') {
    filteredCards = getCardsByProject(filteredCards, selectedProject);
    console.log(`📊 Após filtro por projeto: ${filteredCards.length} cards`);
  } else {
    console.log('⚠️ Nenhum projeto selecionado, mantendo todos os cards');
  }

  // Filtro por atraso
  if (filterOverdue) {
    filteredCards = getOverdueCards(filteredCards);
    console.log(`📊 Após filtro por atraso: ${filteredCards.length} cards`);
  }

  // Filtro por pessoa
  if (filterPerson) {
    const beforePersonFilter = filteredCards.length;
    filteredCards = filteredCards.filter(card => 
      card.assignee.name === filterPerson
    );
    console.log(`📊 Após filtro por pessoa "${filterPerson}": ${filteredCards.length} cards (antes: ${beforePersonFilter})`);
  }

  // Filtro por equipe/tag
  if (filterTeam) {
    const beforeTeamFilter = filteredCards.length;
    filteredCards = filteredCards.filter(card => 
      card.tags?.includes(filterTeam)
    );
    console.log(`📊 Após filtro por equipe "${filterTeam}": ${filteredCards.length} cards (antes: ${beforeTeamFilter})`);
  }

  // Filtro por status/coluna
  if (filterStatus) {
    const beforeStatusFilter = filteredCards.length;
    filteredCards = filteredCards.filter(card => 
      card.column === filterStatus
    );
    console.log(`📊 Após filtro por status "${filterStatus}": ${filteredCards.length} cards (antes: ${beforeStatusFilter})`);
  }

  console.log('=== RESULTADO FINAL DOS FILTROS ===');
  console.log(`🎯 Cards finais: ${filteredCards.length}`);
  
  if (filteredCards.length === 0) {
    console.log('⚠️ NENHUM CARD PASSOU PELOS FILTROS!');
    console.log('🔍 Diagnóstico:');
    console.log(`  - Cards originais: ${cards.length}`);
    console.log(`  - Projeto selecionado: "${selectedProject}"`);
    console.log(`  - Projetos disponíveis: ${[...new Set(cards.map(c => c.projectId))]}`);
    
    // Verificar se existe algum card com o projeto selecionado
    const cardsWithSelectedProject = cards.filter(card => card.projectId === selectedProject);
    console.log(`  - Cards com projeto "${selectedProject}": ${cardsWithSelectedProject.length}`);
  }
  
  filteredCards.forEach((card, index) => {
    console.log(`  Card final ${index + 1}: "${card.title}" (coluna: ${card.column}, projeto: ${card.projectId})`);
  });

  return filteredCards;
}
