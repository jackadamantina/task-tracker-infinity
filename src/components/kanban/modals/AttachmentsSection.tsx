
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import { Upload, Trash2 } from "lucide-react";

interface AttachmentsSectionProps {
  uploadedFiles: File[];
  setUploadedFiles: (files: File[]) => void;
}

export function AttachmentsSection({ uploadedFiles, setUploadedFiles }: AttachmentsSectionProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <FormLabel>Anexos</FormLabel>
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {uploadedFiles.map((file, index) => (
          <div key={index} className="flex items-center gap-2 p-2 border rounded text-sm">
            <span className="flex-1">{file.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeFile(index)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('file-upload')?.click()}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Adicionar Arquivos
        </Button>
      </div>
    </div>
  );
}
