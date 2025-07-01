
import { useState, useEffect } from "react";
import { useSupabaseKanban } from "./useSupabaseKanban";
import { Card } from "@/types/kanban";
import { useCardConversion } from "./kanban/useCardConversion";
import { useCardCreation } from "./kanban/useCardCreation";
import { useCardOperations } from "./kanban/useCardOperations";

export function useKanbanCards() {
  const { cards: supabaseCards, createCard, updateCard, deleteCard, refetch } = useSupabaseKanban();
  const [cards, setCards] = useState<Card[]>([]);

  const { convertCards } = useCardConversion(supabaseCards);
  const { handleCreateCard } = useCardCreation(createCard, refetch);
  const { handleCardSave, handleCardDelete } = useCardOperations(supabaseCards, updateCard, deleteCard);

  // Converter dados do Supabase para o formato esperado pelo frontend
  useEffect(() => {
    const convertedCards = convertCards(supabaseCards);
    setCards(convertedCards);
  }, [supabaseCards]);

  return {
    cards,
    setCards,
    handleCreateCard,
    handleCardSave,
    handleCardDelete
  };
}
