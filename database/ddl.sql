-- DDL PostgreSQL - Aplicação acadêmica de oficina mecânica
-- Escopo principal: Cliente, Usuario, Veiculo, Mecanico e Ordem de Serviço.
-- Observação: orçamento e catálogo de peças não são foco desta entrega.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE status_ordem_servico AS ENUM ('aberta', 'em_execucao', 'finalizada', 'cancelada');

CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(120) NOT NULL,
    login VARCHAR(60) NOT NULL UNIQUE,
    email VARCHAR(180) NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    perfil VARCHAR(40) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(120) NOT NULL,
    cpf CHAR(11) NOT NULL UNIQUE,
    telefone VARCHAR(30) NOT NULL,
    email VARCHAR(180),
    criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
    criado_por UUID REFERENCES usuarios(id),
    atualizado_por UUID REFERENCES usuarios(id)
);

CREATE TABLE veiculos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    placa VARCHAR(10) NOT NULL UNIQUE,
    marca VARCHAR(60) NOT NULL,
    modelo VARCHAR(60) NOT NULL,
    ano SMALLINT NOT NULL,
    quilometragem INTEGER,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
    criado_por UUID REFERENCES usuarios(id),
    atualizado_por UUID REFERENCES usuarios(id)
);

CREATE TABLE mecanicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(120) NOT NULL,
    especialidade VARCHAR(100) NOT NULL,
    telefone VARCHAR(30),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
    criado_por UUID REFERENCES usuarios(id),
    atualizado_por UUID REFERENCES usuarios(id)
);

CREATE TABLE ordens_servico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero SERIAL UNIQUE,
    cliente_id UUID NOT NULL REFERENCES clientes(id),
    veiculo_id UUID NOT NULL REFERENCES veiculos(id),
    usuario_responsavel_id UUID NOT NULL REFERENCES usuarios(id),
    mecanico_responsavel_id UUID REFERENCES mecanicos(id),
    status status_ordem_servico NOT NULL DEFAULT 'aberta',
    data_abertura TIMESTAMPTZ NOT NULL DEFAULT now(),
    data_previsao_entrega TIMESTAMPTZ,
    data_finalizacao TIMESTAMPTZ,
    descricao_problema TEXT NOT NULL,
    observacoes TEXT,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
    criado_por UUID REFERENCES usuarios(id),
    atualizado_por UUID REFERENCES usuarios(id)
);

CREATE TABLE ordem_servico_servicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ordem_servico_id UUID NOT NULL REFERENCES ordens_servico(id) ON DELETE CASCADE,
    descricao VARCHAR(255) NOT NULL,
    valor NUMERIC(12, 2) NOT NULL CHECK (valor >= 0),
    tempo_execucao_horas NUMERIC(6, 2) NOT NULL CHECK (tempo_execucao_horas > 0),
    criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ordem_servico_pecas_aplicadas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ordem_servico_id UUID NOT NULL REFERENCES ordens_servico(id) ON DELETE CASCADE,
    descricao VARCHAR(255) NOT NULL,
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    valor_unitario NUMERIC(12, 2) NOT NULL CHECK (valor_unitario >= 0),
    criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_veiculos_cliente ON veiculos(cliente_id);
CREATE INDEX idx_ordens_cliente ON ordens_servico(cliente_id);
CREATE INDEX idx_ordens_veiculo ON ordens_servico(veiculo_id);
CREATE INDEX idx_servicos_ordem ON ordem_servico_servicos(ordem_servico_id);
CREATE INDEX idx_pecas_ordem ON ordem_servico_pecas_aplicadas(ordem_servico_id);
