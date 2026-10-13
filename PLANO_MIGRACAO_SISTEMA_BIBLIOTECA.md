# Plano de desenvolvimento e migração — Sistema de Gestão da Biblioteca Municipal

**Versão:** 2.0 — 13/10/2026  
**Objetivo confirmado:** substituir definitivamente a planilha `Gestão da Biblioteca Municipal.ods` por um sistema web de gestão bibliotecária, preservando os registros históricos, após autorização, validação técnica e transição controlada.  
**Forma de desenvolvimento:** Codex Web com repositório GitHub privado; a estação institucional acessará o sistema pelo navegador, sem instalação local.

> **Segurança:** o documento não inclui dados pessoais de leitores. Não adicionar ao GitHub/Codex a planilha original nem extratos contendo CPF, telefone, endereço, nascimento ou histórico individual. Os testes iniciais usarão apenas dados fictícios. A migração real dependerá de autorização institucional e de solução de hospedagem e processamento de dados aprovada pela TI/área responsável, com conformidade à LGPD.

## 1. Contexto e base de referência

O sistema deverá preservar os processos representados nas dez abas atuais:

| Origem na planilha | Destino no sistema |
|---|---|
| DASHBOARD | Indicadores operacionais e atalhos |
| EMPRÉSTIMOS | Circulação: retirada, prazo, situação e itens |
| RENOVAÇÕES | Renovação de empréstimos e histórico de prazos |
| DEVOLUÇÕES | Devolução total/parcial de exemplares e atrasos |
| RESERVA | Reservas, validade e status |
| RELATÓRIOS | Estatísticas, atrasos, circulação e acervo sem movimentação |
| HISTORICO | Histórico consolidado e trilha de auditoria |
| LIVROS | Catálogo, exemplares físicos e localização |
| LEITORES | Cadastro de leitores, minimização de dados e acesso restrito |
| LOGRADOURO, CEP BAIRRO | Apoio opcional ao cadastro de endereços |

### Evidências e cautelas detectadas na análise da planilha

- ~4.869 linhas de títulos no catálogo **não comprovam** 4.869 exemplares distintos com identificação física.
- ~953 linhas com ID de leitor e valores repetidos em alguns IDs: desambiguar antes de importar.
- ~341 registros identificados na aba de empréstimos e ~2.867 no histórico; há códigos de empréstimo repetidos e contagens de dashboard que não conciliam diretamente com essas abas.
- Há operações de empréstimo contendo até três campos de título. A base precisa modelar itens de empréstimo, não apenas três colunas fixas.
- Situações de exemplo: EM ABERTO, EM ATRASO, DEVOLVIDO; reservas usam categorias como RETIRADA/ATRASADA.
- Os exemplos sugerem empréstimos e renovações de 15 dias, mas **a política precisa de confirmação**.
- O campo chamado MULTA nas devoluções pode não representar valor monetário; não codificar cobrança sem validação.
- Alguns registros do acervo são descrições genéricas (ex.: conjunto de livros infantis), impedindo identificação automática de um exemplar específico.
- Indicadores da planilha são resultados de fórmulas, sujeitos a atualização e inconsistências. No novo sistema, calcular indicadores a partir de registros transacionais validados.

## 2. Requisitos para o sistema poder substituir a planilha

1. Autenticação com contas individuais e permissões: operador, gestor e administrador técnico, conforme funções aprovadas.
2. Cadastro, busca e edição de leitores; coletar apenas informações necessárias e restringir campos sensíveis.
3. Catálogo de obras (dados bibliográficos) e **exemplares físicos individualmente identificados** quando possível; situação derivada de circulação, não botão manual genérico.
4. Empréstimo de um ou vários exemplares, vinculado a um leitor, com prazo e regras configuráveis.
5. Devolução total ou por item, com registro de data, responsável e atualização imediata de disponibilidade.
6. Renovação com regras configuráveis, registro do vencimento anterior e do novo; não apagar o histórico anterior.
7. Reservas com validade, cancelamento e fluxo de retirada após definição da política institucional.
8. Consultas de livros em atraso, empréstimos ativos, histórico do leitor, últimas movimentações e relatórios por período.
9. Dashboard operacional, com números reconciliáveis e consultas auditáveis.
10. Exportação autorizada e backups, logs de operação, testes de restauração e mecanismos para correção de erros por pessoas autorizadas.
11. Interface responsiva e acessível no navegador do computador da biblioteca, sem instalação, respeitando políticas de rede.

## 3. Modelo lógico inicial (proposta técnica, a validar)

- `usuarios_sistema(id, perfil, ativo, ...)` — funcionários autenticados, nunca leitores públicos por padrão.
- `leitores(id, id_legado, nome, contato_minimo, ...)` — identificador novo interno e antigo preservado como referência.
- `obras(id, titulo, autor, editora, isbn, genero, ...)` — registros bibliográficos.
- `exemplares(id, obra_id, codigo_patrimonio, localizacao, estado_fisico, ...)` — unidades físicas distintas.
- `emprestimos(id, codigo_legado, leitor_id, realizado_em, vencimento_inicial, criado_por, ...)` — cabeçalho transacional.
- `itens_emprestimo(id, emprestimo_id, exemplar_id, devolvido_em, ...)` — itens emprestados e devoluções por item.
- `renovacoes(id, emprestimo_id, item_id_opcional, ocorrido_em, prazo_anterior, novo_prazo, usuario_id, ...)`.
- `reservas(id, leitor_id, obra_ou_exemplar_id, solicitada_em, expira_em, status, ...)`.
- `eventos_circulacao(id, tipo, ocorrido_em, referencia, executor_id, ...)` — histórico operacional.
- `auditoria(id, ator_id, entidade, operacao, data_hora, alteracao_relevante, ...)` — alterações administrativas.
- `importacao_legado(id, aba_origem, linha_origem, identificador_legado, id_destino, estado_validacao, motivo_pendencia)` — rastreabilidade da migração.

**Regras de integridade prioritárias:** impedir dois empréstimos ativos do mesmo exemplar; não permitir excluir registros com histórico de circulação; evitar renovação inválida; guardar os vencimentos antigos; trabalhar com transações de banco de dados e controle de permissões no servidor; permitir dados incompletos na importação sob status 'pendente de revisão' sem inventar informação.

## 4. Fases de implementação

**Fase 0 — Preparação e autorização.** Identificar responsável institucional pela aprovação e TI; confirmar política de empréstimos, reservas, renovação e dados pessoais; definir quem administrará o sistema e fará os backups; criar repositório privado e protótipo sem dados reais.

**Fase 1 — Protótipo funcional com dados fictícios.** Layout administrativo, navegação, cadastros, buscas e fluxos de circulação simulados; validação com os funcionários da biblioteca.

**Fase 2 — Núcleo com banco de dados e autenticação.** Implementar banco relacional, perfis, acesso restrito, validações no servidor, testes automatizados, transações, registro de auditoria e mecanismo de backup/restauração.

**Fase 3 — Migração assistida.** Em ambiente autorizado, gerar cópia preservada da planilha original; exportar e validar dados; mapear ids; tratar duplicatas e vínculos ambíguos; validar totais; produzir relatório de inconsistências; importar dados reconciliados sem sobrescrever históricos; nunca copiar arquivos sensíveis para repositórios ou ferramentas externas não autorizadas.

**Fase 4 — Operação paralela.** Registrar as atividades no sistema novo e manter a planilha como controle temporário durante período aprovado pela direção; testar diariamente contagens, disponibilidade, pendências, prazos e histórico; corrigir falhas antes da virada.

**Fase 5 — Corte para produção.** Congelar uma versão final da planilha, importar diferença final, documentar quem aprovou, data do corte e procedimento de reversão; confirmar backups e restauração; disponibilizar a aplicação no endereço aprovado para os funcionários; manter cópia histórica da planilha em armazenamento institucional restrito.

**Fase 6 — Suporte e melhoria.** Acompanhar erros, rotinas de backup, atualizações de segurança e demandas reais. Evoluir relatórios e alertas após estabilizar as funções de circulação.

## 5. Checklist mínimo de aceite operacional

- É possível cadastrar e buscar um leitor, respeitando permissões de acesso.
- É possível registrar empréstimos de 1, 2 ou 3 exemplares e impedir empréstimo duplicado de exemplar já indisponível.
- Datas de vencimento respeitam a regra configurada pela biblioteca, inclusive renovação.
- É possível devolver um dos itens e manter os demais emprestados.
- Todos os eventos ficam no histórico com data e operador, mesmo após devolução.
- Reservas não aparecem como empréstimos até a retirada efetiva.
- Dashboard e relatórios conciliam com os registros no banco; atrasos atualizam pela data.
- Contas não autorizadas não acessam nem modificam dados de leitores.
- Backup é gerado e a restauração é testada.
- Registros migrados são reconciliados por aba e pendências da planilha ficam documentadas, sem descarte silencioso de dados.
- O sistema funciona no navegador do computador institucional sob as políticas de rede aprovadas.

## 6. Próxima tarefa no Codex Web (Fase 1)

> Quero desenvolver um **sistema web para substituir definitivamente** a planilha operacional de uma biblioteca municipal, seguindo este plano. O produto será acessado no navegador, pois o computador institucional não permite instalar programas. Trabalhe neste repositório privado, usando **somente dados fictícios**. Primeiro examine o repositório e crie um plano técnico e de telas. Proponha uma stack simples com TypeScript, interface web responsiva e futuro backend/banco relacional. Na proposta, diferencie obras de exemplares, modele itens de empréstimo, devoluções parciais, renovações, reservas, histórico, permissões, auditoria, backup e migração auditável de dados legados. **Não importe dados reais, não invente políticas da biblioteca e não implemente até eu aprovar o plano.** Apresente a primeira entrega pequena que conseguimos revisar e testar pelo navegador.

## 7. Decisões pendentes — perguntar antes de programar regras definitivas

1. **Autorização:** a direção da biblioteca e/ou a TI autorizam o desenvolvimento, a hospedagem externa e o tratamento dos dados pessoais?
2. **Prazo:** o empréstimo padrão dura 15 dias corridos? Qual é a regra exata para renovações, reservas e multas?
3. **Acervo físico:** cada exemplar possui tombo/código de barras/etiqueta? Quando há dois exemplares do mesmo título, como são diferenciados?
4. **Operação:** quantos funcionários usarão simultaneamente o sistema? É preciso acesso fora da biblioteca e operação sem internet?
5. **Histórico:** qual deve ser o período de guarda dos empréstimos e registros pessoais? Quem aprovará a política de retenção?

**Fronteira de segurança:** desenvolver no Codex não é o mesmo que autorizar a utilização da base real da prefeitura na nuvem. A transição só pode ser iniciada com local de hospedagem, contratos/permissões e salvaguardas definidos institucionalmente.
