
import { useState, useEffect } from "react";
import { Card, mockCards } from "@/utils/kanbanUtils";

export function useKanbanCards() {
  const [cards, setCards] = useState<Card[]>(mockCards);

  // Função para calcular tempo gasto automaticamente
  useEffect(() => {
    const updateTimeSpent = () => {
      setCards(prevCards => 
        prevCards.map(card => {
          if (card.column === 'in-progress' && card.startTime) {
            const now = new Date();
            const hoursSpent = Math.floor((now.getTime() - card.startTime.getTime()) / (1000 * 60 * 60));
            return { ...card, timeSpent: hoursSpent };
          }
          return card;
        })
      );
    };

    const interval = setInterval(updateTimeSpent, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateCard = (newCardData: Omit<Card, 'id'>) => {
    const newCard: Card = {
      ...newCardData,
      id: Date.now() // Em produção, seria gerado pelo backend
    };
    setCards(prevCards => [...prevCards, newCard]);
  };

  const handleCardSave = (updatedCard: Card) => {
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === updatedCard.id ? updatedCard : card
      )
    );
  };

  const handleCardDelete = (cardId: number) => {
    setCards(prevCards => prevCards.filter(card => card.id !== cardId));
    console.log(`Card ${cardId} deletado pelo administrador`);
  };

  return {
    cards,
    setCards,
    handleCreateCard,
    handleCardSave,
    handleCardDelete
  };
}
