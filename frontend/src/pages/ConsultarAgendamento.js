import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search,
  Schedule,
  Person,
  AttachMoney,
  Cancel,
  CheckCircle,
  HourglassEmpty,
  Block,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { agendamentoService } from '../services/api';

const ConsultarAgendamento = () => {
  const [email, setEmail] = useState('');
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [cancelDialog, setCancelDialog] = useState({ open: false, agendamento: null });
  const [motivo, setMotivo] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Digite seu email para consultar');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Email inválido');
      return;
    }

    setLoading(true);
    try {
      const response = await agendamentoService.buscarPorEmail(email);
      setAgendamentos(response.data);
      setSearched(true);
      
      if (response.data.length === 0) {
        toast.info('Nenhum agendamento encontrado para este email');
      }
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      toast.error('Erro ao buscar agendamentos. Tente novamente.');
      setAgendamentos([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDENTE':
        return <HourglassEmpty color="warning" />;
      case 'CONFIRMADO':
        return <CheckCircle color="success" />;
      case 'CANCELADO':
        return <Cancel color="error" />;
      case 'RECUSADO':
        return <Block color="error" />;
      case 'CONCLUIDO':
        return <CheckCircle color="primary" />;
      default:
        return <HourglassEmpty />;
    }
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

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDENTE':
        return 'Aguardando Confirmação';
      case 'CONFIRMADO':
        return 'Confirmado';
      case 'CANCELADO':
        return 'Cancelado';
      case 'RECUSADO':
        return 'Recusado';
      case 'CONCLUIDO':
        return 'Concluído';
      default:
        return status;
    }
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

  const handleCancelClick = (agendamento) => {
    if (agendamento.status === 'CANCELADO' || agendamento.status === 'CONCLUIDO') {
      toast.error('Este agendamento não pode ser cancelado');
      return;
    }

    setCancelDialog({ open: true, agendamento });
    setMotivo('');
  };

  const handleCancelConfirm = async () => {
    if (!motivo.trim()) {
      toast.error('Digite o motivo do cancelamento');
      return;
    }

    try {
      await agendamentoService.cancelar(cancelDialog.agendamento.id, motivo);
      toast.success('Agendamento cancelado com sucesso');
      
      // Atualizar a lista
      setAgendamentos(prev => 
        prev.map(ag => 
          ag.id === cancelDialog.agendamento.id 
            ? { ...ag, status: 'CANCELADO' }
            : ag
        )
      );
      
      setCancelDialog({ open: false, agendamento: null });
      setMotivo('');
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      toast.error('Erro ao cancelar agendamento. Tente novamente.');
    }
  };

  const canCancel = (agendamento) => {
    return agendamento.status === 'PENDENTE' || agendamento.status === 'CONFIRMADO';
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        Consultar Agendamento
      </Typography>
      
      {/* Formulário de Busca */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <form onSubmit={handleSearch}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Digite seu email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Search />}
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Resultados */}
      {searched && (
        <Box>
          {agendamentos.length === 0 ? (
            <Alert severity="info" sx={{ textAlign: 'center' }}>
              Nenhum agendamento encontrado para este email.
            </Alert>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                {agendamentos.length} agendamento(s) encontrado(s)
              </Typography>
              
              {agendamentos.map((agendamento) => (
                <Card key={agendamento.id} sx={{ mb: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          Agendamento #{agendamento.id}
                        </Typography>
                        <Chip
                          icon={getStatusIcon(agendamento.status)}
                          label={getStatusText(agendamento.status)}
                          color={getStatusColor(agendamento.status)}
                          sx={{ mb: 2 }}
                        />
                      </Box>
                      {canCancel(agendamento) && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleCancelClick(agendamento)}
                          startIcon={<Cancel />}
                        >
                          Cancelar
                        </Button>
                      )}
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Schedule sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            Data e Horário:
                          </Typography>
                        </Box>
                        <Typography variant="body1" fontWeight="medium">
                          {formatDateTime(agendamento.dataHorario)}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Person sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            Barbeiro:
                          </Typography>
                        </Box>
                        <Typography variant="body1" fontWeight="medium">
                          {agendamento.barbeiro?.nome || 'Não informado'}
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <AttachMoney sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            Serviços e Valor Total:
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                          {agendamento.servicos?.map((servico, index) => (
                            <Chip
                              key={index}
                              label={`${servico.nome} - R$ ${servico.preco?.toFixed(2)}`}
                              variant="outlined"
                              size="small"
                              sx={{ mr: 1, mb: 1 }}
                            />
                          ))}
                        </Box>
                        <Typography variant="h6" color="primary">
                          Total: R$ {agendamento.valorTotal?.toFixed(2)}
                        </Typography>
                      </Grid>

                      {agendamento.observacoes && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Observações:
                          </Typography>
                          <Typography variant="body1">
                            {agendamento.observacoes}
                          </Typography>
                        </Grid>
                      )}

                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Criado em: {formatDateTime(agendamento.dataCriacao)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </Box>
      )}

      {/* Dialog de Cancelamento */}
      <Dialog
        open={cancelDialog.open}
        onClose={() => setCancelDialog({ open: false, agendamento: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cancelar Agendamento</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Tem certeza que deseja cancelar este agendamento?
          </Typography>
          <TextField
            fullWidth
            label="Motivo do cancelamento"
            multiline
            rows={3}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Digite o motivo do cancelamento..."
            sx={{ mt: 2 }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setCancelDialog({ open: false, agendamento: null })}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCancelConfirm}
            variant="contained"
            color="error"
            disabled={!motivo.trim()}
          >
            Confirmar Cancelamento
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ConsultarAgendamento; 