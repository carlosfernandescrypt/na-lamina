#!/bin/bash

echo "🛑 PARANDO SISTEMA DE BARBEARIA"
echo "==============================="

# Função para parar processo por PID
stop_process() {
    local pid_file=$1
    local service_name=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null; then
            echo "🔴 Parando $service_name (PID: $pid)..."
            kill $pid
            sleep 3
            if ps -p $pid > /dev/null; then
                echo "⚠️  Forçando parada do $service_name..."
                kill -9 $pid
            fi
            echo "✅ $service_name parado com sucesso!"
        else
            echo "ℹ️  $service_name já estava parado."
        fi
        rm -f "$pid_file"
    else
        echo "ℹ️  Arquivo PID do $service_name não encontrado."
    fi
}

# Parar processos por porta (fallback)
stop_by_port() {
    local port=$1
    local service_name=$2
    
    local pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
        echo "🔴 Parando $service_name na porta $port (PID: $pid)..."
        kill $pid
        sleep 2
        if lsof -ti:$port > /dev/null; then
            echo "⚠️  Forçando parada na porta $port..."
            kill -9 $pid
        fi
        echo "✅ $service_name na porta $port parado!"
    fi
}

# Parar Frontend
echo "🎨 Parando Frontend..."
stop_process "frontend.pid" "Frontend"
stop_by_port "3000" "Frontend"

# Parar Backend
echo "🔧 Parando Backend..."
stop_process "backend.pid" "Backend"
stop_by_port "8080" "Backend"

# Limpar logs antigos
echo ""
echo "🧹 Limpando logs..."
rm -f backend.log frontend.log

echo ""
echo "✅ SISTEMA PARADO COM SUCESSO!"
echo "=============================="
echo ""
echo "Para reiniciar: ./iniciar-projeto.sh" 