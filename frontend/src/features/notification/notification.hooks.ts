import { useEffect } from 'react';
import {useQuery, useMutation, useQueryClient, useInfiniteQuery} from '@tanstack/react-query';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { notificationService } from './notification.service';
import { queryKeys } from '@/api';
import { ENDPOINTS } from '@/api/endpoints';
import type { NotificationResponse } from './notification.types';
import type { PagedResponse } from '@/api/api.types';
import {API_BASE_URL, getAccessToken} from "@/api/client.ts";

export const useNotifications = (unreadOnly: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.notifications.feed(unreadOnly, 0).queryKey,
    queryFn: () => notificationService.getNotifications(unreadOnly, 0, 10),
  });
};

export const useInfiniteNotifications = (unreadOnly: boolean = true) => {
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

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications._def });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications._def });
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

            const mainFeedKey = queryKeys.notifications.feed(true, 0).queryKey;

            queryClient.setQueryData<PagedResponse<NotificationResponse>>(
              mainFeedKey,
              (oldData) => {
                if (!oldData) return oldData;
                return {
                  ...oldData,
                  items: [newNotification, ...oldData.items],
                  totalCount: oldData.totalCount + 1,
                };
              }
            );
          }
        },
        onerror(err) {
          console.error('Błąd połączenia SSE:', err);
        }
      });
    };

    connectStream();

    return () => {
      controller.abort();
    };
  }, [queryClient, getAccessToken()]);
};