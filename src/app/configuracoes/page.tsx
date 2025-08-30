'use client';

import { MainNav } from "@/components/main-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationSettings } from "@/components/notification-center";
import { Settings, Bell, Shield, Palette, Accessibility } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ConfiguracoesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 p-6 md:p-10 bg-gradient-to-b from-background to-background/80">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 flex items-center space-x-2">
              <Settings className="h-8 w-8 text-primary" />
              <span>Configurações</span>
            </h1>
            <p className="text-muted-foreground">
              Personalize sua experiência na Carteira Digital de Benefícios Sociais
            </p>
          </div>

          <div className="grid gap-6">
            {/* Notificações */}
            <NotificationSettings />

            {/* Acessibilidade */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Accessibility className="h-5 w-5" />
                  <span>Acessibilidade</span>
                </CardTitle>
                <CardDescription>
                  Configurações para melhorar a acessibilidade da aplicação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Recursos Disponíveis</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">Ajuste de fonte</span>
                        <Badge variant="outline">Ativo</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">Botões grandes</span>
                        <Badge variant="outline">Disponível</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">Alto contraste</span>
                        <Badge variant="outline">Disponível</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">Navegação por teclado</span>
                        <Badge variant="outline">Ativo</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Recursos Futuros</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-muted/30 rounded opacity-60">
                        <span className="text-sm">Tradução em Libras</span>
                        <Badge variant="secondary">Em breve</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted/30 rounded opacity-60">
                        <span className="text-sm">Leitura em voz alta</span>
                        <Badge variant="secondary">Em breve</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted/30 rounded opacity-60">
                        <span className="text-sm">Descrição de imagens</span>
                        <Badge variant="secondary">Em breve</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use o menu de acessibilidade (ícone de pessoa) no canto superior direito para ativar/desativar recursos.
                </p>
              </CardContent>
            </Card>

            {/* Aparência */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>Aparência</span>
                </CardTitle>
                <CardDescription>
                  Personalize a aparência da aplicação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Tema escuro</label>
                    <p className="text-xs text-muted-foreground">Alternar entre tema claro e escuro</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Use o botão de tema no canto superior direito
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Design limpo</label>
                    <p className="text-xs text-muted-foreground">Interface simplificada com menos elementos visuais</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Disponível no menu de acessibilidade
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Privacidade e Segurança */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Privacidade e Segurança</span>
                </CardTitle>
                <CardDescription>
                  Configurações de privacidade e segurança dos seus dados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                    <div>
                      <span className="text-sm font-medium text-green-800 dark:text-green-200">Dados locais</span>
                      <p className="text-xs text-green-600 dark:text-green-300">
                        Seus dados são armazenados apenas no seu dispositivo
                      </p>
                    </div>
                    <Badge variant="outline" className="border-green-300 text-green-700 dark:text-green-300">
                      Seguro
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                    <div>
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Sem rastreamento</span>
                      <p className="text-xs text-blue-600 dark:text-blue-300">
                        Não coletamos dados pessoais ou de navegação
                      </p>
                    </div>
                    <Badge variant="outline" className="border-blue-300 text-blue-700 dark:text-blue-300">
                      Privado
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950/20 rounded border border-purple-200 dark:border-purple-800">
                    <div>
                      <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Código aberto</span>
                      <p className="text-xs text-purple-600 dark:text-purple-300">
                        Aplicação desenvolvida com transparência total
                      </p>
                    </div>
                    <Badge variant="outline" className="border-purple-300 text-purple-700 dark:text-purple-300">
                      Transparente
                    </Badge>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button variant="outline" size="sm" className="w-full">
                    Limpar todos os dados locais
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Remove todas as configurações e notificações salvas
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Sobre */}
            <Card>
              <CardHeader>
                <CardTitle>Sobre a Aplicação</CardTitle>
                <CardDescription>
                  Informações sobre a Carteira Digital de Benefícios Sociais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Versão:</strong> 1.0.0</p>
                  <p><strong>Desenvolvido com:</strong> Next.js, React, TypeScript, Tailwind CSS</p>
                  <p><strong>Objetivo:</strong> Facilitar o acesso e gestão de benefícios sociais</p>
                  <p className="text-muted-foreground">
                    Esta é uma aplicação demonstrativa desenvolvida para fins educacionais e de acessibilidade.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}