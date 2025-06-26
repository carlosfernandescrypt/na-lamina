package com.barbearia.service;

import com.barbearia.model.Cliente;
import com.barbearia.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ClienteService {
    
    @Autowired
    private ClienteRepository clienteRepository;
    
    public Cliente salvarCliente(Cliente cliente) {
        if (cliente.getNomeCompleto() == null || cliente.getNomeCompleto().trim().isEmpty()) {
            throw new IllegalArgumentException("Nome completo é obrigatório");
        }
        
        if (cliente.getEmail() == null || cliente.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email é obrigatório");
        }
        
        if (!isEmailValido(cliente.getEmail())) {
            throw new IllegalArgumentException("Email deve ter um formato válido");
        }
        
        return clienteRepository.save(cliente);
    }
    
    public Optional<Cliente> buscarPorId(Long id) {
        return clienteRepository.findById(id);
    }
    
    public Optional<Cliente> buscarPorEmail(String email) {
        return clienteRepository.findByEmail(email);
    }
    
    public Cliente buscarOuCriarCliente(String nomeCompleto, String email) {
        Optional<Cliente> clienteExistente = clienteRepository.findByEmailAndNome(email, nomeCompleto);
        
        if (clienteExistente.isPresent()) {
            return clienteExistente.get();
        }
        
        // Se não existe, cria um novo cliente
        Cliente novoCliente = new Cliente();
        if (novoCliente.preencherDados(nomeCompleto, email)) {
            return salvarCliente(novoCliente);
        } else {
            throw new IllegalArgumentException("Dados inválidos para criar cliente");
        }
    }
    
    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }
    
    public void deletarCliente(Long id) {
        if (clienteRepository.existsById(id)) {
            clienteRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Cliente não encontrado com ID: " + id);
        }
    }
    
    public boolean existeClienteComEmail(String email) {
        return clienteRepository.existsByEmail(email);
    }
    
    public Cliente atualizarCliente(Long id, Cliente clienteAtualizado) {
        Optional<Cliente> clienteExistente = clienteRepository.findById(id);
        
        if (clienteExistente.isPresent()) {
            Cliente cliente = clienteExistente.get();
            
            if (clienteAtualizado.getNomeCompleto() != null) {
                cliente.setNomeCompleto(clienteAtualizado.getNomeCompleto());
            }
            
            if (clienteAtualizado.getEmail() != null) {
                if (!isEmailValido(clienteAtualizado.getEmail())) {
                    throw new IllegalArgumentException("Email deve ter um formato válido");
                }
                cliente.setEmail(clienteAtualizado.getEmail());
            }
            
            return clienteRepository.save(cliente);
        } else {
            throw new IllegalArgumentException("Cliente não encontrado com ID: " + id);
        }
    }
    
    private boolean isEmailValido(String email) {
        // Validação básica de email
        return email != null && email.contains("@") && email.contains(".");
    }
} 