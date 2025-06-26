package com.barbearia.repository;

import com.barbearia.model.TipoServico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TipoServicoRepository extends JpaRepository<TipoServico, Long> {
    
    @Query("SELECT t FROM TipoServico t WHERE t.ativo = true")
    List<TipoServico> findAllAtivos();
    
    Optional<TipoServico> findByNome(String nome);
    
    @Query("SELECT t FROM TipoServico t WHERE t.nome LIKE %:nome% AND t.ativo = true")
    List<TipoServico> findByNomeContainingAndAtivo(@Param("nome") String nome);
    
    @Query("SELECT t FROM TipoServico t WHERE t.preco BETWEEN :precoMin AND :precoMax AND t.ativo = true")
    List<TipoServico> findByPrecoRangeAndAtivo(@Param("precoMin") Double precoMin, 
                                               @Param("precoMax") Double precoMax);
} 