"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificar o status inicial da conexão
    setIsOnline(navigator.onLine);

    // Configurar listeners para mudanças no status da conexão
    const handleOnline = () => {
      setIsOnline(true);
      setLastSynced(new Date().toLocaleString());
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    // Configurar listener para scroll
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Mostrar quando rolar mais de 200px ou estiver próximo do final da página
      const shouldShow = scrollTop > 200 || (scrollTop + windowHeight >= documentHeight - 100);
      setIsVisible(shouldShow);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Simular uma sincronização inicial se estiver online
    if (navigator.onLine) {
      setLastSynced(new Date().toLocaleString());
    }

    // Verificar posição inicial do scroll
    handleScroll();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out">
      <div className="bg-background/90 backdrop-blur-sm border rounded-lg shadow-lg p-3 flex items-center space-x-2 transition-all duration-300 hover:shadow-md animate-in slide-in-from-bottom-2 fade-in-0">
        {isOnline ? (
          <>
            <Badge className="bg-green-500 flex items-center gap-1 px-3 py-1">
              <Wifi className="h-3 w-3" />
              <span>Online</span>
            </Badge>
            {lastSynced && (
              <span className="text-xs text-muted-foreground">
                Sincronizado: {lastSynced}
              </span>
            )}
          </>
        ) : (
          <Badge className="bg-amber-500 flex items-center gap-1 px-3 py-1">
            <WifiOff className="h-3 w-3" />
            <span>Offline</span>
          </Badge>
        )}
      </div>
    </div>
  );
}