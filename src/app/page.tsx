import { MainNav } from "@/components/main-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Bell, CreditCard, MapPin } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 p-6 md:p-10 bg-gradient-to-b from-background to-background/80">
        <div className="container mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent inline-block">Carteira Digital de Benefícios Sociais</h1>
            <p className="text-xl text-muted-foreground">Facilite o acesso a auxílios, bolsas e programas do governo</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <Link href="/beneficios" className="block">
              <Card className="card-hover-effect border-t-4 border-t-blue-500 h-full">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-blue-500" />
                    <CardTitle>Consulta de Benefícios</CardTitle>
                  </div>
                  <CardDescription>Verifique seus benefícios ativos e status de pagamentos</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Acesse informações sobre:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Auxílio Brasil/Bolsa Família</li>
                    <li>BPC (Benefício de Prestação Continuada)</li>
                    <li>Seguro Defeso</li>
                    <li>Auxílio Emergencial</li>
                  </ul>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/configuracoes" className="block">
              <Card className="card-hover-effect border-t-4 border-t-amber-500 h-full">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-amber-500" />
                    <CardTitle>Alertas de Recadastro</CardTitle>
                  </div>
                  <CardDescription>Receba notificações sobre prazos importantes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Fique por dentro de:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Datas de recadastramento</li>
                    <li>Prazos para atualização de dados</li>
                    <li>Períodos de saque</li>
                    <li>Novas oportunidades de benefícios</li>
                  </ul>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/documentos" className="block">
              <Card className="card-hover-effect border-t-4 border-t-green-500 h-full">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-green-500" />
                    <CardTitle>Documentos Digitalizados</CardTitle>
                  </div>
                  <CardDescription>Armazene seus documentos importantes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Guarde documentos como:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>RG e CPF</li>
                    <li>Comprovantes de residência</li>
                    <li>Comprovantes de renda</li>
                    <li>Certidões e outros documentos</li>
                  </ul>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/agencias" className="block">
              <Card className="card-hover-effect border-t-4 border-t-purple-500 h-full">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-purple-500" />
                    <CardTitle>Agências Próximas</CardTitle>
                  </div>
                  <CardDescription>Localize agências bancárias para receber seus benefícios</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Encontre facilmente:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Agências da Caixa Econômica</li>
                    <li>Agências do Banco do Brasil</li>
                    <li>Lotéricas credenciadas</li>
                    <li>Correspondentes bancários</li>
                  </ul>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}