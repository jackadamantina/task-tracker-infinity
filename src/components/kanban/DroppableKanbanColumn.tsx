
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { DraggableKanbanCard } from './DraggableKanbanCard';
import { Column, Card } from '@/utils/kanbanUtils';

interface DroppableKanbanColumnProps {
  column: Column;
  cards: Card[];
  onCardDoubleClick?: (card: Card) => void;
}

export function DroppableKanbanColumn({ column, cards, onCardDoubleClick }: DroppableKanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div ref={setNodeRef} className="h-full">
      <KanbanColumn column={column} cardsCount={cards.length}>
        <SortableContext items={cards.map(card => card.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {cards.map((card) => (
              <DraggableKanbanCard
                key={card.id}
                card={{
                  ...card,
                  projectId: card.projectId || 'sistema-ecommerce' // Garantir que projectId existe
                }}
                onCardDoubleClick={onCardDoubleClick}
              />
            ))}
          </div>
        </SortableContext>
      </KanbanColumn>
    </div>
  );
}
