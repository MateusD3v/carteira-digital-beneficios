'use client';

import { useState, useEffect } from 'react';
import { MainNav } from '@/components/main-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

// If the alert component is missing, create it at @/components/ui/alert.tsx:
/*
import * as React from "react"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Alert({ className, children, ...props }: AlertProps) {
  return (
    <div
      className={`relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function AlertDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div
      className={`text-sm [&_p]:leading-relaxed ${className}`}
      {...props}
    />
  )
}
*/

import { Separator } from "@/components/ui/separator";
import { CalendarDays, CreditCard, FileText, RefreshCw, Wifi, WifiOff, Download, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useNotifications } from '@/hooks/use-notifications';

// Interfaces locais
interface BenefitData {
  id: string;
  name: string;
  value: number;
  status: 'active' | 'suspended' | 'cancelled';
  nextPayment: string;
  lastPayment: string;
  beneficiaryCode: string;
}

const mockBenefits: BenefitData[] = [
  {
    id: '1',
    name: 'Auxílio Brasil',
    value: 600.00,
    status: 'active',
    nextPayment: '2024-02-20',
    lastPayment: '2024-01-20',
    beneficiaryCode: 'AB123456789'
  },
  {
    id: '2', 
    name: 'Vale Gás',
    value: 120.00,
    status: 'active',
    nextPayment: '2024-03-15',
    lastPayment: '2024-01-15',
    beneficiaryCode: 'VG987654321'
  }
];

// Dados mock para extratos
const mockExtratos = {
  '1': [
    { id: '1', date: '2024-01-20', value: 600.00, type: 'Crédito', description: 'Auxílio Brasil - Janeiro/2024' },
    { id: '2', date: '2023-12-20', value: 600.00, type: 'Crédito', description: 'Auxílio Brasil - Dezembro/2023' },
    { id: '3', date: '2023-11-20', value: 600.00, type: 'Crédito', description: 'Auxílio Brasil - Novembro/2023' },
  ],
  '2': [
    { id: '4', date: '2024-01-15', value: 120.00, type: 'Crédito', description: 'Vale Gás - Janeiro/2024' },
    { id: '5', date: '2023-11-15', value: 120.00, type: 'Crédito', description: 'Vale Gás - Novembro/2023' },
  ]
};

export default function BeneficiosPage() {
  const { addNotification } = useNotifications();
  const [showRecadastroAlert, setShowRecadastroAlert] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [benefits, setBenefits] = useState<BenefitData[]>([]);
  const [benefitsLoading, setBenefitsLoading] = useState(true);
  const [cacheLoading, setCacheLoading] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<BenefitData | null>(null);
  const [showExtratosModal, setShowExtratosModal] = useState(false);
  const [showComprovantesModal, setShowComprovantesModal] = useState(false);
  const [showAgendamentoModal, setShowAgendamentoModal] = useState(false);

  // Simular alerta de recadastro
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRecadastroAlert(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      setBenefitsLoading(true);
      try {
        // Simular carregamento
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBenefits(mockBenefits);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setBenefitsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Monitorar status online/offline
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Função para atualizar dados
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simular busca de dados atualizados da API
      await new Promise(resolve => setTimeout(resolve, 1500));
      setBenefits(mockBenefits);
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Sincronizar quando voltar online
  const handleSyncWhenOnline = () => {
    // Função placeholder para sincronização
    console.log('Sincronizando dados...');
  };

  const handleRecadastroAlert = () => {
    addNotification({
      id: crypto.randomUUID(),
      title: "Recadastro Necessário",
      message: "Seu Auxílio Brasil precisa ser recadastrado até 15/02/2024",
      type: "warning",
      category: "recadastro",
      priority: "high",
      createdAt: new Date(),
      isRead: false
    });
    setShowRecadastroAlert(false);
  };

  // Função para abrir extratos
  const handleViewExtratos = (benefit: BenefitData) => {
    setSelectedBenefit(benefit);
    setShowExtratosModal(true);
    addNotification({
      id: crypto.randomUUID(),
      title: "Extratos Carregados",
      message: `Extratos do ${benefit.name} foram carregados com sucesso`,
      type: "success",
      category: "documento",
      priority: "medium",
      createdAt: new Date(),
      isRead: false
    });
  };

  // Função para ver todos os extratos
  const handleViewAllExtratos = () => {
    if (benefits.length > 0) {
      setSelectedBenefit(benefits[0]); // Seleciona o primeiro benefício por padrão
      setShowExtratosModal(true);
      addNotification({
        id: crypto.randomUUID(),
        title: "Extratos Disponíveis",
        message: "Visualizando extratos de todos os benefícios",
        type: "info",
        category: "documento",
        priority: "medium",
        createdAt: new Date(),
        isRead: false
      });
    } else {
      addNotification({
        id: crypto.randomUUID(),
        title: "Nenhum Benefício",
        message: "Não há benefícios disponíveis para visualizar extratos",
        type: "warning",
        category: "documento",
        priority: "medium",
        createdAt: new Date(),
        isRead: false
      });
    }
  };

  // Função para baixar comprovantes
  const handleDownloadComprovantes = (benefit: BenefitData) => {
    setSelectedBenefit(benefit);
    setShowComprovantesModal(true);
    
    // Simular download
    const downloadComprovante = () => {
      const comprovante = {
        beneficio: benefit.name,
        valor: benefit.value,
        data: benefit.lastPayment,
        codigo: benefit.beneficiaryCode
      };
      
      const dataStr = JSON.stringify(comprovante, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `comprovante-${benefit.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };
    
    setTimeout(() => {
      downloadComprovante();
      addNotification({
        id: crypto.randomUUID(),
        title: "Comprovante Baixado",
        message: `Comprovante do ${benefit.name} foi baixado com sucesso`,
        type: "success",
        category: "documento",
        priority: "medium",
        createdAt: new Date(),
        isRead: false
      });
      setShowComprovantesModal(false);
    }, 1500);
  };

  // Função para baixar todos os comprovantes
  const handleDownloadAllComprovantes = () => {
    if (benefits.length > 0) {
      // Simular download de todos os comprovantes
      const downloadAllComprovantes = () => {
        const allComprovantes = benefits.map(benefit => ({
          beneficio: benefit.name,
          valor: benefit.value,
          data: benefit.lastPayment,
          codigo: benefit.beneficiaryCode,
          status: benefit.status
        }));
        
        const dataStr = JSON.stringify({
          titulo: 'Comprovantes de Benefícios',
          dataGeracao: new Date().toISOString(),
          comprovantes: allComprovantes
        }, null, 2);
        
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `todos-comprovantes-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      };
      
      // Mostrar modal de loading temporariamente
      setSelectedBenefit(benefits[0]);
      setShowComprovantesModal(true);
      
      setTimeout(() => {
        downloadAllComprovantes();
        addNotification({
          id: crypto.randomUUID(),
          title: "Comprovantes Baixados",
          message: `${benefits.length} comprovantes foram baixados com sucesso`,
          type: "success",
          category: "documento",
          priority: "high",
          createdAt: new Date(),
          isRead: false
        });
        setShowComprovantesModal(false);
      }, 2000);
    } else {
      addNotification({
        id: crypto.randomUUID(),
        title: "Nenhum Benefício",
        message: "Não há benefícios disponíveis para baixar comprovantes",
        type: "warning",
        category: "documento",
        priority: "medium",
        createdAt: new Date(),
        isRead: false
      });
    }
  };

  const handleAgendarRecadastramento = () => {
    setShowAgendamentoModal(true);
    
    addNotification({
      id: crypto.randomUUID(),
      type: 'info',
      title: 'Agendamento de Recadastramento',
      message: 'Abrindo opções de agendamento',
      priority: 'medium',
      category: 'recadastro',
      createdAt: new Date(),
      isRead: false
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'suspended':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'suspended':
        return 'Suspenso';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'suspended':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 p-6 md:p-10">
        <div className="container mx-auto">
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold mb-2">Meus Benefícios</h1>
                <p className="text-lg sm:text-xl text-muted-foreground">Consulte seus benefícios ativos e status de pagamentos</p>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap">
                {/* Status de conexão */}
                <div className="flex items-center space-x-2">
                  {isOnline ? (
                    <>
                      <Wifi className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">Online</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-600">Offline</span>
                    </>
                  )}
                </div>

                {/* Botão de atualizar */}
                <Button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm px-2 sm:px-3"
                >
                  <div className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 ${isRefreshing ? 'animate-spin' : ''}`}>
                    <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <span className="hidden sm:inline">{isRefreshing ? 'Atualizando...' : 'Atualizar'}</span>
                  <span className="sm:hidden">{isRefreshing ? '...' : ''}</span>
                </Button>

                {/* Botão de sincronizar (quando offline) */}
                {!isOnline && (
                  <Button
                    onClick={handleSyncWhenOnline}
                    variant="default"
                    size="sm"
                    className="text-xs sm:text-sm px-2 sm:px-3"
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Sincronizar</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Indicador de dados em cache */}
            {!isOnline && (
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Você está offline. Os dados exibidos podem não estar atualizados.
                </AlertDescription>
              </Alert>
            )}

            {/* Alerta de recadastro */}
            {showRecadastroAlert && (
              <Alert className="mb-6 border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <div className="flex items-center justify-between">
                    <span>Atenção: Seu Auxílio Brasil precisa ser recadastrado até 15/02/2024</span>
                    <Button
                      onClick={handleRecadastroAlert}
                      variant="outline"
                      size="sm"
                      className="ml-4"
                    >
                      Entendi
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Loading state */}
          {(benefitsLoading || cacheLoading) && benefits.length === 0 && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-muted border-t-primary mr-3"></div>
              <span className="text-lg">Carregando benefícios...</span>
            </div>
          )}

          {/* Benefits Grid */}
          {!benefitsLoading && benefits.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
              {benefits.map((benefit) => (
                <Card key={benefit.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <CardTitle className="text-base sm:text-lg truncate">{benefit.name}</CardTitle>
                      <div className="flex items-center space-x-1 self-start sm:self-auto">
                        {getStatusIcon(benefit.status)}
                        <Badge variant={getStatusVariant(benefit.status) as any} className="text-xs">
                          {getStatusText(benefit.status)}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="text-xs sm:text-sm">Código: {benefit.beneficiaryCode}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-3xl font-bold text-green-600">
                        R$ {benefit.value.toFixed(2).replace('.', ',')}
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Último pagamento:</span>
                          <span className="font-medium">{new Date(benefit.lastPayment).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Próximo pagamento:</span>
                          <span className="font-medium">{new Date(benefit.nextPayment).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2 sm:gap-0 pt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-xs sm:text-sm px-2 sm:px-3"
                          onClick={() => handleViewExtratos(benefit)}
                        >
                          <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Extratos
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-xs sm:text-sm px-2 sm:px-3"
                          onClick={() => handleDownloadComprovantes(benefit)}
                        >
                          <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Comprovantes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!benefitsLoading && benefits.length === 0 && (
            <div className="text-center py-12">
              <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum benefício encontrado</h3>
              <p className="text-muted-foreground mb-4">Não foi possível encontrar benefícios ativos para este CPF.</p>
              {!isOnline && (
                <Button 
                  onClick={handleRefresh} 
                  variant="outline"
                  className="text-xs sm:text-sm px-2 sm:px-3"
                >
                  <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Tentar novamente</span>
                  <span className="sm:hidden">Tentar</span>
                </Button>
              )}
            </div>
          )}

          {/* Informações adicionais */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDays className="h-5 w-5 mr-2" />
                  Recadastramento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Mantenha seus dados sempre atualizados para não perder seus benefícios.
                </p>
                <Button className="w-full" onClick={handleAgendarRecadastramento}>
                  Agendar Recadastramento
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Extratos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Consulte o histórico completo de seus pagamentos.
                </p>
                <Button variant="outline" className="w-full" onClick={handleViewAllExtratos}>
                  Ver Extratos
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Comprovantes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Baixe seus comprovantes de pagamento.
                </p>
                <Button variant="outline" className="w-full" onClick={handleDownloadAllComprovantes}>
                  Baixar Comprovantes
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Documentos necessários para recadastramento */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Documentos necessários para recadastramento</CardTitle>
              <CardDescription>
                Tenha em mãos os seguintes documentos para realizar seu recadastramento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  CPF do responsável familiar
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  Documento de identidade com foto
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  Comprovante de residência atualizado
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  CPF e certidão de nascimento de todos os membros da família
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Modal de Extratos */}
      {showExtratosModal && selectedBenefit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-lg">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Extratos - {selectedBenefit.name}</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowExtratosModal(false)}
                >
                  ✕
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Código: {selectedBenefit.beneficiaryCode}
              </p>
              {benefits.length > 1 && (
                <div className="mt-3">
                  <label className="block text-sm font-medium mb-2">Selecionar benefício:</label>
                  <select 
                    className="w-full p-2 border rounded-md text-sm"
                    value={selectedBenefit.id}
                    onChange={(e) => {
                      const benefit = benefits.find(b => b.id === e.target.value);
                      if (benefit) setSelectedBenefit(benefit);
                    }}
                  >
                    {benefits.map(benefit => (
                      <option key={benefit.id} value={benefit.id}>
                        {benefit.name} - {benefit.beneficiaryCode}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                {mockExtratos[selectedBenefit.id as keyof typeof mockExtratos]?.map((extrato) => (
                  <Card key={extrato.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{extrato.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(extrato.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            + R$ {extrato.value.toFixed(2).replace('.', ',')}
                          </p>
                          <Badge variant="secondary">{extrato.type}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) || (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum extrato encontrado para este benefício.
                  </p>
                )}
              </div>
            </div>
            <div className="p-6 border-t bg-muted/30">
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowExtratosModal(false)}>
                  Fechar
                </Button>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Baixar PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Comprovantes */}
      {showComprovantesModal && selectedBenefit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border rounded-lg max-w-md w-full shadow-lg">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Baixando Comprovante</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowComprovantesModal(false)}
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h3 className="text-lg font-medium mb-2">Preparando comprovante...</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Gerando comprovante de pagamento do {selectedBenefit.name}
              </p>
              <div className="bg-muted/30 rounded-lg p-4 text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Benefício:</span>
                    <span className="font-medium">{selectedBenefit.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valor:</span>
                    <span className="font-medium text-green-600">
                      R$ {selectedBenefit.value.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data:</span>
                    <span className="font-medium">
                      {new Date(selectedBenefit.lastPayment).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Código:</span>
                    <span className="font-medium">{selectedBenefit.beneficiaryCode}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Agendamento de Recadastramento */}
      {showAgendamentoModal && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-50" 
            onClick={() => setShowAgendamentoModal(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-background border rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Agendar Recadastramento</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowAgendamentoModal(false)}
                  >
                    ✕
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Informações Importantes</h3>
                    <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
                      <li>• O recadastramento deve ser feito presencialmente</li>
                      <li>• Traga todos os documentos necessários</li>
                      <li>• O agendamento é obrigatório</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Benefício para recadastrar</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>Auxílio Brasil</option>
                        <option>BPC</option>
                        <option>Seguro Defeso</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Data preferida</label>
                      <input 
                        type="date" 
                        className="w-full p-2 border rounded-md"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Horário preferido</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>08:00 - 09:00</option>
                        <option>09:00 - 10:00</option>
                        <option>10:00 - 11:00</option>
                        <option>11:00 - 12:00</option>
                        <option>14:00 - 15:00</option>
                        <option>15:00 - 16:00</option>
                        <option>16:00 - 17:00</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Local preferido</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>CRAS Centro</option>
                        <option>CRAS Zona Norte</option>
                        <option>CRAS Zona Sul</option>
                        <option>CRAS Zona Leste</option>
                        <option>CRAS Zona Oeste</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setShowAgendamentoModal(false)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={() => {
                        addNotification({
                          id: crypto.randomUUID(),
                          type: 'success',
                          title: 'Agendamento realizado',
                          message: 'Seu recadastramento foi agendado com sucesso',
                          priority: 'high',
                          category: 'recadastro',
                          createdAt: new Date(),
                          isRead: false
                        });
                        setShowAgendamentoModal(false);
                      }}
                    >
                      Confirmar Agendamento
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Carteira Digital de Benefícios Sociais © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}