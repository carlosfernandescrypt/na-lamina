package com.barbearia.repository;

import com.barbearia.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    
    Optional<Cliente> findByEmail(String email);
    
    @Query("SELECT c FROM Cliente c WHERE c.nomeCompleto LIKE %:nome%")
    Optional<Cliente> findByNomeContaining(@Param("nome") String nome);
    
    @Query("SELECT c FROM Cliente c WHERE c.email = :email AND c.nomeCompleto = :nome")
    Optional<Cliente> findByEmailAndNome(@Param("email") String email, @Param("nome") String nome);
    
    boolean existsByEmail(String email);
} 