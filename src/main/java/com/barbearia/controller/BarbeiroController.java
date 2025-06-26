package com.barbearia.controller;

import com.barbearia.model.Barbeiro;
import com.barbearia.model.Agendamento;
import com.barbearia.service.BarbeiroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/barbeiros")
@CrossOrigin(origins = "*")
public class BarbeiroController {
    
    @Autowired
    private BarbeiroService barbeiroService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String login = credentials.get("login");
            String senha = credentials.get("senha");
            
            if (barbeiroService.autenticarBarbeiro(login, senha)) {
                Optional<Barbeiro> barbeiro = barbeiroService.buscarPorLogin(login);
                if (barbeiro.isPresent()) {
                    return ResponseEntity.ok(Map.of(
                        "success", true,
                        "barbeiro", barbeiro.get()
                    ));
                }
            }
            
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Login ou senha inválidos"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Barbeiro>> listarBarbeirosAtivos() {
        List<Barbeiro> barbeiros = barbeiroService.listarBarbeirosAtivos();
        return ResponseEntity.ok(barbeiros);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarBarbeiro(@PathVariable Long id) {
        Optional<Barbeiro> barbeiro = barbeiroService.buscarPorId(id);
        if (barbeiro.isPresent()) {
            return ResponseEntity.ok(barbeiro.get());
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/{id}/agenda-semanal")
    public ResponseEntity<?> verAgendaSemanal(@PathVariable Long id, @RequestParam String data) {
        try {
            LocalDateTime inicioSemana = LocalDateTime.parse(data);
            List<Agendamento> agenda = barbeiroService.verAgendaSemanal(id, inicioSemana);
            return ResponseEntity.ok(agenda);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/{id}/pendentes")
    public ResponseEntity<?> verAgendamentosPendentes(@PathVariable Long id) {
        try {
            List<Agendamento> pendentes = barbeiroService.verAgendamentosPendentes(id);
            return ResponseEntity.ok(pendentes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/{barbeiroId}/agendamentos/{agendamentoId}/responder")
    public ResponseEntity<?> responderAgendamento(@PathVariable Long barbeiroId, 
                                                 @PathVariable Long agendamentoId, 
                                                 @RequestBody Map<String, Object> request) {
        try {
            boolean aceitar = (Boolean) request.get("aceitar");
            boolean sucesso = barbeiroService.responderAgendamento(barbeiroId, agendamentoId, aceitar);
            
            if (sucesso) {
                String status = aceitar ? "confirmado" : "recusado";
                return ResponseEntity.ok(Map.of("message", "Agendamento " + status + " com sucesso"));
            } else {
                return ResponseEntity.badRequest().body("Erro ao responder agendamento");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
