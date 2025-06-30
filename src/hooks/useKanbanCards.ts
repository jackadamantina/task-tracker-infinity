
import { useState, useEffect } from "react";
import { useSupabaseKanban, KanbanCard } from "./useSupabaseKanban";
import { Card } from "@/types/kanban";

export function useKanbanCards() {
  const { cards: supabaseCards, createCard, updateCard, deleteCard } = useSupabaseKanban();
  const [cards, setCards] = useState<Card[]>([]);

  // Converter dados do Supabase para o formato esperado pelo frontend
  useEffect(() => {
    const convertedCards: Card[] = supabaseCards.map((card) => ({
      id: parseInt(card.id, 10) || Date.now(), // Converter UUID para number como fallback
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
      dependencies: card.dependencies.map(dep => parseInt(dep, 10)).filter(Boolean),
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
    // Mapear baseado na posição ou título das colunas
    switch(columnId) {
      case 'backlog': return 'todo';
      case 'em-progresso': return 'in-progress';
      case 'em-revisao': return 'review';
      case 'concluido': return 'done';
      default: return 'todo';
    }
  };

  const getColumnId = (columnKey: string): string => {
    switch(columnKey) {
      case 'todo': return 'backlog';
      case 'in-progress': return 'em-progresso';
      case 'review': return 'em-revisao';
      case 'done': return 'concluido';
      default: return 'backlog';
    }
  };

  const handleCreateCard = async (newCardData: Omit<Card, 'id'>) => {
    try {
      const supabaseCardData = {
        title: newCardData.title,
        description: newCardData.description,
        column_id: getColumnId(newCardData.column),
        project_id: newCardData.projectId,
        assignee_id: null, // Será implementado quando tivermos seleção de usuários
        priority: newCardData.priority,
        tags: newCardData.tags || [],
        dependencies: newCardData.dependencies?.map(dep => dep.toString()) || [],
        attachments: newCardData.attachments,
        subtasks_completed: newCardData.subtasks.completed,
        subtasks_total: newCardData.subtasks.total,
        time_spent: newCardData.timeSpent,
        estimated_completion_date: newCardData.estimatedCompletionDate?.toISOString() || null,
        start_time: newCardData.startTime?.toISOString() || null
      };

      await createCard(supabaseCardData);
    } catch (error) {
      console.error('Erro ao criar card:', error);
    }
  };

  const handleCardSave = async (updatedCard: Card) => {
    try {
      const supabaseUpdates = {
        title: updatedCard.title,
        description: updatedCard.description,
        column_id: getColumnId(updatedCard.column),
        priority: updatedCard.priority,
        tags: updatedCard.tags || [],
        dependencies: updatedCard.dependencies?.map(dep => dep.toString()) || [],
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
