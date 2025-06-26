import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Schedule,
  Search,
  ContentCut,
  Star,
  AccessTime,
  LocationOn,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Schedule fontSize="large" color="primary" />,
      title: 'Agendamento Online',
      description: 'Agende seu horário de forma rápida e prática, escolhendo o barbeiro e serviços desejados.',
      action: 'Agendar Agora',
      path: '/agendar',
    },
    {
      icon: <Search fontSize="large" color="primary" />,
      title: 'Consultar Agendamento',
      description: 'Consulte seus agendamentos usando seu email e acompanhe o status em tempo real.',
      action: 'Consultar',
      path: '/consultar',
    },
    {
      icon: <ContentCut fontSize="large" color="primary" />,
      title: 'Nossos Serviços',
      description: 'Conheça todos os nossos serviços, preços e duração. Qualidade garantida!',
      action: 'Ver Serviços',
      path: '/servicos',
    },
  ];

  const stats = [
    { icon: <Star />, value: '4.9', label: 'Avaliação' },
    { icon: <AccessTime />, value: '500+', label: 'Clientes Atendidos' },
    { icon: <LocationOn />, value: '3', label: 'Barbeiros Especializados' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Bem-vindo à BarberShop
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            O melhor em cortes masculinos e cuidados com a barba
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/agendar')}
            sx={{ mr: 2, mb: 2 }}
          >
            Agendar Serviço
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            size="large"
            onClick={() => navigate('/servicos')}
            sx={{ mb: 2 }}
          >
            Ver Serviços
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Como Funciona
        </Typography>
        <Typography
          variant="h6"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Três passos simples para cuidar do seu visual
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(feature.path)}
                  >
                    {feature.action}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ backgroundColor: 'grey.50', py: 6 }}>
        <Container maxWidth="md">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Box textAlign="center">
                  <Box sx={{ color: 'primary.main', mb: 1 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom>
            Pronto para o seu novo visual?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Agende já o seu horário e experimente nossos serviços de qualidade
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/agendar')}
          >
            Agendar Agora
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 