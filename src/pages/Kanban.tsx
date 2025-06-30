
import { useState } from "react";
import { DndContext, DragEndEvent, DragOverEvent, closestCorners } from '@dnd-kit/core';
import { KanbanHeader } from "@/components/kanban/KanbanHeader";
import { DroppableKanbanColumn } from "@/components/kanban/DroppableKanbanColumn";
import { 
  getCardsByColumn, 
  mockProjects, 
  defaultColumns, 
  mockCards,
  type Column,
  type Card
} from "@/utils/kanbanUtils";

export default function Kanban() {
  const [selectedProject, setSelectedProject] = useState("Sistema E-commerce");
  const [showColumnDialog, setShowColumnDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [columns, setColumns] = useState<Column[]>(defaultColumns);
  const [cards, setCards] = useState<Card[]>(mockCards);

  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      const newColumn: Column = {
        id: `col-${Date.now()}`,
        title: newColumnName,
        color: "bg-white border-gray-200",
        headerColor: "bg-gray-50"
      };
      setColumns([...columns, newColumn]);
      setNewColumnName("");
      setShowColumnDialog(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id as string;

    // Se o drop foi sobre uma coluna
    if (columns.some(col => col.id === overId)) {
      setCards(prevCards => 
        prevCards.map(card => 
          card.id === activeId 
            ? { ...card, column: overId }
            : card
        )
      );
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id;

    // Se estamos arrastando sobre uma coluna
    if (typeof overId === 'string' && columns.some(col => col.id === overId)) {
      setCards(prevCards => 
        prevCards.map(card => 
          card.id === activeId 
            ? { ...card, column: overId }
            : card
        )
      );
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <KanbanHeader
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        projects={mockProjects}
        showColumnDialog={showColumnDialog}
        setShowColumnDialog={setShowColumnDialog}
        showProjectDialog={showProjectDialog}
        setShowProjectDialog={setShowProjectDialog}
        newColumnName={newColumnName}
        setNewColumnName={setNewColumnName}
        handleAddColumn={handleAddColumn}
      />

      <DndContext 
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className={`grid gap-6 min-h-[700px]`} style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(300px, 1fr))` }}>
          {columns.map((column) => (
            <DroppableKanbanColumn
              key={column.id}
              column={column}
              cards={getCardsByColumn(cards, column.id)}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
