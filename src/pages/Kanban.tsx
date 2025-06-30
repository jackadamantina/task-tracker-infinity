
import { useState, useEffect } from "react";
import { DndContext, DragEndEvent, DragOverEvent, closestCorners } from '@dnd-kit/core';
import { KanbanHeader } from "@/components/kanban/KanbanHeader";
import { DroppableKanbanColumn } from "@/components/kanban/DroppableKanbanColumn";
import { CardEditModal } from "@/components/kanban/CardEditModal";
import { 
  getCardsByColumn, 
  getCardsByProject,
  getOverdueCards,
  mockProjects, 
  defaultColumns, 
  mockCards,
  type Column,
  type Card,
  type Project
} from "@/utils/kanbanUtils";

export default function Kanban() {
  const [selectedProject, setSelectedProject] = useState(mockProjects[0].id);
  const [showColumnDialog, setShowColumnDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [columns, setColumns] = useState<Column[]>(defaultColumns);
  const [cards, setCards] = useState<Card[]>(mockCards);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [filterOverdue, setFilterOverdue] = useState(false);
  const [filterPerson, setFilterPerson] = useState("");
  const [filterTeam, setFilterTeam] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

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

    const interval = setInterval(updateTimeSpent, 60000); // Atualiza a cada minuto
    return () => clearInterval(interval);
  }, []);

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

  const handleCardDoubleClick = (card: Card) => {
    setSelectedCard(card);
    setShowCardModal(true);
  };

  const handleCardSave = (updatedCard: Card) => {
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === updatedCard.id ? updatedCard : card
      )
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id as string;

    // Se o drop foi sobre uma coluna
    if (columns.some(col => col.id === overId)) {
      setCards(prevCards => 
        prevCards.map(card => {
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
        })
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

  // Filtrar cards por projeto
  const projectCards = getCardsByProject(cards, selectedProject);
  
  // Aplicar filtros
  let filteredCards = projectCards;

  if (filterOverdue) {
    filteredCards = getOverdueCards(filteredCards);
  }

  if (filterPerson) {
    filteredCards = filteredCards.filter(card => 
      card.assignee.name === filterPerson
    );
  }

  if (filterTeam) {
    filteredCards = filteredCards.filter(card => 
      card.tags?.includes(filterTeam)
    );
  }

  if (filterStatus) {
    filteredCards = filteredCards.filter(card => 
      card.column === filterStatus
    );
  }

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
        filterOverdue={filterOverdue}
        setFilterOverdue={setFilterOverdue}
        filterPerson={filterPerson}
        setFilterPerson={setFilterPerson}
        filterTeam={filterTeam}
        setFilterTeam={setFilterTeam}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
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
              cards={getCardsByColumn(filteredCards, column.id)}
              onCardDoubleClick={handleCardDoubleClick}
            />
          ))}
        </div>
      </DndContext>

      <CardEditModal
        card={selectedCard}
        isOpen={showCardModal}
        onClose={() => {
          setShowCardModal(false);
          setSelectedCard(null);
        }}
        onSave={handleCardSave}
      />
    </div>
  );
}
