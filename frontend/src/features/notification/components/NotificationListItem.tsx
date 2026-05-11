import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { NotificationResponse } from '../notification.types';

interface NotificationListItemProps {
  notification: NotificationResponse;
  onClick: (notification: NotificationResponse) => void;
  onMarkAsRead: (id: string) => void;
}

export const NotificationListItem = ({
                                       notification,
                                       onClick,
                                       onMarkAsRead
                                     }: NotificationListItemProps) => {

  const handleMarkAsReadOnly = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkAsRead(notification.id);
  };

  return (
    <div
      className={cn(
        "relative flex group transition-colors",
        !notification.isRead ? "bg-blue-50/20 hover:bg-blue-50/60" : "bg-white hover:bg-slate-50 opacity-75"
      )}
    >
      <button
        onClick={() => onClick(notification)}
        className="w-full text-left flex flex-col sm:flex-row sm:items-center items-start p-5 pr-12 gap-4"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <span className={cn(
              "text-xs font-bold uppercase tracking-wider",
              !notification.isRead ? "text-blue-700" : "text-slate-500"
            )}>
              Aktywność
            </span>
            {!notification.isRead && (
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            )}
          </div>
          <p className={cn(
            "text-base",
            !notification.isRead ? "text-slate-900 font-medium" : "text-slate-600"
          )}>
            {notification.message}
          </p>
        </div>

        <div className="text-xs text-slate-400 font-medium whitespace-nowrap mt-2 sm:mt-0">
          {new Date(notification.createdAt).toLocaleString('pl-PL', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </button>

      {!notification.isRead && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMarkAsReadOnly}
          className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 text-slate-400 hover:text-blue-600 hover:bg-blue-100 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Oznacz jako przeczytane"
        >
          <CheckCircle2 className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};