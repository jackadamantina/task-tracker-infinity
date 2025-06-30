
import { DndContext, DragEndEvent, DragOverEvent, closestCorners } from '@dnd-kit/core';
import { KanbanGrid } from './KanbanGrid';
import { Column, Card } from '@/utils/kanbanUtils';

interface KanbanContainerProps {
  columns: Column[];
  filteredCards: Card[];
  cards: Card[];
  setCards: (cards: Card[]) => void;
  userRole: 'admin' | 'user';
  onCardDoubleClick: (card: Card) => void;
  onAddCard: (columnId: string) => void;
}

export function KanbanContainer({ 
  columns, 
  filteredCards, 
  cards, 
  setCards, 
  userRole, 
  onCardDoubleClick, 
  onAddCard 
}: KanbanContainerProps) {
  const canMoveCard = (card: Card, targetColumn: string): boolean => {
    // Administradores podem mover qualquer card para qualquer coluna
    if (userRole === 'admin') {
      return true;
    }
    
    // Usuários normais seguem as regras de negócio padrão
    const columnOrder = ["todo", "in-progress", "review", "done"];
    const currentIndex = columnOrder.indexOf(card.column);
    const targetIndex = columnOrder.indexOf(targetColumn);
    
    // Permite mover apenas para a próxima coluna ou voltar uma coluna
    return Math.abs(targetIndex - currentIndex) <= 1;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id as string;

    // Se o drop foi sobre uma coluna
    if (columns.some(col => col.id === overId)) {
      const cardToMove = cards.find(card => card.id === activeId);
      
      if (cardToMove && canMoveCard(cardToMove, overId)) {
        setCards(cards.map(card => {
          if (card.id === activeId) {
            const updatedCard = { ...card, column: overId };
            
            // Se moveu para "em andamento", define startTime
            if (overId === 'in-progress' && !card.startTime) {
              updatedCard.startTime = new Date();
            }
            
            // Se moveu para "concluído", define completedTime
            if (overId === 'done' && !card.completedTime) {
              updatedCard.completedTime = new Date();
            }
            
            return updatedCard;
          }
          return card;
        }));
      } else if (cardToMove && !canMoveCard(cardToMove, overId)) {
        // Exibir mensagem de erro para usuários sem permissão
        console.log("Movimento não permitido para este usuário");
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id;

    // Se estamos arrastando sobre uma coluna
    if (typeof overId === 'string' && columns.some(col => col.id === overId)) {
      const cardToMove = cards.find(card => card.id === activeId);
      
      if (cardToMove && canMoveCard(cardToMove, overId)) {
        setCards(cards.map(card => 
          card.id === activeId 
            ? { ...card, column: overId }
            : card
        ));
      }
    }
  };

  return (
    <DndContext 
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <KanbanGrid
        columns={columns}
        filteredCards={filteredCards}
        onCardDoubleClick={onCardDoubleClick}
        onAddCard={onAddCard}
      />
    </DndContext>
  );
}
