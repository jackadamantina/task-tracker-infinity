
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { X, Plus } from "lucide-react";

interface TagsSectionProps {
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  availableTags: string[];
}

export function TagsSection({ selectedTags, setSelectedTags, availableTags }: TagsSectionProps) {
  const [newTag, setNewTag] = useState("");

  const addTag = (tag: string) => {
    if (tag.trim() && !selectedTags.includes(tag.trim())) {
      setSelectedTags([...selectedTags, tag.trim()]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-3">
      <FormLabel>Tags</FormLabel>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tag, index) => (
          <Badge key={index} variant="outline" className="flex items-center gap-1 bg-gray-50">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 text-gray-500 hover:text-red-500"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2 mb-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Nova tag"
          className="flex-1"
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(newTag), setNewTag(""))}
        />
        <Button type="button" onClick={() => { addTag(newTag); setNewTag(""); }} size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-1">
        {availableTags.filter(tag => !selectedTags.includes(tag)).map(tag => (
          <Badge 
            key={tag} 
            variant="outline" 
            className="cursor-pointer hover:bg-blue-50 text-xs"
            onClick={() => addTag(tag)}
          >
            + {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
