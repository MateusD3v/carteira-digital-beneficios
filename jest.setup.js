import '@testing-library/jest-dom'

// Mock do Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn()
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  }
}))

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock do IndexedDB para testes offline
const mockIDBRequest = {
  result: null,
  error: null,
  onsuccess: null,
  onerror: null,
  readyState: 'done'
}

const mockIDBObjectStore = {
  add: jest.fn(() => mockIDBRequest),
  put: jest.fn(() => mockIDBRequest),
  get: jest.fn(() => mockIDBRequest),
  getAll: jest.fn(() => mockIDBRequest),
  delete: jest.fn(() => mockIDBRequest),
  clear: jest.fn(() => mockIDBRequest),
  count: jest.fn(() => mockIDBRequest),
  createIndex: jest.fn(),
  index: jest.fn(() => ({
    get: jest.fn(() => mockIDBRequest),
    getAll: jest.fn(() => mockIDBRequest)
  }))
}

const mockIDBTransaction = {
  objectStore: jest.fn(() => mockIDBObjectStore),
  oncomplete: null,
  onerror: null,
  onabort: null
}

const mockIDBDatabase = {
  transaction: jest.fn(() => mockIDBTransaction),
  createObjectStore: jest.fn(() => mockIDBObjectStore),
  deleteObjectStore: jest.fn(),
  close: jest.fn()
}

const mockIDBOpenRequest = {
  ...mockIDBRequest,
  result: mockIDBDatabase,
  onupgradeneeded: null,
  onsuccess: null,
  onerror: null
}

Object.defineProperty(global, 'indexedDB', {
  value: {
    open: jest.fn(() => mockIDBOpenRequest),
    deleteDatabase: jest.fn(() => mockIDBRequest)
  },
  writable: true
})

// Mock do IDBKeyRange
Object.defineProperty(global, 'IDBKeyRange', {
  value: {
    upperBound: jest.fn((value) => ({ upper: value, upperOpen: false })),
    lowerBound: jest.fn((value) => ({ lower: value, lowerOpen: false })),
    bound: jest.fn((lower, upper) => ({ lower, upper, lowerOpen: false, upperOpen: false })),
    only: jest.fn((value) => ({ only: value }))
  },
  writable: true
})

// Mock do Notification API
class MockNotification {
  constructor(title, options) {
    this.title = title;
    this.body = options?.body;
    this.icon = options?.icon;
    this.tag = options?.tag;
    this.requireInteraction = options?.requireInteraction;
  }
  
  close() {}
  
  static permission = 'granted';
  static requestPermission = jest.fn(() => Promise.resolve('granted'));
}

Object.defineProperty(global, 'Notification', {
  value: MockNotification,
  writable: true,
  configurable: true
});

// Mock do AudioContext para testes de som
Object.defineProperty(global, 'AudioContext', {
  value: class MockAudioContext {
    createOscillator() {
      return {
        connect: jest.fn(),
        start: jest.fn(),
        stop: jest.fn(),
        frequency: { value: 0 },
        type: 'sine'
      };
    }
    createGain() {
      return {
        connect: jest.fn(),
        gain: { value: 0 }
      };
    }
    get destination() {
      return { connect: jest.fn() };
    }
  },
  writable: true
});

// Mock do console para evitar erros nos testes
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn()
};

// Mock do geolocation
Object.defineProperty(navigator, 'geolocation', {
  value: {
    getCurrentPosition: jest.fn(),
    watchPosition: jest.fn()
  }
})

// Configuração global para testes
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}))

// Mock do IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}))