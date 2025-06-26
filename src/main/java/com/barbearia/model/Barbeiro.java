package com.barbearia.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "barbeiros")
public class Barbeiro {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Nome é obrigatório")
    @Column(name = "nome", nullable = false)
    private String nome;
    
    @NotBlank(message = "Login é obrigatório")
    @Column(name = "login", nullable = false, unique = true)
    private String login;
    
    @JsonIgnore
    @NotBlank(message = "Senha é obrigatória")
    @Column(name = "senha", nullable = false)
    private String senha;
    
    @Column(name = "ativo")
    private Boolean ativo = true;
    
    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;
    
    @OneToMany(mappedBy = "barbeiro", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Agendamento> agendamentos;
    
    @OneToMany(mappedBy = "destinatario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Mensagem> mensagens;
    
    private static final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    public Barbeiro() {
        this.dataCriacao = LocalDateTime.now();
    }
    
    public Barbeiro(String nome, String login, String senha) {
        this();
        this.nome = nome;
        this.login = login;
        this.senha = passwordEncoder.encode(senha);
    }
    
    // Métodos especificados
    public boolean fazerLogin(String login, String senha) {
        if (this.login.equals(login) && passwordEncoder.matches(senha, this.senha)) {
            return true;
        }
        return false;
    }
    
    public List<Agendamento> verAgendaSemanal(LocalDateTime inicioSemana, LocalDateTime fimSemana) {
        if (agendamentos != null) {
            return agendamentos.stream()
                .filter(a -> a.getDataHorario().isAfter(inicioSemana) && 
                           a.getDataHorario().isBefore(fimSemana))
                .filter(a -> !a.getStatus().equals(StatusAgendamento.CANCELADO))
                .toList();
        }
        return List.of();
    }
    
    public List<Agendamento> verAgendamentoPendentes() {
        if (agendamentos != null) {
            return agendamentos.stream()
                .filter(a -> a.getStatus().equals(StatusAgendamento.PENDENTE))
                .toList();
        }
        return List.of();
    }
    
    public boolean responderServico(Long agendamentoId, boolean aceitar) {
        if (agendamentos != null) {
            return agendamentos.stream()
                .filter(a -> a.getId().equals(agendamentoId))
                .filter(a -> a.getStatus().equals(StatusAgendamento.PENDENTE))
                .findFirst()
                .map(a -> {
                    a.setStatus(aceitar ? StatusAgendamento.CONFIRMADO : StatusAgendamento.RECUSADO);
                    a.setDataResposta(LocalDateTime.now());
                    return true;
                })
                .orElse(false);
        }
        return false;
    }
    
    public List<Mensagem> visualizarCaixaDeEntrada() {
        if (mensagens != null) {
            return mensagens.stream()
                .filter(m -> !m.getLida())
                .toList();
        }
        return List.of();
    }
    
    public boolean isDisponivel(LocalDateTime dataHorario, int duracaoMinutos) {
        if (agendamentos != null) {
            LocalDateTime inicioServico = dataHorario;
            LocalDateTime fimServico = dataHorario.plusMinutes(duracaoMinutos);
            
            return agendamentos.stream()
                .filter(a -> a.getStatus().equals(StatusAgendamento.CONFIRMADO))
                .noneMatch(a -> {
                    LocalDateTime inicioExistente = a.getDataHorario();
                    LocalDateTime fimExistente = inicioExistente.plusMinutes(a.getDuracaoTotal());
                    
                    return (inicioServico.isBefore(fimExistente) && fimServico.isAfter(inicioExistente));
                });
        }
        return true;
    }
    
    // Getters e Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getNome() {
        return nome;
    }
    
    public void setNome(String nome) {
        this.nome = nome;
    }
    
    public String getLogin() {
        return login;
    }
    
    public void setLogin(String login) {
        this.login = login;
    }
    
    public String getSenha() {
        return senha;
    }
    
    public void setSenha(String senha) {
        this.senha = passwordEncoder.encode(senha);
    }
    
    public Boolean getAtivo() {
        return ativo;
    }
    
    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }
    
    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }
    
    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }
    
    public List<Agendamento> getAgendamentos() {
        return agendamentos;
    }
    
    public void setAgendamentos(List<Agendamento> agendamentos) {
        this.agendamentos = agendamentos;
    }
    
    public List<Mensagem> getMensagens() {
        return mensagens;
    }
    
    public void setMensagens(List<Mensagem> mensagens) {
        this.mensagens = mensagens;
    }
} 