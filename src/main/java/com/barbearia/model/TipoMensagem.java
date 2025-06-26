package com.barbearia.model;

public enum TipoMensagem {
    AGENDAMENTO_CRIADO("Agendamento Criado"),
    AGENDAMENTO_CONFIRMADO("Agendamento Confirmado"),
    AGENDAMENTO_CANCELADO("Agendamento Cancelado"),
    AGENDAMENTO_RECUSADO("Agendamento Recusado"),
    LEMBRETE_AGENDAMENTO("Lembrete de Agendamento"),
    NOTIFICACAO_GERAL("Notificação Geral");
    
    private final String descricao;
    
    TipoMensagem(String descricao) {
        this.descricao = descricao;
    }
    
    public String getDescricao() {
        return descricao;
    }
} 