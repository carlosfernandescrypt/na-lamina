package com.barbearia.repository;

import com.barbearia.model.Mensagem;
import com.barbearia.model.Barbeiro;
import com.barbearia.model.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MensagemRepository extends JpaRepository<Mensagem, Long> {
    
    List<Mensagem> findByDestinatario(Barbeiro destinatario);
    
    @Query("SELECT m FROM Mensagem m WHERE m.destinatario = :destinatario AND m.lida = false")
    List<Mensagem> findMensagensNaoLidasByDestinatario(@Param("destinatario") Barbeiro destinatario);
    
    List<Mensagem> findByAgendamento(Agendamento agendamento);
    
    @Query("SELECT m FROM Mensagem m WHERE m.destinatario = :destinatario AND " +
           "m.dataEnvio BETWEEN :inicio AND :fim ORDER BY m.dataEnvio DESC")
    List<Mensagem> findByDestinatarioAndDataEnvioBetween(@Param("destinatario") Barbeiro destinatario,
                                                        @Param("inicio") LocalDateTime inicio,
                                                        @Param("fim") LocalDateTime fim);
    
    @Query("SELECT COUNT(m) FROM Mensagem m WHERE m.destinatario = :destinatario AND m.lida = false")
    Long countMensagensNaoLidasByDestinatario(@Param("destinatario") Barbeiro destinatario);
} 