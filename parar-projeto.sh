#!/bin/bash

echo "🛑 Parando Sistema de Barbearia..."

# Parar pelo PID salvo
if [ -f .backend.pid ]; then
    BACKEND_PID=$(cat .backend.pid)
    echo "🖥️  Parando backend (PID: $BACKEND_PID)..."
    kill $BACKEND_PID 2>/dev/null || echo "Backend já estava parado"
    rm .backend.pid
fi

if [ -f .frontend.pid ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    echo "🌐 Parando frontend (PID: $FRONTEND_PID)..."
    kill $FRONTEND_PID 2>/dev/null || echo "Frontend já estava parado"
    rm .frontend.pid
fi

# Parar processos Java e Node relacionados ao projeto
echo "🔍 Procurando por processos restantes..."

# Parar Spring Boot
JAVA_PIDS=$(ps aux | grep java | grep barbearia | awk '{print $2}')
for pid in $JAVA_PIDS; do
    echo "🖥️  Parando processo Java: $pid"
    kill $pid 2>/dev/null
done

# Parar processos Node na porta 3000
NODE_PIDS=$(lsof -ti:3000 2>/dev/null)
for pid in $NODE_PIDS; do
    echo "🌐 Parando processo Node na porta 3000: $pid"
    kill $pid 2>/dev/null
done

# Parar processos na porta 8080
TOMCAT_PIDS=$(lsof -ti:8080 2>/dev/null)
for pid in $TOMCAT_PIDS; do
    echo "🖥️  Parando processo na porta 8080: $pid"
    kill $pid 2>/dev/null
done

echo ""
echo "✅ Todos os serviços foram parados!"
echo ""
echo "🗂️  Logs salvos em:"
echo "   • backend.log"
echo "   • frontend.log"
echo "" 