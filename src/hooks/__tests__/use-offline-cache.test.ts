import { renderHook, act } from '@testing-library/react'
import { useOfflineCache, useBenefitsCache, useAgenciesCache } from '../use-offline-cache'
import offlineStorage from '@/lib/offline-storage'

// Mock do offlineStorage
jest.mock('@/lib/offline-storage', () => ({
  __esModule: true,
  default: {
    getCacheStats: jest.fn(),
    clearExpired: jest.fn(),
    clear: jest.fn(),
    syncWhenOnline: jest.fn(),
    getBenefits: jest.fn(),
    saveBenefits: jest.fn(),
    getBenefit: jest.fn(),
    getAgencies: jest.fn(),
    saveAgencies: jest.fn()
  }
}))

// Mock do navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true
})

describe('useOfflineCache', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    // Limpar event listeners
    window.removeEventListener('online', jest.fn())
    window.removeEventListener('offline', jest.fn())
  })

  describe('estado inicial', () => {
    it('inicializa com valores padrão', () => {
      const { result } = renderHook(() => useOfflineCache())
      
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isOnline).toBe(true)
      expect(result.current.lastSync).toBeNull()
      expect(result.current.error).toBeNull()
    })

    it('carrega estatísticas na inicialização', async () => {
      const mockStats = {
        totalItems: 10,
        storeStats: { benefits: 5, agencies: 3 },
        lastCleanup: Date.now()
      }
      
      ;(offlineStorage.getCacheStats as jest.Mock).mockResolvedValue(mockStats)
      
      const { result } = renderHook(() => useOfflineCache())
      
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })
      
      expect(offlineStorage.getCacheStats).toHaveBeenCalled()
      expect(result.current.stats).toEqual(mockStats)
    })
  })

  describe('detecção de status online/offline', () => {
    it('detecta quando está online por padrão', () => {
      const { result } = renderHook(() => useOfflineCache())
      
      expect(result.current.isOnline).toBe(true)
    })

    it('atualiza status quando recebe evento offline', () => {
      const { result } = renderHook(() => useOfflineCache())
      
      act(() => {
        window.dispatchEvent(new Event('offline'))
      })
      
      expect(result.current.isOnline).toBe(false)
    })

    it('atualiza status quando recebe evento online', () => {
      const { result } = renderHook(() => useOfflineCache())
      
      // Primeiro vai para offline
      act(() => {
        window.dispatchEvent(new Event('offline'))
      })
      
      expect(result.current.isOnline).toBe(false)
      
      // Depois volta para online
      act(() => {
        window.dispatchEvent(new Event('online'))
      })
      
      expect(result.current.isOnline).toBe(true)
    })
  })

  describe('operações de limpeza', () => {
    it('limpa dados expirados', async () => {
      ;(offlineStorage.clearExpired as jest.Mock).mockResolvedValue(undefined)
      ;(offlineStorage.getCacheStats as jest.Mock).mockResolvedValue({
        totalItems: 5,
        storeStats: {},
        lastCleanup: Date.now()
      })
      
      const { result } = renderHook(() => useOfflineCache())
      
      await act(async () => {
        await result.current.clearExpired()
      })
      
      expect(offlineStorage.clearExpired).toHaveBeenCalled()
      expect(result.current.isLoading).toBe(false)
    })

    it('limpa todo o cache', async () => {
      ;(offlineStorage.clear as jest.Mock).mockResolvedValue(undefined)
      ;(offlineStorage.getCacheStats as jest.Mock).mockResolvedValue({
        totalItems: 0,
        storeStats: {},
        lastCleanup: Date.now()
      })
      
      const { result } = renderHook(() => useOfflineCache())
      
      await act(async () => {
        await result.current.clearAllCache()
      })
      
      expect(offlineStorage.clear).toHaveBeenCalledTimes(5) // 5 stores
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('sincronização', () => {
    it('executa sincronização quando online', async () => {
      const mockSyncCallback = jest.fn().mockResolvedValue(undefined)
      ;(offlineStorage.syncWhenOnline as jest.Mock).mockResolvedValue(undefined)
      
      const { result } = renderHook(() => useOfflineCache())
      
      await act(async () => {
        await result.current.syncWhenOnline(mockSyncCallback)
      })
      
      expect(offlineStorage.syncWhenOnline).toHaveBeenCalledWith(mockSyncCallback)
      expect(result.current.lastSync).toBeInstanceOf(Date)
    })
  })
})

describe('useBenefitsCache', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('carrega benefícios na inicialização', async () => {
    const mockBenefits = [
      {
        id: '1',
        name: 'Auxílio Brasil',
        status: 'ativo' as const,
        value: 600,
        lastPayment: '2024-01-20',
        nextPayment: '2024-02-20'
      }
    ]
    
    ;(offlineStorage.getBenefits as jest.Mock).mockResolvedValue(mockBenefits)
    
    const { result } = renderHook(() => useBenefitsCache())
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    
    expect(offlineStorage.getBenefits).toHaveBeenCalled()
    expect(result.current.benefits).toEqual(mockBenefits)
    expect(result.current.isLoading).toBe(false)
  })

  it('salva benefícios no cache', async () => {
    const mockBenefits = [
      {
        id: '1',
        name: 'Auxílio Brasil',
        status: 'ativo' as const,
        value: 600,
        lastPayment: '2024-01-20',
        nextPayment: '2024-02-20'
      }
    ]
    
    ;(offlineStorage.saveBenefits as jest.Mock).mockResolvedValue(undefined)
    
    const { result } = renderHook(() => useBenefitsCache())
    
    await act(async () => {
      await result.current.saveToCache(mockBenefits)
    })
    
    expect(offlineStorage.saveBenefits).toHaveBeenCalledWith(mockBenefits)
    expect(result.current.benefits).toEqual(mockBenefits)
  })

  it('obtém benefício específico', async () => {
    const mockBenefit = {
      id: '1',
      name: 'Auxílio Brasil',
      amount: 600,
      status: 'ativo' as const,
      nextPayment: new Date(),
      lastUpdate: new Date()
    }
    
    ;(offlineStorage.getBenefit as jest.Mock).mockResolvedValue(mockBenefit)
    
    const { result } = renderHook(() => useBenefitsCache())
    
    let benefit
    await act(async () => {
      benefit = await result.current.getBenefit('1')
    })
    
    expect(offlineStorage.getBenefit).toHaveBeenCalledWith('1')
    expect(benefit).toEqual(mockBenefit)
  })

})  

describe('useAgenciesCache', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('carrega agências na inicialização', async () => {
    const mockAgencies = [
      {
        id: '1',
        name: 'Caixa Econômica Federal',
        address: 'Rua das Flores, 123',
        phone: '(11) 1234-5678',
        services: ['Auxílio Brasil', 'FGTS'],
        coordinates: { lat: -23.5505, lng: -46.6333 }
      }
    ]
    
    ;(offlineStorage.getAgencies as jest.Mock).mockResolvedValue(mockAgencies)
    
    const { result } = renderHook(() => useAgenciesCache())
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    
    expect(offlineStorage.getAgencies).toHaveBeenCalled()
    expect(result.current.agencies).toEqual(mockAgencies)
    expect(result.current.isLoading).toBe(false)
  })

  it('salva agências no cache', async () => {
    const mockAgencies = [
      {
        id: '1',
        name: 'Caixa Econômica Federal',
        address: 'Rua das Flores, 123',
        phone: '(11) 1234-5678',
        services: ['Auxílio Brasil', 'FGTS'],
        coordinates: { lat: -23.5505, lng: -46.6333 }
      }
    ]
    
    ;(offlineStorage.saveAgencies as jest.Mock).mockResolvedValue(undefined)
    
    const { result } = renderHook(() => useAgenciesCache())
    
    await act(async () => {
      await result.current.saveToCache(mockAgencies)
    })
    
    expect(offlineStorage.saveAgencies).toHaveBeenCalledWith(mockAgencies)
    expect(result.current.agencies).toEqual(mockAgencies)
  })

  it('trata erro ao carregar agências', async () => {
    ;(offlineStorage.getAgencies as jest.Mock).mockRejectedValue(new Error('Erro ao carregar'))
    
    const { result } = renderHook(() => useAgenciesCache())
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    
    expect(result.current.error).toBe('Erro ao carregar agências do cache')
    expect(result.current.isLoading).toBe(false)
  })
})