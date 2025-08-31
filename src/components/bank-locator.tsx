'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { MapPin, Search, Navigation, Clock, Phone, Globe, Filter, Map, List, Star, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useDebounce } from '@/hooks/use-lazy-component';
import { useNotifications } from '@/hooks/use-notifications';

// Loading Spinner Component
const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  }
  
  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-primary ${sizeClasses[size]}`} />
  )
}

// List Skeleton Component
const ListSkeleton = ({ items = 3 }: { items?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 h-4 rounded mb-2"></div>
          <div className="bg-gray-200 h-3 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  )
}

interface Bank {
  id: number;
  name: string;
  address: string;
  distance: number; // em metros
  distanceText: string;
  services: string[];
  type: 'caixa' | 'bb' | 'loterica' | 'correspondente';
  phone?: string;
  hours: string;
  rating: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  isOpen: boolean;
}

interface UserLocation {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
}

export function BankLocator() {
  const [location, setLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [nearbyBanks, setNearbyBanks] = useState<Bank[]>([]);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance');
  const { addNotification } = useNotifications();
  
  // Debounce da localização para evitar muitas chamadas
  const debouncedLocation = useDebounce(location, 500);

  // Função para calcular distância entre duas coordenadas (Haversine)
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Raio da Terra em metros
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }, []);

  // Função para formatar distância
  const formatDistance = useCallback((distance: number): string => {
    if (distance < 1000) {
      return `${Math.round(distance)} m`;
    }
    return `${(distance / 1000).toFixed(1)} km`;
  }, []);

  // Função para verificar se está aberto
  const isCurrentlyOpen = useCallback((hours: string): boolean => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0 = domingo, 6 = sábado
    
    // Simulação simples - assumindo horário comercial
    if (currentDay === 0) return false; // Domingo fechado
    if (currentDay === 6) return currentHour >= 8 && currentHour < 14; // Sábado até 14h
    return currentHour >= 8 && currentHour < 18; // Segunda a sexta
  }, []);

  // Memoização dos dados mockados expandidos
  const mockBanks = useMemo(() => {









    const baseLocation = { lat: -23.5505, lng: -46.6333 }; // São Paulo centro
    
    return [
      {
        id: 1,
        name: 'Caixa Econômica Federal - Agência Paulista',
        address: 'Av. Paulista, 1842 - Bela Vista, São Paulo - SP',
        distance: 1200,
        distanceText: '1.2 km',
        services: ['Bolsa Família', 'FGTS', 'Auxílio Brasil', 'Saque FGTS'],
        type: 'caixa' as const,
        phone: '(11) 3004-1104',
        hours: 'Seg-Sex: 8h-18h, Sáb: 8h-14h',
        rating: 4.2,
        coordinates: { lat: -23.5505, lng: -46.6333 },
        isOpen: isCurrentlyOpen('Seg-Sex: 8h-18h, Sáb: 8h-14h')
      },
      {
        id: 2,
        name: 'Banco do Brasil - Agência Augusta',
        address: 'Rua Augusta, 1234 - Consolação, São Paulo - SP',
        distance: 2500,
        distanceText: '2.5 km',
        services: ['Aposentadoria', 'Auxílio Brasil', 'Seguro Desemprego', 'BPC'],
        type: 'bb',
        phone: '(11) 4004-0001',
        hours: 'Seg-Sex: 9h-17h',
        rating: 3.8,
        coordinates: { lat: -23.5489, lng: -46.6388 },
        isOpen: isCurrentlyOpen('Seg-Sex: 9h-17h')
      },
      {
        id: 3,
        name: 'Lotérica São Paulo',
        address: 'Rua Oscar Freire, 456 - Jardins, São Paulo - SP',
        distance: 3800,
        distanceText: '3.8 km',
        services: ['Bolsa Família', 'Auxílio Brasil', 'Saque até R$ 500'],
        type: 'loterica',
        phone: '(11) 3061-2345',
        hours: 'Seg-Sáb: 8h-20h',
        rating: 4.0,
        coordinates: { lat: -23.5629, lng: -46.6544 },
        isOpen: isCurrentlyOpen('Seg-Sáb: 8h-20h')
      },
      {
        id: 4,
        name: 'Correspondente Bancário - Farmácia Popular',
        address: 'Rua da Consolação, 789 - Centro, São Paulo - SP',
        distance: 1800,
        distanceText: '1.8 km',
        services: ['Saque Auxílio Brasil', 'Consulta Saldo', 'Pagamentos'],
        type: 'correspondente',
        phone: '(11) 3256-7890',
        hours: 'Seg-Dom: 7h-22h',
        rating: 4.5,
        coordinates: { lat: -23.5431, lng: -46.6291 },
        isOpen: isCurrentlyOpen('Seg-Dom: 7h-22h')
      },
      {
        id: 5,
        name: 'Caixa Econômica Federal - Agência Centro',
        address: 'Praça da Sé, 111 - Centro, São Paulo - SP',
        distance: 4200,
        distanceText: '4.2 km',
        services: ['FGTS', 'Financiamento Habitacional', 'Bolsa Família', 'Auxílio Brasil'],
        type: 'caixa' as const,
        phone: '(11) 3004-1105',
        hours: 'Seg-Sex: 8h-18h',
        rating: 3.9,
        coordinates: { lat: -23.5505, lng: -46.6394 },
        isOpen: isCurrentlyOpen('Seg-Sex: 8h-18h')
      }
    ].map(bank => ({
      ...bank,
      distance: userLocation ? calculateDistance(
        userLocation.lat, userLocation.lng,
        bank.coordinates.lat, bank.coordinates.lng
      ) : bank.distance,
      distanceText: userLocation ? formatDistance(
        calculateDistance(
          userLocation.lat, userLocation.lng,
          bank.coordinates.lat, bank.coordinates.lng
        )
      ) : bank.distanceText
    }));
  }, [userLocation, calculateDistance, formatDistance, isCurrentlyOpen]);

  // Filtrar e ordenar bancos
  const filteredAndSortedBanks = useMemo(() => {
    let filtered = mockBanks;
    
    // Filtrar por serviço
    if (selectedService !== 'all') {
      filtered = filtered.filter(bank => 
        bank.services.some(service => 
          service.toLowerCase().includes(selectedService.toLowerCase())
        )
      );
    }
    
    // Filtrar por tipo
    if (selectedType !== 'all') {
      filtered = filtered.filter(bank => bank.type === selectedType);
    }
    
    // Filtrar por busca de texto
    if (debouncedLocation.trim()) {
      const searchTerm = debouncedLocation.toLowerCase();
      filtered = filtered.filter(bank => 
        bank.name.toLowerCase().includes(searchTerm) ||
        bank.address.toLowerCase().includes(searchTerm) ||
        bank.services.some(service => service.toLowerCase().includes(searchTerm))
      );
    }
    
    // Ordenar
    filtered.sort((a, b) => {
      if (sortBy === 'distance') {
        return a.distance - b.distance;
      } else {
        return b.rating - a.rating;
      }
    });
    
    return filtered;
  }, [mockBanks, selectedService, selectedType, debouncedLocation, sortBy]);

  const handleSearch = useCallback(() => {
    setIsSearching(true);
    
    // Simulação de busca com delay
    setTimeout(() => {
      setNearbyBanks(filteredAndSortedBanks as Bank[]);
      setIsSearching(false);
      
      addNotification({
        id: crypto.randomUUID(),
        type: 'success',
        title: 'Busca concluída',
        message: `${filteredAndSortedBanks.length} agência(s) encontrada(s)`,
        createdAt: new Date(),
        priority: 'low',
        category: 'sistema',
        isRead: false
      });
    }, 800);
  }, [filteredAndSortedBanks, addNotification]);

  // Auto-buscar quando filtros mudarem
  useEffect(() => {
    if (nearbyBanks.length > 0) {
      setNearbyBanks(filteredAndSortedBanks as Bank[]);
    }
  }, [filteredAndSortedBanks, nearbyBanks.length]);

  const handleLocationInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  // Cache de localização
  const getCachedLocation = useCallback((): UserLocation | null => {
    try {
      const cached = localStorage.getItem('userLocation');
      if (cached) {
        const location = JSON.parse(cached) as UserLocation;
        const now = Date.now();
        // Cache válido por 10 minutos
        if (now - location.timestamp < 600000) {
          return location;
        }
      }
    } catch (error) {
      console.error('Erro ao ler cache de localização:', error);
    }
    return null;
  }, []);

  const setCachedLocation = useCallback((location: UserLocation) => {
    try {
      localStorage.setItem('userLocation', JSON.stringify(location));
    } catch (error) {
      console.error('Erro ao salvar cache de localização:', error);
    }
  }, []);

  const handleUseCurrentLocation = useCallback(() => {
    // Verificar cache primeiro
    const cached = getCachedLocation();
    if (cached) {
      setUserLocation(cached);
      setLocation(`Localização atual (${formatDistance(cached.accuracy)} precisão)`);
      
      addNotification({
        id: crypto.randomUUID(),
        type: 'info',
        title: 'Localização obtida',
        message: 'Usando localização em cache',
        createdAt: new Date(),
        priority: 'low',
        category: 'sistema',
        isRead: false
      });
      
      setTimeout(() => handleSearch(), 300);
      return;
    }

    setIsGettingLocation(true);
    setLocation('Obtendo sua localização...');
    
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000 // Cache do navegador por 1 minuto
      };
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const newLocation: UserLocation = {
            lat: latitude,
            lng: longitude,
            accuracy: accuracy || 0,
            timestamp: Date.now()
          };
          
          setUserLocation(newLocation);
          setCachedLocation(newLocation);
          setLocation(`Localização atual (${formatDistance(accuracy || 0)} precisão)`);
          setIsGettingLocation(false);
          
          addNotification({
            id: crypto.randomUUID(),
            type: 'success',
            title: 'Localização obtida',
            message: `Precisão: ${formatDistance(accuracy || 0)}`,
            createdAt: new Date(),
            priority: 'low',
            category: 'sistema',
            isRead: false
          });
          
          // Auto-buscar após obter localização
          setTimeout(() => handleSearch(), 500);
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          let errorMessage = 'Não foi possível obter sua localização';
          let notificationType: 'error' | 'warning' = 'error';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permissão de localização negada. Habilite nas configurações do navegador.';
              notificationType = 'warning';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Localização indisponível. Verifique se o GPS está ativo.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Tempo limite excedido. Tente novamente.';
              break;
          }
          
          setLocation(errorMessage);
          setIsGettingLocation(false);
          
          addNotification({
            id: crypto.randomUUID(),
            type: notificationType,
            title: 'Erro de localização',
            message: errorMessage,
            createdAt: new Date(),
            priority: 'medium',
            category: 'sistema',
            isRead: false
          });
        },
        options
      );
    } else {
      const errorMsg = 'Geolocalização não suportada pelo seu navegador';
      setLocation(errorMsg);
      setIsGettingLocation(false);
      
      addNotification({
        id: crypto.randomUUID(),
        type: 'error',
        title: 'Recurso não disponível',
        message: errorMsg,
        createdAt: new Date(),
        priority: 'high',
        category: 'sistema',
        isRead: false
      });
    }
  }, [handleSearch, getCachedLocation, setCachedLocation, formatDistance, addNotification]);

  // Função para obter direções
  const handleGetDirections = useCallback((bank: Bank) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${bank.coordinates.lat},${bank.coordinates.lng}`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.google.com/maps/search/${encodeURIComponent(bank.address)}`;
      window.open(url, '_blank');
    }
    
    addNotification({
        id: crypto.randomUUID(),
        type: 'info',
        title: 'Direções abertas',
        message: `Navegando para ${bank.name}`,
        createdAt: new Date(),
        priority: 'low',
        category: 'sistema',
        isRead: false
      });
  }, [userLocation, addNotification]);

  // Função para ligar para a agência
  const handleCallBank = useCallback((bank: Bank) => {
    if (bank.phone) {
      window.location.href = `tel:${bank.phone}`;
      
      addNotification({
        id: crypto.randomUUID(),
        type: 'info',
        title: 'Ligação iniciada',
        message: `Ligando para ${bank.name}`,
        createdAt: new Date(),
        priority: 'low',
        category: 'sistema',
        isRead: false
      });
    }
  }, [addNotification]);

  return (
    <div className="w-full max-w-6xl mx-auto my-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <CardTitle className="text-lg sm:text-xl truncate">Localizador Avançado de Agências</CardTitle>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3"
              >
                <List className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Lista</span>
                <span className="xs:hidden">Local</span>
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3"
              >
                <Map className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Mapa</span>
                <span className="xs:hidden">Mapa</span>
              </Button>
            </div>
          </div>
          <CardDescription>Encontre a agência bancária mais próxima com filtros avançados e navegação GPS</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-6">
            {/* Barra de busca principal */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Digite seu endereço, CEP ou nome da agência"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  value={location}
                  onChange={handleLocationInput}
                />
              </div>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 px-6"
                onClick={handleUseCurrentLocation}
                disabled={isGettingLocation}
              >
                {isGettingLocation ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Navigation className="h-4 w-4" />
                )}
                {isGettingLocation ? 'Obtendo...' : 'Minha Localização'}
              </Button>
              <Button 
                className="flex items-center gap-2 px-6" 
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                {isSearching ? 'Buscando...' : 'Buscar'}
              </Button>
            </div>

            {/* Filtros avançados */}
            <Card className="bg-muted/30">
              <CardContent className="pt-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Filtros:</span>
                  </div>
                  
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">Todos os serviços</option>
                    <option value="bolsa família">Bolsa Família</option>
                    <option value="auxílio brasil">Auxílio Brasil</option>
                    <option value="fgts">FGTS</option>
                    <option value="aposentadoria">Aposentadoria</option>
                    <option value="seguro desemprego">Seguro Desemprego</option>
                  </select>
                  
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">Todos os tipos</option>
                    <option value="caixa">Caixa Econômica</option>
                    <option value="bb">Banco do Brasil</option>
                    <option value="loterica">Lotérica</option>
                    <option value="correspondente">Correspondente</option>
                  </select>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'distance' | 'rating')}
                    className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="distance">Ordenar por distância</option>
                    <option value="rating">Ordenar por avaliação</option>
                  </select>
                  
                  {userLocation && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Navigation className="h-3 w-3" />
                      GPS Ativo
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {isSearching && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Buscando agências próximas...</h3>
                <ListSkeleton items={3} />
              </div>
            )}
            
            {/* Resultados */}
            {!isSearching && nearbyBanks.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Agências Encontradas ({nearbyBanks.length})
                  </h3>
                  {userLocation && (
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Navigation className="h-4 w-4" />
                      Baseado na sua localização
                    </div>
                  )}
                </div>

                {viewMode === 'map' && (
                  <Card className="mb-6">
                    <CardContent className="p-4">
                      <div className="bg-muted/50 rounded-lg p-8 text-center">
                        <Map className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h4 className="font-semibold mb-2">Visualização do Mapa</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Aqui seria exibido um mapa interativo com as agências próximas
                        </p>
                        <Badge variant="outline">Em desenvolvimento</Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {viewMode === 'list' && (
                  <div className="grid gap-4">
                    {nearbyBanks.map((bank) => (
                      <Card key={bank.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-lg">{bank.name}</h4>
                                <Badge 
                                   variant={bank.isOpen ? "default" : "secondary"}
                                   className={bank.isOpen ? "bg-green-500 hover:bg-green-600" : ""}
                                 >
                                   {bank.isOpen ? "Aberto" : "Fechado"}
                                 </Badge>
                              </div>
                              <p className="text-muted-foreground mb-2 flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {bank.address}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{bank.hours}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="h-4 w-4" />
                                  <span>{bank.phone}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right flex flex-col items-end gap-2">
                              <Badge variant="outline" className="font-semibold">
                                 {formatDistance(bank.distance)}
                               </Badge>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{bank.rating}</span>
                                 <span className="text-xs text-muted-foreground">(avaliações)</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {bank.services.map((service, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="flex-1 flex items-center gap-2"
                              onClick={() => handleGetDirections(bank)}
                            >
                              <Route className="h-4 w-4" />
                              Direções GPS
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center gap-2"
                              onClick={() => handleCallBank(bank)}
                            >
                              <Phone className="h-4 w-4" />
                              Ligar
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center gap-2"
                              onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(bank.address)}`, '_blank')}
                            >
                              <Globe className="h-4 w-4" />
                              Site
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {!isSearching && debouncedLocation && nearbyBanks.length === 0 && (
              <Card className="mt-6">
                <CardContent className="p-8 text-center">
                  <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">Nenhuma agência encontrada</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Não encontramos agências próximas ao endereço informado.
                    Tente buscar por um CEP ou endereço mais específico.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button variant="outline" size="sm" onClick={() => setLocation('')}>
                      Limpar busca
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleUseCurrentLocation}>
                      Usar minha localização
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}