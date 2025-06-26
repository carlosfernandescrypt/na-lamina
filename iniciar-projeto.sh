#!/bin/bash

echo "🚀 Iniciando Sistema de Barbearia..."

# Função para verificar se um comando existe
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 não está instalado!"
        exit 1
    fi
}

# Verificar dependências
echo "🔍 Verificando dependências..."
check_command "java"
check_command "mvn"
check_command "node"
check_command "npm"

echo "✅ Todas as dependências estão instaladas!"

# Instalar dependências do frontend se necessário
echo "📦 Instalando dependências do frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
fi
cd ..

echo "🔄 Iniciando serviços..."

# Iniciar backend em background
echo "🖥️  Iniciando backend Spring Boot..."
mvn spring-boot:run > backend.log 2>&1 &
BACKEND_PID=$!

# Aguardar backend iniciar
echo "⏳ Aguardando backend inicializar..."
sleep 15

# Iniciar frontend em background
echo "🌐 Iniciando frontend React..."
cd frontend
npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo "⏳ Aguardando frontend inicializar..."
sleep 10

echo ""
echo "🎉 Sistema iniciado com sucesso!"
echo ""
echo "📍 URLs de acesso:"
echo "   • Frontend: http://localhost:3000"
echo "   • Backend:  http://localhost:8080"
echo "   • Console H2: http://localhost:8080/h2-console"
echo ""
echo "🔑 Credenciais de teste:"
echo "   • Login: joao_silva"
echo "   • Senha: 123456"
echo ""
echo "📜 Para parar os serviços:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "📊 Logs dos serviços:"
echo "   • Backend: tail -f backend.log"
echo "   • Frontend: tail -f frontend.log"
echo ""

# Salvar PIDs em arquivo
echo "$BACKEND_PID" > .backend.pid
echo "$FRONTEND_PID" > .frontend.pid

echo "✅ PIDs salvos para facilitar o encerramento!" 