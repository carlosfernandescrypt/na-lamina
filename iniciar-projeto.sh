#!/bin/bash

echo "🚀 INICIANDO SISTEMA DE BARBEARIA - MODO COMPLETO"
echo "=================================================="

# Função para verificar se uma porta está em uso
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Porta $1 já está em uso!"
        return 1
    else
        return 0
    fi
}

# Verificar portas
echo "🔍 Verificando portas disponíveis..."
check_port 8080 && BACKEND_PORT_OK=true || BACKEND_PORT_OK=false
check_port 3000 && FRONTEND_PORT_OK=true || FRONTEND_PORT_OK=false

if [ "$BACKEND_PORT_OK" = false ] || [ "$FRONTEND_PORT_OK" = false ]; then
    echo "❌ Algumas portas estão ocupadas. Execute ./parar-projeto.sh primeiro."
    exit 1
fi

# Iniciar Backend
echo ""
echo "🔧 INICIANDO BACKEND (Spring Boot)..."
echo "Porta: http://localhost:8080"
echo "Base de dados: H2 (em memória)"
echo ""

# Iniciar backend em background
nohup mvn spring-boot:run > backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > backend.pid

# Aguardar backend inicializar
echo "⏳ Aguardando backend inicializar..."
sleep 15

# Verificar se backend está rodando
if ps -p $BACKEND_PID > /dev/null; then
    echo "✅ Backend iniciado com sucesso! PID: $BACKEND_PID"
else
    echo "❌ Erro ao iniciar backend. Verifique backend.log"
    exit 1
fi

# Iniciar Frontend
echo ""
echo "🎨 INICIANDO FRONTEND (React)..."
echo "Porta: http://localhost:3000"
echo "Modo: DEMO (dados simulados)"
echo ""

cd frontend

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências do frontend..."
    npm install
fi

# Iniciar frontend em background
nohup npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > ../frontend.pid

cd ..

# Aguardar frontend inicializar
echo "⏳ Aguardando frontend inicializar..."
sleep 20

# Verificar se frontend está rodando
if ps -p $FRONTEND_PID > /dev/null; then
    echo "✅ Frontend iniciado com sucesso! PID: $FRONTEND_PID"
else
    echo "❌ Erro ao iniciar frontend. Verifique frontend.log"
    exit 1
fi

echo ""
echo "🎉 SISTEMA INICIADO COM SUCESSO!"
echo "================================"
echo ""
echo "📱 FRONTEND: http://localhost:3000"
echo "   - Interface do usuário"
echo "   - Sistema de agendamento"
echo "   - Dashboard do barbeiro"
echo ""
echo "🔧 BACKEND: http://localhost:8080"
echo "   - API REST"
echo "   - Base de dados H2"
echo "   - Console H2: http://localhost:8080/h2-console"
echo ""
echo "📋 LOGS:"
echo "   - Backend: tail -f backend.log"
echo "   - Frontend: tail -f frontend.log"
echo ""
echo "🛑 Para parar: ./parar-projeto.sh"
echo ""
echo "✨ Sistema pronto para demonstração!" 