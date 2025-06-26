import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://sua-api.herokuapp.com/api' 
  : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API:', error);
    return Promise.reject(error);
  }
);

// Serviços de TipoServico
export const tipoServicoService = {
  listarAtivos: () => api.get('/servicos'),
  buscarPorId: (id) => api.get(`/servicos/${id}`),
  criar: (servico) => api.post('/servicos', servico),
};

// Serviços de Barbeiro
export const barbeiroService = {
  listarAtivos: () => api.get('/barbeiros'),
  buscarPorId: (id) => api.get(`/barbeiros/${id}`),
  criar: (barbeiro) => api.post('/barbeiros', barbeiro),
  autenticar: (login, senha) => api.post('/barbeiros/auth', { login, senha }),
  verAgendaSemanal: (id, inicioSemana) => 
    api.get(`/barbeiros/${id}/agenda-semanal?inicio=${inicioSemana}`),
  verAgendamentosPendentes: (id) => 
    api.get(`/barbeiros/${id}/agendamentos-pendentes`),
  responderAgendamento: (barbeiroId, agendamentoId, aceitar, motivo) =>
    api.put(`/barbeiros/${barbeiroId}/agendamentos/${agendamentoId}/resposta`, {
      aceitar,
      motivo
    }),
};

// Serviços de Cliente
export const clienteService = {
  listar: () => api.get('/clientes'),
  buscarPorId: (id) => api.get(`/clientes/${id}`),
  buscarPorEmail: (email) => api.get(`/clientes/email/${email}`),
  criar: (cliente) => api.post('/clientes', cliente),
  atualizar: (id, cliente) => api.put(`/clientes/${id}`, cliente),
  deletar: (id) => api.delete(`/clientes/${id}`),
  verificarExistenciaEmail: (email) => api.get(`/clientes/exists/${email}`),
};

// Serviços de Agendamento
export const agendamentoService = {
  criar: (agendamento) => api.post('/agendamentos', agendamento),
  buscarPorId: (id) => api.get(`/agendamentos/${id}`),
  cancelar: (id, motivo) => api.put(`/agendamentos/${id}/cancelar`, { motivo }),
  calcularValor: (servicoIds) => 
    api.post('/agendamentos/calcular-valor', { servicoIds }),
  buscarPorCliente: (clienteId) => 
    api.get(`/agendamentos/cliente/${clienteId}`),
  buscarPorEmail: (email) => 
    api.get(`/agendamentos/cliente/email/${email}`),
  buscarPorBarbeiro: (barbeiroId) => 
    api.get(`/agendamentos/barbeiro/${barbeiroId}`),
  listarPendentes: () => api.get('/agendamentos/pendentes'),
  listarConfirmados: () => api.get('/agendamentos/confirmados'),
};

// Serviços de Mensagem
export const mensagemService = {
  buscarNaoLidas: (barbeiroId) => 
    api.get(`/mensagens/barbeiro/${barbeiroId}/nao-lidas`),
  buscarPorBarbeiro: (barbeiroId) => 
    api.get(`/mensagens/barbeiro/${barbeiroId}`),
  marcarComoLida: (mensagemId) => 
    api.put(`/mensagens/${mensagemId}/lida`),
  marcarTodasComoLidas: (barbeiroId) => 
    api.put(`/mensagens/barbeiro/${barbeiroId}/marcar-todas-lidas`),
  contarNaoLidas: (barbeiroId) => 
    api.get(`/mensagens/barbeiro/${barbeiroId}/count-nao-lidas`),
};

export default api; 