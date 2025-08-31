'use client';

import { useState, useRef } from 'react';
import { MainNav } from '@/components/main-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
// Modal personalizado será implementado com estado local
import { Upload, FileText, Download, Trash2, Eye, Search, Filter, X, Calendar, User, FileIcon } from 'lucide-react';
import { useNotifications } from '@/hooks/use-notifications';

interface DocumentData {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  category: 'identidade' | 'comprovante' | 'declaracao' | 'outros';
  status: 'pendente' | 'aprovado' | 'rejeitado';
  url?: string;
}

const mockDocuments: DocumentData[] = [
  {
    id: '1',
    name: 'RG_Frente.pdf',
    type: 'PDF',
    size: '2.1 MB',
    uploadDate: '2024-01-15',
    category: 'identidade',
    status: 'aprovado'
  },
  {
    id: '2',
    name: 'Comprovante_Residencia.pdf',
    type: 'PDF',
    size: '1.8 MB',
    uploadDate: '2024-01-14',
    category: 'comprovante',
    status: 'pendente'
  },
  {
    id: '3',
    name: 'Declaracao_Renda.pdf',
    type: 'PDF',
    size: '3.2 MB',
    uploadDate: '2024-01-13',
    category: 'declaracao',
    status: 'aprovado'
  }
];

const categoryLabels = {
  identidade: 'Identidade',
  comprovante: 'Comprovante',
  declaracao: 'Declaração',
  outros: 'Outros'
};

const statusLabels = {
  pendente: 'Pendente',
  aprovado: 'Aprovado',
  rejeitado: 'Rejeitado'
};

const statusColors = {
  pendente: 'bg-yellow-100 text-yellow-800',
  aprovado: 'bg-green-100 text-green-800',
  rejeitado: 'bg-red-100 text-red-800'
};

export default function DocumentosPage() {
  const [documents, setDocuments] = useState<DocumentData[]>(mockDocuments);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewingDocument, setViewingDocument] = useState<DocumentData | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addNotification } = useNotifications();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    try {
      // Simular upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newDocuments = Array.from(files).map(file => ({
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type.includes('pdf') ? 'PDF' : file.type.toUpperCase(),
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        category: 'outros' as const,
        status: 'pendente' as const
      }));
      
      setDocuments(prev => [...newDocuments, ...prev]);
      
      addNotification({
        id: crypto.randomUUID(),
        type: 'success',
        title: 'Upload realizado',
        message: `${files.length} documento(s) enviado(s) com sucesso`,
        createdAt: new Date(),
        priority: 'low',
        category: 'documento',
        isRead: false
      });
    } catch (error) {
      addNotification({
        id: crypto.randomUUID(),
        type: 'error',
        title: 'Erro no upload',
        message: 'Falha ao enviar documentos. Tente novamente.',
        createdAt: new Date(),
        priority: 'high',
        category: 'documento',
        isRead: false
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    addNotification({
      id: crypto.randomUUID(),
      type: 'info',
      title: 'Documento removido',
      message: 'Documento excluído com sucesso',
      priority: 'medium',
      category: 'documento',
      createdAt: new Date(),
      isRead: false
    });
  };

  const handleViewDocument = (document: DocumentData) => {
    setViewingDocument(document);
    setIsViewModalOpen(true);
    addNotification({
      id: crypto.randomUUID(),
      type: 'info',
      title: 'Visualizando documento',
      message: `Abrindo ${document.name}`,
      priority: 'low',
      category: 'documento',
      createdAt: new Date(),
      isRead: false
    });
  };

  const handleDownloadDocument = (document: DocumentData) => {
    // Validar se o documento existe
    if (!document || !document.name) {
      addNotification({
        id: crypto.randomUUID(),
        type: 'error',
        title: 'Erro no download',
        message: 'Documento não encontrado ou inválido',
        priority: 'high',
        category: 'documento',
        createdAt: new Date(),
        isRead: false
      });
      return;
    }

    // Simular download do documento
    const downloadDocument = () => {
      try {
        const documentData = {
          nome: document.name,
          tipo: document.type,
          tamanho: document.size,
          categoria: categoryLabels[document.category],
          status: statusLabels[document.status],
          dataUpload: document.uploadDate,
          id: document.id,
          downloadedAt: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(documentData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = window.document.createElement('a');
        link.href = url;
        link.download = `${document.name.replace(/\.[^/.]+$/, '')}-info.json`;
        link.style.display = 'none';
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        return true;
      } catch (error) {
        console.error('Erro no download:', error);
        return false;
      }
    };

    // Notificação de início
    addNotification({
      id: crypto.randomUUID(),
      type: 'info',
      title: 'Iniciando download',
      message: `Preparando download de ${document.name}...`,
      priority: 'medium',
      category: 'documento',
      createdAt: new Date(),
      isRead: false
    });

    // Simular delay de processamento
    setTimeout(() => {
      const success = downloadDocument();
      
      if (success) {
        // Notificação de sucesso
        addNotification({
          id: crypto.randomUUID(),
          type: 'success',
          title: 'Download concluído',
          message: `${document.name} foi baixado com sucesso`,
          priority: 'medium',
          category: 'documento',
          createdAt: new Date(),
          isRead: false
        });
      } else {
        // Notificação de erro
        addNotification({
          id: crypto.randomUUID(),
          type: 'error',
          title: 'Erro no download',
          message: `Falha ao baixar ${document.name}. Tente novamente.`,
          priority: 'high',
          category: 'documento',
          createdAt: new Date(),
          isRead: false
        });
      }
    }, 1500);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MainNav />
      
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Gestão de Documentos
            </h1>
            <p className="mt-2 text-muted-foreground">
              Faça upload, organize e gerencie seus documentos de forma segura
            </p>
          </div>

          {/* Upload Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload de Documentos
              </CardTitle>
              <CardDescription>
                Selecione os arquivos que deseja enviar (PDF, JPG, PNG)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex items-center gap-2"
                >
                  {isUploading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {isUploading ? 'Enviando...' : 'Selecionar Arquivos'}
                </Button>
                <span className="text-sm text-gray-500">
                  Tamanho máximo: 10MB por arquivo
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Filters Section */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar documentos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="all">Todas as categorias</option>
                    <option value="identidade">Identidade</option>
                    <option value="comprovante">Comprovante</option>
                    <option value="declaracao">Declaração</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
                
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="all">Todos os status</option>
                  <option value="pendente">Pendente</option>
                  <option value="aprovado">Aprovado</option>
                  <option value="rejeitado">Rejeitado</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Documents List */}
          <div className="grid gap-4">
            {filteredDocuments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Nenhum documento encontrado
                  </h3>
                  <p className="text-muted-foreground text-center">
                    {documents.length === 0 
                      ? 'Faça upload do seu primeiro documento para começar'
                      : 'Tente ajustar os filtros de busca'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredDocuments.map((document) => (
                <Card key={document.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-blue-100 flex-shrink-0">
                          <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-foreground truncate">{document.name}</h3>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-muted-foreground">
                            <span>{document.type}</span>
                            <span>{document.size}</span>
                            <span className="hidden sm:inline">Enviado em {new Date(document.uploadDate).toLocaleDateString('pt-BR')}</span>
                            <span className="sm:hidden">{new Date(document.uploadDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {categoryLabels[document.category]}
                            </Badge>
                            <Badge className={`${statusColors[document.status]} text-xs`}>
                              {statusLabels[document.status]}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap sm:flex-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDocument(document)}
                          className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 flex-1 sm:flex-none"
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">Visualizar</span>
                          <span className="sm:hidden">Ver</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument(document)}
                          className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 flex-1 sm:flex-none"
                        >
                          <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">Baixar</span>
                          <span className="sm:hidden">DL</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDocument(document.id)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700 text-xs sm:text-sm px-2 sm:px-3 flex-1 sm:flex-none"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">Excluir</span>
                          <span className="sm:hidden">Del</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Document View Modal */}
      {isViewModalOpen && viewingDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-2">
                <FileIcon className="h-5 w-5" />
                <h2 className="text-xl font-semibold">{viewingDocument.name}</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsViewModalOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Document Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-800 border-2 border-slate-600 rounded-lg shadow-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-300">Tipo:</span>
                    <span className="text-sm text-white font-medium">{viewingDocument.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-300">Data de Upload:</span>
                    <span className="text-sm text-white font-medium">{new Date(viewingDocument.uploadDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-300">Tamanho:</span>
                    <span className="text-sm text-white font-medium">{viewingDocument.size}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-300">Categoria:</span>
                    <Badge variant="outline">
                      {categoryLabels[viewingDocument.category]}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Document Status */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge className={statusColors[viewingDocument.status]}>
                    {statusLabels[viewingDocument.status]}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadDocument(viewingDocument)}
                    className="flex items-center gap-1"
                  >
                    <Download className="h-4 w-4" />
                    Baixar
                  </Button>
                </div>
              </div>

              {/* Document Preview */}
              <div className="border rounded-lg p-8 bg-gray-50 min-h-[400px] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="h-20 w-20 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-10 w-10 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Preview do Documento
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {viewingDocument.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Preview completo disponível após implementação do visualizador de PDF
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}