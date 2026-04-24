import { useState } from 'react';
import { useAddQualificationsMutation } from '../qualifications.hooks';
import type { QualificationResponse } from '../qualifications.types';
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
  const [pendingSkills, setPendingSkills] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const addMutation = useAddQualificationsMutation();

  const resetAndClose = () => {
    setInput('');
    setPendingSkills([]);
    setErrorMessage(null);
    onOpenChange(false);
  };

  const handleAddPending = () => {
    const name = input.trim();
    if (!name) return;

    const duplicateLocally = pendingSkills.some((skill) => skill.toLowerCase() === name.toLowerCase());
    const duplicateExisting = existingQualifications.some(
      (qualification) => qualification.name.toLowerCase() === name.toLowerCase(),
    );

    if (duplicateLocally || duplicateExisting) {
      setErrorMessage(`Kompetencja „${name}” znajduje się już na liście.`);
      return;
    }

    setPendingSkills((previous) => [...previous, name]);
    setInput('');
    setErrorMessage(null);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddPending();
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (pendingSkills.length === 0) {
      setErrorMessage('Dodaj co najmniej jedną kompetencję przed zapisem.');
      return;
    }

    addMutation.mutate(
      { skillNames: pendingSkills },
      {
        onSuccess: resetAndClose,
        onError: () => setErrorMessage('Nie udało się zapisać kompetencji. Spróbuj ponownie.'),
      },
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
      onRemovePending={(skill) =>
        setPendingSkills((previous) => previous.filter((item) => item !== skill))
      }
      onSubmit={handleSubmit}
      isPending={addMutation.isPending}
      errorMessage={errorMessage}
    />
  );
};
