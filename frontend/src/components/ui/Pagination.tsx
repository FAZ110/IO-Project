import { Button } from './Button';

interface PaginationProps {
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

export const Pagination = ({ page, totalPages, hasNext, hasPrevious, onNext, onPrevious }: PaginationProps) => (
  <div className="flex items-center justify-between text-sm text-gray-600">
    <span>Strona {page + 1} z {totalPages}</span>
    <div className="flex gap-2">
      <Button variant="ghost" onClick={onPrevious} disabled={!hasPrevious}>Poprzednia</Button>
      <Button variant="ghost" onClick={onNext} disabled={!hasNext}>Następna</Button>
    </div>
  </div>
);
