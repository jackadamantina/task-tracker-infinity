
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Settings } from "lucide-react";

interface KanbanHeaderProps {
  selectedProject: string;
  setSelectedProject: (project: string) => void;
  projects: string[];
  showColumnDialog: boolean;
  setShowColumnDialog: (show: boolean) => void;
  showProjectDialog: boolean;
  setShowProjectDialog: (show: boolean) => void;
  newColumnName: string;
  setNewColumnName: (name: string) => void;
  handleAddColumn: () => void;
}

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
  handleAddColumn
}: KanbanHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
          Kanban Board
        </h1>
        <p className="text-gray-600 mt-1 font-medium">Gerencie suas tarefas de forma visual e eficiente</p>
      </div>
      
      <div className="flex gap-3">
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-64 border-2 border-amber-200 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-2 border-amber-200">
            {projects.map(project => (
              <SelectItem key={project} value={project} className="hover:bg-amber-50">
                {project}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
          <DialogTrigger asChild>
            <Button className="gradient-primary hover:shadow-lg transition-all duration-300">
              <Copy className="h-4 w-4 mr-2" />
              Usar como Template
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-2 border-amber-200">
            <DialogHeader>
              <DialogTitle className="text-amber-800">Criar Projeto a partir de Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="projectName">Nome do Novo Projeto</Label>
                <Input 
                  id="projectName" 
                  placeholder="Digite o nome do projeto..."
                  className="border-2 border-amber-200 focus:border-amber-400"
                />
              </div>
              <Button onClick={() => setShowProjectDialog(false)} className="gradient-primary w-full">
                Criar Projeto
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showColumnDialog} onOpenChange={setShowColumnDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-2 border-amber-300 text-amber-700 hover:bg-amber-50">
              <Settings className="h-4 w-4 mr-2" />
              Gerenciar Colunas
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-2 border-amber-200">
            <DialogHeader>
              <DialogTitle className="text-amber-800">Adicionar Nova Coluna</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="columnName">Nome da Coluna</Label>
                <Input 
                  id="columnName" 
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  placeholder="Ex: Em Teste"
                  className="border-2 border-amber-200 focus:border-amber-400"
                />
              </div>
              <Button onClick={handleAddColumn} className="gradient-primary w-full">
                Adicionar Coluna
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
