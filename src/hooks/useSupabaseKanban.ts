
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
      console.log('=== BUSCANDO COLUNAS ===');
      const { data, error } = await supabase
        .from('kanban_columns')
        .select('*')
        .order('position');

      if (error) {
        console.error('Erro ao buscar colunas:', error);
        throw error;
      }
      console.log('Colunas carregadas:', data);
      setColumns(data || []);
    } catch (error) {
      console.error('Erro ao buscar colunas:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      console.log('=== BUSCANDO PROJETOS ===');
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('name');

      if (error) {
        console.error('Erro ao buscar projetos:', error);
        throw error;
      }
      console.log('Projetos carregados:', data);
      setProjects(data || []);
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
    }
  };

  const fetchCards = async () => {
    try {
      console.log('=== INICIANDO BUSCA DE CARDS ===');
      setLoading(true);
      
      const { data, error } = await supabase
        .from('kanban_cards')
        .select(`
          *,
          system_users!assignee_id(name, avatar),
          projects(name)
        `)
        .order('created_at');

      console.log('=== RESULTADO DA QUERY ===');
      console.log('Data:', data);
      console.log('Error:', error);

      if (error) {
        console.error('Erro na query:', error);
        throw error;
      }
      
      const formattedCards = data?.map(card => {
        console.log('Formatando card:', card.id, card.title);
        return {
          ...card,
          assignee: card.system_users ? {
            name: card.system_users.name,
            avatar: card.system_users.avatar || "/placeholder.svg"
          } : undefined,
          project: card.projects
        };
      }) || [];
      
      console.log('=== CARDS FORMATADOS ===');
      console.log('Total de cards formatados:', formattedCards.length);
      formattedCards.forEach(card => {
        console.log(`Card: ${card.title} | Coluna: ${card.column_id} | Projeto: ${card.project_id}`);
      });
      
      setCards(formattedCards);
    } catch (error) {
      console.error('=== ERRO AO BUSCAR CARDS ===');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCard = async (cardData: Omit<KanbanCard, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('=== CRIANDO CARD NO SUPABASE ===');
      console.log('Dados recebidos:', cardData);
      
      const { data, error } = await supabase
        .from('kanban_cards')
        .insert([cardData])
        .select(`
          *,
          system_users!assignee_id(name, avatar),
          projects(name)
        `)
        .single();

      if (error) {
        console.error('=== ERRO SQL AO CRIAR CARD ===');
        console.error('Erro:', error);
        throw error;
      }

      console.log('=== CARD CRIADO COM SUCESSO ===');
      console.log('Card retornado:', data);

      const formattedCard = {
        ...data,
        assignee: data.system_users ? {
          name: data.system_users.name,
          avatar: data.system_users.avatar || "/placeholder.svg"
        } : undefined,
        project: data.projects
      };

      console.log('=== ADICIONANDO CARD AO STATE ===');
      setCards(prev => {
        const newCards = [...prev, formattedCard];
        console.log('Total de cards após adição:', newCards.length);
        return newCards;
      });
      
      toast({
        title: "Sucesso",
        description: "Card criado com sucesso",
      });
      
      return formattedCard;
    } catch (error) {
      console.error('=== ERRO AO CRIAR CARD ===');
      console.error('Erro:', error);
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
      console.log('=== INICIALIZANDO DADOS ===');
      await Promise.all([
        fetchColumns(),
        fetchProjects(),
        fetchCards()
      ]);
      console.log('=== INICIALIZAÇÃO CONCLUÍDA ===');
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
