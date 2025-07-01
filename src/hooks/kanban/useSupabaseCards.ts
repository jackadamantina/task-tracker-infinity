
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

export function useSupabaseCards() {
  const [cards, setCards] = useState<KanbanCard[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCards = async () => {
    try {
      console.log('=== FETCH CARDS DEBUG ===');
      console.log('🔍 Iniciando busca de cards no Supabase...');
      setLoading(true);
      
      // Verificar se o cliente Supabase está configurado
      console.log('🔧 Supabase client configurado:', !!supabase);
      
      const { data, error } = await supabase
        .from('kanban_cards')
        .select(`
          *,
          system_users!assignee_id(name, avatar),
          projects(name)
        `)
        .order('created_at');

      console.log('📊 Resposta do Supabase:', { data, error });
      console.log('📈 Número de cards retornados:', data?.length || 0);

      if (error) {
        console.error('❌ Erro ao buscar cards:', error);
        console.error('❌ Detalhes do erro:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      
      const formattedCards = data?.map((card, index) => {
        console.log(`🔄 Formatando card ${index + 1}:`, {
          id: card.id,
          title: card.title,
          column_id: card.column_id,
          project_id: card.project_id,
          raw_assignee: card.system_users,
          raw_project: card.projects
        });
        
        return {
          ...card,
          assignee: card.system_users ? {
            name: card.system_users.name,
            avatar: card.system_users.avatar || "/placeholder.svg"
          } : undefined,
          project: card.projects
        };
      }) || [];
      
      console.log('✅ Cards formatados com sucesso:', formattedCards.length);
      console.log('📋 Lista de cards formatados:', formattedCards.map(card => ({
        id: card.id,
        title: card.title,
        column_id: card.column_id,
        project_id: card.project_id
      })));
      
      setCards(formattedCards);
      console.log('💾 Cards salvos no estado local');
      
    } catch (error) {
      console.error('💥 Erro crítico ao buscar cards:', error);
    } finally {
      setLoading(false);
      console.log('🏁 Busca de cards finalizada');
    }
  };

  const createCard = async (cardData: Omit<KanbanCard, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('=== CREATE CARD DEBUG ===');
      console.log('🆕 Criando card no Supabase:', cardData.title);
      console.log('📝 Dados do card para criação:', cardData);
      
      const { data, error } = await supabase
        .from('kanban_cards')
        .insert([cardData])
        .select(`
          *,
          system_users!assignee_id(name, avatar),
          projects(name)
        `)
        .single();

      console.log('📊 Resposta da criação:', { data, error });

      if (error) {
        console.error('❌ Erro ao criar card:', error);
        console.error('❌ Detalhes do erro de criação:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      const formattedCard = {
        ...data,
        assignee: data.system_users ? {
          name: data.system_users.name,
          avatar: data.system_users.avatar || "/placeholder.svg"
        } : undefined,
        project: data.projects
      };

      console.log('✅ Card criado e formatado:', formattedCard);
      
      setCards(prev => {
        console.log('📋 Cards antes da adição:', prev.length);
        const newCards = [...prev, formattedCard];
        console.log('📋 Cards após adição:', newCards.length);
        return newCards;
      });
      
      toast({
        title: "Sucesso",
        description: "Card criado com sucesso",
      });
      
      console.log('🎉 Card criado com sucesso, forçando refetch...');
      // Forçar um refetch para garantir sincronização
      setTimeout(() => {
        fetchCards();
      }, 1000);
      
      return formattedCard;
    } catch (error) {
      console.error('💥 Erro crítico ao criar card:', error);
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
      console.log('=== UPDATE CARD DEBUG ===');
      console.log('🔄 Atualizando card:', cardId);
      console.log('📝 Dados para atualização:', updates);
      
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

      console.log('📊 Resposta da atualização:', { data, error });

      if (error) {
        console.error('❌ Erro ao atualizar card:', error);
        throw error;
      }

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

      console.log('✅ Card atualizado com sucesso');
      return formattedCard;
    } catch (error) {
      console.error('💥 Erro crítico ao atualizar card:', error);
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
      console.log('=== DELETE CARD DEBUG ===');
      console.log('🗑️ Deletando card:', cardId);
      
      const { error } = await supabase
        .from('kanban_cards')
        .delete()
        .eq('id', cardId);

      console.log('📊 Resposta da deleção:', { error });

      if (error) {
        console.error('❌ Erro ao deletar card:', error);
        throw error;
      }

      setCards(prev => prev.filter(card => card.id !== cardId));
      
      toast({
        title: "Sucesso",
        description: "Card deletado com sucesso",
      });
      
      console.log('✅ Card deletado com sucesso');
    } catch (error) {
      console.error('💥 Erro crítico ao deletar card:', error);
      toast({
        title: "Erro",
        description: "Erro ao deletar card",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    console.log('🔄 useEffect do useSupabaseCards executado');
    fetchCards();
  }, []);

  // Log quando o estado de cards muda
  useEffect(() => {
    console.log('📊 Estado de cards alterado:', {
      total: cards.length,
      loading,
      cards: cards.map(card => ({ id: card.id, title: card.title }))
    });
  }, [cards, loading]);

  return {
    cards,
    loading,
    createCard,
    updateCard,
    deleteCard,
    refetch: fetchCards
  };
}
