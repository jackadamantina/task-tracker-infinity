
import { useState } from "react";
import { KanbanHeader } from "@/components/kanban/KanbanHeader";
import { ProjectHeader } from "@/components/kanban/ProjectHeader";
import { KanbanContainer } from "@/components/kanban/KanbanContainer";
import { CardEditModal } from "@/components/kanban/CardEditModal";
import { AddCardModal } from "@/components/kanban/AddCardModal";
import { useKanbanCards } from "@/hooks/useKanbanCards";
import { useKanbanFilters } from "@/hooks/useKanbanFilters";
import { 
  mockProjects, 
  defaultColumns, 
  type Column,
  type Card
} from "@/utils/kanbanUtils";

export default function Kanban() {
  const [selectedProject, setSelectedProject] = useState(mockProjects[0].id);
  const [showColumnDialog, setShowColumnDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [columns, setColumns] = useState<Column[]>(defaultColumns);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [selectedColumnForNewCard, setSelectedColumnForNewCard] = useState<string>("");
  const [filterOverdue, setFilterOverdue] = useState(false);
  const [filterPerson, setFilterPerson] = useState("");
  const [filterTeam, setFilterTeam] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Simulação de permissões de usuário (em produção, viria de autenticação)
  const [userRole] = useState<'admin' | 'user'>('admin'); // Para demonstração, definindo como admin

  const { 
    cards, 
    setCards, 
    handleCreateCard, 
    handleCardSave, 
    handleCardDelete 
  } = useKanbanCards();

  const filteredCards = useKanbanFilters(
    cards,
    selectedProject,
    filterOverdue,
    filterPerson,
    filterTeam,
    filterStatus
  );

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

  const handleAddCard = (columnId: string) => {
    setSelectedColumnForNewCard(columnId);
    setShowAddCardModal(true);
  };

  const handleCardDoubleClick = (card: Card) => {
    setSelectedCard(card);
    setShowCardModal(true);
  };

  // Encontrar o projeto selecionado para exibir o nome
  const currentProject = mockProjects.find(project => project.id === selectedProject);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <ProjectHeader 
        currentProject={currentProject} 
        userRole={userRole}
      />

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

      <KanbanContainer
        columns={columns}
        filteredCards={filteredCards}
        cards={cards}
        setCards={setCards}
        userRole={userRole}
        onCardDoubleClick={handleCardDoubleClick}
        onAddCard={handleAddCard}
      />

      <CardEditModal
        card={selectedCard}
        isOpen={showCardModal}
        onClose={() => {
          setShowCardModal(false);
          setSelectedCard(null);
        }}
        onSave={handleCardSave}
        onDelete={userRole === 'admin' ? handleCardDelete : undefined}
      />

      <AddCardModal
        isOpen={showAddCardModal}
        onClose={() => {
          setShowAddCardModal(false);
          setSelectedColumnForNewCard("");
        }}
        onSave={handleCreateCard}
        columnId={selectedColumnForNewCard}
        projectId={selectedProject}
      />
    </div>
  );
}
