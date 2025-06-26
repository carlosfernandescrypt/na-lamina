package com.barbearia.service;

import com.barbearia.model.TipoServico;
import com.barbearia.repository.TipoServicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TipoServicoService {
    
    @Autowired
    private TipoServicoRepository tipoServicoRepository;
    
    public List<TipoServico> listarAtivos() {
        return tipoServicoRepository.findAllAtivos();
    }
    
    public Optional<TipoServico> buscarPorId(Long id) {
        return tipoServicoRepository.findById(id);
    }
    
    public TipoServico salvarTipoServico(TipoServico tipoServico) {
        return tipoServicoRepository.save(tipoServico);
    }
}
