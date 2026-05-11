import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Loader2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  useInfiniteNotifications,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead
} from '../notification.hooks';
import { getNotificationUrl } from '../notification.utils';
import type { NotificationResponse } from '../notification.types';
import { NotificationListItem } from './NotificationListItem';

export const NotificationFeed = () => {
  const navigate = useNavigate();
  const [unreadOnly, setUnreadOnly] = useState(false);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteNotifications(unreadOnly);

  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllNotificationsAsRead();
  const { mutate: markAsRead } = useMarkNotificationAsRead();

  const notifications = data?.pages.flatMap(page => page.items) || [];
  const totalNotifications = data?.pages[0]?.totalCount || 0;

  const handleNotificationClick = (notification: NotificationResponse) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    navigate(getNotificationUrl(notification.type, notification.referenceId));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-6 w-6 text-slate-500" />
            Twoje powiadomienia
          </h1>
          <p className="text-muted-foreground mt-1">
            Zarządzaj swoimi alertami i prośbami systemowymi.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 rounded-lg border shadow-sm">
          <div className="flex items-center space-x-2 px-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <Label htmlFor="page-unread-filter" className="text-sm cursor-pointer">
              Tylko nieprzeczytane
            </Label>
            <Switch
              id="page-unread-filter"
              checked={unreadOnly}
              onCheckedChange={setUnreadOnly}
            />
          </div>
          <div className="w-px h-6 bg-slate-200"></div>
          <Button
            variant="ghost"
            onClick={() => markAllAsRead()}
            disabled={isMarkingAll || totalNotifications === 0}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
          >
            {isMarkingAll ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
            Oznacz wszystkie
          </Button>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Ładowanie powiadomień...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-slate-500 bg-slate-50/50">
            <Bell className="h-12 w-12 text-slate-300 mb-4" />
            <p className="text-lg font-medium text-slate-900">Brak powiadomień</p>
            <p className="text-sm mt-1">Nie masz żadnych {unreadOnly ? 'nieprzeczytanych' : 'nowych'} wiadomości.</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <NotificationListItem
                key={notification.id}
                notification={notification}
                onClick={handleNotificationClick}
                onMarkAsRead={markAsRead}
              />
            ))}
          </div>
        )}

        {hasNextPage && (
          <div className="p-4 border-t bg-slate-50 flex justify-center">
            <Button
              variant="outline"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="w-full sm:w-auto"
            >
              {isFetchingNextPage ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Ładowanie...</>
              ) : (
                'Załaduj starsze powiadomienia'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};