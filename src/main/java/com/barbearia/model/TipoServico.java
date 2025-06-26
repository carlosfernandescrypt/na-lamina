package com.barbearia.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "tipos_servico")
public class TipoServico {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Nome do serviço é obrigatório")
    @Column(name = "nome", nullable = false)
    private String nome;
    
    @Column(name = "descricao")
    private String descricao;
    
    @Positive(message = "Preço deve ser positivo")
    @Column(name = "preco", nullable = false)
    private Double preco;
    
    @Column(name = "duracao_minutos")
    private Integer duracaoMinutos;
    
    @Column(name = "ativo")
    private Boolean ativo = true;
    
    public TipoServico() {}
    
    public TipoServico(String nome, String descricao, Double preco, Integer duracaoMinutos) {
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.duracaoMinutos = duracaoMinutos;
        this.ativo = true;
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
    
    public String getDescricao() {
        return descricao;
    }
    
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
    
    public Double getPreco() {
        return preco;
    }
    
    public void setPreco(Double preco) {
        this.preco = preco;
    }
    
    public Integer getDuracaoMinutos() {
        return duracaoMinutos;
    }
    
    public void setDuracaoMinutos(Integer duracaoMinutos) {
        this.duracaoMinutos = duracaoMinutos;
    }
    
    public Boolean getAtivo() {
        return ativo;
    }
    
    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }
} 