
import { useState, useEffect } from "react";
import { useSupabaseKanban, KanbanCard } from "./useSupabaseKanban";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/types/kanban";

export function useKanbanCards() {
  const { cards: supabaseCards, createCard, updateCard, deleteCard, refetch } = useSupabaseKanban();
  const [cards, setCards] = useState<Card[]>([]);

  // Converter dados do Supabase para o formato esperado pelo frontend
  useEffect(() => {
    console.log('Converting Supabase cards to frontend format:', supabaseCards.length);
    
    const convertedCards: Card[] = supabaseCards.map((supabaseCard) => {
      // Converter UUID para ID numérico
      const numericId = parseInt(supabaseCard.id.replace(/-/g, '').substring(0, 8), 16) || Math.floor(Math.random() * 1000000);
      
      // Mapear column_id para o formato esperado
      let columnName = 'todo'; // default
      
      // Mapeamento direto baseado nos IDs conhecidos das colunas
      if (supabaseCard.column_id === 'e04ac9f2-b9fd-4f1c-b82d-e31f5527f6a0') {
        columnName = 'todo';
      } else if (supabaseCard.column_id === '123e4567-e89b-12d3-a456-426614174001') {
        columnName = 'in-progress';
      } else if (supabaseCard.column_id === '123e4567-e89b-12d3-a456-426614174002') {
        columnName = 'review';
      } else if (supabaseCard.column_id === '123e4567-e89b-12d3-a456-426614174003') {
        columnName = 'done';
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
        attachments: supabaseCard.attachments,
        subtasks: {
          completed: supabaseCard.subtasks_completed,
          total: supabaseCard.subtasks_total
        },
        dependencies: [],
        blocked: false,
        timeSpent: supabaseCard.time_spent,
        tags: supabaseCard.tags || [],
        startTime: supabaseCard.start_time ? new Date(supabaseCard.start_time) : undefined,
        completedTime: undefined,
        executionTime: 0,
        estimatedCompletionDate: supabaseCard.estimated_completion_date ? new Date(supabaseCard.estimated_completion_date) : undefined,
        projectId: supabaseCard.project_id || 'sistema-ecommerce'
      };
      
      return convertedCard;
    });
    
    console.log('Cards converted:', convertedCards.length);
    setCards(convertedCards);
  }, [supabaseCards]);

  const handleCreateCard = async (newCardData: Omit<Card, 'id'>) => {
    try {
      console.log('Creating new card:', newCardData.title);
      
      // Mapear coluna para UUID
      let columnId = 'e04ac9f2-b9fd-4f1c-b82d-e31f5527f6a0'; // default para 'todo'
      
      switch(newCardData.column) {
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
      
      // Buscar um projeto válido
      const { data: projects } = await supabase.from('projects').select('id').limit(1);
      const projectId = projects && projects.length > 0 ? projects[0].id : null;
      
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

      await createCard(supabaseCardData);
      console.log('Card created successfully');
      
    } catch (error) {
      console.error('Error creating card:', error);
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
        const numericId = parseInt(card.id.replace(/-/g, '').substring(0, 8), 16);
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
        const numericId = parseInt(card.id.replace(/-/g, '').substring(0, 8), 16);
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
