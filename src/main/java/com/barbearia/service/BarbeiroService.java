package com.barbearia.service;

import com.barbearia.model.Barbeiro;
import com.barbearia.model.Agendamento;
import com.barbearia.model.StatusAgendamento;
import com.barbearia.repository.BarbeiroRepository;
import com.barbearia.repository.AgendamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BarbeiroService {
    
    @Autowired
    private BarbeiroRepository barbeiroRepository;
    
    @Autowired
    private AgendamentoRepository agendamentoRepository;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    public Barbeiro salvarBarbeiro(Barbeiro barbeiro) {
        if (barbeiro.getNome() == null || barbeiro.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("Nome é obrigatório");
        }
        
        if (barbeiro.getLogin() == null || barbeiro.getLogin().trim().isEmpty()) {
            throw new IllegalArgumentException("Login é obrigatório");
        }
        
        if (barbeiroRepository.existsByLogin(barbeiro.getLogin())) {
            throw new IllegalArgumentException("Login já existe");
        }
        
        return barbeiroRepository.save(barbeiro);
    }
    
    public Optional<Barbeiro> buscarPorId(Long id) {
        return barbeiroRepository.findById(id);
    }
    
    public Optional<Barbeiro> buscarPorLogin(String login) {
        return barbeiroRepository.findByLoginAndAtivo(login);
    }
    
    public List<Barbeiro> listarBarbeirosAtivos() {
        return barbeiroRepository.findAllAtivos();
    }
    
    public boolean autenticarBarbeiro(String login, String senha) {
        Optional<Barbeiro> barbeiro = barbeiroRepository.findByLoginAndAtivo(login);
        
        if (barbeiro.isPresent()) {
            return barbeiro.get().fazerLogin(login, senha);
        }
        return false;
    }
    
    public List<Agendamento> verAgendaSemanal(Long barbeiroId, LocalDateTime inicioSemana) {
        Optional<Barbeiro> barbeiro = barbeiroRepository.findById(barbeiroId);
        
        if (barbeiro.isPresent()) {
            LocalDateTime fimSemana = inicioSemana.plus(7, ChronoUnit.DAYS);
            return agendamentoRepository.findByBarbeiroAndDataHorarioBetween(
                barbeiro.get(), inicioSemana, fimSemana);
        }
        return List.of();
    }
    
    public List<Agendamento> verAgendamentosPendentes(Long barbeiroId) {
        Optional<Barbeiro> barbeiro = barbeiroRepository.findById(barbeiroId);
        
        if (barbeiro.isPresent()) {
            return agendamentoRepository.findByBarbeiroAndStatus(
                barbeiro.get(), StatusAgendamento.PENDENTE);
        }
        return List.of();
    }
    
    public boolean responderAgendamento(Long barbeiroId, Long agendamentoId, boolean aceitar) {
        Optional<Barbeiro> barbeiro = barbeiroRepository.findById(barbeiroId);
        Optional<Agendamento> agendamento = agendamentoRepository.findById(agendamentoId);
        
        if (barbeiro.isPresent() && agendamento.isPresent()) {
            Agendamento ag = agendamento.get();
            
            // Verifica se o agendamento pertence ao barbeiro
            if (!ag.getBarbeiro().getId().equals(barbeiroId)) {
                throw new IllegalArgumentException("Agendamento não pertence a este barbeiro");
            }
            
            if (!ag.getStatus().equals(StatusAgendamento.PENDENTE)) {
                throw new IllegalArgumentException("Agendamento não está pendente");
            }
            
            StatusAgendamento novoStatus = aceitar ? StatusAgendamento.CONFIRMADO : StatusAgendamento.RECUSADO;
            ag.setStatus(novoStatus);
            ag.setDataResposta(LocalDateTime.now());
            
            agendamentoRepository.save(ag);
            return true;
        }
        return false;
    }
    
    public boolean isBarbeiroDisponivel(Long barbeiroId, LocalDateTime dataHorario, int duracaoMinutos) {
        Optional<Barbeiro> barbeiro = barbeiroRepository.findById(barbeiroId);
        
        if (barbeiro.isPresent()) {
            return barbeiro.get().isDisponivel(dataHorario, duracaoMinutos);
        }
        return false;
    }
    
    public Barbeiro atualizarBarbeiro(Long id, Barbeiro barbeiroAtualizado) {
        Optional<Barbeiro> barbeiroExistente = barbeiroRepository.findById(id);
        
        if (barbeiroExistente.isPresent()) {
            Barbeiro barbeiro = barbeiroExistente.get();
            
            if (barbeiroAtualizado.getNome() != null) {
                barbeiro.setNome(barbeiroAtualizado.getNome());
            }
            
            if (barbeiroAtualizado.getLogin() != null && 
                !barbeiroAtualizado.getLogin().equals(barbeiro.getLogin())) {
                
                if (barbeiroRepository.existsByLogin(barbeiroAtualizado.getLogin())) {
                    throw new IllegalArgumentException("Login já existe");
                }
                barbeiro.setLogin(barbeiroAtualizado.getLogin());
            }
            
            return barbeiroRepository.save(barbeiro);
        } else {
            throw new IllegalArgumentException("Barbeiro não encontrado com ID: " + id);
        }
    }
    
    public void ativarDesativarBarbeiro(Long id, boolean ativo) {
        Optional<Barbeiro> barbeiro = barbeiroRepository.findById(id);
        
        if (barbeiro.isPresent()) {
            barbeiro.get().setAtivo(ativo);
            barbeiroRepository.save(barbeiro.get());
        } else {
            throw new IllegalArgumentException("Barbeiro não encontrado com ID: " + id);
        }
    }
} 