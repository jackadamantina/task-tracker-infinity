
import { DroppableKanbanColumn } from "./DroppableKanbanColumn";
import { Column, Card } from "@/utils/kanbanUtils";

interface KanbanGridProps {
  columns: Column[];
  filteredCards: Card[];
  onCardDoubleClick: (card: Card) => void;
  onAddCard: (columnId: string) => void;
}

export function KanbanGrid({ columns, filteredCards, onCardDoubleClick, onAddCard }: KanbanGridProps) {
  const getCardsByColumn = (cards: Card[], columnId: string): Card[] => {
    return cards.filter(card => card.column === columnId);
  };

  return (
    <div className={`grid gap-6 min-h-[700px]`} style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(300px, 1fr))` }}>
      {columns.map((column) => (
        <DroppableKanbanColumn
          key={column.id}
          column={column}
          cards={getCardsByColumn(filteredCards, column.id)}
          onCardDoubleClick={onCardDoubleClick}
          onAddCard={onAddCard}
        />
      ))}
    </div>
  );
}
