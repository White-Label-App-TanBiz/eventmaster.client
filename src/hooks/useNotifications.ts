import { useState, useCallback } from "react";
import { Notification } from "../components/NotificationSystem";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      id,
      ...notification,
      autoClose: notification.autoClose !== false,
      duration: notification.duration || 5000,
    };

    setNotifications((prev) => [...prev, newNotification]);
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods for different notification types
  const showSuccess = useCallback(
    (title: string, message?: string, options?: Partial<Notification>) => {
      return addNotification({ type: "success", title, message, ...options });
    },
    [addNotification],
  );

  const showError = useCallback(
    (title: string, message?: string, options?: Partial<Notification>) => {
      return addNotification({ type: "error", title, message, ...options });
    },
    [addNotification],
  );

  const showInfo = useCallback(
    (title: string, message?: string, options?: Partial<Notification>) => {
      return addNotification({ type: "info", title, message, ...options });
    },
    [addNotification],
  );

  const showWarning = useCallback(
    (title: string, message?: string, options?: Partial<Notification>) => {
      return addNotification({ type: "warning", title, message, ...options });
    },
    [addNotification],
  );

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
};
