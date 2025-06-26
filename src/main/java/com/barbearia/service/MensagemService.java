package com.barbearia.service;

import com.barbearia.model.*;
import com.barbearia.repository.MensagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MensagemService {
    
    @Autowired
    private MensagemRepository mensagemRepository;
    
    public Mensagem criarMensagemAgendamento(Agendamento agendamento, TipoMensagem tipo) {
        String conteudo = gerarConteudoMensagem(agendamento, tipo);
        
        Mensagem mensagem = new Mensagem(conteudo, agendamento, agendamento.getBarbeiro(), tipo);
        return mensagemRepository.save(mensagem);
    }
    
    public List<Mensagem> buscarMensagensNaoLidas(Barbeiro barbeiro) {
        return mensagemRepository.findMensagensNaoLidasByDestinatario(barbeiro);
    }
    
    public List<Mensagem> buscarMensagensPorBarbeiro(Barbeiro barbeiro) {
        return mensagemRepository.findByDestinatario(barbeiro);
    }
    
    public Long contarMensagensNaoLidas(Barbeiro barbeiro) {
        return mensagemRepository.countMensagensNaoLidasByDestinatario(barbeiro);
    }
    
    public boolean marcarComoLida(Long mensagemId) {
        Optional<Mensagem> mensagem = mensagemRepository.findById(mensagemId);
        
        if (mensagem.isPresent()) {
            mensagem.get().marcarComoLida();
            mensagemRepository.save(mensagem.get());
            return true;
        }
        return false;
    }
    
    public void marcarTodasComoLidas(Barbeiro barbeiro) {
        List<Mensagem> mensagensNaoLidas = mensagemRepository.findMensagensNaoLidasByDestinatario(barbeiro);
        
        mensagensNaoLidas.forEach(m -> {
            m.marcarComoLida();
            mensagemRepository.save(m);
        });
    }
    
    public List<Mensagem> buscarMensagensPorAgendamento(Agendamento agendamento) {
        return mensagemRepository.findByAgendamento(agendamento);
    }
    
    private String gerarConteudoMensagem(Agendamento agendamento, TipoMensagem tipo) {
        switch (tipo) {
            case AGENDAMENTO_CRIADO:
                return String.format(
                    "Novo agendamento criado!\nCliente: %s\nData/Hora: %s\nServiços: %s\nValor: R$ %.2f",
                    agendamento.getCliente().getNomeCompleto(),
                    agendamento.getDataHorario().toString(),
                    agendamento.getServicos().stream()
                        .map(TipoServico::getNome)
                        .reduce((a, b) -> a + ", " + b)
                        .orElse("N/A"),
                    agendamento.getValorTotal()
                );
                
            case AGENDAMENTO_CANCELADO:
                return String.format(
                    "Agendamento cancelado!\nCliente: %s\nData/Hora: %s",
                    agendamento.getCliente().getNomeCompleto(),
                    agendamento.getDataHorario().toString()
                );
                
            case AGENDAMENTO_CONFIRMADO:
                return String.format(
                    "Agendamento confirmado!\nCliente: %s\nData/Hora: %s",
                    agendamento.getCliente().getNomeCompleto(),
                    agendamento.getDataHorario().toString()
                );
                
            case LEMBRETE_AGENDAMENTO:
                return String.format(
                    "Lembrete: Você tem um agendamento em 1 hora!\nCliente: %s\nData/Hora: %s",
                    agendamento.getCliente().getNomeCompleto(),
                    agendamento.getDataHorario().toString()
                );
                
            default:
                return "Nova notificação do sistema";
        }
    }
} 