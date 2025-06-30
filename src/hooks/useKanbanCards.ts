
import { useState, useEffect } from "react";
import { useSupabaseKanban, KanbanCard } from "./useSupabaseKanban";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/types/kanban";

export function useKanbanCards() {
  const { cards: supabaseCards, createCard, updateCard, deleteCard } = useSupabaseKanban();
  const [cards, setCards] = useState<Card[]>([]);
  const [columnMapping, setColumnMapping] = useState<{[key: string]: string}>({});
  const [reverseColumnMapping, setReverseColumnMapping] = useState<{[key: string]: string}>({});

  // Buscar mapeamento de colunas
  useEffect(() => {
    const fetchColumnMapping = async () => {
      try {
        const { data: columns } = await supabase.from('kanban_columns').select('id, title');
        console.log('Colunas do banco:', columns);
        
        if (columns) {
          const mapping: {[key: string]: string} = {};
          const reverseMapping: {[key: string]: string} = {};
          
          columns.forEach(col => {
            const normalizedTitle = col.title.toLowerCase().trim();
            console.log('Processando coluna:', col.title, 'normalizada:', normalizedTitle);
            
            switch(normalizedTitle) {
              case 'backlog':
                mapping[col.id] = 'todo';
                reverseMapping['todo'] = col.id;
                break;
              case 'em progresso':
                mapping[col.id] = 'in-progress';
                reverseMapping['in-progress'] = col.id;
                break;
              case 'em revisão':
                mapping[col.id] = 'review';
                reverseMapping['review'] = col.id;
                break;
              case 'concluído':
                mapping[col.id] = 'done';
                reverseMapping['done'] = col.id;
                break;
              default:
                mapping[col.id] = 'todo';
            }
          });
          
          setColumnMapping(mapping);
          setReverseColumnMapping(reverseMapping);
          console.log('Column mapping loaded:', mapping);
          console.log('Reverse column mapping:', reverseMapping);
        }
      } catch (error) {
        console.error('Erro ao buscar mapeamento de colunas:', error);
      }
    };

    fetchColumnMapping();
  }, []);

  // Converter dados do Supabase para o formato esperado pelo frontend
  useEffect(() => {
    if (Object.keys(columnMapping).length === 0) return; // Esperar o mapeamento ser carregado

    const convertedCards: Card[] = supabaseCards.map((card) => {
      // Gerar ID numérico baseado no UUID
      const numericId = parseInt(card.id.replace(/-/g, '').substring(0, 8), 16) || Math.floor(Math.random() * 1000000);
      
      return {
        id: numericId,
        title: card.title,
        description: card.description || "",
        column: columnMapping[card.column_id || ''] || 'todo',
        priority: card.priority,
        assignee: {
          name: card.assignee?.name || "Não atribuído",
          avatar: card.assignee?.avatar || "/placeholder.svg"
        },
        attachments: card.attachments,
        subtasks: {
          completed: card.subtasks_completed,
          total: card.subtasks_total
        },
        dependencies: card.dependencies.map(dep => parseInt(dep.replace(/-/g, '').substring(0, 8), 16)).filter(Boolean),
        blocked: false,
        timeSpent: card.time_spent,
        tags: card.tags,
        startTime: card.start_time ? new Date(card.start_time) : undefined,
        completedTime: undefined,
        executionTime: 0,
        estimatedCompletionDate: card.estimated_completion_date ? new Date(card.estimated_completion_date) : undefined,
        projectId: card.project_id || 'default-project'
      };
    });
    
    console.log('Cards convertidos:', convertedCards);
    setCards(convertedCards);
  }, [supabaseCards, columnMapping]);

  const handleCreateCard = async (newCardData: Omit<Card, 'id'>) => {
    try {
      console.log('Criando card:', newCardData);
      
      // Buscar ID da coluna usando o mapeamento reverso
      const columnId = reverseColumnMapping[newCardData.column];
      
      if (!columnId) {
        console.error('Coluna não encontrada:', newCardData.column);
        throw new Error(`Coluna não encontrada: ${newCardData.column}`);
      }
      
      console.log('Column ID encontrada:', columnId);
      
      // Buscar um projeto válido
      const { data: projects } = await supabase.from('projects').select('id').limit(1);
      const projectId = projects && projects.length > 0 ? projects[0].id : null;
      
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
    } catch (error) {
      console.error('Erro ao criar card:', error);
      throw error;
    }
  };

  const handleCardSave = async (updatedCard: Card) => {
    try {
      const columnId = reverseColumnMapping[updatedCard.column];
      
      if (!columnId) {
        console.error('Coluna não encontrada para update:', updatedCard.column);
        return;
      }
      
      const supabaseUpdates = {
        title: updatedCard.title,
        description: updatedCard.description,
        column_id: columnId,
        priority: updatedCard.priority,
        tags: updatedCard.tags || [],
        dependencies: [],
        subtasks_completed: updatedCard.subtasks.completed,
        subtasks_total: updatedCard.subtasks.total,
        estimated_completion_date: updatedCard.estimatedCompletionDate?.toISOString() || null
      };

      // Buscar o UUID original do card
      const originalCard = supabaseCards.find(card => {
        const numericId = parseInt(card.id.replace(/-/g, '').substring(0, 8), 16);
        return numericId === updatedCard.id;
      });

      if (originalCard) {
        await updateCard(originalCard.id, supabaseUpdates);
      }
    } catch (error) {
      console.error('Erro ao salvar card:', error);
    }
  };

  const handleCardDelete = async (cardId: number) => {
    try {
      // Buscar o UUID original do card
      const originalCard = supabaseCards.find(card => {
        const numericId = parseInt(card.id.replace(/-/g, '').substring(0, 8), 16);
        return numericId === cardId;
      });

      if (originalCard) {
        await deleteCard(originalCard.id);
      }
    } catch (error) {
      console.error('Erro ao deletar card:', error);
    }
  };

  return {
    cards,
    setCards,
    handleCreateCard,
    handleCardSave,
    handleCardDelete
  };
}
