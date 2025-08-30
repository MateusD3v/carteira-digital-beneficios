'use client';

// Sistema de cache offline usando IndexedDB

export interface CacheItem<T = any> {
  id: string;
  data: T;
  timestamp: number;
  expiresAt?: number;
  version: string;
}

export interface BenefitData {
  id: string;
  name: string;
  status: 'ativo' | 'suspenso' | 'cancelado';
  value: number;
  lastPayment: string;
  nextPayment: string;
  recadastroDate?: string;
}

export interface AgencyData {
  id: string;
  name: string;
  address: string;
  phone: string;
  services: string[];
  coordinates: { lat: number; lng: number };
  distance?: number;
}

export interface DocumentData {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadDate: string;
  size: number;
}

class OfflineStorage {
  private dbName = 'social-benefits-cache';
  private version = 1;
  private db: IDBDatabase | null = null;

  // Stores disponíveis
  private stores = {
    benefits: 'benefits',
    agencies: 'agencies', 
    documents: 'documents',
    notifications: 'notifications',
    settings: 'settings',
    userProfile: 'userProfile'
  };

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('IndexedDB não disponível no servidor'));
        return;
      }

      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(new Error('Erro ao abrir IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Criar stores se não existirem
        Object.values(this.stores).forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: 'id' });
            store.createIndex('timestamp', 'timestamp', { unique: false });
            store.createIndex('expiresAt', 'expiresAt', { unique: false });
          }
        });
      };
    });
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) {
      throw new Error('Banco de dados não inicializado');
    }
    return this.db;
  }

  // Método genérico para salvar dados
  async set<T>(storeName: string, id: string, data: T, expiresInMs?: number): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    const cacheItem: CacheItem<T> = {
      id,
      data,
      timestamp: Date.now(),
      expiresAt: expiresInMs ? Date.now() + expiresInMs : undefined,
      version: this.version.toString()
    };

    return new Promise((resolve, reject) => {
      const request = store.put(cacheItem);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Erro ao salvar dados'));
    });
  }

  // Método genérico para recuperar dados
  async get<T>(storeName: string, id: string): Promise<T | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.get(id);
      
      request.onsuccess = () => {
        const result = request.result as CacheItem<T> | undefined;
        
        if (!result) {
          resolve(null);
          return;
        }

        // Verificar se expirou
        if (result.expiresAt && Date.now() > result.expiresAt) {
          this.delete(storeName, id); // Remove item expirado
          resolve(null);
          return;
        }

        resolve(result.data);
      };
      
      request.onerror = () => reject(new Error('Erro ao recuperar dados'));
    });
  }

  // Método para recuperar todos os itens de um store
  async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      
      request.onsuccess = () => {
        const results = request.result as CacheItem<T>[];
        const now = Date.now();
        
        // Filtrar itens não expirados
        const validItems = results
          .filter(item => !item.expiresAt || now <= item.expiresAt)
          .map(item => item.data);
        
        resolve(validItems);
      };
      
      request.onerror = () => reject(new Error('Erro ao recuperar todos os dados'));
    });
  }

  // Método para deletar um item
  async delete(storeName: string, id: string): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Erro ao deletar dados'));
    });
  }

  // Método para limpar um store
  async clear(storeName: string): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Erro ao limpar store'));
    });
  }

  // Método para limpar itens expirados
  async clearExpired(): Promise<void> {
    const db = await this.ensureDB();
    const now = Date.now();

    for (const storeName of Object.values(this.stores)) {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const index = store.index('expiresAt');
      
      const range = IDBKeyRange.upperBound(now);
      const request = index.openCursor(range);
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
    }
  }

  // Métodos específicos para benefícios
  async saveBenefits(benefits: BenefitData[]): Promise<void> {
    const promises = benefits.map(benefit => 
      this.set(this.stores.benefits, benefit.id, benefit, 24 * 60 * 60 * 1000) // 24 horas
    );
    await Promise.all(promises);
  }

  async getBenefits(): Promise<BenefitData[]> {
    return this.getAll<BenefitData>(this.stores.benefits);
  }

  async getBenefit(id: string): Promise<BenefitData | null> {
    return this.get<BenefitData>(this.stores.benefits, id);
  }

  // Métodos específicos para agências
  async saveAgencies(agencies: AgencyData[]): Promise<void> {
    const promises = agencies.map(agency => 
      this.set(this.stores.agencies, agency.id, agency, 7 * 24 * 60 * 60 * 1000) // 7 dias
    );
    await Promise.all(promises);
  }

  async getAgencies(): Promise<AgencyData[]> {
    return this.getAll<AgencyData>(this.stores.agencies);
  }

  // Métodos específicos para documentos
  async saveDocument(document: DocumentData): Promise<void> {
    await this.set(this.stores.documents, document.id, document); // Sem expiração
  }

  async getDocuments(): Promise<DocumentData[]> {
    return this.getAll<DocumentData>(this.stores.documents);
  }

  async deleteDocument(id: string): Promise<void> {
    await this.delete(this.stores.documents, id);
  }

  // Métodos para configurações
  async saveSettings(settings: any): Promise<void> {
    await this.set(this.stores.settings, 'user-settings', settings);
  }

  async getSettings(): Promise<any> {
    return this.get(this.stores.settings, 'user-settings');
  }

  // Método para obter estatísticas do cache
  async getCacheStats(): Promise<{
    totalItems: number;
    storeStats: Record<string, number>;
    lastCleanup: number;
  }> {
    const db = await this.ensureDB();
    const stats: Record<string, number> = {};
    let totalItems = 0;

    for (const storeName of Object.values(this.stores)) {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      const count = await new Promise<number>((resolve) => {
        const request = store.count();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(0);
      });
      
      stats[storeName] = count;
      totalItems += count;
    }

    return {
      totalItems,
      storeStats: stats,
      lastCleanup: Date.now()
    };
  }

  // Método para verificar se está online
  isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  // Método para sincronizar dados quando voltar online
  async syncWhenOnline(callback: () => Promise<void>): Promise<void> {
    if (this.isOnline()) {
      await callback();
    } else {
      // Aguardar conexão
      const handleOnline = async () => {
        window.removeEventListener('online', handleOnline);
        await callback();
      };
      window.addEventListener('online', handleOnline);
    }
  }
}

// Instância singleton
const offlineStorage = new OfflineStorage();

// Inicializar automaticamente quando possível
if (typeof window !== 'undefined') {
  offlineStorage.init().catch(console.error);
  
  // Limpar itens expirados periodicamente
  setInterval(() => {
    offlineStorage.clearExpired().catch(console.error);
  }, 60 * 60 * 1000); // A cada hora
}

export default offlineStorage;
export { OfflineStorage };