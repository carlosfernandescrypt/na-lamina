package com.barbearia.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HomeController {

    @GetMapping("/")
    @ResponseBody
    public String home() {
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <title>Sistema de Barbearia - API</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                h1 { color: #333; }
                h2 { color: #666; }
                .endpoint { background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 5px; }
                .method { background: #007bff; color: white; padding: 4px 8px; border-radius: 3px; font-size: 12px; }
                .method.get { background: #28a745; }
                .method.post { background: #007bff; }
                .method.put { background: #ffc107; }
                .method.delete { background: #dc3545; }
            </style>
        </head>
        <body>
            <h1>Sistema de Barbearia - API REST</h1>
            <p>Bem-vindo à API do sistema de agendamento de barbearia!</p>
            
            <h2>Endpoints Disponíveis</h2>
            
            <div class="endpoint">
                <span class="method get">GET</span> <strong>/api/servicos</strong>
                <p>Lista todos os serviços ativos</p>
            </div>
            
            <div class="endpoint">
                <span class="method get">GET</span> <strong>/api/servicos/{id}</strong>
                <p>Busca um serviço específico por ID</p>
            </div>
            
            <div class="endpoint">
                <span class="method post">POST</span> <strong>/api/servicos</strong>
                <p>Cria um novo serviço</p>
            </div>
            
            <div class="endpoint">
                <span class="method get">GET</span> <strong>/api/clientes</strong>
                <p>Lista todos os clientes ativos</p>
            </div>
            
            <div class="endpoint">
                <span class="method get">GET</span> <strong>/api/barbeiros</strong>
                <p>Lista todos os barbeiros ativos</p>
            </div>
            
            <div class="endpoint">
                <span class="method get">GET</span> <strong>/api/agendamentos</strong>
                <p>Lista todos os agendamentos</p>
            </div>
            
            <div class="endpoint">
                <span class="method post">POST</span> <strong>/api/agendamentos</strong>
                <p>Cria um novo agendamento</p>
            </div>
            
            <h2>Banco de Dados H2</h2>
            <p><a href="/h2-console" target="_blank">Acessar Console H2</a></p>
            <p><strong>JDBC URL:</strong> jdbc:h2:mem:barbearia</p>
            <p><strong>Username:</strong> sa</p>
            <p><strong>Password:</strong> (deixar em branco)</p>
            
            <h2>Status da Aplicação</h2>
            <p>✅ Aplicação rodando com sucesso!</p>
            <p>🚀 Pronto para receber requisições</p>
        </body>
        </html>
        """;
    }
    
    @GetMapping("/api/status")
    @ResponseBody
    public String status() {
        return "{ \"status\": \"OK\", \"aplicacao\": \"Sistema Barbearia\", \"versao\": \"1.0.0\" }";
    }
} 