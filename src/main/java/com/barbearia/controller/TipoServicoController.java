package com.barbearia.controller;

import com.barbearia.model.TipoServico;
import com.barbearia.service.TipoServicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/servicos")
@CrossOrigin(origins = "*")
public class TipoServicoController {
    
    @Autowired
    private TipoServicoService tipoServicoService;
    
    @GetMapping
    public ResponseEntity<List<TipoServico>> listarServicosAtivos() {
        List<TipoServico> servicos = tipoServicoService.listarAtivos();
        return ResponseEntity.ok(servicos);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarServico(@PathVariable Long id) {
        Optional<TipoServico> servico = tipoServicoService.buscarPorId(id);
        if (servico.isPresent()) {
            return ResponseEntity.ok(servico.get());
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping
    public ResponseEntity<?> criarServico(@RequestBody TipoServico tipoServico) {
        try {
            TipoServico servicoSalvo = tipoServicoService.salvarTipoServico(tipoServico);
            return ResponseEntity.ok(servicoSalvo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
