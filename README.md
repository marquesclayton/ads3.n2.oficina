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
```mermaid
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
```sql
-- ==========================================================
-- PROJETO DIDÁTICO: AUTOMANAGER (FATESG SENAI GO)
-- AUDITORIA COMPLETA: created_by, updated_by, datas
-- ==========================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. TABELA DE USUÁRIOS
-- (Esta é a única que não referencia a si mesma no created_by para evitar recursão infinita no primeiro insert)
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. TABELA DE CLIENTES
CREATE TABLE clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cpf CHAR(11) NOT NULL UNIQUE,
    nome VARCHAR(125) NOT NULL,
    logradouro VARCHAR(125),
    numero VARCHAR(7),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado CHAR(2),
    cep VARCHAR(10),
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES usuarios(id),
    updated_by UUID REFERENCES usuarios(id)
);

-- 3. CONTATOS (Telefones e Emails)
CREATE TABLE contatos_telefonicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    tipo VARCHAR(20),
    numero VARCHAR(50) NOT NULL,
    preferencial BOOLEAN DEFAULT FALSE,
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES usuarios(id)
);

CREATE TABLE contatos_email (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    tipo VARCHAR(20),
    email VARCHAR(255) NOT NULL,
    preferencial BOOLEAN DEFAULT FALSE,
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES usuarios(id)
);

-- 4. VEÍCULOS
CREATE TABLE veiculos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    placa VARCHAR(20) NOT NULL UNIQUE,
    modelo VARCHAR(55),
    fabricante VARCHAR(55),
    ano INTEGER,
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES usuarios(id),
    updated_by UUID REFERENCES usuarios(id)
);

-- 5. ORDEM DE SERVIÇO
CREATE TYPE ordem_status AS ENUM ('aberta','em_servico','aguardando_pecas','finalizada','cancelada');

CREATE TABLE ordem_servico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    veiculo_id UUID NOT NULL REFERENCES veiculos(id) ON DELETE CASCADE,
    data_entrada TIMESTAMPTZ DEFAULT now(),
    data_prevista_saida TIMESTAMPTZ,
    data_entrega TIMESTAMPTZ,
    status ordem_status DEFAULT 'aberta',
    descricao_problema TEXT,
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES usuarios(id), -- Atendente/Mecânico que abriu
    updated_by UUID REFERENCES usuarios(id)  -- Quem alterou o status
);

-- 6. CATÁLOGOS (Serviços e Peças)
CREATE TABLE catalogo_servicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(50) UNIQUE,
    descricao TEXT NOT NULL,
    preco_padrao NUMERIC(12,2),
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES usuarios(id)
);

CREATE TABLE catalogo_pecas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(100) UNIQUE,
    descricao TEXT NOT NULL,
    preco NUMERIC(12,2),
    estoque INTEGER DEFAULT 0,
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES usuarios(id),
    updated_by UUID REFERENCES usuarios(id)
);

-- 7. ORÇAMENTOS
CREATE TABLE orcamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ordem_id UUID NOT NULL REFERENCES ordem_servico(id) ON DELETE CASCADE,
    total NUMERIC(12,2) DEFAULT 0,
    aprovado BOOLEAN DEFAULT FALSE,
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES usuarios(id),
    updated_by UUID REFERENCES usuarios(id)
);

-- 8. ITENS (Pecçs e Serviços)
CREATE TABLE itens_orcamento_servico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    orcamento_id UUID NOT NULL REFERENCES orcamentos(id) ON DELETE CASCADE,
    servico_id UUID NOT NULL REFERENCES catalogo_servicos(id),
    quantidade INTEGER DEFAULT 1,
    preco_unit NUMERIC(12,2),
    subtotal NUMERIC(12,2) GENERATED ALWAYS AS (quantidade * preco_unit) STORED
);

CREATE TABLE itens_orcamento_peca (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    orcamento_id UUID NOT NULL REFERENCES orcamentos(id) ON DELETE CASCADE,
    peca_id UUID NOT NULL REFERENCES catalogo_pecas(id),
    quantidade INTEGER NOT NULL,
    preco_unit NUMERIC(12,2),
    subtotal NUMERIC(12,2) GENERATED ALWAYS AS (quantidade * preco_unit) STORED
);

-- 9. PAGAMENTOS
CREATE TABLE pagamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ordem_id UUID REFERENCES ordem_servico(id),
    valor NUMERIC(12,2) NOT NULL,
    metodo VARCHAR(50),
    data_pagamento TIMESTAMPTZ DEFAULT now(),
    -- Auditoria
    created_by UUID REFERENCES usuarios(id)
);

-- Índices principais
CREATE INDEX idx_clientes_cpf ON clientes(cpf);
CREATE INDEX idx_veiculos_placa ON veiculos(placa);
CREATE INDEX idx_usuarios_email ON usuarios(email);
