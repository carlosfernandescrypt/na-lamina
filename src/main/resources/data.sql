-- Inserindo tipos de serviços
INSERT INTO tipos_servico (nome, descricao, preco, duracao_minutos, ativo) VALUES ('Corte Masculino', 'Corte de cabelo masculino tradicional', 25.00, 30, true);
INSERT INTO tipos_servico (nome, descricao, preco, duracao_minutos, ativo) VALUES ('Barba', 'Aparar e modelar barba', 15.00, 20, true);
INSERT INTO tipos_servico (nome, descricao, preco, duracao_minutos, ativo) VALUES ('Bigode', 'Aparar e modelar bigode', 10.00, 10, true);
INSERT INTO tipos_servico (nome, descricao, preco, duracao_minutos, ativo) VALUES ('Sobrancelha', 'Aparar sobrancelha masculina', 12.00, 15, true);
INSERT INTO tipos_servico (nome, descricao, preco, duracao_minutos, ativo) VALUES ('Corte + Barba', 'Pacote completo corte e barba', 35.00, 45, true);
INSERT INTO tipos_servico (nome, descricao, preco, duracao_minutos, ativo) VALUES ('Corte Degradê', 'Corte degradê moderno', 30.00, 40, true);

-- Inserindo barbeiros (senha para todos: 123456 - hash BCrypt correto)
INSERT INTO barbeiros (nome, login, senha, ativo, data_criacao) VALUES ('João Silva', 'joao_silva', '$2a$10$oWbX5yZvmSTF21Mcw6hPGe.8hBSqc2flUw6p3WT6kWNXQmM9NB6VC', true, CURRENT_TIMESTAMP);
INSERT INTO barbeiros (nome, login, senha, ativo, data_criacao) VALUES ('Pedro Santos', 'pedro_santos', '$2a$10$oWbX5yZvmSTF21Mcw6hPGe.8hBSqc2flUw6p3WT6kWNXQmM9NB6VC', true, CURRENT_TIMESTAMP);
INSERT INTO barbeiros (nome, login, senha, ativo, data_criacao) VALUES ('Carlos Lima', 'carlos_lima', '$2a$10$oWbX5yZvmSTF21Mcw6hPGe.8hBSqc2flUw6p3WT6kWNXQmM9NB6VC', true, CURRENT_TIMESTAMP);