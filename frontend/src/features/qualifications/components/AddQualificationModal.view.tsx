import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AddQualificationModalViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  input: string;
  onInputChange: (value: string) => void;
  onInputKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  pendingSkills: string[];
  onAddPending: () => void;
  onRemovePending: (skill: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  isPending: boolean;
  errorMessage: string | null;
}

export const AddQualificationModalView = ({
  open,
  onOpenChange,
  input,
  onInputChange,
  onInputKeyDown,
  pendingSkills,
  onAddPending,
  onRemovePending,
  onSubmit,
  isPending,
  errorMessage,
}: AddQualificationModalViewProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-lg">
      <DialogHeader className="gap-3">
        <DialogTitle className="text-xl font-semibold">Dodaj kompetencje</DialogTitle>
        <DialogDescription className="text-sm leading-relaxed">
          Pamiętaj, że każda kompetencja wymaga akceptacji przełożonego.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={onSubmit} className="flex flex-col gap-5 pt-2">
        <div className="flex flex-col gap-3">
          <Label htmlFor="skill" className="text-sm font-medium">Nazwa kompetencji</Label>
          <div className="flex gap-2">
            <Input
              id="skill"
              value={input}
              onChange={(event) => onInputChange(event.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Czym się zajmujesz? np. React, Scrum Master, SQL..."
              autoFocus
            />
            <Button
              type="button"
              variant="outline"
              onClick={onAddPending}
              disabled={!input.trim()}
            >
              Dodaj
            </Button>
          </div>
        </div>

        {pendingSkills.length > 0 && (
          <div className="flex flex-wrap gap-2 rounded-lg border border-dashed border-border p-3">
            {pendingSkills.map((skill) => (
              <Badge key={skill} variant="secondary" className="gap-1 pr-1">
                {skill}
                <button
                  type="button"
                  onClick={() => onRemovePending(skill)}
                  className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-background"
                  aria-label={`Usuń ${skill}`}
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Anuluj
          </Button>
          <Button type="submit" disabled={isPending || pendingSkills.length === 0}>
            {isPending ? 'Zapisywanie...' : 'Zapisz kompetencje'}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
);
