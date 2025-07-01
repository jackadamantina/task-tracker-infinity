
import { DroppableKanbanColumn } from "./DroppableKanbanColumn";
import { Column, Card } from "@/utils/kanbanUtils";

interface KanbanGridProps {
  columns: Column[];
  filteredCards: Card[];
  onCardDoubleClick: (card: Card) => void;
  onAddCard: (columnId: string) => void;
}

export function KanbanGrid({ columns, filteredCards, onCardDoubleClick, onAddCard }: KanbanGridProps) {
  console.log('=== KANBAN GRID DEBUG ===');
  console.log('📊 Props recebidas:', {
    columns: columns.length,
    filteredCards: filteredCards.length,
    columnsData: columns.map(col => ({ id: col.id, title: col.title })),
    cardsData: filteredCards.map(card => ({ 
      id: card.id, 
      title: card.title, 
      column: card.column 
    }))
  });

  const getCardsByColumn = (cards: Card[], columnId: string): Card[] => {
    console.log(`🔍 Buscando cards para coluna "${columnId}"`);
    
    const cardsInColumn = cards.filter(card => {
      const match = card.column === columnId;
      console.log(`  Card "${card.title}": column="${card.column}" vs columnId="${columnId}" - Match: ${match}`);
      return match;
    });
    
    console.log(`✅ Cards encontrados para coluna "${columnId}": ${cardsInColumn.length}`);
    return cardsInColumn;
  };

  console.log('🎯 Renderizando KanbanGrid...');

  return (
    <div className={`grid gap-6 min-h-[700px]`} style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(300px, 1fr))` }}>
      {columns.map((column) => {
        const columnCards = getCardsByColumn(filteredCards, column.id);
        console.log(`🏗️ Renderizando coluna "${column.title}" com ${columnCards.length} cards`);
        
        return (
          <DroppableKanbanColumn
            key={column.id}
            column={column}
            cards={columnCards}
            onCardDoubleClick={onCardDoubleClick}
            onAddCard={onAddCard}
          />
        );
      })}
    </div>
  );
}
