
import { useSupabaseColumns } from './kanban/useSupabaseColumns';
import { useSupabaseProjects } from './kanban/useSupabaseProjects';
import { useSupabaseCards } from './kanban/useSupabaseCards';

// Re-export types for backward compatibility
export type { KanbanCard } from './kanban/useSupabaseCards';
export type { KanbanColumn } from './kanban/useSupabaseColumns';
export type { KanbanProject } from './kanban/useSupabaseProjects';

export function useSupabaseKanban() {
  const { columns, fetchColumns } = useSupabaseColumns();
  const { projects, fetchProjects } = useSupabaseProjects();
  const { cards, loading, createCard, updateCard, deleteCard, refetch } = useSupabaseCards();

  return {
    cards,
    columns,
    projects,
    loading,
    createCard,
    updateCard,
    deleteCard,
    refetch
  };
}
