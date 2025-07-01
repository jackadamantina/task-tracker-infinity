
import { useState, useEffect } from "react";
import { useSupabaseKanban } from "./useSupabaseKanban";
import { Card } from "@/types/kanban";
import { useCardConversion } from "./kanban/useCardConversion";
import { useCardCreation } from "./kanban/useCardCreation";
import { useCardOperations } from "./kanban/useCardOperations";

export function useKanbanCards() {
  console.log('🎯 useKanbanCards hook iniciado');
  
  const { cards: supabaseCards, createCard, updateCard, deleteCard, refetch } = useSupabaseKanban();
  const [cards, setCards] = useState<Card[]>([]);

  const { convertCards } = useCardConversion(supabaseCards);
  const { handleCreateCard } = useCardCreation(createCard, refetch);
  const { handleCardSave, handleCardDelete } = useCardOperations(supabaseCards, updateCard, deleteCard);

  // Log detalhado dos cards do Supabase
  useEffect(() => {
    console.log('=== SUPABASE CARDS CHANGE DEBUG ===');
    console.log('📊 Cards do Supabase alterados:', {
      total: supabaseCards.length,
      cards: supabaseCards.map(card => ({
        id: card.id,
        title: card.title,
        column_id: card.column_id,
        project_id: card.project_id
      }))
    });
    
    if (supabaseCards.length === 0) {
      console.log('⚠️ ATENÇÃO: Nenhum card retornado do Supabase!');
      console.log('🔍 Possíveis causas:');
      console.log('  1. Problema de RLS (Row Level Security)');
      console.log('  2. Usuário não autenticado');
      console.log('  3. Erro na query do Supabase');
      console.log('  4. Tabela vazia');
    }
    
    const convertedCards = convertCards(supabaseCards);
    console.log('📤 Cards convertidos:', convertedCards.length);
    
    setCards(convertedCards);
    console.log('💾 Cards salvos no estado do useKanbanCards');
    
  }, [supabaseCards, convertCards]);

  // Log quando o estado local de cards muda
  useEffect(() => {
    console.log('=== LOCAL CARDS STATE DEBUG ===');
    console.log('📊 Estado local de cards alterado:', {
      total: cards.length,
      cards: cards.map(card => ({
        id: card.id,
        title: card.title,
        column: card.column,
        projectId: card.projectId
      }))
    });
  }, [cards]);

  return {
    cards,
    setCards,
    handleCreateCard,
    handleCardSave,
    handleCardDelete
  };
}
