'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Bell, Check, Trash2, Info, BellRing, ExternalLink } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { toast } from 'sonner';

export default function NotificationInbox() {
  const { user } = useAuth();
  const supabase = createClient();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.is_read).length);
      }
    };

    fetchNotifications();

    const channel = supabase
      .channel('realtime_notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, (payload) => {
        setNotifications(prev => [payload.new, ...prev]);
        setUnreadCount(prev => prev + 1);
        toast('New Notification', { description: payload.new.title, icon: <BellRing className="h-4 w-4 text-purple-500" /> });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAllAsRead = async () => {
    if (!user || unreadCount === 0) return;
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const clearAll = async () => {
    if (!user) return;
    await supabase.from('notifications').delete().eq('user_id', user.id);
    setNotifications([]);
    setUnreadCount(0);
  };

  if (!user) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
          <Bell className="h-4.5 w-4.5 text-slate-600 dark:text-slate-300" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-purple-500 text-[9px] font-bold text-white flex items-center justify-center animate-pulse border-2 border-white dark:border-slate-900 shadow-md shadow-purple-500/50">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[360px] p-0 rounded-2xl shadow-2xl border-slate-200 dark:border-white/10 z-[100]">
        <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-[#0f0f0f] rounded-t-2xl">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                {unreadCount} New
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={markAllAsRead} title="Mark all as read" className="h-8 w-8 text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10">
              <Check className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={clearAll} title="Clear all" className="h-8 w-8 text-slate-500 hover:text-red-500 hover:bg-red-500/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="max-h-[400px] overflow-y-auto p-2 custom-scrollbar flex flex-col gap-1 bg-white dark:bg-[#0a0a0a] rounded-b-2xl">
          {notifications.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-3">
                <Bell className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">All caught up!</p>
              <p className="text-xs text-slate-500 mt-1">No new notifications right now.</p>
            </div>
          ) : (
            notifications.map(n => (
              <div 
                key={n.id} 
                className={`p-3 rounded-xl flex gap-3 transition-colors cursor-pointer border border-transparent ${
                  !n.is_read ? 'bg-purple-50/50 dark:bg-purple-500/10 dark:border-purple-500/20' : 'hover:bg-slate-50 dark:hover:bg-white/5 dark:border-white/5'
                }`}
                onClick={() => !n.is_read && markAsRead(n.id)}
              >
                <div className={`mt-0.5 h-8 w-8 shrink-0 rounded-full flex items-center justify-center ${
                  !n.is_read ? 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400' : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'
                }`}>
                  <Info className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className={`text-sm ${!n.is_read ? 'font-bold text-slate-900 dark:text-white' : 'font-semibold text-slate-700 dark:text-slate-300'}`}>
                    {n.title}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {n.message}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    </span>
                    {n.link && (
                      <Link href={n.link} onClick={() => setIsOpen(false)} className="text-[10px] font-black text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:underline">
                        View details <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
                {!n.is_read && (
                  <div className="h-2 w-2 mt-1 shrink-0 rounded-full bg-purple-500" />
                )}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
