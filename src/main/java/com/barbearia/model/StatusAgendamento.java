package com.barbearia.model;

public enum StatusAgendamento {
    PENDENTE("Pendente"),
    CONFIRMADO("Confirmado"),
    CANCELADO("Cancelado"),
    RECUSADO("Recusado"),
    CONCLUIDO("Concluído");
    
    private final String descricao;
    
    StatusAgendamento(String descricao) {
        this.descricao = descricao;
    }
    
    public String getDescricao() {
        return descricao;
    }
} 