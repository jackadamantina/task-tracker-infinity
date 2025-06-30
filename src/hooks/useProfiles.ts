
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Profile {
  id: string;
  name: string;
  description: string | null;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('name');

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Erro ao buscar perfis:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar perfis",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (profileData: { name: string; description?: string; permissions?: string[] }) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          name: profileData.name,
          description: profileData.description || null,
          permissions: profileData.permissions || []
        }])
        .select()
        .single();

      if (error) throw error;
      
      setProfiles(prev => [...prev, data]);
      toast({
        title: "Sucesso",
        description: "Perfil criado com sucesso",
      });
      
      return data;
    } catch (error) {
      console.error('Erro ao criar perfil:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar perfil",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return {
    profiles,
    loading,
    createProfile,
    refetch: fetchProfiles
  };
}
