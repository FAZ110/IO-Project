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
import type { PendingSkill, SkillSuggestion } from '../qualifications.types';

interface AddQualificationModalViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  input: string;
  onInputChange: (value: string) => void;
  onInputKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  pendingSkills: PendingSkill[];
  onAddPending: (skill?: PendingSkill) => void;
  onRemovePending: (name: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  isPending: boolean;
  suggestions: SkillSuggestion[];
  showSuggestions: boolean;
  onSuggestionMouseDown: (suggestion: SkillSuggestion) => void;
  onInputBlur: () => void;
  onInputFocus: () => void;
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
  suggestions,
  showSuggestions,
  onSuggestionMouseDown,
  onInputBlur,
  onInputFocus,
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
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Input
                id="skill"
                value={input}
                onChange={(event) => onInputChange(event.target.value)}
                onKeyDown={onInputKeyDown}
                onBlur={onInputBlur}
                onFocus={onInputFocus}
                placeholder="Czym się zajmujesz? np. React, Scrum Master, SQL..."
                autoFocus
                autoComplete="off"
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md">
                  {suggestions.map((s) => (
                    <li
                      key={s.id}
                      onMouseDown={() => onSuggestionMouseDown(s)}
                      className="cursor-pointer px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                    >
                      {s.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => onAddPending()}
              disabled={!input.trim()}
            >
              Dodaj
            </Button>
          </div>
        </div>

        {pendingSkills.length > 0 && (
          <div className="flex flex-wrap gap-2 rounded-lg border border-dashed border-border p-3">
            {pendingSkills.map((skill) => (
              <Badge key={skill.name} variant={skill.id ? 'default' : 'secondary'} className="gap-1 pr-1">
                {skill.name}
                <button
                  type="button"
                  onClick={() => onRemovePending(skill.name)}
                  className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-background"
                  aria-label={`Usuń ${skill.name}`}
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

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
