import { useState } from 'react';
import { getNotifications, markAllRead } from '@/utils/notifications';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { Bell, CheckCheck } from 'lucide-react';

const dt = (d: string) => new Date(d).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

const typeStyles = {
  warning: 'bg-warning/10 border-r-warning text-warning',
    danger: 'bg-danger/10 border-r-danger text-danger',
      info: 'bg-info/10 border-r-info text-info',
        success: 'bg-success/10 border-r-success text-success',
        };

        export default function Notifications() {
          const [notifs, setNotifs] = useState(getNotifications());

            const handleMarkAllRead = () => {
                markAllRead();
                    setNotifs(getNotifications());
                      };

                        return (
                            <div className="page-container">
                                  <div className="flex items-center justify-between mb-4">
                                          <h1 className="page-title mb-0">الإشعارات</h1>
                                                  <Button variant="secondary" onClick={handleMarkAllRead}>
                                                            <CheckCheck size={16} />تعليم الكل كمقروء
                                                                    </Button>
                                                                          </div>

                                                                                {notifs.length === 0 ? (
                                                                                        <EmptyState message="لا توجد إشعارات" icon={<Bell size={64} strokeWidth={1.5} />} />
                                                                                              ) : (
                                                                                                      <div className="space-y-2">
                                                                                                                {notifs.map((n) => (
                                                                                                                            <Card key={n.id} accent className={`!border-r-4 ${typeStyles[n.type]}`}>
                                                                                                                                          <div className="flex items-start justify-between">
                                                                                                                                                          <div>
                                                                                                                                                                            <h3 className="font-semibold text-sm">{n.title}</h3>
                                                                                                                                                                                              <p className="text-small mt-1">{n.body}</p>
                                                                                                                                                                                                                <p className="text-small text-text-secondary mt-2">{dt(n.time)}</p>
                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                {!n.read && (
                                                                                                                                                                                                                                                                  <span className="w-2 h-2 rounded-full bg-primary mt-1" />
                                                                                                                                                                                                                                                                                  )}
                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                            </Card>
                                                                                                                                                                                                                                                                                                                      ))}
                                                                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                                                                    )}
                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                          );
                                                                                                                                                                                                                                                                                                                                          }