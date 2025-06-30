import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { Project } from "@/utils/kanbanUtils";

interface KanbanHeaderProps {
  selectedProject: string;
  setSelectedProject: (projectId: string) => void;
  projects: Project[];
  showColumnDialog: boolean;
  setShowColumnDialog: (show: boolean) => void;
  showProjectDialog: boolean;
  setShowProjectDialog: (show: boolean) => void;
  newColumnName: string;
  setNewColumnName: (name: string) => void;
  handleAddColumn: () => void;
  filterOverdue: boolean;
  setFilterOverdue: (overdue: boolean) => void;
  filterPerson: string;
  setFilterPerson: (person: string) => void;
  filterTeam: string;
  setFilterTeam: (team: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
}

import { CycleTimeChart } from './CycleTimeChart';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PieChart } from "lucide-react";

export function KanbanHeader({
  selectedProject,
  setSelectedProject,
  projects,
  showColumnDialog,
  setShowColumnDialog,
  showProjectDialog,
  setShowProjectDialog,
  newColumnName,
  setNewColumnName,
  handleAddColumn,
  filterOverdue,
  setFilterOverdue,
  filterPerson,
  setFilterPerson,
  filterTeam,
  setFilterTeam,
  filterStatus,
  setFilterStatus
}: KanbanHeaderProps) {
  const [showCycleTimeChart, setShowCycleTimeChart] = useState(false);

  const mockTeamMembers = [
    "João Silva", "Maria Santos", "Pedro Costa", "Ana Costa", "Carlos Lima"
  ];

  const mockTeams = [
    "Frontend", "Backend", "DevOps", "QA", "Design"
  ];

  const statusOptions = [
    { value: "todo", label: "A Fazer" },
    { value: "in-progress", label: "Em Andamento" },
    { value: "review", label: "Em Revisão" },
    { value: "done", label: "Concluído" }
  ];

  return (
    <div className="space-y-4">
      {/* Header principal */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Kanban Board
          </h1>
          <p className="text-gray-600 mt-1">Gerencie suas tarefas e projetos</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Tempo de Ciclo */}
          <Dialog open={showCycleTimeChart} onOpenChange={setShowCycleTimeChart}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Tempo de Ciclo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Análise de Tempo de Ciclo</DialogTitle>
              </DialogHeader>
              <CycleTimeChart projectId={selectedProject} />
            </DialogContent>
          </Dialog>

          {/* Adicionar Coluna */}
          <Dialog open={showColumnDialog} onOpenChange={setShowColumnDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Nova Coluna
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Coluna</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Nome da coluna"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowColumnDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddColumn}>
                    Adicionar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Novo Projeto */}
          <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Projeto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Projeto</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Nome do projeto" />
                <Textarea placeholder="Descrição do projeto" />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowProjectDialog(false)}>
                    Cancelar
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Criar Projeto
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Seletor de Projeto e Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Seletor de Projeto */}
            <div>
              <label className="text-sm font-medium mb-2 block">Projeto</label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por Pessoa */}
            <div>
              <label className="text-sm font-medium mb-2 block">Pessoa</label>
              <Select value={filterPerson || "all"} onValueChange={(value) => setFilterPerson(value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por pessoa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Pessoas</SelectItem>
                  {mockTeamMembers.map((member) => (
                    <SelectItem key={member} value={member}>
                      {member}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por Time */}
            <div>
              <label className="text-sm font-medium mb-2 block">Time</label>
              <Select value={filterTeam || "all"} onValueChange={(value) => setFilterTeam(value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Times</SelectItem>
                  {mockTeams.map((team) => (
                    <SelectItem key={team} value={team}>
                      {team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por Status */}
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={filterStatus || "all"} onValueChange={(value) => setFilterStatus(value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro Atrasados */}
            <div className="flex items-end">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="overdue"
                  checked={filterOverdue}
                  onCheckedChange={setFilterOverdue}
                />
                <label
                  htmlFor="overdue"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Apenas Atrasados
                </label>
              </div>
            </div>

            {/* Limpar Filtros */}
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setFilterPerson("");
                  setFilterTeam("");
                  setFilterStatus("");
                  setFilterOverdue(false);
                }}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
