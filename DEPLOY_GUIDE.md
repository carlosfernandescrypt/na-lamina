# 🚀 Guia de Deploy - Sistema de Barbearia

## 📋 Visão Geral

Este guia explica como fazer o deploy do sistema de barbearia usando:
- **Frontend (React)**: Vercel
- **Backend (Spring Boot)**: Heroku/Railway (recomendado)

## 🎯 Estratégia de Deploy

### Frontend na Vercel ✅
- Deploy automático via GitHub
- CDN global
- Domínio personalizado gratuito
- SSL automático

### Backend no Heroku/Railway ✅
- Deploy automático via GitHub
- Banco PostgreSQL gratuito
- Logs e monitoramento

## 🔧 1. Preparação do Projeto

### ✅ Arquivos já configurados:
- `vercel.json` - Configuração Vercel
- `frontend/.env.example` - Variáveis de ambiente
- `src/main/resources/data.sql` - Dados corrigidos
- API configurada para produção

## 🚀 2. Deploy do Frontend (Vercel)

### Passo a Passo:

1. **Faça login na Vercel:**
   ```bash
   https://vercel.com
   ```

2. **Importe do GitHub:**
   - Clique em "New Project"
   - Conecte seu GitHub
   - Selecione o repositório `na-lamina`

3. **Configurações do projeto:**
   ```
   Framework Preset: Create React App
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

4. **Variáveis de ambiente:**
   ```
   REACT_APP_API_URL=https://sua-api.herokuapp.com/api
   REACT_APP_NAME=Sistema de Barbearia
   REACT_APP_VERSION=1.0.0
   ```

5. **Deploy:**
   - Clique em "Deploy"
   - Aguarde o build (2-3 minutos)

## 🗄️ 3. Deploy do Backend (Heroku)

### Opção A: Heroku (Recomendado)

1. **Criar app no Heroku:**
   ```bash
   # Instalar Heroku CLI
   npm install -g heroku
   
   # Login
   heroku login
   
   # Criar app
   heroku create barbearia-api-[seu-nome]
   ```

2. **Configurar buildpack:**
   ```bash
   heroku buildpacks:set heroku/java
   ```

3. **Configurar banco PostgreSQL:**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Configurar variáveis:**
   ```bash
   heroku config:set SPRING_PROFILES_ACTIVE=prod
   heroku config:set JAVA_OPTS="-Xmx300m -Xms200m"
   ```

5. **Deploy:**
   ```bash
   git subtree push --prefix . heroku main
   ```

### Opção B: Railway (Alternativa)

1. **Conectar no Railway:**
   - Acesse `railway.app`
   - Conecte GitHub
   - Selecione o repositório

2. **Configurar:**
   - Root Directory: `/` (raiz)
   - Build Command: `mvn clean package`
   - Start Command: `java -jar target/barbearia-system-0.0.1-SNAPSHOT.jar`

## ⚙️ 4. Configurações de Produção

### Backend - application-prod.properties

Crie `src/main/resources/application-prod.properties`:

```properties
# Database PostgreSQL
spring.datasource.url=${DATABASE_URL}
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update

# Server
server.port=${PORT:8080}

# CORS
spring.web.cors.allowed-origins=${FRONTEND_URL:https://barbearia-app.vercel.app}

# Logs
logging.level.com.barbearia=INFO
logging.level.org.springframework=WARN
```

### Adicionar dependência PostgreSQL

No `pom.xml`, adicione:

```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

## 🔗 5. Conectando Frontend e Backend

### Atualizar URL da API

No arquivo `.env` da Vercel, configure:

```env
REACT_APP_API_URL=https://barbearia-api-[seu-nome].herokuapp.com/api
```

## ✅ 6. Verificação do Deploy

### Testes essenciais:

1. **Frontend funcionando:**
   ```bash
   https://seu-app.vercel.app
   ```

2. **Backend respondendo:**
   ```bash
   https://sua-api.herokuapp.com/api/status
   ```

3. **Integração funcionando:**
   - Listar serviços na página inicial
   - Fazer um agendamento teste
   - Login de barbeiro

## 🔧 7. Configurações Avançadas

### Domínio personalizado (Vercel)

1. Na dashboard da Vercel:
   - Project Settings > Domains
   - Add Domain: `seubarbearia.com`
   - Configure DNS conforme instruções

### Monitoramento

1. **Logs do Heroku:**
   ```bash
   heroku logs --tail
   ```

2. **Métricas da Vercel:**
   - Dashboard > Analytics
   - Core Web Vitals
   - Função de performance

## 🚨 8. Troubleshooting

### Problemas comuns:

1. **Build do frontend falha:**
   ```bash
   # Verificar se todas as dependências estão no package.json
   npm install
   npm run build
   ```

2. **API não responde:**
   ```bash
   # Verificar logs
   heroku logs --tail
   ```

3. **CORS errors:**
   ```bash
   # Verificar configuração CORS no backend
   # Adicionar domínio da Vercel nas allowed-origins
   ```

## 📊 9. URLs Finais

Após deploy completo:

- **Frontend**: `https://barbearia-app.vercel.app`
- **Backend**: `https://barbearia-api.herokuapp.com`
- **GitHub**: `https://github.com/seu-usuario/na-lamina`

## 🎉 10. Deploy Automatizado

### Configurar CI/CD:

1. **Auto-deploy habilitado:**
   - Vercel: Push na main → Deploy automático
   - Heroku: Push na main → Deploy automático

2. **Branches de staging:**
   - `develop` → Preview deploy (Vercel)
   - `main` → Production deploy

## 💡 Dicas Importantes

1. **Sempre teste localmente antes do deploy**
2. **Use variáveis de ambiente para configurações**
3. **Monitore logs regularmente**
4. **Mantenha backups do banco de dados**
5. **Configure alertas de erro**

---

**🚀 Com este guia, seu sistema estará online e acessível mundialmente!** 