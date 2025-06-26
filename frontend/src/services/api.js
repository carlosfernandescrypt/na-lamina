import axios from 'axios';

// Configuração para demonstração - dados mockados
const DEMO_MODE = false;

// Dados mockados para demonstração
const MOCK_DATA = {
  servicos: [
    { id: 1, nome: 'Corte Masculino', descricao: 'Corte de cabelo masculino tradicional', preco: 25.00, duracaoMinutos: 30, ativo: true },
    { id: 2, nome: 'Barba', descricao: 'Aparar e modelar barba', preco: 15.00, duracaoMinutos: 20, ativo: true },
    { id: 3, nome: 'Bigode', descricao: 'Aparar e modelar bigode', preco: 10.00, duracaoMinutos: 10, ativo: true },
    { id: 4, nome: 'Sobrancelha', descricao: 'Aparar sobrancelha masculina', preco: 12.00, duracaoMinutos: 15, ativo: true },
    { id: 5, nome: 'Corte + Barba', descricao: 'Pacote completo corte e barba', preco: 35.00, duracaoMinutos: 45, ativo: true },
    { id: 6, nome: 'Corte Degradê', descricao: 'Corte degradê moderno', preco: 30.00, duracaoMinutos: 40, ativo: true }
  ],
  barbeiros: [
    { id: 1, nome: 'João Silva', login: 'joao_silva', ativo: true },
    { id: 2, nome: 'Pedro Santos', login: 'pedro_santos', ativo: true },
    { id: 3, nome: 'Carlos Lima', login: 'carlos_lima', ativo: true }
  ],
  agendamentos: []
};

// Configuração da URL base da API (caso saia do modo demo)
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://barbearia-api-demo.herokuapp.com/api'
    : 'http://localhost:8080/api'
  );

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptors para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API:', error);
    if (error.code === 'ECONNABORTED') {
      console.error('Timeout na requisição');
    }
    return Promise.reject(error);
  }
);

// Helper para simular delay da API
const mockApiCall = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data });
    }, 500);
  });
};

// Serviços de TipoServico
export const tipoServicoService = {
  listarAtivos: () => DEMO_MODE ? mockApiCall(MOCK_DATA.servicos) : api.get('/servicos'),
  buscarPorId: (id) => DEMO_MODE ? mockApiCall(MOCK_DATA.servicos.find(s => s.id === id)) : api.get(`/servicos/${id}`),
  criar: (servico) => DEMO_MODE ? mockApiCall({...servico, id: Date.now()}) : api.post('/servicos', servico),
};

// Serviços de Barbeiro
export const barbeiroService = {
  listarAtivos: () => DEMO_MODE ? mockApiCall(MOCK_DATA.barbeiros) : api.get('/barbeiros'),
  buscarPorId: (id) => DEMO_MODE ? mockApiCall(MOCK_DATA.barbeiros.find(b => b.id === id)) : api.get(`/barbeiros/${id}`),
  criar: (barbeiro) => DEMO_MODE ? mockApiCall({...barbeiro, id: Date.now()}) : api.post('/barbeiros', barbeiro),
  autenticar: (login, senha) => DEMO_MODE ? 
    mockApiCall({ 
      success: true, 
      barbeiro: MOCK_DATA.barbeiros.find(b => b.login === login),
      token: 'demo-token-' + Date.now()
    }) : 
    api.post('/barbeiros/login', { login, senha }),
  verAgendaSemanal: (id, inicioSemana) => DEMO_MODE ? 
    mockApiCall([]) : 
    api.get(`/barbeiros/${id}/agenda-semanal?data=${inicioSemana}`),
  verAgendamentosPendentes: (id) => DEMO_MODE ? 
    mockApiCall([]) : 
    api.get(`/barbeiros/${id}/pendentes`),
  responderAgendamento: (barbeiroId, agendamentoId, aceitar, motivo) => DEMO_MODE ?
    mockApiCall({ success: true }) :
    api.put(`/barbeiros/${barbeiroId}/agendamentos/${agendamentoId}/responder`, {
      aceitar,
      motivo
    }),
};

// Serviços de Cliente
export const clienteService = {
  listar: () => DEMO_MODE ? mockApiCall([]) : api.get('/clientes'),
  buscarPorId: (id) => DEMO_MODE ? mockApiCall(null) : api.get(`/clientes/${id}`),
  buscarPorEmail: (email) => DEMO_MODE ? mockApiCall(null) : api.get(`/clientes/${email}`),
  criar: (cliente) => DEMO_MODE ? mockApiCall({...cliente, id: Date.now()}) : api.post('/clientes', cliente),
  atualizar: (id, cliente) => DEMO_MODE ? mockApiCall(cliente) : api.put(`/clientes/${id}`, cliente),
  deletar: (id) => DEMO_MODE ? mockApiCall({ success: true }) : api.delete(`/clientes/${id}`),
  verificarExistenciaEmail: (email) => DEMO_MODE ? mockApiCall({ exists: false }) : api.get(`/clientes/exists/${email}`),
};

// Serviços de Agendamento
export const agendamentoService = {
  criar: (agendamento) => DEMO_MODE ? 
    mockApiCall({
      ...agendamento, 
      id: Date.now(),
      status: 'PENDENTE',
      dataCriacao: new Date().toISOString()
    }) : 
    api.post('/agendamentos', agendamento),
  buscarPorId: (id) => DEMO_MODE ? mockApiCall(null) : api.get(`/agendamentos/${id}`),
  cancelar: (id, motivo) => DEMO_MODE ? mockApiCall({ success: true }) : api.put(`/agendamentos/${id}/cancelar`, { motivo }),
  calcularValor: (servicoIds) => DEMO_MODE ? 
    mockApiCall({ 
      valorTotal: servicoIds.reduce((total, id) => {
        const servico = MOCK_DATA.servicos.find(s => s.id === id);
        return total + (servico ? servico.preco : 0);
      }, 0)
    }) : 
    api.post('/agendamentos/calcular-valor', { servicoIds }),
  buscarPorCliente: (clienteId) => DEMO_MODE ? mockApiCall([]) : api.get(`/agendamentos/cliente/${clienteId}`),
  buscarPorEmail: (email) => DEMO_MODE ? mockApiCall([]) : api.get(`/agendamentos/cliente/${email}`),
  buscarPorBarbeiro: (barbeiroId) => DEMO_MODE ? mockApiCall([]) : api.get(`/agendamentos/barbeiro/${barbeiroId}`),
  listarPendentes: () => DEMO_MODE ? mockApiCall([]) : api.get('/agendamentos/pendentes'),
  listarConfirmados: () => DEMO_MODE ? mockApiCall([]) : api.get('/agendamentos/confirmados'),
  listarTodos: () => DEMO_MODE ? mockApiCall([]) : api.get('/agendamentos'),
};

// Serviços de Mensagem
export const mensagemService = {
  buscarNaoLidas: (barbeiroId) => DEMO_MODE ? mockApiCall([]) : api.get(`/mensagens/barbeiro/${barbeiroId}/nao-lidas`),
  buscarPorBarbeiro: (barbeiroId) => DEMO_MODE ? mockApiCall([]) : api.get(`/mensagens/barbeiro/${barbeiroId}`),
  marcarComoLida: (mensagemId) => DEMO_MODE ? mockApiCall({ success: true }) : api.put(`/mensagens/${mensagemId}/lida`),
  marcarTodasComoLidas: (barbeiroId) => DEMO_MODE ? mockApiCall({ success: true }) : api.put(`/mensagens/barbeiro/${barbeiroId}/marcar-todas-lidas`),
  contarNaoLidas: (barbeiroId) => DEMO_MODE ? mockApiCall({ count: 0 }) : api.get(`/mensagens/barbeiro/${barbeiroId}/count-nao-lidas`),
};

export default api; 