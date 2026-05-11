import { useEffect } from 'react';
import {useQuery, useMutation, useQueryClient, useInfiniteQuery} from '@tanstack/react-query';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { notificationService } from './notification.service';
import { queryKeys } from '@/api';
import { ENDPOINTS } from '@/api/endpoints';
import { getAccessToken, API_BASE_URL } from '@/api/client';
import type { NotificationResponse } from './notification.types';
import type { PagedResponse } from '@/api/api.types';

export const useUnreadCount = () => {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount().queryKey,
    queryFn: notificationService.getUnreadCount,
    staleTime: Infinity,
  });
};

export const useNotifications = (unreadOnly: boolean, isOpen: boolean) => {
  return useQuery({
    queryKey: queryKeys.notifications.feed(unreadOnly, 0).queryKey,
    queryFn: () => notificationService.getNotifications(unreadOnly, 0, 10),
    enabled: isOpen,
    staleTime: Infinity,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.markAsRead,
    onMutate: async (notificationId) => {
      queryClient.setQueryData<number>(queryKeys.notifications.unreadCount().queryKey, (old) => Math.max(0, (old || 0) - 1));

      const allFeedKey = queryKeys.notifications.feed(false, 0).queryKey;
      queryClient.setQueryData<PagedResponse<NotificationResponse>>(allFeedKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        };
      });

      const unreadFeedKey = queryKeys.notifications.feed(true, 0).queryKey;
      queryClient.setQueryData<PagedResponse<NotificationResponse>>(unreadFeedKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.filter(n => n.id !== notificationId),
          totalCount: Math.max(0, old.totalCount - 1)
        };
      });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markAllAsRead,
    onMutate: async () => {
      queryClient.setQueryData(queryKeys.notifications.unreadCount().queryKey, 0);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications._def });
    }
  });
};

export const useInfiniteNotifications = (unreadOnly: boolean) => {
  return useInfiniteQuery({
    queryKey: queryKeys.notifications.infinite(unreadOnly).queryKey,
    queryFn: ({ pageParam = 0 }) => notificationService.getNotifications(unreadOnly, pageParam, 20),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.pageNumber < lastPage.totalPages - 1) {
        return lastPage.pageNumber + 1;
      }
      return undefined;
    },
  });
};

export const useNotificationStream = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;

    const controller = new AbortController();
    const connectStream = async () => {
      const url = `${API_BASE_URL}${ENDPOINTS.NOTIFICATIONS.STREAM}`;
      await fetchEventSource(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'text/event-stream, application/json',
        },
        signal: controller.signal,
        onmessage(ev) {
          if (ev.event === 'NOTIFICATION') {
            const newNotification: NotificationResponse = JSON.parse(ev.data);

            queryClient.setQueryData<number>(queryKeys.notifications.unreadCount().queryKey, (old) => (old || 0) + 1);

            [true, false].forEach(unreadOnly => {
              const feedKey = queryKeys.notifications.feed(unreadOnly, 0).queryKey;
              queryClient.setQueryData<PagedResponse<NotificationResponse>>(feedKey, (oldData) => {
                if (!oldData) return oldData;
                return {
                  ...oldData,
                  items: [newNotification, ...oldData.items].slice(0, 10),
                  totalCount: oldData.totalCount + 1,
                };
              });
            });
          }
        }
      });
    };

    connectStream();
    return () => controller.abort();
  }, [queryClient, getAccessToken()]);
};