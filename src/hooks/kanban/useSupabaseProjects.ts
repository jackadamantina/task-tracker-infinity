
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface KanbanProject {
  id: string;
  name: string;
  description: string | null;
  color: string;
}

export function useSupabaseProjects() {
  const [projects, setProjects] = useState<KanbanProject[]>([]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    fetchProjects
  };
}
