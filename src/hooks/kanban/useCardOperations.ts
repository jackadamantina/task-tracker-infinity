
import { Card } from "@/types/kanban";
import { KanbanCard } from "../useSupabaseKanban";

export function useCardOperations(
  supabaseCards: KanbanCard[],
  updateCard: (cardId: string, updates: Partial<KanbanCard>) => Promise<KanbanCard>,
  deleteCard: (cardId: string) => Promise<void>
) {
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

  return { handleCardSave, handleCardDelete };
}
