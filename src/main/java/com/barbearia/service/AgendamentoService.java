package com.barbearia.service;

import com.barbearia.model.*;
import com.barbearia.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AgendamentoService {
    
    @Autowired
    private AgendamentoRepository agendamentoRepository;
    
    @Autowired
    private ClienteService clienteService;
    
    @Autowired
    private BarbeiroService barbeiroService;
    
    @Autowired
    private TipoServicoRepository tipoServicoRepository;
    
    @Autowired
    private MensagemService mensagemService;
    
    public Agendamento criarAgendamento(String nomeCliente, String emailCliente, 
                                       Long barbeiroId, List<Long> servicoIds, 
                                       LocalDateTime dataHorario, String observacoes) {
        
        // Validações básicas
        if (nomeCliente == null || nomeCliente.trim().isEmpty()) {
            throw new IllegalArgumentException("Nome do cliente é obrigatório");
        }
        
        if (emailCliente == null || emailCliente.trim().isEmpty()) {
            throw new IllegalArgumentException("Email do cliente é obrigatório");
        }
        
        if (dataHorario.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Data/hora deve ser futura");
        }
        
        // Buscar ou criar cliente
        Cliente cliente = clienteService.buscarOuCriarCliente(nomeCliente, emailCliente);
        
        // Buscar barbeiro
        Optional<Barbeiro> barbeiro = barbeiroService.buscarPorId(barbeiroId);
        if (barbeiro.isEmpty()) {
            throw new IllegalArgumentException("Barbeiro não encontrado");
        }
        
        // Buscar serviços
        List<TipoServico> servicos = tipoServicoRepository.findAllById(servicoIds);
        if (servicos.isEmpty()) {
            throw new IllegalArgumentException("Nenhum serviço válido selecionado");
        }
        
        // Calcular duração total
        int duracaoTotal = servicos.stream()
            .mapToInt(s -> s.getDuracaoMinutos() != null ? s.getDuracaoMinutos() : 30)
            .sum();
        
        // Verificar disponibilidade do barbeiro
        if (!barbeiro.get().isDisponivel(dataHorario, duracaoTotal)) {
            throw new IllegalArgumentException("Barbeiro não está disponível neste horário");
        }
        
        // Calcular valor total
        double valorTotal = servicos.stream()
            .mapToDouble(TipoServico::getPreco)
            .sum();
        
        // Criar agendamento
        Agendamento agendamento = new Agendamento(cliente, barbeiro.get(), servicos, dataHorario, valorTotal);
        agendamento.setObservacoes(observacoes);
        
        if (agendamento.marcarServico()) {
            Agendamento agendamentoSalvo = agendamentoRepository.save(agendamento);
            
            // Enviar notificação para o barbeiro
            mensagemService.criarMensagemAgendamento(agendamentoSalvo, TipoMensagem.AGENDAMENTO_CRIADO);
            
            return agendamentoSalvo;
        } else {
            throw new RuntimeException("Erro ao criar agendamento");
        }
    }
    
    public Optional<Agendamento> buscarPorId(Long id) {
        return agendamentoRepository.findById(id);
    }
    
    public List<Agendamento> buscarPorCliente(Long clienteId) {
        Optional<Cliente> cliente = clienteService.buscarPorId(clienteId);
        if (cliente.isPresent()) {
            return agendamentoRepository.findByCliente(cliente.get());
        }
        return List.of();
    }
    
    public List<Agendamento> buscarPorEmailCliente(String email) {
        return agendamentoRepository.findByClienteEmail(email);
    }
    
    public List<Agendamento> buscarPorBarbeiro(Long barbeiroId) {
        Optional<Barbeiro> barbeiro = barbeiroService.buscarPorId(barbeiroId);
        if (barbeiro.isPresent()) {
            return agendamentoRepository.findByBarbeiro(barbeiro.get());
        }
        return List.of();
    }
    
    public boolean cancelarAgendamento(Long agendamentoId, String motivo) {
        Optional<Agendamento> agendamento = agendamentoRepository.findById(agendamentoId);
        
        if (agendamento.isPresent()) {
            Agendamento ag = agendamento.get();
            
            if (ag.getStatus().equals(StatusAgendamento.CANCELADO)) {
                throw new IllegalArgumentException("Agendamento já está cancelado");
            }
            
            if (ag.getStatus().equals(StatusAgendamento.CONCLUIDO)) {
                throw new IllegalArgumentException("Não é possível cancelar agendamento concluído");
            }
            
            ag.setStatus(StatusAgendamento.CANCELADO);
            ag.setDataResposta(LocalDateTime.now());
            ag.setObservacoes(ag.getObservacoes() + " | Cancelado: " + motivo);
            
            agendamentoRepository.save(ag);
            
            // Notificar barbeiro sobre cancelamento
            mensagemService.criarMensagemAgendamento(ag, TipoMensagem.AGENDAMENTO_CANCELADO);
            
            return true;
        }
        return false;
    }
    
    public boolean confirmarAgendamento(Long barbeiroId, Long agendamentoId) {
        return barbeiroService.responderAgendamento(barbeiroId, agendamentoId, true);
    }
    
    public boolean recusarAgendamento(Long barbeiroId, Long agendamentoId, String motivo) {
        if (barbeiroService.responderAgendamento(barbeiroId, agendamentoId, false)) {
            Optional<Agendamento> agendamento = agendamentoRepository.findById(agendamentoId);
            if (agendamento.isPresent()) {
                Agendamento ag = agendamento.get();
                ag.setObservacoes(ag.getObservacoes() + " | Recusado: " + motivo);
                agendamentoRepository.save(ag);
            }
            return true;
        }
        return false;
    }
    
    public double calcularValorTotal(List<Long> servicoIds) {
        List<TipoServico> servicos = tipoServicoRepository.findAllById(servicoIds);
        return servicos.stream()
            .mapToDouble(TipoServico::getPreco)
            .sum();
    }
    
    public List<Agendamento> buscarAgendamentosPendentes() {
        return agendamentoRepository.findByStatus(StatusAgendamento.PENDENTE);
    }
    
    public List<Agendamento> buscarAgendamentosConfirmados() {
        return agendamentoRepository.findByStatus(StatusAgendamento.CONFIRMADO);
    }
    
    public List<Agendamento> listarTodos() {
        return agendamentoRepository.findAll();
    }
    
    public Agendamento atualizarAgendamento(Long id, LocalDateTime novaDataHorario, List<Long> novosServicoIds) {
        Optional<Agendamento> agendamentoExistente = agendamentoRepository.findById(id);
        
        if (agendamentoExistente.isPresent()) {
            Agendamento agendamento = agendamentoExistente.get();
            
            if (!agendamento.getStatus().equals(StatusAgendamento.PENDENTE)) {
                throw new IllegalArgumentException("Só é possível alterar agendamentos pendentes");
            }
            
            if (novaDataHorario != null) {
                if (novaDataHorario.isBefore(LocalDateTime.now())) {
                    throw new IllegalArgumentException("Nova data/hora deve ser futura");
                }
                
                // Verificar disponibilidade do barbeiro para nova data/hora
                int duracaoTotal = agendamento.getDuracaoTotal();
                if (!agendamento.getBarbeiro().isDisponivel(novaDataHorario, duracaoTotal)) {
                    throw new IllegalArgumentException("Barbeiro não está disponível na nova data/hora");
                }
                
                agendamento.setDataHorario(novaDataHorario);
            }
            
            if (novosServicoIds != null && !novosServicoIds.isEmpty()) {
                List<TipoServico> novosServicos = tipoServicoRepository.findAllById(novosServicoIds);
                if (!novosServicos.isEmpty()) {
                    agendamento.setServicos(novosServicos);
                    
                    double novoValorTotal = novosServicos.stream()
                        .mapToDouble(TipoServico::getPreco)
                        .sum();
                    agendamento.setValorTotal(novoValorTotal);
                }
            }
            
            return agendamentoRepository.save(agendamento);
        } else {
            throw new IllegalArgumentException("Agendamento não encontrado com ID: " + id);
        }
    }
} 