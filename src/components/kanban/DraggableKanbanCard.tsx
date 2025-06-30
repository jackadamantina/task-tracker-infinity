
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KanbanCard } from './KanbanCard';
import { Card } from '@/utils/kanbanUtils';

interface DraggableKanbanCardProps {
  card: Card;
  onCardDoubleClick?: (card: Card) => void;
}

export function DraggableKanbanCard({ card, onCardDoubleClick }: DraggableKanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDoubleClick = () => {
    if (onCardDoubleClick) {
      onCardDoubleClick(card);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      <KanbanCard card={card} onDoubleClick={handleDoubleClick} />
    </div>
  );
}
