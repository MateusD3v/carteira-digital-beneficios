'use client';

import { useState, useEffect, useCallback } from 'react';
import offlineStorage, { BenefitData, AgencyData, DocumentData } from '@/lib/offline-storage';

export interface CacheState {
  isLoading: boolean;
  isOnline: boolean;
  lastSync: Date | null;
  error: string | null;
}

export interface CacheStats {
  totalItems: number;
  storeStats: Record<string, number>;
  lastCleanup: number;
}

// Hook principal para gerenciar cache offline
export function useOfflineCache() {
  const [state, setState] = useState<CacheState>({
    isLoading: false,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    lastSync: null,
    error: null
  });

  const [stats, setStats] = useState<CacheStats | null>(null);

  // Atualizar status online/offline
  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true, error: null }));
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false }));
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // Carregar estatísticas do cache
  const loadStats = useCallback(async () => {
    try {
      const cacheStats = await offlineStorage.getCacheStats();
      setStats(cacheStats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas do cache:', error);
    }
  }, []);

  // Limpar cache expirado
  const clearExpired = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await offlineStorage.clearExpired();
      await loadStats();
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Erro ao limpar cache expirado' 
      }));
    }
  }, [loadStats]);

  // Limpar todo o cache
  const clearAllCache = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const stores = ['benefits', 'agencies', 'documents', 'notifications', 'settings'];
      
      for (const store of stores) {
        await offlineStorage.clear(store);
      }
      
      await loadStats();
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Erro ao limpar cache' 
      }));
    }
  }, [loadStats]);

  // Sincronizar dados quando voltar online
  const syncWhenOnline = useCallback(async (syncCallback: () => Promise<void>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await offlineStorage.syncWhenOnline(syncCallback);
      
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        lastSync: new Date() 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Erro na sincronização' 
      }));
    }
  }, []);

  // Carregar estatísticas na inicialização
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    ...state,
    stats,
    clearExpired,
    clearAllCache,
    syncWhenOnline,
    loadStats
  };
}

// Hook específico para benefícios
export function useBenefitsCache() {
  const [benefits, setBenefits] = useState<BenefitData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar benefícios do cache
  const loadFromCache = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const cachedBenefits = await offlineStorage.getBenefits();
      setBenefits(cachedBenefits);
    } catch (err) {
      setError('Erro ao carregar benefícios do cache');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salvar benefícios no cache
  const saveToCache = useCallback(async (benefitsData: BenefitData[]) => {
    try {
      await offlineStorage.saveBenefits(benefitsData);
      setBenefits(benefitsData);
    } catch (err) {
      setError('Erro ao salvar benefícios no cache');
      console.error(err);
    }
  }, []);

  // Obter benefício específico
  const getBenefit = useCallback(async (id: string): Promise<BenefitData | null> => {
    try {
      return await offlineStorage.getBenefit(id);
    } catch (err) {
      console.error('Erro ao obter benefício:', err);
      return null;
    }
  }, []);

  // Carregar na inicialização
  useEffect(() => {
    loadFromCache();
  }, [loadFromCache]);

  return {
    benefits,
    isLoading,
    error,
    loadFromCache,
    saveToCache,
    getBenefit
  };
}

// Hook específico para agências
export function useAgenciesCache() {
  const [agencies, setAgencies] = useState<AgencyData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar agências do cache
  const loadFromCache = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const cachedAgencies = await offlineStorage.getAgencies();
      setAgencies(cachedAgencies);
    } catch (err) {
      setError('Erro ao carregar agências do cache');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salvar agências no cache
  const saveToCache = useCallback(async (agenciesData: AgencyData[]) => {
    try {
      await offlineStorage.saveAgencies(agenciesData);
      setAgencies(agenciesData);
    } catch (err) {
      setError('Erro ao salvar agências no cache');
      console.error(err);
    }
  }, []);

  // Carregar na inicialização
  useEffect(() => {
    loadFromCache();
  }, [loadFromCache]);

  return {
    agencies,
    isLoading,
    error,
    loadFromCache,
    saveToCache
  };
}

// Hook específico para documentos
export function useDocumentsCache() {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar documentos do cache
  const loadFromCache = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const cachedDocuments = await offlineStorage.getDocuments();
      setDocuments(cachedDocuments);
    } catch (err) {
      setError('Erro ao carregar documentos do cache');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salvar documento no cache
  const saveDocument = useCallback(async (document: DocumentData) => {
    try {
      await offlineStorage.saveDocument(document);
      setDocuments(prev => [...prev.filter(d => d.id !== document.id), document]);
    } catch (err) {
      setError('Erro ao salvar documento no cache');
      console.error(err);
    }
  }, []);

  // Deletar documento do cache
  const deleteDocument = useCallback(async (id: string) => {
    try {
      await offlineStorage.deleteDocument(id);
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      setError('Erro ao deletar documento do cache');
      console.error(err);
    }
  }, []);

  // Carregar na inicialização
  useEffect(() => {
    loadFromCache();
  }, [loadFromCache]);

  return {
    documents,
    isLoading,
    error,
    loadFromCache,
    saveDocument,
    deleteDocument
  };
}

// Hook para configurações
export function useSettingsCache() {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar configurações do cache
  const loadFromCache = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const cachedSettings = await offlineStorage.getSettings();
      setSettings(cachedSettings);
    } catch (err) {
      setError('Erro ao carregar configurações do cache');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salvar configurações no cache
  const saveToCache = useCallback(async (settingsData: any) => {
    try {
      await offlineStorage.saveSettings(settingsData);
      setSettings(settingsData);
    } catch (err) {
      setError('Erro ao salvar configurações no cache');
      console.error(err);
    }
  }, []);

  // Carregar na inicialização
  useEffect(() => {
    loadFromCache();
  }, [loadFromCache]);

  return {
    settings,
    isLoading,
    error,
    loadFromCache,
    saveToCache
  };
}