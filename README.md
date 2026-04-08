# 🛠️ Sistema de Gestão para Oficinas Mecânicas (AutoManager)
### 🎓 Projeto Didático - Faculdade de Tecnologia Senai Fatesg

![PostgreSQL](https://shields.io)
![Academic](https://shields.io)

## 📌 Sobre o Projeto
O **AutoManager** é um sistema desenvolvido como material de estudo para a turma de **Análise e Desenvolvimento de Sistemas (ADS3)** da **Fatesg Senai GO**. O objetivo é aplicar conceitos de modelagem de dados, integridade referencial, tipos complexos (ENUM) e identificadores únicos (UUID) em um cenário real de oficina mecânica.

### 🎯 Motivação e Objetivos Acadêmicos
- **Modelagem Relacional:** Implementação de relacionamentos 1:N e N:M.
- **Tipagem Avançada:** Uso de extensões (`pgcrypto`), `TIMESTAMPTZ` e campos gerados (`GENERATED ALWAYS`).
- **Padrões de Identificação:** Substituição de PKs sequenciais por UUIDs para segurança e distribuição de dados.
- **Documentação Técnica:** Prática de escrita de requisitos e diagramação (Mermaid).

---

## 📑 Requisitos do Sistema

### Requisitos Funcionais (RF)
- **RF01:** Cadastrar clientes e seus múltiplos contatos (telefones e e-mails).
- **RF02:** Registrar veículos vinculados a clientes com validação de placa única.
- **RF03:** Gerenciar Ordens de Serviço (OS) com estados: `aberta`, `em_servico`, `aguardando_pecas`, `finalizada` e `cancelada`.
- **RF04:** Elaborar orçamentos detalhando separadamente Mão de Obra (Serviços) e Peças.
- **RF05:** Controle de Estoque com alertas de nível baixo e registro histórico de movimentações.
- **RF06:** Registro de pagamentos associados à OS ou Orçamentos.

---

## 🏗️ Arquitetura e Modelagem

### 1. Diagrama Entidade-Relacionamento (DER - Lógico)
```mermaid
erDiagram
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
    class Cliente {
        +UUID id
        +String cpf
        +String nome
        +String enderecoCompleto
        +adicionarContato()
        +listarVeiculos()
    }

    class Veiculo {
        +UUID id
        +String placa
        +String modelo
        +String fabricante
        +int ano
        +registrarManutencao()
    }

    class OrdemServico {
        +UUID id
        +DateTime dataEntrada
        +Enum status
        +String descricaoProblema
        +atualizarStatus(novoStatus)
        +gerarOrcamento()
    }

    class Orcamento {
        +UUID id
        +Decimal totalPecas
        +Decimal totalMaoObra
        +Decimal totalGeral
        +Boolean aprovado
        +calcularTotais()
        +aprovar()
    }

    class ItemOrcamentoPeca {
        +UUID id
        +int quantidade
        +Decimal precoUnitario
        +Decimal subtotal
    }

    class CatalogoPeca {
        +UUID id
        +String sku
        +String descricao
        +int estoqueAtual
        +alertarEstoqueBaixo()
    }

    class Pagamento {
        +UUID id
        +Decimal valor
        +String metodo
        +DateTime dataPagamento
    }

    Cliente "1" -- "*" Veiculo : proprietário
    Veiculo "1" -- "*" OrdemServico : objeto_servico
    OrdemServico "1" -- "*" Orcamento : propostas
    Orcamento "1" -- "*" ItemOrcamentoPeca : compõe
    ItemOrcamentoPeca "*" -- "1" CatalogoPeca : referencia
    OrdemServico "1" -- "*" Pagamento : liquidação

