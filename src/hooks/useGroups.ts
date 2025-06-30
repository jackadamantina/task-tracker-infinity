
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Group {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .order('name');

      if (error) throw error;
      setGroups(data || []);
    } catch (error) {
      console.error('Erro ao buscar grupos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar grupos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (groupData: { name: string; description?: string }) => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .insert([{
          name: groupData.name,
          description: groupData.description || null
        }])
        .select()
        .single();

      if (error) throw error;
      
      setGroups(prev => [...prev, data]);
      toast({
        title: "Sucesso",
        description: "Grupo criado com sucesso",
      });
      
      return data;
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar grupo",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return {
    groups,
    loading,
    createGroup,
    refetch: fetchGroups
  };
}
