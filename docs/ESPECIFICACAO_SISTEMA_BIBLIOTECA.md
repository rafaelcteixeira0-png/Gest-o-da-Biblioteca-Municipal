# Especificação inicial — Sistema Web de Gestão da Biblioteca Municipal

**Base de referência informada pelo responsável:** `Gestão da Biblioteca Municipal.ods`, analisada em 13/10/2026. A planilha não foi acessada, importada nem versionada nesta entrega.
**Objetivo:** transformar os processos de controle existentes em uma aplicação web acessível pelo navegador, desenvolvida com Codex Web e versionada no GitHub, sem instalação no computador institucional.
**Estado:** diagnóstico inicial; fluxos, regras e campos definitivos dependem de validação com o responsável pela biblioteca.

Consolidação da [especificação original fornecida](../ESPECIFICACAO_SISTEMA_BIBLIOTECA.md), preservada na raiz do repositório.

> Esta especificação não contém dados pessoais de leitores. Não publicar nem importar a planilha original para GitHub, Codex, hospedagem ou serviços externos sem autorização formal e definição das medidas de proteção de dados. Usar somente dados fictícios nos protótipos.

## 1. Estrutura identificada no arquivo

| Aba de origem          | O que representa                                                                                              | Módulo sugerido            |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------- |
| DASHBOARD              | Contadores e acessos por função                                                                               | Painel de gestão           |
| EMPRÉSTIMOS            | Código, data, leitor, até três livros, previsão, devolução, status e atraso                                   | Empréstimos                |
| RENOVAÇÕES             | Referência, data da renovação, leitor, novo vencimento e livros                                               | Renovações                 |
| DEVOLUÇÕES             | Referência do empréstimo, leitor, previsão, devolução, atraso e campo denominado “multa”                      | Devoluções                 |
| RESERVA                | ID, data, leitor, livros, contato, prazo, situação e observações                                              | Reservas                   |
| RELATÓRIOS             | Atrasos, leitores ativos, livros parados, utilização do acervo                                                | Relatórios                 |
| HISTORICO              | Histórico de empréstimos, devoluções, renovações e atraso                                                     | Histórico / auditoria      |
| LIVROS                 | Título, tombo, ISBN, autor, editora, ano, categoria, localização, situação, última movimentação e empréstimos | Acervo                     |
| LEITORES               | ID, nome, nascimento, contato, documento e endereço                                                           | Leitores                   |
| LOGRADOURO, CEP BAIRRO | Base auxiliar de CEP e logradouro                                                                             | Apoio opcional a cadastros |

### Números observados no diagnóstico fornecido

Estes números não são uma auditoria operacional e **não são os dados do protótipo**:

- 4.869 linhas com título em LIVROS: não comprovam exemplares físicos únicos.
- 953 registros com ID em LEITORES, com 3 repetições de ID a verificar.
- 341 registros com código em EMPRÉSTIMOS, com 2 repetições a verificar.
- 2.867 registros com código em HISTORICO.
- 118 linhas de renovação, 235 de devolução e 7 de reserva com identificadores; repetições em eventos podem ser legítimas.
- 35 empréstimos com situação “EM ATRASO” nos resultados salvos da planilha; o valor varia com datas e recálculo.
- O painel conta 954 leitores porque `COUNTA` inclui o cabeçalho; a aba contém 953 IDs preenchidos. Validar o cálculo na migração.

As abas têm fórmulas pré-preenchidas em milhares de linhas sem operação. Contar somente registros com identificador/base preenchidos e verificar duplicidades.

## 2. Regras observadas e questões a confirmar

1. **Prazos:** os exemplos sugerem 15 dias para empréstimo e renovação. Confirmar regra geral, dias corridos e exceções; não fixar essa política no sistema.
2. **Situação:** EM ABERTO, EM ATRASO e DEVOLVIDO devem resultar dos eventos e das datas, evitando divergências entre painéis e consultas.
3. **Itens:** a planilha tem Livro 1, Livro 2 e Livro 3. Confirmar limite vigente e modelar itens separadamente, sem limite estrutural de três colunas.
4. **Atraso e multa:** valores de DIAS ATRASO e MULTA frequentemente coincidem. Não assumir tarifa monetária ou cobrança.
5. **Reservas:** definir prazo, expiração, fila, cancelamento, retirada e conversão em empréstimo.
6. **Catálogo:** completar progressivamente metadados e identificação física. Separar obra/título de exemplar.
7. **Disponibilidade:** a marcação “Disponível” na planilha não comprova presença física. Derivar a situação de circulação por exemplar conforme a política validada.
8. **Integridade:** revisar IDs repetidos, grafias, datas ausentes e títulos genéricos antes de importar.

## 3. Proposta de MVP para validação

### Essencial

- Login com contas individuais e perfis autorizados.
- Cadastro e busca de leitores com somente os campos necessários.
- Catálogo e exemplares físicos individualmente identificados quando possível.
- Empréstimo com leitor, itens, data e vencimento.
- Devolução total ou parcial e atualização de disponibilidade.
- Renovação com preservação dos prazos anteriores.
- Consultas de empréstimos em aberto, em atraso e devolvidos.
- Painel com quantidades conciliáveis e filtros.
- Histórico e auditoria com autor e data.

### Evoluções possíveis

- Reservas e fila de espera após a definição da política.
- Relatórios avançados de circulação, acervo sem movimento e leitores ativos.
- Alertas aos leitores somente com base legal, autorização e canal institucional aprovado.
- Apoio por CEP e importação assistida dos registros legados.

## 4. Modelo inicial de dados sugerido

| Entidade           | Responsabilidade                                              |
| ------------------ | ------------------------------------------------------------- |
| `usuarios_sistema` | Contas autorizadas, perfil e atividade                        |
| `leitores`         | Identificador interno e dados mínimos sob políticas de acesso |
| `obras`            | Título e metadados bibliográficos                             |
| `exemplares`       | Unidade física, obra, identificação e localização             |
| `emprestimos`      | Leitor, retirada e vencimento inicial                         |
| `itens_emprestimo` | Exemplar e devolução por item                                 |
| `renovacoes`       | Evento, prazo anterior e novo prazo                           |
| `reservas`         | Obra ou exemplar, leitor, datas e situação                    |
| `auditoria`        | Autor, momento e alteração relevante                          |

As entidades e relações são propostas, não campos confirmados da planilha. Definir se renovação e devolução operam por empréstimo ou por exemplar. O estado do empréstimo deve ser derivado.

## 5. Desenvolvimento e privacidade

1. Repositório privado dedicado; não versionar a planilha, extratos ou credenciais.
2. Ambiente Codex com repositório autorizado.
3. Arquitetura e telas documentadas antes das regras definitivas.
4. Entregas pequenas por branch e Pull Request: interface, autenticação, cadastros, circulação e indicadores.
5. Dados fictícios e testes de prazos, atrasos, duplicações e devolução quando os fluxos forem implementados.
6. Antes do uso real: aprovação institucional, revisão de segurança, acesso, backups, LGPD e migração.

Stack inicial: React + TypeScript na interface. Backend, autenticação e banco relacional gerenciado serão definidos em outra fase. Separar homologação e produção, com acesso HTTPS.

## 6. Escopo autorizado da primeira entrega

A solicitação atual autoriza **criar o projeto React + TypeScript e a página inicial**, com os nove itens do menu, indicadores fictícios, layout profissional azul/branco/cinza e responsividade, executar verificações e preparar as alterações para revisão no GitHub.

Os pedidos anteriores de aprovação do plano permanecem como referência para etapas seguintes. Esta entrega implementa o protótipo visual solicitado; regras institucionais, backend, banco, autenticação e migração real permanecem pendentes. Consulte [a arquitetura](ARQUITETURA.md) e [o plano de desenvolvimento e migração](PLANO_DESENVOLVIMENTO_MIGRACAO.md).
