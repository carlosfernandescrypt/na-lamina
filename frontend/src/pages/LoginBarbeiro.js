import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  Login,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { barbeiroService } from '../services/api';

const LoginBarbeiro = () => {
  const [formData, setFormData] = useState({
    login: '',
    senha: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro quando usuário começar a digitar
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!formData.login.trim()) {
      setError('Digite seu login');
      return;
    }
    
    if (!formData.senha.trim()) {
      setError('Digite sua senha');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await barbeiroService.autenticar(formData.login, formData.senha);
      
      // Verificar se o login foi bem-sucedido e se há dados do barbeiro
      if (response.data && response.data.success && response.data.barbeiro) {
        // Salvar dados do barbeiro no localStorage
        localStorage.setItem('barbeiro', JSON.stringify(response.data.barbeiro));
        localStorage.setItem('isLoggedIn', 'true');
        
        toast.success(`Bem-vindo, ${response.data.barbeiro.nome}!`);
        navigate('/barbeiro/dashboard');
      } else {
        setError('Resposta inválida do servidor');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      
      if (error.response?.status === 401) {
        setError('Login ou senha incorretos');
      } else if (error.response?.status === 404) {
        setError('Usuário não encontrado');
      } else {
        setError('Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={6} sx={{ p: 6, borderRadius: 3 }}>
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Box
            sx={{
              backgroundColor: 'primary.main',
              borderRadius: '50%',
              width: 80,
              height: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <Person sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Login Barbeiro
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Acesse sua área administrativa
          </Typography>
        </Box>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Login"
              name="login"
              value={formData.login}
              onChange={handleChange}
              placeholder="Digite seu login"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
              disabled={loading}
              autoComplete="username"
              autoFocus
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              label="Senha"
              name="senha"
              type={showPassword ? 'text' : 'password'}
              value={formData.senha}
              onChange={handleChange}
              placeholder="Digite sua senha"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              disabled={loading}
              autoComplete="current-password"
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Login />}
            sx={{ mb: 3, py: 1.5 }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        {/* Informações de Login */}
        <Box sx={{ mt: 4, p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            💡 Informações para Teste
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Para testar o sistema, use um dos seguintes logins:
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" component="div" sx={{ mb: 1 }}>
              <strong>Login:</strong> joao_silva <br />
              <strong>Senha:</strong> 123456
            </Typography>
            <Typography variant="body2" component="div" sx={{ mb: 1 }}>
              <strong>Login:</strong> pedro_santos <br />
              <strong>Senha:</strong> 123456
            </Typography>
            <Typography variant="body2" component="div">
              <strong>Login:</strong> carlos_lima <br />
              <strong>Senha:</strong> 123456
            </Typography>
          </Box>
        </Box>

        {/* Links */}
        <Box textAlign="center" sx={{ mt: 3 }}>
          <Button
            variant="text"
            onClick={() => navigate('/')}
            disabled={loading}
          >
            Voltar ao Início
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginBarbeiro; 