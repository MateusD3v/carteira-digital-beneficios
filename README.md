# Carteira Digital de Benefícios Sociais

Uma aplicação web progressiva (PWA) para facilitar o acesso a auxílios, bolsas e programas do governo, especialmente desenvolvida para populações em áreas com conectividade limitada.

## Características Principais

- **Funcionamento Offline**: Acesse suas informações mesmo sem conexão com a internet
- **Sincronização Automática**: Dados são sincronizados quando a conexão é restabelecida
- **Interface Acessível**: Design inclusivo com suporte a diferentes níveis de alfabetização
- **Gestão de Documentos**: Armazene documentos importantes de forma segura
- **Alertas de Recadastro**: Receba notificações sobre prazos importantes

## Público-Alvo

- Famílias de baixa renda
- Comunidades indígenas
- Comunidades ribeirinhas
- Áreas rurais com conectividade limitada

## Tecnologias Utilizadas

- **Next.js**: Framework React para renderização do lado do servidor
- **TypeScript**: Tipagem estática para código mais seguro
- **Tailwind CSS**: Framework CSS utilitário para design responsivo
- **Shadcn/UI**: Componentes de UI acessíveis e customizáveis
- **Next-PWA**: Suporte a Progressive Web App

## Funcionalidades

### Consulta de Benefícios
- Visualização de benefícios ativos
- Status de pagamentos
- Datas importantes

### Alertas de Recadastro
- Notificações de prazos
- Lembretes de documentação necessária
- Calendário de recadastramento

### Documentos Digitalizados
- Armazenamento seguro com criptografia local
- Compressão inteligente para economizar espaço
- Backup na nuvem quando conectado

### Sincronização de Dados
- Funcionamento offline com cache local
- Sincronização automática quando conectado
- Indicador de status de conexão

## Requisitos Especiais

### Culturais
- Respeito às variações linguísticas
- Preservação de dialetos locais
- Interface culturalmente sensível

### Técnicos
- Baixo consumo de bateria
- Interface para diferentes níveis de alfabetização
- Componentes otimizados para dispositivos de baixo desempenho

## Como Executar o Projeto

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Construir para produção
npm run build

# Iniciar versão de produção
npm start
```

## Acessibilidade

O projeto foi desenvolvido seguindo as diretrizes WCAG para garantir acessibilidade, incluindo:

- Contraste adequado
- Navegação por teclado
- Compatibilidade com leitores de tela
- Suporte a LIBRAS
- Áudio descritivo

## Licença

Este projeto está licenciado sob a licença MIT.