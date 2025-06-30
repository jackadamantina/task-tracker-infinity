
import { useState, useEffect } from "react";
import { useSupabaseKanban, KanbanCard } from "./useSupabaseKanban";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/types/kanban";

export function useKanbanCards() {
  const { cards: supabaseCards, createCard, updateCard, deleteCard } = useSupabaseKanban();
  const [cards, setCards] = useState<Card[]>([]);

  // Converter dados do Supabase para o formato esperado pelo frontend
  useEffect(() => {
    const convertedCards: Card[] = supabaseCards.map((card) => ({
      id: parseInt(card.id.replace(/-/g, '').substring(0, 8), 16) || Date.now(), // Converter UUID para number
      title: card.title,
      description: card.description || "",
      column: getColumnKey(card.column_id),
      priority: card.priority,
      assignee: {
        name: card.assignee?.name || "Não atribuído",
        avatar: card.assignee?.avatar || "/placeholder.svg"
      },
      attachments: card.attachments,
      subtasks: {
        completed: card.subtasks_completed,
        total: card.subtasks_total
      },
      dependencies: card.dependencies.map(dep => parseInt(dep.replace(/-/g, '').substring(0, 8), 16)).filter(Boolean),
      blocked: false,
      timeSpent: card.time_spent,
      tags: card.tags,
      startTime: card.start_time ? new Date(card.start_time) : undefined,
      completedTime: undefined,
      executionTime: 0,
      estimatedCompletionDate: card.estimated_completion_date ? new Date(card.estimated_completion_date) : undefined,
      projectId: card.project_id || 'sistema-ecommerce'
    }));
    
    setCards(convertedCards);
  }, [supabaseCards]);

  // Mapeamento de column_id para chaves do frontend
  const getColumnKey = (columnId: string | null): string => {
    if (!columnId) return 'todo';
    // Mapear baseado no título das colunas
    switch(columnId.toLowerCase()) {
      case 'backlog': return 'todo';
      case 'em progresso': return 'in-progress';
      case 'em revisão': return 'review';
      case 'concluído': return 'done';
      default: return 'todo';
    }
  };

  const getColumnId = async (columnKey: string): Promise<string> => {
    // Buscar o ID da coluna baseado no título
    const { data: columns } = await supabase.from('kanban_columns').select('id, title');
    if (!columns) return '';
    
    const columnTitleMap: { [key: string]: string } = {
      'todo': 'Backlog',
      'in-progress': 'Em Progresso',
      'review': 'Em Revisão',
      'done': 'Concluído'
    };
    
    const targetTitle = columnTitleMap[columnKey];
    const column = columns.find(col => col.title === targetTitle);
    return column?.id || '';
  };

  const handleCreateCard = async (newCardData: Omit<Card, 'id'>) => {
    try {
      console.log('Criando card:', newCardData);
      
      const columnId = await getColumnId(newCardData.column);
      console.log('Column ID encontrada:', columnId);
      
      const supabaseCardData = {
        title: newCardData.title,
        description: newCardData.description,
        column_id: columnId,
        project_id: newCardData.projectId,
        assignee_id: null, // Será implementado quando tivermos seleção de usuários
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
    } catch (error) {
      console.error('Erro ao criar card:', error);
      throw error;
    }
  };

  const handleCardSave = async (updatedCard: Card) => {
    try {
      const columnId = await getColumnId(updatedCard.column);
      
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

      await updateCard(updatedCard.id.toString(), supabaseUpdates);
    } catch (error) {
      console.error('Erro ao salvar card:', error);
    }
  };

  const handleCardDelete = async (cardId: number) => {
    try {
      await deleteCard(cardId.toString());
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
