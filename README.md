# 🛠️ Sistema de Gestão para Oficinas Mecânicas (AutoManager)
### 🎓 Projeto Didático - Faculdade de Tecnologia Senai Fatesg

![PostgreSQL](https://shields.io)
![Security](https://shields.io)
![Academic](https://shields.io)

## 📌 Sobre o Projeto
O **AutoManager** é uma solução de banco de dados desenvolvida como material de estudo e prática para a turma de **Análise e Desenvolvimento de Sistemas (ADS3)** da **Fatesg Senai GO**. 

O projeto simula o ecossistema de uma oficina mecânica, cobrindo desde o controle de acesso de funcionários até a gestão de estoque e faturamento de ordens de serviço.

### 🎯 Objetivos Acadêmicos
- **Segurança da Informação:** Implementação de autenticação com armazenamento seguro (Hash + Salt).
- **Modelagem Relacional:** Aplicação de chaves primárias UUID, integridade referencial e tipos complexos (ENUM).
- **Otimização:** Uso de índices estratégicos e colunas geradas (`GENERATED ALWAYS`).
- **Documentação Técnica:** Uso de Mermaid.js para representação de modelos de classe e ER.

---

## 📑 Requisitos do Sistema

### Requisitos Funcionais (RF)
- **RF01 (Autenticação):** O sistema deve autenticar usuários utilizando hashes criptográficos.
- **RF02 (Clientes):** Cadastro completo de clientes com múltiplos meios de contato e endereços.
- **RF03 (Veículos):** Gerenciamento de frotas por cliente com identificação única por placa.
- **RF04 (Ordens de Serviço):** Abertura e controle de status de manutenção (Aberta, Em Serviço, etc).
- **RF05 (Orçamentos):** Composição de custos separando mão de obra de peças.
- **RF06 (Estoque):** Baixa automática em itens de catálogo e histórico de movimentações.

### Requisitos Não Funcionais (RNF)
- **RNF01:** Persistência em PostgreSQL 13+.
- **RNF02:** Identificadores universais (UUID) para evitar previsibilidade de IDs.
- **RNF03:** Registro de data/hora de criação e atualização em todas as entidades.

---

## 🏗️ Modelagem Técnica

### 1. Modelo Entidade-Relacionamento (DER)
```mermaid
erDiagram
    USUARIOS ||--o{ ORDEM_SERVICO : "atende"
    CLIENTES ||--o{ CONTATOS_TELEFONICOS : "possui"
    CLIENTES ||--o{ CONTATOS_EMAIL : "possui"
    CLIENTES ||--o{ VEICULOS : "tem"
    VEICULOS ||--o{ ORDEM_SERVICO : "registra"
    ORDEM_SERVICO ||--o{ ORCAMENTOS : "gera"
    ORDEM_SERVICO ||--o{ ESTOQUE_MOV : "gera"
    ORDEM_SERVICO ||--o{ PAGAMENTOS : "recebe"
    ORCAMENTOS ||--o{ ITENS_ORCAMENTO_SERVICO : "contém"
    ORCAMENTOS ||--o{ ITENS_ORCAMENTO_PECA : "contém"
    CATALOGO_SERVICOS ||--o{ ITENS_ORCAMENTO_SERVICO : "referencia"
    CATALOGO_PECAS ||--o{ ITENS_ORCAMENTO_PECA : "referencia"
    CATALOGO_PECAS ||--o{ ESTOQUE_MOV : "movimenta"
````
````mermaid
classDiagram
    class Usuario {
        +UUID id
        +String username
        -String password_hash
        -String salt
        +autenticar(String senha) bool
    }

    class Cliente {
        +UUID id
        +String cpf
        +String nome
        +String endereco
        +adicionarVeiculo(Veiculo v)
    }

    class Veiculo {
        +UUID id
        +String placa
        +String modelo
        +String fabricante
    }

    class OrdemServico {
        +UUID id
        +Enum status
        +DateTime dataEntrada
        +abrirOS(Usuario atendente)
        +finalizarOS()
    }

    class Orcamento {
        +UUID id
        +Decimal totalPecas
        +Decimal totalMaoObra
        +Boolean aprovado
        +calcularTotal()
    }

    class CatalogoPeca {
        +UUID id
        +String sku
        +int estoque
        +validarDisponibilidade()
    }

    Usuario "1" -- "*" OrdemServico : registra
    Cliente "1" -- "*" Veiculo : proprietario
    Veiculo "1" -- "*" OrdemServico : objeto
    OrdemServico "1" -- "*" Orcamento : possui
    Orcamento "1" -- "*" CatalogoPeca : consome
````
````mermaid
sql
-- 1. Habilitar a extensão para criptografia (caso ainda não tenha feito)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Tabela de Usuários (Funcionários/Mecânicos)
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL, -- Armazena a senha criptografada (Hash)
    salt TEXT NOT NULL,          -- Salt único gerado pelo gen_salt()
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Adicionar relacionamento na Ordem de Serviço (Opcional, mas recomendado)
-- Isso permite saber qual usuário/atendente abriu a OS
ALTER TABLE ordem_servico 
ADD COLUMN usuario_id UUID REFERENCES usuarios(id);

-- 4. Exemplo de como inserir um usuário com HASH e SALT (Bcrypt)
-- O 'bf' no gen_salt indica o uso do algoritmo Blowfish (Bcrypt)
INSERT INTO usuarios (username, email, salt, password_hash)
VALUES (
    'admin_fatesg', 
    'admin@fatesg.edu.br', 
    'bf', -- Referência ao algoritmo
    crypt('senha_segura_123', gen_salt('bf'))
);
