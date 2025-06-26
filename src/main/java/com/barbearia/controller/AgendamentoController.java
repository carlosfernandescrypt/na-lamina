package com.barbearia.controller;

import com.barbearia.model.Agendamento;
import com.barbearia.service.AgendamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/agendamentos")
@CrossOrigin(origins = "*")
public class AgendamentoController {
    
    @Autowired
    private AgendamentoService agendamentoService;
    
    @PostMapping
    public ResponseEntity<?> criarAgendamento(@RequestBody Map<String, Object> request) {
        try {
            String nomeCliente = (String) request.get("nomeCliente");
            String emailCliente = (String) request.get("emailCliente");
            Long barbeiroId = Long.valueOf(request.get("barbeiroId").toString());
            List<Long> servicoIds = (List<Long>) request.get("servicoIds");
            LocalDateTime dataHorario = LocalDateTime.parse((String) request.get("dataHorario"));
            String observacoes = (String) request.get("observacoes");
            
            Agendamento agendamento = agendamentoService.criarAgendamento(
                nomeCliente, emailCliente, barbeiroId, servicoIds, dataHorario, observacoes
            );
            
            return ResponseEntity.ok(agendamento);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarAgendamento(@PathVariable Long id) {
        Optional<Agendamento> agendamento = agendamentoService.buscarPorId(id);
        if (agendamento.isPresent()) {
            return ResponseEntity.ok(agendamento.get());
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelarAgendamento(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String motivo = request.get("motivo");
            boolean cancelado = agendamentoService.cancelarAgendamento(id, motivo);
            return ResponseEntity.ok("Agendamento cancelado");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/calcular-valor")
    public ResponseEntity<?> calcularValorTotal(@RequestBody Map<String, List<Long>> request) {
        try {
            List<Long> servicoIds = request.get("servicoIds");
            double valorTotal = agendamentoService.calcularValorTotal(servicoIds);
            return ResponseEntity.ok(Map.of("valorTotal", valorTotal));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
