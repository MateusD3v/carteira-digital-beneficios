'use client';

import React, { useState, useEffect } from 'react';
import { Accessibility, ChevronDown, Type, MousePointer, Eye, Keyboard, Image, Languages, Volume2, VolumeX, Palette, Zap, Focus, Layout, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAccessibility, useKeyboardNavigation, useScreenReaderAnnouncements } from '@/hooks/use-accessibility';
import { cn } from '@/lib/utils';

interface AccessibilityMenuProps {
  className?: string;
}

export function AccessibilityMenu({ className }: AccessibilityMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100); // 100% é o tamanho padrão
  const [largeButtons, setLargeButtons] = useState(false);
  const [cleanDesign, setCleanDesign] = useState(false);
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);
  const [imageDescriptions, setImageDescriptions] = useState(false);
  const [librasTranslation, setLibrasTranslation] = useState(false);
  const [voiceReading, setVoiceReading] = useState(false);
  
  const {
    settings,
    toggleHighContrast,
    toggleLargeText,
    toggleReducedMotion,
    toggleFocusIndicators,
    toggleScreenReaderOptimized,
    toggleColorBlindFriendly,
    toggleSimplifiedLayout,
    resetSettings,
    detectSystemPreferences
  } = useAccessibility();
  
  const isKeyboardUser = useKeyboardNavigation();
  const { announce } = useScreenReaderAnnouncements();

  // Função para alternar o menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Função para aumentar o tamanho da fonte
  const increaseFontSize = () => {
    if (fontSize < 150) { // Limite máximo de 150%
      const newSize = fontSize + 10;
      setFontSize(newSize);
      document.documentElement.style.fontSize = `${newSize}%`;
    }
  };

  // Função para diminuir o tamanho da fonte
  const decreaseFontSize = () => {
    if (fontSize > 80) { // Limite mínimo de 80%
      const newSize = fontSize - 10;
      setFontSize(newSize);
      document.documentElement.style.fontSize = `${newSize}%`;
    }
  };

  // Função para alternar botões grandes
  const toggleLargeButtons = () => {
    const newState = !largeButtons;
    setLargeButtons(newState);
    if (newState) {
      document.body.classList.add('large-buttons');
      announce('Botões grandes ativados');
    } else {
      document.body.classList.remove('large-buttons');
      announce('Botões grandes desativados');
    }
  };

  // Função para alternar design limpo
  const toggleCleanDesign = () => {
    const newState = !cleanDesign;
    setCleanDesign(newState);
    if (newState) {
      document.body.classList.add('clean-design');
      announce('Design limpo ativado');
    } else {
      document.body.classList.remove('clean-design');
      announce('Design limpo desativado');
    }
  };

  // Função para alternar navegação por teclado
  const toggleKeyboardNavigation = () => {
    const newState = !keyboardNavigation;
    setKeyboardNavigation(newState);
    if (newState) {
      document.body.classList.add('keyboard-navigation');
      // Adiciona foco visível em todos os elementos interativos
      const style = document.createElement('style');
      style.id = 'keyboard-nav-style';
      style.innerHTML = `
        a:focus, button:focus, input:focus, select:focus, textarea:focus {
          outline: 3px solid #0070f3 !important;
          outline-offset: 2px !important;
        }
      `;
      document.head.appendChild(style);
      announce('Navegação por teclado aprimorada ativada');
    } else {
      document.body.classList.remove('keyboard-navigation');
      const style = document.getElementById('keyboard-nav-style');
      if (style) style.remove();
      announce('Navegação por teclado aprimorada desativada');
    }
  };

  const handleHighContrast = () => {
    toggleHighContrast();
    announce(settings.highContrast ? 'Alto contraste desativado' : 'Alto contraste ativado');
  };

  const handleLargeText = () => {
    toggleLargeText();
    announce(settings.largeText ? 'Texto grande desativado' : 'Texto grande ativado');
  };

  const handleReducedMotion = () => {
    toggleReducedMotion();
    announce(settings.reducedMotion ? 'Movimento reduzido desativado' : 'Movimento reduzido ativado');
  };

  const handleColorBlindFriendly = () => {
    toggleColorBlindFriendly();
    announce(settings.colorBlindFriendly ? 'Modo daltônico desativado' : 'Modo daltônico ativado');
  };

  const handleSimplifiedLayout = () => {
    toggleSimplifiedLayout();
    announce(settings.simplifiedLayout ? 'Layout simplificado desativado' : 'Layout simplificado ativado');
  };

  const handleResetSettings = () => {
    resetSettings();
    announce('Configurações de acessibilidade resetadas');
  };

  const handleDetectPreferences = () => {
    detectSystemPreferences();
    announce('Preferências do sistema detectadas e aplicadas');
  };

  // Função para alternar descrições de imagens
  const toggleImageDescriptions = () => {
    setImageDescriptions(!imageDescriptions);
    if (!imageDescriptions) {
      // Adiciona descrições visíveis para todas as imagens que têm alt
      const images = document.querySelectorAll('img[alt]');
      images.forEach((img: Element) => {
        if (img instanceof HTMLImageElement && img.alt) {
          const wrapper = document.createElement('div');
          wrapper.className = 'image-description-wrapper';
          wrapper.style.position = 'relative';
          
          const description = document.createElement('div');
          description.className = 'image-description';
          description.textContent = img.alt;
          description.style.position = 'absolute';
          description.style.bottom = '0';
          description.style.left = '0';
          description.style.right = '0';
          description.style.backgroundColor = 'rgba(0,0,0,0.7)';
          description.style.color = 'white';
          description.style.padding = '5px';
          description.style.fontSize = '12px';
          
          img.parentNode?.insertBefore(wrapper, img);
          wrapper.appendChild(img.cloneNode(true));
          wrapper.appendChild(description);
          img.style.display = 'none';
        }
      });
    } else {
      // Remove as descrições visíveis
      const wrappers = document.querySelectorAll('.image-description-wrapper');
      wrappers.forEach((wrapper) => {
        const img = wrapper.querySelector('img');
        if (img) {
          wrapper.parentNode?.insertBefore(img.cloneNode(true), wrapper);
          wrapper.remove();
        }
      });
      const hiddenImages = document.querySelectorAll('img[style="display: none;"]');
      hiddenImages.forEach((img) => {
        if (img instanceof HTMLImageElement) {
          img.style.display = '';
        }
      });
    }
  };

  // Função para alternar tradução em Libras
  const toggleLibrasTranslation = () => {
    setLibrasTranslation(!librasTranslation);
    if (!librasTranslation) {
      // Aqui seria implementada a integração com um serviço de tradução em Libras
      // Como exemplo, vamos apenas mostrar um aviso
      alert('Tradução em Libras ativada! (Simulação)');
    } else {
      alert('Tradução em Libras desativada! (Simulação)');
    }
  };

  // Função para alternar leitura em voz alta
  const toggleVoiceReading = () => {
    if (voiceReading) {
      // Parar leitura
      window.speechSynthesis.cancel();
      setVoiceReading(false);
      announce('Leitura em voz alta desativada');
    } else {
      // Iniciar leitura do conteúdo principal
      const mainContent = document.querySelector('main');
      if (mainContent) {
        const text = mainContent.textContent || '';
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.8;
        utterance.onend = () => {
          setVoiceReading(false);
          announce('Leitura concluída');
        };
        window.speechSynthesis.speak(utterance);
        setVoiceReading(true);
        announce('Iniciando leitura em voz alta');
      }
    }
  };

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-background shadow-md"
        onClick={toggleMenu}
        aria-label="Menu de acessibilidade"
        aria-expanded={isOpen}
      >
        <Accessibility className="h-5 w-5 text-black dark:text-foreground" />
      </Button>

      {isOpen && (
        <Card className="fixed sm:absolute right-4 sm:right-0 top-20 sm:top-full mt-2 w-[calc(100vw-2rem)] sm:w-72 shadow-lg max-w-[90vw] max-h-[70vh] overflow-y-auto z-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Opções de Acessibilidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Ajuste de Fonte */}
            <div>
              <div className="flex items-center mb-2">
                <Type className="h-4 w-4 mr-2" />
                <span>Tamanho da Fonte: {fontSize}%</span>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={decreaseFontSize}
                  aria-label="Diminuir fonte"
                >
                  A-
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={increaseFontSize}
                  aria-label="Aumentar fonte"
                >
                  A+
                </Button>
              </div>
            </div>

            {/* Botões Grandes */}
            <div>
              <Button 
                variant={largeButtons ? "default" : "outline"}
                size="sm"
                className="w-full flex items-center justify-between"
                onClick={toggleLargeButtons}
                aria-pressed={largeButtons}
              >
                <div className="flex items-center min-w-0 flex-1">
                  <MousePointer className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Botões Grandes</span>
                </div>
                <span className="text-xs flex-shrink-0 ml-2">{largeButtons ? 'Ativado' : 'Desativado'}</span>
              </Button>
            </div>

            {/* Alto Contraste */}
            <div>
              <Button 
                variant={settings.highContrast ? "default" : "outline"}
                size="sm"
                className="w-full flex items-center justify-between"
                onClick={handleHighContrast}
                aria-pressed={settings.highContrast}
              >
                <div className="flex items-center min-w-0 flex-1">
                  <Palette className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Alto Contraste</span>
                </div>
                <span className="text-xs flex-shrink-0 ml-2">{settings.highContrast ? 'Ativado' : 'Desativado'}</span>
              </Button>
            </div>

            {/* Texto Grande */}
            <div>
              <Button 
                variant={settings.largeText ? "default" : "outline"}
                size="sm"
                className="w-full flex items-center justify-between"
                onClick={handleLargeText}
                aria-pressed={settings.largeText}
              >
                <div className="flex items-center min-w-0 flex-1">
                  <Type className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Texto Grande</span>
                </div>
                <span className="text-xs flex-shrink-0 ml-2">{settings.largeText ? 'Ativado' : 'Desativado'}</span>
              </Button>
            </div>

            {/* Movimento Reduzido */}
            <div>
              <Button 
                variant={settings.reducedMotion ? "default" : "outline"}
                size="sm"
                className="w-full flex items-center justify-between"
                onClick={handleReducedMotion}
                aria-pressed={settings.reducedMotion}
              >
                <div className="flex items-center min-w-0 flex-1">
                  <Zap className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Reduzir Movimento</span>
                </div>
                <span className="text-xs flex-shrink-0 ml-2">{settings.reducedMotion ? 'Ativado' : 'Desativado'}</span>
              </Button>
            </div>

            {/* Modo Daltônico */}
            <div>
              <Button 
                variant={settings.colorBlindFriendly ? "default" : "outline"}
                size="sm"
                className="w-full flex items-center justify-between"
                onClick={handleColorBlindFriendly}
                aria-pressed={settings.colorBlindFriendly}
              >
                <div className="flex items-center min-w-0 flex-1">
                  <Palette className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Modo Daltônico</span>
                </div>
                <span className="text-xs flex-shrink-0 ml-2">{settings.colorBlindFriendly ? 'Ativado' : 'Desativado'}</span>
              </Button>
            </div>

            {/* Layout Simplificado */}
            <div>
              <Button 
                variant={settings.simplifiedLayout ? "default" : "outline"}
                size="sm"
                className="w-full flex items-center justify-between"
                onClick={handleSimplifiedLayout}
                aria-pressed={settings.simplifiedLayout}
              >
                <div className="flex items-center min-w-0 flex-1">
                  <Layout className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Layout Simples</span>
                </div>
                <span className="text-xs flex-shrink-0 ml-2">{settings.simplifiedLayout ? 'Ativado' : 'Desativado'}</span>
              </Button>
            </div>

            {/* Design Limpo */}
            <div>
              <Button 
                variant={cleanDesign ? "default" : "outline"}
                size="sm"
                className="w-full flex items-center justify-between"
                onClick={toggleCleanDesign}
                aria-pressed={cleanDesign}
              >
                <div className="flex items-center min-w-0 flex-1">
                  <Eye className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Design Limpo</span>
                </div>
                <span className="text-xs flex-shrink-0 ml-2">{cleanDesign ? 'Ativado' : 'Desativado'}</span>
              </Button>
            </div>

            {/* Navegação por Teclado */}
            <div>
              <Button 
                variant={keyboardNavigation ? "default" : "outline"}
                size="sm"
                className="w-full flex items-center justify-between"
                onClick={toggleKeyboardNavigation}
                aria-pressed={keyboardNavigation}
              >
                <div className="flex items-center min-w-0 flex-1">
                  <Keyboard className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Navegação por Teclado</span>
                </div>
                <span className="text-xs flex-shrink-0 ml-2">{keyboardNavigation ? 'Ativado' : 'Desativado'}</span>
              </Button>
            </div>

            {/* Descrição de Imagens */}
            <div>
              <Button 
                variant={imageDescriptions ? "default" : "outline"}
                size="sm"
                className="w-full flex items-center justify-between"
                onClick={toggleImageDescriptions}
                aria-pressed={imageDescriptions}
              >
                <div className="flex items-center min-w-0 flex-1">
                  <Image className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Descrição de Imagens</span>
                </div>
                <span className="text-xs flex-shrink-0 ml-2">{imageDescriptions ? 'Ativado' : 'Desativado'}</span>
              </Button>
            </div>

            {/* Tradução em Libras */}
            <div>
              <Button 
                variant={librasTranslation ? "default" : "outline"}
                size="sm"
                className="w-full flex items-center justify-between"
                onClick={toggleLibrasTranslation}
                aria-pressed={librasTranslation}
              >
                <div className="flex items-center min-w-0 flex-1">
                  <Languages className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Tradução em Libras</span>
                </div>
                <span className="text-xs flex-shrink-0 ml-2">{librasTranslation ? 'Ativado' : 'Desativado'}</span>
              </Button>
            </div>

            {/* Leitura em Voz Alta */}
            <div>
              <Button 
                variant={voiceReading ? "default" : "outline"}
                size="sm"
                className="w-full flex items-center justify-between"
                onClick={toggleVoiceReading}
                aria-pressed={voiceReading}
              >
                <div className="flex items-center min-w-0 flex-1">
                  {voiceReading ? (
                    <VolumeX className="h-4 w-4 mr-2 flex-shrink-0" />
                  ) : (
                    <Volume2 className="h-4 w-4 mr-2 flex-shrink-0" />
                  )}
                  <span className="truncate">Leitura em Voz Alta</span>
                </div>
                <span className="text-xs flex-shrink-0 ml-2">{voiceReading ? 'Lendo...' : 'Desativado'}</span>
              </Button>
            </div>

          </CardContent>
          
          <CardFooter className="flex flex-col space-y-3 pt-4 border-t">
            {/* Ações principais */}
            <div className="flex flex-wrap gap-2 w-full">
              <Button 
                variant="outline"
                size="sm"
                className="flex-1 flex items-center justify-center text-xs"
                onClick={handleDetectPreferences}
              >
                <Focus className="h-3 w-3 mr-1" />
                <span>Detectar Sistema</span>
              </Button>
              
              <Button 
                variant="outline"
                size="sm"
                className="flex-1 flex items-center justify-center text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleResetSettings}
              >
                <span>Resetar Tudo</span>
              </Button>
            </div>
            
            {/* Ações secundárias */}
            <div className="flex flex-wrap gap-2 w-full">
              <Button 
                variant="ghost"
                size="sm"
                className="flex-1 flex items-center justify-center text-xs"
                onClick={() => {
                  const config = JSON.stringify({
                    fontSize,
                    highContrast: settings.highContrast,
                    largeText: settings.largeText,
                    reducedMotion: settings.reducedMotion,
                    focusIndicators: settings.focusIndicators,
                    screenReaderOptimized: settings.screenReaderOptimized,
                    colorBlindFriendly: settings.colorBlindFriendly,
                    simplifiedLayout: settings.simplifiedLayout,
                    cleanDesign,
                    keyboardNavigation,
                    imageDescriptions,
                    librasTranslation,
                    voiceReading
                  }, null, 2);
                  navigator.clipboard.writeText(config).then(() => {
                    // Feedback visual de sucesso
                    const button = document.activeElement as HTMLButtonElement;
                    const originalText = button.textContent;
                    button.textContent = 'Copiado!';
                    setTimeout(() => {
                      button.textContent = originalText;
                    }, 2000);
                  }).catch(() => {
                    // Fallback para download do arquivo
                    const blob = new Blob([config], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'perfil-acessibilidade.json';
                    a.click();
                    URL.revokeObjectURL(url);
                  });
                }}
              >
                <Download className="h-3 w-3 mr-1" />
                <span>Exportar Perfil</span>
              </Button>
              
              <Button 
                variant="ghost"
                size="sm"
                className="flex-1 flex items-center justify-center text-xs"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.json';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const button = document.activeElement as HTMLButtonElement;
                      const originalText = button.textContent;
                      button.textContent = 'Importando...';
                      
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        try {
                          const config = JSON.parse(e.target?.result as string);
                          
                          // Validar se o arquivo contém as configurações esperadas
                          if (typeof config === 'object' && config !== null) {
                            // Aplicar configurações básicas
                            if (config.fontSize) setFontSize(config.fontSize);
                            
                            // Aplicar configurações dos hooks
                            if (config.highContrast !== settings.highContrast) toggleHighContrast();
                            if (config.largeText !== settings.largeText) toggleLargeText();
                            if (config.reducedMotion !== settings.reducedMotion) toggleReducedMotion();
                            if (config.focusIndicators !== settings.focusIndicators) toggleFocusIndicators();
                            if (config.screenReaderOptimized !== settings.screenReaderOptimized) toggleScreenReaderOptimized();
                            if (config.colorBlindFriendly !== settings.colorBlindFriendly) toggleColorBlindFriendly();
                            if (config.simplifiedLayout !== settings.simplifiedLayout) toggleSimplifiedLayout();
                            
                            // Aplicar configurações locais
                            if (config.cleanDesign !== undefined) setCleanDesign(config.cleanDesign);
                            if (config.keyboardNavigation !== undefined) setKeyboardNavigation(config.keyboardNavigation);
                            if (config.imageDescriptions !== undefined) setImageDescriptions(config.imageDescriptions);
                            if (config.librasTranslation !== undefined) setLibrasTranslation(config.librasTranslation);
                            if (config.voiceReading !== undefined) setVoiceReading(config.voiceReading);
                            
                            button.textContent = 'Importado!';
                            setTimeout(() => {
                              button.textContent = originalText;
                            }, 2000);
                          } else {
                            throw new Error('Formato de arquivo inválido');
                          }
                        } catch (error) {
                          console.error('Erro ao importar configurações:', error);
                          button.textContent = 'Erro!';
                          setTimeout(() => {
                            button.textContent = originalText;
                          }, 2000);
                        }
                      };
                      reader.readAsText(file);
                    }
                  };
                  input.click();
                }}
              >
                <Upload className="h-3 w-3 mr-1" />
                <span>Importar Perfil</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}