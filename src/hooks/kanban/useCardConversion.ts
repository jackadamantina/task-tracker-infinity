
import { KanbanCard } from "../useSupabaseKanban";
import { Card } from "@/types/kanban";

export function useCardConversion(supabaseCards: KanbanCard[]) {
  const convertSupabaseCardToCard = (supabaseCard: KanbanCard): Card => {
    console.log('🔄 Convertendo card do Supabase:', {
      id: supabaseCard.id,
      title: supabaseCard.title,
      column_id: supabaseCard.column_id,
      project_id: supabaseCard.project_id
    });
    
    // Converter UUID para ID numérico simples
    const numericId = Math.abs(supabaseCard.id.split('-').join('').substring(0, 8).split('').reduce((a, b) => {
      return ((a << 5) - a) + b.charCodeAt(0);
    }, 0));
    
    console.log('🆔 ID numérico gerado:', numericId);
    
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
      console.log('📍 Mapeamento de coluna:', {
        column_id: supabaseCard.column_id,
        columnName: columnName,
        found: !!columnMappings[supabaseCard.column_id]
      });
    }
    
    // CORRIGIR: Mapear project_id para o nome do projeto esperado
    let projectId = 'sistema-ecommerce'; // default padrão
    
    if (supabaseCard.project_id) {
      const projectMappings: { [key: string]: string } = {
        '1b4f6a35-e278-452e-8590-1ae38fced91b': 'sistema-ecommerce'
      };
      
      projectId = projectMappings[supabaseCard.project_id] || 'sistema-ecommerce';
      console.log('🎯 Mapeamento de projeto:', {
        project_id: supabaseCard.project_id,
        projectId: projectId,
        found: !!projectMappings[supabaseCard.project_id]
      });
    }
    
    const convertedCard = {
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
      projectId: projectId  // Usando o projectId mapeado
    };
    
    console.log('✅ Card convertido:', {
      id: convertedCard.id,
      title: convertedCard.title,
      column: convertedCard.column,
      projectId: convertedCard.projectId
    });
    
    return convertedCard;
  };

  const convertCards = (cards: KanbanCard[]): Card[] => {
    console.log('=== CONVERSÃO DE CARDS DEBUG ===');
    console.log('📥 Cards do Supabase recebidos para conversão:', cards.length);
    
    if (cards.length === 0) {
      console.log('⚠️ Nenhum card recebido para conversão!');
      return [];
    }
    
    const convertedCards = cards.map((supabaseCard, index) => {
      console.log(`🔄 Convertendo card ${index + 1}/${cards.length}:`);
      return convertSupabaseCardToCard(supabaseCard);
    });
    
    console.log('✅ Conversão concluída:', {
      entrada: cards.length,
      saida: convertedCards.length,
      cards: convertedCards.map(card => ({
        id: card.id,
        title: card.title,
        column: card.column,
        projectId: card.projectId
      }))
    });
    
    return convertedCards;
  };

  return { convertCards };
}
