# ads3.n2.oficina
# 🛠️ Sistema de Gestão para Oficinas Mecânicas (AutoManager)

![PostgreSQL](https://shields.io)
![Status](https://shields.io)

## 📌 Sobre o Projeto
O **AutoManager** é uma solução robusta para o gerenciamento operacional e financeiro de oficinas mecânicas e centros automotivos. O projeto nasceu da necessidade de centralizar o fluxo desde a entrada do veículo até o faturamento, garantindo rastreabilidade de peças e histórico de manutenções.

### 🎯 Motivação
Oficinas pequenas e médias frequentemente sofrem com a falta de controle de estoque e orçamentos informais. Este sistema visa:
- Profissionalizar o atendimento ao cliente.
- Evitar perdas financeiras com controle rigoroso de estoque e insumos.
- Gerar histórico de serviços para fidelização e garantia.

---

## 📑 Documentação de Requisitos

### Requisitos Funcionais (RF)
- **RF01:** O sistema deve permitir o cadastro de clientes com múltiplos meios de contato.
- **RF02:** Deve ser possível gerenciar veículos vinculados a um proprietário único.
- **RF03:** O sistema deve permitir a abertura de Ordens de Serviço (OS) com status dinâmicos.
- **RF04:** Deve ser possível criar múltiplos orçamentos para uma mesma OS (opções de peças/marcas).
- **RF05:** O sistema deve baixar automaticamente o estoque ao aprovar um orçamento.
- **RF06:** Deve permitir o registro de pagamentos parciais ou totais vinculados à OS.

### Requisitos Não Funcionais (RNF)
- **RNF01:** Persistência de dados em PostgreSQL.
- **RNF02:** Uso de UUID (Universally Unique Identifier) para todas as chaves primárias, garantindo segurança e escalabilidade.
- **RNF03:** Indexação de campos críticos (CPF, Placa, E-mail) para alta performance em buscas.

---

## 🔄 Fluxo de Caso de Uso (Resumido)
1. **Recepção:** Cliente chega -> Cadastro/Busca de Cliente -> Cadastro de Veículo -> Abertura de OS (Status: Aberta).
2. **Orçamentação:** Mecânico avalia -> Lança Itens (Serviços/Peças) -> Gera Orçamento -> Cliente Aprova.
3. **Execução:** Status da OS muda para 'Em Serviço' -> Movimentação de Estoque efetuada.
4. **Finalização:** OS Finalizada -> Registro de Pagamento -> Entrega do Veículo.

---

## 🏗️ Arquitetura e Modelagem

### 1. Modelo Entidade-Relacionamento (Lógico)
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
