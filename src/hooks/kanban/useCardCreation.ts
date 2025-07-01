
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/types/kanban";
import { KanbanCard } from "../useSupabaseKanban";

export function useCardCreation(
  createCard: (cardData: Omit<KanbanCard, 'id' | 'created_at' | 'updated_at'>) => Promise<KanbanCard>,
  refetch: () => Promise<void>
) {
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

  return { handleCreateCard };
}
