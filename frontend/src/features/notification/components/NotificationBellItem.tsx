import type {MouseEvent} from "react";
import {CheckCircle2, ChevronDown, ChevronUp} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { NotificationResponse } from '../notification.types';
import {useState} from "react";

interface NotificationBellItemProps {
  notification: NotificationResponse;
  onClick: (type: NotificationResponse['type'], referenceId: string, id: string, isRead: boolean) => void;
  onMarkAsRead: (e: MouseEvent, id: string) => void;
}

export const NotificationBellItem = ({ notification, onClick, onMarkAsRead }: NotificationBellItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = (e: MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={cn(
        "relative flex group transition-colors border-b last:border-b-0 cursor-pointer",
        !notification.isRead ? "bg-blue-50/20 hover:bg-blue-50/60" : "bg-white hover:bg-slate-50 opacity-60 grayscale-[30%]"
      )}
      onClick={() => onClick(notification.type, notification.referenceId, notification.id, notification.isRead)}
    >
      <button
        onClick={() => onClick(notification.type, notification.referenceId, notification.id, notification.isRead)}
        className="w-full text-left flex flex-col items-start p-4 pr-10"
      >
        <div className="flex justify-between w-full mb-1">
          <span className={cn(
            "text-xs font-semibold uppercase tracking-wider",
            !notification.isRead ? "text-blue-700" : "text-slate-500"
          )}>
            Aktywność
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            {new Date(notification.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="w-full">
          <p className={cn(
            "text-sm transition-all duration-200",
            !notification.isRead ? "text-slate-900 font-medium" : "text-slate-500",
            !isExpanded && "line-clamp-2"
          )}>
            {notification.message}
          </p>

          {notification.message.length > 60 && (
            <div
              onClick={toggleExpand}
              className="mt-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
            >
              {isExpanded ? (
                <>Zwiń <ChevronUp className="h-3 w-3" /></>
              ) : (
                <>Rozwiń <ChevronDown className="h-3 w-3" /></>
              )}
            </div>
          )}
        </div>
      </button>

      {!notification.isRead && (
        <div className="absolute right-2 inset-y-0 flex items-center z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(e, notification.id);
            }}
            className={cn(
              "h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-100",
              "opacity-0 group-hover:opacity-100 transition-all transform-gpu",
              "active:translate-y-0 active:scale-90"
            )}
            title="Oznacz jako przeczytane"
          >
            <CheckCircle2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};