// تخزين الإشعارات
interface Notification {
  id: string;
    title: string;
      body: string;
        type: 'warning' | 'danger' | 'info' | 'success';
          time: string;
            read: boolean;
            }

            export function getNotifications(): Notification[] {
              return JSON.parse(localStorage.getItem('bakala-notifications') || '[]');
              }

              export function addNotification(notif: Omit<Notification, 'id' | 'time' | 'read'>) {
                const notifications = getNotifications();
                  notifications.unshift({
                      ...notif,
                          id: Date.now().toString(),
                              time: new Date().toISOString(),
                                  read: false,
                                    });
                                      // نحتفظ بآخر 50 إشعار فقط
                                        if (notifications.length > 50) notifications.pop();
                                          localStorage.setItem('bakala-notifications', JSON.stringify(notifications));
                                          }

                                          export function markAllRead() {
                                            const notifications = getNotifications();
                                              const updated = notifications.map(n => ({ ...n, read: true }));
                                                localStorage.setItem('bakala-notifications', JSON.stringify(updated));
                                                }

                                                export function getUnreadCount(): number {
                                                  return getNotifications().filter(n => !n.read).length;
                                                  }