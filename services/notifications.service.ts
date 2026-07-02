/**
 * Notifications service for handling the bell icon and user alerts
 */

import { apiClient } from '@/utils/api-client';

class NotificationsService {
  /**
   * Get recent notifications for the logged-in user
   */
  async getNotifications(limit: number = 20) {
    const response = await apiClient.get('/notifications', { params: { limit } });
    return (response as any).data || response;
  }

  /**
   * Get only unread notifications (useful for bell icon count)
   */
  async getUnreadCount() {
    const response = await apiClient.get('/notifications/unread');
    return ((response as any).data || response).length;
  }

  /**
   * Mark a single notification as read
   */
  async markAsRead(id: string) {
    const response = await apiClient.patch(`/notifications/${id}/read`, {});
    return (response as any).data || response;
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    const response = await apiClient.patch('/notifications/read-all', {});
    return (response as any).data || response;
  }
}

export const notificationsService = new NotificationsService();
