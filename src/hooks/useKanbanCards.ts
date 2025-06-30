
import { useState, useEffect } from "react";
import { useSupabaseKanban, KanbanCard } from "./useSupabaseKanban";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/types/kanban";

export function useKanbanCards() {
  const { cards: supabaseCards, createCard, updateCard, deleteCard, refetch } = useSupabaseKanban();
  const [cards, setCards] = useState<Card[]>([]);

  // Converter dados do Supabase para o formato esperado pelo frontend
  useEffect(() => {
    console.log('=== USEKANBAN CARDS: CONVERSÃO INICIADA ===');
    console.log('Supabase cards recebidos:', supabaseCards.length);
    
    if (supabaseCards.length === 0) {
      console.log('Nenhum card do Supabase, definindo array vazio');
      setCards([]);
      return;
    }

    const convertedCards: Card[] = supabaseCards.map((supabaseCard) => {
      console.log('Convertendo card:', supabaseCard.id, supabaseCard.title);
      console.log('Column ID do Supabase:', supabaseCard.column_id);
      
      // Converter UUID para ID numérico
      const numericId = parseInt(supabaseCard.id.replace(/-/g, '').substring(0, 8), 16) || Math.floor(Math.random() * 1000000);
      
      // Mapear column_id para o formato esperado
      let columnName = 'todo'; // default
      
      // Usar uma query simples para buscar o título da coluna
      supabase
        .from('kanban_columns')
        .select('title')
        .eq('id', supabaseCard.column_id)
        .single()
        .then(({ data }) => {
          if (data) {
            console.log('Título da coluna encontrado:', data.title);
          }
        });
      
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
      
      console.log('Card mapeado para coluna:', columnName);
      
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
      
      console.log('Card convertido:', convertedCard);
      return convertedCard;
    });
    
    console.log('=== RESULTADO FINAL DA CONVERSÃO ===');
    console.log('Total de cards convertidos:', convertedCards.length);
    console.log('Cards por coluna:');
    console.log('- todo:', convertedCards.filter(c => c.column === 'todo').length);
    console.log('- in-progress:', convertedCards.filter(c => c.column === 'in-progress').length);
    console.log('- review:', convertedCards.filter(c => c.column === 'review').length);
    console.log('- done:', convertedCards.filter(c => c.column === 'done').length);
    
    setCards(convertedCards);
  }, [supabaseCards]);

  const handleCreateCard = async (newCardData: Omit<Card, 'id'>) => {
    try {
      console.log('=== CRIANDO NOVO CARD ===');
      console.log('Dados recebidos:', newCardData);
      
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
      
      console.log('Column mapeada:', newCardData.column, 'para UUID:', columnId);
      
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

      console.log('Enviando para Supabase:', supabaseCardData);
      
      await createCard(supabaseCardData);
      
      console.log('Card criado com sucesso, fazendo refetch...');
      await refetch();
      
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
        const numericId = parseInt(card.id.replace(/-/g, '').substring(0, 8), 16);
        return numericId === updatedCard.id;
      });

      if (originalCard) {
        await updateCard(originalCard.id, supabaseUpdates);
      }
    } catch (error) {
      console.error('Erro ao salvar card:', error);
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
      console.error('Erro ao deletar card:', error);
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
