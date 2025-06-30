
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface KanbanCard {
  id: string;
  title: string;
  description: string | null;
  column_id: string | null;
  project_id: string | null;
  assignee_id: string | null;
  priority: string;
  tags: string[];
  dependencies: string[];
  attachments: number;
  subtasks_completed: number;
  subtasks_total: number;
  time_spent: number;
  estimated_completion_date: string | null;
  start_time: string | null;
  created_at: string;
  updated_at: string;
  assignee?: { name: string; avatar: string | null };
  project?: { name: string };
}

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  header_color: string;
  position: number;
}

export interface KanbanProject {
  id: string;
  name: string;
  description: string | null;
  color: string;
}

export function useSupabaseKanban() {
  const [cards, setCards] = useState<KanbanCard[]>([]);
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [projects, setProjects] = useState<KanbanProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchColumns = async () => {
    try {
      const { data, error } = await supabase
        .from('kanban_columns')
        .select('*')
        .order('position');

      if (error) throw error;
      setColumns(data || []);
    } catch (error) {
      console.error('Erro ao buscar colunas:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('name');

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
    }
  };

  const fetchCards = async () => {
    try {
      const { data, error } = await supabase
        .from('kanban_cards')
        .select(`
          *,
          system_users!assignee_id(name, avatar),
          projects(name)
        `)
        .order('created_at');

      if (error) throw error;
      
      const formattedCards = data?.map(card => ({
        ...card,
        assignee: card.system_users ? {
          name: card.system_users.name,
          avatar: card.system_users.avatar || "/placeholder.svg"
        } : undefined,
        project: card.projects
      })) || [];
      
      setCards(formattedCards);
    } catch (error) {
      console.error('Erro ao buscar cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCard = async (cardData: Omit<KanbanCard, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('kanban_cards')
        .insert([{
          title: cardData.title,
          description: cardData.description,
          column_id: cardData.column_id,
          project_id: cardData.project_id,
          assignee_id: cardData.assignee_id,
          priority: cardData.priority,
          tags: cardData.tags,
          dependencies: cardData.dependencies,
          attachments: cardData.attachments,
          subtasks_completed: cardData.subtasks_completed,
          subtasks_total: cardData.subtasks_total,
          estimated_completion_date: cardData.estimated_completion_date
        }])
        .select(`
          *,
          system_users!assignee_id(name, avatar),
          projects(name)
        `)
        .single();

      if (error) throw error;

      const formattedCard = {
        ...data,
        assignee: data.system_users ? {
          name: data.system_users.name,
          avatar: data.system_users.avatar || "/placeholder.svg"
        } : undefined,
        project: data.projects
      };

      setCards(prev => [...prev, formattedCard]);
      
      toast({
        title: "Sucesso",
        description: "Card criado com sucesso",
      });
      
      return formattedCard;
    } catch (error) {
      console.error('Erro ao criar card:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar card",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateCard = async (cardId: string, updates: Partial<KanbanCard>) => {
    try {
      const { data, error } = await supabase
        .from('kanban_cards')
        .update(updates)
        .eq('id', cardId)
        .select(`
          *,
          system_users!assignee_id(name, avatar),
          projects(name)
        `)
        .single();

      if (error) throw error;

      const formattedCard = {
        ...data,
        assignee: data.system_users ? {
          name: data.system_users.name,
          avatar: data.system_users.avatar || "/placeholder.svg"
        } : undefined,
        project: data.projects
      };

      setCards(prev => prev.map(card => 
        card.id === cardId ? formattedCard : card
      ));

      return formattedCard;
    } catch (error) {
      console.error('Erro ao atualizar card:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar card",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteCard = async (cardId: string) => {
    try {
      const { error } = await supabase
        .from('kanban_cards')
        .delete()
        .eq('id', cardId);

      if (error) throw error;

      setCards(prev => prev.filter(card => card.id !== cardId));
      
      toast({
        title: "Sucesso",
        description: "Card deletado com sucesso",
      });
    } catch (error) {
      console.error('Erro ao deletar card:', error);
      toast({
        title: "Erro",
        description: "Erro ao deletar card",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        fetchColumns(),
        fetchProjects(),
        fetchCards()
      ]);
    };

    initializeData();
  }, []);

  return {
    cards,
    columns,
    projects,
    loading,
    createCard,
    updateCard,
    deleteCard,
    refetch: fetchCards
  };
}
