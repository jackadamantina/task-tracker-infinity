import { useState, useEffect } from "react";
import { useSupabaseKanban, KanbanCard } from "./useSupabaseKanban";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/types/kanban";

export function useKanbanCards() {
  const { cards: supabaseCards, createCard, updateCard, deleteCard, refetch } = useSupabaseKanban();
  const [cards, setCards] = useState<Card[]>([]);

  // Converter dados do Supabase para o formato esperado pelo frontend
  useEffect(() => {
    console.log('=== CONVERSÃO DE CARDS ===');
    console.log('Cards do Supabase recebidos:', supabaseCards.length);
    
    const convertedCards: Card[] = supabaseCards.map((supabaseCard, index) => {
      console.log(`Convertendo card ${index + 1}:`, {
        id: supabaseCard.id,
        title: supabaseCard.title,
        column_id: supabaseCard.column_id,
        project_id: supabaseCard.project_id
      });
      
      // Converter UUID para ID numérico simples
      const numericId = Math.abs(supabaseCard.id.split('-').join('').substring(0, 8).split('').reduce((a, b) => {
        return ((a << 5) - a) + b.charCodeAt(0);
      }, 0));
      
      // Mapear column_id para nome da coluna - mapeamento direto
      let columnName = 'todo'; // default
      
      if (supabaseCard.column_id) {
        const columnMappings: { [key: string]: string } = {
          'e04ac9f2-b9fd-4f1c-b82d-e31f5527f6a0': 'todo',
          '123e4567-e89b-12d3-a456-426614174001': 'in-progress',
          '123e4567-e89b-12d3-a456-426614174002': 'review',
          '123e4567-e89b-12d3-a456-426614174003': 'done'
        };
        
        columnName = columnMappings[supabaseCard.column_id] || 'todo';
        console.log(`Mapeando coluna ${supabaseCard.column_id} -> ${columnName}`);
      }
      
      const convertedCard: Card = {
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
    
    setCards(convertedCards);
  }, [supabaseCards]);

  const handleCreateCard = async (newCardData: Omit<Card, 'id'>) => {
    try {
      console.log('=== CRIANDO NOVO CARD ===');
      console.log('Dados do card:', newCardData);
      
      // Mapear coluna para UUID
      const columnMappings: { [key: string]: string } = {
        'todo': 'e04ac9f2-b9fd-4f1c-b82d-e31f5527f6a0',
        'in-progress': '123e4567-e89b-12d3-a456-426614174001',
        'review': '123e4567-e89b-12d3-a456-426614174002',
        'done': '123e4567-e89b-12d3-a456-426614174003'
      };
      
      const columnId = columnMappings[newCardData.column] || 'e04ac9f2-b9fd-4f1c-b82d-e31f5527f6a0';
      console.log('Coluna mapeada:', newCardData.column, '->', columnId);
      
      // Buscar um projeto válido
      const { data: projects } = await supabase.from('projects').select('id').limit(1);
      const projectId = projects && projects.length > 0 ? projects[0].id : null;
      
      console.log('Projeto selecionado:', projectId);
      
      const supabaseCardData = {
        title: newCardData.title,
        description: newCardData.description,
        column_id: columnId,
        project_id: projectId,
        assignee_id: null,
        priority: newCardData.priority,
        tags: newCardData.tags || [],
        dependencies: [],
        attachments: newCardData.attachments,
        subtasks_completed: newCardData.subtasks.completed,
        subtasks_total: newCardData.subtasks.total,
        time_spent: newCardData.timeSpent,
        estimated_completion_date: newCardData.estimatedCompletionDate?.toISOString() || null,
        start_time: newCardData.startTime?.toISOString() || null
      };

      console.log('Dados para Supabase:', supabaseCardData);
      
      await createCard(supabaseCardData);
      console.log('Card criado com sucesso no Supabase');
      
      // Forçar uma nova busca dos dados
      await refetch();
      console.log('Dados atualizados após criação do card');
      
    } catch (error) {
      console.error('Erro ao criar card:', error);
      throw error;
    }
  };

  const handleCardSave = async (updatedCard: Card) => {
    try {
      // Mapear coluna para UUID
      let columnId = 'e04ac9f2-b9fd-4f1c-b82d-e31f5527f6a0';
      
      switch(updatedCard.column) {
        case 'todo':
          columnId = 'e04ac9f2-b9fd-4f1c-b82d-e31f5527f6a0';
          break;
        case 'in-progress':
          columnId = '123e4567-e89b-12d3-a456-426614174001';
          break;
        case 'review':
          columnId = '123e4567-e89b-12d3-a456-426614174002';
          break;
        case 'done':
          columnId = '123e4567-e89b-12d3-a456-426614174003';
          break;
      }
      
      const supabaseUpdates = {
        title: updatedCard.title,
        description: updatedCard.description,
        column_id: columnId,
        priority: updatedCard.priority,
        tags: updatedCard.tags || [],
        dependencies: [],
        subtasks_completed: updatedCard.subtasks.completed,
        subtasks_total: updatedCard.subtasks.total,
        estimated_completion_date: updatedCard.estimatedCompletionDate?.toISOString() || null
      };

      // Buscar o UUID original do card
      const originalCard = supabaseCards.find(card => {
        const numericId = Math.abs(card.id.split('-').join('').substring(0, 8).split('').reduce((a, b) => {
          return ((a << 5) - a) + b.charCodeAt(0);
        }, 0));
        return numericId === updatedCard.id;
      });

      if (originalCard) {
        await updateCard(originalCard.id, supabaseUpdates);
      }
    } catch (error) {
      console.error('Error saving card:', error);
    }
  };

  const handleCardDelete = async (cardId: number) => {
    try {
      // Buscar o UUID original do card
      const originalCard = supabaseCards.find(card => {
        const numericId = Math.abs(card.id.split('-').join('').substring(0, 8).split('').reduce((a, b) => {
          return ((a << 5) - a) + b.charCodeAt(0);
        }, 0));
        return numericId === cardId;
      });

      if (originalCard) {
        await deleteCard(originalCard.id);
      }
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  return {
    cards,
    setCards,
    handleCreateCard,
    handleCardSave,
    handleCardDelete
  };
}
