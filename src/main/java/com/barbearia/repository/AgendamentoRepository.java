package com.barbearia.repository;

import com.barbearia.model.Agendamento;
import com.barbearia.model.Barbeiro;
import com.barbearia.model.Cliente;
import com.barbearia.model.StatusAgendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
    
    List<Agendamento> findByCliente(Cliente cliente);
    
    List<Agendamento> findByBarbeiro(Barbeiro barbeiro);
    
    List<Agendamento> findByStatus(StatusAgendamento status);
    
    @Query("SELECT a FROM Agendamento a WHERE a.barbeiro = :barbeiro AND a.status = :status")
    List<Agendamento> findByBarbeiroAndStatus(@Param("barbeiro") Barbeiro barbeiro, 
                                              @Param("status") StatusAgendamento status);
    
    @Query("SELECT a FROM Agendamento a WHERE a.barbeiro = :barbeiro AND " +
           "a.dataHorario BETWEEN :inicio AND :fim ORDER BY a.dataHorario")
    List<Agendamento> findByBarbeiroAndDataHorarioBetween(@Param("barbeiro") Barbeiro barbeiro,
                                                          @Param("inicio") LocalDateTime inicio,
                                                          @Param("fim") LocalDateTime fim);
    
    @Query("SELECT a FROM Agendamento a WHERE a.cliente.email = :email")
    List<Agendamento> findByClienteEmail(@Param("email") String email);
} 