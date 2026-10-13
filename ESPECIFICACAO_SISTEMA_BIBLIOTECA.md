# Especificação inicial — Sistema Web de Gestão da Biblioteca Municipal

**Base analisada:** `Gestão da Biblioteca Municipal.ods` (arquivo fornecido em 13/10/2026).
**Objetivo:** transformar os processos de controle existentes em uma aplicação web acessível pelo navegador, desenvolvida com Codex Web e versionada no GitHub, sem instalação de software no computador institucional.
**Estado:** diagnóstico inicial; fluxos, regras e campos definitivos dependem de validação com o responsável pela biblioteca.

> **Proteção de dados:** esta especificação não contém nomes, contatos, CPFs ou endereços de leitores. Não publicar nem importar a planilha original para GitHub, Codex, hospedagem ou serviços externos sem autorização formal e definição das medidas de proteção de dados. Usar somente dados fictícios nos protótipos.

## 1. Estrutura identificada no arquivo

| Aba de origem | O que já representa | Módulo sugerido |
|---|---|---|
| DASHBOARD | Contadores e acessos por função | Painel de gestão |
| EMPRÉSTIMOS | Código, data, leitor, até três livros, previsão, data de devolução, status e atraso | Empréstimos |
| RENOVAÇÕES | Código de referência, data da renovação, leitor, novo vencimento e livros | Renovações |
| DEVOLUÇÕES | Referência do empréstimo, leitor, previsão, devolução, dias de atraso e campo denominado “multa” | Devoluções |
| RESERVA | ID, data, leitor, livros, contato, prazo, situação e observações | Reservas |
| RELATÓRIOS | Atrasos, leitores mais ativos, livros parados, utilização do acervo e outras análises | Relatórios |
| HISTORICO | Histórico de empréstimos, livros, previsões, devoluções, renovações e atraso | Histórico / auditoria |
| LIVROS | Título, tombo, ISBN, autor, editora, ano, categoria, localização, situação, última movimentação e quantidade de empréstimos | Acervo |
| LEITORES | ID, nome, nascimento, contato, documento e endereço | Leitores |
| LOGRADOURO, CEP BAIRRO | Base auxiliar de CEP e logradouro | Apoio a cadastros |

### Números observados no arquivo (não são auditoria operacional)

- **4.869 linhas com título** na aba LIVROS; **não** equivalem necessariamente a 4.869 exemplares identificados e únicos.
- **953 registros com ID** na aba LEITORES; há **3 repetições de ID** que precisam ser verificadas.
- **341 registros com código** na aba EMPRÉSTIMOS; **2 repetições de código** foram detectadas.
- **2.867 registros com código** na aba HISTORICO.
- **118 linhas de renovação**, **235 linhas de devolução** e **7 linhas de reserva** com identificadores preenchidos; repetições nas tabelas de eventos podem representar operações legítimas, mas precisam ser verificadas.
- A aba EMPRÉSTIMOS exibe **35 registros com situação “EM ATRASO”** nos resultados salvos no arquivo. Esse número varia conforme datas e atualização dos cálculos.
- O painel exibe **954** para leitores; a fórmula `COUNTA` usada no painel conta também o cabeçalho, enquanto a aba LEITORES apresenta **953 IDs preenchidos**. Validar o cálculo ao migrar.

> As abas incluem milhares de células com fórmulas pré-preenchidas em linhas sem operação cadastrada. Para contar registros, considerar apenas linhas com identificador/base preenchidos e confirmar duplicidades.

## 2. Regras observadas e questões para confirmar

1. **Prazos:** exemplos indicam **15 dias** entre o empréstimo e o vencimento, e frequentemente **15 dias** entre renovação e novo vencimento. Confirmar se é a regra geral, se são dias corridos e se existem exceções.
2. **Situação do empréstimo:** a planilha calcula situações como `EM ABERTO`, `EM ATRASO` e `DEVOLVIDO` com base na data de devolução e no vencimento. A aplicação deve calcular o estado a partir de eventos, evitando divergências.
3. **Livros por empréstimo:** a planilha dispõe de `Livro 1`, `Livro 2` e `Livro 3`. Confirmar limite vigente; no banco, modelar itens de empréstimo separadamente para não limitar estruturalmente a três.
4. **Atraso e multa:** a aba DEVOLUÇÕES contém campos `DIAS ATRASO` e `MULTA` com valores frequentemente iguais; não assumir uma tarifa monetária sem confirmação da política da biblioteca.
5. **Reservas:** aparecem situações como `RETIRADA` e `ATRASADA`. Definir prazos, expiração, fila de espera, cancelamento e conversão em empréstimo.
6. **Catálogo:** a aba LIVROS tem títulos preenchidos, mas campos como tombo, ISBN, autor, editora, categoria e localização aparecem sem preenchimento nos registros analisados. Separar **obra/título** de **exemplar físico** e fazer cadastro progressivo dos exemplares.
7. **Disponibilidade:** os registros de LIVROS aparecem marcados como `Disponível`; essa coluna não comprova disponibilidade física. A disponibilidade deve resultar de empréstimos e reservas por exemplar.
8. **Integridade:** revisar repetições de identificadores, nomes com grafias variadas, datas ausentes e preenchimentos genéricos de títulos antes de importar registros.

## 3. Proposta de MVP (para validação)

### Essencial

- Login com perfis de acesso autorizados (ex.: atendente e administrador).
- Cadastro e busca de leitores (somente campos necessários à operação).
- Cadastro, consulta e pesquisa do acervo; identificação de cada exemplar quando possível.
- Registrar empréstimo vinculando leitor, exemplares, data e vencimento.
- Registrar devolução de um ou vários itens, com atualização automática da disponibilidade.
- Registrar renovação com histórico de alterações do prazo.
- Consultar empréstimos em aberto, vencidos e devolvidos.
- Painel com quantidades consistentes e filtros simples.
- Histórico de alterações e ações por usuário autorizado.

### Etapa seguinte, se necessário

- Reservas e fila de espera com regras definidas.
- Relatórios avançados de circulação, livros sem movimento e leitores ativos.
- Alertas e comunicação aos leitores (somente com base legal, autorização institucional e canal aprovado).
- Assistente de endereços por CEP e importação assistida de dados legados.

## 4. Modelo inicial de dados sugerido

- `usuarios_sistema`: usuários autorizados, perfil e atividade.
- `leitores`: identificador interno, nome e contato mínimo; campos sensíveis sob políticas específicas.
- `obras`: título e metadados bibliográficos opcionais.
- `exemplares`: identificação física, obra, localização e situação operacional.
- `emprestimos`: leitor, data inicial, vencimento original, estado derivado.
- `itens_emprestimo`: relação empréstimo–exemplar, devolução por item quando aplicável.
- `renovacoes`: empréstimo, data de renovação, vencimento anterior e novo vencimento.
- `reservas`: leitor, exemplar ou obra, data, limite e estado.
- `auditoria`: autor, data e tipo de alteração relevante.

**Observação:** nomes e relações são propostas técnicas, não campos confirmados pela planilha. Antes de implementar, decidir se devolução e renovação são por empréstimo inteiro ou por exemplar.

## 5. Desenvolvimento com Codex Web e GitHub

1. Criar um repositório **privado** dedicado ao sistema. Não versionar a planilha original, arquivos de exportação com dados reais nem credenciais.
2. Criar e validar um ambiente do Codex Web com o repositório autorizado.
3. Adicionar esta especificação como `docs/ESPECIFICACAO_SISTEMA_BIBLIOTECA.md`.
4. Solicitar ao Codex **primeiro o plano de arquitetura e o desenho das telas**, sem criar código.
5. Após aprovação, implementar em pequenas entregas via branch e Pull Request: estrutura, autenticação, cadastros, circulação e indicadores.
6. Criar dados fictícios para teste e testes automáticos para prazos, atrasos, duplicações e devolução.
7. Antes do uso real, obter aprovação institucional, revisar segurança, backups, controle de acesso, LGPD e migração de dados.

**Stack candidata, a confirmar:** React + TypeScript na interface, backend e banco relacional gerenciado com autenticação, hospedagem web via HTTPS. Separar ambiente de teste do ambiente de produção.

## 6. Primeira tarefa pronta para o Codex Web

> Leia `docs/ESPECIFICACAO_SISTEMA_BIBLIOTECA.md` e analise o repositório. Quero desenvolver um sistema web de gestão para a biblioteca municipal, baseado nos processos existentes na planilha, usando inicialmente **apenas dados fictícios**. Antes de alterar arquivos, proponha: (1) arquitetura e tecnologias; (2) entidades e relacionamentos; (3) telas e fluxos de empréstimo, renovação e devolução; (4) regras que exigem confirmação; (5) etapas pequenas de implementação e testes; (6) controles de segurança e privacidade. Não presuma política de multa, regras de reserva ou disponibilidade física dos livros. **Não implemente nada até minha aprovação.**
