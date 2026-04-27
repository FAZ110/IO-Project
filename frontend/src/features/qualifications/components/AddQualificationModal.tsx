import { useState } from 'react';
import { toast } from 'sonner';
import { useAddQualificationsMutation, useSkillSuggestionsQuery } from '../qualifications.hooks';
import type { PendingSkill, QualificationResponse, SkillSuggestion } from '../qualifications.types';
import { AddQualificationModalView } from './AddQualificationModal.view';

interface AddQualificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingQualifications: QualificationResponse[];
}

export const AddQualificationModal = ({
  open,
  onOpenChange,
  existingQualifications,
}: AddQualificationModalProps) => {
  const [input, setInput] = useState('');
  const [pendingSkills, setPendingSkills] = useState<PendingSkill[]>([]);
  const [inputFocused, setInputFocused] = useState(false);

  const addMutation = useAddQualificationsMutation();
  const { data: suggestions = [] } = useSkillSuggestionsQuery(input);

  const resetAndClose = () => {
    setInput('');
    setPendingSkills([]);
    onOpenChange(false);
  };

  const handleAddPending = (skill?: PendingSkill) => {
    const name = skill?.name ?? input.trim();
    if (!name) return;

    const duplicateLocally = pendingSkills.some((s) => s.name.toLowerCase() === name.toLowerCase());
    const duplicateExisting = existingQualifications.some(
      (q) => q.name.toLowerCase() === name.toLowerCase(),
    );

    if (duplicateLocally || duplicateExisting) {
      toast.error(`Kompetencja „${name}” znajduje się już na liście.`);
      return;
    }

    setPendingSkills((previous) => [...previous, skill ?? { name }]);
    setInput('');
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddPending();
    }
  };

  const handleSuggestionSelect = (suggestion: SkillSuggestion) => {
    handleAddPending({ name: suggestion.name, id: suggestion.id });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const skillNames = pendingSkills.filter((s) => !s.id).map((s) => s.name);
    const skillIds = pendingSkills.filter((s) => s.id).map((s) => s.id!);

    addMutation.mutate(
      { skillNames, skillIds },
      { onSuccess: resetAndClose },
    );
  };

  return (
    <AddQualificationModalView
      open={open}
      onOpenChange={(isOpen) => (isOpen ? onOpenChange(true) : resetAndClose())}
      input={input}
      onInputChange={setInput}
      onInputKeyDown={handleInputKeyDown}
      pendingSkills={pendingSkills}
      onAddPending={handleAddPending}
      onRemovePending={(name) =>
        setPendingSkills((previous) => previous.filter((s) => s.name !== name))
      }
      onSubmit={handleSubmit}
      isPending={addMutation.isPending}
      suggestions={suggestions}
      showSuggestions={inputFocused && input.length >= 2}
      onSuggestionMouseDown={handleSuggestionSelect}
      onInputBlur={() => setInputFocused(false)}
      onInputFocus={() => setInputFocused(true)}
    />
  );
};
