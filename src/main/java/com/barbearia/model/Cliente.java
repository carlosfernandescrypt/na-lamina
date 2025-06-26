package com.barbearia.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "clientes")
public class Cliente {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Nome completo é obrigatório")
    @Column(name = "nome_completo", nullable = false)
    private String nomeCompleto;
    
    @Email(message = "Email deve ser válido")
    @NotBlank(message = "Email é obrigatório")
    @Column(name = "email", nullable = false)
    private String email;
    
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Agendamento> agendamentos;
    
    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;
    
    public Cliente() {
        this.dataCriacao = LocalDateTime.now();
    }
    
    public Cliente(String nomeCompleto, String email) {
        this();
        this.nomeCompleto = nomeCompleto;
        this.email = email;
    }
    
    // Métodos especificados
    public boolean preencherDados(String nomeCompleto, String email) {
        if (nomeCompleto != null && !nomeCompleto.trim().isEmpty() && 
            email != null && !email.trim().isEmpty()) {
            this.nomeCompleto = nomeCompleto;
            this.email = email;
            return true;
        }
        return false;
    }
    
    public Agendamento marcarCorte(Barbeiro barbeiro, List<TipoServico> servicos, LocalDateTime dataHorario) {
        if (barbeiro != null && servicos != null && !servicos.isEmpty() && dataHorario != null) {
            Agendamento agendamento = new Agendamento();
            agendamento.setCliente(this);
            agendamento.setBarbeiro(barbeiro);
            agendamento.setDataHorario(dataHorario);
            agendamento.setServicos(servicos);
            agendamento.setStatus(StatusAgendamento.PENDENTE);
            
            double valorTotal = calcularValorTotal(servicos);
            agendamento.setValorTotal(valorTotal);
            
            return agendamento;
        }
        return null;
    }
    
    public boolean cancelarServico(Long agendamentoId) {
        if (agendamentos != null) {
            return agendamentos.stream()
                .filter(a -> a.getId().equals(agendamentoId))
                .findFirst()
                .map(a -> {
                    a.setStatus(StatusAgendamento.CANCELADO);
                    return true;
                })
                .orElse(false);
        }
        return false;
    }
    
    public double visualizarValorTotal(List<TipoServico> servicos) {
        return calcularValorTotal(servicos);
    }
    
    private double calcularValorTotal(List<TipoServico> servicos) {
        return servicos.stream()
            .mapToDouble(TipoServico::getPreco)
            .sum();
    }
    
    // Getters e Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getNomeCompleto() {
        return nomeCompleto;
    }
    
    public void setNomeCompleto(String nomeCompleto) {
        this.nomeCompleto = nomeCompleto;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public List<Agendamento> getAgendamentos() {
        return agendamentos;
    }
    
    public void setAgendamentos(List<Agendamento> agendamentos) {
        this.agendamentos = agendamentos;
    }
    
    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }
    
    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }
} 