import { renderHook, act } from '@testing-library/react'
import { useNotifications } from '../use-notifications'

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(() => JSON.stringify({
    enableBrowserNotifications: false,
    enableRecadastroAlerts: false,
    enablePaymentAlerts: false,
    enableDocumentAlerts: false,
    notificationSound: false,
    reminderDays: 7
  })),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock simplificado - apenas testamos a lógica interna do hook
describe('useNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(JSON.stringify({}))
  })

  it('inicializa com configurações padrão', () => {
    const { result } = renderHook(() => useNotifications())
    
    expect(result.current.settings).toBeDefined()
    expect(result.current.unreadCount).toBeGreaterThanOrEqual(0)
  })

  it('adiciona uma nova notificação', () => {
    const { result } = renderHook(() => useNotifications())
    
    const initialCount = result.current.notifications.length
    
    const notification = {
      id: '1',
      type: 'info' as const,
      title: 'Teste',
      message: 'Mensagem de teste',
      priority: 'medium' as const,
      category: 'sistema' as const,
      createdAt: new Date(),
      isRead: false
    }
    
    act(() => {
      result.current.addNotification(notification)
    })
    
    expect(result.current.notifications).toHaveLength(initialCount + 1)
    expect(result.current.notifications[0]).toMatchObject({
      type: notification.type,
      title: notification.title,
      message: notification.message
    })
  })

  it('marca notificação como lida', () => {
    const { result } = renderHook(() => useNotifications())
    
    const notification = {
      id: 'test-notification-2',
      type: 'warning' as const,
      title: 'Aviso',
      message: 'Mensagem de aviso',
      priority: 'high' as const,
      category: 'sistema' as const,
      createdAt: new Date(),
      isRead: false
    }
    
    act(() => {
      result.current.addNotification(notification)
    })
    
    // Encontrar a notificação que acabamos de adicionar
    const addedNotification = result.current.notifications.find(n => n.id === 'test-notification-2')
    expect(addedNotification).toBeDefined()
    
    act(() => {
      result.current.markAsRead('test-notification-2')
    })
    
    const updatedNotification = result.current.notifications.find(n => n.id === 'test-notification-2')
    expect(updatedNotification?.isRead).toBe(true)
  })

  it('remove uma notificação', () => {
    const { result } = renderHook(() => useNotifications())
    
    const initialCount = result.current.notifications.length
    
    const notification = {
      id: 'test-notification-3',
      type: 'error' as const,
      title: 'Erro',
      message: 'Mensagem de erro',
      priority: 'urgent' as const,
      category: 'sistema' as const,
      createdAt: new Date(),
      isRead: false
    }
    
    act(() => {
      result.current.addNotification(notification)
    })
    
    expect(result.current.notifications).toHaveLength(initialCount + 1)
    
    act(() => {
      result.current.removeNotification('test-notification-3')
    })
    
    expect(result.current.notifications).toHaveLength(initialCount)
    expect(result.current.notifications.find(n => n.id === 'test-notification-3')).toBeUndefined()
  })

  it('limpa todas as notificações', () => {
    const { result } = renderHook(() => useNotifications())
    
    const notification1 = {
      id: 'test-notification-4',
      type: 'info' as const,
      title: 'Teste 1',
      message: 'Mensagem 1',
      priority: 'low' as const,
      category: 'sistema' as const,
      createdAt: new Date(),
      isRead: false
    }
    
    const notification2 = {
      id: 'test-notification-5',
      type: 'warning' as const,
      title: 'Teste 2',
      message: 'Mensagem 2',
      priority: 'medium' as const,
      category: 'sistema' as const,
      createdAt: new Date(),
      isRead: false
    }
    
    act(() => {
      result.current.addNotification(notification1)
      result.current.addNotification(notification2)
    })
    
    act(() => {
      result.current.clearAllNotifications()
    })
    
    // Verificar que nossas notificações de teste foram removidas
    expect(result.current.notifications.find(n => n.id === 'test-notification-4')).toBeUndefined()
    expect(result.current.notifications.find(n => n.id === 'test-notification-5')).toBeUndefined()
  })
})