
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  header_color: string;
  position: number;
}

export function useSupabaseColumns() {
  const [columns, setColumns] = useState<KanbanColumn[]>([]);

  const fetchColumns = async () => {
    try {
      const { data, error } = await supabase
        .from('kanban_columns')
        .select('*')
        .order('position');

      if (error) {
        console.error('Error fetching columns:', error);
        throw error;
      }
      setColumns(data || []);
    } catch (error) {
      console.error('Error fetching columns:', error);
    }
  };

  useEffect(() => {
    fetchColumns();
  }, []);

  return {
    columns,
    fetchColumns
  };
}
