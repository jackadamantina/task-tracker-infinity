
import { useState } from "react";
import { KanbanHeader } from "@/components/kanban/KanbanHeader";
import { KanbanColumn } from "@/components/kanban/KanbanColumn";
import { 
  getCardsByColumn, 
  mockProjects, 
  defaultColumns, 
  mockCards,
  type Column
} from "@/utils/kanbanUtils";

export default function Kanban() {
  const [selectedProject, setSelectedProject] = useState("Sistema E-commerce");
  const [showColumnDialog, setShowColumnDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [columns, setColumns] = useState<Column[]>(defaultColumns);

  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      const newColumn: Column = {
        id: `col-${Date.now()}`,
        title: newColumnName,
        color: "bg-gray-50 border-gray-200",
        headerColor: "bg-gray-100"
      };
      setColumns([...columns, newColumn]);
      setNewColumnName("");
      setShowColumnDialog(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-amber-50 min-h-screen">
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

      {/* Kanban Board */}
      <div className={`grid gap-6 min-h-[700px]`} style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(320px, 1fr))` }}>
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            cards={getCardsByColumn(mockCards, column.id)}
          />
        ))}
      </div>
    </div>
  );
}
