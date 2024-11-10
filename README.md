<p align="center">
  <h1>Sistema de Transações Bancárias com Concorrência de Saldo</h1>
</p>

## 🎯 **Descrição do projeto**

Este projeto tem como objetivo desenvolver uma API para um sistema de transações bancárias, capaz de gerenciar múltiplas transações concorrentes de forma eficiente e segura.

A API é projetada para garantir a integridade do saldo das contas em todas as operações, implementando mecanismos que previnem inconsistências, como conflitos de transações e atualizações simultâneas.

- **Integridade dos Dados**: A API realiza validações em cada transação, assegurando que operações simultâneas não resultem em erros ou corrupção de dados. Isso inclui o uso de transações atômicas e estratégias de isolamento adequadas.

-  **Escalabilidade e gestão de transações simultâneas**: A API implementa estratégias de filas e cache, facilitando a comunicação assíncrona das transações e garantindo a possibilidade de escalar o projeto como um todo.

## 📖 Tabela de conteúdos

- [Funcionalidades](#-funcionalidades)
- [Executando a aplicação](#%EF%B8%8Fexecutando-a-aplicação)
  - [Clone o repositório](#1--clone-o-repositório-e-navegue-até-a-pasta-backend)
  - [Instale dependências](#2-instale-as-dependências)
  - [Configure suas variáveis de ambiente](#3-configure-suas-variáveis-de-ambiente)
  - [Configure os containers](#4-configure-os-contêineres)
  - [Inicie a aplicação](#5-inicie-a-aplicação)
  - [Executar Migrations](#6-executar-migrations)
  - [Fazendo requisições](#7-fazendo-requisições)
- [Testes automatizados com Jest](#-testes-automatizados-com-jest)
- [Tecnologias utilizadas](#%EF%B8%8F-tecnologias-utilizadas)
- [Roadmap de melhorias](#-roadmap-de-melhorias)
- [Contato](#-contato)
- [Licença](#-licença)


## 🎯 **Funcionalidades**

1. **Cadastro de Conta Bancária:**
   - A aplicação permite a criação de novas contas bancárias com um saldo inicial definido no momento da criação.
   - Cada conta possui um número único e um saldo associado.
 
2. **Transações:**
    - A aplicação suporta transações dos seguintes tipos:
      - Depósito
      - Saque
      - Transferência entre contas.

    - Processamento em filas:
      - Centraliza e gerencia todas as transações (depósitos, saques, transferências) através de uma fila.
      - Quando uma transação é iniciada, ela é enfileirada. Um serviço de processamento consome essa fila, realizando as transações de forma assíncrona. Isso permite um processamento controlado e resiliente.

    - Armazenamento em cache:
      - O acesso às informações bancárias em cache reduz a carga de consultas ao banco de dados, melhorando a velocidade de acesso às informações, garantindo eficiência e otimizando as operações de transação.
      - Ao acessar informações de uma conta (como saldo e histórico de transações), o sistema primeiro verifica se esses dados estão no cache. Se sim, são retornados imediatamente; se não, a consulta é feita ao banco de dados e o resultado é armazenado no cache para acessos futuros.
      - Quando uma transação é processada, seu status é atualizado no cache. Isso facilita o acompanhamento do estado das transações (pendente, concluída, falha), permitindo que os usuários consultem rapidamente o status de suas transações sem esperar por chamadas ao banco de dados.

> [!IMPORTANT]
> Este projeto terá futuras atualizações com melhorias e implementação de novas funcionalidades. Você pode conferir as melhorias planejadas no [Roadmap de melhorias](#%EF%B8%8Froadmap-de-melhorias)
 
## ⚡️Executando a aplicação

Esta aplicação foi construída para rodar em contêineres Docker, juntamente com o banco de dados (Postgres) e o Redis. Para iniciá-la, é necessário configurar ambos os contêineres (um para a aplicação e outro para cada banco de dados). As variáveis de ambiente estão configuradas no arquivo `.env` como sugestão e podem ser alteradas conforme a necessidade.

Siga os passos abaixo:

### 1.  Clone o repositório e navegue até a pasta backend:

#### Clonando usando a URL da web.

```bash
$ git clone https://github.com/p1reis/banking-transaction-system.git && cd banking-transaction-system
```

#### Usando uma chave SSH protegida por senha

```bash
$ git clone git@github.com:p1reis/banking-transaction-system.git && cd banking-transaction-system
```

### 2. Instale as dependências:

Você pode usar o gerenciador de pacotes que preferir. Para este projeto, eu utilizei o pnpm, então este documento seguirá essa abordagem.

```bash
$ pnpm install
```

### 3. Configure suas variáveis de ambiente:

Use o arquivo `.env` para definir as variáveis de ambiente que você precisa:

```yaml
# Postgres database variables:
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_PORT=
POSTGRES_DB=
POSTGRES_TZ=
POSTGRES_SCHEMA=

# Database connection:
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:${POSTGRES_PORT}/${POSTGRES_DB}?schema=${POSTGRES_SCHEMA}&options=-c%20timezone=${POSTGRES_TZ}

# Port application:
PORT=

# Redis:
REDIS_PORT=
REDIS_HOST=
```

### 4. Configure os contêineres:

Para desenvolvimento local com recarregamento da aplicação, você pode usar o arquivo docker-compose.db.yml para criar contêiners para rodar a aplicação e outros para os banco de dados. Execute o seguinte comando:

```bash
$ pnpm run docker-up
```

Este comando iniciará os contêineres da aplicação e do banco de dados. Todas as dependências necessárias já estarão instaladas nos contêineres, então você não precisa se preocupar com isso.

### 5. Inicie a aplicação:

Para executar, escolha o modo que deseja e use:

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

> **Note:** Verifique no terminal do Docker se a aplicação está rodando corretamente.

### 6. Executar Migrations:

Após iniciar a aplicação, você pode precisar executar as migrations para configurar o banco de dados corretamente. Siga os passos abaixo:

1. **Acesse o contêiner da aplicação**:

    Primeiro, você precisa acessar o contêiner da aplicação que foi criado. Execute o seguinte comando:

    ```bash
    $ docker exec -it application sh
    ```

2. **Executar as migrations**:

    Dentro do contêiner, execute o comando para rodar as migrations. O comando pode variar dependendo da sua configuração, mas geralmente será algo como:

    ```bash
    $ pnpm exec prisma migrate deploy
    ```

3. **Verificar o status das migrations**:

    Após executar as migrations, você pode querer verificar se todas foram aplicadas corretamente. Isso pode ser feito consultando o banco de dados ou utilizando comandos específicos, dependendo da ferramenta que você está usando.

4. **Sair do contêiner**:

    Para sair do contêiner, basta digitar `exit`.

> [!NOTE]
> Se você encontrar erros durante a execução das migrations, verifique as mensagens de erro no terminal. Alguns problemas comuns incluem:
>
>  - **Conexão com o banco de dados**: Certifique-se de que o contêiner do banco de dados esteja em execução e que as variáveis de ambiente estão corretas.
>
>  - **Configurações do arquivo `.env`**: Verifique se todas as variáveis necessárias estão preenchidas corretamente.

### 7. Fazendo requisições:

Acesse a coleção no Postman para realizar requisições.

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/34772834-5c7448a7-427a-411c-81c1-b32dfdaaaf65?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D34772834-5c7448a7-427a-411c-81c1-b32dfdaaaf65%26entityType%3Dcollection%26workspaceId%3D87b6bccf-117c-4c91-ad20-c9c9f5938958)


## 🐛 **Testes Automatizados com Jest**

Este repositório inclui apenas os testes automatizados básicos do Nest.

Para iniciar os testes, execute:

```bash
# unit tests
$ pnpm run test

# test coverage
$ pnpm run test:cov
```

Este projeto não inclui testes end-to-end.

## ✔️ Tecnologias Utilizadas

- `Typescript`
- `Nest.js`
- `Prisma`
- `Redis`
- `Bull`
- `PostgreSQL`
- `Docker`

## 🚀 Roadmap de Melhorias

Todas as tarefas, issues e progresso do projeto está sendo mapeado no Github Projects. 

Acesse: [Sistema de Transações Bancárias](https://github.com/users/p1reis/projects/1)


## 🫱🏾‍🫲🏾 Contato

Sinta-se à vontade para entrar em contato comigo. Abaixo estão as melhores maneiras de me contatar:

- **Email**: Entre em contato por email para perguntas ou assistência em [contatodopedroreis@gmail.com](mailto:contatodopedroreis@gmail.com).
- **LinkedIn**: Conecte-se comigo ou me siga em [in/p-reis](https://www.linkedin.com/in/p-reis/)

## 📃 Licença

Licenciado sob a [MIT licensed](LICENSE).

<p align="right"><a href="#top">Back to top</a></p>
