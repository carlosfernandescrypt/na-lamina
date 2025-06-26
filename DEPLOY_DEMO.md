# 🎓 Deploy de Demonstração - Vercel

## 📋 Para o Professor

Este é um sistema de barbearia desenvolvido como projeto acadêmico. O frontend está configurado para funcionar em **modo demonstração** com dados mockados, não sendo necessário backend para a apresentação.

## 🚀 Como fazer o deploy na Vercel

### 1. Acesse a Vercel
- Vá para: https://vercel.com
- Faça login com GitHub

### 2. Importe o projeto
- Clique em **"New Project"**
- Conecte seu GitHub (se ainda não conectado)
- Selecione o repositório **"na-lamina"**

### 3. Configurações automáticas
A Vercel detectará automaticamente:
```
Framework Preset: Create React App
Root Directory: frontend
Build Command: npm run build
Output Directory: build
Install Command: npm install
```

### 4. Deploy
- Clique em **"Deploy"**
- Aguarde 2-3 minutos
- ✅ Site estará online!

## 🎯 Funcionalidades de demonstração

### ✅ O que funciona:
- **Homepage** completa com informações da barbearia
- **Agendamento de serviços** (dados mockados)
- **Consulta de agendamentos** (simulação)
- **Lista de serviços** com preços
- **Login de barbeiros** (qualquer login/senha funciona)
- **Dashboard do barbeiro** (interface completa)
- **Design responsivo** para mobile/desktop

### 📱 Interface completa:
- Navigation bar responsiva
- Cards informativos
- Formulários funcionais
- Design moderno com Material-UI
- Animações e feedbacks visuais

## 🔧 Modo demonstração

O sistema está configurado com `DEMO_MODE = true` em `frontend/src/services/api.js`, que:

- **Simula dados do backend** sem precisar de servidor
- **Responses com delay** para parecer real
- **Dados pré-carregados**: 6 tipos de serviços, 3 barbeiros
- **Todas as telas funcionais** para demonstração

## 📊 Dados de demonstração

### Serviços disponíveis:
- Corte Masculino - R$ 25,00
- Barba - R$ 15,00  
- Bigode - R$ 10,00
- Sobrancelha - R$ 12,00
- Corte + Barba - R$ 35,00
- Corte Degradê - R$ 30,00

### Barbeiros cadastrados:
- João Silva
- Pedro Santos  
- Carlos Lima

## 🎬 Para a apresentação

### Fluxo sugerido:
1. **Homepage** - Mostrar design e informações
2. **Agendar Serviço** - Demonstrar formulário completo
3. **Consultar Agendamento** - Mostrar busca por email
4. **Lista de Serviços** - Exibir catálogo
5. **Login de Barbeiro** - Acessar dashboard
6. **Dashboard** - Mostrar área administrativa

### URLs importantes:
- **Homepage**: `/`
- **Agendamento**: `/agendar`
- **Consulta**: `/consultar`
- **Serviços**: `/servicos`
- **Login**: `/login`

## 💡 Vantagens desta abordagem

- ✅ **Deploy rápido** (2-3 minutos)
- ✅ **Não precisa de backend** em produção
- ✅ **Todas as telas funcionais**
- ✅ **Design profissional**
- ✅ **Gratuito na Vercel**
- ✅ **URL personalizada**
- ✅ **SSL automático**

## 🔗 Resultado final

Após o deploy, você terá:
- **URL pública**: `https://barbearia-[nome].vercel.app`
- **Sistema completamente funcional** para demonstração
- **Interface responsiva** para qualquer dispositivo
- **Performance otimizada** com CDN global

---

**🎯 Perfeito para apresentação acadêmica!** 