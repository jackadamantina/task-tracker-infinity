
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  profile_id: string | null;
  group_id: string | null;
  status: string;
  avatar: string | null;
  created_at: string;
  updated_at: string;
  profiles?: { name: string };
  groups?: { name: string };
}

export function useSystemUsers() {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('system_users')
        .select(`
          *,
          profiles(name),
          groups(name)
        `)
        .order('name');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: { 
    name: string; 
    email: string; 
    profile_id?: string; 
    group_id?: string;
    avatar?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('system_users')
        .insert([userData])
        .select(`
          *,
          profiles(name),
          groups(name)
        `)
        .single();

      if (error) throw error;
      
      setUsers(prev => [...prev, data]);
      toast({
        title: "Sucesso",
        description: "Usuário criado com sucesso",
      });
      
      return data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar usuário",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    createUser,
    refetch: fetchUsers
  };
}
