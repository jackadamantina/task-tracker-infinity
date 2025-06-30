
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card } from "@/types/kanban";

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: Omit<Card, 'id'>) => void;
  columnId: string;
  projectId: string;
}

export function AddCardModal({ isOpen, onClose, onSave, columnId, projectId }: AddCardModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Média",
    assignee: "",
    estimatedCompletionDate: undefined as Date | undefined,
    tags: [] as string[],
    newTag: ""
  });

  const mockTeamMembers = [
    { name: "João Silva", avatar: "/placeholder.svg" },
    { name: "Maria Santos", avatar: "/placeholder.svg" },
    { name: "Pedro Costa", avatar: "/placeholder.svg" },
    { name: "Ana Costa", avatar: "/placeholder.svg" },
    { name: "Carlos Lima", avatar: "/placeholder.svg" }
  ];

  const handleSave = () => {
    if (!formData.title.trim()) return;

    const selectedAssignee = mockTeamMembers.find(member => member.name === formData.assignee) || mockTeamMembers[0];

    const newCard: Omit<Card, 'id'> = {
      title: formData.title,
      description: formData.description,
      column: columnId,
      priority: formData.priority,
      assignee: selectedAssignee,
      attachments: 0,
      subtasks: { completed: 0, total: 0 },
      dependencies: [],
      blocked: false,
      timeSpent: 0,
      tags: formData.tags,
      estimatedCompletionDate: formData.estimatedCompletionDate,
      projectId: projectId
    };

    onSave(newCard);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      priority: "Média",
      assignee: "",
      estimatedCompletionDate: undefined,
      tags: [],
      newTag: ""
    });
    onClose();
  };

  const addTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: ""
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Card</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Digite o título do card"
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Digite a descrição do card"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Prioridade</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Média">Média</SelectItem>
                  <SelectItem value="Baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="assignee">Responsável</Label>
              <Select value={formData.assignee} onValueChange={(value) => setFormData(prev => ({ ...prev, assignee: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um responsável" />
                </SelectTrigger>
                <SelectContent>
                  {mockTeamMembers.map((member) => (
                    <SelectItem key={member.name} value={member.name}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Data Estimada de Conclusão</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.estimatedCompletionDate ? (
                    format(formData.estimatedCompletionDate, "PPP", { locale: ptBR })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.estimatedCompletionDate}
                  onSelect={(date) => setFormData(prev => ({ ...prev, estimatedCompletionDate: date }))}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={formData.newTag}
                onChange={(e) => setFormData(prev => ({ ...prev, newTag: e.target.value }))}
                placeholder="Digite uma tag"
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button type="button" onClick={addTag} variant="outline">
                Adicionar
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm cursor-pointer hover:bg-gray-200"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ×
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!formData.title.trim()}>
              Criar Card
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
