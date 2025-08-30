'use client';

import { useState, useEffect, useCallback } from 'react';

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  focusIndicators: boolean;
  screenReaderOptimized: boolean;
  keyboardNavigation: boolean;
  colorBlindFriendly: boolean;
  simplifiedLayout: boolean;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  focusIndicators: true,
  screenReaderOptimized: false,
  keyboardNavigation: true,
  colorBlindFriendly: false,
  simplifiedLayout: false,
};

const STORAGE_KEY = 'accessibility-settings';

export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar configurações do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsedSettings });
      }
    } catch (error) {
      console.warn('Erro ao carregar configurações de acessibilidade:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Salvar configurações no localStorage
  const saveSettings = useCallback((newSettings: AccessibilitySettings) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.warn('Erro ao salvar configurações de acessibilidade:', error);
    }
  }, []);

  // Aplicar configurações ao DOM
  useEffect(() => {
    if (!isLoaded) return;

    const root = document.documentElement;
    
    // Alto contraste
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Texto grande
    if (settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    // Movimento reduzido
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Indicadores de foco aprimorados
    if (settings.focusIndicators) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }

    // Otimizado para leitores de tela
    if (settings.screenReaderOptimized) {
      root.classList.add('screen-reader-optimized');
    } else {
      root.classList.remove('screen-reader-optimized');
    }

    // Amigável para daltônicos
    if (settings.colorBlindFriendly) {
      root.classList.add('colorblind-friendly');
    } else {
      root.classList.remove('colorblind-friendly');
    }

    // Layout simplificado
    if (settings.simplifiedLayout) {
      root.classList.add('simplified-layout');
    } else {
      root.classList.remove('simplified-layout');
    }

  }, [settings, isLoaded]);

  // Funções para alterar configurações individuais
  const toggleHighContrast = useCallback(() => {
    const newSettings = { ...settings, highContrast: !settings.highContrast };
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  const toggleLargeText = useCallback(() => {
    const newSettings = { ...settings, largeText: !settings.largeText };
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  const toggleReducedMotion = useCallback(() => {
    const newSettings = { ...settings, reducedMotion: !settings.reducedMotion };
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  const toggleFocusIndicators = useCallback(() => {
    const newSettings = { ...settings, focusIndicators: !settings.focusIndicators };
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  const toggleScreenReaderOptimized = useCallback(() => {
    const newSettings = { ...settings, screenReaderOptimized: !settings.screenReaderOptimized };
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  const toggleColorBlindFriendly = useCallback(() => {
    const newSettings = { ...settings, colorBlindFriendly: !settings.colorBlindFriendly };
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  const toggleSimplifiedLayout = useCallback(() => {
    const newSettings = { ...settings, simplifiedLayout: !settings.simplifiedLayout };
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  // Resetar todas as configurações
  const resetSettings = useCallback(() => {
    saveSettings(defaultSettings);
  }, [saveSettings]);

  // Detectar preferências do sistema
  const detectSystemPreferences = useCallback(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    const systemSettings = {
      ...settings,
      reducedMotion: prefersReducedMotion,
      highContrast: prefersHighContrast,
    };
    
    saveSettings(systemSettings);
  }, [settings, saveSettings]);

  return {
    settings,
    isLoaded,
    toggleHighContrast,
    toggleLargeText,
    toggleReducedMotion,
    toggleFocusIndicators,
    toggleScreenReaderOptimized,
    toggleColorBlindFriendly,
    toggleSimplifiedLayout,
    resetSettings,
    detectSystemPreferences,
    saveSettings,
  };
}

// Hook para detectar navegação por teclado
export function useKeyboardNavigation() {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  useEffect(() => {
    let keyboardUsed = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && !keyboardUsed) {
        keyboardUsed = true;
        setIsKeyboardUser(true);
        document.body.classList.add('keyboard-user');
      }
    };

    const handleMouseDown = () => {
      if (keyboardUsed) {
        keyboardUsed = false;
        setIsKeyboardUser(false);
        document.body.classList.remove('keyboard-user');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return isKeyboardUser;
}

// Hook para anúncios para leitores de tela
export function useScreenReaderAnnouncements() {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove o elemento após um tempo para evitar acúmulo
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  }, []);

  return { announce };
}