import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  Schedule,
  AttachMoney,
  ContentCut,
  AccessTime,
  CalendarToday,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { tipoServicoService } from '../services/api';

const ListarServicos = () => {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarServicos();
  }, []);

  const carregarServicos = async () => {
    try {
      const response = await tipoServicoService.listarAtivos();
      setServicos(response.data);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      toast.error('Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  const formatDuracao = (minutos) => {
    if (minutos < 60) {
      return `${minutos} min`;
    }
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    
    if (minutosRestantes === 0) {
      return `${horas}h`;
    }
    return `${horas}h ${minutosRestantes}min`;
  };

  const getServiceIcon = (nome) => {
    const nomeUpper = nome.toUpperCase();
    if (nomeUpper.includes('BARBA')) {
      return '🧔';
    } else if (nomeUpper.includes('CORTE')) {
      return '✂️';
    } else if (nomeUpper.includes('SOBRANCELHA')) {
      return '👁️';
    } else if (nomeUpper.includes('BIGODE')) {
      return '👨';
    }
    return '💇‍♂️';
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

  if (servicos.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
          Nossos Serviços
        </Typography>
        <Alert severity="info" sx={{ textAlign: 'center' }}>
          Nenhum serviço disponível no momento.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Nossos Serviços
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Conheça todos os serviços que oferecemos com qualidade e profissionalismo
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/agendar')}
          startIcon={<CalendarToday />}
          sx={{ mt: 2 }}
        >
          Agendar Serviço
        </Button>
      </Box>

      {/* Lista de Serviços */}
      <Grid container spacing={3}>
        {servicos.map((servico) => (
          <Grid item xs={12} sm={6} md={4} key={servico.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => theme.shadows[8],
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                {/* Ícone e Nome */}
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      fontSize: '3rem',
                      mb: 1,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '60px',
                    }}
                  >
                    {getServiceIcon(servico.nome)}
                  </Box>
                  <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
                    {servico.nome}
                  </Typography>
                </Box>

                {/* Descrição */}
                {servico.descricao && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mb: 3, textAlign: 'center', minHeight: '40px' }}
                  >
                    {servico.descricao}
                  </Typography>
                )}

                {/* Informações do Serviço */}
                <Box sx={{ mt: 'auto' }}>
                  {/* Preço */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <AttachMoney sx={{ color: 'success.main', mr: 1 }} />
                    <Typography variant="h5" color="success.main" fontWeight="bold">
                      R$ {servico.preco?.toFixed(2)}
                    </Typography>
                  </Box>

                  {/* Duração */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <AccessTime sx={{ color: 'primary.main', mr: 1 }} />
                    <Chip
                      label={formatDuracao(servico.duracaoMinutos)}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </Box>

                  {/* Botão de Ação */}
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => navigate('/agendar')}
                      startIcon={<Schedule />}
                    >
                      Agendar
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Informações Adicionais */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Dúvidas sobre nossos serviços?
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Entre em contato conosco ou agende uma consulta para conhecer melhor nossos serviços.
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/agendar')}
            sx={{ mr: 2 }}
          >
            Agendar Consulta
          </Button>
          <Button
            variant="text"
            size="large"
            onClick={() => navigate('/consultar')}
          >
            Consultar Agendamento
          </Button>
        </Box>
      </Box>

      {/* Seção de Destaque */}
      <Box
        sx={{
          mt: 6,
          p: 4,
          backgroundColor: 'primary.main',
          color: 'white',
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" gutterBottom>
          🎯 Combos Especiais
        </Typography>
        <Typography variant="body1" paragraph>
          Combine serviços e economize! Nossos barbeiros podem sugerir os melhores combos para você.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => navigate('/agendar')}
        >
          Ver Combos
        </Button>
      </Box>
    </Container>
  );
};

export default ListarServicos; 