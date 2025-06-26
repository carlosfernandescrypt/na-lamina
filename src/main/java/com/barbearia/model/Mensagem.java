package com.barbearia.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "mensagens")
public class Mensagem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Conteúdo da mensagem é obrigatório")
    @Column(name = "conteudo", nullable = false, length = 1000)
    private String conteudo;
    
    @Column(name = "data_envio", nullable = false)
    private LocalDateTime dataEnvio;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agendamento_id")
    private Agendamento agendamento;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destinatario_id")
    private Barbeiro destinatario;
    
    @Column(name = "lida")
    private Boolean lida = false;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo")
    private TipoMensagem tipo;
    
    public Mensagem() {
        this.dataEnvio = LocalDateTime.now();
    }
    
    public Mensagem(String conteudo, Agendamento agendamento, Barbeiro destinatario, TipoMensagem tipo) {
        this();
        this.conteudo = conteudo;
        this.agendamento = agendamento;
        this.destinatario = destinatario;
        this.tipo = tipo;
    }
    
    // Métodos especificados
    public void notificarCliente(String conteudo) {
        if (agendamento != null && agendamento.getCliente() != null) {
            // Aqui seria implementada a notificação real (email, SMS, etc.)
            // Por enquanto, apenas salva a mensagem
            this.conteudo = conteudo;
            this.dataEnvio = LocalDateTime.now();
        }
    }
    
    public String getInfoMensagem() {
        return String.format(
            "Data: %s | Tipo: %s | Conteúdo: %s | Lida: %s",
            dataEnvio.toString(),
            tipo != null ? tipo.getDescricao() : "N/A",
            conteudo,
            lida ? "Sim" : "Não"
        );
    }
    
    public void marcarComoLida() {
        this.lida = true;
    }
    
    // Getters e Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getConteudo() {
        return conteudo;
    }
    
    public void setConteudo(String conteudo) {
        this.conteudo = conteudo;
    }
    
    public LocalDateTime getDataEnvio() {
        return dataEnvio;
    }
    
    public void setDataEnvio(LocalDateTime dataEnvio) {
        this.dataEnvio = dataEnvio;
    }
    
    public Agendamento getAgendamento() {
        return agendamento;
    }
    
    public void setAgendamento(Agendamento agendamento) {
        this.agendamento = agendamento;
    }
    
    public Barbeiro getDestinatario() {
        return destinatario;
    }
    
    public void setDestinatario(Barbeiro destinatario) {
        this.destinatario = destinatario;
    }
    
    public Boolean getLida() {
        return lida;
    }
    
    public void setLida(Boolean lida) {
        this.lida = lida;
    }
    
    public TipoMensagem getTipo() {
        return tipo;
    }
    
    public void setTipo(TipoMensagem tipo) {
        this.tipo = tipo;
    }
} 