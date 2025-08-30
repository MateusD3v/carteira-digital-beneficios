'use client';

import React, { useState } from 'react';
import { Bell, X, Settings, CheckCheck, Trash2, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNotifications, Notification } from '@/hooks/use-notifications';
import Link from 'next/link';

interface NotificationCenterProps {
  className?: string;
}

const typeIcons = {
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
  success: CheckCircle
};

const typeColors = {
  info: 'text-blue-500',
  warning: 'text-yellow-500',
  error: 'text-red-500',
  success: 'text-green-500'
};

const priorityColors = {
  low: 'border-l-gray-400',
  medium: 'border-l-blue-400',
  high: 'border-l-yellow-400',
  urgent: 'border-l-red-500'
};

function NotificationItem({ notification, onMarkAsRead, onRemove }: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const Icon = typeIcons[notification.type];
  const timeAgo = getTimeAgo(notification.createdAt);

  return (
    <Card className={`mb-3 transition-all duration-200 hover:shadow-md border-l-4 ${
      priorityColors[notification.priority]
    } ${
      notification.isRead ? 'opacity-60' : 'bg-muted/20'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Icon className={`h-5 w-5 mt-0.5 ${typeColors[notification.type]}`} />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h4 className={`font-medium text-sm ${
                  notification.isRead ? 'text-muted-foreground' : 'text-foreground'
                }`}>
                  {notification.title}
                </h4>
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  {notification.category}
                </Badge>
                {notification.priority === 'urgent' && (
                  <Badge variant="destructive" className="text-xs animate-pulse flex-shrink-0">
                    Urgente
                  </Badge>
                )}
              </div>
              <p className={`text-sm mb-2 ${
                notification.isRead ? 'text-muted-foreground' : 'text-foreground'
              }`}>
                {notification.message}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{timeAgo}</span>
                <div className="flex items-center space-x-2">
                  {notification.actionUrl && (
                    <Link href={notification.actionUrl}>
                      <Button size="sm" variant="outline" className="text-xs h-7">
                        {notification.actionText || 'Ver Detalhes'}
                      </Button>
                    </Link>
                  )}
                  {!notification.isRead && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-7 px-2"
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs h-7 px-2 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemove(notification.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function NotificationCenter({ className }: NotificationCenterProps) {
  const {
    notifications,
    unreadCount,
    urgentCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications
  } = useNotifications();
  
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'urgent':
        return notification.priority === 'urgent' && !notification.isRead;
      default:
        return true;
    }
  });

  return (
    <div className={`relative ${className}`}>
      {/* Botão de notificações */}
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant={urgentCount > 0 ? "destructive" : "default"} 
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Painel de notificações */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Painel */}
          <Card className="absolute right-0 top-full mt-2 w-96 max-h-[80vh] z-50 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Notificações</CardTitle>
                  <CardDescription>
                    {unreadCount > 0 ? `${unreadCount} não lidas` : 'Todas lidas'}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Filtros */}
              <div className="flex flex-wrap gap-2 mt-3">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                  className="text-xs"
                >
                  Todas ({notifications.length})
                </Button>
                <Button
                  variant={filter === 'unread' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('unread')}
                  className="text-xs"
                >
                  Não lidas ({unreadCount})
                </Button>
                {urgentCount > 0 && (
                  <Button
                    variant={filter === 'urgent' ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('urgent')}
                    className="text-xs animate-pulse"
                  >
                    Urgentes ({urgentCount})
                  </Button>
                )}
              </div>
              
              {/* Ações */}
              {notifications.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {unreadCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs"
                    >
                      <CheckCheck className="h-3 w-3 mr-1" />
                      Marcar todas como lidas
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllNotifications}
                    className="text-xs text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Limpar todas
                  </Button>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto px-4 pb-4">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {filter === 'all' 
                        ? 'Nenhuma notificação'
                        : filter === 'unread'
                        ? 'Nenhuma notificação não lida'
                        : 'Nenhuma notificação urgente'
                      }
                    </p>
                  </div>
                ) : (
                  filteredNotifications.map(notification => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onRemove={removeNotification}
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

// Função auxiliar para calcular tempo decorrido
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Agora mesmo';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} min atrás`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h atrás`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d atrás`;
  }
}

// Componente para configurações de notificação
export function NotificationSettings() {
  const { settings, updateSettings, hasPermission } = useNotifications();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Configurações de Notificação</span>
        </CardTitle>
        <CardDescription>
          Personalize como você recebe alertas e lembretes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Notificações do navegador</label>
            <p className="text-xs text-muted-foreground">
              {hasPermission ? 'Permitidas' : 'Bloqueadas pelo navegador'}
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.enableBrowserNotifications && hasPermission}
            onChange={(e) => updateSettings({ enableBrowserNotifications: e.target.checked })}
            disabled={!hasPermission}
            className="rounded"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Alertas de recadastramento</label>
            <p className="text-xs text-muted-foreground">Lembretes sobre prazos de recadastro</p>
          </div>
          <input
            type="checkbox"
            checked={settings.enableRecadastroAlerts}
            onChange={(e) => updateSettings({ enableRecadastroAlerts: e.target.checked })}
            className="rounded"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Alertas de pagamento</label>
            <p className="text-xs text-muted-foreground">Notificações sobre datas de pagamento</p>
          </div>
          <input
            type="checkbox"
            checked={settings.enablePaymentAlerts}
            onChange={(e) => updateSettings({ enablePaymentAlerts: e.target.checked })}
            className="rounded"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Som de notificação</label>
            <p className="text-xs text-muted-foreground">Tocar som ao receber notificações</p>
          </div>
          <input
            type="checkbox"
            checked={settings.notificationSound}
            onChange={(e) => updateSettings({ notificationSound: e.target.checked })}
            className="rounded"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium block mb-2">
            Antecedência para lembretes (dias)
          </label>
          <input
            type="number"
            min="1"
            max="30"
            value={settings.reminderDays}
            onChange={(e) => updateSettings({ reminderDays: parseInt(e.target.value) || 7 })}
            className="w-20 px-2 py-1 border rounded text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Receber alertas {settings.reminderDays} dias antes do vencimento
          </p>
        </div>
      </CardContent>
    </Card>
  );
}