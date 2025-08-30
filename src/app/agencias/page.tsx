import { MainNav } from "@/components/main-nav";
import { BankLocator } from "@/components/bank-locator";

export default function AgenciasPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 p-6 md:p-10">
        <div className="container mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-4">Localizador de Agências</h1>
            <p className="text-xl text-muted-foreground">Encontre a agência bancária mais próxima para receber seus benefícios</p>
          </div>
          
          <BankLocator />
          
          <div className="mt-12 p-6 bg-muted rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Informações Importantes</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Verifique os horários de funcionamento antes de se dirigir à agência</li>
              <li>Leve um documento de identificação com foto</li>
              <li>Para saque de benefícios, leve também o cartão do programa</li>
              <li>Em caso de dúvidas, entre em contato com a central de atendimento do seu banco</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}