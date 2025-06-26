package com.barbearia.repository;

import com.barbearia.model.Barbeiro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BarbeiroRepository extends JpaRepository<Barbeiro, Long> {
    
    Optional<Barbeiro> findByLogin(String login);
    
    @Query("SELECT b FROM Barbeiro b WHERE b.ativo = true")
    List<Barbeiro> findAllAtivos();
    
    @Query("SELECT b FROM Barbeiro b WHERE b.login = :login AND b.ativo = true")
    Optional<Barbeiro> findByLoginAndAtivo(@Param("login") String login);
    
    boolean existsByLogin(String login);
    
    @Query("SELECT b FROM Barbeiro b WHERE b.nome LIKE %:nome% AND b.ativo = true")
    List<Barbeiro> findByNomeContainingAndAtivo(@Param("nome") String nome);
} 