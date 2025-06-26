package com.barbearia.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "agendamentos")
public class Agendamento {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "barbeiro_id", nullable = false)
    private Barbeiro barbeiro;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "agendamento_servicos",
        joinColumns = @JoinColumn(name = "agendamento_id"),
        inverseJoinColumns = @JoinColumn(name = "servico_id")
    )
    private List<TipoServico> servicos;
    
    @Column(name = "data_horario", nullable = false)
    private LocalDateTime dataHorario;
    
    @Column(name = "valor_total", nullable = false)
    private Double valorTotal;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StatusAgendamento status;
    
    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;
    
    @Column(name = "data_resposta")
    private LocalDateTime dataResposta;
    
    @Column(name = "observacoes")
    private String observacoes;
    
    @OneToMany(mappedBy = "agendamento", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Mensagem> mensagens;
    
    public Agendamento() {
        this.dataCriacao = LocalDateTime.now();
        this.status = StatusAgendamento.PENDENTE;
    }
    
    public Agendamento(Cliente cliente, Barbeiro barbeiro, List<TipoServico> servicos, 
                      LocalDateTime dataHorario, Double valorTotal) {
        this();
        this.cliente = cliente;
        this.barbeiro = barbeiro;
        this.servicos = servicos;
        this.dataHorario = dataHorario;
        this.valorTotal = valorTotal;
    }
    
    // Métodos especificados baseados na classe Servico do diagrama
    public boolean marcarServico() {
        if (cliente != null && barbeiro != null && servicos != null && 
            !servicos.isEmpty() && dataHorario != null) {
            
            // Verifica se o barbeiro está disponível
            int duracaoTotal = getDuracaoTotal();
            if (barbeiro.isDisponivel(dataHorario, duracaoTotal)) {
                this.status = StatusAgendamento.PENDENTE;
                return true;
            }
        }
        return false;
    }
    
    public void notificarCliente(String mensagem) {
        if (cliente != null) {
            Mensagem novaMensagem = new Mensagem(
                mensagem, 
                this, 
                barbeiro, 
                TipoMensagem.NOTIFICACAO_GERAL
            );
            novaMensagem.notificarCliente(mensagem);
        }
    }
    
    public String getInfoServico() {
        StringBuilder info = new StringBuilder();
        info.append("Agendamento ID: ").append(id).append("\n");
        info.append("Cliente: ").append(cliente != null ? cliente.getNomeCompleto() : "N/A").append("\n");
        info.append("Barbeiro: ").append(barbeiro != null ? barbeiro.getNome() : "N/A").append("\n");
        info.append("Data/Hora: ").append(dataHorario != null ? dataHorario.toString() : "N/A").append("\n");
        info.append("Status: ").append(status != null ? status.getDescricao() : "N/A").append("\n");
        info.append("Valor Total: R$ ").append(valorTotal != null ? String.format("%.2f", valorTotal) : "0.00").append("\n");
        
        if (servicos != null && !servicos.isEmpty()) {
            info.append("Serviços:\n");
            servicos.forEach(s -> info.append("- ").append(s.getNome())
                .append(" (R$ ").append(String.format("%.2f", s.getPreco())).append(")\n"));
        }
        
        return info.toString();
    }
    
    public int getDuracaoTotal() {
        if (servicos != null) {
            return servicos.stream()
                .mapToInt(s -> s.getDuracaoMinutos() != null ? s.getDuracaoMinutos() : 30)
                .sum();
        }
        return 30; // Duração padrão
    }
    
    public boolean isConfirmado() {
        return StatusAgendamento.CONFIRMADO.equals(status);
    }
    
    public boolean isPendente() {
        return StatusAgendamento.PENDENTE.equals(status);
    }
    
    // Getters e Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Cliente getCliente() {
        return cliente;
    }
    
    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }
    
    public Barbeiro getBarbeiro() {
        return barbeiro;
    }
    
    public void setBarbeiro(Barbeiro barbeiro) {
        this.barbeiro = barbeiro;
    }
    
    public List<TipoServico> getServicos() {
        return servicos;
    }
    
    public void setServicos(List<TipoServico> servicos) {
        this.servicos = servicos;
    }
    
    public LocalDateTime getDataHorario() {
        return dataHorario;
    }
    
    public void setDataHorario(LocalDateTime dataHorario) {
        this.dataHorario = dataHorario;
    }
    
    public Double getValorTotal() {
        return valorTotal;
    }
    
    public void setValorTotal(Double valorTotal) {
        this.valorTotal = valorTotal;
    }
    
    public StatusAgendamento getStatus() {
        return status;
    }
    
    public void setStatus(StatusAgendamento status) {
        this.status = status;
    }
    
    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }
    
    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }
    
    public LocalDateTime getDataResposta() {
        return dataResposta;
    }
    
    public void setDataResposta(LocalDateTime dataResposta) {
        this.dataResposta = dataResposta;
    }
    
    public String getObservacoes() {
        return observacoes;
    }
    
    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }
    
    public List<Mensagem> getMensagens() {
        return mensagens;
    }
    
    public void setMensagens(List<Mensagem> mensagens) {
        this.mensagens = mensagens;
    }
} 