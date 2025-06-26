# 🎯 Divisão da Apresentação - Sistema de Barbearia
**Disciplina:** Programação Web  
**Grupo:** Carlos, Vitor, Vinícius e Luiz  
**Projeto:** Sistema Completo de Agendamento para Barbearia (Spring Boot + React)

---

## 👥 **CARLOS** - Backend & Arquitetura
### 🎯 **Responsabilidade:** Fundação e Lógica de Negócio

#### **O que apresentar:**
1. **🏗️ Arquitetura Geral do Sistema**
   - Explicar a arquitetura MVC com Spring Boot
   - Mostrar a separação entre frontend e backend
   - Demonstrar a comunicação via API REST

2. **💾 Modelagem do Banco de Dados**
   - Apresentar as entidades: `Agendamento`, `Barbeiro`, `Cliente`, `TipoServico`, `Mensagem`
   - Explicar os relacionamentos entre as tabelas
   - Mostrar o uso do H2 Database em memória

3. **🔧 Configurações do Spring Boot**
   - `SecurityConfig.java` - Configuração de segurança e CORS
   - `application.properties` - Configurações da aplicação
   - Demonstrar o sistema de inicialização automática dos dados

4. **📊 Demonstração Prática**
   - Mostrar o console H2 (`http://localhost:8080/h2-console`)
   - Executar algumas queries no banco
   - Demonstrar logs do Hibernate

#### **Arquivos principais:** `pom.xml`, `application.properties`, entidades em `model/`, `config/`

---

## 🎮 **VITOR** - APIs e Controllers
### 🎯 **Responsabilidade:** Endpoints e Comunicação

#### **O que apresentar:**
1. **🚀 APIs REST Implementadas**
   - Demonstrar todos os endpoints criados (20+ endpoints)
   - Explicar os métodos HTTP (GET, POST, PUT, DELETE)
   - Mostrar a estrutura RESTful das URLs

2. **🎛️ Controllers em Detalhes**
   - `AgendamentoController` - Gerenciamento de agendamentos
   - `BarbeiroController` - Autenticação e gestão de barbeiros
   - `ClienteController` - CRUD de clientes
   - `TipoServicoController` - Catálogo de serviços

3. **🔄 Testes das APIs**
   - Usar Postman ou curl para demonstrar endpoints
   - Mostrar respostas JSON das APIs
   - Demonstrar tratamento de erros e validações

4. **📱 Integração Frontend-Backend**
   - Explicar como o React consome as APIs
   - Mostrar exemplos de requisições AJAX
   - Demonstrar o fluxo de dados

#### **Demonstração prática:** Testar APIs em tempo real durante a apresentação

#### **Arquivos principais:** `controller/`, `repository/`, `service/`

---

## 🎨 **VINÍCIUS** - Frontend & Interface
### 🎯 **Responsabilidade:** React e Experiência do Usuário

#### **O que apresentar:**
1. **⚛️ Estrutura do React**
   - Explicar a arquitetura de componentes
   - Mostrar o sistema de roteamento com React Router
   - Demonstrar o uso de hooks (useState, useEffect)

2. **🎨 Design e Material UI**
   - Apresentar o tema personalizado criado
   - Mostrar componentes responsivos
   - Demonstrar a consistência visual do sistema

3. **📱 Páginas para Clientes**
   - **Home**: Página inicial com apresentação da barbearia
   - **Agendar Serviço**: Formulário completo de agendamento
   - **Consultar Agendamento**: Busca e visualização de agendamentos
   - **Listar Serviços**: Catálogo visual dos serviços

4. **💻 Demonstração Interativa**
   - Navegar pelo site ao vivo
   - Demonstrar responsividade (mobile/desktop)
   - Mostrar validações em tempo real
   - Testar o fluxo completo de agendamento

#### **Destaque:** Mostrar como um cliente real usaria o sistema

#### **Arquivos principais:** `App.js`, `components/`, `pages/` (Home, AgendarServico, ConsultarAgendamento, ListarServicos)

---

## 🛠️ **LUIZ** - Dashboard Administrativo & Funcionalidades Avançadas
### 🎯 **Responsabilidade:** Área Administrativa e Recursos Especiais

#### **O que apresentar:**
1. **🔐 Sistema de Autenticação**
   - Demonstrar login de barbeiros
   - Explicar o sistema de sessões
   - Mostrar proteção de rotas administrativas

2. **📊 Dashboard Administrativo**
   - Apresentar estatísticas em tempo real
   - Mostrar gestão de agendamentos pendentes
   - Demonstrar aprovação/recusa de agendamentos

3. **💬 Sistema de Mensagens**
   - Explicar o sistema de notificações
   - Mostrar contador de mensagens não lidas
   - Demonstrar comunicação entre barbeiros e sistema

4. **⚙️ Funcionalidades Avançadas**
   - Cálculo automático de valores
   - Sistema de cancelamento com motivos
   - Filtros e busca por data/status
   - Validações e tratamento de erros

5. **🎯 Demonstração Prática Completa**
   - Login como barbeiro (`joao_silva` / `123456`)
   - Gerenciar agendamentos do dashboard
   - Aprovar/recusar agendamentos
   - Mostrar fluxo administrativo completo

#### **Destaque:** Demonstrar como um barbeiro gerenciaria seu negócio

#### **Arquivos principais:** `LoginBarbeiro.js`, `DashboardBarbeiro.js`, `services/api.js`, `Navbar.js`

---

## 🎤 **Roteiro Sugerido de Apresentação (20-25 min)**

### **1. Introdução (2 min) - CARLOS**
- Apresentar o projeto e objetivos
- Explicar a tecnologia escolhida (Spring Boot + React)

### **2. Backend e Arquitetura (6 min) - CARLOS**
- Mostrar arquitetura e banco de dados
- Demonstrar console H2 e estrutura

### **3. APIs e Comunicação (5 min) - VITOR**
- Testar endpoints importantes
- Mostrar integração frontend-backend

### **4. Interface do Cliente (6 min) - VINÍCIUS**
- Navegar pelas páginas públicas
- Demonstrar agendamento completo

### **5. Dashboard Administrativo (6 min) - LUIZ**
- Login e gestão de agendamentos
- Mostrar funcionalidades administrativas

### **6. Conclusão e Perguntas (2-3 min) - TODOS**
- Resumir conquistas do projeto
- Responder perguntas dos professores

---

## 📋 **Checklist para Cada Apresentador**

### **Todos devem saber:**
- ✅ Tecnologias utilizadas (Spring Boot, React, Material UI, H2)
- ✅ Estrutura geral do projeto
- ✅ Como rodar o sistema (`mvn spring-boot:run` + `npm start`)

### **Dados importantes:**
- **Backend:** `http://localhost:8080`
- **Frontend:** `http://localhost:3000`
- **Login teste:** `joao_silva` / `123456`
- **Console H2:** `http://localhost:8080/h2-console` (User: `sa`, Password: `password`)

### **Arquivos para demonstrar:**
- **Carlos:** Entidades, configurações, banco
- **Vitor:** Controllers, services, APIs
- **Vinícius:** Componentes React, páginas públicas
- **Luiz:** Dashboard, autenticação, funcionalidades avançadas

---

## 🏆 **Pontos Fortes para Destacar**

1. **💯 Sistema Completo e Funcional**
   - Frontend + Backend totalmente integrados
   - Todas as funcionalidades implementadas

2. **🎨 Design Profissional**
   - Interface moderna e responsiva
   - Experiência de usuário excelente

3. **🔧 Boas Práticas de Desenvolvimento**
   - Arquitetura MVC bem estruturada
   - Código organizado e documentado
   - APIs RESTful seguindo padrões

4. **📊 Funcionalidades Avançadas**
   - Sistema de autenticação
   - Dashboard administrativo
   - Validações e tratamento de erros
   - Responsividade total

5. **⚡ Tecnologias Modernas**
   - Spring Boot 3.2 (mais recente)
   - React 18 com hooks
   - Material UI 5
   - H2 Database

---

**🎯 Meta:** Demonstrar um sistema profissional que poderia ser usado por uma barbearia real!

**🚀 Boa sorte na apresentação!** 