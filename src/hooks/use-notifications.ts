'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'recadastro' | 'pagamento' | 'documento' | 'sistema';
  createdAt: Date;
  expiresAt?: Date;
  isRead: boolean;
  actionUrl?: string;
  actionText?: string;
}

interface NotificationSettings {
  enableBrowserNotifications: boolean;
  enableRecadastroAlerts: boolean;
  enablePaymentAlerts: boolean;
  enableDocumentAlerts: boolean;
  notificationSound: boolean;
  reminderDays: number; // Dias antes do vencimento para alertar
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enableBrowserNotifications: true,
  enableRecadastroAlerts: true,
  enablePaymentAlerts: true,
  enableDocumentAlerts: true,
  notificationSound: false,
  reminderDays: 7
};

// Dados mockados de benefícios com datas de recadastro
const MOCK_BENEFITS = [
  {
    id: '1',
    name: 'Auxílio Brasil',
    nextRecadastro: new Date('2024-03-15'),
    status: 'ativo'
  },
  {
    id: '2',
    name: 'BPC',
    nextRecadastro: new Date('2024-02-28'),
    status: 'ativo'
  },
  {
    id: '3',
    name: 'Seguro Defeso',
    nextRecadastro: new Date('2024-04-10'),
    status: 'pendente'
  }
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [hasPermission, setHasPermission] = useState(false);

  // Verificar permissão para notificações do navegador
  useEffect(() => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setHasPermission(true);
      } else if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setHasPermission(permission === 'granted');
        });
      }
    }
  }, []);

  // Carregar configurações do localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('notification-settings');
    if (savedSettings) {
      setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
    }

    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications).map((n: any) => ({
        ...n,
        createdAt: new Date(n.createdAt),
        expiresAt: n.expiresAt ? new Date(n.expiresAt) : undefined
      }));
      setNotifications(parsed);
    }
  }, []);

  // Salvar notificações no localStorage
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Gerar notificações automáticas baseadas em datas de recadastro
  useEffect(() => {
    if (!settings.enableRecadastroAlerts) return;

    const checkRecadastro = () => {
      const now = new Date();
      const reminderDate = new Date();
      reminderDate.setDate(now.getDate() + settings.reminderDays);

      MOCK_BENEFITS.forEach(benefit => {
        const existingNotification = notifications.find(
          n => n.category === 'recadastro' && n.message.includes(benefit.name)
        );

        if (!existingNotification && benefit.nextRecadastro <= reminderDate) {
          const daysUntil = Math.ceil(
            (benefit.nextRecadastro.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );

          let priority: Notification['priority'] = 'medium';
          if (daysUntil <= 3) priority = 'urgent';
          else if (daysUntil <= 7) priority = 'high';

          const notification: Notification = {
            id: `recadastro-${benefit.id}-${Date.now()}`,
            title: 'Recadastramento Necessário',
            message: `Seu ${benefit.name} precisa ser recadastrado em ${daysUntil} dias (${benefit.nextRecadastro.toLocaleDateString('pt-BR')})`,
            type: daysUntil <= 3 ? 'error' : daysUntil <= 7 ? 'warning' : 'info',
            priority,
            category: 'recadastro',
            createdAt: now,
            expiresAt: benefit.nextRecadastro,
            isRead: false,
            actionUrl: '/beneficios',
            actionText: 'Ver Detalhes'
          };

          addNotification(notification);
        }
      });
    };

    checkRecadastro();
    const interval = setInterval(checkRecadastro, 24 * 60 * 60 * 1000); // Verificar diariamente

    return () => clearInterval(interval);
  }, [settings.enableRecadastroAlerts, settings.reminderDays, notifications]);

  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);

    // Mostrar notificação do navegador se habilitado
    if (settings.enableBrowserNotifications && hasPermission) {
      try {
        new Notification(notification.title, {
          body: notification.message,
          tag: notification.id,
          requireInteraction: notification.priority === 'urgent'
        });
      } catch (error) {
        console.warn('Erro ao mostrar notificação do navegador:', error);
      }
    }

    // Tocar som se habilitado
    if (settings.notificationSound) {
      try {
        // Criar um som simples usando Web Audio API
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const audioContext = new AudioContextClass();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
        }
      } catch (error) {
        console.warn('Erro ao reproduzir som de notificação:', error);
      }
    }
  }, [settings.enableBrowserNotifications, settings.notificationSound, hasPermission]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('notification-settings', JSON.stringify(updated));
  }, [settings]);

  // Limpar notificações expiradas
  useEffect(() => {
    const cleanupExpired = () => {
      const now = new Date();
      setNotifications(prev => 
        prev.filter(n => !n.expiresAt || n.expiresAt > now)
      );
    };

    const interval = setInterval(cleanupExpired, 60 * 60 * 1000); // Verificar a cada hora
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const urgentCount = notifications.filter(n => !n.isRead && n.priority === 'urgent').length;

  return {
    notifications,
    settings,
    hasPermission,
    unreadCount,
    urgentCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    updateSettings
  };
}