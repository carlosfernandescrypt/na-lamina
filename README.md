# Sistema de Barbearia - API REST

Sistema de agendamento para barbearias desenvolvido em Spring Boot.

## 📋 Funcionalidades

- **Gestão de Clientes**: Cadastro e controle de clientes
- **Gestão de Barbeiros**: Controle de profissionais da barbearia
- **Gestão de Serviços**: Cadastro dos tipos de serviços oferecidos
- **Sistema de Agendamentos**: Agendamento de horários para os clientes
- **Sistema de Mensagens**: Comunicação entre cliente e barbearia

## 🚀 Tecnologias Utilizadas

- **Java 17**
- **Spring Boot 3.x**
- **Spring Data JPA**
- **Spring Security**
- **H2 Database** (para desenvolvimento)
- **Maven**

## 📦 Estrutura do Projeto

```
src/
├── main/
│   ├── java/com/barbearia/
│   │   ├── controller/         # Controladores REST
│   │   ├── model/             # Entidades JPA
│   │   ├── repository/        # Repositórios de dados
│   │   ├── service/           # Lógica de negócio
│   │   ├── config/            # Configurações
│   │   └── BarbeariaApplication.java
│   └── resources/
│       ├── application.properties
│       └── data.sql           # Dados iniciais
```

## 🛠️ Como Executar

### Pré-requisitos
- Java 17 ou superior
- Maven 3.6+

### Passos para execução

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd barbearia-pw
   ```

2. **Compile o projeto**
   ```bash
   mvn clean compile
   ```

3. **Execute a aplicação**
   ```bash
   mvn spring-boot:run
   ```

4. **Acesse a aplicação**
   - API: http://localhost:8080
   - H2 Console: http://localhost:8080/h2-console

## 📊 Banco de Dados H2

Para acessar o console do H2 durante desenvolvimento:

- **URL**: http://localhost:8080/h2-console
- **JDBC URL**: `jdbc:h2:mem:barbearia`
- **Username**: `sa`
- **Password**: (deixar em branco)

## 🎯 Endpoints da API

### Serviços
- `GET /api/servicos` - Lista serviços ativos
- `GET /api/servicos/{id}` - Busca serviço por ID
- `POST /api/servicos` - Cria novo serviço

### Clientes
- `GET /api/clientes` - Lista clientes ativos
- `POST /api/clientes` - Cria novo cliente
- `GET /api/clientes/{id}` - Busca cliente por ID

### Barbeiros
- `GET /api/barbeiros` - Lista barbeiros ativos
- `POST /api/barbeiros` - Cria novo barbeiro
- `GET /api/barbeiros/{id}` - Busca barbeiro por ID

### Agendamentos
- `GET /api/agendamentos` - Lista agendamentos
- `POST /api/agendamentos` - Cria novo agendamento
- `GET /api/agendamentos/{id}` - Busca agendamento por ID

### Sistema
- `GET /api/status` - Status da aplicação

## 📝 Dados Iniciais

O sistema é inicializado com:

### Serviços
- Corte Masculino (R$ 25,00 - 30min)
- Barba (R$ 15,00 - 20min)
- Bigode (R$ 10,00 - 15min)
- Sobrancelha (R$ 12,00 - 10min)
- Corte + Barba (R$ 35,00 - 45min)
- Corte Degradê (R$ 30,00 - 40min)

### Barbeiros
- João Silva (login: joao / senha: 123456)
- Pedro Santos (login: pedro / senha: 123456)
- Carlos Lima (login: carlos / senha: 123456)

## 🔧 Configurações

As principais configurações estão no arquivo `application.properties`:

- **Servidor**: Porta 8080
- **Banco**: H2 em memória
- **JPA**: DDL auto create-drop
- **CORS**: Habilitado para todos os origins
- **Security**: Desabilitado para desenvolvimento

## 📚 Documentação Adicional

### Entidades Principais

- **Cliente**: Dados pessoais e contato dos clientes
- **Barbeiro**: Profissionais que prestam serviços
- **TipoServico**: Tipos de serviços oferecidos
- **Agendamento**: Agendamentos de serviços
- **Mensagem**: Sistema de comunicação

### Regras de Negócio

- Agendamentos devem respeitar horário de funcionamento
- Não é possível agendar em horários já ocupados
- Clientes e barbeiros podem ser desativados sem exclusão

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 📞 Contato

Para dúvidas ou sugestões, entre em contato através dos issues do GitHub. 