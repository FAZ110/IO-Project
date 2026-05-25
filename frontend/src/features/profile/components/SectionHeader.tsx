import type { LucideIcon } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

export type SectionAccent = 'blue' | 'emerald' | 'purple' | 'amber' | 'rose';

const ACCENT: Record<SectionAccent, { bg: string; text: string; ring: string }> = {
  blue:    { bg: 'bg-gradient-to-br from-blue-500 to-indigo-600',     text: 'text-white', ring: 'ring-blue-100' },
  emerald: { bg: 'bg-gradient-to-br from-emerald-500 to-teal-600',    text: 'text-white', ring: 'ring-emerald-100' },
  purple:  { bg: 'bg-gradient-to-br from-purple-500 to-fuchsia-600',  text: 'text-white', ring: 'ring-purple-100' },
  amber:   { bg: 'bg-gradient-to-br from-amber-500 to-orange-600',    text: 'text-white', ring: 'ring-amber-100' },
  rose:    { bg: 'bg-gradient-to-br from-rose-500 to-pink-600',       text: 'text-white', ring: 'ring-rose-100' },
};

interface SectionHeaderProps {
  icon: LucideIcon;
  accent?: SectionAccent;
  title: string;
  description: string;
  isOpen: boolean;
  badge?: React.ReactNode;
}

export const SectionHeader = ({
  icon: Icon,
  accent = 'blue',
  title,
  description,
  isOpen,
  badge,
}: SectionHeaderProps) => {
  const a = ACCENT[accent];

  return (
    <CardHeader className="flex flex-row items-start justify-between gap-4">
      <CollapsibleTrigger className="flex min-w-0 flex-1 cursor-pointer items-start gap-3 rounded-lg text-left transition-colors hover:bg-muted/40">
        <div className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl shadow-sm ring-4', a.bg, a.text, a.ring)}>
          <Icon className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">{title}</CardTitle>
            {badge}
            <ChevronDown
              className={cn('size-4 shrink-0 text-muted-foreground transition-transform', isOpen && 'rotate-180')}
            />
          </div>
          <CardDescription>{description}</CardDescription>
        </div>
      </CollapsibleTrigger>
    </CardHeader>
  );
};
