
import { KanbanCard } from "../useSupabaseKanban";
import { Card } from "@/types/kanban";

export function useCardConversion(supabaseCards: KanbanCard[]) {
  const convertSupabaseCardToCard = (supabaseCard: KanbanCard): Card => {
    // Converter UUID para ID numérico simples
    const numericId = Math.abs(supabaseCard.id.split('-').join('').substring(0, 8).split('').reduce((a, b) => {
      return ((a << 5) - a) + b.charCodeAt(0);
    }, 0));
    
    // Mapear column_id para nome da coluna
    let columnName = 'todo'; // default
    
    if (supabaseCard.column_id) {
      const columnMappings: { [key: string]: string } = {
        'e04ac9f2-b9fd-4f1c-b82d-e31f5527f6a0': 'todo',
        '123e4567-e89b-12d3-a456-426614174001': 'in-progress',
        '123e4567-e89b-12d3-a456-426614174002': 'review',
        '123e4567-e89b-12d3-a456-426614174003': 'done'
      };
      
      columnName = columnMappings[supabaseCard.column_id] || 'todo';
    }
    
    return {
      id: numericId,
      title: supabaseCard.title,
      description: supabaseCard.description || "",
      column: columnName,
      priority: supabaseCard.priority,
      assignee: {
        name: supabaseCard.assignee?.name || "Não atribuído",
        avatar: supabaseCard.assignee?.avatar || "/placeholder.svg"
      },
      attachments: supabaseCard.attachments || 0,
      subtasks: {
        completed: supabaseCard.subtasks_completed || 0,
        total: supabaseCard.subtasks_total || 0
      },
      dependencies: [],
      blocked: false,
      timeSpent: supabaseCard.time_spent || 0,
      tags: supabaseCard.tags || [],
      startTime: supabaseCard.start_time ? new Date(supabaseCard.start_time) : undefined,
      completedTime: undefined,
      executionTime: 0,
      estimatedCompletionDate: supabaseCard.estimated_completion_date ? new Date(supabaseCard.estimated_completion_date) : undefined,
      projectId: supabaseCard.project_id || 'sistema-ecommerce'
    };
  };

  const convertCards = (cards: KanbanCard[]): Card[] => {
    console.log('=== CONVERSÃO DE CARDS ===');
    console.log('Cards do Supabase recebidos:', cards.length);
    
    const convertedCards = cards.map((supabaseCard, index) => {
      console.log(`Convertendo card ${index + 1}:`, {
        id: supabaseCard.id,
        title: supabaseCard.title,
        column_id: supabaseCard.column_id,
        project_id: supabaseCard.project_id
      });
      
      const convertedCard = convertSupabaseCardToCard(supabaseCard);
      
      console.log(`Card convertido ${index + 1}:`, {
        id: convertedCard.id,
        title: convertedCard.title,
        column: convertedCard.column,
        projectId: convertedCard.projectId
      });
      
      return convertedCard;
    });
    
    console.log('=== RESULTADO DA CONVERSÃO ===');
    console.log('Total de cards convertidos:', convertedCards.length);
    convertedCards.forEach((card, index) => {
      console.log(`Card final ${index + 1}: ${card.title} (coluna: ${card.column}, projeto: ${card.projectId})`);
    });
    
    return convertedCards;
  };

  return { convertCards };
}
