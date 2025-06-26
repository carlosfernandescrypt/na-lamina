import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Chip,
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Badge,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Dashboard,
  ExitToApp,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Message,
  Today,
  TrendingUp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  barbeiroService, 
  agendamentoService, 
  mensagemService 
} from '../services/api';

const DashboardBarbeiro = () => {
  const [barbeiro, setBarbeiro] = useState(null);
  const [agendamentosPendentes, setAgendamentosPendentes] = useState([]);
  const [agendamentosConfirmados, setAgendamentosConfirmados] = useState([]);
  const [mensagensNaoLidas, setMensagensNaoLidas] = useState(0);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAgendamento, setSelectedAgendamento] = useState(null);
  const [responseDialog, setResponseDialog] = useState({ open: false, type: '' });
  const [responseMotivo, setResponseMotivo] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();

  const carregarDados = useCallback(async () => {
    try {
      const barbeiroData = JSON.parse(localStorage.getItem('barbeiro'));
      
      // Carregar agendamentos pendentes
      const pendentesResponse = await agendamentoService.listarPendentes();
      const meusPendentes = pendentesResponse.data.filter(
        ag => ag.barbeiro?.id === barbeiroData.id
      );
      setAgendamentosPendentes(meusPendentes);

      // Carregar agendamentos confirmados de hoje
      const confirmadosResponse = await agendamentoService.listarConfirmados();
      const meusConfirmados = confirmadosResponse.data.filter(
        ag => ag.barbeiro?.id === barbeiroData.id &&
             isToday(new Date(ag.dataHorario))
      );
      setAgendamentosConfirmados(meusConfirmados);

      // Carregar mensagens não lidas
      const mensagensResponse = await mensagemService.contarNaoLidas(barbeiroData.id);
      setMensagensNaoLidas(mensagensResponse.data);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const barbeiroData = localStorage.getItem('barbeiro');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!barbeiroData || !isLoggedIn) {
      navigate('/login-barbeiro');
      return;
    }
    
    setBarbeiro(JSON.parse(barbeiroData));
    carregarDados();
  }, [navigate, carregarDados]);

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const handleLogout = () => {
    localStorage.removeItem('barbeiro');
    localStorage.removeItem('isLoggedIn');
    toast.info('Logout realizado com sucesso');
    navigate('/');
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDENTE':
        return 'warning';
      case 'CONFIRMADO':
        return 'success';
      case 'CANCELADO':
        return 'error';
      case 'RECUSADO':
        return 'error';
      case 'CONCLUIDO':
        return 'primary';
      default:
        return 'default';
    }
  };

  const handleResponseClick = (agendamento, type) => {
    setSelectedAgendamento(agendamento);
    setResponseDialog({ open: true, type });
    setResponseMotivo('');
  };

  const handleResponseConfirm = async () => {
    if (!selectedAgendamento) return;

    try {
      const isConfirmar = responseDialog.type === 'confirmar';
      
      if (!isConfirmar && !responseMotivo.trim()) {
        toast.error('Digite o motivo da recusa');
        return;
      }

      await barbeiroService.responderAgendamento(
        selectedAgendamento.id, 
        isConfirmar, 
        responseMotivo || null
      );

      toast.success(
        isConfirmar 
          ? 'Agendamento confirmado com sucesso!' 
          : 'Agendamento recusado com sucesso!'
      );

      // Recarregar dados
      carregarDados();
      setResponseDialog({ open: false, type: '' });
      setSelectedAgendamento(null);
      setResponseMotivo('');

    } catch (error) {
      console.error('Erro ao responder agendamento:', error);
      toast.error('Erro ao responder agendamento');
    }
  };

  const calcularEstatisticas = () => {
    const totalPendentes = agendamentosPendentes.length;
    const totalHoje = agendamentosConfirmados.length;
    const valorHoje = agendamentosConfirmados.reduce(
      (total, ag) => total + (ag.valorTotal || 0), 0
    );

    return { totalPendentes, totalHoje, valorHoje };
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (!barbeiro) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Erro ao carregar dados do barbeiro. Faça login novamente.
        </Alert>
      </Container>
    );
  }

  const stats = calcularEstatisticas();

  return (
    <Box>
      {/* Header do Dashboard */}
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Dashboard sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard - {barbeiro.nome}
          </Typography>
          
          <IconButton color="inherit" sx={{ mr: 2 }}>
            <Badge badgeContent={mensagensNaoLidas} color="error">
              <Message />
            </Badge>
          </IconButton>
          
          <IconButton color="inherit" onClick={handleMenuClick}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              {barbeiro.nome.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} />
              Sair
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        {/* Cards de Estatísticas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Agendamentos Pendentes
                    </Typography>
                    <Typography variant="h4" component="div">
                      {stats.totalPendentes}
                    </Typography>
                  </Box>
                  <HourglassEmpty color="warning" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Agendamentos Hoje
                    </Typography>
                    <Typography variant="h4" component="div">
                      {stats.totalHoje}
                    </Typography>
                  </Box>
                  <Today color="primary" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Faturamento Hoje
                    </Typography>
                    <Typography variant="h4" component="div">
                      R$ {stats.valorHoje.toFixed(2)}
                    </Typography>
                  </Box>
                  <TrendingUp color="success" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label={`Pendentes (${stats.totalPendentes})`} />
            <Tab label={`Hoje (${stats.totalHoje})`} />
          </Tabs>
        </Box>

        {/* Agendamentos Pendentes */}
        {tabValue === 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Agendamentos Pendentes de Confirmação
              </Typography>
              
              {agendamentosPendentes.length === 0 ? (
                <Alert severity="info">
                  Nenhum agendamento pendente no momento.
                </Alert>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Cliente</TableCell>
                        <TableCell>Data/Hora</TableCell>
                        <TableCell>Serviços</TableCell>
                        <TableCell>Valor</TableCell>
                        <TableCell>Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {agendamentosPendentes.map((agendamento) => (
                        <TableRow key={agendamento.id}>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {agendamento.cliente?.nome}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {agendamento.cliente?.email}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            {formatDateTime(agendamento.dataHorario)}
                          </TableCell>
                          <TableCell>
                            {agendamento.servicos?.map((servico, index) => (
                              <Chip
                                key={index}
                                label={servico.nome}
                                size="small"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                          </TableCell>
                          <TableCell>
                            R$ {agendamento.valorTotal?.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                onClick={() => handleResponseClick(agendamento, 'confirmar')}
                                startIcon={<CheckCircle />}
                              >
                                Confirmar
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                onClick={() => handleResponseClick(agendamento, 'recusar')}
                                startIcon={<Cancel />}
                              >
                                Recusar
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        )}

        {/* Agendamentos de Hoje */}
        {tabValue === 1 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Agendamentos Confirmados para Hoje
              </Typography>
              
              {agendamentosConfirmados.length === 0 ? (
                <Alert severity="info">
                  Nenhum agendamento confirmado para hoje.
                </Alert>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Horário</TableCell>
                        <TableCell>Cliente</TableCell>
                        <TableCell>Serviços</TableCell>
                        <TableCell>Valor</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {agendamentosConfirmados
                        .sort((a, b) => new Date(a.dataHorario) - new Date(b.dataHorario))
                        .map((agendamento) => (
                        <TableRow key={agendamento.id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {formatTime(agendamento.dataHorario)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {agendamento.cliente?.nome}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {agendamento.cliente?.telefone}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            {agendamento.servicos?.map((servico, index) => (
                              <Chip
                                key={index}
                                label={servico.nome}
                                size="small"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                          </TableCell>
                          <TableCell>
                            R$ {agendamento.valorTotal?.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label="Confirmado"
                              color={getStatusColor(agendamento.status)}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Dialog de Resposta */}
      <Dialog
        open={responseDialog.open}
        onClose={() => setResponseDialog({ open: false, type: '' })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {responseDialog.type === 'confirmar' ? 'Confirmar Agendamento' : 'Recusar Agendamento'}
        </DialogTitle>
        <DialogContent>
          {selectedAgendamento && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" gutterBottom>
                <strong>Cliente:</strong> {selectedAgendamento.cliente?.nome}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Data/Hora:</strong> {formatDateTime(selectedAgendamento.dataHorario)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Serviços:</strong> {selectedAgendamento.servicos?.map(s => s.nome).join(', ')}
              </Typography>
            </Box>
          )}
          
          <Typography gutterBottom>
            {responseDialog.type === 'confirmar' 
              ? 'Tem certeza que deseja confirmar este agendamento?'
              : 'Tem certeza que deseja recusar este agendamento?'
            }
          </Typography>
          
          {responseDialog.type === 'recusar' && (
            <TextField
              fullWidth
              label="Motivo da recusa"
              multiline
              rows={3}
              value={responseMotivo}
              onChange={(e) => setResponseMotivo(e.target.value)}
              placeholder="Digite o motivo da recusa..."
              sx={{ mt: 2 }}
              required
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResponseDialog({ open: false, type: '' })}>
            Cancelar
          </Button>
          <Button
            onClick={handleResponseConfirm}
            variant="contained"
            color={responseDialog.type === 'confirmar' ? 'success' : 'error'}
            disabled={responseDialog.type === 'recusar' && !responseMotivo.trim()}
          >
            {responseDialog.type === 'confirmar' ? 'Confirmar' : 'Recusar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardBarbeiro; 