import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { toast } from 'react-toastify';
import { tipoServicoService, barbeiroService, agendamentoService } from '../services/api';

dayjs.locale('pt-br');

const AgendarServico = () => {
  const [formData, setFormData] = useState({
    nomeCliente: '',
    emailCliente: '',
    barbeiroId: '',
    servicoIds: [],
    dataHorario: null,
    observacoes: '',
  });

  const [servicos, setServicos] = useState([]);
  const [barbeiros, setBarbeiros] = useState([]);
  const [valorTotal, setValorTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    carregarDados();
  }, []);

  const calcularValorTotal = useCallback(async () => {
    try {
      const response = await agendamentoService.calcularValor(formData.servicoIds);
      setValorTotal(response.data.valorTotal);
    } catch (error) {
      console.error('Erro ao calcular valor:', error);
    }
  }, [formData.servicoIds]);

  useEffect(() => {
    if (formData.servicoIds.length > 0) {
      calcularValorTotal();
    } else {
      setValorTotal(0);
    }
  }, [formData.servicoIds, calcularValorTotal]);

  const carregarDados = async () => {
    try {
      setLoadingData(true);
      const [servicosResponse, barbeirosResponse] = await Promise.all([
        tipoServicoService.listarAtivos(),
        barbeiroService.listarAtivos(),
      ]);

      setServicos(servicosResponse.data);
      setBarbeiros(barbeirosResponse.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados. Tente novamente.');
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Limpar erro do campo quando o usuário digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleServicoChange = (servicoId) => {
    const isSelected = formData.servicoIds.includes(servicoId);
    let newServicoIds;

    if (isSelected) {
      newServicoIds = formData.servicoIds.filter(id => id !== servicoId);
    } else {
      newServicoIds = [...formData.servicoIds, servicoId];
    }

    handleInputChange('servicoIds', newServicoIds);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nomeCliente.trim()) {
      newErrors.nomeCliente = 'Nome é obrigatório';
    }

    if (!formData.emailCliente.trim()) {
      newErrors.emailCliente = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.emailCliente)) {
      newErrors.emailCliente = 'Email inválido';
    }

    if (!formData.barbeiroId) {
      newErrors.barbeiroId = 'Selecione um barbeiro';
    }

    if (formData.servicoIds.length === 0) {
      newErrors.servicoIds = 'Selecione pelo menos um serviço';
    }

    if (!formData.dataHorario) {
      newErrors.dataHorario = 'Selecione data e horário';
    } else if (formData.dataHorario.isBefore(dayjs())) {
      newErrors.dataHorario = 'Data e horário devem ser futuros';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setLoading(true);
    try {
      const agendamentoData = {
        ...formData,
        dataHorario: formData.dataHorario.format('YYYY-MM-DDTHH:mm:ss'),
      };

      await agendamentoService.criar(agendamentoData);
      
      toast.success('Agendamento realizado com sucesso! Aguarde a confirmação do barbeiro.');
      
      // Limpar formulário
      setFormData({
        nomeCliente: '',
        emailCliente: '',
        barbeiroId: '',
        servicoIds: [],
        dataHorario: null,
        observacoes: '',
      });
      setValorTotal(0);
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      const errorMessage = error.response?.data || 'Erro ao criar agendamento. Tente novamente.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getServicosSelecionados = () => {
    return servicos.filter(servico => formData.servicoIds.includes(servico.id));
  };

  if (loadingData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        Agendar Serviço
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Dados do Cliente */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Dados do Cliente
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome Completo"
                value={formData.nomeCliente}
                onChange={(e) => handleInputChange('nomeCliente', e.target.value)}
                error={!!errors.nomeCliente}
                helperText={errors.nomeCliente}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.emailCliente}
                onChange={(e) => handleInputChange('emailCliente', e.target.value)}
                error={!!errors.emailCliente}
                helperText={errors.emailCliente}
                required
              />
            </Grid>

            {/* Seleção do Barbeiro */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Escolha o Barbeiro
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.barbeiroId}>
                <InputLabel>Barbeiro</InputLabel>
                <Select
                  value={formData.barbeiroId}
                  onChange={(e) => handleInputChange('barbeiroId', e.target.value)}
                  label="Barbeiro"
                >
                  {barbeiros.map((barbeiro) => (
                    <MenuItem key={barbeiro.id} value={barbeiro.id}>
                      {barbeiro.nome}
                    </MenuItem>
                  ))}
                </Select>
                {errors.barbeiroId && (
                  <Typography variant="caption" color="error">
                    {errors.barbeiroId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Seleção de Serviços */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Escolha os Serviços
              </Typography>
              {errors.servicoIds && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.servicoIds}
                </Alert>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <FormGroup>
                {servicos.map((servico) => (
                  <FormControlLabel
                    key={servico.id}
                    control={
                      <Checkbox
                        checked={formData.servicoIds.includes(servico.id)}
                        onChange={() => handleServicoChange(servico.id)}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1">
                          {servico.nome} - R$ {servico.preco.toFixed(2)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {servico.descricao} ({servico.duracaoMinutos} min)
                        </Typography>
                      </Box>
                    }
                  />
                ))}
              </FormGroup>
            </Grid>

            {/* Serviços Selecionados */}
            {formData.servicoIds.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Serviços Selecionados
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {getServicosSelecionados().map((servico) => (
                    <Chip
                      key={servico.id}
                      label={`${servico.nome} - R$ ${servico.preco.toFixed(2)}`}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Typography variant="h6" color="primary">
                  Total: R$ {valorTotal.toFixed(2)}
                </Typography>
              </Grid>
            )}

            {/* Data e Horário */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Data e Horário
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                <DateTimePicker
                  label="Data e Horário"
                  value={formData.dataHorario}
                  onChange={(newValue) => handleInputChange('dataHorario', newValue)}
                  minDateTime={dayjs()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.dataHorario,
                      helperText: errors.dataHorario,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            {/* Observações */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observações (opcional)"
                multiline
                rows={3}
                value={formData.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                placeholder="Alguma observação especial para o seu atendimento?"
              />
            </Grid>

            {/* Botão de Submit */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ px: 6 }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Agendando...
                    </>
                  ) : (
                    'Agendar Serviço'
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AgendarServico; 