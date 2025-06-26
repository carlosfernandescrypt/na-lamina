# Frontend - Sistema de Barbearia

Este é o frontend do sistema de agendamento da barbearia, desenvolvido em React.js com Material UI.

## 🚀 Funcionalidades

### Para Clientes
- **Página Inicial**: Apresentação da barbearia e serviços
- **Agendar Serviço**: Formulário completo para agendamento online
- **Consultar Agendamento**: Consulta de agendamentos por email
- **Listar Serviços**: Catálogo de serviços com preços e duração
- **Cancelar Agendamento**: Possibilidade de cancelar agendamentos

### Para Barbeiros
- **Login**: Sistema de autenticação
- **Dashboard**: Painel administrativo com estatísticas
- **Gerenciar Agendamentos**: Aprovar/recusar agendamentos pendentes
- **Agenda do Dia**: Visualizar agendamentos confirmados
- **Notificações**: Sistema de mensagens e alertas

## 🛠️ Tecnologias Utilizadas

- **React.js 18**: Framework JavaScript
- **Material UI 5**: Biblioteca de componentes
- **React Router Dom**: Roteamento
- **Axios**: Cliente HTTP
- **React Toastify**: Notificações
- **Date-fns**: Manipulação de datas
- **MUI Lab**: Componentes experimentais (DateTimePicker)

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Passos para executar

1. **Navegue até o diretório do frontend**
   ```bash
   cd frontend
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o servidor de desenvolvimento**
   ```bash
   npm start
   ```

4. **Acesse a aplicação**
   ```
   http://localhost:3000
   ```

## 🏗️ Estrutura do Projeto

```
frontend/
├── public/
│   ├── index.html          # HTML principal
│   ├── manifest.json       # Configuração PWA
│   └── favicon.ico         # Ícone da aplicação
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   └── Navbar.js       # Barra de navegação
│   ├── pages/              # Páginas da aplicação
│   │   ├── Home.js         # Página inicial
│   │   ├── AgendarServico.js    # Agendamento de serviços
│   │   ├── ConsultarAgendamento.js # Consulta de agendamentos
│   │   ├── ListarServicos.js    # Lista de serviços
│   │   ├── LoginBarbeiro.js     # Login do barbeiro
│   │   └── DashboardBarbeiro.js # Dashboard do barbeiro
│   ├── services/          # Serviços de API
│   │   └── api.js         # Configuração Axios e endpoints
│   ├── App.js             # Componente principal
│   ├── index.js           # Ponto de entrada
│   ├── index.css          # Estilos globais
│   └── reportWebVitals.js # Métricas de performance
├── package.json           # Dependências e scripts
└── README.md              # Documentação
```

## 🎨 Design e UX

### Tema
- **Cores primárias**: Azul (#667eea) e Roxo (#764ba2)
- **Tipografia**: Roboto (Google Fonts)
- **Estilo**: Material Design com customizações

### Responsividade
- Design mobile-first
- Adaptação automática para diferentes tamanhos de tela
- Menu hambúrguer em dispositivos móveis

### Acessibilidade
- Contraste adequado de cores
- Navegação por teclado
- Labels descritivos
- Feedbacks visuais e sonoros

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm start

# Build para produção
npm run build

# Testes
npm test

# Ejetar configuração (irreversível)
npm run eject
```

## 🌐 API Integration

O frontend se comunica com o backend através de:

- **Base URL**: `http://localhost:8080/api`
- **Endpoints principais**:
  - `/servicos` - Gerenciamento de serviços
  - `/barbeiros` - Dados dos barbeiros
  - `/clientes` - Gerenciamento de clientes
  - `/agendamentos` - Sistema de agendamentos
  - `/mensagens` - Sistema de mensagens

## 📱 PWA (Progressive Web App)

O aplicativo suporta:
- Instalação no dispositivo
- Funcionamento offline (cache básico)
- Notificações push (futuro)
- Ícones e temas personalizados

## 🔒 Autenticação

### Barbeiros
- Login com usuário e senha
- Sessão mantida no localStorage
- Redirecionamento automático se não autenticado
- Logout com limpeza de dados

### Clientes
- Sem necessidade de login
- Identificação por email nos agendamentos

## 📋 Funcionalidades Detalhadas

### 1. Agendamento de Serviços
- Seleção múltipla de serviços
- Escolha do barbeiro
- Seletor de data e hora
- Cálculo automático do valor total
- Validação de formulário

### 2. Consulta de Agendamentos
- Busca por email
- Visualização de todos os agendamentos
- Status coloridos (Pendente, Confirmado, etc.)
- Opção de cancelamento

### 3. Dashboard do Barbeiro
- Estatísticas em tempo real
- Lista de agendamentos pendentes
- Agenda do dia
- Aprovação/rejeição de agendamentos

## 🚀 Deploy

### Build para Produção
```bash
npm run build
```

### Configurações de Ambiente
- Desenvolvimento: `http://localhost:8080`
- Produção: Configurar variável de ambiente

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 📞 Suporte

Para dúvidas e suporte:
- Email: suporte@barbearia.com
- Documentação: [Link para docs]
- Issues: [GitHub Issues] 